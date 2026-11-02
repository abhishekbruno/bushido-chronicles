import React from 'react';
import { ArrowUp } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import FinalLegacyScene from './FinalLegacyScene';
import JapaneseMapleTree from './JapaneseMapleTree';

/**
 * SectionCTA (A LEGACY THAT NEVER FADES - Living Japanese Samurai Poster)
 * -----------------------------------------------------------------------------
 * Cinematic final section of the website.
 * Features:
 *  - Full-width living Japanese Samurai poster composition
 *  - Massive Japanese display typography: 色褪せぬ武士の魂
 *  - Standing Samurai silhouette before a glowing crimson sun
 *  - Independently animated wind-swaying grass, robes, and sageo cords
 *  - Framing Japanese maple branches and luxury editorial footer
 */
export default function SectionCTA({ onExploreLegacy }) {
  const scrollToTop = () => {
    sound.playSwordSlash();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDiscoverCode = () => {
    const bushidoEl = document.getElementById('bushido');
    if (bushidoEl) {
      bushidoEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section-cta" id="cta">
      {/* Dramatic Framing Japanese Maple Branches */}
      <JapaneseMapleTree variant="cta-frame" />

      {/* Living Japanese Samurai Poster Stage */}
      <FinalLegacyScene
        onExploreLegacy={onExploreLegacy}
        onDiscoverCode={handleDiscoverCode}
      />

      {/* LUXURY EDITORIAL FOOTER */}
      <footer className="editorial-footer">
        <div className="footer-top-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="footer-logo-insignia">武</span>
              <span className="footer-logo-text">SAMURAI<span className="logo-dot">.</span></span>
            </div>
            <p className="footer-brand-desc">
              An immersive digital museum and philosophical archive celebrating the art,
              culture, and eternal code of feudal Japanese warriors.
            </p>
            <div className="footer-year-badge">REIWA ERA · 令和八年 · 2026</div>
          </div>

          {/* Navigation Links Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">ARCHIVES</h4>
            <ul className="footer-links-list">
              <li><a href="#hero" className="interactive">The Hero's Awakening</a></li>
              <li><a href="#legacy" className="interactive">The Samurai Legacy</a></li>
              <li><a href="#bushido" className="interactive">The Code of Bushido</a></li>
              <li><a href="#warriors" className="interactive">Legendary Warriors</a></li>
              <li><a href="#blade" className="interactive">The Art of the Blade</a></li>
              <li><a href="#spirit" className="interactive">The Spirit of Japan</a></li>
            </ul>
          </div>

          {/* Historical Sources Column */}
          <div className="footer-sources-col">
            <h4 className="footer-col-title">SCHOLARLY SOURCES</h4>
            <ul className="footer-links-list">
              <li><span>Go Rin No Sho — Miyamoto Musashi (1645)</span></li>
              <li><span>Hagakure: The Book of the Samurai (1716)</span></li>
              <li><span>Bushido: The Soul of Japan — Inazo Nitobe (1899)</span></li>
              <li><span>Kyoto National Museum Feudal Archives</span></li>
              <li><span>Tokyo National Museum Sword Collection</span></li>
            </ul>
          </div>

          {/* Back To Top Column */}
          <div className="footer-action-col">
            <button
              className="back-to-top-btn interactive"
              onClick={scrollToTop}
              aria-label="Return to top of page"
            >
              <div className="top-arrow-circle">
                <ArrowUp size={20} />
              </div>
              <span className="top-btn-text">RETURN TO HEAVEN</span>
              <span className="top-btn-kanji">頂点へ</span>
            </button>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © 2026 THE WAY OF THE SAMURAI. DESIGNED WITH PRECISION & HONOR. ALL RIGHTS RESERVED.
          </div>
          <div className="footer-creeds">
            <span>義 · 勇 · 仁 · 礼 · 誠 · 名誉 · 忠義</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
