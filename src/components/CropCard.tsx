
import type { Crop } from '../data/crops';
import { MONTHS_ES } from '../utils/months';

type Props = { crop: Crop };

export default function CropCard({ crop }: Props) {
  const meses = (arr: number[]) => arr.map(i => MONTHS_ES[i]).join(', ');
  return (
    <div className="result">
      <div>
        <img src={`/icons/${crop.icon}.svg`} alt={crop.nombre} width="56" height="56" />
      </div>
      <div>
        <h3>{crop.nombre}</h3>
        <p><strong>Siembra:</strong> {meses(crop.siembra)}</p>
        <p><strong>Cosecha estimada:</strong> {meses(crop.cosecha)}</p>
        {crop.dias_a_cosecha && (
          <p><strong>Días a cosecha:</strong> {crop.dias_a_cosecha[0]}–{crop.dias_a_cosecha[1]} días</p>
        )}
        <div className="row">
          <span className="badge">Distancia entre plantas: {crop.spacing_cm} cm</span>
          <span className="badge">Sombra: {crop.sombra}</span>
        </div>
        {crop.semillas_como && (
          <p><small className="muted"><strong>Semillas:</strong> {crop.semillas_como}</small></p>
        )}
      </div>
    </div>
  );
}
