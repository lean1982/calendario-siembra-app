// api/openfarm.js
export default async function handler(req, res) {
  const q = (req.query?.q || "").toString().trim();
  // Basic validation
  if (!q) {
    return res.status(400).json({ error: "Missing query ?q=" });
  }
  const url = `https://openfarm.cc/api/v1/crops?filter=${encodeURIComponent(q)}`;
  try {
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    const text = await r.text();
    // Try parse, but pass-through on error
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ error: "OpenFarm proxy error", detail: String(e) });
  }
}
