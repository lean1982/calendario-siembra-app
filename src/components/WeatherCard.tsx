import { useEffect, useState } from 'react';
import WeatherIcon from './WeatherIcon';

type Weather = {
  name: string;
  tempC: number;
  description: string;
  icon: string;
  daily: { dt: number; icon: string }[];
};

type Props = {
  locationInput: string;
  onResolvedLocation?: (name: string) => void;
};

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY as string;

function dayLetterES(date: Date) {
  const letters = ['D','L','M','M','J','V','S'] as const;
  return letters[date.getDay()];
}

export default function WeatherCard({ locationInput, onResolvedLocation }: Props) {
  const [data, setData] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function run() {
      if (!locationInput) return;
      if (!API_KEY) { setError('Falta VITE_OPENWEATHER_KEY'); return; }
      setLoading(true);
      setError(null);
      try {
        const g = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationInput)}&limit=1&appid=${API_KEY}`
        ).then(r => r.json());
        if (!Array.isArray(g) || g.length === 0) throw new Error('No se encontró la ubicación');
        const { lat, lon, name, country, state } = g[0];
        const display = [name, state, country].filter(Boolean).join(', ');
        onResolvedLocation?.(display);

        const current = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
        ).then(r => r.json());
        if (!current?.main) throw new Error('No se pudo leer el clima actual');
        const tempC = Math.round(current.main.temp);
        const curIcon = current.weather?.[0]?.icon ?? '01d';
        const curDesc = current.weather?.[0]?.description ?? '';

        const forecast = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
        ).then(r => r.json());

        const byDay = {};
        if (forecast?.list) {
          for (const item of forecast.list) {
            const d = new Date(item.dt * 1000);
            const key = d.toISOString().slice(0,10);
            const hourDist = Math.abs(d.getHours() - 12);
            const prev = byDay[key] as any;
            if (!prev || hourDist < Math.abs(new Date(prev.dt*1000).getHours() - 12)) {
              (byDay as any)[key] = { dt: item.dt, icon: item.weather?.[0]?.icon ?? '01d' };
            }
          }
        }
        const days = Object.values(byDay as Record<string, {dt:number, icon:string}>).slice(0, 5);

        setData({ name: display, tempC, description: curDesc, icon: curIcon, daily: days });
      } catch (e: any) {
        console.error(e);
        setError(e?.message || 'Error de clima');
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [locationInput]);

  if (!locationInput) return null;
  if (error) return <div className="weather-card"><small className="muted">Clima: {error}</small></div>;
  if (loading || !data) return <div className="weather-card"><small className="muted">Cargando clima…</small></div>;

  return (
    <div className="weather-card">
      <div>
        <div style={{fontWeight:600}}>{data.name}</div>
        <div className="weather-temp">{data.tempC}°</div>
        <div><small className="muted" style={{textTransform:'capitalize'}}>{data.description}</small></div>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:8}} aria-hidden="true">
        <WeatherIcon code={data.icon} size={72} />
      </div>

      <div className="forecast">
        {data.daily.map((d) => {
          const dt = new Date(d.dt * 1000);
          const lab = dayLetterES(dt);
          return (
            <div className="forecast-item" key={d.dt}>
              <WeatherIcon code={d.icon} size={24} />
              <small className="forecast-day">{lab}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
