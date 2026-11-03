import React, { useState } from 'react';
import { Bookmark, Compass, ArrowDown, ChevronRight } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import HonorSamuraiFigure from './HonorSamuraiFigure';
import HonorPrinciples from './HonorPrinciples';
import HonorConflict from './HonorConflict';
import HonorPromise from './HonorPromise';
import HonorLegacy from './HonorLegacy';
import { InkBrushTextPanel } from './brushstroke';
import './honor.css';

/**
 * SectionHonor (武士の名誉 — THE HONOR OF THE SAMURAI)
 * -----------------------------------------------------------------------------
 * Complete Cinematic Page Redesign replacing the monument section into a
 * five-chapter immersive historical, philosophical, and aesthetic journey:
 *
 *  CHAPTER 01 — THE WEIGHT OF HONOR (Hero Composition & Living Vector Samurai)
 *  CHAPTER 02 — THE PRINCIPLES OF HONOR (Interactive Five Pillars of Virtue)
 *  CHAPTER 03 — THE INNER CONFLICT (Giri vs Ninjō Philosophical Crucible)
 *  CHAPTER 04 — THE WARRIOR'S PROMISE (Ceremonial Six Inviolable Vows with Seals)
 *  CHAPTER 05 — THE LEGACY OF HONOR (Modern Cultural Resonance & Shokunin Spirit)
 */
