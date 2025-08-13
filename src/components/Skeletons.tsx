import React from 'react';

export function WeatherSkeleton() {
  return (
    <div className="weather-card skeleton">
      <div>
        <div className="sk-line sk-w-160" />
        <div className="sk-num sk-w-80" />
        <div className="sk-line sk-w-120" />
      </div>
      <div className="sk-icon" />
      <div className="forecast">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="forecast-item" key={i}>
            <div className="sk-dot" />
            <small className="forecast-day sk-text">—</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResultSkeleton() {
  return (
    <article className="result skeleton">
      <div className="sk-ico-rect" />
      <div>
        <div className="sk-line sk-w-180" />
        <div className="sk-line sk-w-320" />
        <div className="sk-badges">
          <div className="sk-badge" /><div className="sk-badge" /><div className="sk-badge" />
        </div>
      </div>
    </article>
  );
}
