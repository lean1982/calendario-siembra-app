
import React from 'react';

type Props = { code: string; size?: number; stroke?: number; color?: string };

function codeToKind(code: string): 'clear-day'|'clear-night'|'partly-day'|'partly-night'|'clouds'|'rain'|'storm'|'snow'|'mist' {
  const c = (code || '01d').toLowerCase();
  const t = c.slice(0, 2);
  const d = c.endsWith('d');
  if (t === '01') return d ? 'clear-day' : 'clear-night';
  if (t === '02') return d ? 'partly-day' : 'partly-night';
  if (t === '03' || t === '04') return 'clouds';
  if (t === '09' || t === '10') return 'rain';
  if (t === '11') return 'storm';
  if (t === '13') return 'snow';
  if (t === '50') return 'mist';
  return d ? 'clear-day' : 'clear-night';
}

function CloudShape({common}:{common: any}) {
  // Cloud with FLAT bottom at y=44 from x=18 to x=58, and rounded top lobes
  return (
    <g>
      <path d="M18 44 H58" {...common} />
      <path d="M18 44 Q 20 36 28 36 Q 32 30 40 32 Q 46 30 52 34 Q 58 36 58 44" {...common} />
    </g>
  );
}

export default function WeatherGlyph({ code, size=64, stroke, color='var(--green)' }: Props) {
  const kind = codeToKind(code);
  const s = size;
  const sw = stroke ?? (s >= 40 ? 3.5 : 2.5);
  const common = { fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  if (kind === 'clear-day') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Soleado">
        <circle cx="32" cy="26" r="10" {...common} />
        <path d="M32 8v6M32 38v6M14 26h6M44 26h6M18 14l4 4M42 38l4 4M18 38l4-4M42 14l4-4" {...common} />
      </svg>
    );
  }

  if (kind === 'partly-day') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Parcialmente nublado">
        <circle cx="22" cy="22" r="8" {...common} />
        <path d="M22 8v6M22 30v6M10 22h6M30 22h6M14 14l4 4M30 30l4 4M14 30l4-4M30 14l4-4" {...common} />
        <CloudShape common={common} />
      </svg>
    );
  }

  if (kind === 'clouds') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Nublado">
        <CloudShape common={common} />
      </svg>
    );
  }

  if (kind === 'rain') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Lluvia">
        <CloudShape common={common} />
        <path d="M24 48 l-4 8 M34 48 l-4 8 M44 48 l-4 8" {...common} />
      </svg>
    );
  }

  if (kind === 'storm') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Tormenta">
        <CloudShape common={common} />
        <path d="M30 48l-6 10h6l-2 8 10-14h-6l2-4z" {...common} />
      </svg>
    );
  }

  if (kind === 'snow') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Nieve">
        <CloudShape common={common} />
        <path d="M26 50l4 4m4-4l-4 4M34 56l4 4m4-4l-4 4M18 52l4 4" {...common} />
      </svg>
    );
  }

  if (kind === 'mist') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Neblina">
        <CloudShape common={common} />
        <path d="M10 54h44M8 58h40" {...common} />
      </svg>
    );
  }

  if (kind === 'clear-night' || kind === 'partly-night') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Noche">
        <path d="M40 18a10 10 0 1 0 8 14 12 12 0 1 1-8-14z" {...common} />
        {kind === 'partly-night' && <CloudShape common={common} />}
      </svg>
    );
  }

  return null;
}
