import React, { useRef, useEffect, useId, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BRUSH_TEXT_PANEL_BODY,
  BRUSH_TEXT_PANEL_STREAKS,
  BRUSH_TEXT_PANEL_BRISTLES_RIGHT,
  BRUSH_TEXT_PANEL_BRISTLES_LEFT,
  BRUSH_TEXT_PANEL_SPLATTERS,
  HANKO_BORDER_PATH,
} from './brushstrokePaths';
import './brushstroke.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * InkBrushTextPanel (Type D — Calligraphic Manuscript Text Container)
 * -----------------------------------------------------------------------------
 * Transforms plain philosophical text into an authentic Japanese sumi-e
 * brushstroke panel painted onto antique washi parchment.
 *
 * Visual & Motion System:
 *  - Broad, hand-painted black ink body with organic Bézier boundaries
 *  - Dry-brush streaks, feathered entrance/exit bristles, and flying-white (kasuri)
 *  - Cinematic scroll-triggered left-to-right painting reveal (GSAP ScrollTrigger)
 *  - Warm ivory typography on deep sumi-e ink with radiant crimson philosophical accent
 *  - Real, fully selectable, accessible HTML text
 *  - Embedded vermilion Hanko stamp (名誉 · Meiyo)
 *  - Responsive fluid scaling with guaranteed safety padding on desktop & mobile
 *  - Respects prefers-reduced-motion
 */
