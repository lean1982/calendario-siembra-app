export default function CropCard({ c }) {
  return (
    <div className="card border rounded p-3 mb-3 shadow hover:shadow-md transition flex gap-4">
      <img
        src={`/icons/${c.slug}.svg`}
        alt={c.name}
        className="icono w-16 h-16 shrink-0"
        onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src='/icons/strawberry.svg'; }}
      />
      <div className="contenido">
        <h3 className="titulo text-lg font-bold text-[#22d500]">{c.name}</h3>
        <p><strong>Siembra:</strong> {Array.isArray(c.months) ? c.months.join(", ") : c.months}</p>
        <p><strong>Exposición:</strong> {c.sun}</p>
        <p><strong>Días a cosecha:</strong> {c.harvest_after_days}</p>
        <p><strong>Cómo cosechar:</strong> {c.harvest_tips}</p>
        <p><strong>Distancia entre plantas:</strong> {c.spacing_cm} cm</p>
      </div>
    </div>
  );
}
