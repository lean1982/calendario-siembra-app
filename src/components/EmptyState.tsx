import React from 'react';
import { MONTHS_ES } from '../utils/months';

type Props = {
  month: number;
  mode: 'siembra' | 'cosecha';
  onPickMonth?: (m: number) => void;
};

export default function EmptyState({ month, mode, onPickMonth }: Props) {
  const alt = [(month + 1) % 12, (month + 11) % 12, (month + 2) % 12];
  return (
    <div className="empty">
      <h3>No encontramos cultivos para {MONTHS_ES[month].toLowerCase()} ({mode}).</h3>
      <p className="muted">
        Probá cambiar el mes o la ubicación. Sugerencias rápidas:
      </p>
      <div className="row">
        {alt.map((m) => (
          <button key={m} className="chip" onClick={() => onPickMonth?.(m)}>
            {MONTHS_ES[m]}
          </button>
        ))}
      </div>
    </div>
  );
}
