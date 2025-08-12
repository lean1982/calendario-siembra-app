// Mapeo de nombre (normalizado) -> archivo svg en /public/icons
export const ICON_MAP = {
  'frutilla': 'strawberry.svg',
  'fresa': 'strawberry.svg',
  'brocoli': 'broccoli.svg',
  'brócoli': 'broccoli.svg',
  'repollo': 'cabbage.svg',
  'tomate': 'tomato.svg',
  'zanahoria': 'carrot.svg',
  'lechuga': 'lettuce.svg',
  'cebolla': 'onion.svg',
  'papa': 'potato.svg',
};
export const DEFAULT_ICON = 'strawberry.svg';

export function pickIcon(name) {
  const key = (name || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  return ICON_MAP[key] || DEFAULT_ICON;
}
