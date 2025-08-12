const toFile = (name) => name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'');

export const iconFor = (name) => `/icons/${toFile(name)}.svg`;

export const FALLBACK_ICON = '/icons/strawberry.svg';
