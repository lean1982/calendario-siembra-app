// src/icons.jsx
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconFrutilla({ className = "w-16 h-16" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...base}>
      <path d="M20 16c6-1 9-4 12-9 3 5 6 8 12 9" />
      <path d="M12 30c0 14 12 26 20 26s20-12 20-26c0-10-7-14-20-14S12 20 12 30Z" />
      <path d="M24 36l2 2M32 32l2 2M40 36l2 2M28 44l2 2M36 44l2 2M20 40l2 2M44 40l2 2" />
    </svg>
  );
}

export function IconBrocoli({ className = "w-16 h-16" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...base}>
      <path d="M16 26a8 8 0 0 1 8-8 9 9 0 0 1 16-2 8 8 0 1 1 6 14" />
      <path d="M46 30H18" />
      <path d="M26 30v16m12-16v16M32 30v18" />
      <path d="M22 48h20" />
    </svg>
  );
}

export function IconRepollo({ className = "w-16 h-16" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...base}>
      <path d="M12 34c0 10 10 18 20 18s20-8 20-18S42 18 32 18 12 24 12 34Z" />
      <path d="M18 36c6-2 10-8 14-8s8 6 14 8" />
      <path d="M24 42c3-2 5-4 8-4s5 2 8 4" />
      <path d="M32 18v6" />
    </svg>
  );
}

export const iconsByName = {
  frutilla: IconFrutilla,
  fresa: IconFrutilla,
  "brócoli": IconBrocoli,
  brocoli: IconBrocoli,
  repollo: IconRepollo,
};
