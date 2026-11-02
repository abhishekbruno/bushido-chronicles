import React, { useState, useEffect } from 'react';
import { Scroll, Compass, Sparkles, Feather, Award } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import LegacyInkPoster from './LegacyInkPoster';
import AnimatedChapterHeading from './AnimatedChapterHeading';
import WashiPaperPanel from './WashiPaperPanel';
import KokoroMonumentArchive from './KokoroMonumentArchive';

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

            {/* VARIANT A: Soft Parchment Quote Panel */}
            <WashiPaperPanel variant="soft" crimsonAccent interactive className="legacy-quote-card">
              <span className="quote-mark">“</span>
              <p className="quote-body">
                There is nothing outside of yourself that can ever enable you to become better,
                stronger, richer, quicker, or smarter. Everything is within. Everything exists.
                Seek nothing outside of yourself.
              </p>
              <footer className="quote-footer">
                <span className="quote-author">MIYAMOTO MUSASHI</span>
                <span className="quote-book">THE BOOK OF FIVE RINGS (五輪書), 1645</span>
              </footer>
            </WashiPaperPanel>

            {/* Archival Mode Selector: Chronicles of Ascent vs Nippon Kokoro Archives */}
            <div className="archive-mode-toggle-bar">
              <button
                className={`mode-toggle-btn ${activeArchiveView === 'eras' ? 'active' : ''} interactive`}
                onClick={() => handleViewChange('eras')}
              >
                <Scroll size={14} />
                <span>CHRONICLES OF ASCENT</span>
                <span className="mode-btn-kanji">時代録</span>
              </button>

              <button
                className={`mode-toggle-btn ${activeArchiveView === 'monument' ? 'active' : ''} interactive`}
                onClick={() => handleViewChange('monument')}
              >
                <Award size={14} />
                <span>NIPPON KOKORO ARCHIVES (01/08)</span>
                <span className="mode-btn-kanji">記念碑</span>
              </button>
            </div>

            {/* VIEW 1: Historical Eras Interactive Selector */}
            {activeArchiveView === 'eras' ? (
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

                {/* Active Era Details Panel (VARIANT B: Ancient Manuscript) */}
                <WashiPaperPanel
                  variant="manuscript"
                  cornerMarks
                  hasFold
                  interactive
                  className="active-era-panel"
                >
                  {(() => {
                    const curr = eras.find((e) => e.id === activeEra) || eras[0];
                    return (
                      <div className="era-detail-content">
                        <div className="era-detail-header">
                          <span className="era-badge">{curr.dates}</span>
                          <h3 className="era-detail-title">{curr.title}</h3>
                        </div>
                        <p className="era-detail-desc">{curr.desc}</p>
                      </div>
                    );
                  })()}
                </WashiPaperPanel>
              </div>
            ) : (
              /* VIEW 2: Featured Mini Summary leading to Monument Archive */
              <div className="monument-quick-summary">
                <WashiPaperPanel variant="ink-frame" cornerMarks crimsonAccent className="monument-preview-banner">
                  <div className="preview-top">
                    <span className="preview-tag">MONUMENT 01 / 08 · TOKYO</span>
                    <span className="preview-kanji">楠木正成</span>
                  </div>
                  <h4 className="preview-name">KUSUNOKI MASASHIGE</h4>
                  <p className="preview-desc">
                    The General of Unwavering Loyalty (忠義の武将). Inspect the bronze equestrian monument,
                    historical chronicle, and 10-point archival record below.
                  </p>
                </WashiPaperPanel>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Sumi-e Ink Artwork & Artifact */}
          <div className="legacy-visual-column">
            <LegacyInkPoster />
          </div>
        </div>

        {/* NIPPON KOKORO ARCHIVES: Featured Imperial Monument Showcase */}
        {activeArchiveView === 'monument' && (
          <div className="monument-archive-full-mount">
            <KokoroMonumentArchive onReturn={() => handleViewChange('eras')} />
          </div>
        )}
      </div>
    </section>
  );
}
