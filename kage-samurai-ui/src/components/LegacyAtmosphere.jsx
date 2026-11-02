import React from 'react';

/**
 * LegacyAtmosphere (風雨と霧 - Atmospheric Poster Textures & Mist)
 * -----------------------------------------------------------------------------
 * Recreates the subtle Japanese woodblock & ink-wash environmental effects
 * seen in the reference poster:
 *  - Vertical fine rain/ink drizzle streaks in the upper atmosphere
 *  - Low drifting mist ribbons floating across the grassland horizon
 *  - Vintage parchment edge vignette and paper texture
 */
export default function LegacyAtmosphere({ className = '' }) {
  return (
    <div className={`legacy-atmosphere-root ${className}`} aria-hidden="true">
      {/* 1. Vintage Parchment Grain & Edge Vignette */}
      <div className="legacy-parchment-vignette" />

      {/* 2. Vertical Fine Rain & Sumi-e Ink Streaks (Top atmosphere of reference image) */}
      <svg
        className="legacy-rain-streaks-svg"
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <g stroke="#0A0B0E" strokeWidth="0.85" opacity="0.16" strokeDasharray="18 45 30 60">
          <line x1="80" y1="0" x2="60" y2="400" />
          <line x1="160" y1="0" x2="140" y2="350" />
          <line x1="240" y1="0" x2="220" y2="420" />
          <line x1="320" y1="0" x2="300" y2="380" />
          <line x1="420" y1="0" x2="400" y2="440" />
          <line x1="530" y1="0" x2="510" y2="360" />
          <line x1="640" y1="0" x2="620" y2="410" />
          <line x1="750" y1="0" x2="730" y2="390" />
          <line x1="860" y1="0" x2="840" y2="430" />
          <line x1="940" y1="0" x2="920" y2="370" />
        </g>
      </svg>

      {/* 3. Soft Horizontal Grassland Mist Ribbons */}
      <div className="legacy-mist-ribbon ribbon-1" />
      <div className="legacy-mist-ribbon ribbon-2" />
    </div>
  );
}

