# Calendario de Siembra (React + Vite + Tailwind)

## Cómo usar (PASO A PASO)

1) **Descargar este ZIP y descomprimirlo** en tu compu.
2) Abrí una terminal dentro de la carpeta.
3) Instalá dependencias:
```
npm install
```
4) Ejecutá en modo prueba (local):
```
npm run dev
```
Te va a mostrar una URL (por ejemplo `http://localhost:5173`). Abrila en el navegador.

## Subir a GitHub
1) Si aún no tenés un repo, crealo en GitHub.
2) En la carpeta del proyecto, corré:
```
git init
git add .
git commit -m "Primera versión responsive"
git branch -M main
git remote add origin <URL-DE-TU-REPO>
git push -u origin main
```
> Nota: El archivo `.env` **no se sube** (está ignorado por `.gitignore`).

## Vercel
- En tu proyecto de Vercel, andá a **Settings → Environment Variables** y agregá:
  - `VITE_OPENWEATHER_KEY` con tu clave.
- Hacé un nuevo deploy o redeploy, y listo.

## Edición rápida
- El archivo principal de la app es `src/App.jsx`.
