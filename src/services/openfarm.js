// src/services/openfarm.js
import axios from "axios";
const API = "https://openfarm.cc/api/v1";

export async function searchCrops(query) {
  if (!query?.trim()) return [];
  try {
    const url = `${API}/crops?filter=${encodeURIComponent(query.trim())}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    return (data?.data || []).map(item => ({
      id: item.id,
      name: item.attributes?.name,
      slug: item.attributes?.slug,
      binomial: item.attributes?.binomial_name || "",
      description: item.attributes?.description || "",
      image: item.attributes?.main_image_path || item.attributes?.main_image_url || "",
    }));
  } catch (err) {
    const status = err?.response?.status;
    const msg = status ? `OpenFarm respondió ${status}` : (err?.message || "Error de red");
    throw new Error(msg);
  }
}
