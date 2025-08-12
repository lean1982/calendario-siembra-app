import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import WeatherCard from './components/WeatherCard'
import CropCard from './components/CropCard'
import data from './data/huerta.json'

const BRAND = '#22d500'
const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function App(){
  const [mes, setMes] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [wx, setWx] = useState(null)

  useEffect(()=>{
    const now = new Date()
    setMes(meses[now.getMonth()])
  },[])

  useEffect(()=>{
    if(!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos)=>{
      const { latitude, longitude } = pos.coords
      try{
        const apiKey = import.meta.env.VITE_OPENWEATHER_KEY
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}&lang=es&exclude=minutely,hourly,alerts`
        const r = await axios.get(url)
        const cityRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=es`)
        const city = cityRes.data.name
        const cur = r.data.current
        const daily = r.data.daily.slice(0,7).map(d=>{
          const dt = new Date(d.dt*1000)
          const label = 'DLMMJVS'[dt.getDay()]
          const main = d.weather?.[0]?.main?.toLowerCase() || ''
          const icon = main.includes('rain') ? 'rain' : main.includes('cloud') ? 'cloud' : 'sun'
          return { label, icon }
        })
        const main = r.data.current.weather?.[0]?.main?.toLowerCase() || ''
        const icon = main.includes('rain') ? 'rain' : main.includes('cloud') ? 'cloud' : 'sun'
        setWx({ city, temp: cur.temp, description: r.data.current.weather?.[0]?.description, icon, week: daily })
        setUbicacion(city)
      }catch(e){ console.error(e)}
    })
  },[])

  const cultivos = useMemo(()=>{
    const m = mes?.toLowerCase()
    return data.filter(c=> !m || (c.siembra || []).some(mm => mm.toLowerCase()===m))
  },[mes])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="h1">Calendario de siembra y cosecha</h1>
      <p className="muted mt-2">Consultá qué sembrar y cuándo cosechar según tu ubicación y época del año.</p>

      <div className="mt-6">
        <label className="block mb-1 font-medium">Mes</label>
        <input className="border rounded-xl px-3 py-2 w-full" placeholder="Mes" value={mes} onChange={e=>setMes(e.target.value)} />
      </div>

      <div className="mt-4">
        <label className="block mb-1 font-medium">Ubicación</label>
        <input className="border rounded-xl px-3 py-2 w-full" placeholder="Ubicación" value={ubicacion} onChange={e=>setUbicacion(e.target.value)} />
      </div>

      <div className="mt-4">
        <WeatherCard {...wx}/>
      </div>

      <h2 className="h2 mt-8 mb-2">Podés sembrar:</h2>
      <div>
        {cultivos.map(c => <CropCard key={c.nombre} crop={c} />)}
      </div>
    </div>
  )
}
