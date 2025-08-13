import React from 'react';
import { MONTHS_ES } from '../utils/months';

type Mode = 'siembra' | 'cosecha';

type Props = {
  month: number;
  onMonthChange: (m: number) => void;
  mode: Mode;
  onModeChange: (m: Mode) => void;
  location?: string;
  onLocationChange?: (v: string) => void;
  onUseGeo?: () => void;
};

export default function MobileControlsBar({
  month,
  onMonthChange,
  mode,
  onModeChange,
  location = '',
  onLocationChange,
  onUseGeo
}: Props) {
  const prev = () => onMonthChange((month + 11) % 12);
  const next = () => onMonthChange((month + 1) % 12);

  return (
    <div className="mobile-bar" role="navigation" aria-label="Filtros">
      <div className="bar-row">
        <button className="icon-btn" onClick={prev} aria-label="Mes anterior">‹</button>
        <div className="month-pill">{MONTHS_ES[month]}</div>
        <button className="icon-btn" onClick={next} aria-label="Mes siguiente">›</button>
      </div>

      <div className="bar-row">
        <div className="segmented">
          <button
            className={mode === 'siembra' ? 'seg on' : 'seg'}
            onClick={() => onModeChange('siembra')}
          >
            Siembra
          </button>
          <button
            className={mode === 'cosecha' ? 'seg on' : 'seg'}
            onClick={() => onModeChange('cosecha')}
          >
            Cosecha
          </button>
        </div>

        <div className="loc-ctn">
          <input
            className="loc-input"
            placeholder="Ubicación"
            value={location}
            onChange={(e) => onLocationChange?.(e.target.value)}
          />
          {onUseGeo && (
            <button className="geo-mini" onClick={onUseGeo} title="Usar mi ubicación">📍</button>
          )}
        </div>
      </div>
    </div>
  );
}
