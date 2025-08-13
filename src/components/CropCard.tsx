import React from 'react';
import { MONTHS_ES, currentMonthIndex } from '../utils/months';
import type { Crop } from '../data/crops';
import { getHarvestReco } from '../data/harvestReco';

type Props = { crop: Crop; highlight?: 'siembra' | 'cosecha' };

const normalize = (s: any) =>
  String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

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
  const distancia =
    crop.distancia ??
    crop['DISTANCIA ENTRE PLANTAS (CENTÍMETROS)'] ??
    crop.espacio ??
    crop.separacion ??
    '';

  const sombraRaw =
    crop.sombra ?? crop.luz ?? crop.sol_sombra ?? crop.exposicion ?? crop['TOLERA SOMBRA'];
  const sombra = typeof sombraRaw === 'boolean' ? (sombraRaw ? 'Sí' : 'No') : String(sombraRaw ?? '').trim();

  const diasRaw =
    crop.dias ??
    crop.dias_cosecha ??
    crop.diasParaCosecha ??
    crop.dias_a_cosecha ??
    crop['DÍAS A COSECHA'] ??
    crop['Días a cosecha'];
  const dias = formatDias(diasRaw);

  const candidates = [
    crop.recomendacion_cosecha,
    crop['Recomendación de cosecha'],
    crop.cosecha_recomendada,
    crop.cosecha_metodo,
    crop.cosechaMetodo,
    crop.cosecha_texto,
    crop.cosechaInfo,
    crop.como_cosechar,
  ];
  let reco = String((candidates.find(Boolean) ?? '')).trim();
  const n = normalize(reco);
  if (!reco || /^\d+$/.test(reco) || n === 'siembracosecha') reco = '';

  return { distancia, sombra, dias, reco };
}

function MonthBox({ active, current }: { active: boolean; current: boolean }) {
  return <div className={['mini-box', active ? 'on' : 'off', current ? 'current' : ''].filter(Boolean).join(' ')} />;
}

export default function CropCard({ crop }: Props) {
  const now = currentMonthIndex();
  const { distancia, sombra, dias, reco } = pick(crop);

  // Fallback seguro desde el PDF (si el JSON no trae texto)
  const recoFinal = reco || getHarvestReco(crop.nombre);

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

        {dias && <p><small className="muted">Días para cosechar:</small> {dias}</p>}

        <div className="row" style={{ margin: '6px 0 10px', gap: '10px' }}>
          {distancia && <span className="badge">Distancia entre plantas: {distancia}</span>}
          {sombra && <span className="badge">Sombra: {sombra}</span>}
        </div>

        {recoFinal && <p><small className="muted">Recomendación de cosecha:</small> {recoFinal}</p>}

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
