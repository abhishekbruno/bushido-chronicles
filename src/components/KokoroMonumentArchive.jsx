import React, { useState } from 'react';
import { BookOpen, Shield, Compass, MapPin, Award, ExternalLink, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import WashiPaperPanel from './WashiPaperPanel';

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

                <div className="sculpture-visual-stage">
                  <svg viewBox="0 0 420 320" className="equestrian-svg" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8C8268" />
                        <stop offset="40%" stopColor="#5A5240" />
                        <stop offset="80%" stopColor="#2E2A20" />
                        <stop offset="100%" stopColor="#14130E" />
                      </linearGradient>
                      <linearGradient id="graniteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4A4E54" />
                        <stop offset="50%" stopColor="#2C2E33" />
                        <stop offset="100%" stopColor="#181A1E" />
                      </linearGradient>
                    </defs>

                    {/* Faint Radial Sun Behind Monument */}
                    <circle cx="210" cy="140" r="95" fill="rgba(199, 44, 53, 0.15)" />

                    {/* Granite Pedestal Base (8 Metres Total) */}
                    <path d="M 60 280 L 360 280 L 340 310 L 80 310 Z" fill="url(#graniteGrad)" stroke="#686C74" strokeWidth="1" />
                    <rect x="95" y="240" width="230" height="40" fill="url(#graniteGrad)" stroke="#52565E" strokeWidth="1" />
                    <text x="210" y="265" textAnchor="middle" fill="#A8B0BC" fontSize="11" letterSpacing="3" fontFamily="serif">
                      皇居外苑 · 楠木正成像
                    </text>

                    {/* Bronze Steed & Commander Silhouette */}
                    <g fill="url(#bronzeGrad)" stroke="#1A1812" strokeWidth="1.2">
                      {/* Powerful Horse Rearing/Restraining */}
                      <path d="M 140 240 C 145 200, 150 170, 170 150 C 185 135, 210 130, 240 145 C 270 160, 285 180, 280 240 L 255 240 C 255 200, 240 185, 220 185 C 200 185, 185 205, 175 240 Z" />
                      {/* Horse Head & Arching Neck */}
                      <path d="M 155 165 C 145 140, 130 115, 115 105 C 105 100, 95 105, 100 120 C 105 135, 125 155, 140 168 Z" />
                      {/* Horse Ears & Mane */}
                      <path d="M 115 105 L 120 90 L 128 102 Z" />
                      {/* Mounted Commander (Masashige in O-Yoroi) */}
                      <path d="M 195 150 C 190 120, 195 95, 205 85 C 215 75, 225 80, 230 95 C 235 110, 230 135, 225 150 Z" />
                      {/* Horned Kabuto (Star Helmet) */}
                      <path d="M 205 85 C 200 70, 225 65, 230 85 Z" />
                      {/* Kuwagata Antler Crest */}
                      <path d="M 215 75 Q 195 45, 180 50 Q 200 65, 215 72" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
                      <path d="M 220 75 Q 240 45, 255 50 Q 235 65, 220 72" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
                      {/* Flowing Reins & Tassels */}
                      <path d="M 105 115 Q 155 145, 205 125" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
                    </g>
                  </svg>
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

                  {/* Poetic Editorial Quote (Variant A Washi Inset) */}
                  <WashiPaperPanel variant="soft" className="editorial-quote-inset">
                    <span className="quote-badge-text">THE SILENCE OF BRONZE · 銅像の沈黙</span>
                    <blockquote className="quote-text-body">
                      “The warrior no longer rides into battle, yet his memory continues its journey through centuries.”
                    </blockquote>
                    <span className="quote-attribution">ORIGINAL POETIC CHRONICLE · NIPPON KOKORO ARCHIVES</span>
                  </WashiPaperPanel>
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

