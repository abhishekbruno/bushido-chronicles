import React, { useState, useEffect } from 'react';
import { Scroll, Compass, Sparkles, Feather, Award } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import LegacyInkPoster from './LegacyInkPoster';
import AnimatedChapterHeading from './AnimatedChapterHeading';
import WashiPaperPanel from './WashiPaperPanel';
import KokoroMonumentArchive from './KokoroMonumentArchive';
import { InkQuotePanel, WashiBrushPanel, CrimsonBrushAccent } from './brushstroke';

export default function SectionLegacy() {
  const [activeEra, setActiveEra] = useState('sengoku');
  const [activeArchiveView, setActiveArchiveView] = useState('eras'); // 'eras' | 'monument'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('monument') || params.get('archive') === 'monument' || params.get('archive') === 'kokoro') {
      setActiveArchiveView('monument');
    }
  }, []);

  const eras = [
    {
      id: 'kamakura',
      name: 'Kamakura Era',
      dates: '1185 – 1333',
      kanji: '鎌倉',
      title: 'THE RISE OF THE BUSHI',
      desc: 'Minamoto no Yoritomo establishes the first shogunate, codifying the unwritten warrior ethic that prioritized equestrian archery (Kyūba no Michi) and absolute feudal loyalty.',
    },
    {
      id: 'sengoku',
      name: 'Sengoku Jidai',
      dates: '1467 – 1603',
      kanji: '戦国',
      title: 'THE AGE OF WARRING STATES',
      desc: 'An era of intense military conflict and social upheaval. Feudal daimyos competed for supremacy, elevating tactical brilliance, castle fortification, and the mastery of the katana.',
    },
    {
      id: 'edo',
      name: 'Edo Pax',
      dates: '1603 – 1868',
      kanji: '江戸',
      title: 'THE PHILOSOPHER WARRIOR',
      desc: 'Under Tokugawa Ieyasu, 250 years of peace transformed the warrior class into scholars, administrators, and custodians of spiritual perfection, formalizing the literary code of Bushido.',
    },
  ];

  const handleViewChange = (view) => {
    sound.playWoodenClick();
    setActiveArchiveView(view);
  };

  return (
    <section className="section-legacy" id="legacy">
      {/* Upper Framing Maple Branch Silhouette */}

      <div className="section-container">
        {/* Section Header with Editorial Index */}
        <div className="section-meta-row">
          <span className="section-index">01 / 06</span>
          <span className="section-meta-tag">HISTORICAL ARCHIVE & PHILOSOPHY</span>
          <span className="section-meta-kanji">遺産 · 伝統</span>
        </div>

        <div className="legacy-editorial-grid">
          {/* Left Column: Enormous Typography & Philosophy */}
          <div className="legacy-text-column">
            <AnimatedChapterHeading
              chapter="legacy"
              sectionLabel="SECTION 01"
              primaryText="FORGED IN"
              accentText="SILENCE."
              breakLine={true}
              className="legacy-title"
            />

            {/* TYPE A: Black Ink Brushstroke Quote Panel */}
            <InkQuotePanel
              quote="There is nothing outside of yourself that can ever enable you to become better, stronger, richer, quicker, or smarter. Everything is within. Everything exists. Seek nothing outside of yourself."
              author="MIYAMOTO MUSASHI"
              source="THE BOOK OF FIVE RINGS (五輪書), 1645"
              sealText="道"
              className="legacy-quote-card"
            />

            {/* Archival Mode Selector / Jump to Monument Exhibition */}
            <div className="archive-mode-toggle-bar">
              <button
                className="mode-toggle-btn active interactive"
                onClick={() => {
                  sound.playWoodenClick();
                  setActiveEra('sengoku');
                }}
              >
                <Scroll size={14} />
                <span>CHRONICLES OF ASCENT</span>
                <span className="mode-btn-kanji">時代録</span>
              </button>

              <button
                className="mode-toggle-btn interactive"
                onClick={() => {
                  sound.playWoodenClick();
                  const target = document.getElementById('monument');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Award size={14} />
                <span>THE GUARDIANS OF HISTORY</span>
                <span className="mode-btn-kanji">楠木正成 記念碑</span>
              </button>
            </div>

            {/* Historical Eras Interactive Selector */}
            <div className="eras-container">
              <h4 className="eras-label">FEUDAL EPOCHS · 歴史の変遷</h4>
              <div className="eras-tab-group">
                {eras.map((era) => (
                  <button
                    key={era.id}
                    className={`era-tab ${activeEra === era.id ? 'active' : ''} interactive`}
                    onClick={() => {
                      sound.playWoodenClick();
                      setActiveEra(era.id);
                    }}
                  >
                    <span className="era-tab-kanji">{era.kanji}</span>
                    <span className="era-tab-name">{era.name}</span>
                    <span className="era-tab-dates">{era.dates}</span>
                  </button>
                ))}
              </div>

              {/* TYPE B: Washi Brush-Frame Panel for Feudal Epoch History */}
              <WashiBrushPanel
                interactive
                className="active-era-panel"
              >
                {(() => {
                  const curr = eras.find((e) => e.id === activeEra) || eras[0];
                  return (
                    <div className="era-detail-content">
                      <div className="era-detail-header">
                        <CrimsonBrushAccent variant="badge" className="era-badge">
                          {curr.dates}
                        </CrimsonBrushAccent>
                        <h3 className="era-detail-title">{curr.title}</h3>
                      </div>
                      <p className="era-detail-desc">{curr.desc}</p>
                    </div>
                  );
                })()}
              </WashiBrushPanel>
            </div>
          </div>

          {/* Right Column: Dynamic Sumi-e Ink Artwork & Artifact */}
          <div className="legacy-visual-column">
            <LegacyInkPoster />
          </div>
        </div>
      </div>
    </section>
  );
}
