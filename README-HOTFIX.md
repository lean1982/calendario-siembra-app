# OpenFarm Hotfix (sin cambiar diseño)

Este paquete **no toca tu `App.jsx`** ni el diseño.
Incluye:
- `src/services/openfarm.js` con la URL correcta y mejor manejo de errores.
- `api/openfarm.js` (opcional) para usar como proxy en Vercel si hubiera problemas de CORS/rate‑limit.

## 1) Qué hacer ahora (parche mínimo)
1. Copiá `src/services/openfarm.js` a tu proyecto, reemplazando el existente.
2. (Opcional pero recomendado) En tu `App.jsx`, cambiá el `catch` de la búsqueda OpenFarm para ver el error real:
   ```js
   } catch (err) {
     setOfError(`No pudimos buscar en OpenFarm. ${err.message}`);
   }
   ```
3. Subí a GitHub:
   ```bash
   git add src/services/openfarm.js
   git commit -m "Hotfix OpenFarm: URL y errores claros"
   git push
   ```
Vercel va a desplegar y tu **diseño queda intacto**.

## 2) Si seguís con error (Plan B: proxy en Vercel)
1. Copiá `api/openfarm.js` en la **raíz** del proyecto (al lado de package.json).
2. En `src/services/openfarm.js`, reemplazá la línea de URL por:
   ```js
   const url = `/api/openfarm?q=${encodeURIComponent(query.trim())}`;
   ```
3. Subí a GitHub y Vercel desplegará el API Route y la app.

## Notas
- El endpoint correcto es `https://openfarm.cc/api/v1/crops?filter=<texto>`
- Si OpenFarm devuelve un código (por ejemplo 429), ahora lo vas a ver en pantalla.
