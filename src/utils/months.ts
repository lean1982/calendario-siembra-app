
export const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const monthName = (i: number) => MONTHS_ES[i];
export const currentMonthIndex = () => new Date().getMonth();

const SEASONS: Record<string, number[]> = {
  // Hemisferio sur (Argentina)
  'verano': [11,0,1],       // Dic, Ene, Feb
  'otoño': [2,3,4],         // Mar, Abr, May
  'invierno': [5,6,7],      // Jun, Jul, Ago
  'primavera': [8,9,10],    // Sep, Oct, Nov
  'fin de verano': [1,2],   // Feb, Mar (aprox.)
};

function clean(s: string) {
  return s
    .replace(/[()\.]/g, ' ')
    .replace(/–/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function findMonthIndex(fragment: string): number {
  const f = fragment.trim().toLowerCase();
  for (let i=0; i<MONTHS_ES.length; i++) {
    const m = MONTHS_ES[i].toLowerCase();
    if (m.startsWith(f.slice(0,3))) return i;
  }
  return -1;
}

export function monthListToIndices(list: string): number[] {
  if (!list) return [];
  const s = clean(list);
  if (s.includes('todo el año')) return Array.from({length:12}, (_,i)=>i);

  const result = new Set<number>();

  // Seasons keywords
  Object.entries(SEASONS).forEach(([k, months]) => {
    if (s.includes(k)) months.forEach(m => result.add(m));
  });

  // Split by comma
  const parts = s.split(',');
  for (const part0 of parts) {
    const part = part0.trim();
    if (!part) continue;

    if (part.includes('-')) {
      const [a,b] = part.split('-').map(x => x.trim());
      const ai = findMonthIndex(a);
      const bi = findMonthIndex(b);
      if (ai >= 0 && bi >= 0) {
        if (ai <= bi) for (let i=ai; i<=bi; i++) result.add(i);
        else { for (let i=ai; i<12; i++) result.add(i); for (let i=0; i<=bi; i++) result.add(i); }
        continue;
      }
    }

    // Add standalone month names found in the string
    for (let i=0; i<MONTHS_ES.length; i++) {
      const m = MONTHS_ES[i].toLowerCase();
      if (part.includes(m)) result.add(i);
    }
  }

  return Array.from(result).sort((a,b)=>a-b);
}
