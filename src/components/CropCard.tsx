import React from 'react';
import { MONTHS_ES } from '../utils/months';
import type { Crop } from '../data/crops';

type Props = { crop: Crop };

function formatDias(val: any): string {
  if (val == null) return '';
  if (Array.isArray(val)) {
    const [a, b] = val;
    if (a && b) return `${a}–${b} días`;
    if (a || b) return `${a || b} días`;
    return '';
  }
  if (typeof val === 'number') return `${val} días`;
  const s = String(val).trim();
  const nums = s.match(/\d+/g);
  if (nums?.length >= 2) return `${nums[0]}–${nums[1]} días`;
  if (nums?.length === 1) return `${nums[0]} días`;
  return s;
}

function pick(crop: any) {
  const distancia = crop.distancia ?? crop['DISTANCIA ENTRE PLANTAS (CENTÍMETROS)'] ?? crop.espacio ?? crop.separacion ?? '';
  const sombraRaw = crop.sombra ?? crop.luz ?? crop.sol_sombra ?? crop.exposicion ?? crop['TOLERA SOMBRA'];
  const sombra = typeof sombraRaw === 'boolean' ? (sombraRaw ? 'Sí' : 'No') : String(sombraRaw ?? '').trim();
  const diasRaw = crop.dias ?? crop.dias_cosecha ?? crop.diasParaCosecha ?? crop.dias_a_cosecha ?? crop['DÍAS A COSECHA'] ?? crop['Días a cosecha'];
  const dias = formatDias(diasRaw);
  return { distancia, sombra, dias };
}

export default function CropCard({ crop }: Props) {
  const { distancia, sombra, dias } = pick(crop);
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

        {/* Meses */}
        <p><small className="muted">Siembra:</small> {crop.siembra.map((i:number) => MONTHS_ES[i]).join(', ') || '—'}</p>
        <p><small className="muted">Cosecha estimada:</small> {crop.cosecha.map((i:number) => MONTHS_ES[i]).join(', ') || '—'}</p>

        {/* Días */}
        {dias && <p><small className="muted">Días para cosechar:</small> {dias}</p>}

        {/* Badges */}
        <div className="row" style={{ margin: '6px 0 10px', gap: '10px' }}>
          {distancia && <span className="badge">Distancia entre plantas: {distancia}</span>}
          {sombra && <span className="badge">Sombra: {sombra}</span>}
        </div>

        {/* Eliminado: mini-calendar/timeline y cualquier texto adicional */}
      </div>
    </article>
  );
}
