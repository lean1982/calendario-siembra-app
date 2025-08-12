
// Map Spanish crop names (and slugs) to icon filenames (lowercase english)
export const iconFor = (name) => {
  if (!name) return '/icons/strawberry.svg';
  const n = name.toLowerCase();
  const map = {
    'frutilla': 'strawberry.svg',
    'fresa': 'strawberry.svg',
    'tomate': 'tomato.svg',
    'papa': 'potato.svg',
    'zanahoria': 'carrot.svg',
    'cebolla': 'onion.svg',
    'lechuga': 'lettuce.svg',
    'espinaca': 'spinach.svg',
    'brocoli': 'broccoli.svg',
    'brócoli': 'broccoli.svg',
    'repollo': 'cabbage.svg',
    'calabaza': 'pumpkin.svg',
    'zapallito': 'zucchini.svg',
    'pepino': 'cucumber.svg',
    'ajo': 'garlic.svg',
    'jengibre': 'ginger.svg',
    'maiz': 'corn.svg',
    'maíz': 'corn.svg'
  };
  const file = map[n];
  return file ? `/icons/${file}` : '/icons/strawberry.svg';
};
