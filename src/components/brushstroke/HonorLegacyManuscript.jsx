import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BRUSH_FRAME_TOP,
  BRUSH_FRAME_BOTTOM,
  BRUSH_FRAME_LEFT,
  BRUSH_FRAME_RIGHT,
  BRUSH_BANNER_PATH,
} from './brushstrokePaths';
import './brushstroke.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * HonorLegacyManuscript
 * -----------------------------------------------------------------------------
 * A specialized Japanese washi-paper manuscript container for Chapter 05:
 *  - Organic sumi-e ink painted border paths
 *  - Antique washi paper surface with fiber textures & brass corner accents
 *  - Sumi-e brushstroke header badge behind chapter number and Japanese title
 *  - Custom vector motif medallion (Katana / Fude Brush / Immovable Mountain)
 *  - Book-quality readable typography on warm ivory parchment
 *  - Scroll-triggered 3D paper-folding animation (CSS perspective + rotateX)
 *  - Full prefers-reduced-motion support
 */
export default function HonorLegacyManuscript({
  num = '01',
  kanji = '職人気質',
  title = 'SHOKUNIN KISHITSU',
  subtitle = 'The Artisan’s Sacred Devotion to Perfection',
  desc = '',
  tag = 'CRAFTSMANSHIP & INTEGRITY',
  sealChar = '職',
  accentSvg = null,
  delay = 0,
  foldAngle = 18,
  className = '',
  style = {},
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

    if (prefersReducedMotion) {
      gsap.set(fold, { transformPerspective: 1200, rotateX: 0, opacity: 1, y: 0 });
      if (shadow) gsap.set(shadow, { opacity: 0 });
      if (content) gsap.set(content, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial partially folded document state
      gsap.set(fold, {
        transformPerspective: 1200,
        transformOrigin: 'top center',
        rotateX: foldAngle,
        y: 20,
        opacity: 0.85,
      });

      if (shadow) {
        gsap.set(shadow, { opacity: 0.5 });
      }

      if (content) {
        gsap.set(content, { opacity: 0.2, y: 10 });
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
      });

      // 2. Paper unfolds downward into full flat reading area (0.9s)
      tl.to(
        fold,
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay,
        },
        0
      );

      // 3. Crease shadow travels and dissolves (0.75s)
      if (shadow) {
        tl.to(
          shadow,
          {
            opacity: 0,
            duration: 0.75,
            delay: delay + 0.1,
          },
          0
        );
      }

      // 4. Manuscript typography and artwork settle (0.65s)
      if (content) {
        tl.to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: delay + 0.18,
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
  }, [delay, foldAngle]);

  return (
    <div
      ref={containerRef}
      className={`legacy-manuscript-perspective-stage ${className}`}
      style={style}
    >
      <article ref={foldRef} className="legacy-manuscript-panel washi-paper-surface">
        {/* Animated paper crease shadow */}
        <div ref={shadowRef} className="manuscript-fold-crease-shadow" aria-hidden="true" />

        {/* Japanese Washi Texture & Natural Fibers */}
        <div className="manuscript-washi-surface" aria-hidden="true" />

        {/* Hand-painted organic sumi-e perimeter borders */}
        <div className="manuscript-brush-borders" aria-hidden="true">
          <svg className="brush-edge-top" viewBox="0 0 1000 32" preserveAspectRatio="none">
            <path d={BRUSH_FRAME_TOP} fill="#23252A" />
          </svg>
          <svg className="brush-edge-bottom" viewBox="0 0 1000 34" preserveAspectRatio="none">
            <path d={BRUSH_FRAME_BOTTOM} fill="#23252A" />
          </svg>
          <svg className="brush-edge-left" viewBox="0 0 24 1000" preserveAspectRatio="none">
            <path d={BRUSH_FRAME_LEFT} fill="#23252A" />
          </svg>
          <svg className="brush-edge-right" viewBox="0 0 24 1000" preserveAspectRatio="none">
            <path d={BRUSH_FRAME_RIGHT} fill="#23252A" />
          </svg>
        </div>

        {/* Antique Brass Chiseled Corner Brackets */}
        <span className="manuscript-bracket-corner top-left" aria-hidden="true" />
        <span className="manuscript-bracket-corner top-right" aria-hidden="true" />
        <span className="manuscript-bracket-corner bottom-left" aria-hidden="true" />
        <span className="manuscript-bracket-corner bottom-right" aria-hidden="true" />

        {/* Interior Protected Reading Content */}
        <div ref={contentRef} className="legacy-manuscript-inner-content">
          {/* Header Area with Sumi-e Brushstroke Badge & Vector Motif */}
          <header className="legacy-manuscript-header">
            <div className="manuscript-header-top-row">
              {/* Sumi-e Brushstroke Container behind Chapter Number & Kanji */}
              <div className="manuscript-brush-pill-badge">
                <svg
                  className="brush-badge-svg"
                  viewBox="0 0 1000 120"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d={BRUSH_BANNER_PATH} fill="#18191D" />
                </svg>
                <div className="brush-badge-text-lockup">
                  <span className="brush-badge-num">{num}</span>
                  <span className="brush-badge-dot">·</span>
                  <span className="brush-badge-kanji">{kanji}</span>
                </div>
              </div>

              {/* Decorative Cinnabar Hanko Seal */}
              <span className="manuscript-cinnabar-hanko" aria-hidden="true">
                {sealChar}
              </span>
            </div>

            {/* Title & Vector Motif Flex Row */}
            <div className="manuscript-title-motif-row">
              <div className="manuscript-title-pack">
                <h4 className="legacy-manuscript-title">{title}</h4>
                <div className="legacy-manuscript-subtitle">{subtitle}</div>
              </div>

              {/* Custom Traditional Japanese Vector Motif Medallion */}
              {accentSvg && (
                <div className="manuscript-vector-motif-pod" aria-hidden="true">
                  <div className="motif-circle-medallion">
                    {accentSvg}
                  </div>
                </div>
              )}
            </div>

            {/* Calligraphic Gold-Crimson Divider Seam */}
            <div className="legacy-manuscript-divider-seam" aria-hidden="true">
              <span className="divider-gold-line" />
              <span className="divider-kanji-glyph">{sealChar}</span>
              <span className="divider-gold-line" />
            </div>
          </header>

          {/* Historical Paragraph Content (Book Typography on Washi) */}
          <div className="legacy-manuscript-body">
            <p className="legacy-manuscript-paragraph">{desc}</p>
          </div>

          {/* Manuscript Footer Ribbon */}
          <footer className="legacy-manuscript-footer">
            <div className="footer-theme-tag">
              <span className="footer-theme-dot" />
              <span className="footer-theme-text">{tag}</span>
            </div>
            <div className="footer-archive-stamp">
              <span className="footer-stamp-label">LEGACY · 継承</span>
              <span className="footer-stamp-mini" aria-hidden="true">印</span>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}

