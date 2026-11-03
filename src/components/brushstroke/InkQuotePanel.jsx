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
 * InkQuotePanel (Type A Specialized — Calligraphic Quote Container)
 * -----------------------------------------------------------------------------
 * Presents historical quotes and meditations as passages painted directly on
 * antique Japanese manuscript banners.
 */
export default function InkQuotePanel({
  quote = '',
  author = '',
  source = '',
  sealText = '心',
  className = '',
  style = {},
  children,
  ...props
}) {
  const [quoteRef, isRevealed] = useInkReveal(0.15);

  return (
    <div
      ref={quoteRef}
      className={`ink-brush-banner ink-quote-panel ${isRevealed ? 'ink-revealed' : ''} ${className}`}
      style={style}
      {...props}
    >
      {/* SVG Ink Brush Artwork */}
      <div className="ink-brush-svg-layer" aria-hidden="true">
        <svg
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id="quoteInkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0B0C0E" stopOpacity="0.9" />
              <stop offset="8%" stopColor="#141519" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#0A0B0D" stopOpacity="1.0" />
              <stop offset="90%" stopColor="#131417" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#1A1C20" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="quoteStreakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#25272D" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#30333A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#1E2024" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Left Bristles */}
          {BRUSH_BANNER_BRISTLES_LEFT.map((d, i) => (
            <path key={`ql-${i}`} d={d} fill="#141518" opacity="0.85" />
          ))}

          {/* Solid Ink Body */}
          <path d={BRUSH_BANNER_PATH} fill="url(#quoteInkGrad)" />

          {/* Bristle Streaks */}
          <path d={BRUSH_BANNER_STREAK_1} fill="url(#quoteStreakGrad)" />
          <path d={BRUSH_BANNER_STREAK_2} fill="url(#quoteStreakGrad)" />

          {/* Right Feathered Ends */}
          {BRUSH_BANNER_BRISTLES_RIGHT.map((d, i) => (
            <path key={`qr-${i}`} d={d} fill="#181A1E" opacity={0.8 - i * 0.12} />
          ))}
        </svg>
      </div>

      {/* Paper Micro-Texture Overlay */}
      <div className="ink-absorption-overlay" aria-hidden="true" />

      {/* Vermilion Stamp */}
      {sealText && (
        <div className="ink-brush-seal" title="Archival Quote Stamp" aria-hidden="true">
          <span>{sealText}</span>
        </div>
      )}

      {/* Readable HTML Quote Typography */}
      <div className="ink-brush-banner-content ink-quote-content">
        <span className="ink-quote-mark" aria-hidden="true">“</span>
        <blockquote className="ink-quote-body">
          {quote || children}
        </blockquote>
        {(author || source) && (
          <footer className="ink-quote-footer">
            {author && <span className="ink-quote-author">{author}</span>}
            {source && <span className="ink-quote-book">{source}</span>}
          </footer>
        )}
      </div>
    </div>
  );
}
