# Calendario de siembra y cosecha (pack diseño aprobado)

- Diseño limpio con título verde (#22d500) y lista de cultivos con icono a la izquierda.
- Tarjeta de clima con icono grande y fila de próximos días.
- Filtrado por **mes de siembra** (no cosecha).

## Variables de entorno (Vercel)
- `VITE_OPENWEATHER_KEY` (requerida)

## Estructura de datos
Editar `src/data/huerta.json` para agregar todos los cultivos. El archivo `src/utils/iconMap.js` mapea nombres a archivos SVG dentro de `public/icons`. Si no existe, se usa `strawberry.svg`.

