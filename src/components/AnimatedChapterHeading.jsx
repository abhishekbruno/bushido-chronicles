import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '../utils/soundEngine';

gsap.registerPlugin(ScrollTrigger);

/**
 * AnimatedChapterHeading
 * -----------------------------------------------------------------------------
 * Upgrades all 5 major chapter headings into bespoke cinematic experiences:
 *  1. FORGED IN SILENCE (legacy) — Hammered Ink Stamp, Dust Dispersion & Brush Sheen Wipe
 *  2. THE CODE OF BUSHIDO (bushido) — Ancient 3D Manuscript Paper Unfolding & Red Vermilion Seal
 *  3. LEGENDARY WARRIORS (warriors) — Katana Slash Slice, Sparks & Settle
 *  4. THE ART OF THE BLADE (blade) — Heated-Metal Thermal to Crimson Settle & Embers
 *  5. THE SPIRIT OF JAPAN (spirit) — Atmospheric Mist, Rising Sun Halo & Momiji Leaf
 *
 * Fully accessible (clean aria-label on h2), 4K-ready responsive typography,
 * GSAP ScrollTrigger bidirectional scroll support, and prefers-reduced-motion safe.
 */
export default function AnimatedChapterHeading({
  chapter = 'legacy',
  sectionLabel = 'SECTION 01',
  primaryText = 'FORGED IN',
  accentText = 'SILENCE.',
  className = '',
  breakLine = true,
  accessibleTitle,
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const fullTitle = accessibleTitle || `${sectionLabel}: ${primaryText} ${accentText}`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Instant display for accessibility
      gsap.set(el.querySelectorAll('*'), { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      // Master timeline for this heading instance
      const tl = gsap.timeline({ paused: true });

      // 0. Section Label and Crimson Rule
      const labelEl = el.querySelector('.heading-section-label');
      const ruleEl = el.querySelector('.label-rule');
      if (labelEl) {
        tl.fromTo(
          labelEl,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          0
        );
      }
      if (ruleEl) {
        tl.fromTo(
          ruleEl,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.45, ease: 'power2.out' },
          0.08
        );
      }

      // =======================================================================
      // CHAPTER 1: FORGED IN SILENCE (HAMMERED INK REVEAL)
      // =======================================================================
      if (chapter === 'legacy') {
        const stampText = el.querySelector('.stamp-ink-text');
        const dustSpecks = el.querySelectorAll('.ink-dust-speck');
        const brushWipe = el.querySelector('.brush-wipe-text');
        const brushOverlay = el.querySelector('.brush-wipe-ink-overlay');
        const dropletPeriod = el.querySelector('.ink-droplet-period');

        if (stampText) {
          // Bottom ink stamp entrance
          tl.fromTo(
            stampText,
            { y: -35, scale: 1.1, opacity: 0, filter: 'blur(6px)' },
            { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'power4.out' },
            0.15
          );
        }

        // Ink dust dispersion on impact
        if (dustSpecks && dustSpecks.length > 0) {
          const dispersals = [
            { x: -45, y: -35 },
            { x: 50, y: -45 },
            { x: -25, y: -55 },
            { x: 35, y: -25 },
            { x: -55, y: -15 },
            { x: 20, y: -50 },
          ];
          dustSpecks.forEach((speck, idx) => {
            const d = dispersals[idx % dispersals.length];
            tl.fromTo(
              speck,
              { x: 0, y: 0, opacity: 0.95, scale: 1.6 },
              { x: d.x, y: d.y, opacity: 0, scale: 0.2, duration: 0.65, ease: 'power2.out' },
              0.4
            );
          });
        }

        // Horizontal crimson brush wipe for "SILENCE"
        if (brushWipe) {
          tl.fromTo(
            brushWipe,
            { x: -25, opacity: 0, filter: 'blur(6px)' },
            { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out' },
            0.45
          );
        }
        if (brushOverlay) {
          tl.fromTo(
            brushOverlay,
            { x: '-100%', opacity: 0.8 },
            { x: '120%', opacity: 0, duration: 0.75, ease: 'power2.out' },
            0.45
          );
        }

        // Red ink droplet period drop
        if (dropletPeriod) {
          tl.fromTo(
            dropletPeriod,
            { y: -40, opacity: 0, scale: 1.6 },
            { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'bounce.out' },
            0.75
          );
        }
      }

      // =======================================================================
      // CHAPTER 2: THE CODE OF BUSHIDO (3D MANUSCRIPT UNFOLDING)
      // =======================================================================
      if (chapter === 'bushido') {
        const crease = el.querySelector('.manuscript-paper-crease');
        const unfoldText = el.querySelector('.unfold-paper-text');
        const scrollWipe = el.querySelector('.crimson-scroll-wipe');
        const seal = el.querySelector('.manuscript-stamp-seal');

        if (crease) {
          tl.fromTo(
            crease,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 0.7, duration: 0.65, ease: 'power2.out' },
            0.1
          );
        }

        if (unfoldText) {
          tl.fromTo(
            unfoldText,
            { rotateX: 85, y: -25, opacity: 0 },
            { rotateX: 0, y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
            0.2
          );
        }

        if (scrollWipe) {
          tl.fromTo(
            scrollWipe,
            { x: 20, opacity: 0, filter: 'blur(4px)' },
            { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out' },
            0.45
          );
        }

        if (seal) {
          tl.fromTo(
            seal,
            { scale: 2.3, rotate: 18, opacity: 0 },
            { scale: 1, rotate: -4, opacity: 0.95, duration: 0.45, ease: 'back.out(2)' },
            0.75
          );
        }
      }

      // =======================================================================
      // CHAPTER 3: LEGENDARY WARRIORS (KATANA SLASH REVEAL)
      // =======================================================================
      if (chapter === 'warriors') {
        const slashBeam = el.querySelector('.katana-slash-beam');
        const sparks = el.querySelectorAll('.slash-spark');
        const sliceTop = el.querySelector('.slice-top-text');
        const sliceBottom = el.querySelector('.slice-bottom-text');
        const underline = el.querySelector('.slash-crimson-underline');

        // Sword flash slash cut
        if (slashBeam) {
          tl.fromTo(
            slashBeam,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.18, ease: 'power4.in' },
            0.15
          );
          tl.to(slashBeam, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0.33);
        }

        // Sparks scattering along cut
        if (sparks && sparks.length > 0) {
          const sparkDeltas = [
            { x: 55, y: -45 },
            { x: 80, y: -20 },
            { x: -45, y: 40 },
            { x: 35, y: 50 },
            { x: -65, y: -30 },
          ];
          sparks.forEach((sp, idx) => {
            const d = sparkDeltas[idx % sparkDeltas.length];
            tl.fromTo(
              sp,
              { x: 0, y: 0, opacity: 1, scale: 1.5 },
              { x: d.x, y: d.y, opacity: 0, scale: 0.2, duration: 0.55, ease: 'power2.out' },
              0.22
            );
          });
        }

        // Top and bottom slices slide into settlement
        if (sliceTop) {
          tl.fromTo(
            sliceTop,
            { x: -28, y: -14, opacity: 0, filter: 'blur(4px)' },
            { x: 0, y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out' },
            0.25
          );
        }
        if (sliceBottom) {
          tl.fromTo(
            sliceBottom,
            { x: 28, y: 14, opacity: 0, filter: 'blur(4px)' },
            { x: 0, y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out' },
            0.28
          );
        }

        // Crimson underline gleam
        if (underline) {
          tl.fromTo(
            underline,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.55, ease: 'power2.out' },
            0.65
          );
        }
      }

      // =======================================================================
      // CHAPTER 4: THE ART OF THE BLADE (METALLIC FORGE & THERMAL REVEAL)
      // =======================================================================
      if (chapter === 'blade') {
        const forgeMask = el.querySelector('.forge-mask-text');
        const metalSheen = el.querySelector('.metal-gleam-sheen');
        const thermalText = el.querySelector('.thermal-forge-text');
        const thermalGlow = el.querySelector('.thermal-molten-glow');
        const anvilPeriod = el.querySelector('.anvil-strike-period');

        if (forgeMask) {
          tl.fromTo(
            forgeMask,
            { y: 22, opacity: 0, filter: 'blur(4px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out' },
            0.15
          );
        }

        if (metalSheen) {
          tl.fromTo(
            metalSheen,
            { x: '-120%', opacity: 0 },
            { x: '220%', opacity: 1, duration: 0.85, ease: 'power2.inOut' },
            0.35
          );
        }

        if (thermalGlow) {
          tl.fromTo(
            thermalGlow,
            { opacity: 0, scale: 0.7 },
            { opacity: 0.85, scale: 1, duration: 0.6, ease: 'power2.out' },
            0.3
          );
          tl.to(thermalGlow, { opacity: 0.35, duration: 0.8, ease: 'power1.out' }, 0.9);
        }

        if (thermalText) {
          tl.fromTo(
            thermalText,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            0.35
          );
        }

        if (anvilPeriod) {
          tl.fromTo(
            anvilPeriod,
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'bounce.out' },
            0.8
          );
        }
      }

      // =======================================================================
      // CHAPTER 5: THE SPIRIT OF JAPAN (MIST & RISING SUN REVEAL)
      // =======================================================================
      if (chapter === 'spirit') {
        const sunHalo = el.querySelector('.spirit-rising-sun-halo');
        const mist = el.querySelector('.spirit-atmospheric-mist');
        const mistText = el.querySelector('.ethereal-mist-text');
        const brushText = el.querySelector('.blossom-brush-text');
        const momiji = el.querySelector('.heading-floating-momiji');

        if (sunHalo) {
          tl.fromTo(
            sunHalo,
            { y: 40, scale: 0.5, opacity: 0 },
            { y: 0, scale: 1, opacity: 0.9, duration: 1.1, ease: 'power2.out' },
            0.1
          );
        }

        if (mist) {
          tl.fromTo(
            mist,
            { x: -35, opacity: 0 },
            { x: 20, opacity: 0.65, duration: 1.3, ease: 'power1.out' },
            0.15
          );
        }

        if (mistText) {
          tl.fromTo(
            mistText,
            { opacity: 0, filter: 'blur(12px)', y: 14 },
            { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.85, ease: 'power2.out' },
            0.25
          );
        }

        if (brushText) {
          tl.fromTo(
            brushText,
            { x: 20, opacity: 0, filter: 'blur(6px)' },
            { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.75, ease: 'power2.out' },
            0.55
          );
        }

        if (momiji) {
          tl.fromTo(
            momiji,
            { x: -15, y: -20, rotate: -35, opacity: 0 },
            { x: 0, y: 0, rotate: 12, opacity: 0.9, duration: 0.85, ease: 'power2.out' },
            0.85
          );
        }
      }

      // Bind ScrollTrigger to forward/backward scroll
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        end: 'bottom 15%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          tl.play();
          playChapterSound(chapter);
        },
        onEnterBack: () => {
          tl.play();
        },
        onLeaveBack: () => {
          tl.reverse();
        },
      });

      // If already in viewport on mount (e.g. top of page or direct link), trigger immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        tl.play();
      }
    }, el);

    return () => ctx.revert();
  }, [chapter]);

  const playChapterSound = (ch) => {
    try {
      if (ch === 'warriors') {
        sound.playSwordSlash();
      } else if (ch === 'blade') {
        sound.playBladeGlint();
      } else if (ch === 'legacy') {
        sound.playGroundImpact();
      } else if (ch === 'bushido') {
        sound.playWoodenClick();
      } else if (ch === 'spirit') {
        if (sound.playZenChime) sound.playZenChime();
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  return (
    <div
      ref={containerRef}
      className={`cinematic-heading-wrapper heading-chapter-${chapter} ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Accessible semantic heading */}
      <h2 className={`cinematic-heading-root ${className}`} aria-label={fullTitle}>
        {/* 1. Small Section Label */}
        <span className="heading-section-label" aria-hidden="true">
          <span className="label-rule" />
          <span className="label-text">{sectionLabel}</span>
        </span>

        {/* 2. Visual Animated Heading Elements */}
        <span className="heading-visual-content" aria-hidden="true">
          {/* ========================================================== */}
          {/* CHAPTER 1: FORGED IN SILENCE (HAMMERED INK REVEAL)         */}
          {/* ========================================================== */}
          {chapter === 'legacy' && (
            <span className="ch-legacy-assembly">
              <span className="ch-primary-line stamp-ink-text">
                {primaryText}
                {/* Black ink dust particles scattering on impact */}
                <span className="impact-dust-burst">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className={`ink-dust-speck speck-${i + 1}`} />
                  ))}
                </span>
              </span>
              {breakLine && <br />}
              <span className="ch-accent-line brush-wipe-text">
                <span className="brush-wipe-ink-overlay" />
                <span className="text-crimson-core">SILENCE</span>
                <span className="ink-droplet-period">.</span>
              </span>
            </span>
          )}

          {/* ========================================================== */}
          {/* CHAPTER 2: THE CODE OF BUSHIDO (MANUSCRIPT UNFOLDING)      */}
          {/* ========================================================== */}
          {chapter === 'bushido' && (
            <span className="ch-bushido-assembly">
              {/* Washi Paper Fold Line Background */}
              <span className="manuscript-paper-crease" />
              <span className="ch-primary-line unfold-paper-text">
                {primaryText}
              </span>
              {' '}
              <span className="ch-accent-line crimson-scroll-wipe">
                <span className="text-crimson-core">BUSHIDO.</span>
                {/* Traditional Japanese Red Seal Stamp */}
                <span className="manuscript-stamp-seal" title="武 (Bushi)">
                  <span>武</span>
                </span>
              </span>
            </span>
          )}

          {/* ========================================================== */}
          {/* CHAPTER 3: LEGENDARY WARRIORS (KATANA SLASH REVEAL)        */}
          {/* ========================================================== */}
          {chapter === 'warriors' && (
            <span className="ch-warriors-assembly">
              {/* Razor-sharp Katana Slash Streak at 45deg */}
              <span className="katana-slash-beam" />
              {/* Spark Fragments flying along trajectory */}
              <span className="slash-sparks-emitter">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`slash-spark spark-${i + 1}`} />
                ))}
              </span>
              <span className="ch-primary-line slice-top-text">
                {primaryText}
              </span>
              {' '}
              <span className="ch-accent-line slice-bottom-text text-crimson-core">
                {accentText}
                <span className="slash-crimson-underline" />
              </span>
            </span>
          )}

          {/* ========================================================== */}
          {/* CHAPTER 4: THE ART OF THE BLADE (METALLIC FORGE REVEAL)    */}
          {/* ========================================================== */}
          {chapter === 'blade' && (
            <span className="ch-blade-assembly">
              <span className="ch-primary-line forge-mask-text">
                {primaryText}
                <span className="metal-gleam-sheen" />
              </span>
              {breakLine && <br />}
              <span className="ch-accent-line thermal-forge-text">
                <span className="thermal-molten-glow" />
                <span className="text-crimson-core">THE BLADE</span>
                <span className="anvil-strike-period">.</span>
                {/* Rising Forge Embers */}
                <span className="forge-rising-embers">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`forge-ember ember-${i + 1}`} />
                  ))}
                </span>
              </span>
            </span>
          )}

          {/* ========================================================== */}
          {/* CHAPTER 5: THE SPIRIT OF JAPAN (MIST AND RISING SUN)       */}
          {/* ========================================================== */}
          {chapter === 'spirit' && (
            <span className="ch-spirit-assembly">
              {/* Faint Rising Crimson Sun Backdrop */}
              <span className="spirit-rising-sun-halo" />
              {/* Soft Drifting Atmospheric Mist */}
              <span className="spirit-atmospheric-mist" />
              <span className="ch-primary-line ethereal-mist-text">
                {primaryText}
              </span>
              {' '}
              <span className="ch-accent-line blossom-brush-text text-crimson-core">
                {accentText}
                {/* Floating Japanese Momiji Leaf Accent */}
                <span className="heading-floating-momiji" />
              </span>
            </span>
          )}
        </span>
      </h2>
    </div>
  );
}
