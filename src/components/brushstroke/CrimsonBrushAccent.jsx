import React from 'react';
import useInkReveal from './useInkReveal';
import { CRIMSON_STROKE_PATH } from './brushstrokePaths';
import './brushstroke.css';

/**
 * CrimsonBrushAccent (Type C — Crimson Brush Accent)
 * -----------------------------------------------------------------------------
 * A deep crimson hand-painted sumi-e stroke used sparingly for historical dates,
 * chapter numbers, active tabs, and important archival seals.
 */
export default function CrimsonBrushAccent({
  variant = 'badge', // 'badge' | 'pill' | 'label'
  alwaysPainted = false,
  as: Component = 'span',
  className = '',
  style = {},
  children,
  ...props
}) {
  const [accentRef, isRevealed] = useInkReveal(0.1);

  return (
    <Component
      ref={accentRef}
      className={`crimson-brush-accent accent-${variant} ${
        isRevealed || alwaysPainted ? 'ink-revealed' : ''
      } ${alwaysPainted ? 'always-painted' : ''} ${className}`}
      style={style}
      {...props}
    >
      {/* Hand-Painted Crimson Stroke SVG */}
      <div className="crimson-brush-bg" aria-hidden="true">
        <svg
          viewBox="0 0 400 48"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id="crimsonInkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#96161D" stopOpacity="0.9" />
              <stop offset="20%" stopColor="#C72C35" stopOpacity="0.98" />
              <stop offset="85%" stopColor="#B31B24" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#8A1319" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path d={CRIMSON_STROKE_PATH} fill="url(#crimsonInkGrad)" />
        </svg>
      </div>

      {/* Accessible Text Content */}
      <span className="crimson-brush-content">
        {children}
      </span>
    </Component>
  );
}
