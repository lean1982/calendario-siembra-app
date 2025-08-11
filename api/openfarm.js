// api/openfarm.js
export default async function handler(req, res) {
  try {
    const { q = "a" } = req.query;
    const query = String(q || "a").trim();

    // 1) Si hay Trefle_TOKEN en env, intentamos Trefle primero
    const TREFLE_TOKEN = process.env.TREFLE_TOKEN;
    if (TREFLE_TOKEN) {
      const trefleUrl = `https://trefle.io/api/v1/plants/search?token=${encodeURIComponent(
        TREFLE_TOKEN
      )}&q=${encodeURIComponent(query)}`;
      const r = await fetch(trefleUrl, { headers: { Accept: "application/json" } });
      if (r.ok) {
        const json = await r.json();
        const data = (json?.data || []).map((p) => ({
          id: String(p.id),
          attributes: {
            name: p.common_name || p.scientific_name || "",
            binomial_name: p.scientific_name || "",
            description: p.family_common_name ? `Familia: ${p.family_common_name}` : "",
            main_image_url:
              p.image_url ||
              (p.images && p.images[0]?.url) ||
              "",
          },
        }));
        return res.status(200).json({ data });
      }
      // Si Trefle falla, seguimos al fallback silenciosamente
    }

    // 2) Fallback: Wikipedia REST (sin token) — con español, límite y sin duplicados
const lang = (req.query.lang || "es").toString().toLowerCase(); // ej: es, en, pt
const limit = Math.min(parseInt(req.query.limit || "20", 10) || 20, 40); // hasta 40
const baseTitles = [
  "Tomate", "Papa", "Cebolla", "Zanahoria", "Lechuga", "Espinaca", "Brócoli", "Repollo",
  "Frutilla", "Arándano", "Frambuesa", "Manzana", "Pera", "Durazno", "Calabaza",
  "Zucchini", "Pepino", "Ajo", "Jengibre", "Ají", "Maíz", "Trigo", "Arroz", "Avena", "Cebada"
];

let titles = baseTitles;
if (query && query.length > 1) {
  titles = [query, ...baseTitles];
}

// Unicos + tope de resultados
const uniq = Array.from(new Set(titles)).slice(0, limit);

// Traemos summaries en paralelo del idioma elegido
const results = await Promise.all(
  uniq.map(async (t) => {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`;
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    if (!r.ok) return null;
    const w = await r.json();
    if (!w?.title || (!w?.extract && !w?.description)) return null;

    return {
      id: w.title,
      attributes: {
        name: w.title,
        binomial_name: "", // Wikipedia summary no siempre trae nombre científico
        description: w.extract || w.description || "",
        main_image_url: w.originalimage?.source || w.thumbnail?.source || ""
      }
    };
  })
);

// Quitar nulos y duplicados por título (por las dudas)
const seen = new Set();
const data = [];
for (const item of results) {
  if (!item) continue;
  if (seen.has(item.id)) continue;
  seen.add(item.id);
  data.push(item);
}

return res.status(200).json({ data });

