import React from 'react';

/**
 * JapaneseHeadline (色褪せぬ武士の魂 - Massive Japanese Editorial Typography)
 * -----------------------------------------------------------------------------
 * Clean, visually balanced editorial column inspired directly by the reference poster.
 *
 * Typography Hierarchy:
 *  1. Eyebrow Tag: ETERNAL ARCHIVES · KYOTO 永遠の道
 *  2. Primary Japanese Monument Headline: 色褪せぬ 武士の魂
 *  3. Secondary English Headline: A LEGACY THAT NEVER FADES.
 *  4. Supporting Narrative Description
 *  5. Interactive Hankō Seal Stamping Station
 */
export default function JapaneseHeadline({
  onExploreLegacy,
  onDiscoverCode,
  stamped,
  stampCount,
  onStamp,
  className = '',
}) {
  return (
    <div className={`legacy-editorial-column ${className}`}>
      {/* 1. Small Editorial Metadata Badge */}
      <div className="legacy-eyebrow-tag">
        <span className="eyebrow-crimson-bar" />
        <span className="eyebrow-text">ETERNAL ARCHIVES · KYOTO</span>
        <span className="eyebrow-kanji">永遠の道</span>
      </div>

      {/* 2. Primary Massive Japanese Headline (Reference Image Exact Archetype: 自分自身の戦いを 戦う少年) */}
      <h1 className="legacy-jp-headline" aria-label="自分自身の戦いを 戦う少年 - The Youth Fighting His Own Battle">
        <span className="jp-head-line line-top">自分自身の戦いを</span>
        <span className="jp-head-line line-bottom">戦う少年</span>
      </h1>

      {/* 3. Secondary Bold Condensed English Headline */}
      <h2 className="legacy-en-headline">
        <span className="en-head-text">A LEGACY THAT NEVER FADES</span>
        <span className="en-head-dot">.</span>
      </h2>

      {/* 4. Refined Editorial Narrative Description (From Reference Image 3) */}
      <p className="legacy-editorial-desc">
        要するに、意味を持たずデザイン確認用として使える"和文ダミーテキスト"です。Through centuries of change, the Samurai spirit endures — a timeless legacy of courage, discipline, and honor.
      </p>

      {/* 5. Dual Pill Action Buttons (Exact Reference Image 3 Archetype) */}
      <div className="poster-action-buttons-row">
        <button
          type="button"
          className="poster-btn-primary interactive"
          onClick={onExploreLegacy}
          aria-label="Pre Order the Samurai Collection"
        >
          PRE ORDER
        </button>
        <button
          type="button"
          className="poster-btn-secondary interactive"
          onClick={onDiscoverCode}
          aria-label="Contact Us & Discover the Code"
        >
          CONTACT US
        </button>
      </div>

      {/* 6. Interactive Hankō Seal Stamping Station */}
      <div className="legacy-hanko-station">
        <button
          className={`hanko-seal-box ${stamped ? 'is-stamped' : ''} interactive`}
          onClick={onStamp}
          title="Affix your Hankō seal of honor to the digital scroll"
          aria-label="Affix your Hanko seal of honor"
        >
          <div className="hanko-seal-frame">
            <span className="hanko-glyph-row">武士</span>
            <span className="hanko-glyph-row">道印</span>
          </div>
        </button>
        <div className="hanko-station-info">
          <span className="hanko-station-title">
            {stamped ? 'SEAL COMMITTED TO THE ARCHIVE' : 'AFFIX YOUR HANKŌ SEAL'}
          </span>
          <span className="hanko-station-meta">
            {stampCount.toLocaleString()} PLEDGES RECORDED · 誓約
          </span>
        </div>
      </div>
    </div>
  );
}
