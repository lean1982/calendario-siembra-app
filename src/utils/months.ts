
export const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const monthName = (i: number) => MONTHS_ES[i];
export const currentMonthIndex = () => new Date().getMonth();

export function monthListToIndices(list: string): number[] {
  // list like "Marzo - Junio" or "Julio - Agosto"
  const parts = list.split(/[,·]/).map(s => s.trim()).filter(Boolean);
  const out = new Set<number>();
  for (const p of parts) {
    if (p.includes('-')) {
      const [a,b] = p.split('-').map(s => s.trim());
      const ai = MONTHS_ES.findIndex(m => m.toLowerCase().startsWith(a.toLowerCase().slice(0,3)));
      const bi = MONTHS_ES.findIndex(m => m.toLowerCase().startsWith(b.toLowerCase().slice(0,3)));
      if (ai >= 0 && bi >= 0) {
        if (ai <= bi) for (let i=ai; i<=bi; i++) out.add(i);
        else { for (let i=ai; i<12; i++) out.add(i); for (let i=0; i<=bi; i++) out.add(i); }
      }
    } else {
      const idx = MONTHS_ES.findIndex(m => m.toLowerCase().startsWith(p.toLowerCase().slice(0,3)));
      if (idx >= 0) out.add(idx);
    }
  }
  return [...out].sort((a,b)=>a-b);
}
