import { useEffect, useMemo, useRef, useState } from 'react';
import WeatherCard from './components/WeatherCard';
import CropCard from './components/CropCard';
import LocationAutocomplete from './components/LocationAutocomplete';
import { CROPS, type Crop } from './data/crops';
import { MONTHS_ES, currentMonthIndex } from './utils/months';

type Mode = 'ambos' | 'siembra' | 'cosecha';

function filterByMonth(crops: Crop[], monthIdx: number, mode: 'siembra'|'cosecha') {
  return crops.filter(c => (mode === 'siembra' ? c.siembra : c.cosecha).includes(monthIdx));
}

export default function App() {
  const [monthIdx, setMonthIdx] = useState<number>(currentMonthIndex());
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<Mode>('ambos');
  const [locationInput, setLocationInput] = useState('Luján, Buenos Aires, Argentina');
  const [resolvedLocation, setResolvedLocation] = useState('Luján, Buenos Aires, Argentina');

  // Persist & restore preferences
  useEffect(() => {
    const saved = localStorage.getItem('huerta_prefs');
    if (saved) {
      try {
        const { monthIdx: m, query: q, mode: md, location: loc } = JSON.parse(saved);
        if (typeof m === 'number') setMonthIdx(m);
        if (typeof q === 'string') setQuery(q);
        if (md === 'ambos' || md === 'siembra' || md === 'cosecha') setMode(md);
        if (typeof loc === 'string' && loc) { setLocationInput(loc); setResolvedLocation(loc); }
      } catch {}
    }
  }, []);

  useEffect(() => {
    const data = { monthIdx, query, mode, location: locationInput };
    localStorage.setItem('huerta_prefs', JSON.stringify(data));
  }, [monthIdx, query, mode, locationInput]);

  // Keyboard shortcut: Ctrl/Cmd+K focuses search (se mantiene, sin hint visual)
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      if ((isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = useMemo(() => {
    const base = CROPS;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      return base.filter(c => c.nombre.toLowerCase().includes(q));
    }
    return base;
  }, [query]);

  const siembraHoy = useMemo(() => filterByMonth(filtered, monthIdx, 'siembra'), [filtered, monthIdx]);
  const cosechaHoy = useMemo(() => filterByMonth(filtered, monthIdx, 'cosecha'), [filtered, monthIdx]);

  const monthLabel = MONTHS_ES[monthIdx];
  const showSiembra = mode !== 'cosecha';
  const showCosecha = mode !== 'siembra';

  return (
    <div className="container">
      <h1>Calendario de siembra y cosecha</h1>
      <p className="subtitle">Consultá qué sembrar y cuándo cosechar según tu ubicación y época del año.</p>

      {/* Controls (desktop / tablet) */}
      <div className="grid" aria-label="Controles principales">
        <div>
          <label htmlFor="mes">Mes</label>
          <select
            id="mes"
            className="input"
            value={monthIdx}
            onChange={(e) => setMonthIdx(Number(e.target.value))}
          >
            {MONTHS_ES.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Ubicación</label>
          <LocationAutocomplete
            value={locationInput}
            onChange={setLocationInput}
            onSelect={(v) => setLocationInput(v)}
          />
        </div>
      </div>

      <div style={{height:16}} />

      <WeatherCard locationInput={locationInput} onResolvedLocation={setResolvedLocation} />

      <div style={{height:16}} />

      <label htmlFor="buscador">Buscá por cultivo</label>
      <input
        id="buscador"
        ref={searchRef}
        className="input"
        placeholder="Ej: tomate, lechuga…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar cultivo por nombre"
      />

      <div className="chips" role="group" aria-label="Mostrar">
        <button
          type="button"
          className={mode === 'ambos' ? 'chip active' : 'chip'}
          onClick={() => setMode('ambos')}
          aria-pressed={mode === 'ambos'}
        >Ambos</button>
        <button
          type="button"
          className={mode === 'siembra' ? 'chip active' : 'chip'}
          onClick={() => setMode('siembra')}
          aria-pressed={mode === 'siembra'}
        >Siembra</button>
        <button
          type="button"
          className={mode === 'cosecha' ? 'chip active' : 'chip'}
          onClick={() => setMode('cosecha')}
          aria-pressed={mode === 'cosecha'}
        >Cosecha</button>
      </div>

      {showSiembra && (
        <section className="section">
          <p className="section-lede">
            En <span className="green">{monthLabel}</span> en {resolvedLocation} podés sembrar:
          </p>
          {siembraHoy.length === 0 ? (
            <p className="muted">No hay cultivos para sembrar este mes.</p>
          ) : (
            siembraHoy.map(c => <CropCard key={c.id} crop={c} highlight="siembra" />)
          )}
        </section>
      )}

      {showCosecha && (
        <section className="section">
          <p className="section-lede">
            En <span className="green">{monthLabel}</span> en {resolvedLocation} podés cosechar:
          </p>
          {cosechaHoy.length === 0 ? (
            <p className="muted">No hay cultivos para cosechar este mes.</p>
          ) : (
            cosechaHoy.map(c => <CropCard key={c.id} crop={c} highlight="cosecha" />)
          )}
        </section>
      )}

      {/* Sticky bar (solo mobile) */}
      <div className="stickybar" aria-label="Barra de acciones rápida">
        <select
          aria-label="Seleccionar mes"
          value={monthIdx}
          onChange={(e) => setMonthIdx(Number(e.target.value))}
        >
          {MONTHS_ES.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <input
          aria-label="Buscar cultivo"
          placeholder="Buscar…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          aria-label="Editar ubicación"
          placeholder="Ubicación"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
        />
      </div>
    </div>
  );
}
