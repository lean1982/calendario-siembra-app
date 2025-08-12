/**
 * WeatherIcon.jsx
 * Iconos de clima: simples, de línea, color verde #22d500.
 * Uso: <WeatherIcon ow={weather[0]} size={56} className="mx-auto" />
 *      <WeatherIcon condition="rain" size={20} />
 */
import React from "react";

const BRAND_GREEN = "#22d500";

function normalizeToKey(input) {
  if (!input) return "clouds";
  // Si viene como string
  if (typeof input === "string") {
    const s = input.toLowerCase();
    if (/\b(clear|despejado|soleado|sunny)\b/.test(s)) return "clear";
    if (/\b(partly|few|algo|parcial|intervalos)\b/.test(s)) return "partly";
    if (/\b(cloud|nube|nubos)\b/.test(s)) return "clouds";
    if (/\b(thunder|tormenta|eléctrica|electrica)\b/.test(s)) return "thunderstorm";
    if (/\b(drizzle|llovizna)\b/.test(s)) return "drizzle";
    if (/\b(rain|lluvia|chaparron|chubasc)\b/.test(s)) return "rain";
    if (/\b(snow|nieve|nevada)\b/.test(s)) return "snow";
    if (/\b(mist|fog|niebla|bruma)\b/.test(s)) return "mist";
    if (/\b(wind|viento)\b/.test(s)) return "wind";
    return "clouds";
  }
  // Si viene como objeto OpenWeather { id, main, description }
  const { id, main, description } = input;
  const d = `${main || ""} ${description || ""}`.toLowerCase();
  if (id != null) {
    if (id >= 200 && id < 300) return "thunderstorm";
    if (id >= 300 && id < 400) return "drizzle";
    if (id >= 500 && id < 600) return "rain";
    if (id >= 600 && id < 700) return "snow";
    if (id >= 700 && id < 800) {
      // 701 Mist, 711 Smoke, 721 Haze, 731 Dust, 741 Fog, 751 Sand, 761 Dust, 762 Ash, 771 Squall, 781 Tornado
      if (id === 771) return "wind";
      return "mist";
    }
    if (id === 800) return "clear";
    if (id > 800) {
      // 801 few, 802 scattered, 803 broken, 804 overcast
      if (id === 801) return "partly";
      return "clouds";
    }
  }
  return normalizeToKey(d);
}

function Sun({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" stroke={BRAND_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Despejado">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
    </svg>
  );
}

function Cloud({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" stroke={BRAND_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Nubes">
      <path d="M17 18H7a4 4 0 1 1 1-7.874A5.5 5.5 0 0 1 18.5 9a4.5 4.5 0 0 1-1.5 9z"/>
    </svg>
  );
}

function CloudSun({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" stroke={BRAND_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Parcialmente nublado">
      <circle cx="5" cy="6" r="3"/>
      <path d="M5 1v2M5 9v2M1.5 6H3.5M6.5 6H8.5M3 3l1 1M3 9l1-1M7 3L6 4M7 9L6 8"/>
      <path d="M17 18H7a4 4 0 1 1 1-7.874A5.5 5.5 0 0 1 18.5 9a4.5 4.5 0 0 1-1.5 9z"/>
    </svg>
  );
}

function CloudRain({ size, drops = 3 }) {
  const lines = Array.from({ length: drops }).map((_, i) => {
    const x = 8 + i * 3;
    return <path key={i} d={`M${x} 19l-1 2`} />;
  });
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" stroke={BRAND_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Lluvia">
      <path d="M17 16H7a4 4 0 1 1 1-7.874A5.5 5.5 0 0 1 18.5 7a4.5 4.5 0 0 1-1.5 9z"/>
      {lines}
    </svg>
  );
}

function CloudDrizzle({ size }) {
  return <CloudRain size={size} drops={2} />;
}

function CloudSnow({ size }) {
  const flakes = [8, 11, 14].map((x, i) => (
    <path key={i} d={`M${x} 19v2M${x-1} 20h2`} />
  ));
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" stroke={BRAND_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Nieve">
      <path d="M17 16H7a4 4 0 1 1 1-7.874A5.5 5.5 0 0 1 18.5 7a4.5 4.5 0 0 1-1.5 9z"/>
      {flakes}
    </svg>
  );
}

function CloudLightning({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" stroke={BRAND_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Tormenta">
      <path d="M17 16H7a4 4 0 1 1 1-7.874A5.5 5.5 0 0 1 18.5 7a4.5 4.5 0 0 1-1.5 9z"/>
      <path d="M11 17l2-3h-2l2-3" />
    </svg>
  );
}

function Mist({ size }) {
  const lines = [9, 12, 15].map((y, i) => <path key={i} d={`M4 ${y}h16`} />);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" stroke={BRAND_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Niebla">
      {lines}
    </svg>
  );
}

function Wind({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" stroke={BRAND_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Viento">
      <path d="M3 12h10a3 3 0 1 0-3-3"/>
      <path d="M2 17h14a3 3 0 1 1-3 3"/>
    </svg>
  );
}

const ICONS = {
  clear: Sun,
  partly: CloudSun,
  clouds: Cloud,
  rain: CloudRain,
  drizzle: CloudDrizzle,
  snow: CloudSnow,
  thunderstorm: CloudLightning,
  mist: Mist,
  wind: Wind,
};

export default function WeatherIcon({ condition, ow, size = 48, className = "" }) {
  const key = normalizeToKey(ow || condition);
  const Icon = ICONS[key] || Cloud;
  return (
    <span className={className} style={{ display: "inline-flex", lineHeight: 0 }}>
      <Icon size={size} />
    </span>
  );
}