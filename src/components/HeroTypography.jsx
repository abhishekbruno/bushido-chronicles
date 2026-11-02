import React from 'react';
import { CALLIGRAPHY_PATH } from '../assets/vectors/vectorPaths';

export default function HeroTypography({ mousePos, scrollY }) {
  // Parallax offsets (Typography sits between sun and samurai)
  const textX = mousePos.x * -18;
  const textY = mousePos.y * -10 - scrollY * 0.28;

  return (
    <div className="scene-layer hero-typography-layer" aria-label="Hero Typography and Calligraphy">
      {/* 1. EXACT RECONSTRUCTED VERTICAL JAPANESE CALLIGRAPHY (Upper Left) */}
      <div
        className="hero-calligraphy-left"
        style={{
          transform: `translate3d(${mousePos.x * 6}px, ${-scrollY * 0.12}px, 0)`,
        }}
        aria-hidden="true"
      >
        <svg
          className="calligraphy-svg"
          viewBox="0 0 1215 1063"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Traced Calligraphy Path with Deep Inky Sumi-e Black */}
          <path
            d={CALLIGRAPHY_PATH}
            fill="#050505"
            className="calligraphy-ink-stroke"
          />
          {/* Authentic Crimson Ink Drop Accent at Top */}
          <circle cx="218" cy="100" r="5.5" fill="#D90416" />
        </svg>
      </div>

      {/* 2. MASSIVE EDITORIAL TYPOGRAPHY BEHIND SAMURAI */}
      <div
        className="hero-massive-title-container"
        style={{
          transform: `translate3d(${textX}px, ${textY}px, 0)`,
        }}
      >
        <div className="hero-eyebrow-tag">
          <span className="eyebrow-rule" />
          <span className="eyebrow-meta">FEUDAL ARCHIVES · KYOTO</span>
          <span className="eyebrow-jp">武士道</span>
        </div>

        <h1 className="hero-monument-headline">
          <span className="headline-row row-1">THE WAY</span>
          <span className="headline-row row-2">OF THE</span>
          <span className="headline-row row-3">
            SAMURAI<span className="headline-crimson-dot">.</span>
          </span>
        </h1>
      </div>
    </div>
  );
}
