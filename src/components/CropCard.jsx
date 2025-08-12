
/**
 * Reemplaza SOLO la línea del emoji por:
 *   <span className="icon" data-name={c.slug} aria-hidden="true"></span>
 * Mantiene tus clases (no cambiamos layout).
 */
export default function CropCard({ c }) {
  return (
    <div className="card">
      <div className="row">
        {/* Ícono coloreado por CSS, tamaño controlado */}
        <span className="icon" data-name={c.slug} aria-hidden="true"></span>
        <div className="content">
          <h3 className="titulo">{c.name}</h3>
          <p><strong>Siembra:</strong> {Array.isArray(c.months)? c.months.join(', '): c.months}</p>
          <p><strong>Exposición:</strong> {c.sun}</p>
          <p><strong>Días a cosecha:</strong> {c.harvest_after_days}</p>
          <p><strong>Cómo cosechar:</strong> {c.harvest_tips}</p>
          <p><strong>Distancia entre plantas:</strong> {c.spacing_cm} cm</p>
        </div>
      </div>
    </div>
  );
}
