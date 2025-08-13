
import { useEffect, useState } from 'react';

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

function IconLayered({ code, large=false }: { code: string; large?: boolean }) {
  const baseUrl = large ? `https://openweathermap.org/img/wn/${code}@2x.png` : `https://openweathermap.org/img/wn/${code}.png`;
  const wrapClass = large ? 'ow-wrap ow-lg' : 'ow-wrap ow-sm';
  return (
    <span className={wrapClass}>
      <span className="ow-base" style={{ WebkitMaskImage: `url(${baseUrl})`, maskImage: `url(${baseUrl})` }} />
      <span className="ow-fill" style={{ WebkitMaskImage: `url(${baseUrl})`, maskImage: `url(${baseUrl})` }} />
    </span>
  );
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

        const byDay: Record<string, { dt: number; icon: string }> = {};
        if (forecast?.list) {
          for (const item of forecast.list) {
            const d = new Date(item.dt * 1000);
            const key = d.toISOString().slice(0,10);
            const hourDist = Math.abs(d.getHours() - 12);
            const prev = byDay[key];
            if (!prev || hourDist < Math.abs(new Date(prev.dt*1000).getHours() - 12)) {
              byDay[key] = { dt: item.dt, icon: item.weather?.[0]?.icon ?? '01d' };
            }
          }
        }
        const daily = Object.values(byDay).slice(0, 7);

        setData({ name: display, tempC, description: curDesc, icon: curIcon, daily });
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
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <IconLayered code={data.icon} large />
      </div>
      <div style={{gridColumn:'1 / -1', display:'flex', gap:10, alignItems:'center'}}>
        {data.daily.map(d => <IconLayered key={d.dt} code={d.icon} />)}
      </div>
    </div>
  );
}
