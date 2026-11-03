import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BRUSH_FRAME_TOP,
  BRUSH_FRAME_BOTTOM,
  BRUSH_FRAME_LEFT,
  BRUSH_FRAME_RIGHT,
} from './brushstrokePaths';
import './brushstroke.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * InkManuscriptPanel
 * -----------------------------------------------------------------------------
 * A premium Japanese archival washi manuscript container featuring:
 *  - Organic sumi-e ink painted border paths
 *  - Antique washi paper surface with fiber textures and brass corner accents
 *  - Cinematic paper-folding scroll reveal (CSS perspective + rotateX + fold shadow)
 *  - Perfectly flat, stable, and readable final reading state
 *  - Full prefers-reduced-motion compatibility
 */
export default function InkManuscriptPanel({
  sectionLabel,
  seal,
  sealColor = '#C5282F',
  heading,
  subheading,
  quote,
  accent = 'crimson', // 'crimson' | 'charcoal' | 'gold' | 'none'
  delay = 0,
  foldAngle = 18,
  unfoldOnScroll = true,
  className = '',
  style = {},
  children,
}) {
  const containerRef = useRef(null);
  const foldRef = useRef(null);
  const shadowRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const fold = foldRef.current;
    const shadow = shadowRef.current;
    const content = contentRef.current;
    if (!container || !fold) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !unfoldOnScroll) {
      // Immediately present flat, readable, and stable
      gsap.set(fold, { transformPerspective: 1200, rotateX: 0, opacity: 1, y: 0 });
      if (shadow) gsap.set(shadow, { opacity: 0 });
      if (content) gsap.set(content, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial partially folded state
      gsap.set(fold, {
        transformPerspective: 1200,
        transformOrigin: 'top center',
        rotateX: foldAngle,
        y: 18,
        opacity: 0.85,
      });

      if (shadow) {
        gsap.set(shadow, { opacity: 0.45 });
      }

      if (content) {
        gsap.set(content, { opacity: 0.2, y: 8 });
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
      });

      // 1. Paper unfolds downward into flat reading state (0.85s)
      tl.to(
        fold,
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 0.85,
          delay,
        },
        0
      );

      // 2. Crease shadow softens and dissolves (0.7s)
      if (shadow) {
        tl.to(
          shadow,
          {
            opacity: 0,
            duration: 0.7,
            delay: delay + 0.1,
          },
          0
        );
      }

      // 3. Manuscript content settles with clarity (0.6s)
      if (content) {
        tl.to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: delay + 0.15,
            ease: 'power2.out',
          },
          0
        );
      }

      ScrollTrigger.create({
        trigger: container,
        start: 'top 86%',
        once: true,
        onEnter: () => tl.play(),
      });
    }, container);

    return () => ctx.revert();
  }, [delay, foldAngle, unfoldOnScroll]);

  // Accent border tint
  const accentBrushColor =
    accent === 'crimson'
      ? '#7A1C22'
      : accent === 'gold'
      ? '#8C6E26'
      : '#202226';

  return (
    <div ref={containerRef} className={`ink-manuscript-perspective-stage ${className}`} style={style}>
      <div ref={foldRef} className={`ink-manuscript-panel accent-${accent}`}>
        {/* Soft moving paper crease shadow during unfold */}
        <div ref={shadowRef} className="manuscript-fold-crease-shadow" aria-hidden="true" />

        {/* Japanese Washi Paper Texture & Natural Fibers */}
        <div className="manuscript-washi-surface" aria-hidden="true" />

        {/* Hand-painted organic sumi-e perimeter border paths */}
        <div className="manuscript-brush-borders" aria-hidden="true">
          <svg className="brush-edge-top" viewBox="0 0 1000 32" preserveAspectRatio="none">
            <path d={BRUSH_FRAME_TOP} fill={accentBrushColor} />
          </svg>
          <svg className="brush-edge-bottom" viewBox="0 0 1000 34" preserveAspectRatio="none">
            <path d={BRUSH_FRAME_BOTTOM} fill={accentBrushColor} />
          </svg>
          <svg className="brush-edge-left" viewBox="0 0 24 1000" preserveAspectRatio="none">
            <path d={BRUSH_FRAME_LEFT} fill={accentBrushColor} />
          </svg>
          <svg className="brush-edge-right" viewBox="0 0 24 1000" preserveAspectRatio="none">
            <path d={BRUSH_FRAME_RIGHT} fill={accentBrushColor} />
          </svg>
        </div>

        {/* Antique Brass Chiseled Corner Brackets */}
        <span className="manuscript-bracket-corner top-left" aria-hidden="true" />
        <span className="manuscript-bracket-corner top-right" aria-hidden="true" />
        <span className="manuscript-bracket-corner bottom-left" aria-hidden="true" />
        <span className="manuscript-bracket-corner bottom-right" aria-hidden="true" />

        {/* Interior Manuscript Reading Content */}
        <div ref={contentRef} className="manuscript-inner-content">
          {/* Top Label & Seal Header (if provided) */}
          {(sectionLabel || seal || heading) && (
            <div className="manuscript-header-zone">
              <div className="manuscript-meta-row">
                {seal && (
                  <span
                    className="manuscript-cinnabar-seal"
                    style={{ backgroundColor: sealColor }}
                    aria-hidden="true"
                  >
                    {seal}
                  </span>
                )}
                {sectionLabel && (
                  <span className="manuscript-section-label">{sectionLabel}</span>
                )}
                <span className="manuscript-header-gold-seam" aria-hidden="true" />
              </div>
              {heading && <h4 className="manuscript-card-heading">{heading}</h4>}
              {subheading && <div className="manuscript-card-subheading">{subheading}</div>}
            </div>
          )}

          {/* Expressive Ink-Brush Quote Treatment */}
          {quote && (
            <div className="manuscript-quote-callout">
              <div className="quote-brush-leading-bar" aria-hidden="true" />
              <div className="quote-body-flex">
                <span className="quote-cinnabar-glyph" aria-hidden="true">“</span>
                <p className="quote-callout-text">{quote}</p>
                <span className="quote-cinnabar-glyph" aria-hidden="true">”</span>
              </div>
            </div>
          )}

          {/* Historical Paragraphs & Children */}
          <div className="manuscript-body-text-flow">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

