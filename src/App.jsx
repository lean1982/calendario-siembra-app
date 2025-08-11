// src/App.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { fetchCropsAuto } from "./services/openfarm";

const diasCortos = ["L", "M", "M", "J", "V", "S", "D"];

function SunIcon({ className = "w-16 h-16" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l1.41-1.41M4.93 19.07l1.41-1.41" />
    </svg>
  );
}
function CloudIcon({ className = "w-16 h-16" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.31-2A4.5 4.5 0 0 0 7 18Z" />
    </svg>
  );
}
function RainIcon({ className = "w-16 h-16" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 16h10a4 4 0 0 0 0-8 6 6 0 0 0-11.31-2A4.5 4.5 0 0 0 7 16Z" />
      <path d="M8 20l.5-1M12 21l.5-1M16 20l.5-1" />
    </svg>
  );
}

function getIcon(main) {
  const m = (main || "").toLowerCase();
  if (m.includes("rain")) return RainIcon;
  if (m.includes("cloud")) return CloudIcon;
  return SunIcon;
}
function capitalizar(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ""; }

export default function App() {
  const [mes, setMes] = useState("");
  const [ciudad, setCiudad] = useState("");

  const [clima, setClima] = useState(null);
  const [loadingClima, setLoadingClima] = useState(false);
  const [errorClima, setErrorClima] = useState("");
  const [geoError, setGeoError] = useState("");
  const [pidiendoGeo, setPidiendoGeo] = useState(false);

  // Datos reales desde OpenFarm
  const [items, setItems] = useState([]);
  const [loadingOF, setLoadingOF] = useState(false);
  const [errorOF, setErrorOF] = useState("");

  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

  const fetchClima = useCallback(async ({ lat, lon, q }) => {
    if (!apiKey) {
      setErrorClima("Falta la clave de OpenWeather. Revisá VITE_OPENWEATHER_KEY.");
      return;
    }
    try {
      setLoadingClima(true);
      setErrorClima("");
      const base = "https://api.openweathermap.org/data/2.5/weather";
      const params = q
        ? `?q=${encodeURIComponent(q)}&units=metric&appid=${apiKey}&lang=es`
        : `?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=es`;
      const { data } = await axios.get(base + params);
      setClima(data);
    } catch (err) {
      setErrorClima("No pudimos obtener el clima. Probá otra ciudad.");
    } finally {
      setLoadingClima(false);
    }
  }, [apiKey]);

  const pedirUbicacion = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGeoError("Tu navegador no soporta geolocalización.");
      return;
    }
    setPidiendoGeo(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await fetchClima({ lat: latitude, lon: longitude });
        setPidiendoGeo(false);
      },
      (err) => {
        if (err.code === 1) setGeoError("Permiso de ubicación denegado. Activá el permiso del navegador.");
        else if (err.code === 2) setGeoError("No se pudo obtener tu ubicación (señal/servicio). Probá de nuevo.");
        else setGeoError("Error al obtener la ubicación. Probá de nuevo.");
        setPidiendoGeo(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }, [fetchClima]);

  // Cargar clima por geolocalización al iniciar
  useEffect(() => { pedirUbicacion(); }, [pedirUbicacion]);

  async function buscarPorCiudad(e) {
    e?.preventDefault?.();
    if (!ciudad.trim()) return;
    await fetchClima({ q: ciudad.trim() });
  }

  // Cargar datos REALES de OpenFarm al iniciar (sin buscador)
  useEffect(() => {
    (async () => {
      try {
        setLoadingOF(true);
        setErrorOF("");
        // Usamos un término amplio para obtener una lista variada.
        const data = await fetchCropsAuto("a");
        setItems(data);
      } catch (e) {
        setErrorOF(e?.message || "Error de red");
      } finally {
        setLoadingOF(false);
      }
    })();
  }, []);

  const IconoClima = getIcon(clima?.weather?.[0]?.main);
  const descripcion = clima?.weather?.[0]?.description;
  const temp = clima?.main?.temp?.toFixed?.(0);

  // Filtro por "mes" solo a nivel visual por ahora (no modif. datos OpenFarm)
  const itemsFiltrados = useMemo(() => items, [items]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto w/full max-w-screen-md px-5 py-8 md:py-12">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-green-500 leading-tight">
            Calendario de siembra y cosecha
          </h1>
          <p className="text-gray-600 mt-2 md:w-3/4">
            Consultá qué sembrar y cuándo cosechar según tu ubicación y época del año.
          </p>
        </header>

        {/* Filtros superiores (mantenemos UI aprobada) */}
        <form onSubmit={buscarPorCiudad} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Mes</label>
            <input
              type="text"
              placeholder="Ej: Agosto"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Ubicación</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ciudad (si no querés usar GPS)"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-2xl border border-gray-300 px-4 py-3 hover:shadow transition"
                title="Buscar clima por ciudad"
              >
                Buscar
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={pedirUbicacion}
                className="mt-2 rounded-2xl border border-gray-300 px-4 py-2 hover:shadow transition"
                disabled={pidiendoGeo}
              >
                {pidiendoGeo ? "Obteniendo ubicación..." : "Usar mi ubicación"}
              </button>
              {geoError && <span className="text-sm text-amber-600">{geoError}</span>}
            </div>
          </div>
        </form>

        {/* Tarjeta clima (igual que aprobado) */}
        <section className="mb-8">
          <div className="rounded-2xl border border-gray-300 p-5 md:p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-lg font-semibold text-gray-800">
                  {clima?.name || (loadingClima ? "Cargando..." : "—")}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-green-500 text-5xl md:text-6xl leading-none">
                    {loadingClima ? "…" : (temp ?? "—")}°
                  </span>
                  <span className="text-gray-600">{capitalizar(descripcion) || (!loadingClima && "—")}</span>
                </div>
              </div>
              <div className="text-green-500">
                <IconoClima className="w-20 h-20 md:w-24 md:h-24" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-2 text-green-500">
              {diasCortos.map((d, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 py-2">
                  <IconoClima className="w-6 h-6" />
                  <span className="text-xs text-gray-600">{d}</span>
                </div>
              ))}
            </div>

            {errorClima && <p className="mt-3 text-sm text-red-600">{errorClima}</p>}
          </div>
        </section>

        {/* Lista real de OpenFarm */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Cultivos (OpenFarm)</h2>

          {loadingOF && <p className="text-sm text-gray-600 mb-3">Cargando cultivos…</p>}
          {errorOF && <p className="text-sm text-red-600 mb-3">OpenFarm: {errorOF}</p>}

          <div className="flex flex-col gap-5">
            {itemsFiltrados.map((c) => (
              <article key={c.id} className="flex items-start gap-4 md:gap-6">
                {/* Imagen si existe */}
                <div className="shrink-0 rounded-2xl overflow-hidden border border-gray-200 w-16 h-16 md:w-20 md:h-20 bg-gray-50 flex items-center justify-center">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-[#22d500] text-sm px-2 text-center">Sin imagen</div>
                  )}
                </div>

                {/* Texto */}
                <div className="pt-1">
                  <h3 className="text-2xl text-green-500 font-semibold">{c.name}</h3>
                  {c.binomial && <p className="text-gray-500 italic">{c.binomial}</p>}
                  {c.description && <p className="text-gray-500 mt-1">{c.description}</p>}
                </div>
              </article>
            ))}
          </div>

          {!loadingOF && !errorOF && itemsFiltrados.length === 0 && (
            <p className="text-sm text-gray-600">No encontramos cultivos por ahora. Probá recargar.</p>
          )}
        </section>
      </div>
    </div>
  );
}
