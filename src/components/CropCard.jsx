import React from 'react'
import { iconFor } from '../utils/iconMap'

export default function CropCard({ cultivo }) {
  const icon = iconFor(cultivo.nombre)

  return (
    <div className="flex gap-4 py-6">
      {/* Icono a la izquierda */}
      <div className="shrink-0" style={{width: '90px'}}>
        <span
          className="mask-green"
          style={{
            width: '90px',
            height: '90px',
            WebkitMaskImage: `url(${icon})`,
            maskImage: `url(${icon})`,
          }}
          aria-hidden
        />
      </div>

      {/* Texto */}
      <div className="flex-1 border-b border-neutral-200 pb-6">
        <h3 className="text-2xl font-semibold text-brand mb-1">{cultivo.nombre}</h3>
        <p className="text-neutral-600"><strong>Siembra:</strong> {cultivo.siembra?.join(', ') || '—'}</p>
        {cultivo.cosecha && (
          <p className="text-neutral-600"><strong>Cosecha estimada:</strong> {cultivo.cosecha}</p>
        )}
        {cultivo.diasCosecha && (
          <p className="text-neutral-600"><strong>Días hasta cosecha:</strong> {cultivo.diasCosecha}</p>
        )}
        {cultivo.solSombra && (
          <p className="text-neutral-600"><strong>Sol/sombra:</strong> {cultivo.solSombra}</p>
        )}
        {cultivo.distancia && (
          <p className="text-neutral-600"><strong>Distancia entre plantas:</strong> {cultivo.distancia}</p>
        )}
        {cultivo.riego && (
          <p className="text-neutral-600"><strong>Riego:</strong> {cultivo.riego}</p>
        )}
      </div>
    </div>
  )
}
