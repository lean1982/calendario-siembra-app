import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import CropCard from "./components/CropCard";

export default function App() {
  const [mes, setMes] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [clima, setClima] = useState(null);
  const [cultivos, setCultivos] = useState([]);

  useEffect(() => {
    fetch("/data/huerta.json")
      .then(r => r.json())
      .then(setCultivos)
      .catch(() => setCultivos([]));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_KEY}&lang=es`
          );
          setClima(res.data);
        } catch {}
      });
    }
  }, []);

  const cultivosFiltrados = useMemo(() => {
    const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
    return (cultivos || []).filter(c => {
      const coincideMes =
        !mes ||
        (Array.isArray(c.months)
          ? c.months.some(m => m.includes(cap(mes)))
          : (c.months || "").includes(cap(mes)));
      const coincideNombre = (c.name || "").toLowerCase().includes(busqueda.toLowerCase());
      return coincideMes && coincideNombre;
    });
  }, [cultivos, mes, busqueda]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-green-700 my-6">
        Calendario de Siembra y Cosecha
      </h1>

      <p className="text-center mb-4">
        Consultá qué sembrar y cuándo cosechar según tu ubicación y época del año.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Mes"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="border px-2 py-1 rounded w-1/2"
        />
        <input
          type="text"
          placeholder="Buscar"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-2 py-1 rounded w-1/2"
        />
      </div>

      {clima && (
        <p className="text-center mb-4">
          Clima actual en <strong>{clima.name}</strong>: {clima.weather[0].description}, {clima.main.temp}°C
        </p>
      )}

      <h2 className="text-xl font-semibold mb-2">Podés sembrar:</h2>
      {cultivosFiltrados.map((c) => <CropCard key={c.name} c={c} />)}
    </div>
  );
}
