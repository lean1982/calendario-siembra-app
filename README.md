
# Calendario de siembra y cosecha

Proyecto creado con Vite + React + TypeScript.

## Desarrollo
```bash
npm install
npm run dev
```

## Variables de entorno
Crear un archivo `.env` en la raíz con:

```
VITE_OPENWEATHER_KEY=TU_API_KEY
```

## Íconos
Colocar los archivos `.svg` en `public/icons/` y usar el campo `icon` de cada cultivo para mapear el archivo (sin extensión).


## Despliegue en Vercel (nota rápida)
- Asegurate de que el proyecto use Node 18 o 20 (este paquete lo declara en `engines`).
- En caso de fallos 126/permissions, probá:
  1) Borrar `node_modules` y `package-lock.json` localmente.
  2) `npm install` y commitear `package.json` y (si lo recreaste) el `package-lock.json`.
  3) En Vercel: Project → Settings → Build & Output → **Clear build cache** → Redeploy.
