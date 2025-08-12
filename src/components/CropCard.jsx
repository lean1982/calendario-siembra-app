import { withFallbackIcon, iconPathFor } from "../helpers/icons";

export default function CropCard({ c }) {
  return (
    <div className="border rounded p-3 mb-3 shadow hover:shadow-md transition flex gap-4">
      <img
        src={iconPathFor(c.slug)}
        alt={c.name}
        className="w-16 h-16 shrink-0 icon-green"
        ref={(img) => img && withFallbackIcon(img)}
      />
      <div>
        <h3 className="text-lg font-bold text-[#22d500]">{c.name}</h3>
        <p><strong>Siembra:</strong> {Array.isArray(c.months) ? c.months.join(", ") : c.months}</p>
        <p><strong>Exposición:</strong> {c.sun}</p>
        <p><strong>Días a cosecha:</strong> {c.harvest_after_days}</p>
        <p><strong>Cómo cosechar:</strong> {c.harvest_tips}</p>
        <p><strong>Distancia entre plantas:</strong> {c.spacing_cm} cm</p>
      </div>
    </div>
  );
}
