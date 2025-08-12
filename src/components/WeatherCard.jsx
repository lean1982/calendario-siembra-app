/**
 * WeatherCard.jsx
 * Reemplaza SOLO los íconos por versiones lineales verdes.
 * No cambia el layout: título, temperatura, descripción y lista de próximos días.
 */
import React from "react";
import WeatherIcon from "./WeatherIcon";

export default function WeatherCard({ city, current, forecast, loading, error }) {
  if (loading) {
    return (
      <div className="border rounded p-3 shadow-sm">
        <p className="text-sm text-gray-600">Cargando clima…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="border rounded p-3 shadow-sm">
        <p className="text-sm text-red-600">No pudimos obtener el clima.</p>
      </div>
    );
  }
  if (!current) return null;

  const now = current;
  const primary = now.weather && now.weather[0] ? now.weather[0] : null;
  const temp = now.main ? Math.round(now.main.temp) : null;
  const desc = primary ? (primary.description || primary.main) : "";

  // Tomamos hasta 5 items del pronóstico (si existe)
  const items = (forecast && forecast.list ? forecast.list : [])
    .slice(0, 5)
    .map((it) => ({
      dt: it.dt,
      temp: Math.round(it.main?.temp ?? it.temp?.day ?? 0),
      w: it.weather ? it.weather[0] : null
    }));

  function formatHour(ts) {
    try {
      const d = new Date((ts || 0) * 1000);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  }

  return (
    <div className="border rounded p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Clima</p>
          <h3 className="text-base font-semibold">{city || "Mi ubicación"}</h3>
        </div>
        <WeatherIcon ow={primary} size={40} />
      </div>

      <div className="flex items-end gap-3 mb-2">
        <span className="text-3xl font-bold">{temp != null ? `${temp}°C` : "--"}</span>
        <span className="text-gray-600">{desc}</span>
      </div>

      {items.length > 0 && (
        <ul className="mt-3 grid grid-cols-5 gap-2 text-center">
          {items.map((it, idx) => (
            <li key={idx} className="bg-gray-50 rounded p-2">
              <WeatherIcon ow={it.w} size={22} className="mx-auto mb-1" />
              <div className="text-xs text-gray-600">{formatHour(it.dt)}</div>
              <div className="text-sm font-medium">{`${it.temp}°`}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}