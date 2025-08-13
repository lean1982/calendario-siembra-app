
import { useEffect, useMemo, useRef, useState } from 'react';

type Suggestion = { name: string; state?: string; country?: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSelect: (v: string) => void;
};

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY as string;

export default function LocationAutocomplete({ value, onChange, onSelect }: Props) {
  const [open, setOpen] = useState(false);
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
    if (!q || !API_KEY) { setItems([]); return; }
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
  }, [value]);

  return (
    <div ref={rootRef} className="autocomplete-root">
      <input
        className="input"
        placeholder="Ciudad, Provincia, País"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value && setOpen(true)}
      />
      {open && (items.length > 0 || loading) && (
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
