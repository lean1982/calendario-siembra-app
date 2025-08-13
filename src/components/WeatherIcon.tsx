import React from 'react';
import { mapOwToName } from '../icons/weatherMap';

type Props = {
  code: string;         // OpenWeather icon code, e.g. "01d", "10n"
  size?: number;        // px
  label?: string;       // accessible label
  color?: string;       // CSS color, defaults to var(--green)
};

/**
 * Renders an external SVG from /public/weather/*.svg
 * using CSS mask, so we can tint it to match the app color.
 * => Put your icons in: public/weather/<name>.svg
 */
export default function WeatherIcon({ code, size = 72, label, color = 'var(--green)' }: Props) {
  const name = mapOwToName(code);
  const url = `/weather/${name}.svg`;
  const style: React.CSSProperties = {
    width: size,
    height: size,
    display: 'inline-block',
    backgroundColor: color,
    WebkitMaskImage: `url(${url})`,
    maskImage: `url(${url})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  };
  return <span role="img" aria-label={label ?? name} style={style} />;
}
