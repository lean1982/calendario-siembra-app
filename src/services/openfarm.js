// src/services/openfarm.js
import axios from "axios";

export async function searchCrops(query) {
  if (!query?.trim()) return [];
  const url = `/api/openfarm?q=${encodeURIComponent(query.trim())}`;
  const { data } = await axios.get(url, { timeout: 10000 });
  return (data?.data || []).map(item => ({
    id: item.id,
    name: item.attributes?.name,
    slug: item.attributes?.slug,
    binomial: item.attributes?.binomial_name || "",
    description: item.attributes?.description || "",
    image: item.attributes?.main_image_path || item.attributes?.main_image_url || "",
  }));
}
