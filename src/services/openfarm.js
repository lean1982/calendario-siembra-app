// src/services/openfarm.js
import axios from "axios";

export async function searchCrops(query) {
  const q = (query || "").trim();
  if (!q) return [];
  const url = `/api/openfarm?q=${encodeURIComponent(q)}`;
  const { data } = await axios.get(url, { timeout: 12000 });
  return (data?.data || []).map(item => ({
    id: item.id,
    name: item.attributes?.name,
    binomial: item.attributes?.binomial_name || "",
    description: item.attributes?.description || "",
    image: item.attributes?.main_image_path || item.attributes?.main_image_url || ""
  }));
}
