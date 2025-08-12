import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import huerta from './data/huerta.json'
import { pickIcon } from './utils/iconMap'

const BRAND = '#22d500'

function useClima() {
  const [clima, setClima] = useState(null)
  useEffect(() => {
    const key = import.meta.env.VITE_OPENWEATHER_KEY
    if (!key || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords
        const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: { lat: latitude, lon: longitude, units: 'metric', appid: key, lang: 'es' }
        })
        setClima({ ciudad: data.name, temp: Math.round(data.main.temp), desc: data.weather?.[0]?.description ?? '' })
      } catch (e) {
        console.error('clima error', e)
      }
    })
  }, [])
  return clima
}

function IconMask({ name }) {
  const file = pickIcon(name)
  const style = {
    backgroundColor: BRAND,
    maskImage: `url(/icons/${file})`,
    WebkitMaskImage: `url(/icons/${file})`,
  }
  return <span className="crop-icon" style={style} aria-hidden="true" />
}

const meses = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function App() {
  const [mes, setMes] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const clima = useClima()

  const mesActual = useMemo(() => {
    const m = new Date().getMonth()+1
    return meses[m]
  }, [])

  const lista = useMemo(() => {
    const mesFiltro = (mes || mesActual)
    return huerta.filter(c => {
      const coincideMes = !mesFiltro || c.siembra.includes(mesFiltro) || c.siembra.includes('Todo el año')
      const coincideNombre = c.nombre.toLowerCase().includes(busqueda.toLowerCase())
      return coincideMes && coincideNombre
    })
  }, [mes, busqueda, mesActual])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[color:var(--brand)]">Calendario de siembra y cosecha</h1>
      <p className="text-gray-600 mt-2">Consultá qué sembrar y cuándo cosechar según tu ubicación y época del año.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        <div>
          <label className="block text-gray-700 mb-1">Mes</label>
          <input value={mes} onChange={e=>setMes(e.target.value)} placeholder="Mes"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--brand)]" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Buscar</label>
          <input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Tomate, Lechuga…"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--brand)]" />
        </div>
      </div>

      {clima && (
        <div className="card mt-5">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xl font-semibold">{clima.ciudad}</div>
              <div className="text-4xl font-bold text-[color:var(--brand)]">{clima.temp}°</div>
              <div className="text-gray-600 capitalize">{clima.desc}</div>
            </div>
            <div className="ml-auto">
              <span className="crop-icon" style={{backgroundColor: BRAND, maskImage:'url(/icons/strawberry.svg)', WebkitMaskImage:'url(/icons/strawberry.svg)'}} />
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-8 mb-3">Podés sembrar:</h2>

      <div className="space-y-4">
        {lista.map((c) => (
          <div key={c.nombre} className="flex items-start gap-4 border rounded-xl p-4 hover:shadow-sm transition">
            <IconMask name={c.nombre} />
            <div>
              <h3 className="text-2xl font-bold text-[color:var(--brand)]">{c.nombre}</h3>
              <p className="text-gray-700"><strong>Siembra:</strong> {c.siembra.join(', ')}</p>
              <p className="text-gray-700"><strong>Luz:</strong> {c.sol}</p>
              <p className="text-gray-700"><strong>Días a cosecha:</strong> {c.diasCosecha}</p>
              <p className="text-gray-700"><strong>Cómo cosechar:</strong> {c.cosecha}</p>
              <p className="text-gray-700"><strong>Distancia entre plantas:</strong> {c.distancia}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
