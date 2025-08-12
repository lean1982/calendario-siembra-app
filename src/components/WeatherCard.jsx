import React, { useEffect, useState } from 'react'
import axios from 'axios'

// Mapea códigos de OpenWeather a iconos simples (sol, nubes, lluvia).
function simpleIcon(code) {
  // code: e.g. '01d','02d','10d'...
  const n = code?.slice(0,2)
  switch(n) {
    case '01': return '☀️'
    case '02': return '🌤️'
    case '03': return '☁️'
    case '04': return '☁️'
    case '09': return '🌧️'
    case '10': return '🌦️'
    case '11': return '⛈️'
    case '13': return '❄️'
    case '50': return '🌫️'
    default: return '☀️'
  }
}

function dowLabel(ts) {
  const d = new Date(ts * 1000)
  // ES: L M M J V S D
  return ['D','L','M','M','J','V','S'][d.getDay()]
}

export default function WeatherCard({ geo }) {
  const [data, setData] = useState(null)
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState('')

  const key = import.meta.env.VITE_OPENWEATHER_KEY

  useEffect(() => {
    if (!geo || !key) return
    const { latitude: lat, longitude: lon } = geo
    async function run() {
      try {
        setError('')
        // Actual
        const nowRes = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: { lat, lon, units: 'metric', lang: 'es', appid: key }
        })
        setData(nowRes.data)

        // Pronóstico 5 días (cada 3 hs). Tomamos 1 por día (alrededor del mediodía).
        const fcRes = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
          params: { lat, lon, units: 'metric', lang: 'es', appid: key }
        })
        const byDay = {}
        fcRes.data.list.forEach(item => {
          const date = new Date(item.dt * 1000)
          const dayKey = date.toISOString().slice(0,10)
          // Si es alrededor de 12:00 prefiero ese
          const hour = date.getHours()
          const score = Math.abs(hour - 12)
          if (!byDay[dayKey] || score < byDay[dayKey].score) {
            byDay[dayKey] = { score, item }
          }
        })
        const days = Object.values(byDay).slice(0,7).map(x => x.item)
        setForecast(days)
      } catch (e) {
        console.error(e)
        setError('No se pudo cargar el clima.')
      }
    }
    run()
  }, [geo, key])

  if (!data) return (
    <div className="border rounded-2xl p-4">
      <p className="text-neutral-600">Cargando clima…</p>
    </div>
  )

  const icon = simpleIcon(data.weather?.[0]?.icon)
  const city = data.name
  const temp = Math.round(data.main?.temp)

  return (
    <div className="border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-2xl font-semibold">{city || ''}</div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-6xl">{temp}°</div>
        <div className="text-6xl" aria-hidden>{icon}</div>
        <div className="ml-auto text-neutral-600">
          {data.weather?.[0]?.description || ''}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 text-center">
        {forecast.map((f, idx) => (
          <div key={idx} className="flex flex-col items-center w-8">
            <div className="text-lg">{simpleIcon(f.weather?.[0]?.icon)}</div>
            <div className="text-xs text-neutral-500">{dowLabel(f.dt)}</div>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </div>
  )
}
