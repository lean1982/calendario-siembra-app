
import { useEffect, useRef, useState } from 'react';

type Suggestion = { name: string; state?: string; country?: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSelect: (v: string) => void;
};

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY as string;

export default function LocationAutocomplete({ value, onChange, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const q = value.trim();
    if (!focused || q.length < 2 || !API_KEY) { setItems([]); return; }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`);
        const json = await res.json();
        setItems(Array.isArray(json) ? json.map((x: any) => ({ name: x.name, state: x.state, country: x.country })) : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
        setOpen(true);
      }
    }, 220);
    return () => clearTimeout(id);
  }, [value, focused]);

  async function handleUseMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude: lat, longitude: lon } = pos.coords;
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
        const json = await res.json();
        const item = Array.isArray(json) && json[0];
        const label = item ? [item.name, item.state, item.country].filter(Boolean).join(', ') : `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
        onSelect(label);
        setOpen(false);
      } catch {}
    }, () => {});
  }

  return (
    <div ref={rootRef} className="autocomplete-root">
      <div className="input-with-actions">
        <input
          className="input"
          placeholder="Ciudad, Provincia, País"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {value && (
          <button
            type="button"
            className="clear-btn"
            aria-label="Limpiar"
            onClick={() => { onChange(''); setItems([]); setOpen(false); }}
          >
            ×
          </button>
        )}
      </div>

      <div className="row" style={{marginTop:8, gap:8}}>
        <button type="button" className="geo-btn" onClick={handleUseMyLocation}>Usar mi ubicación</button>
      </div>

      {open && focused && (items.length > 0 || loading) && (
        <div className="autocomplete">
          {loading && <div className="autocomp-item muted">Buscando…</div>}
          {items.map((it, i) => {
            const label = [it.name, it.state, it.country].filter(Boolean).join(', ');
            return (
              <button
                key={i}
                type="button"
                className="autocomp-item"
                onClick={() => { onSelect(label); setOpen(false); }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
