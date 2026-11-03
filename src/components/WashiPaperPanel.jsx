import React from 'react';
import useInkReveal from './brushstroke/useInkReveal';
import {
  BRUSH_FRAME_TOP,
  BRUSH_FRAME_BOTTOM,
  CORNER_MARK_TL,
  CORNER_MARK_TR,
  CORNER_MARK_BL,
  CORNER_MARK_BR,
} from './brushstroke/brushstrokePaths';
import './brushstroke/brushstroke.css';

/**
 * WashiPaperPanel
 * -----------------------------------------------------------------------------
 * Reusable handcrafted Japanese paper container system upgraded with authentic
 * sumi-e brushstroke borders and scroll-triggered ink animations.
 *
 * Three core variants:
 *  - 'soft' (Variant A): Warm ivory washi, gentle organic corners, minimal grain,
 *                        soft natural paper shadow. For descriptions, quotes, and reading panels.
 *  - 'manuscript' (Variant B): Ancient aged washi with hand-painted sumi-e brushstroke
 *                              borders, irregular deckled edges, and calligraphic corner marks.
 *  - 'ink-frame' (Variant C): Charcoal or museum-ivory exhibit panel, framed by dark sumi-e
 *                             ink strokes, restrained crimson accents, museum typography.
 */
export default function WashiPaperPanel({
  variant = 'soft', // 'soft' | 'manuscript' | 'ink-frame'
  dark = false, // boolean for dark ink washi
  as: Component = 'div',
  className = '',
  style = {},
  hasFold = false, // renders faint diagonal/horizontal fold crease
  cornerMarks = false, // renders 4 delicate sumi-e ink corner brackets
  crimsonAccent = false, // renders vermilion seal / accent bar
  interactive = false, // subtle paper lift on hover
  brushFrame = true, // renders sumi-e ink brushstroke borders
  children,
  ...props
}) {
  const [panelRef, isRevealed] = useInkReveal(0.12);

  const variantClass = `washi-panel-${variant}`;
  const darkClass = dark ? 'washi-dark' : 'washi-light';
  const interactiveClass = interactive ? 'washi-interactive' : '';
  const revealedClass = isRevealed ? 'ink-revealed' : '';

  // Whether to show top and bottom sumi-e brush strokes
  const showBrushBorders = brushFrame && (variant === 'manuscript' || variant === 'ink-frame');

  return (
    <Component
      ref={panelRef}
      className={`washi-paper-panel ${variantClass} ${darkClass} ${interactiveClass} ${revealedClass} ${className}`}
      style={style}
      {...props}
    >
      {/* 1. Subtle Paper Texture & Micro-Fiber Overlay */}
      <div className="washi-texture-fiber" aria-hidden="true" />

      {/* 2. Aged Paper Vignette & Discoloration Edge */}
      <div className="washi-edge-vignette" aria-hidden="true" />

      {/* 3. Optional Ancient Manuscript Fold Crease */}
      {(hasFold || variant === 'manuscript') && (
        <div className="washi-fold-crease" aria-hidden="true" />
      )}

      {/* 4. Sumi-e Top & Bottom Hand-Painted Brushstroke Borders */}
      {showBrushBorders && (
        <>
          <div className="brush-frame-top" aria-hidden="true">
            <svg viewBox="0 0 1000 32" preserveAspectRatio="none" width="100%" height="100%">
              <path
                d={BRUSH_FRAME_TOP}
                fill={dark ? '#2A2C34' : '#141518'}
                opacity={dark ? 0.75 : 0.8}
              />
            </svg>
          </div>
          <div className="brush-frame-bottom" aria-hidden="true">
            <svg viewBox="0 0 1000 34" preserveAspectRatio="none" width="100%" height="100%">
              <path
                d={BRUSH_FRAME_BOTTOM}
                fill={dark ? '#2A2C34' : '#141518'}
                opacity={dark ? 0.78 : 0.82}
              />
            </svg>
          </div>
        </>
      )}

      {/* 5. Optional Sumi-e Double Hairline Frame (Ink-Frame Variant) */}
      {variant === 'ink-frame' && (
        <div className="washi-inner-ink-stroke" aria-hidden="true" />
      )}

      {/* 6. Handcrafted Sumi-e Corner Notches / Ink Brackets */}
      {(cornerMarks || variant === 'manuscript' || variant === 'ink-frame') && (
        <div className="washi-corner-brackets brush-frame-corners" aria-hidden="true">
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

      {/* 7. Optional Crimson Vermilion Accent Bar */}
      {crimsonAccent && (
        <span className="washi-crimson-bar" aria-hidden="true" />
      )}

      {/* 8. Protected Panel Content (Real Accessible HTML) */}
      <div className="washi-panel-content">
        {children}
      </div>
    </Component>
  );
}

// Reusable convenience exports
export function ManuscriptCard(props) {
  return <WashiPaperPanel variant="manuscript" cornerMarks hasFold {...props} />;
}

export function InkFrame(props) {
  return <WashiPaperPanel variant="ink-frame" cornerMarks {...props} />;
}

export function SoftParchment(props) {
  return <WashiPaperPanel variant="soft" {...props} />;
}
