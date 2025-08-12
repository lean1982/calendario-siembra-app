export default function CropCard({ c }) {
  if (!c) return null;
  return (
    <div className="border rounded p-3 mb-2 shadow hover:shadow-md transition flex gap-3 items-start">
      <img
        src={`/icons/${c.slug}.svg`}
        alt={c.name}
        className="icono svg-green w-7 h-7 md:w-8 md:h-8 shrink-0 mt-1"
        onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src='/icons/strawberry.svg'; }}
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold">{c.name}</h3>
        <p className="text-sm"><strong>Siembra:</strong> {Array.isArray(c.months) ? c.months.join(", ") : c.months}</p>
        <p className="text-sm"><strong>Exposición:</strong> {c.sun}</p>
        <p className="text-sm"><strong>Días a cosecha:</strong> {c.harvest_after_days}</p>
        <p className="text-sm"><strong>Cómo cosechar:</strong> {c.harvest_tips}</p>
        <p className="text-sm"><strong>Distancia entre plantas:</strong> {c.spacing_cm} cm</p>
      </div>
    </div>
  );
}
