
import React from 'react';

type Kind =
  | 'clear-day' | 'clear-night'
  | 'partly-day' | 'partly-night'
  | 'clouds'
  | 'drizzle' | 'rain' | 'heavy-rain'
  | 'storm'
  | 'snow' | 'sleet'
  | 'mist';

type Props = { code: string; size?: number; stroke?: number; color?: string };

/** Map OpenWeather icon code -> simplified kind */
function codeToKind(code: string): Kind {
  const c = (code || '01d').toLowerCase();
  const t = c.slice(0, 2);
  const d = c.endsWith('d');
  switch (t) {
    case '01': return d ? 'clear-day' : 'clear-night';
    case '02': return d ? 'partly-day' : 'partly-night';
    case '03':
    case '04': return 'clouds';
    case '09': return 'drizzle';
    case '10': return 'rain';
    case '11': return 'storm';
    case '13': return 'snow';
    case '50': return 'mist';
    default: return d ? 'clear-day' : 'clear-night';
  }
}

/** Primitive shapes (kept consistent for all icons) */
const makeCommon = (stroke: number, color: string) => ({
  fill: 'none' as const,
  stroke: color,
  strokeWidth: stroke,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeMiterlimit: 10 as const,
});

/** Flat-bottom cloud with rounded lobes (matching sample style) */
function Cloud({ common }: { common: Partial<React.SVGProps<SVGPathElement>> }) {
  return (
    <g>
      <path d="M18 44 H58" {...common} />
      <path d="M18 44
               Q 20 36 27 36
               Q 31 30 38 31.5
               Q 43 29 49 33
               Q 57 34 58 44" {...common} />
    </g>
  );
}

function Sun({ common }: { common: any }) {
  return (
    <g>
      <circle cx="22" cy="22" r="8" {...common} />
      <path d="M22 8v6M22 30v6M8 22h6M30 22h6M11 11l4 4M33 33l4 4M11 33l4-4M33 11l4-4" {...common} />
    </g>
  );
}

function Moon({ common }: { common: any }) {
  // crescent via two circles difference approximated by path
  return <path d="M40 18a10 10 0 1 0 8 14 12 12 0 1 1-8-14z" {...common} />;
}

function Drops({ x, y, n, dx=10, len=8, common }: { x: number; y: number; n: number; dx?: number; len?: number; common: any }) {
  const arr = Array.from({ length: n }, (_, i) => i);
  return (
    <g>
      {arr.map(i => <path key={i} d={`M${x + i*dx} ${y} v ${len}`} {...common} />)}
    </g>
  );
}

function Flakes({ x, y, n, dx=12, common }: { x: number; y: number; n: number; dx?: number; common: any }) {
  const arr = Array.from({ length: n }, (_, i) => i);
  return (
    <g>
      {arr.map(i => (
        <g key={i} transform={`translate(${x + i*dx}, ${y})`}>
          <path d="M0 -4 V 4 M-4 0 H 4 M-2 -2 L 2 2 M-2 2 L 2 -2" {...common} />
        </g>
      ))}
    </g>
  );
}

export default function WeatherGlyph({ code, size=64, stroke, color='var(--green)' }: Props) {
  const kind = codeToKind(code);
  const s = size;
  const sw = stroke ?? (s >= 40 ? 3.2 : 2.6);
  const common = makeCommon(sw, 'currentColor');
  const style = { color } as React.CSSProperties;

  if (kind === 'clear-day') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Soleado" style={style}>
        <Sun common={common} />
      </svg>
    );
  }

  if (kind === 'clear-night') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Despejado de noche" style={style}>
        <Moon common={common} />
      </svg>
    );
  }

  if (kind === 'partly-day') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Parcialmente nublado" style={style}>
        <Sun common={common} />
        <Cloud common={common} />
      </svg>
    );
  }

  if (kind === 'partly-night') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Parcialmente nublado de noche" style={style}>
        <Moon common={common} />
        <Cloud common={common} />
      </svg>
    );
  }

  if (kind === 'clouds') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Nublado" style={style}>
        <Cloud common={common} />
      </svg>
    );
  }

  if (kind === 'drizzle') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Llovizna" style={style}>
        <Cloud common={common} />
        <Drops x={24} y={48} n={2} dx={14} len={6} common={common} />
      </svg>
    );
  }

  if (kind === 'rain') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Lluvia" style={style}>
        <Cloud common={common} />
        <Drops x={22} y={48} n={3} dx={10} len={8} common={common} />
      </svg>
    );
  }

  if (kind === 'heavy-rain') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Lluvia intensa" style={style}>
        <Cloud common={common} />
        <Drops x={20} y={48} n={4} dx={8} len={10} common={common} />
      </svg>
    );
  }

  if (kind === 'storm') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Tormenta" style={style}>
        <Cloud common={common} />
        <path d="M28 48l-6 10h6l-2 8 10-14h-6l2-4z" {...common} />
      </svg>
    );
  }

  if (kind === 'snow') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Nieve" style={style}>
        <Cloud common={common} />
        <Flakes x={24} y={52} n={3} dx={12} common={common} />
      </svg>
    );
  }

  if (kind === 'sleet') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Aguanieve" style={style}>
        <Cloud common={common} />
        <path d="M24 48 v8M36 48 v8" {...common} />
        <circle cx="30" cy="56" r="0.1" {...common} />
      </svg>
    );
  }

  // mist / haze
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Neblina" style={style}>
      <Cloud common={common} />
      <path d="M12 54h40M10 58h38" {...common} />
    </svg>
  );
}
