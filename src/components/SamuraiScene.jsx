import React, { useEffect, useRef, useState } from 'react';
import RisingSun from './RisingSun';
import AnimatedSamurai from './AnimatedSamurai';
import JapaneseLandscape from './JapaneseLandscape';
import InkParticles from './InkParticles';
import { CALLIGRAPHY_PATH } from '../assets/vectors/vectorPaths';
import { sound } from '../utils/soundEngine';

export default function SamuraiScene({ onEnterLegend, onExploreWarriors }) {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  // High-performance decoupled parallax using rAF & CSS custom properties (0 React re-renders on mouse/scroll)
  useEffect(() => {
    setIsReady(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let mouseCurX = 0;
    let mouseCurY = 0;
    let scrollCurY = 0;
    let animId;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseTargetX = (e.clientX / innerWidth) * 2 - 1;
      mouseTargetY = (e.clientY / innerHeight) * 2 - 1;
    };

    const updateParallax = () => {
      // Smooth linear interpolation (lerp) for cinematic inertia
      mouseCurX += (mouseTargetX - mouseCurX) * 0.08;
      mouseCurY += (mouseTargetY - mouseCurY) * 0.08;
      scrollCurY += (window.scrollY - scrollCurY) * 0.12;

      if (stageRef.current) {
        stageRef.current.style.setProperty('--p-mouse-x', mouseCurX.toFixed(4));
        stageRef.current.style.setProperty('--p-mouse-y', mouseCurY.toFixed(4));
        stageRef.current.style.setProperty('--p-scroll-y', scrollCurY.toFixed(2));
      }

      animId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleLearnMore = () => {
    sound.playTaiko();
    sound.playSwordSlash();
    if (onEnterLegend) onEnterLegend();
  };

  const handleSoundToggle = () => {
    sound.playWoodenClick();
    if (onExploreWarriors) onExploreWarriors();
  };

  return (
    <section ref={containerRef} className={`samurai-scene-hero ${isReady ? 'is-ready' : ''}`} id="hero">
      {/* Layer 1: Base Washi Paper Atmosphere */}
      <div className="scene-washi-backdrop" />

      {/* Signature Framed Manga/Editorial Canvas */}
      <div className="hero-framed-card">
        {/* Delicate Inset Manga Border Line */}
        <div className="hero-framed-inner-stroke" aria-hidden="true" />

        {/* Large Faint Outlined Kanji Watermark */}
        <div className="hero-watermark-kanji" aria-hidden="true">
          侍
        </div>

        {/* Main Two-Part Balanced Editorial Layout */}
        <div className="hero-editorial-split-container">
          {/* ============================================================ */}
          {/* LEFT COLUMN (~52% Width): Master Samurai Artwork Stage       */}
          {/* ============================================================ */}
          <div className="hero-visual-column">
            <div ref={stageRef} className="hero-artwork-stage">
              {/* Layer 2: The Rising Crimson Red Sun */}
              <RisingSun />

              {/* Layer 3: Vertical Japanese Calligraphy (Upper Left) */}
              <div className="hero-calligraphy-left" aria-hidden="true">
                <svg
                  className="calligraphy-svg"
                  viewBox="0 0 1215 1063"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path d={CALLIGRAPHY_PATH} fill="#050505" className="calligraphy-ink-stroke" />
                  <circle cx="218" cy="100" r="5.5" fill="#D90416" />
                </svg>
              </div>

              {/* Layer 4: The Black-Armored Samurai Warrior with Live Breathing & Blade Sheen */}
              <AnimatedSamurai />

              {/* Layer 5: Floating Ink Particles & Crimson Splatters */}
              <InkParticles />
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN (~48% Width): Typography, Description & CTAs   */}
          {/* ============================================================ */}
          <div className="hero-typography-column">
            <div className="hero-typography-content">
              {/* 1. Small Editorial Label */}
              <div className="hero-eyebrow-tag">
                <span className="eyebrow-rule" />
                <span className="eyebrow-meta">FEUDAL ARCHIVES · KYOTO</span>
                <span className="eyebrow-jp">武士道</span>
              </div>

              {/* Japanese Headline Accent */}
              <div className="hero-jp-headline-lead" aria-hidden="true">
                自分自身の戦いを
              </div>

              {/* 2. Monument Headline */}
              <h1 className="hero-monument-headline">
                <span className="headline-row row-1">THE WAY</span>
                <span className="headline-row row-2">OF THE</span>
                <span className="headline-row row-3 headline-crimson">
                  SAMURAI<span className="headline-crimson-dot">.</span>
                </span>
              </h1>

              {/* 3. Refined Editorial Narrative */}
              <p className="hero-editorial-lead">
                An immersive historical odyssey through feudal Japan. Discover the timeless
                virtues of Bushido, master swordsmithing archives, and legendary warrior chronicles
                forged through eight centuries of honor.
              </p>

              {/* 4. Editorial Call to Action Buttons */}
              <div className="hero-cta-button-group">
                <button
                  className="btn-hero-primary interactive"
                  onClick={handleLearnMore}
                  aria-label="Enter the Samurai Legend archives"
                >
                  <span className="btn-text">ENTER THE LEGEND</span>
                  <span className="btn-arrow" aria-hidden="true">→</span>
                </button>

                <button
                  className="btn-hero-secondary interactive"
                  onClick={handleSoundToggle}
                  aria-label="Explore the Legendary Warriors dossier"
                >
                  <span className="btn-text">EXPLORE WARRIORS</span>
                  <span className="btn-kanji" aria-hidden="true">武将</span>
                </button>
              </div>

              {/* 5. Historical Museum Metadata Footer */}
              <div className="hero-metadata-grid" aria-label="Feudal Archive details">
                <div className="meta-cell">
                  <span className="meta-label">ERA</span>
                  <span className="meta-val">1185–1868</span>
                </div>
                <div className="meta-cell">
                  <span className="meta-label">CODE</span>
                  <span className="meta-val">BUSHIDO · 7 VIRTUES</span>
                </div>
                <div className="meta-cell">
                  <span className="meta-label">FORGE</span>
                  <span className="meta-val">TAMAHAGANE STEEL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Editorial Japanese Landscape Silhouette at Base */}
        <JapaneseLandscape />
      </div>
    </section>
  );
}
