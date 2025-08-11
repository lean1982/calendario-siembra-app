// src/App.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { searchCrops } from "./services/openfarm";

// UI helper
function capitalizar(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ""; }

export default function App() {
  const [clima, setClima] = useState(null);
  const [ciudad, setCiudad] = useState("");
  const [mes, setMes] = useState(""); // lo conservamos por diseño (a futuro lo usaremos para filtrar guías cuando sumemos esa parte)

  // OpenFarm (data real)
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  // Cargar clima por geolocalización (como antes)
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_KEY}&lang=es`
        );
        setClima(res.data);
      } catch (e) {
        // silencio: UI no se rompe si no hay clima
      }
    });
  }, []);

  async function handleBuscarOpenFarm(e) {
    e?.preventDefault?.();
    if (!query.trim()) return;
    try {
      setLoading(true);
      setError("");
      const data = await searchCrops(query);
      setItems(data);
    } catch (e) {
      setError(e?.message || "Error de red");
    } finally {
      setLoading(false);
    }
  }

  async function buscarPorCiudad(e) {
    e?.preventDefault?.();
    if (!ciudad.trim()) return;
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad.trim())}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_KEY}&lang=es`
      );
      setClima(res.data);
    } catch (e) {}
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-green-700 my-6">
        Calendario de Siembra y Cosecha
      </h1>
      <p className="text-center mb-4">
        Consultá qué sembrar y cuándo cosechar según tu ubicación y época del año.
      </p>

      {/* Filtros superiores (mantenemos diseño) */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Mes"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="border px-2 py-1 rounded w-1/2"
        />
        <form onSubmit={buscarPorCiudad} className="flex gap-2 w-1/2">
          <input
            type="text"
            placeholder="Ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <button className="bg-green-600 text-white px-3 rounded">OK</button>
        </form>
      </div>

      {clima && (
        <p className="text-center mb-6">
          Clima actual en <strong>{clima.name}</strong>:{" "}
          {clima.weather?.[0]?.description}, {Math.round(clima.main?.temp)}°C
        </p>
      )}

      {/* Bloque OpenFarm integrado (reemplaza la lista fija) */}
      <form onSubmit={handleBuscarOpenFarm} className="mb-4">
        <label className="block text-sm mb-2">Buscar cultivos (OpenFarm)</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ej: strawberry, tomato, potato..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <button className="bg-green-600 text-white px-4 py-1 rounded">Buscar</button>
        </div>
        {loading && <p className="text-sm text-gray-500 mt-2">Buscando…</p>}
        {error && <p className="text-sm text-red-600 mt-2">No pudimos buscar en OpenFarm. {error}</p>}
      </form>

      {items.length > 0 && <h2 className="text-xl font-semibold mb-2">Resultados</h2>}

      {items.map((c) => (
        <div key={c.id} className="border rounded p-3 mb-2 shadow hover:shadow-md transition">
          <h3 className="text-lg font-bold text-green-700">{c.name}</h3>
          {c.binomial && <p className="text-sm italic text-gray-500">{c.binomial}</p>}
          {c.description && <p className="text-sm text-gray-700 mt-1">{c.description}</p>}
        </div>
      ))}

      {items.length === 0 && !loading && !error && (
        <p className="text-sm text-gray-600">Escribí un cultivo (en inglés funciona mejor) y apretá “Buscar”.</p>
      )}
    </div>
  );
}
