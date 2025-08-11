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

    // 2) Fallback: Wikipedia REST (sin token)
    // Lista inicial de cultivos comunes; si viene q, la usamos como filtro/título prioritario
    const baseTitles = [
      "Tomato", "Potato", "Onion", "Carrot", "Lettuce", "Spinach", "Broccoli", "Cabbage",
      "Strawberry", "Blueberry", "Raspberry", "Apple", "Pear", "Peach", "Pumpkin",
      "Zucchini", "Cucumber", "Garlic", "Ginger", "Pepper_(plant)", "Chili_pepper",
      "Corn", "Wheat", "Rice", "Oat", "Barley"
    ];

    let titles = baseTitles;
    if (query && query.length > 1) {
      // intentamos anteponer el query como título directo
      titles = [query, ...baseTitles];
    }

    // Traemos summaries en paralelo y normalizamos
    const uniq = Array.from(new Set(titles)).slice(0, 25);
    const results = await Promise.all(
      uniq.map(async (t) => {
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`;
        const r = await fetch(url, { headers: { Accept: "application/json" } });
        if (!r.ok) return null;
        const w = await r.json();
        // Filtrado simple: si no hay extract/título, descartamos
        if (!w?.title) return null;
        return {
          id: w.title,
          attributes: {
            name: w.title,
            binomial_name: "", // Wikipedia summary no siempre trae el nombre científico
            description: w.extract || "",
            main_image_url:
              w.originalimage?.source ||
              w.thumbnail?.source ||
              "",
          },
        };
      })
    );

    const data = results.filter(Boolean);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: "Proxy error", details: String(err?.message || err) });
  }
}
