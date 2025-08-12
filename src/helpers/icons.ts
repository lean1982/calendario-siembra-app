export function iconPathFor(slug: string) {
  const safe = (slug || "").toLowerCase().replace(/\s+/g, "-");
  return `/icons/${safe}.svg`;
}

export function withFallbackIcon(img: HTMLImageElement) {
  img.onerror = () => {
    img.onerror = null;
    img.src = "/icons/strawberry.svg";
  };
}
