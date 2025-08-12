// Convert a CSV (exported from Google Sheets) to src/data/huerta.json
import fs from 'fs'
const [,,csvPath] = process.argv
if(!csvPath){ console.error('Uso: npm run sheet:import ruta/al/archivo.csv'); process.exit(1) }
const csv = fs.readFileSync(csvPath,'utf8').trim()
const [header,...rows] = csv.split(/\r?\n/).map(l=>l.split(','))
const idx = Object.fromEntries(header.map((h,i)=>[h.trim().toLowerCase(), i]))
const out = rows.map(r=> ({
  nombre: r[idx['nombre']]?.trim(),
  siembra: r[idx['siembra']]?.split('|').map(s=>s.trim()).filter(Boolean),
  cosecha: r[idx['cosecha']]?.trim(),
  sol: r[idx['sol/sombra']]?.trim(),
  distancia: r[idx['distancia']]?.trim(),
  riego: r[idx['riego']]?.trim()
})).filter(x=>x.nombre)
fs.writeFileSync('src/data/huerta.json', JSON.stringify(out, null, 2))
console.log('Generado src/data/huerta.json con', out.length, 'cultivos')
