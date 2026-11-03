import React from 'react';
import useInkReveal from './useInkReveal';
import {
  BRUSH_BANNER_PATH,
  BRUSH_BANNER_STREAK_1,
  BRUSH_BANNER_STREAK_2,
  BRUSH_BANNER_BRISTLES_RIGHT,
  BRUSH_BANNER_BRISTLES_LEFT,
} from './brushstrokePaths';
import './brushstroke.css';

/**
 * InkBrushBanner (Type A — Black Ink Brushstroke)
 * -----------------------------------------------------------------------------
 * A wide, organically shaped Japanese sumi-e black brushstroke container.
 * Perfect for section headings, short quotes, chapter labels, and important phrases.
 *
 * Visual Characteristics:
 *  - Charcoal-black rich ink (#121316 / #0A0B0D)
 *  - Rough feathered ends & dry-brush bristle trails
 *  - Layered SVG paths with natural thickness variation
 *  - Slightly transparent edges & washi ink absorption
 *  - Off-white/cream text with strictly protected internal safe padding
 *  - Optional authentic crimson vermilion seal (Hanko)
 *  - Single-shot scroll-triggered ink sweep
 */
export default function InkBrushBanner({
  kicker = '',
  title = '',
  subtext = '',
  sealText = '武',
  hasSeal = true,
  className = '',
  style = {},
  children,
  ...props
}) {
  const [containerRef, isRevealed] = useInkReveal(0.12);

  return (
    <div
      ref={containerRef}
      className={`ink-brush-banner ${isRevealed ? 'ink-revealed' : ''} ${className}`}
      style={style}
      {...props}
    >
      {/* 1. Underlying SVG Sumi-e Brushstroke Geometry */}
      <div className="ink-brush-svg-layer" aria-hidden="true">
        <svg
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            {/* Rich Charcoal Ink Gradient with subtle edge dissipation */}
            <linearGradient id="charcoalInkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0B0C0E" stopOpacity="0.88" />
              <stop offset="6%" stopColor="#121316" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#08090B" stopOpacity="1.0" />
              <stop offset="92%" stopColor="#15161A" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#1A1C20" stopOpacity="0.75" />
            </linearGradient>

            {/* Dry-brush Bristle Streak Tone */}
            <linearGradient id="bristleStreakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#25272D" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#30333A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#1E2024" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Left Tapered Entry Bristles */}
          {BRUSH_BANNER_BRISTLES_LEFT.map((d, i) => (
            <path key={`bl-${i}`} d={d} fill="#141518" opacity="0.85" />
          ))}

          {/* Main Heavy Ink Belly */}
          <path
            d={BRUSH_BANNER_PATH}
            fill="url(#charcoalInkGrad)"
          />

          {/* Secondary Dry-Brush Bristle Separation Streaks */}
          <path
            d={BRUSH_BANNER_STREAK_1}
            fill="url(#bristleStreakGrad)"
          />
          <path
            d={BRUSH_BANNER_STREAK_2}
            fill="url(#bristleStreakGrad)"
          />

          {/* Right Feathered Exit Bristles */}
          {BRUSH_BANNER_BRISTLES_RIGHT.map((d, i) => (
            <path key={`br-${i}`} d={d} fill="#181A1E" opacity={0.8 - i * 0.12} />
          ))}
        </svg>
      </div>

      {/* 2. Paper Fiber / Micro-Absorption Overlay */}
      <div className="ink-absorption-overlay" aria-hidden="true" />

      {/* 3. Optional Traditional Crimson Hanko Seal */}
      {hasSeal && sealText && (
        <div className="ink-brush-seal" title="Archival Seal" aria-hidden="true">
          <span>{sealText}</span>
        </div>
      )}

      {/* 4. Real, Accessible, Selectable HTML Content Layer */}
      <div className="ink-brush-banner-content">
        {kicker && <span className="banner-jp-kicker">{kicker}</span>}
        {title && <h3 className="banner-primary-heading">{title}</h3>}
        {subtext && <p className="banner-subtext">{subtext}</p>}
        {children}
      </div>
    </div>
  );
}

