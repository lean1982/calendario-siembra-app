// src/services/openfarm.js
import axios from "axios";

/**
 * Busca cultivos reales usando nuestro proxy /api/openfarm
 * Devuelve un array normalizado: id, name, binomial, description, image
 */
export async function fetchCropsAuto(seed = "a") {
  const q = (seed || "a").trim();
  const url = `/api/openfarm?q=${encodeURIComponent(q)}`;
  const { data } = await axios.get(url, { timeout: 12000 });
  return (data?.data || []).map((item) => ({
    id: item.id,
    name: item.attributes?.name || "",
    binomial: item.attributes?.binomial_name || "",
    description: item.attributes?.description || "",
    image: item.attributes?.main_image_path || item.attributes?.main_image_url || "",
  }));
}