export default function SectionHonor() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeChapterTab, setActiveChapterTab] = useState('ch1');

  const chapterAnchors = [
    { id: 'ch1', num: '01', title: 'THE WEIGHT OF HONOR', jp: '名誉の重み', targetId: 'honor-ch1' },
    { id: 'ch2', num: '02', title: 'FIVE PRINCIPLES', jp: '五常の徳', targetId: 'honor-ch2' },
    { id: 'ch3', num: '03', title: 'THE INNER CONFLICT', jp: '名誉の葛藤', targetId: 'honor-ch3' },
    { id: 'ch4', num: '04', title: 'WARRIOR’S PROMISE', jp: '武士の誓い', targetId: 'honor-ch4' },
    { id: 'ch5', num: '05', title: 'ENDURING LEGACY', jp: '名誉の継承', targetId: 'honor-ch5' },
  ];

  const handleToggleBookmark = (e) => {
    e.stopPropagation();
    sound.playWoodenClick();
    setIsBookmarked((prev) => !prev);
  };

  const handleScrollToChapter = (targetId, chId) => {
    sound.playWoodenClick();
    setActiveChapterTab(chId);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="honor" className="section-honor-master" aria-labelledby="honor-hero-main-heading">
      <div className="section-container honor-master-container">

        {/* ============================================================== */}
        {/* CHAPTER 01 — THE WEIGHT OF HONOR (Hero Editorial Masterpiece)   */}
        {/* ============================================================== */}
        <div id="honor-ch1" className="honor-arrangement-card">

          {/* Section Top Header Row (Brand Wordmark + Traditional Kanji Tag) */}
          <div className="honor-section-top-header">
            <div className="honor-top-left-brand">
              <span className="brand-hanko-seal" aria-hidden="true">名</span>
              <span className="honor-brand-text">THE HONOR OF THE SAMURAI</span>
            </div>
            <div className="honor-top-right-tag">
              <span className="tag-archival-label">BUSHIDO CHRONICLES · THE WARRIOR'S CODE</span>
              <span className="tag-crimson-kanji">武士道 · 名誉</span>
            </div>
          </div>

          {/* Master Two-Column Balanced Composition */}
          <div className="honor-botanical-showcase-grid">

            {/* Left Column: Protected Editorial Narrative */}
            <div className="honor-editorial-column">
              {/* Small Archival Label */}
              <div className="honor-archival-eyebrow">
                <span className="eyebrow-accent-bullet" />
                <span>BUSHIDO CHRONICLES · THE WARRIOR'S CODE</span>
                <span className="eyebrow-kanji">名誉</span>
              </div>

              {/* Japanese Title */}
              <div className="honor-japanese-title" lang="ja">
                武士の名誉
              </div>

              {/* Large English Heading (Outside the Brushstroke Panel) */}
              <h2 id="honor-hero-main-heading" className="honor-editorial-headline">
                THE HONOR<br />
                OF THE SAMURAI<span className="headline-crimson-dot">.</span>
              </h2>

              {/* Handcrafted Sumi-e Ink Brushstroke Introductory Panel */}
              <InkBrushTextPanel
                statement="HONOR IS NOT GIVEN. IT IS LIVED."
                description="For the Samurai, honor was an ideal shaped by duty, conduct, reputation, and responsibility. Beyond the sword, a warrior's standing was measured by the principles they upheld and the choices they made."
                sealText="誉"
                className="honor-hero-ink-panel"
              />

              {/* Delicate Manuscript Separator */}
              <div className="honor-manuscript-connector" aria-hidden="true">
                <span className="connector-line" />
                <span className="connector-crimson-diamond" />
                <span className="connector-line" />
              </div>

              {/* Archival Metadata Pills */}
              <div className="honor-metadata-row">
                <span className="meta-pill">
                  <span className="meta-crimson-dot" />
                  PHILOSOPHY OF MEIYO (名誉)
                </span>
                <span className="meta-pill">
                  <span className="meta-crimson-dot" />
                  NIPPON KOKORO ARCHIVES
                </span>
                <span className="meta-pill">
                  <span className="meta-crimson-dot" />
                  CHAPTER VI
                </span>
              </div>

              {/* Elegant Chapter Navigation Pill Ribbon */}
              <div className="honor-chapter-nav-ribbon" role="navigation" aria-label="Honor Chapters">
                <span className="nav-ribbon-title">SCROLL CHAPTERS</span>
                <div className="nav-pills-list">
                  {chapterAnchors.map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      className={`honor-nav-pill-btn ${activeChapterTab === ch.id ? 'is-active' : ''}`}
                      onClick={() => handleScrollToChapter(ch.targetId, ch.id)}
                    >
                      <span className="pill-num">{ch.num}</span>
                      <span className="pill-title">{ch.title}</span>
                      <span className="pill-jp">{ch.jp}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Dedicated Visual Area */}
            <div className="honor-visual-column">
              <div className="honor-visual-frame-card">
                {/* Floating Bookmark Button */}
                <button
                  type="button"
                  className={`honor-visual-bookmark-btn ${isBookmarked ? 'is-bookmarked' : ''}`}
                  onClick={handleToggleBookmark}
                  aria-label={isBookmarked ? 'Saved to Soul Collection' : 'Bookmark this chapter'}
                  title={isBookmarked ? 'Saved in Soul Collection (Click to unbookmark)' : 'Save to Soul Collection'}
                >
                  <Bookmark
                    size={20}
                    color="#FFFFFF"
                    fill={isBookmarked ? '#C5282F' : 'none'}
                    strokeWidth={2}
                  />
                </button>

                {/* Living Vector Samurai Figure Scene */}
                <HonorSamuraiFigure
                  onInteract={() => sound.playBladeGlint()}
                />

                {/* Sub-label under frame */}
                <div className="honor-frame-caption">
                  <span>武士の静寂 · THE TRANQUIL DIGNITY OF THE WARRIOR</span>
                  <span className="caption-dot">·</span>
                  <span>KYOTO IMPERIAL ARCHIVES</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Conceptual Caption */}
          <p className="honor-conceptual-arrangement-caption">
            Chapter 01 of The Honor of the Samurai — A continuous Japanese illustrated scroll exploring the philosophical foundations of Bushido.
          </p>
        </div>

        {/* Scroll Divider Seam */}
        <div className="honor-scroll-seam-bar" aria-hidden="true">
          <span className="seam-line" />
          <span className="seam-kanji-crest">五常</span>
          <span className="seam-line" />
        </div>

        {/* ============================================================== */}
        {/* CHAPTER 02 — THE PRINCIPLES OF HONOR (Interactive 5 Pillars)    */}
        {/* ============================================================== */}
        <div id="honor-ch2" className="honor-scroll-sub-section">
          <HonorPrinciples />
        </div>

        {/* Scroll Divider Seam */}
        <div className="honor-scroll-seam-bar" aria-hidden="true">
          <span className="seam-line" />
          <span className="seam-kanji-crest">葛藤</span>
          <span className="seam-line" />
        </div>

        {/* ============================================================== */}
        {/* CHAPTER 03 — THE INNER CONFLICT (Giri vs Ninjō Dilemmas)       */}
        {/* ============================================================== */}
        <div id="honor-ch3" className="honor-scroll-sub-section">
          <HonorConflict />
        </div>

        {/* Scroll Divider Seam */}
        <div className="honor-scroll-seam-bar" aria-hidden="true">
          <span className="seam-line" />
          <span className="seam-kanji-crest">誓約</span>
          <span className="seam-line" />
        </div>

        {/* ============================================================== */}
        {/* CHAPTER 04 — THE WARRIOR'S PROMISE (The Six Inviolable Vows)   */}
        {/* ============================================================== */}
        <div id="honor-ch4" className="honor-scroll-sub-section">
          <HonorPromise />
        </div>

        {/* Scroll Divider Seam */}
        <div className="honor-scroll-seam-bar" aria-hidden="true">
          <span className="seam-line" />
          <span className="seam-kanji-crest">継承</span>
          <span className="seam-line" />
        </div>

        {/* ============================================================== */}
        {/* CHAPTER 05 — THE LEGACY OF HONOR (Modern Cultural Resonance)   */}
        {/* ============================================================== */}
        <div id="honor-ch5" className="honor-scroll-sub-section">
          <HonorLegacy
            onExploreNext={() => {
              const cta = document.getElementById('cta');
              if (cta) cta.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

      </div>
    </section>
  );
}

