
export type Crop = {
  id: string;           // slug (es)
  nombre: string;       // nombre en español
  icon: string;         // nombre del svg en inglés (sin .svg)
  spacing_cm: number;   // distancia entre plantas
  sombra: 'sí' | 'no' | 'poco';
  siembra: number[];    // meses (0-11)
  cosecha: number[];    // meses (0-11)
  dias_a_cosecha?: [number, number]; // rango
  semillas_como?: string; // cómo cosechar semillas (texto corto)
};

import { monthListToIndices } from '../utils/months';

/**
 * Dataset normalizado desde el cuadro "Planificador ProHuerta".
 * Nota: Algunas entradas simplifican rangos y textos para uso práctico en la app.
 * Podés extender/ajustar cualquiera.
 */
export const CROPS: Crop[] = [
  { id:'acelga', nombre:'Acelga', icon:'chard', spacing_cm:18, sombra:'sí',
    siembra: monthListToIndices('Todo el año excepto enero y julio'),
    cosecha: monthListToIndices('Todo el año'),
    dias_a_cosecha:[60,80], semillas_como:'Cortar tallos florales cuando se secan.' },

  { id:'ajo', nombre:'Ajo', icon:'garlic', spacing_cm:12, sombra:'poco',
    siembra: monthListToIndices('Marzo - Mayo'),
    cosecha: monthListToIndices('Noviembre - Diciembre, Enero'),
    dias_a_cosecha:[250,270], semillas_como:'Guardar las mejores cabezas para semilla.' },

  { id:'albahaca', nombre:'Albahaca', icon:'basil', spacing_cm:22, sombra:'poco',
    siembra: monthListToIndices('Almácigo: Agosto, Siembra directa: Septiembre - Noviembre'),
    cosecha: monthListToIndices('Noviembre - Abril'),
    dias_a_cosecha:[80,100], semillas_como:'Cortar varas florales antes de que abran.' },

  { id:'apio', nombre:'Apio', icon:'celery', spacing_cm:22, sombra:'sí',
    siembra: monthListToIndices('Septiembre - Diciembre, Enero - Marzo'),
    cosecha: monthListToIndices('Diciembre - Abril, Agosto - Septiembre'),
    dias_a_cosecha:[120,150], semillas_como:'Ídem perejil.' },

  { id:'arveja', nombre:'Arveja', icon:'pea', spacing_cm:8, sombra:'poco',
    siembra: monthListToIndices('Marzo - Agosto'),
    cosecha: monthListToIndices('Julio - Noviembre'),
    dias_a_cosecha:[120,150], semillas_como:'Plantas con vainas pardo-amarillentas.' },

  { id:'batata', nombre:'Batata', icon:'sweet-potato', spacing_cm:35, sombra:'medio',
    siembra: monthListToIndices('Julio - Agosto (almácigo), Septiembre - Octubre (plantación)'),
    cosecha: monthListToIndices('Abril - Mayo'),
    dias_a_cosecha:[250,270], semillas_como:'Batutitas; guardar en lugar fresco y seco.' },

  { id:'berenjena', nombre:'Berenjena', icon:'eggplant', spacing_cm:45, sombra:'no',
    siembra: monthListToIndices('Almácigo: Julio - Agosto; Trasplante: Septiembre - Octubre'),
    cosecha: monthListToIndices('Febrero - Mayo'),
    dias_a_cosecha:[150,180], semillas_como:'Frutos muy maduros (marrón-amarillo).' },

  { id:'brocoli-coliflor', nombre:'Brócoli y coliflor', icon:'broccoli', spacing_cm:45, sombra:'no',
    siembra: monthListToIndices('Septiembre - Octubre, Febrero - Abril'),
    cosecha: monthListToIndices('Noviembre - Enero'),
    dias_a_cosecha:[250,270], semillas_como:'Cabezas florales cuando abren primeros capullos.' },

  { id:'cebolla', nombre:'Cebolla', icon:'onion', spacing_cm:12, sombra:'poco',
    siembra: monthListToIndices('Febrero - Abril'),
    cosecha: monthListToIndices('Noviembre - Diciembre, Enero'),
    dias_a_cosecha:[250,270], semillas_como:'Cortar cabezas florales al abrir capullos.' },

  { id:'chaucha', nombre:'Chaucha (enana y de rama)', icon:'green-beans', spacing_cm:25, sombra:'no',
    siembra: monthListToIndices('Fin de verano - Otoño - Primavera'),
    cosecha: monthListToIndices('Junio - Agosto, Diciembre - Febrero'),
    dias_a_cosecha:[90,120], semillas_como:'Frutos amarillos o secos antes de abrir.' },

  { id:'choclo', nombre:'Choclo', icon:'corn', spacing_cm:32, sombra:'no',
    siembra: monthListToIndices('Agosto (protegido), Septiembre - Enero'),
    cosecha: monthListToIndices('Enero - Abril'),
    dias_a_cosecha:[100,130], semillas_como:'Secar choclos en planta; descartar punta/base.' },

  { id:'esparrago', nombre:'Espárrago', icon:'asparagus', spacing_cm:28, sombra:'medio',
    siembra: monthListToIndices('Agosto - Septiembre'),
    cosecha: monthListToIndices('Octubre - Diciembre'),
    dias_a_cosecha:[365*4, 365*4], semillas_como:'Frutos rojos maduros; extraer semilla.' },

  { id:'espinaca', nombre:'Espinaca', icon:'spinach', spacing_cm:8, sombra:'poco',
    siembra: monthListToIndices('Febrero - Junio'),
    cosecha: monthListToIndices('Agosto - Octubre'),
    dias_a_cosecha:[80,90], semillas_como:'Plantas enteras amarillentas.' },

  { id:'frutilla', nombre:'Frutilla', icon:'strawberry', spacing_cm:25, sombra:'poco',
    siembra: monthListToIndices('Abril - Mayo'),
    cosecha: monthListToIndices('Octubre - Diciembre'),
    dias_a_cosecha:[150,180], semillas_como:'Frutos maduros; multiplicación por estolones.' },

  { id:'haba', nombre:'Haba', icon:'broad-bean', spacing_cm:28, sombra:'medio',
    siembra: monthListToIndices('Marzo - Junio'),
    cosecha: monthListToIndices('Septiembre - Diciembre'),
    dias_a_cosecha:[180,200], semillas_como:'Vainas secas o casi amarillentas.' },

  { id:'hinojo', nombre:'Hinojo', icon:'fennel', spacing_cm:32, sombra:'poco',
    siembra: monthListToIndices('Enero - Abril'),
    cosecha: monthListToIndices('Julio - Octubre'),
    dias_a_cosecha:[150,180], semillas_como:'Ídem perejil/zanahoria.' },

  { id:'lechuga-escarola', nombre:'Lechuga y escarola', icon:'lettuce', spacing_cm:18, sombra:'sí',
    siembra: monthListToIndices('Julio - Agosto, Agosto - Diciembre, Febrero - Junio'),
    cosecha: monthListToIndices('Todo el año'),
    dias_a_cosecha:[60,90], semillas_como:'Cortar planta entera cuando abren panaderos.' },

  { id:'melon-sandia', nombre:'Melón y sandía', icon:'melon', spacing_cm:85, sombra:'no',
    siembra: monthListToIndices('Agosto (protegido), Septiembre - Octubre'),
    cosecha: monthListToIndices('Enero - Abril'),
    dias_a_cosecha:[130,180], semillas_como:'Semillas por flotación de frutos maduros.' },

  { id:'papa', nombre:'Papa', icon:'potato', spacing_cm:25, sombra:'medio',
    siembra: monthListToIndices('Agosto - Septiembre, Enero - Febrero'),
    cosecha: monthListToIndices('Diciembre - Abril'),
    dias_a_cosecha:[120,150], semillas_como:'Desenterrar cuando se seca la planta.' },

  { id:'pepino', nombre:'Pepino', icon:'cucumber', spacing_cm:60, sombra:'no',
    siembra: monthListToIndices('Agosto (protegido), Septiembre - Noviembre'),
    cosecha: monthListToIndices('Diciembre - Abril'),
    dias_a_cosecha:[100,130], semillas_como:'Dejar madurar frutos completamente.' },

  { id:'perejil', nombre:'Perejil', icon:'parsley', spacing_cm:35, sombra:'poco',
    siembra: monthListToIndices('Febrero - Marzo, Septiembre - Octubre'),
    cosecha: monthListToIndices('Todo el año'),
    dias_a_cosecha:[60,90], semillas_como:'Ídem zanahoria.' },

  { id:'pimiento', nombre:'Pimiento', icon:'pepper', spacing_cm:42, sombra:'sí',
    siembra: monthListToIndices('Julio - Agosto (protegido), Septiembre'),
    cosecha: monthListToIndices('Enero - Abril'),
    dias_a_cosecha:[180,200], semillas_como:'Semillas de frutos maduros.' },

  { id:'puerro', nombre:'Puerro', icon:'leek', spacing_cm:8, sombra:'poco',
    siembra: monthListToIndices('Febrero - Mayo, Agosto - Septiembre'),
    cosecha: monthListToIndices('Marzo - Noviembre'),
    dias_a_cosecha:[120,150], semillas_como:'Cortar cabitos florales al abrir capullos.' },

  { id:'rabanito', nombre:'Rabanito', icon:'radish', spacing_cm:5, sombra:'no',
    siembra: monthListToIndices('Febrero - Junio, Septiembre - Diciembre'),
    cosecha: monthListToIndices('Todo el año'),
    dias_a_cosecha:[30,40], semillas_como:'Plantas enteras secas (dejar ir en vicio).' },

  { id:'radicheta', nombre:'Radicheta', icon:'chicory', spacing_cm:32, sombra:'sí',
    siembra: monthListToIndices('Agosto - Octubre, Febrero - Mayo'),
    cosecha: monthListToIndices('Todo el año'),
    dias_a_cosecha:[80,100], semillas_como:'Plantas enteras amarillentas.' },

  { id:'remolacha', nombre:'Remolacha', icon:'beet', spacing_cm:9, sombra:'poco',
    siembra: monthListToIndices('Agosto - Diciembre, Marzo - Junio'),
    cosecha: monthListToIndices('Enero - Mayo, Septiembre - Diciembre'),
    dias_a_cosecha:[100,130], semillas_como:'Cortar tallos florales cuando se secan.' },

  { id:'repollo', nombre:'Repollo', icon:'cabbage', spacing_cm:45, sombra:'no',
    siembra: monthListToIndices('Febrero - Abril, Septiembre - Noviembre'),
    cosecha: monthListToIndices('Octubre - Enero'),
    dias_a_cosecha:[120,150], semillas_como:'Ídem repollitos de Bruselas.' },

  { id:'rucula', nombre:'Rúcula', icon:'arugula', spacing_cm:35, sombra:'sí',
    siembra: monthListToIndices('Agosto (protegido), Septiembre - Octubre'),
    cosecha: monthListToIndices('Mayo - Diciembre'),
    dias_a_cosecha:[60,80], semillas_como:'Plantas con frutos amarillos antes de abrir.' },

  { id:'tomate', nombre:'Tomate', icon:'tomato', spacing_cm:30, sombra:'no',
    siembra: monthListToIndices('Julio - Agosto (almácigo), Septiembre - Octubre'),
    cosecha: monthListToIndices('Diciembre - Abril'),
    dias_a_cosecha:[120,150], semillas_como:'Fermentar, lavar y secar semillas de frutos maduros.' },

  { id:'zanahoria', nombre:'Zanahoria', icon:'carrot', spacing_cm:6, sombra:'no',
    siembra: monthListToIndices('Diciembre - Abril, Mayo - Noviembre'),
    cosecha: monthListToIndices('Agosto - Diciembre, Enero - Abril'),
    dias_a_cosecha:[150,180], semillas_como:'Cortar cabezuelas amarillento-amarronadas.' },

  { id:'zapallo-cayote', nombre:'Zapallo y cayote', icon:'pumpkin', spacing_cm:120, sombra:'no',
    siembra: monthListToIndices('Agosto (protegido), Septiembre - Noviembre'),
    cosecha: monthListToIndices('Enero - Mayo'),
    dias_a_cosecha:[150,180], semillas_como:'Dejar madurar frutos; fermentar y limpiar semillas.' },

  { id:'zapallito-zucchini', nombre:'Zapallito y zucchini', icon:'zucchini', spacing_cm:90, sombra:'no',
    siembra: monthListToIndices('Agosto (protegido), Septiembre - Enero'),
    cosecha: monthListToIndices('Diciembre - Abril'),
    dias_a_cosecha:[90,100], semillas_como:'Dejar madurar frutos completamente.' }
];
