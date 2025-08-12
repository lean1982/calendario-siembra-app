import React from 'react'
import { iconFor, FALLBACK_ICON } from '../utils/iconMap'

export default function CropCard({crop}){
  const src = iconFor(crop.nombre || crop.name)
  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      <img src={src} onError={(e)=>{e.currentTarget.src=FALLBACK_ICON}} alt="" className="w-16 h-16" />
      <div>
        <div className="text-2xl font-bold text-[color:var(--brand)]">{crop.nombre}</div>
        <div className="muted">Siembra: {crop.siembra?.join(', ') || '-'}</div>
        <div className="muted">Cosecha estimada: {crop.cosecha || '-'}</div>
        {crop.sol && <div className="muted">Luz: {crop.sol}</div>}
        {crop.distancia && <div className="muted">Distancia: {crop.distancia}</div>}
        {crop.riego && <div className="muted">Riego: {crop.riego}</div>}
      </div>
    </div>
  )
}
