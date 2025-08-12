import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import WeatherCard from './components/WeatherCard.jsx'
import CropCard from './components/CropCard.jsx'
import data from './data/huerta.json'

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

function capitalizar(str='') {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default function App(){
  const [mes, setMes] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [geo, setGeo] = useState(null)

  // Geolocalización al cargar (solo para clima)
  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGeo(pos.coords),
        () => setGeo(null),
        { enableHighAccuracy: true, timeout: 8000 }
      )
    }
  }, [])

  const cultivosFiltrados = useMemo(() => {
    const m = mes.trim().toLowerCase()
    const byMonth = (c) => !m || (Array.isArray(c.siembra) && c.siembra.some(mm => mm.toLowerCase() === capitalizar(m).toLowerCase()))
    const byText = (c) => c.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
    return data.filter(c => byMonth(c) && byText(c))
  }, [mes, busqueda])

  const hoy = new Date()
  const mesActual = MESES[hoy.getMonth()]

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-brand my-6">
        Calendario de siembra y cosecha
      </h1>
      <p className="mb-4 text-neutral-700">
        Consultá qué sembrar y cuándo cosechar según tu ubicación y época del año.
      </p>

      <div className="flex flex-col gap-3 max-w-lg">
        <div>
          <label className="block mb-1 text-neutral-800">Mes</label>
          <input
            type="text"
            placeholder={capitalizar(mesActual)}
            value={mes}
            onChange={(e)=> setMes(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-neutral-800">Ubicación</label>
          <input
            type="text"
            placeholder="Ciudad o barrio (opcional)"
            className="border px-3 py-2 rounded w-full"
            // es visual; el clima usa geolocalización
            onChange={()=>{}}
          />
        </div>

        <div className="mt-2 max-w-md">
          <WeatherCard geo={geo} />
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">Podés sembrar:</h2>

      <div>
        {cultivosFiltrados.map(c => (
          <CropCard key={c.nombre} cultivo={c} />
        ))}
        {!cultivosFiltrados.length && (
          <p className="text-neutral-600">No encontramos cultivos para ese mes. Probá otra búsqueda.</p>
        )}
      </div>
    </div>
  )
}
