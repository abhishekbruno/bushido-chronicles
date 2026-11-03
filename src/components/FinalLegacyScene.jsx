import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import RoninLegacyArtwork from './RoninLegacyArtwork';

/**
 * FinalLegacyScene (消えぬ遺産 · A LEGACY THAT NEVER FADES)
 * -----------------------------------------------------------------------------
 * Museum-grade cinematic conclusion connecting historical Samurai ideals
 * to their continuing cultural influence.
 *
 * Visual & Structural Composition:
 *  - Single continuous warm washi parchment scroll atmosphere.
 *  - Left Editorial Content:
 *      * Archival Kicker: ETERNAL ARCHIVES · KYOTO with vermilion seal (武士)
 *      * Japanese Calligraphy: 消えぬ遺産 (A Legacy That Never Fades)
 *      * Serif Master Headline: A LEGACY THAT NEVER FADES.
 *      * Crimson accent bar
 *      * Scholarly narrative paragraph
 *      * Interactive action buttons: EXPLORE THE ARCHIVES & RETURN TO THE BEGINNING
 *  - Right Visual Artwork:
 *      * High-Fidelity Living Rōnin in traditional straw hat, black armor, daisho
 *      * Breathing Crimson Celestial Sun with 8–12s atmospheric halo
 *      * Living wind-blown Japanese silver pampas grass (susuki)
 *      * Distant misty mountains & five-story pagoda
 *      * Soaring flock of wild geese
 *  - Vintage Bottom Monograph Rule:
 *      * 武士道年代記 — BUSHIDO CHRONICLES | Red mon crest | VOL. III: THE LAST RONIN | ARCHIVAL SERIES
 */
export default function FinalLegacyScene({ onExploreLegacy }) {
  const handleExplore = (e) => {
    sound.playWoodenClick();
    if (onExploreLegacy) {
      onExploreLegacy(e);
    } else {
      document.getElementById('legacy')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReturnTop = () => {
    sound.playWoodenClick();
  };

  return (
    <div className="bc-legacy bc-legacy--editorial" id="final-legacy">
      <div className="bc-legacy-inner">
        {/* Left Editorial Column (approx 42%) */}
        <div className="bc-legacy-copy">
          <div className="bc-kicker">
            <span className="bc-kicker-line" aria-hidden="true" />
            <span>ETERNAL ARCHIVES · KYOTO</span>
            <span className="bc-kicker-seal" aria-hidden="true">武士</span>
          </div>

          <p className="bc-legacy-ideogram" lang="ja">消えぬ遺産</p>

          <h2 className="bc-legacy-title">
            A LEGACY THAT<br />NEVER FADES<span>.</span>
          </h2>

          <div className="bc-legacy-accent-bar" aria-hidden="true" />

          <p className="bc-legacy-description">
            Across centuries, the Samurai spirit endures — a timeless code of honor, discipline,
            and purpose that continues to inspire generations, far beyond the last sword.
          </p>

          <div className="bc-legacy-actions">
            <button
              className="bc-btn bc-btn-primary"
              type="button"
              onClick={handleExplore}
            >
              EXPLORE THE ARCHIVES <ArrowUpRight size={16} aria-hidden="true" />
            </button>

            <a
              href="#hero"
              className="bc-btn bc-btn-outline"
              onClick={handleReturnTop}
            >
              RETURN TO THE BEGINNING <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Right Artwork Scene (approx 58%) */}
        <div className="bc-legacy-visual">
          <RoninLegacyArtwork />
        </div>
      </div>

      {/* Bottom Monograph Archival Rule (Matching Concept Design) */}
      <div className="bc-legacy-bottom-monograph">
        <div className="monograph-left">
          <span lang="ja">武士道年代記</span>
          <span className="monograph-sep">—</span>
          <span>BUSHIDO CHRONICLES</span>
        </div>

        <div className="monograph-center" aria-hidden="true">
          <svg className="monograph-chrysanthemum-seal" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#B33A3E" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="3.5" fill="#B33A3E" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
              <line
                key={ang}
                x1="12"
                y1="5.5"
                x2="12"
                y2="8"
                stroke="#B33A3E"
                strokeWidth="1.5"
                transform={`rotate(${ang} 12 12)`}
              />
            ))}
          </svg>
        </div>

        <div className="monograph-right">
          <span>VOL. III: THE LAST RONIN</span>
          <span className="monograph-sep">|</span>
          <span>ARCHIVAL SERIES</span>
        </div>
      </div>
    </div>
  );
}
