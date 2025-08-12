// Mapeo nombre -> archivo de icono (en /public/icons).
// Si no hay match, se usa 'strawberry.svg' como fallback.
const MAP = {
  'tomate': 'tomato.svg',
  'brócoli': 'broccoli.svg',
  'brocoli': 'broccoli.svg',
  'repollo': 'cabbage.svg',
  'lechuga': 'lettuce.svg',
  'zanahoria': 'carrot.svg',
  'cebolla': 'onion.svg',
  'papa': 'potato.svg',
  'pepino': 'cucumber.svg',
  'zapallo': 'pumpkin.svg',
  'zapallito': 'zucchini.svg',
  'frutilla': 'strawberry.svg',
  'ajo': 'garlic.svg',
  'apio': 'celery.svg',
  'berenjena': 'eggplant.svg',
  'rúcula': 'arugula.svg',
  'rucula': 'arugula.svg',
  'perejil': 'parsley.svg',
  'pimiento': 'pepper.svg',
  'morrón': 'pepper.svg',
  'morron': 'pepper.svg',
  'rábano': 'radish.svg',
  'rabano': 'radish.svg',
  'espinaca': 'spinach.svg',
  'acelga': 'chard.svg',
  'habas': 'broadbean.svg',
  'haba': 'broadbean.svg',
  'arveja': 'pea.svg',
  'maíz': 'corn.svg',
  'maiz': 'corn.svg',
  'calabacín': 'zucchini.svg',
  'calabacin': 'zucchini.svg'
};

export function iconFor(name) {
  if (!name) return '/icons/strawberry.svg'
  const key = name.trim().toLowerCase()
  return '/icons/' + (MAP[key] || 'strawberry.svg')
}
