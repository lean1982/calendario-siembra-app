
import { useEffect, useRef, useState } from 'react';

type Suggestion = { name: string; state?: string; country?: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSelect: (v: string) => void;
};

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY as string;
const LISTBOX_ID = 'geo-listbox';

export default function LocationAutocomplete({ value, onChange, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<number>(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!focused || q.length < 2 || !API_KEY) { setItems([]); setOpen(false); return; }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`);
        const json = await res.json();
        const arr = Array.isArray(json) ? json.map((x: any) => ({ name: x.name, state: x.state, country: x.country })) : [];
        setItems(arr);
        setOpen(arr.length > 0);
        setActive(arr.length ? 0 : -1);
      } catch {
        setItems([]); setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(id);
  }, [value, focused]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && items[active]) {
        const it = items[active];
        const label = [it.name, it.state, it.country].filter(Boolean).join(', ');
        onSelect(label);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

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
        inputRef.current?.focus();
      } catch {}
    }, () => {});
  }

  return (
    <div ref={rootRef} className="autocomplete-root">
      <div className="input-with-actions">
        <input
          ref={inputRef}
          className="input"
          placeholder="Ciudad, Provincia, País"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          role="combobox"
          aria-expanded={open}
          aria-controls={LISTBOX_ID}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `geo-opt-${active}` : undefined}
          onKeyDown={handleKeyDown}
        />
        {value && (
          <button
            type="button"
            className="clear-btn"
            aria-label="Limpiar ubicación"
            onClick={() => { onChange(''); setItems([]); setOpen(false); inputRef.current?.focus(); }}
          >
            ×
          </button>
        )}
      </div>

      <div className="row" style={{marginTop:8, gap:8}}>
        <button type="button" className="geo-btn" onClick={handleUseMyLocation}>Usar mi ubicación</button>
      </div>

      {open && focused && (items.length > 0 || loading) && (
        <div id={LISTBOX_ID} role="listbox" className="autocomplete">
          {loading && <div className="autocomp-item muted">Buscando…</div>}
          {items.map((it, i) => {
            const label = [it.name, it.state, it.country].filter(Boolean).join(', ');
            return (
              <button
                key={i}
                id={`geo-opt-${i}`}
                type="button"
                role="option"
                aria-selected={i === active}
                className="autocomp-item"
                onMouseEnter={() => setActive(i)}
                onClick={() => { onSelect(label); setOpen(false); inputRef.current?.focus(); }}
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
