import React from 'react';
import { MONTHS_ES, currentMonthIndex } from '../utils/months';
import type { Crop } from '../data/crops';

type Props = { crop: Crop; highlight?: 'siembra' | 'cosecha' };

/** Lee propiedades con nombres alternativos y evita chocar con 'cosecha' (meses) */
function pick(crop: any) {
  const distancia = crop.distancia || crop.espacio || crop.distancia_plantas || crop.separacion || '';
  const luz = crop.luz || crop.sol_sombra || crop.exposicion || crop.sombra || '';
  const dias = crop.dias || crop.dias_cosecha || crop.diasParaCosecha || crop.dias_a_cosecha || '';
  const cosechaTxt =
    crop.cosecha_metodo || crop.cosechaMetodo || crop.cosecha_texto || crop.cosechaInfo ||
    crop.recomendacion_cosecha || crop.cosecha_recomendada || crop.como_cosechar || crop.semillas || '';
  return { distancia, luz, dias, cosechaTxt };
}

function MonthBox({ active, current }: { active: boolean; current: boolean }) {
  return <div className={['mini-box', active ? 'on' : 'off', current ? 'current' : ''].filter(Boolean).join(' ')} />;
}

export default function CropCard({ crop }: Props) {
  const now = currentMonthIndex();
  const { distancia, luz, dias, cosechaTxt } = pick(crop);

  const iconName = (crop as any).icon || (crop as any).nombre_en || crop.nombre;
  const iconSrc = `/icons/${String(iconName).toLowerCase().replaceAll(' ', '-')}.svg`;

  return (
    <article className="result">
      <img
        src={iconSrc}
        alt={crop.nombre}
        width={64}
        height={64}
        loading="lazy"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/icons/_fallback.svg'; }}
      />
      <div>
        <h3>{crop.nombre}</h3>

        <p><small className="muted">Siembra:</small> {crop.siembra.map((i:number) => MONTHS_ES[i]).join(', ') || '—'}</p>
        <p><small className="muted">Cosecha estimada:</small> {crop.cosecha.map((i:number) => MONTHS_ES[i]).join(', ') || '—'}</p>

        {dias && (
          <p><small className="muted">Días a cosecha:</small> {dias}</p>
        )}

        <div className="row" style={{margin: '6px 0 10px', gap: '10px'}}>
          {distancia && <span className="badge">Distancia entre plantas: {distancia}</span>}
          {luz && <span className="badge">Sombra: {String(luz).charAt(0).toUpperCase() + String(luz).slice(1)}</span>}
        </div>

        {cosechaTxt && (
          <p><small className="muted">Cosecha:</small> {cosechaTxt}</p>
        )}

        <div className="mini-calendar" role="img" aria-label="Meses de siembra (fila 1) y cosecha (fila 2)">
          <div className="mini-row">
            {Array.from({ length: 12 }, (_, i) => (
              <MonthBox key={`s-${i}`} active={crop.siembra.includes(i)} current={i === now} />
            ))}
          </div>
          <div className="mini-row">
            {Array.from({ length: 12 }, (_, i) => (
              <MonthBox key={`c-${i}`} active={crop.cosecha.includes(i)} current={i === now} />
            ))}
          </div>
          <div className="mini-legend">
            <span>Siembra</span>
            <span>Cosecha</span>
          </div>
        </div>
      </div>
    </article>
  );
}
