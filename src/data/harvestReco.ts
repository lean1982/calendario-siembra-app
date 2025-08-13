// src/data/harvestReco.ts
// Extraído del PDF "Planificador ProHuerta": columna RECOMENDACIÓN DE COSECHA.
// Sirve como fallback si el JSON no trae el texto (o viene mal mapeado).

function toKey(s: string) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const RECO: Record<string, string> = {
  acelga: 'Hoja por hoja.',
  ajo: 'Arrancar entero cuando el follaje amarillea.',
  albahaca: 'Cosechar tallos con hojas.',
  apio: 'Hoja por hoja o planta entera.',
  arveja: 'Vaina con grano tierno.',
  batata: 'Cuando se seca la planta: desenterrar.',
  berenjena: 'Fruto antes de que se endurezca la semilla.',
  'brocoli-y-coliflor': 'Cortar cabezas florales cuando abren los primeros capullos.',
  'cebolla-y-cebolla-de-verdeo': 'Arrancar plantas enteras cuando amarillean.',
  'chaucha-enana-y-de-rama': 'Vainas tiernas con grano chico y tierno.',
  choclo: 'Barbas secas marrón oscuro; grano lechoso.',
  esparrago: 'Cortar tallos tiernos.',
  espinaca: 'Cortar plantas enteras o con raíz.',
  frutilla: 'Frutos maduros.',
  haba: 'Vaina tierna con grano tierno y grande.',
  hinojo: 'Planta entera sin raíz, con cabeza formada.',
  'lechuga-y-escarola': 'Planta entera antes de la floración.',
  'melon-y-sandia': 'Fruto maduro, cabito seco.',
  papa: 'Desenterrar cuando se seca la planta.',
  pepino: 'Fruto tierno tamaño medio (según variedad).',
  perejil: 'Cortar hojas tiernas a 5 cm del suelo (en atados).',
  pimiento: 'Fruto en el punto de madurez deseado.',
  puerro: 'Planta entera con raíz, antes de florecer.',
  rabanito: 'Raíz tierna, antes de que se ahueque.',
  radicheta: 'Hojas tiernas al ras del suelo; cortes frecuentes.',
  remolacha: 'Raíz formada antes de la floración.',
  repollo: 'Cabezas de hojas duras y apretadas.',
  rucula: 'Hojas tiernas a 5 cm. Hacer atados.',
  tomate: 'Fruto en el punto de madurez deseado.',
  zanahoria: 'Raíz formada antes de irse en vicio.',
  'zapallo-y-cayote': 'Fruto maduro, cabito seco.',
  'zapallito-y-zuccini': 'Fruto tierno tamaño medio; semillas tiernas.',
};

export function getHarvestReco(name: string): string {
  const k = toKey(name);
  return RECO[k] || '';
}
