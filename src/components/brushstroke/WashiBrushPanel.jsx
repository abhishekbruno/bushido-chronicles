import React from 'react';
import useInkReveal from './useInkReveal';
import {
  BRUSH_FRAME_TOP,
  BRUSH_FRAME_BOTTOM,
  BRUSH_FRAME_LEFT,
  BRUSH_FRAME_RIGHT,
  CORNER_MARK_TL,
  CORNER_MARK_TR,
  CORNER_MARK_BL,
  CORNER_MARK_BR,
} from './brushstrokePaths';
import './brushstroke.css';

/**
 * WashiBrushPanel (Type B — Washi Brush-Frame Panel)
 * -----------------------------------------------------------------------------
 * An antique parchment reading surface framed by hand-painted Japanese sumi-e
 * brush borders.
 *
 * Rules:
 *  - Central reading area remains clean and light parchment for 100% legibility
 *  - Organic brushwork frames the perimeter without obscuring text
 *  - Real SVG geometry that scales dynamically to any width and height
 *  - Supports multi-paragraph historical texts, tables, and responsive grids
 *  - Scroll-triggered opposing brush paint sweep
 */
export default function WashiBrushPanel({
  dark = false,
  crimsonAccent = false,
  interactive = false,
  cornerMarks = true,
  as: Component = 'div',
  className = '',
  style = {},
  children,
  ...props
}) {
  const [panelRef, isRevealed] = useInkReveal(0.12);

  const darkClass = dark ? 'washi-dark' : 'washi-light';
  const interactiveClass = interactive ? 'washi-interactive' : '';

  return (
    <Component
      ref={panelRef}
      className={`washi-brush-panel ${darkClass} ${interactiveClass} ${
        isRevealed ? 'ink-revealed' : ''
      } ${className}`}
      style={style}
      {...props}
    >
      {/* 1. Subtle Paper Texture & Natural Fibers */}
      <div className="washi-fiber-texture" aria-hidden="true" />

      {/* 2. Top Hand-Painted Sumi-e Horizontal Brushstroke */}
      <div className="brush-frame-top" aria-hidden="true">
        <svg
          viewBox="0 0 1000 32"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: 'block' }}
        >
          <path
            d={BRUSH_FRAME_TOP}
            fill={dark ? '#22242B' : '#141518'}
            opacity={dark ? 0.75 : 0.82}
          />
        </svg>
      </div>

      {/* 3. Bottom Hand-Painted Grounding Brushstroke */}
      <div className="brush-frame-bottom" aria-hidden="true">
        <svg
          viewBox="0 0 1000 34"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: 'block' }}
        >
          <path
            d={BRUSH_FRAME_BOTTOM}
            fill={dark ? '#22242B' : '#141518'}
            opacity={dark ? 0.78 : 0.85}
          />
        </svg>
      </div>

      {/* 4. Left Vertical Ink Framing Border */}
      <div className="brush-frame-left" aria-hidden="true">
        <svg
          viewBox="0 0 24 1000"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: 'block' }}
        >
          <path
            d={BRUSH_FRAME_LEFT}
            fill={crimsonAccent ? '#C72C35' : (dark ? '#2A2C34' : '#1A1B20')}
            opacity={crimsonAccent ? 0.85 : 0.7}
          />
        </svg>
      </div>

      {/* 5. Right Vertical Ink Framing Border */}
      <div className="brush-frame-right" aria-hidden="true">
        <svg
          viewBox="0 0 24 1000"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: 'block' }}
        >
          <path
            d={BRUSH_FRAME_RIGHT}
            fill={dark ? '#2A2C34' : '#1A1B20'}
            opacity={0.65}
          />
        </svg>
      </div>

      {/* 6. Four Handcrafted Calligraphic Ink Corner Marks */}
      {cornerMarks && (
        <div className="brush-frame-corners" aria-hidden="true">
          <svg className="corner-sumi tl" viewBox="0 0 40 40">
            <path d={CORNER_MARK_TL} />
          </svg>
          <svg className="corner-sumi tr" viewBox="0 0 40 40">
            <path d={CORNER_MARK_TR} />
          </svg>
          <svg className="corner-sumi bl" viewBox="0 0 40 40">
            <path d={CORNER_MARK_BL} />
          </svg>
          <svg className="corner-sumi br" viewBox="0 0 40 40">
            <path d={CORNER_MARK_BR} />
          </svg>
        </div>
      )}

      {/* 7. Protected Text Content Safe Area (Strictly Maintained Contrast) */}
      <div className="washi-brush-panel-content">
        {children}
      </div>
    </Component>
  );
}

