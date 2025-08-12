
import React from 'react';
import { iconFor } from '../utils/iconMap';
import '../styles/icons.css';

export default function CropCard({ item }){
  const {
    nombre,
    siembra = [],
    cosecha = '',
    riego = '',
    sol_sombra = '',
    dias_cosecha = '',
    como_cosechar = '',
    distancia = ''
  } = item;

  return (
    <div className="crop-card border-b border-neutral-100 pb-6 mb-6">
      <img
        src={iconFor(nombre)}
        alt=""
        aria-hidden="true"
        className="crop-icon select-none"
        loading="lazy"
      />
      <div className="flex-1">
        <h3 className="crop-title text-2xl md:text-3xl mb-1">{nombre}</h3>
        <div className="crop-meta text-sm md:text-base">
          {siembra.length > 0 && (
            <p><strong>Siembra:</strong> {siembra.join(', ')}</p>
          )}
          {cosecha && (
            <p><strong>Cosecha estimada:</strong> {cosecha}</p>
          )}
          {dias_cosecha && (
            <p><strong>Días hasta cosecha:</strong> {dias_cosecha}</p>
          )}
          {sol_sombra && (
            <p><strong>Ubicación:</strong> {sol_sombra}</p>
          )}
          {distancia && (
            <p><strong>Distancia entre plantas:</strong> {distancia}</p>
          )}
          {riego && (
            <p><strong>Riego:</strong> {riego}</p>
          )}
          {como_cosechar && (
            <p><strong>Cómo cosechar:</strong> {como_cosechar}</p>
          )}
        </div>
      </div>
    </div>
  );
}
