import React, { useRef, useEffect, useState } from 'react';
import CrimsonSun from './CrimsonSun';
import LegacySamurai from './LegacySamurai';
import AnimatedGrass from './AnimatedGrass';
import JapaneseHeadline from './JapaneseHeadline';
import LegacyAtmosphere from './LegacyAtmosphere';
import { sound } from '../utils/soundEngine';

/**
 * FinalLegacyScene (色褪せぬ武士の魂 - The Living Japanese Samurai Poster)
 * -----------------------------------------------------------------------------
 * Cinematic final section inspired directly by the reference poster artwork
 * (media_1793619060255_cb56b458.jpg).
 *
 * Composition:
 *  - Full-width antique washi poster card with delicate inset manga frame
 *  - Left Column: Massive Japanese typography (色褪せぬ武士の魂), English heading,
 *    supporting narrative, and luxury interactive CTAs
 *  - Center/Right Visual: Black Samurai standing stoically before a glowing crimson sun
 *  - Foreground: Tall, wind-animated Japanese pampas grass overlapping warrior's feet
 *  - Environmental details: 3-dot pagination, corner caption, rain streaks, and drifting mist
 */
export default function FinalLegacyScene({
  onExploreLegacy,
  onDiscoverCode,
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [stampCount, setStampCount] = useState(4892);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    // Fallback: immediate check
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      setIsRevealed(true);
    }

    return () => observer.disconnect();
  }, []);

  const handleStamp = () => {
    sound.playTaiko();
    sound.playGong();
    setStamped(true);
    setStampCount((prev) => prev + 1);
  };

  return (
    <div
      ref={sectionRef}
      className={`final-legacy-poster-stage ${isRevealed ? 'is-revealed' : ''}`}
    >
      {/* 1. Signature Inset Manga / Editorial Card Container */}
      <div className="legacy-poster-card">
        {/* Delicate Inset Border Stroke with Rounded Corners */}
        <div className="poster-inner-frame-stroke" aria-hidden="true" />

        {/* Atmospheric Rain Streaks & Mist Layers */}
        <LegacyAtmosphere />

        {/* Top Editorial Poster Navigation Header (Reference Image Archetype) */}
        <div className="poster-top-editorial-nav" aria-label="Poster header">
          <div className="poster-nav-brand">
            <span className="poster-brand-icon">武</span>
            <span className="poster-brand-title">SAMURAI</span>
          </div>
          <nav className="poster-nav-links" aria-label="Poster links">
            <a href="#bushido" className="poster-nav-link interactive">EVENT</a>
            <a href="#warriors" className="poster-nav-link interactive">MANGA</a>
            <a href="#blade" className="poster-nav-link interactive">PROMOS</a>
            <a href="#spirit" className="poster-nav-link interactive">ARTIST</a>
          </nav>
          <div className="poster-nav-action">
            <button
              type="button"
              className="poster-order-pill interactive"
              onClick={onExploreLegacy}
            >
              ORDER NOW
            </button>
          </div>
        </div>

        {/* Faint Outlined Kanji Watermark in Right Background (Reference Image Archetype: 年) */}
        <div className="legacy-watermark-kanji" aria-hidden="true">
          年
        </div>

        {/* Main Split Grid: Left Typography & Right Living Samurai Scene */}
        <div className="legacy-poster-editorial-grid">
          {/* ========================================================== */}
          {/* LEFT COLUMN: Large Japanese Typography & Narrative Actions  */}
          {/* ========================================================== */}
          <div className="legacy-text-zone">
            <JapaneseHeadline
              onExploreLegacy={onExploreLegacy}
              onDiscoverCode={onDiscoverCode}
              stamped={stamped}
              stampCount={stampCount}
              onStamp={handleStamp}
            />
          </div>

          {/* ========================================================== */}
          {/* CENTER / RIGHT VISUAL STAGE: Samurai & Crimson Sun Scene    */}
          {/* ========================================================== */}
          <div className="legacy-artwork-stage">
            {/* Unified Stage aligning Crimson Sun directly behind Samurai */}
            <div className="legacy-figure-sun-combo">
              <CrimsonSun className="poster-crimson-sun" />
              <LegacySamurai className="poster-samurai-warrior" />
            </div>
          </div>
        </div>

        {/* Full-Width Living Japanese Pampas Grassland across entire base */}
        <AnimatedGrass className="poster-foreground-grass" isRevealed={isRevealed} />

        {/* Bottom Bar: 3-Dot Pagination (Left) & Japanese Caption (Right) */}
        <div className="poster-card-bottom-bar" aria-hidden="true">
          {/* 3-Dot Pagination Indicator from Reference Image */}
          <div className="poster-pagination-dots" aria-label="Page indicator">
            <span className="page-dot active-dot" title="Act I: Awakening" />
            <span className="page-dot" title="Act II: The Code" />
            <span className="page-dot" title="Act III: Final Legacy" />
          </div>

          {/* Bottom Right Japanese Caption from Reference Image */}
          <div className="poster-bottom-caption">
            <span className="caption-jp">マンガが大好きな人が作った</span>
            <span className="caption-divider">·</span>
            <span className="caption-en">KYOTO ARCHIVES · 1603</span>
          </div>
        </div>
      </div>
    </div>
  );
}
