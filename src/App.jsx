import { useEffect, useMemo, useState } from "react";
import axios from "axios";

// Paleta y helpers (sin tocar estilos existentes)
const VERDE = "#22d500";
const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

// Intenta cargar ícono SVG si existe en /public/icons
function CropIcon({ icon, nombre }) {
  const src = icon ? `/icons/${icon}` : "/icons/strawberry.svg";
  // Si no existiera el archivo, el onError evita romper el layout
  const [ok, setOk] = useState(true);
  return (
    <img
      src={ok ? src : "/icons/strawberry.svg"}
      onError={() => setOk(false)}
      alt={nombre}
      className="w-16 h-16 md:w-20 md:h-20"
      style={{ filter: `brightness(0) saturate(100%) invert(44%) sepia(90%) saturate(5717%) hue-rotate(77deg) brightness(99%) contrast(105%)` }}
    />
  );
}

export default function App() {
  const [mes, setMes] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [clima, setClima] = useState(null);
  const [cultivos, setCultivos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState("");

  // Cargar datos desde /public/data/huerta.json
  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        setLoadingData(true);
        const res = await fetch("/data/huerta.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (vivo) setCultivos(Array.isArray(data) ? data : []);
      } catch (e) {
        setErrorData("No se pudieron cargar los datos de la huerta.");
        console.error("huerta.json error:", e);
      } finally {
        if (vivo) setLoadingData(false);
      }
    })();
    return () => { vivo = false; };
  }, []);

  // Clima (OpenWeather)
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_KEY || "b4b3582ab5dabfc13d1e93f160ab1d3a"}&lang=es`
        );
        setClima(res.data);
      } catch (error) {
        console.error("Error al obtener el clima:", error);
      }
    });
  }, []);

  // Mes actual por defecto para el placeholder
  const mesActual = useMemo(() => {
    const idx = new Date().getMonth();
    return MESES[idx];
  }, []);

  // Filtrado por mes y búsqueda
  const cultivosFiltrados = useMemo(() => {
    const mesElegido = mes ? cap(mes) : "";
    return cultivos.filter((c) => {
      const coincideMes =
        !mesElegido ||
        (Array.isArray(c.mesesSiembra) && (c.mesesSiembra.includes(mesElegido) || c.mesesSiembra.includes("Todo el año")));
      const coincideNombre = c.nombre?.toLowerCase().includes(busqueda.toLowerCase());
      return coincideMes && coincideNombre;
    });
  }, [cultivos, mes, busqueda]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-6" style={{ color: VERDE }}>
        Calendario de Siembra y Cosecha
      </h1>

      <p className="text-center mb-4">
        Consultá qué sembrar y cuándo cosechar según tu ubicación y época del año.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder={`Mes (ej. ${mesActual})`}
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/2"
        />
        <input
          type="text"
          placeholder="Buscar cultivo (ej. Tomate)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/2"
        />
      </div>

      {clima && (
        <div className="text-center mb-6 border rounded p-3">
          Clima actual en <strong>{clima.name}</strong>: {clima.weather?.[0]?.description}, {Math.round(clima.main?.temp)}°C
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Podés sembrar:</h2>

      {loadingData && <p>Cargando cultivos…</p>}
      {errorData && <p className="text-red-600">{errorData}</p>}
      {!loadingData && !errorData && cultivosFiltrados.length === 0 && (
        <p>No encontramos cultivos para ese filtro.</p>
      )}

      {cultivosFiltrados.map((c) => (
        <div
          key={c.nombre}
          className="border rounded p-3 mb-3 shadow hover:shadow-md transition flex gap-4 items-start"
        >
          <div className="shrink-0">
            <CropIcon icon={c.icon} nombre={c.nombre} />
          </div>

          <div className="grow">
            <h3 className="text-lg font-bold" style={{ color: VERDE }}>
              {c.nombre}
            </h3>

            <p>🌱 <strong>Siembra:</strong> {Array.isArray(c.mesesSiembra) ? c.mesesSiembra.join(", ") : c.mesesSiembra}</p>
            {c.mesesCosecha && (
              <p>🌾 <strong>Cosecha estimada:</strong> {Array.isArray(c.mesesCosecha) ? c.mesesCosecha.join(", ") : c.mesesCosecha}</p>
            )}
            {c.diasACosecha && (
              <p>⏱️ <strong>Días a cosecha:</strong> {Array.isArray(c.diasACosecha) ? `${c.diasACosecha[0]}–${c.diasACosecha[1]} días` : `${c.diasACosecha} días`}</p>
            )}
            <p>☀️ <strong>Sol/Sombra:</strong> {c.toleraSombra ? "Tolera sombra" : "Pleno sol"}</p>
            {c.ubicacion && <p>📍 <strong>Ubicación:</strong> {c.ubicacion}</p>}
            {(c.distanciaPlantasCm || c.distanciaLineasCm) && (
              <p>
                📏 <strong>Distancias:</strong>{" "}
                {c.distanciaPlantasCm ? `Plantas ${c.distanciaPlantasCm[0]}–${c.distanciaPlantasCm[1]} cm` : ""}
                {c.distanciaPlantasCm && c.distanciaLineasCm ? " · " : ""}
                {c.distanciaLineasCm ? `Líneas ${c.distanciaLineasCm[0]}–${c.distanciaLineasCm[1]} cm` : ""}
              </p>
            )}
            {c.comoCosechar && <p>🧺 <strong>Cómo cosechar:</strong> {c.comoCosechar}</p>}
            {c.recomendacionCosecha && <p>✅ <strong>Recomendación:</strong> {c.recomendacionCosecha}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
