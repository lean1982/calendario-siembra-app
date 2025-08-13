// src/icons/weatherMap.ts
// Map OpenWeather icon codes to your SVG base filenames in /public/weather/ (without .svg)

export type OWCode = string;

export function mapOwToName(code: OWCode): string {
  const c = (code || '01d').toLowerCase();
  const two = c.slice(0, 2);
  const isDay = c.endsWith('d');
  switch (two) {
    case '01': return isDay ? 'clear-day' : 'clear-night';
    case '02': return isDay ? 'partly-day' : 'partly-night';
    case '03':
    case '04': return 'clouds';
    case '09': return 'drizzle';
    case '10': return 'rain';
    case '11': return 'storm';
    case '13': return 'snow';
    case '50': return 'mist';
    default:   return isDay ? 'clear-day' : 'clear-night';
  }
}

// If your filenames differ, change the return values above to match your files.
// Example: return isDay ? 'sun' : 'moon';  // when you have /public/weather/sun.svg, /public/weather/moon.svg
