// api/openfarm.js
export default async function handler(req, res) {
  try {
    const q = (req.query?.q || "").toString().trim();
    if (!q) return res.status(400).json({ error: "Missing query ?q=" });

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);

    const url = `https://openfarm.cc/api/v1/crops?filter=${encodeURIComponent(q)}`;
    const r = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "calendario-siembra-app/1.0 (+vercel)"
      },
      signal: controller.signal
    }).catch(e => { throw new Error("Upstream fetch failed: " + e.message); });
    clearTimeout(t);

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    // Pass-through status so the client sees real errors (429/500/etc)
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ error: "OpenFarm proxy error", detail: String(e) });
  }
}
