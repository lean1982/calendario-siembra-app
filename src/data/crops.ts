
export type Crop = {
  id: string;           // slug (es)
  nombre: string;       // nombre en español
  icon: string;         // nombre del svg en inglés (sin .svg)
  spacing_cm: number;   // distancia entre plantas
  sombra: 'sí' | 'no' | 'poco' | 'medio';
  siembra: number[];    // meses (0-11)
  cosecha: number[];    // meses (0-11)
  dias_a_cosecha?: [number, number];
  cosecha_recomendacion?: string; // texto
};

import { monthListToIndices } from '../utils/months';

/**
 * "cosecha_recomendacion" toma el texto de la columna RECOMENDACIÓN DE COSECHA
 * del Planificador ProHuerta (PDF). Ver documento adjunto.
 */
export const CROPS: Crop[] = [
  { id:'acelga', nombre:'Acelga', icon:'chard', spacing_cm:18, sombra:'sí',
    siembra: monthListToIndices('Todo el año excepto enero y julio'),
    cosecha: monthListToIndices('Todo el año'),
    dias_a_cosecha:[60,80],
    cosecha_recomendacion:'Hoja por hoja.' },

  { id:'ajo', nombre:'Ajo', icon:'garlic', spacing_cm:12, sombra:'poco',
    siembra: monthListToIndices('Marzo - Mayo'),
    cosecha: monthListToIndices('Noviembre - Diciembre, Enero'),
    dias_a_cosecha:[250,270],
    cosecha_recomendacion:'Arranco entero amarillo.' },

  { id:'albahaca', nombre:'Albahaca', icon:'basil', spacing_cm:22, sombra:'poco',
    siembra: monthListToIndices('Almácigo: Agosto, Siembra directa: Septiembre - Noviembre'),
    cosecha: monthListToIndices('Noviembre - Abril'),
    dias_a_cosecha:[80,100],
    cosecha_recomendacion:'Tallos con hojas.' },

  { id:'apio', nombre:'Apio', icon:'celery', spacing_cm:22, sombra:'sí',
    siembra: monthListToIndices('Septiembre - Diciembre, Enero - Marzo'),
    cosecha: monthListToIndices('Diciembre - Abril, Agosto - Septiembre'),
    dias_a_cosecha:[120,150],
    cosecha_recomendacion:'Hoja por hoja o planta entera.' },

  { id:'arveja', nombre:'Arveja', icon:'pea', spacing_cm:8, sombra:'poco',
    siembra: monthListToIndices('Marzo - Agosto'),
    cosecha: monthListToIndices('Julio - Noviembre'),
    dias_a_cosecha:[120,150],
    cosecha_recomendacion:'Vaina con grano tierno.' },

  { id:'batata', nombre:'Batata', icon:'sweet-potato', spacing_cm:35, sombra:'medio',
    siembra: monthListToIndices('Julio - Agosto (almácigo), Septiembre - Octubre (plantación)'),
    cosecha: monthListToIndices('Abril - Mayo'),
    dias_a_cosecha:[250,270],
    cosecha_recomendacion:'Cuando se seca la planta: desenterrar.' },

  { id:'berenjena', nombre:'Berenjena', icon:'eggplant', spacing_cm:45, sombra:'no',
    siembra: monthListToIndices('Almácigo: Julio - Agosto; Trasplante: Septiembre - Octubre'),
    cosecha: monthListToIndices('Febrero - Mayo'),
    dias_a_cosecha:[150,180],
    cosecha_recomendacion:'Antes que se endurezca la semilla.' },

  { id:'brocoli-coliflor', nombre:'Brócoli y coliflor', icon:'broccoli', spacing_cm:45, sombra:'no',
    siembra: monthListToIndices('Septiembre - Octubre, Febrero - Abril'),
    cosecha: monthListToIndices('Noviembre - Enero'),
    dias_a_cosecha:[250,270],
    cosecha_recomendacion:'Cortar cabezas florales cuando comienzan a abrirse los primeros capullos.' },

  { id:'cebolla', nombre:'Cebolla', icon:'onion', spacing_cm:12, sombra:'poco',
    siembra: monthListToIndices('Febrero - Abril'),
    cosecha: monthListToIndices('Noviembre - Diciembre, Enero'),
    dias_a_cosecha:[250,270],
    cosecha_recomendacion:'Arranco plantas enteras, amarillas.' },

  { id:'chaucha', nombre:'Chaucha (enana y de rama)', icon:'green-beans', spacing_cm:25, sombra:'no',
    siembra: monthListToIndices('Fin de verano - Otoño - Primavera'),
    cosecha: monthListToIndices('Junio - Agosto, Diciembre - Febrero'),
    dias_a_cosecha:[90,120],
    cosecha_recomendacion:'Vainas tiernas, grano chico tierno.' },

  { id:'choclo', nombre:'Choclo', icon:'corn', spacing_cm:32, sombra:'no',
    siembra: monthListToIndices('Agosto (protegido), Septiembre - Enero'),
    cosecha: monthListToIndices('Enero - Abril'),
    dias_a_cosecha:[100,130],
    cosecha_recomendacion:'Barbas secas marrón oscuro, grano lechoso.' },

  { id:'esparrago', nombre:'Espárrago', icon:'asparagus', spacing_cm:28, sombra:'medio',
    siembra: monthListToIndices('Agosto - Septiembre'),
    cosecha: monthListToIndices('Octubre - Diciembre'),
    dias_a_cosecha:[365*4, 365*4],
    cosecha_recomendacion:'Cortar tallos tiernos.' },

  { id:'espinaca', nombre:'Espinaca', icon:'spinach', spacing_cm:8, sombra:'poco',
    siembra: monthListToIndices('Febrero - Junio'),
    cosecha: monthListToIndices('Agosto - Octubre'),
    dias_a_cosecha:[80,90],
    cosecha_recomendacion:'Corto plantas enteras o con raíz.' },

  { id:'frutilla', nombre:'Frutilla', icon:'strawberry', spacing_cm:25, sombra:'poco',
    siembra: monthListToIndices('Abril - Mayo'),
    cosecha: monthListToIndices('Octubre - Diciembre'),
    dias_a_cosecha:[150,180],
    cosecha_recomendacion:'Frutos maduros.' },

  { id:'haba', nombre:'Haba', icon:'broad-bean', spacing_cm:28, sombra:'medio',
    siembra: monthListToIndices('Marzo - Junio'),
    cosecha: monthListToIndices('Septiembre - Diciembre'),
    dias_a_cosecha:[180,200],
    cosecha_recomendacion:'Vaina tierna con grano tierno y grande.' },

  { id:'hinojo', nombre:'Hinojo', icon:'fennel', spacing_cm:32, sombra:'poco',
    siembra: monthListToIndices('Enero - Abril'),
    cosecha: monthListToIndices('Julio - Octubre'),
    dias_a_cosecha:[150,180],
    cosecha_recomendacion:'Planta entera; elimino raíz; cabeza formada.' },

  { id:'lechuga-escarola', nombre:'Lechuga y escarola', icon:'lettuce', spacing_cm:18, sombra:'sí',
    siembra: monthListToIndices('Julio - Agosto, Agosto - Diciembre, Febrero - Junio'),
    cosecha: monthListToIndices('Todo el año'),
    dias_a_cosecha:[60,90],
    cosecha_recomendacion:'Planta entera antes de la floración.' },

  { id:'melon-sandia', nombre:'Melón y sandía', icon:'melon', spacing_cm:85, sombra:'no',
    siembra: monthListToIndices('Agosto (protegido), Septiembre - Octubre'),
    cosecha: monthListToIndices('Enero - Abril'),
    dias_a_cosecha:[130,180],
    cosecha_recomendacion:'Fruto maduro, cabito seco.' },

  { id:'papa', nombre:'Papa', icon:'potato', spacing_cm:25, sombra:'medio',
    siembra: monthListToIndices('Agosto - Septiembre, Enero - Febrero'),
    cosecha: monthListToIndices('Diciembre - Abril'),
    dias_a_cosecha:[120,150],
    cosecha_recomendacion:'Desentierro papas cuando se seca la planta.' },

  { id:'pepino', nombre:'Pepino', icon:'cucumber', spacing_cm:60, sombra:'no',
    siembra: monthListToIndices('Agosto (protegido), Septiembre - Noviembre'),
    cosecha: monthListToIndices('Diciembre - Abril'),
    dias_a_cosecha:[100,130],
    cosecha_recomendacion:'Fruto tierno tamaño medio (según variedad).' },

  { id:'perejil', nombre:'Perejil', icon:'parsley', spacing_cm:35, sombra:'poco',
    siembra: monthListToIndices('Febrero - Marzo, Septiembre - Octubre'),
    cosecha: monthListToIndices('Todo el año'),
    dias_a_cosecha:[60,90],
    cosecha_recomendacion:'Corto hojas tiernas a 5 cm del suelo. Hago atados.' },

  { id:'pimiento', nombre:'Pimiento', icon:'pepper', spacing_cm:42, sombra:'sí',
    siembra: monthListToIndices('Julio - Agosto (protegido), Septiembre'),
    cosecha: monthListToIndices('Enero - Abril'),
    dias_a_cosecha:[180,200],
    cosecha_recomendacion:'Fruto en el punto de madurez deseado.' },

  { id:'puerro', nombre:'Puerro', icon:'leek', spacing_cm:8, sombra:'poco',
    siembra: monthListToIndices('Febrero - Mayo, Agosto - Septiembre'),
    cosecha: monthListToIndices('Marzo - Noviembre'),
    dias_a_cosecha:[120,150],
    cosecha_recomendacion:'Planta entera con raíz, antes que florezca.' },

  { id:'rabanito', nombre:'Rabanito', icon:'radish', spacing_cm:5, sombra:'no',
    siembra: monthListToIndices('Febrero - Junio, Septiembre - Diciembre'),
    cosecha: monthListToIndices('Todo el año'),
    dias_a_cosecha:[30,40],
    cosecha_recomendacion:'Raíz tierna, antes que se ahueque.' },

  { id:'radicheta', nombre:'Radicheta', icon:'chicory', spacing_cm:32, sombra:'sí',
    siembra: monthListToIndices('Agosto - Octubre, Febrero - Mayo'),
    cosecha: monthListToIndices('Todo el año'),
    dias_a_cosecha:[80,100],
    cosecha_recomendacion:'Hojas tiernas al ras del suelo; cortes frecuentes.' },

  { id:'remolacha', nombre:'Remolacha', icon:'beet', spacing_cm:9, sombra:'poco',
    siembra: monthListToIndices('Agosto - Diciembre, Marzo - Junio'),
    cosecha: monthListToIndices('Enero - Mayo, Septiembre - Diciembre'),
    dias_a_cosecha:[100,130],
    cosecha_recomendacion:'Raíz formada antes que florezca.' },

  { id:'repollo', nombre:'Repollo', icon:'cabbage', spacing_cm:45, sombra:'no',
    siembra: monthListToIndices('Febrero - Abril, Septiembre - Noviembre'),
    cosecha: monthListToIndices('Octubre - Enero'),
    dias_a_cosecha:[120,150],
    cosecha_recomendacion:'Cabezas de hojas duras y apretadas.' },

  { id:'rucula', nombre:'Rúcula', icon:'arugula', spacing_cm:35, sombra:'sí',
    siembra: monthListToIndices('Agosto (protegido), Septiembre - Octubre'),
    cosecha: monthListToIndices('Mayo - Diciembre'),
    dias_a_cosecha:[60,80],
    cosecha_recomendacion:'Hojas tiernas a 5 cm. Hacer atados.' },

  { id:'tomate', nombre:'Tomate', icon:'tomato', spacing_cm:30, sombra:'no',
    siembra: monthListToIndices('Julio - Agosto (almácigo), Septiembre - Octubre'),
    cosecha: monthListToIndices('Diciembre - Abril'),
    dias_a_cosecha:[120,150],
    cosecha_recomendacion:'Fruto en el punto de madurez deseado.' },

  { id:'zanahoria', nombre:'Zanahoria', icon:'carrot', spacing_cm:6, sombra:'no',
    siembra: monthListToIndices('Diciembre - Abril, Mayo - Noviembre'),
    cosecha: monthListToIndices('Agosto - Diciembre, Enero - Abril'),
    dias_a_cosecha:[150,180],
    cosecha_recomendacion:'Raíz formada antes que se vaya en vicio.' },

  { id:'zapallo-cayote', nombre:'Zapallo y cayote', icon:'pumpkin', spacing_cm:120, sombra:'no',
    siembra: monthListToIndices('Agosto (protegido), Septiembre - Noviembre'),
    cosecha: monthListToIndices('Enero - Mayo'),
    dias_a_cosecha:[150,180],
    cosecha_recomendacion:'Fruto maduro, cabito seco.' },

  { id:'zapallito-zucchini', nombre:'Zapallito y zucchini', icon:'zucchini', spacing_cm:90, sombra:'no',
    siembra: monthListToIndices('Agosto (protegido), Septiembre - Enero'),
    cosecha: monthListToIndices('Diciembre - Abril'),
    dias_a_cosecha:[90,100],
    cosecha_recomendacion:'Fruto tierno tamaño medio, semillas tiernas (según variedad).' }
];
