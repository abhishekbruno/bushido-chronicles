import { assetUrl } from '../utils/assetUrl';
import React, { useState } from 'react';
import { BookOpen, Shield, Compass, MapPin, Award, ExternalLink, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import WashiPaperPanel from './WashiPaperPanel';
import { InkQuotePanel, CrimsonBrushAccent, WashiBrushPanel } from './brushstroke';

/**
 * KokoroMonumentArchive (日本心アーカイブ · 記念碑 01/08)
 * -----------------------------------------------------------------------------
 * Imperial Monument Archive Entry:
 *  楠木正成 · KUSUNOKI MASASHIGE
 *  THE GENERAL OF UNWAVERING LOYALTY · 忠義の武将
 *  Location: Tokyo · Imperial Palace Outer Gardens (皇居外苑)
 *
 * Implemented using the three handcrafted Japanese paper panel variants:
 *  - Variant A (Soft Parchment) for hero descriptions and editorial quotes
 *  - Variant B (Ancient Manuscript) for historical chronicles and archival tables
 *  - Variant C (Ink-Framed Exhibit) for monument architecture and interactive labels
 */
export default function KokoroMonumentArchive({ className = '', onReturn }) {
  const [activeTab, setActiveTab] = useState('monument'); // 'monument' | 'chronicle' | 'records'
  const [isExpanded, setIsExpanded] = useState(false);

  const archivalRecords = [
    { field: 'Monument', value: 'Kusunoki Masashige Equestrian Statue' },
    { field: 'Japanese', value: '楠木正成像 (くすのき まさしげ ぞう)' },
    { field: 'Location', value: 'Kokyo Gaien National Garden, Tokyo · 皇居外苑' },
    { field: 'Historical figure', value: 'Kusunoki Masashige (楠木正成)' },
    { field: 'Lifetime', value: '1294 – 1336' },
    { field: 'Era', value: 'Late Kamakura / Early Nanbokuchō · 鎌倉・南北朝時代' },
    { field: 'Monument installation', value: '1900 (Meiji 33)' },
    { field: 'Primary material', value: 'Sculpted Bronze (青銅)' },
    { field: 'Base material', value: 'Polished Granite Pedestal (花崗岩)' },
    { field: 'Approximate total height', value: '8 metres (Pedestal + Equestrian)' },
    { field: 'Symbolism', value: 'Unwavering loyalty, imperial service, strategic brilliance' },
  ];

  const handleTab = (tab) => {
    sound.playWoodenClick();
    setActiveTab(tab);
  };

  return (
    <div className={`kokoro-monument-root ${className}`}>
      {/* 1. Header Banner: Monument Index & Location */}
      <div className="kokoro-monument-header">
        <div className="monument-index-pill">
          <span className="index-accent-dot" />
          <span className="index-title">NIPPON KOKORO ARCHIVES</span>
          <span className="index-divider">·</span>
          <span className="index-num">MONUMENT 01 / 08</span>
        </div>
        <div className="monument-location-tag">
          <MapPin size={13} className="text-crimson" />
          <span>TOKYO · IMPERIAL PALACE OUTER GARDENS</span>
          <span className="location-kanji">皇居外苑</span>
        </div>
      </div>

      {/* 2. Hero Identity Title Card (Variant C - Ink-Framed Exhibit) */}
      <WashiPaperPanel
        variant="ink-frame"
        cornerMarks
        crimsonAccent
        interactive
        className="monument-title-panel"
      >
        <div className="monument-title-grid">
          <div className="monument-title-left">
            <div className="monument-eyebrow">
              <span className="monument-crest-kanji">忠義</span>
              <span className="monument-badge-text">CHRONICLES OF UNWAVERING DEVOTION</span>
            </div>
            <h2 className="monument-kanji-headline">楠木正成</h2>
            <h3 className="monument-en-headline">KUSUNOKI MASASHIGE.</h3>
            <div className="monument-honorific-title">
              THE GENERAL OF UNWAVERING LOYALTY
            </div>
            <div className="monument-sub-honorific">
              <em>忠義の武将 — The Loyal Warrior</em>
            </div>
          </div>

          <div className="monument-title-right">
            {/* Soft Parchment Hero Description Panel (Variant A) */}
            <WashiPaperPanel variant="soft" className="monument-hero-desc-box">
              <h4 className="desc-box-label">HERO DESCRIPTION · 概要</h4>
              <p className="desc-box-text">
                Within the serene outer gardens of Tokyo’s Imperial Palace stands a commanding bronze
                equestrian statue of Kusunoki Masashige. A celebrated 14th-century military commander,
                Masashige became an enduring symbol of loyalty, courage, and strategic brilliance during
                one of Japan’s most turbulent periods.
              </p>
            </WashiPaperPanel>
          </div>
        </div>
      </WashiPaperPanel>

      {/* 3. Interactive Archival Tabs (Variant B - Ancient Manuscript Tab Strip) */}
      <div className="monument-tabs-container">
        <div className="monument-tab-bar" role="tablist">
          <button
            className={`monument-tab-btn ${activeTab === 'monument' ? 'active' : ''} interactive`}
            onClick={() => handleTab('monument')}
            role="tab"
            aria-selected={activeTab === 'monument'}
          >
            <Shield size={14} />
            <span>EXPLORE THE MONUMENT</span>
            <span className="tab-kanji">記念碑</span>
          </button>

          <button
            className={`monument-tab-btn ${activeTab === 'chronicle' ? 'active' : ''} interactive`}
            onClick={() => handleTab('chronicle')}
            role="tab"
            aria-selected={activeTab === 'chronicle'}
          >
            <BookOpen size={14} />
            <span>HISTORICAL CHRONICLE</span>
            <span className="tab-kanji">歴史記録</span>
          </button>

          <button
            className={`monument-tab-btn ${activeTab === 'records' ? 'active' : ''} interactive`}
            onClick={() => handleTab('records')}
            role="tab"
            aria-selected={activeTab === 'records'}
          >
            <Award size={14} />
            <span>VIEW HISTORICAL RECORD</span>
            <span className="tab-kanji">目録</span>
          </button>
        </div>
      </div>

      {/* 4. Tab Content Panels */}
      <div className="monument-tab-viewport">
        {/* TAB 1: THE MONUMENT (BRONZE, STONE & MEMORY) */}
        {activeTab === 'monument' && (
          <div className="tab-fade-enter">
            <div className="monument-exhibit-split">
              {/* Left: Artistic Bronze Sculpture Rendering in Ink Frame */}
              <WashiPaperPanel variant="ink-frame" dark cornerMarks className="monument-sculpture-card">
                <div className="sculpture-card-header">
                  <span className="sculpture-tag">BRONZE EQUESTRIAN MONUMENT · 1900</span>
                  <span className="sculpture-badge">8 METRES TOTAL HEIGHT</span>
                </div>

                <div className="sculpture-visual-stage cinematic-monument-stage">
                  {/* Atmospheric Sun Halo and Authentic Bronze Statue */}
                  <div className="archive-sun-backdrop" aria-hidden="true" />
                  <img
                    src={assetUrl('/images/kusunoki-monument-statue.png?v=3')}
                    alt="Authentic bronze equestrian monument of Kusunoki Masashige atop granite pedestal"
                    className="archive-statue-hero-image"
                    loading="eager"
                  />
                  <div className="archive-pedestal-ground-shadow" aria-hidden="true" />
                </div>
              </WashiPaperPanel>

              {/* Right: Monument Description & Poetic Insight */}
              <div className="monument-exhibit-narrative">
                <WashiPaperPanel variant="manuscript" cornerMarks hasFold className="narrative-paper-card">
                  <div className="narrative-kicker">THE MONUMENT · 皇居外苑</div>
                  <h4 className="narrative-title">BRONZE, STONE & MEMORY</h4>
                  <p className="narrative-body">
                    The statue depicts Masashige mounted on horseback, restraining his horse as he prepares
                    to greet Emperor Go-Daigo. Its detailed armor, powerful horse, and carefully sculpted
                    bronze surfaces communicate both military strength and disciplined respect.
                  </p>
                  <p className="narrative-body">
                    Completed and presented in 1900 by master sculptors Kōun Takamura and Sadayuki Gotō, the
                    monument stands approximately eight metres high including its polished granite pedestal,
                    silently guarding Tokyo's imperial perimeter.
                  </p>

                  {/* Poetic Editorial Quote (TYPE A: Black Ink Brushstroke Panel) */}
                  <InkQuotePanel
                    quote="The warrior no longer rides into battle, yet his memory continues its journey through centuries."
                    source="ORIGINAL POETIC CHRONICLE · NIPPON KOKORO ARCHIVES"
                    sealText="忠"
                    className="editorial-quote-brush"
                  />
                </WashiPaperPanel>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HISTORICAL CHRONICLE */}
        {activeTab === 'chronicle' && (
          <div className="tab-fade-enter">
            <WashiPaperPanel variant="manuscript" cornerMarks hasFold className="chronicle-master-card">
              <div className="chronicle-header-row">
                <div className="chronicle-title-group">
                  <span className="chronicle-kicker">A WARRIOR REMEMBERED THROUGH CENTURIES</span>
                  <h4 className="chronicle-heading">楠木正成 — Kusunoki Masashige (1294–1336)</h4>
                </div>
                <div className="chronicle-hanko" title="Loyalty Seal">
                  <span>忠</span>
                </div>
              </div>

              <div className="chronicle-body-columns">
                <div className="chronicle-para-block">
                  <h5 className="chronicle-subhead">GENIUS OF ASYMMETRICAL WARFARE</h5>
                  <p>
                    Born in 1294 in Kawachi Province, Kusunoki Masashige served Emperor Go-Daigo during
                    the turbulent final years of the Kamakura shogunate. Where orthodox samurai clashed in
                    predictable cavalry formations, Masashige weaponized mountainous topography, deception,
                    and guerilla fortifications at Akasaka and Chihaya Castles.
                  </p>
                </div>

                <div className="chronicle-para-block">
                  <h5 className="chronicle-subhead">THE SIEGE OF CHIHAYA (1333)</h5>
                  <p>
                    Holding Mount Kongō with barely a thousand men against an imperial shogunate army
                    exceeding 100,000, Masashige deployed rolling boulders, straw-dummy decoys, and poured
                    boiling water down siege ramps, paralyzing the shogunate and igniting the Kemmu Restoration.
                  </p>
                </div>

                <div className="chronicle-para-block">
                  <h5 className="chronicle-subhead">THE SUPREME SACRIFICE AT MINATOGAWA (1336)</h5>
                  <p>
                    In 1336, ordered into a hopeless frontal battle against Ashikaga Takauji’s overwhelming
                    fleet at Minatogawa, Masashige calmly obeyed knowing it meant certain doom. After seven
                    hours of furious combat, he committed seppuku alongside his brother Masasue with the
                    legendary oath: <em>"Shichishō Hōkoku"</em> (七生報国 — "Would that I had seven lives to give for my country").
                  </p>
                </div>
              </div>
            </WashiPaperPanel>
          </div>
        )}

        {/* TAB 3: ARCHIVAL INFORMATION TABLE */}
        {activeTab === 'records' && (
          <div className="tab-fade-enter">
            <WashiPaperPanel variant="manuscript" cornerMarks className="records-master-card">
              <div className="records-header-row">
                <h4 className="records-title">ARCHIVAL INFORMATION RECORD · 記録目録</h4>
                <span className="records-badge">OFFICIAL FEUDAL DOSSIER · VOL. 01</span>
              </div>

              <div className="records-table-container">
                <table className="archival-washi-table">
                  <thead>
                    <tr>
                      <th className="th-field">FIELD · 項目</th>
                      <th className="th-record">HISTORICAL RECORD · 記録内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivalRecords.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                        <td className="td-field">
                          <span className="field-name">{row.field}</span>
                        </td>
                        <td className="td-record">
                          <span className="record-val">{row.value}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </WashiPaperPanel>
          </div>
        )}
      </div>

      {/* 5. Closing Message Banner (Variant C - Ink-Framed Exhibit Footer) */}
      <WashiPaperPanel variant="ink-frame" cornerMarks crimsonAccent className="monument-closing-card">
        <div className="closing-content-flex">
          <div className="closing-left">
            <div className="closing-kicker">CLOSING MESSAGE · 永遠の誓い</div>
            <h4 className="closing-headline">LOYALTY OUTLIVES THE WARRIOR.</h4>
            <div className="closing-kanji-motto">
              <span>忠義は時を超える</span>
              <span className="motto-divider">·</span>
              <em>Loyalty transcends time.</em>
            </div>
            <p className="closing-desc">
              The bronze may weather and the centuries may pass, but the memory of Masashige
              endures as part of Japan’s rich historical legacy.
            </p>
          </div>

          <div className="closing-right">
            <button
              className="btn-monument-return interactive"
              onClick={() => {
                sound.playWoodenClick();
                if (onReturn) onReturn();
                else {
                  const el = document.getElementById('legacy');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span>RETURN TO THE ARCHIVES</span>
              <span className="btn-kanji">遺産録</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </WashiPaperPanel>
    </div>
  );
}

