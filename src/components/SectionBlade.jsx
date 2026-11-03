import React, { useRef } from 'react';
import VerticalBladeIntro from './VerticalBladeIntro';
import HistoricalBladeGallery from './HistoricalBladeGallery';

/**
 * SectionBlade (The History of the Blade — 日本刀の歴史)
 * -----------------------------------------------------------------------------
 * Fully integrated museum exhibition replacing the obsolete forging sequence.
 *
 * Structure:
 *  1. Cinematic Scroll Introduction (VerticalBladeIntro):
 *     - Textured dark parchment background
 *     - Ink-brush reveal of Japanese title: 鋼に刻まれた歴史
 *     - Manuscript unfolding of: THE HISTORY OF THE BLADE / A LEGACY FORGED IN STEEL.
 *     - Detailed Japanese Katana emerges vertically under atmospheric museum spotlight
 *     - Specular highlight travels along polished steel from kissaki to habaki
 *     - Historical era metadata & curated collection counter
 *
 *  2. Scroll-Driven Historical Sword Gallery (HistoricalBladeGallery):
 *     - 5 documented Japanese sword exhibits (Mikazuki, Dōjigiri, Heshikiri, Wakizashi, Tantō)
 *     - Parameterized, physically scaled 2.5D SVG geometry (8.1 SVG units/cm)
 *     - Saya (scabbard) and steel toggles
 *     - Measurement guideline projections (nagasa and sori)
 *     - Enlarge view detail zoom with clear calibration labeling
 *     - Curated archival notes with direct museum collection links
 *     - Both scroll-driven exhibit transitions and interactive click/keyboard selection
 */
export default function SectionBlade() {
  const galleryAnchorRef = useRef(null);

  const handleScrollToGallery = () => {
    if (galleryAnchorRef.current) {
      galleryAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="blade" className="section-blade section-blade-museum">
      {/* Background Japanese Manuscript Ink Seam */}
      <div className="blade-manuscript-seam-top" aria-hidden="true" />

      <div className="section-container blade-museum-container">
        {/* 1. Cinematic Scroll Introduction with Vertical Blade Emergence */}
        <VerticalBladeIntro onScrollToExhibits={handleScrollToGallery} />

        {/* Anchor point for smooth scrolling into the exhibition gallery */}
        <div ref={galleryAnchorRef} id="gallery-anchor" className="museum-gallery-scroll-anchor" />

        {/* 2. Interactive Curated Historical Blade Gallery (01—05) */}
        <HistoricalBladeGallery />
      </div>

      {/* Bottom Subtle Transition Seam into Spirit Chapter */}
      <div className="blade-manuscript-seam-bottom" aria-hidden="true" />
    </section>
  );
}
