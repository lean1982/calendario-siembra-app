
import { useEffect, useState } from 'react';

type Weather = {
  name: string;
  tempC: number;
  description: string;
  icon: string;       // openweather icon code
  daily: { dt: number; icon: string }[];
};

type Props = {
  locationInput: string;
  onResolvedLocation?: (name: string) => void;
};

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY as string;

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
        // 1) Geocoding
        const g = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationInput)}&limit=1&appid=${API_KEY}`)
          .then(r => r.json());
        if (!g?.length) throw new Error('No se encontró la ubicación');
        const { lat, lon, name, country, state } = g[0];
        const display = [name, state, country].filter(Boolean).join(', ');
        onResolvedLocation?.(display);

        // 2) Onecall for current + daily
        const w = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`)
          .then(r => r.json());

        const now = w.current;
        const daily = (w.daily || []).slice(0, 7).map((d: any) => ({
          dt: d.dt,
          icon: d.weather?.[0]?.icon || '01d'
        }));

        setData({
          name: display,
          tempC: Math.round(now.temp),
          description: now.weather?.[0]?.description ?? '',
          icon: now.weather?.[0]?.icon ?? '01d',
          daily
        });
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'Error de clima');
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
        <img className="weather-icon" src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`} alt="" />
      </div>
      <div style={{gridColumn:'1 / -1', display:'flex', gap:10, alignItems:'center'}}>
        {data.daily.map(d => (
          <img key={d.dt} width="28" height="28" src={`https://openweathermap.org/img/wn/${d.icon}.png`} alt="" />
        ))}
      </div>
    </div>
  );
}
