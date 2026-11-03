import React, { useState } from 'react';
import { ExternalLink, BookOpen, Shield, Award, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import MonumentGardenScene from './MonumentGardenScene';

/**
 * SectionMonument (THE GUARDIANS OF HISTORY — 楠木正成 KUSUNOKI MASASHIGE)
 * -----------------------------------------------------------------------------
 * Cinematic museum-grade exhibition composition replacing the old cramped layout.
 *
 * Features:
 *  - Panoramic wide visual scene with the bronze equestrian monument prominently featured
 *  - Left/Top protected editorial presentation with real HTML typography:
 *      * Kicker: 07 / THE GUARDIANS OF HISTORY · 史跡
 *      * Japanese title: 楠木正成
 *      * Headline: THE GENERAL OF UNWAVERING LOYALTY.
 *      * Historical narrative & metadata tags
 *  - Interactive Archival Navigation Tabs:
 *      * 01: EXPLORE THE MONUMENT · 記念碑
 *      * 02: HISTORICAL CHRONICLE · 歴史記録
 *      * 03: ARCHIVAL RECORD · 目録
 *  - Expandable authentic washi document panel with complete historical data
 *  - Official government archive link to Kokyo Gaien National Garden
 */
export default function SectionMonument() {
  const [activeTab, setActiveTab] = useState(null); // 'monument' | 'chronicle' | 'records' | null

  const handleTabToggle = (tabKey) => {
    sound.playWoodenClick();
    setActiveTab((prev) => (prev === tabKey ? null : tabKey));
  };

  const archivalData = [
    { label: 'Monument Name', value: 'Kusunoki Masashige Equestrian Statue (楠木正成像)' },
    { label: 'Historical Figure', value: 'Kusunoki Masashige · 楠木正成 (1294 – 1336)' },
    { label: 'Sculptors', value: 'Kōun Takamura (Figure) & Sadayuki Gotō (Horse)' },
    { label: 'Installation Date', value: '1900 (Meiji 33) · Commissioned by Sumitomo' },
    { label: 'Location', value: 'Kokyo Gaien National Garden, Tokyo · 皇居外苑' },
    { label: 'Total Height', value: 'Approx. 8.0 metres (Pedestal + Bronze Equestrian)' },
    { label: 'Materials', value: 'Aged Cast Bronze (青銅) atop Polished Granite Pedestal (花崗岩)' },
    { label: 'Key Virtue', value: 'Chūgi (忠義 · Unwavering Loyalty) & Fudoshin (不動心)' },
  ];

  return (
    <section id="monument" className="bc-monument-exhibition-section" aria-labelledby="monument-main-heading">
      <div className="monument-exhibition-container">

        {/* 1. Protected Editorial Header Row (Overarching Museum Presentation) */}
        <div className="monument-editorial-banner">
          <div className="monument-editorial-copy">
            <div className="monument-archival-kicker">
              <span className="kicker-cinnabar-dot" />
              <span>07 / THE GUARDIANS OF HISTORY</span>
              <span className="kicker-kanji">史跡 · 記念碑</span>
            </div>

            <div className="monument-jp-calligraphy" lang="ja">
              楠木正成
            </div>

            <h2 id="monument-main-heading" className="monument-main-headline">
              THE GENERAL OF<br />
              <em>UNWAVERING</em> LOYALTY<span className="headline-crimson-dot">.</span>
            </h2>

            <div className="monument-editorial-rule" aria-hidden="true" />

            <p className="monument-editorial-paragraph">
              Within the serene outer gardens of Tokyo’s Imperial Palace stands the commanding
              bronze equestrian monument of Kusunoki Masashige — celebrated 14th-century military commander,
              tactical genius, and enduring moral symbol of devotion to the samurai code.
            </p>

            {/* Archival Metadata Badges */}
            <div className="monument-metadata-strip">
              <span className="monument-badge">TOKYO · KOKYO GAIEN</span>
              <span className="monument-badge">INSTALLED · 1900</span>
              <span className="monument-badge">8 METRES TOTAL HEIGHT</span>
              <span className="monument-badge">ARCHIVE NO. 07</span>
            </div>
          </div>

          {/* Interactive Archival Action Group */}
          <div className="monument-interactive-actions">
            <div className="actions-header-label">ARCHIVAL EXHIBIT TABS</div>
            <div className="monument-tab-buttons-row" role="tablist" aria-label="Monument Archival Exhibits">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'monument'}
                className={`monument-action-tab-btn ${activeTab === 'monument' ? 'is-active' : ''}`}
                onClick={() => handleTabToggle('monument')}
              >
                <Shield size={15} />
                <span>EXPLORE MONUMENT</span>
                <span className="tab-btn-kanji">記念碑</span>
                {activeTab === 'monument' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'chronicle'}
                className={`monument-action-tab-btn ${activeTab === 'chronicle' ? 'is-active' : ''}`}
                onClick={() => handleTabToggle('chronicle')}
              >
                <BookOpen size={15} />
                <span>HISTORICAL CHRONICLE</span>
                <span className="tab-btn-kanji">歴史記録</span>
                {activeTab === 'chronicle' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'records'}
                className={`monument-action-tab-btn ${activeTab === 'records' ? 'is-active' : ''}`}
                onClick={() => handleTabToggle('records')}
              >
                <Award size={15} />
                <span>ARCHIVAL RECORD</span>
                <span className="tab-btn-kanji">目録</span>
                {activeTab === 'records' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            <a
              className="monument-official-source-link"
              href="https://www.env.go.jp/garden/kokyogaien/english/statue_of_kusunoki_masashige.html"
              target="_blank"
              rel="noopener noreferrer"
              title="Visit official Ministry of the Environment Tokyo Garden Archive"
            >
              <span>OFFICIAL GARDEN MONUMENT RECORD</span>
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* 2. Panoramic Master Visual Scene (The Living Garden & Bronze Monument) */}
        <div className="monument-panoramic-stage-wrapper">
          <MonumentGardenScene
            onMonumentClick={() => {
              sound.playBladeGlint();
              handleTabToggle('monument');
            }}
          />
        </div>

        {/* 3. Interactive Slide-Down Archival Document Drawer (When Tab Active) */}
        {activeTab && (
          <div className="monument-archival-drawer-panel" role="region" aria-label="Selected Archival Exhibit">
            {activeTab === 'monument' && (
              <div className="drawer-content-box">
                <div className="drawer-top-banner">
                  <span className="drawer-index-tag">EXHIBIT 01 · 記念碑の構造</span>
                  <h3 className="drawer-title">BRONZE, STONE & SACRED MEMORY</h3>
                </div>
                <div className="drawer-grid-cols">
                  <div className="drawer-col">
                    <h4 className="drawer-subhead">THE EQUESTRIAN SCULPTURE</h4>
                    <p>
                      The monument depicts Masashige mounted on his feudal warhorse, restraining the
                      steed as he prepares to greet Emperor Go-Daigo. Crafted by Tokyo Fine Arts School
                      professors Kōun Takamura and Sadayuki Gotō, the bronze surfaces communicate both
                      commanding military strength and restrained respect.
                    </p>
                    <p>
                      The horse’s flared nostrils, arched neck, and tasseled barding (munagai) capture
                      a living moment frozen in noble metallic bronze.
                    </p>
                  </div>
                  <div className="drawer-col">
                    <h4 className="drawer-subhead">THE POLISHED GRANITE PEDESTAL</h4>
                    <p>
                      The sculpture rests upon a massive stepped plinth of polished Kurokami granite,
                      bringing the monument’s total height to approximately 8 metres.
                    </p>
                    <p>
                      Centered upon the stone is an engraved bronze dedication plaque reading
                      <em>“楠木正成 · KUSUNOKI MASASHIGE · 1294 – 1336”</em>, flanked by golden Imperial
                      Chrysanthemum crests.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chronicle' && (
              <div className="drawer-content-box">
                <div className="drawer-top-banner">
                  <span className="drawer-index-tag">EXHIBIT 02 · 楠木正成の武勇伝</span>
                  <h3 className="drawer-title">THE DEFENDER OF THE THRONE (1294 – 1336)</h3>
                </div>
                <div className="drawer-grid-cols">
                  <div className="drawer-col">
                    <h4 className="drawer-subhead">DEFENSE OF CHIHAYA CASTLE (1333)</h4>
                    <p>
                      Born in Kawachi Province, Masashige became famous for his asymmetric tactical genius.
                      At the siege of Mount Chihaya, holding an unfortified mountain redoubt with fewer than
                      1,000 men against 100,000 Kamakura shogunate troops, he used rolling logs, straw dummy
                      decoys, and boiling water to shatter the siege and restore the imperial court.
                    </p>
                  </div>
                  <div className="drawer-col">
                    <h4 className="drawer-subhead">THE BATTLE OF MINATOGAWA (1336)</h4>
                    <p>
                      When ordered by the court to face Ashikaga Takauji’s overwhelming fleet in suicidal
                      open battle at Minatogawa, Masashige calmly obeyed knowing it meant certain death.
                      Before departing, he bid farewell to his 11-year-old son Masatsura at Sakurai station,
                      instructing him to preserve the family’s moral integrity over worldly survival.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'records' && (
              <div className="drawer-content-box">
                <div className="drawer-top-banner">
                  <span className="drawer-index-tag">EXHIBIT 03 · 史跡公式目録</span>
                  <h3 className="drawer-title">HISTORICAL ARCHIVAL SPECIFICATIONS</h3>
                </div>
                <div className="drawer-table-wrapper">
                  <table className="monument-spec-table">
                    <tbody>
                      {archivalData.map((row, i) => (
                        <tr key={i}>
                          <th scope="row">{row.label}</th>
                          <td>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
