import React from 'react';
import { MONTHS_ES } from '../utils/months';
import type { Crop } from '../data/crops';
import { getHarvestReco } from '../data/harvestReco';

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

function normalize(s: any) {
  return String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
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

export default function CropCard({ crop }: Props) {
  const { distancia, sombra, dias, reco } = pick(crop);
  // Fallback seguro desde el PDF si el JSON no trae el texto
  const recoFinal = reco || getHarvestReco((crop as any).slug || crop.nombre);

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

        {/* Recomendación de cosecha (restaurada) */}
        {recoFinal && <p><small className="muted">Recomendación de cosecha:</small> {recoFinal}</p>}

        {/* Mini calendario / timeline: ELIMINADO */}
      </div>
    </article>
  );
}
