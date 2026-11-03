import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import SakuraTree from './SakuraTree';
import SpiritLandscapeScene from './SpiritLandscapeScene';
import WashiPaperPanel from './WashiPaperPanel';

export default function SectionSpirit() {
  const [activeStory, setActiveStory] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [seasonMode, setSeasonMode] = useState('sakura'); // 'sakura' | 'momiji'

  const stories = [
    {
      id: 'sakura',
      title: 'SAKURA IN SPRING MIST',
      subtitle: 'The Inviolable Spirit of Spring & Fleeting Beauty',
      kanji: '桜',
      haikuEn: 'Petals drift in spring / Carried upon the fresh wind / Life in a moment.',
      haikuJp: '世の中は 三日見ぬ間に 桜かな',
      concept: 'MONO NO AWARE · THE PATHOS OF FLEETING THINGS',
      desc: 'Cherry blossoms became a poetic emblem of impermanence: radiant for a brief moment, then carried away by the spring breeze. Their fleeting beauty has long shaped Japanese art and reflection.',
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

  const handleToggleBookmark = (e) => {
    e.stopPropagation();
    sound.playWoodenClick();
    setIsBookmarked((prev) => !prev);
  };

  const handleToggleSeason = () => {
    sound.playWoodenClick();
    setSeasonMode((prev) => (prev === 'sakura' ? 'momiji' : 'sakura'));
  };

  const current = stories[activeStory];

  return (
    <section className="section-spirit" id="spirit">
      <div className="section-container">
        {/* Main Arrangement Presentation Container (Reference Layout) */}
        <div className="spirit-arrangement-card">
          {/* Section Header Row ("THE SPIRIT OF JAPAN" + "桜 · SAKURA") */}
          <div className="spirit-section-top-header">
            <div className="spirit-top-left-brand">
              <span className="spirit-brand-text">THE SPIRIT OF JAPAN</span>
            </div>
            <div className="spirit-top-right-tag">
              <span className="tag-sakura-text">桜 · SAKURA</span>
            </div>
          </div>

          {/* Master Two-Column Balanced Composition */}
          <div className="spirit-botanical-showcase-grid spirit-desktop-columns-grid">
            {/* Left Column: Dedicated Visual Area */}
            <div className="spirit-archive-visual-column">
              <div className="spirit-visual-frame-card">
                {/* Floating Bookmark Button on Top Right (From Reference Image) */}
                <button
                  type="button"
                  className={`spirit-visual-bookmark-btn ${isBookmarked ? 'is-bookmarked' : ''}`}
                  onClick={handleToggleBookmark}
                  aria-label={isBookmarked ? 'Saved to Soul Collection' : 'Bookmark this landscape'}
                  title={isBookmarked ? 'Saved in Soul Collection (Click to unbookmark)' : 'Save to Soul Collection'}
                >
                  <Bookmark
                    size={20}
                    color="#FFFFFF"
                    fill={isBookmarked ? '#C5282F' : 'none'}
                    strokeWidth={2}
                  />
                </button>

                {/* Visual Content: Sakura Tree Scene for Story 0, or respective landscape */}
                {activeStory === 0 ? (
                  <div className="spirit-sakura-scene-host">
                    <SakuraTree
                      mode={seasonMode}
                      interactive={true}
                      onToggleSeason={handleToggleSeason}
                    />
                    <button
                      type="button"
                      className="spirit-season-toggle-pill"
                      onClick={handleToggleSeason}
                      aria-label="Toggle Tree Season"
                      title="Click to toggle Spring Sakura / Autumn Momiji"
                    >
                      {seasonMode === 'sakura' ? '🌸 SPRING SAKURA' : '🍁 AUTUMN MOMIJI'}
                    </button>
                  </div>
                ) : (
                  <SpiritLandscapeScene storyKey={current.id} storyIndex={activeStory + 1} />
                )}
              </div>
            </div>

            {/* Right Column: Protected Content Region */}
            <div className="spirit-protected-content-column">
              {/* 1. Uppercase Eyebrow in Crimson */}
              <div className="spirit-editorial-eyebrow">
                LANDSCAPES OF THE SOUL
              </div>

              {/* 2. Massive Editorial Monument Headline */}
              <h2 className="spirit-editorial-headline">
                {activeStory === 0 ? (
                  <>THE BEAUTY OF STILLNESS<span className="headline-crimson-dot">.</span></>
                ) : (
                  <>{current.title}<span className="headline-crimson-dot">.</span></>
                )}
              </h2>

              {/* 3. Refined Narrative Description */}
              <p className="spirit-editorial-desc">
                {activeStory === 0
                  ? 'A living portrait of Japanese spring, where ancient branches bend gently in the wind and Sakura petals drift through the air.'
                  : current.desc}
              </p>

              {/* 4. Architectural Separation Line */}
              <div className="spirit-editorial-divider-line" aria-hidden="true" />

              {/* 5. Subtitle under Divider */}
              <div className="spirit-editorial-sublabel">
                Dedicated visual area · Protected content area
              </div>

              {/* 6. Sacred Geography Interactive Tabs */}
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

              {/* 7. Active Story Zen Haiku & Concept Meditation */}
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

          {/* Bottom Arrangement Note from Reference Image */}
          <p className="spirit-conceptual-arrangement-caption">
            Conceptual desktop arrangement, showing the Sakura tree and text in separate layout columns.
          </p>
        </div>
      </div>
    </section>
  );
}
