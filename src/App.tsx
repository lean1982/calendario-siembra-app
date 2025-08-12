
import { useEffect, useMemo, useState } from 'react';
import WeatherCard from './components/WeatherCard';
import CropCard from './components/CropCard';
import { CROPS, type Crop } from './data/crops';
import { MONTHS_ES, currentMonthIndex } from './utils/months';

function filterByMonth(crops: Crop[], monthIdx: number, mode: 'siembra'|'cosecha') {
  return crops.filter(c => (mode === 'siembra' ? c.siembra : c.cosecha).includes(monthIdx));
}

export default function App() {
  const [monthIdx, setMonthIdx] = useState<number>(currentMonthIndex());
  const [query, setQuery] = useState('');
  const [locationInput, setLocationInput] = useState('Luján, Buenos Aires, Argentina');
  const [resolvedLocation, setResolvedLocation] = useState('Luján, Buenos Aires, Argentina');

  useEffect(() => {
    setMonthIdx(currentMonthIndex());
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

  return (
    <div className="container">
      <h1>Calendario de siembra y cosecha</h1>
      <p className="subtitle">Consultá qué sembrar y cuándo cosechar según tu ubicación y época del año.</p>

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

      <label htmlFor="ubicacion">Ubicación</label>
      <input
        id="ubicacion"
        className="input"
        placeholder="Ciudad, Provincia, País"
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
      />

      <div style={{height:16}} />

      <WeatherCard locationInput={locationInput} onResolvedLocation={setResolvedLocation} />

      <div style={{height:16}} />

      <label htmlFor="buscador">Buscá por cultivo</label>
      <input
        id="buscador"
        className="input"
        placeholder="Ej: tomate, lechuga…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{height:24}} />

      <p className="section-lede">
        En <span className="green">{monthLabel}</span> en {resolvedLocation} podés sembrar:
      </p>
      {siembraHoy.length === 0 ? (
        <p className="muted">No hay cultivos para sembrar este mes.</p>
      ) : (
        siembraHoy.map(c => <CropCard key={c.id} crop={c} />)
      )}

      <p className="section-lede" style={{marginTop:32}}>
        En <span className="green">{monthLabel}</span> en {resolvedLocation} podés cosechar:
      </p>
      {cosechaHoy.length === 0 ? (
        <p className="muted">No hay cultivos para cosechar este mes.</p>
      ) : (
        cosechaHoy.map(c => <CropCard key={c.id} crop={c} />)
      )}
    </div>
  );
}
