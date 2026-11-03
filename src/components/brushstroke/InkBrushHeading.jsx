import React from 'react';
import useInkReveal from './useInkReveal';
import { BRUSH_BANNER_PATH } from './brushstrokePaths';
import './brushstroke.css';

/**
 * InkBrushHeading
 * -----------------------------------------------------------------------------
 * Provides an organic sumi-e ink brushstroke underlay for major headings
 * and chapter titles.
 */
export default function InkBrushHeading({
  as: Component = 'h2',
  brushColor = 'charcoal', // 'charcoal' | 'crimson'
  className = '',
  style = {},
  children,
  ...props
}) {
  const [headingRef, isRevealed] = useInkReveal(0.12);

  const isCrimson = brushColor === 'crimson';

  return (
    <div
      ref={headingRef}
      className={`ink-brush-heading-wrapper ${isRevealed ? 'ink-revealed' : ''} ${className}`}
      style={style}
      {...props}
    >
      {/* Underlying Organic Stroke Sweep */}
      <div className="ink-brush-heading-bg" aria-hidden="true">
        <svg
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: 'block' }}
        >
          <path
            d={BRUSH_BANNER_PATH}
            fill={isCrimson ? '#C72C35' : '#141518'}
            opacity={isCrimson ? 0.85 : 0.9}
          />
        </svg>
      </div>

      {/* Heading Text */}
      <Component className="ink-brush-heading-text">
        {children}
      </Component>
    </div>
  );
}
