// api/openfarm.js

// Fuerza runtime Node (no Edge)
export const config = { runtime: "nodejs20.x" };

const withTimeout = async (promise, ms = 10000, label = "timeout") => {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await promise(ctrl.signal);
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    e._label = label;
    throw e;
  }
};

const uniqBy = (arr, keyFn) => {
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const k = keyFn(it);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(it);
  }
  return out;
};

export default async function handler(req, res) {
  const started = Date.now();
  const debug = req.query.debug === "1";
  const info = [];

  try {
    const { q = "a" } = req.query;
    const lang = (req.query.lang || "es").toString().toLowerCase();
    const limit = Math.min(parseInt(req.query.limit || "20", 10) || 20, 40);
    const query = String(q || "a").trim();

    // 1) Trefle (opcional si seteás TREFLE_TOKEN)
    const TREFLE_TOKEN = process.env.TREFLE_TOKEN;
    if (TREFLE_TOKEN) {
      try {
        const trefleUrl = `https://trefle.io/api/v1/plants/search?token=${encodeURIComponent(
          TREFLE_TOKEN
        )}&q=${encodeURIComponent(query)}`;

        const r = await withTimeout(
          (signal) =>
            fetch(trefleUrl, {
              signal,
              headers: {
                Accept: "application/json",
                "User-Agent": "calendario-siembra-app (vercel function)",
              },
            }),
          10000,
          "trefle"
        );

        if (r.ok) {
          const json = await r.json();
          const data = (json?.data || []).map((p) => ({
            id: String(p.id),
            attributes: {
              name: p.common_name || p.scientific_name || "",
              binomial_name: p.scientific_name || "",
              description: p.family_common_name ? `Familia: ${p.family_common_name}` : "",
              main_image_url:
                p.image_url || (p.images && p.images[0]?.url) || "",
            },
          }));
          if (debug) info.push({ source: "trefle", count: data.length });
          res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
          return res.status(200).json({ data, _ms: Date.now() - started, _info: debug ? info : undefined });
        } else {
          if (debug) info.push({ source: "trefle", status: r.status });
        }
      } catch (e) {
        console.error("Trefle error:", e?.message || e);
        if (debug) info.push({ source: "trefle", error: e?.message || String(e), label: e?._label });
      }
      // si Trefle falla, caemos al fallback silenciosamente
    }

    // 2) Fallback Wikipedia (REST) – idioma, límite y sin duplicados
    const baseTitles = [
      "Tomate","Papa","Cebolla","Zanahoria","Lechuga","Espinaca","Brócoli","Repollo",
      "Frutilla","Arándano","Frambuesa","Manzana","Pera","Durazno","Calabaza",
      "Zucchini","Pepino","Ajo","Jengibre","Ají","Maíz","Trigo","Arroz","Avena","Cebada"
    ];
    let titles = baseTitles;
    if (query && query.length > 1) titles = [query, ...baseTitles];

    const uniq = Array.from(new Set(titles)).slice(0, limit);

    const results = await Promise.all(
      uniq.map(async (t) => {
        try {
          const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`;
          const r = await withTimeout(
            (signal) =>
              fetch(url, {
                signal,
                headers: {
                  Accept: "application/json",
                  "User-Agent": "calendario-siembra-app (vercel function)",
                },
              }),
            8000,
            `wiki:${t}`
          );
          if (!r.ok) return null;
          const w = await r.json();
          if (!w?.title || (!w?.extract && !w?.description)) return null;
          return {
            id: w.title,
            attributes: {
              name: w.title,
              binomial_name: "",
              description: w.extract || w.description || "",
              main_image_url: w.originalimage?.source || w.thumbnail?.source || "",
            },
          };
        } catch (e) {
          console.error("Wikipedia item error:", t, e?.message || e);
          return null;
        }
      })
    );

    const filtered = results.filter(Boolean);
    const data = uniqBy(filtered, (x) => x.id);

    if (debug) info.push({ source: "wikipedia", lang, limit, in: uniq.length, out: data.length });

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400");
    return res.status(200).json({ data, _ms: Date.now() - started, _info: debug ? info : undefined });
  } catch (err) {
    console.error("openfarm handler fatal:", err?.message || err);
    return res.status(500).json({ error: "Proxy error", details: String(err?.message || err) });
  }
}
