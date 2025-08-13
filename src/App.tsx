import React, { useMemo, useState } from 'react';
import { MONTHS_ES, currentMonthIndex } from './utils/months';
import { crops as cropsData, type Crop } from './data/crops';
import CropCard from './components/CropCard';
import WeatherCard from './components/WeatherCard';
import LocationAutocomplete from './components/LocationAutocomplete';
import MobileControlsBar from './components/MobileControlsBar';
import EmptyState from './components/EmptyState';

type Mode = 'siembra' | 'cosecha';

export default function App() {
  const [month, setMonth] = useState<number>(currentMonthIndex());
  const [mode, setMode] = useState<Mode>('siembra');
  const [locationInput, setLocationInput] = useState('');
  const [resolvedLocation, setResolvedLocation] = useState<string>('');

  // Buscador por cultivo
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (cropsData as Crop[]).filter(c => {
      const byMonth = mode === 'siembra' ? c.siembra.includes(month) : c.cosecha.includes(month);
      const byName  = !term || c.nombre.toLowerCase().includes(term);
      return byMonth && byName;
    });
  }, [month, mode, query]);

  function handleUseMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        setLocationInput(`${latitude},${longitude}`);
      } catch {}
    });
  }

  return (
    <div className="container">
      <h1>Calendario de siembra y cosecha</h1>
      <p className="subtitle">
        Consultá qué sembrar y cuándo cosechar según tu ubicación y época del año.
      </p>

      {/* Controles de escritorio */}
      <label>Mes</label>
      <input
        className="input"
        type="text"
        value={MONTHS_ES[month]}
        onChange={() => {}}
        readOnly
      />

      <label>Ubicación</label>
      <div className="input-with-actions">
        <LocationAutocomplete
          value={locationInput}
          onChange={setLocationInput}
          onResolved={(name) => setResolvedLocation(name)}
        />
      </div>

      {/* Clima */}
      <div className="grid" style={{marginTop: 12}}>
        <WeatherCard
          locationInput={locationInput}
          onResolvedLocation={(name) => setResolvedLocation(name)}
        />
      </div>

      {/* Búsqueda por cultivo */}
      <div style={{marginTop: 16}}>
        <label>Buscar cultivo</label>
        <input
          className="input"
          placeholder="Escribí un nombre (ej. tomate, acelga)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Encabezado de resultados */}
      <h2 className="section-title" style={{marginTop: 18}}>
        En <span className="green">{MONTHS_ES[month]}</span>{resolvedLocation ? ` en ${resolvedLocation}` : ''} podés {mode === 'siembra' ? 'sembrar' : 'cosechar'}:
      </h2>

      {/* Lista de resultados */}
      {results.length === 0 ? (
        <EmptyState month={month} mode={mode} onPickMonth={setMonth} />
      ) : (
        results.map(crop => <CropCard key={crop.nombre} crop={crop} />)
      )}

      {/* Barra mobile fija */}
      <MobileControlsBar
        month={month}
        onMonthChange={setMonth}
        mode={mode}
        onModeChange={setMode}
        location={locationInput}
        onLocationChange={setLocationInput}
        onUseGeo={handleUseMyLocation}
      />
    </div>
  );
}