export default function InkBrushTextPanel({
  statement = 'HONOR IS NOT GIVEN. IT IS LIVED.',
  description = "For the Samurai, honor was an ideal shaped by duty, conduct, reputation, and responsibility. Beyond the sword, a warrior's standing was measured by the principles they upheld and the choices they made.",
  sealText = '誉',
  showDivider = true,
  className = '',
  style = {},
  children,
  ...props
}) {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const streaksRef = useRef(null);
  const statementRef = useRef(null);
  const dividerRef = useRef(null);
  const descRef = useRef(null);
  const sealRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const uniqueId = useId().replace(/:/g, '');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // 1. Accessibility: Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    // 2. GSAP ScrollTrigger Painting Timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          setIsRevealed(true);
        },
      });

      // Step 1: Brushstroke reveals from left to right (0.85s)
      tl.fromTo(
        bgRef.current,
        {
          clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0 100%)',
          filter: 'brightness(1.15) contrast(0.95)',
        },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          filter: 'brightness(1) contrast(1)',
          duration: 0.85,
          ease: 'power2.out',
        },
        0
      );

      // Step 2: Subtle dry-brush streaks and bristle trails fade in (0.35s)
      if (streaksRef.current) {
        tl.fromTo(
          streaksRef.current.querySelectorAll('.ink-streak, .ink-bristle, .ink-splatter'),
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.35,
            stagger: 0.04,
            ease: 'power1.out',
          },
          0.25
        );
      }

      // Step 3: Philosophical statement appears with crimson presence (0.45s)
      if (statementRef.current) {
        tl.fromTo(
          statementRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
          },
          0.55
        );
      }

      // Step 4: Calligraphic divider line sweeps across (0.35s)
      if (dividerRef.current) {
        tl.fromTo(
          dividerRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.35,
            ease: 'power2.out',
          },
          0.7
        );
      }

      // Step 5: Core descriptive paragraph fades in smoothly with warm ivory text (0.5s)
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          0.78
        );
      }

      // Step 6: Vermilion Hanko Seal stamps down onto the ink (0.35s)
      if (sealRef.current) {
        tl.fromTo(
          sealRef.current,
          { opacity: 0, scale: 1.45, rotation: -6 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.35,
            ease: 'back.out(1.8)',
          },
          0.9
        );
      }

      // 3. ScrollTrigger attachment
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => tl.play(),
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`ink-brush-text-panel ${isRevealed ? 'is-revealed' : ''} ${className}`}
      style={style}
      {...props}
    >
      {/* ================================================================== */}
      {/* 1. SUMI-E BRUSHSTROKE BACKGROUND SVG                               */}
      {/* ================================================================== */}
      <div ref={bgRef} className="ink-brush-panel-bg" aria-hidden="true">
        <svg
          className="ink-brush-panel-svg"
          viewBox="0 0 900 360"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
        >
          <defs>
            {/* Deep Rich Sumi-e Black Ink Gradient */}
            <linearGradient id={`sumiInkGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0B0C0F" stopOpacity="0.94" />
              <stop offset="7%" stopColor="#13151A" stopOpacity="0.99" />
              <stop offset="45%" stopColor="#0C0D10" stopOpacity="1.0" />
              <stop offset="85%" stopColor="#15171D" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#1A1D24" stopOpacity="0.92" />
            </linearGradient>

            {/* Dry-brush Bristle Streaks Gradient */}
            <linearGradient id={`dryStreakGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22252D" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#2E333E" stopOpacity="0.4" />
              <stop offset="90%" stopColor="#1D2028" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#14161C" stopOpacity="0.05" />
            </linearGradient>

            {/* Feathered Edge Gradient */}
            <linearGradient id={`edgeFeatherGrad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1C1F26" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#0C0D10" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1A1C22" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Layer A: Left Entry Bristles (Shohitsu heel press) */}
          <g className="ink-bristles-left">
            {BRUSH_TEXT_PANEL_BRISTLES_LEFT.map((d, i) => (
              <path key={`bl-${i}`} d={d} fill="#14161B" opacity="0.88" />
            ))}
          </g>

          {/* Layer B: Main Solid Organic Ink Body */}
          <path
            d={BRUSH_TEXT_PANEL_BODY}
            fill={`url(#sumiInkGrad-${uniqueId})`}
            className="ink-main-body-path"
          />

          {/* Layer C: Interior Dry-Brush Streaks & Bristle Trails */}
          <g ref={streaksRef} className="ink-streaks-group">
            {BRUSH_TEXT_PANEL_STREAKS.map((d, i) => (
              <path
                key={`strk-${i}`}
                d={d}
                fill={`url(#dryStreakGrad-${uniqueId})`}
                className="ink-streak"
              />
            ))}

            {/* Layer D: Right Tapered Exit Splays & Flying White */}
            {BRUSH_TEXT_PANEL_BRISTLES_RIGHT.map((d, i) => (
              <path
                key={`br-${i}`}
                d={d}
                fill="#181B22"
                opacity={0.85 - i * 0.08}
                className="ink-bristle"
              />
            ))}

            {/* Layer E: Micro Ink Splatters */}
            {BRUSH_TEXT_PANEL_SPLATTERS.map((s, i) => (
              <circle
                key={`splt-${i}`}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill="#15171D"
                opacity="0.75"
                className="ink-splatter"
              />
            ))}
          </g>
        </svg>

        {/* Washi Paper Fiber & Ink Bleed Absorption Texture */}
        <div className="ink-washi-fiber-overlay" />
      </div>

      {/* ================================================================== */}
      {/* 2. VERMILION HANKO SEAL (HONOR · 誉)                                */}
      {/* ================================================================== */}
      {sealText && (
        <div ref={sealRef} className="ink-panel-seal" title="Archival Seal of Honor" aria-hidden="true">
          <svg viewBox="0 0 64 64" className="ink-panel-seal-svg" width="38" height="38">
            <defs>
              <linearGradient id={`sealRedGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D9333B" />
                <stop offset="60%" stopColor="#BD232A" />
                <stop offset="100%" stopColor="#96151B" />
              </linearGradient>
            </defs>
            <path d={HANKO_BORDER_PATH} fill={`url(#sealRedGrad-${uniqueId})`} />
            <text
              x="32"
              y="42"
              textAnchor="middle"
              fill="#FDF6EB"
              fontSize="24"
              fontWeight="900"
              fontFamily="'Noto Serif JP', serif"
              letterSpacing="0"
            >
              {sealText}
            </text>
          </svg>
        </div>
      )}

      {/* ================================================================== */}
      {/* 3. PROTECTED HTML TEXT CONTENT                                     */}
      {/* ================================================================== */}
      <div className="ink-brush-panel-content">
        {/* Philosophical Statement (Crimson Serif Accent) */}
        {statement && (
          <div ref={statementRef} className="ink-panel-statement">
            <span className="ink-statement-accent-slash" aria-hidden="true">/</span>
            <span className="ink-statement-text">{statement}</span>
          </div>
        )}

        {/* Calligraphic Separation Rule */}
        {showDivider && (
          <div
            ref={dividerRef}
            className="ink-panel-divider-rule"
            aria-hidden="true"
          />
        )}

        {/* Core Descriptive Paragraph (Warm Ivory Typography) */}
        <div ref={descRef} className="ink-panel-desc-wrapper">
          {children || (
            <p className="ink-panel-description">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
