
// src/services/openfarm.js
import axios from "axios";

const API = "https://openfarm.cc/api/v1";

export async function searchCrops(query) {
  if (!query?.trim()) return [];
  const url = `${API}/crops/?filter=${encodeURIComponent(query.trim())}`;
  const { data } = await axios.get(url, { headers: { Accept: "application/json" } });
  return (data?.data || []).map(item => ({
    id: item.id,
    name: item.attributes?.name,
    slug: item.attributes?.slug || item.attributes?.name?.toLowerCase?.(),
    binomial: item.attributes?.binomial_name || "",
    description: item.attributes?.description || "",
    image: item.attributes?.main_image_path || item.attributes?.main_image_url || "",
  }));
}
