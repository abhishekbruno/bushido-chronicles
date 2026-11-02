import React, { useState } from 'react';
import { Mountain, Trees, Compass, Wind, Sparkles, Volume2, CloudFog, Feather, Bookmark, Flower2 } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import AnimatedChapterHeading from './AnimatedChapterHeading';
import SakuraTree from './SakuraTree';
import WashiPaperPanel from './WashiPaperPanel';

export default function SectionSpirit() {
  const [activeStory, setActiveStory] = useState(0);
  const [treeSeason, setTreeSeason] = useState('sakura'); // 'sakura' | 'momiji'

  const toggleSeason = () => {
    const next = treeSeason === 'sakura' ? 'momiji' : 'sakura';
    setTreeSeason(next);
    if (next === 'momiji') {
      sound.playWindWhistle();
    } else {
      sound.playBladeGlint();
    }
  };

  const stories = [
    {
      id: 'sakura',
      title: 'THE SAKURA TREE IN SPRING MIST',
      subtitle: 'The Inviolable Spirit of Spring & Fleeting Beauty',
      kanji: '桜',
      haikuEn: 'Petals drift in spring / Carried upon the fresh wind / Life in a moment.',
      haikuJp: '世の中は 三日見ぬ間に 桜かな',
      concept: 'MONO NO AWARE · THE PATHOS OF FLEETING THINGS',
      desc: 'To the samurai, the cherry blossom was the ultimate emblem of mortal perfection: blooming in radiant splendor, then falling gracefully at the peak of its beauty without clinging to the branch.',
      badge: 'SPRING BLOSSOMS · KYOTO',
    },
    {
      id: 'fuji',
      title: 'MOUNT FUJI IN SUMI-E MIST',
      subtitle: 'The Inviolable Peak & Sacred Snows',
      kanji: '富士山',
      haikuEn: 'On the sacred white peak / Snow falls into eternal peace / The blade finds its soul.',
      haikuJp: '名月や 池をめぐりて 夜もすがら',
      concept: 'FUDOSHIN · THE IMMOVABLE MIND',
      desc: 'To the samurai, Fujisan was the sacred embodiment of Fudoshin—the state of absolute mental equilibrium unshakeable by storm, threat, or mortality. Beneath perpetual glacial silence lies volcanic power held in perfect mastery.',
      badge: 'SACRED VOLCANO · 3,776M',
    },
    {
      id: 'bamboo',
      title: 'THE SACRED GROVES OF ARASHIYAMA',
      subtitle: 'Flexibility Against the Typhoon',
      kanji: '竹林',
      haikuEn: 'Green stalks bend in storm / Never breaking in the gale / Strength in yielding grace.',
      haikuJp: '静けさや 岩にしみ入る 蝉の声',
      concept: 'JUYOKU GOU WO SEISU · SOFTNESS CONQUERS HARDNESS',
      desc: 'Bamboo teaches the warrior the ultimate paradox of endurance: the rigid ancient oak splinters in the hurricane, but the hollow bamboo yields to the tempest and springs back upright when the storm has spent its fury.',
      badge: 'ZEN FORESTS OF KYOTO',
    },
    {
      id: 'torii',
      title: 'THE FLOATING TORII OF MIYAJIMA',
      subtitle: 'The Gateway Between Two Worlds',
      kanji: '厳島',
      haikuEn: 'Crimson arch in tides / Between sacred and profane / The warrior steps forth.',
      haikuJp: '古池や 蛙飛びこむ 水の音',
      concept: 'SEI TO SHI · LIFE AND DEATH AS ONE',
      desc: 'Rising from the surging tides of the Seto Inland Sea, the vermilion O-Torii stands as the liminal threshold between the mundane realm and the realm of the Kami. The samurai cross this threshold in mind every morning, reconciling mortality with immortal duty.',
      badge: 'SACRED TIDEWAYS · HIROSHIMA',
    },
  ];

  const handleSelectStory = (idx) => {
    sound.playWoodenClick();
    if (idx === 0) sound.playBladeGlint();
    else if (idx === 1) sound.playGong();
    else sound.playTaiko();
    setActiveStory(idx);
  };

  const current = stories[activeStory];

  return (
    <section className="section-spirit" id="spirit">
      <div className="section-container">
        {/* Section Header Row (Reference Image Layout: "THE SPIRIT OF JAPAN" + "桜 - SAKURA") */}
        <div className="spirit-section-top-header">
          <div className="spirit-top-left-brand">
            <span className="spirit-brand-text">THE SPIRIT OF JAPAN</span>
            <span className="spirit-brand-sub">SECTION 05 / 06 · 日本の精神</span>
          </div>
          <div className="spirit-top-right-tag">
            <Flower2 size={13} className="text-crimson" />
            <span className="tag-kanji">桜</span>
            <span className="tag-divider">·</span>
            <span className="tag-en">SAKURA</span>
          </div>
        </div>

        {/* Master Two-Column Balanced Composition (Reference Image Archetype) */}
        <div className="spirit-botanical-showcase-grid">
          {/* ============================================================ */}
          {/* LEFT COLUMN (~42% Width): DEDICATED SAKURA VISUAL REGION     */}
          {/* ============================================================ */}
          <div className="spirit-sakura-visual-column">
            <div className="spirit-tree-frame-card">
              {/* Mountain Mist Background SVG Layer */}
              <div className="tree-frame-mountain-bg" aria-hidden="true">
                <svg viewBox="0 0 600 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="mountain-mist-svg" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="mistSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FAF5E8" />
                      <stop offset="45%" stopColor="#F2ECE0" />
                      <stop offset="85%" stopColor="#E5DDD0" />
                      <stop offset="100%" stopColor="#D8CFC0" />
                    </linearGradient>
                    <linearGradient id="mountainRidgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#7E7873" stopOpacity="0.4" />
                      <stop offset="70%" stopColor="#5E5854" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#FAF5E8" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="mountainNearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3E3935" stopOpacity="0.55" />
                      <stop offset="65%" stopColor="#252220" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#FAF5E8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Sky wash */}
                  <rect width="600" height="900" fill="url(#mistSkyGrad)" />

                  {/* Far distant mountain peaks (Atmospheric wash) */}
                  <path d="M 0 320 C 80 240, 160 270, 240 210 C 320 160, 420 220, 500 170 C 550 140, 580 180, 600 210 L 600 550 L 0 550 Z" fill="url(#mountainRidgeGrad)" />

                  {/* Midground mountain ridge with cliff on right (Image 1 Archetype) */}
                  <path d="M 0 420 C 100 370, 180 340, 280 390 C 370 435, 450 360, 510 395 C 550 420, 580 400, 600 430 L 600 750 L 0 750 Z" fill="url(#mountainNearGrad)" />

                  {/* Distant Japanese Pagoda / Pavilion on Cliff Ridge (Image 1 Archetype) */}
                  <g transform="translate(480, 355) scale(0.65)" opacity="0.65" fill="#2A2623">
                    {/* Multi-tiered curved Pagoda roofs */}
                    <path d="M 15 0 L 0 8 C 8 8, 22 8, 30 8 Z" />
                    <rect x="13" y="8" width="4" height="6" />
                    <path d="M 15 14 L -4 24 C 6 24, 24 24, 34 24 Z" />
                    <rect x="11" y="24" width="8" height="8" />
                    <path d="M 15 32 L -10 44 C 3 44, 27 44, 40 44 Z" />
                    <rect x="8" y="44" width="14" height="10" />
                  </g>

                  {/* Distant Pine Trees on Mountain Ridge (Image 1 Archetype) */}
                  <g opacity="0.45" fill="#252220">
                    <path d="M 455 385 L 452 375 L 458 375 Z M 450 390 L 447 380 L 453 380 Z" />
                    <path d="M 525 392 L 522 382 L 528 382 Z M 532 396 L 529 385 L 535 385 Z" />
                  </g>

                  {/* Flock of Wild Cranes / Birds Drifting in Mountain Mist (Image 4 Archetype) */}
                  <g opacity="0.42" stroke="#2A2623" strokeWidth="1.2" fill="none" strokeLinecap="round">
                    <path d="M 120 220 Q 126 215, 132 220 Q 138 215, 144 220" />
                    <path d="M 148 235 Q 153 230, 158 235 Q 163 230, 168 235" />
                    <path d="M 180 210 Q 185 206, 190 210 Q 195 206, 200 210" />
                    <path d="M 215 228 Q 220 224, 225 228 Q 230 224, 235 228" />
                  </g>

                  {/* Soft mist clouds */}
                  <ellipse cx="300" cy="500" rx="350" ry="120" fill="#FAF5E8" opacity="0.65" filter="blur(20px)" />
                  <ellipse cx="200" cy="650" rx="280" ry="90" fill="#FAF5E8" opacity="0.75" filter="blur(16px)" />
                </svg>
              </div>

              {/* Bookmark Archive Pill Badge (From Reference Image 4) */}
              <button
                type="button"
                className="tree-frame-bookmark-badge interactive"
                onClick={toggleSeason}
                title={`Switch season: Currently ${treeSeason === 'sakura' ? 'Spring Sakura' : 'Autumn Momiji'}`}
                aria-label="Toggle Tree Season"
              >
                <Bookmark size={15} />
              </button>

              {/* Seasonal Mode Indicator Toggle Pill */}
              <div className="tree-season-switcher-pill">
                <button
                  type="button"
                  className={`season-pill-btn ${treeSeason === 'sakura' ? 'active' : ''}`}
                  onClick={() => setTreeSeason('sakura')}
                >
                  🌸 春 SAKURA
                </button>
                <span className="season-pill-divider">/</span>
                <button
                  type="button"
                  className={`season-pill-btn ${treeSeason === 'momiji' ? 'active' : ''}`}
                  onClick={() => setTreeSeason('momiji')}
                >
                  🍁 秋 MOMIJI
                </button>
              </div>

              {/* RECONSTRUCTED BOTANICAL TREE WITH INDEPENDENT BRANCHES & WIND */}
              <div className="tree-stage-viewport">
                <SakuraTree
                  mode={treeSeason}
                  className="reconstructed-sakura-tree"
                  onToggleSeason={toggleSeason}
                />
              </div>

              {/* Subtle Botanical Label at Card Foot */}
              <div className="tree-frame-footer-caption" aria-hidden="true">
                <span className="caption-dot" />
                <span className="caption-text">
                  {treeSeason === 'sakura'
                    ? 'PRUNUS SERRULATA · 古代山桜'
                    : 'ACER PALMATUM · イロハモミジ'}
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN (~58% Width): PROTECTED CONTENT AREA            */}
          {/* ============================================================ */}
          <div className="spirit-protected-content-column">
            {/* 1. Small Uppercase Eyebrow */}
            <div className="spirit-content-eyebrow">
              <span className="eyebrow-accent-bar" />
              <span className="eyebrow-text">LANDSCAPES OF THE SOUL</span>
              <span className="eyebrow-kanji">魂の風景</span>
            </div>

            {/* 2. Massive Editorial Monument Headline (From Reference Image) */}
            <h2 className="spirit-beauty-headline">
              THE BEAUTY OF STILLNESS<span className="headline-crimson-dot">.</span>
            </h2>

            {/* 3. Refined Narrative Description */}
            <p className="spirit-beauty-desc">
              A living portrait of Japanese spring, where ancient branches bend gently in the wind and Sakura petals drift through the air.
            </p>

            {/* 4. Architectural Separation Line (From Reference Image: "Dedicated visual area · Protected content area") */}
            <div className="spirit-layout-rule-row" aria-hidden="true">
              <span className="rule-label">Dedicated visual area</span>
              <span className="rule-dash">·</span>
              <span className="rule-label">Protected content area</span>
            </div>

            {/* 5. Sacred Geography Interactive Tabs (Variant B Manuscript Washi) */}
            <div className="spirit-stories-selector" role="tablist" aria-label="Sacred Japanese Landscapes">
              {stories.map((story, idx) => (
                <button
                  key={story.id}
                  className={`spirit-story-tab-btn ${activeStory === idx ? 'active' : ''} interactive`}
                  onClick={() => handleSelectStory(idx)}
                  role="tab"
                  aria-selected={activeStory === idx}
                >
                  <div className="tab-btn-header">
                    <span className="tab-index-num">0{idx + 1}</span>
                    <span className="tab-kanji-glyph">{story.kanji}</span>
                  </div>
                  <span className="tab-title-text">{story.title}</span>
                  <span className="tab-subtitle-text">{story.subtitle}</span>
                </button>
              ))}
            </div>

            {/* 6. Active Story Zen Haiku & Concept Meditation (Variant A Soft Parchment) */}
            <WashiPaperPanel variant="soft" crimsonAccent className="spirit-haiku-meditation-card">
              <div className="meditation-top-meta">
                <span className="meditation-concept-badge">{current.concept}</span>
                <span className="meditation-location-badge">{current.badge}</span>
              </div>

              <div className="meditation-haiku-box">
                <span className="haiku-quote-mark">“</span>
                <p className="haiku-english-verse">{current.haikuEn}</p>
                <p className="haiku-japanese-verse">{current.haikuJp}</p>
              </div>

              <p className="meditation-deep-desc">{current.desc}</p>
            </WashiPaperPanel>
          </div>
        </div>
      </div>
    </section>
  );
}
