import React, { useState } from 'react';
import { MapPin, Castle, Hourglass, ChevronRight, X, BookOpen, Shield, Compass, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import DateMasamuneLivingScene from './DateMasamuneLivingScene';
import './date-masamune.css';

/**
 * SectionDateMasamune
 * -----------------------------------------------------------------------------
 * DATE MASAMUNE — THE ONE-EYED DRAGON (伊達政宗)
 * Location: Aoba Castle Ruins, Sendai, Miyagi, Japan
 *
 * Immersive historical monument exhibition combining:
 *  - Panoramic Living Canvas: Multi-layer 2.5D living environment with wind physics,
 *    breathing crimson sun, rigid equestrian bronze monument, fluid tail response,
 *    and falling sakura petals drifting across the entire scene.
 *  - Left Editorial Column: Real vintage Japanese manuscript typography, clan crest,
 *    archival badges, and interactive "EXPLORE THE ARCHIVE" cartouche.
 *  - Expandable Archival Drawer / Modal: 4 comprehensive historical exhibits.
 */
export default function SectionDateMasamune() {
  const [drawerOpen, setDrawerOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('exhibit') === 'open';
    }
    return false;
  });
  const [activeExhibit, setActiveExhibit] = useState(0);

  const handleOpenDrawer = () => {
    sound.playWoodenClick();
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    sound.playWoodenClick();
    setDrawerOpen(false);
  };

  const exhibits = [
    {
      id: 'exhibit-01',
      num: 'EXHIBIT 01',
      title: 'The Equestrian Monument at Aoba Castle',
      kanji: '青葉城址の騎馬像',
      icon: Castle,
      summary:
        'Perched high on the cliffside plateau of Aoba Castle (Sendai Castle), the commanding bronze equestrian statue of Date Masamune depicts the feudal lord in full battle regalia, gazing vigilantly across the Sendai plain toward the Pacific Ocean.',
      details: [
        { label: 'Location', value: 'Sendai Castle Honmaru Ruins, Mount Aoba, Sendai' },
        { label: 'Subject', value: 'Date Masamune (伊達政宗 · 1567–1636)' },
        { label: 'Iconography', value: 'Black-lacquered armor, oversized golden crescent (maedate)' },
        { label: 'Significance', value: 'Eternal guardian of the Sendai domain and Tōhoku culture' },
      ],
      description:
        'The monumental bronze statue captures Masamune at the height of his power. Reining his steed upon a formidable granite plinth, he wears his legendary kabuto helmet bearing the asymmetrical golden crescent moon—a symbol renowned across Japan for its audacity and poise. From this strategic height, Masamune planned both military defense and international trade networks that defied the era’s isolationism.',
    },
    {
      id: 'exhibit-02',
      num: 'EXHIBIT 02',
      title: 'The Founder of Sendai',
      kanji: '仙台開府と青葉城',
      icon: Compass,
      summary:
        'Following the Battle of Sekigahara in 1600, Tokugawa Ieyasu granted Masamune the Sendai domain. Masamune chose Mount Aoba to erect his citadel, turning a desolate frontier into one of Japan’s most prosperous metropolitan and cultural centers.',
      details: [
        { label: 'Year Established', value: '1600–1601 (Keichō 5–6)' },
        { label: 'Domain Size', value: '620,000 koku (Third-largest in Edo Japan)' },
        { label: 'Defensive Design', value: 'Steep cliffs, Hirose River moat, mountain fortress' },
        { label: 'Urban Legacy', value: 'Origin of Sendai as the "City of Trees" (Mori no Miyako)' },
      ],
      description:
        'Masamune bypassed the former castle at Iwadeyama and personally selected the Aoba mountain redoubt. Designed with high ishigaki stone walls and without a conventional main keep (tenshukaku) to avoid arousing the suspicion of the Tokugawa shogunate, Aoba Castle was virtually impregnable. Under his governance, Sendai became renowned for agriculture, river engineering, metallurgy, and traditional performing arts.',
    },
    {
      id: 'exhibit-03',
      num: 'EXHIBIT 03',
      title: 'Tactics & Bushido Philosophy',
      kanji: '武道と処世の哲学',
      icon: Shield,
      summary:
        'The One-Eyed Dragon was feared as an uncompromising battlefield tactician, yet celebrated as a refined philosopher, calligrapher, master tea practitioner, and poet.',
      details: [
        { label: 'Moniker', value: 'Dokuganryū (独眼竜 · The One-Eyed Dragon)' },
        { label: 'Known Style', value: 'Nanban-influenced armor, arquebus infantry battalions' },
        { label: 'Core Maxim', value: 'Balance between strict rectitude and boundless mercy' },
        { label: 'Artistic Patronage', value: 'Waka poetry, tea ceremony, Noh theater' },
      ],
      description:
        'Having lost sight in his right eye to smallpox in childhood, Masamune channeled his affliction into an iron determination. His philosophy bridged ruthless military pragmatism with profound cultural refinement. His famous teaching endures: "Rectitude carried to excess hardens into stiffness; benevolence indulged beyond measure sinks into weakness. Rectitude and benevolence must temper one another."',
    },
    {
      id: 'exhibit-04',
      num: 'EXHIBIT 04',
      title: 'The Keichō Embassy to Rome',
      kanji: '慶長遣欧使節',
      icon: Sparkles,
      summary:
        'In 1613, Masamune built the trans-Pacific Western-style galleon San Juan Bautista and dispatched samurai envoy Hasekura Tsunenaga across the ocean to Mexico, Madrid, and the Vatican.',
      details: [
        { label: 'Vessel', value: 'San Juan Bautista (500-ton galleon built in Sendai)' },
        { label: 'Chief Envoy', value: 'Hasekura Tsunenaga (支倉常長)' },
        { label: 'Destination', value: 'Acapulco, Madrid (King Philip III), Rome (Pope Paul V)' },
        { label: 'Historical Impact', value: 'First official Japanese diplomatic mission to Europe' },
      ],
      description:
        'Driven by visionary ambition to establish direct trade and diplomatic ties with Europe, Masamune authorized the construction of Japan’s first oceanic galleon. Departing Tsukinoura in 1613, the expedition crossed the Pacific, negotiated treaties in New Spain, met King Philip III in Madrid, and presented Masamune’s letter to Pope Paul V in Rome—an extraordinary chapter in global diplomacy.',
    },
  ];

  return (
    <section id="masamune" className="bc-date-masamune-section" aria-labelledby="masamune-main-title">
      {/* 1. Panoramic Living Canvas Scene Backdrop */}
      <div className="masamune-living-backdrop" aria-hidden="true">
        <DateMasamuneLivingScene />
      </div>

      {/* 2. Editorial Content Container (Layered Seamlessly on Top) */}
      <div className="masamune-container">
        <div className="masamune-editorial-col">
          {/* Eyebrow */}
          <div className="masamune-eyebrow">
            <span className="masamune-cinnabar-dot" aria-hidden="true" />
            <span>— ETERNAL ARCHIVES · SENDAI —</span>
          </div>

          {/* Authentic Japanese Calligraphy */}
          <div className="masamune-calligraphy" lang="ja">
            独眼竜の遺産
          </div>

          {/* Sumi-e Crimson Flourish Line */}
          <div className="masamune-flourish" aria-hidden="true">
            <svg width="240" height="12" viewBox="0 0 240 12" fill="none">
              <path
                d="M2 6C35 4.5 75 7.5 120 5.5C165 3.5 205 7 238 6"
                stroke="#8C1D24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="120" cy="5.5" r="2.5" fill="#8C1D24" />
            </svg>
          </div>

          {/* Main Headline (All in Display Cinnabar) */}
          <h2 id="masamune-main-title" className="masamune-headline">
            THE ONE-EYED<br />
            DRAGON<span className="masamune-title-period">.</span>
          </h2>

          {/* Subtitle */}
          <p className="masamune-subtitle">
            Date Masamune at Aoba Castle
          </p>

          {/* Date Clan Mon Divider (Take-ni-Suzume Laurel Crest) */}
          <div className="masamune-crest-divider" aria-hidden="true">
            <span className="crest-rule-line" />
            <svg className="masamune-crest-icon" viewBox="0 0 40 40" width="30" height="30">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#79684F" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="15" fill="none" stroke="#79684F" strokeWidth="0.8" strokeDasharray="2 2" />
              {/* Central leaves */}
              <path d="M20 7 Q23 15 20 22 Q17 15 20 7 Z" fill="#79684F" opacity="0.9" />
              <path d="M20 33 Q23 25 20 18 Q17 25 20 33 Z" fill="#79684F" opacity="0.9" />
              <path d="M7 20 Q15 23 22 20 Q15 17 7 20 Z" fill="#79684F" opacity="0.9" />
              <path d="M33 20 Q25 23 18 20 Q25 17 33 20 Z" fill="#79684F" opacity="0.9" />
              <circle cx="20" cy="20" r="2.5" fill="#8C1D24" />
            </svg>
            <span className="crest-rule-line" />
          </div>

          {/* Narrative Body */}
          <p className="masamune-narrative">
            At the Aoba Castle ruins in Sendai, the bronze equestrian statue of Date Masamune
            stands as a symbol of ambition, strategy, and enduring legend. From this high citadel,
            the One-Eyed Dragon still looks over the city he shaped.
          </p>

          {/* Archival Metadata Badges */}
          <div className="masamune-badge-strip">
            <span className="masamune-badge">
              <Castle size={14} className="badge-icon" />
              <span>Aoba Castle Ruins</span>
            </span>
            <span className="masamune-badge">
              <MapPin size={14} className="badge-icon" />
              <span>Sendai, Miyagi</span>
            </span>
            <span className="masamune-badge">
              <Hourglass size={14} className="badge-icon" />
              <span>1567–1636</span>
            </span>
          </div>

          {/* Interactive Cartouche Action Button */}
          <div className="masamune-action-area">
            <button
              type="button"
              className="masamune-explore-btn"
              onClick={handleOpenDrawer}
              aria-expanded={drawerOpen}
              aria-controls="masamune-archival-drawer"
            >
              <span className="btn-seigaiha-bg" aria-hidden="true" />
              <span className="btn-label">EXPLORE THE ARCHIVE</span>
              <ChevronRight size={17} className="btn-arrow" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Archival Exhibition Drawer / Modal */}
      {drawerOpen && (
        <div
          id="masamune-archival-drawer"
          className="masamune-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-heading"
          onClick={handleCloseDrawer}
        >
          <div className="masamune-modal-panel" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-header">
              <div className="modal-header-text">
                <span className="modal-kicker">SENDAI HISTORICAL DOSSIER · ARCHIVE NO. 08</span>
                <h3 id="drawer-heading" className="modal-title">
                  DATE MASAMUNE · THE ONE-EYED DRAGON
                </h3>
                <span className="modal-subtitle-kanji" lang="ja">伊達政宗公 史料館</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseDrawer}
                aria-label="Close archival exhibit"
              >
                <X size={20} />
              </button>
            </div>

            {/* Exhibit Navigation Tabs */}
            <div className="modal-tabs" role="tablist">
              {exhibits.map((ex, idx) => {
                const IconComponent = ex.icon;
                return (
                  <button
                    key={ex.id}
                    type="button"
                    role="tab"
                    aria-selected={activeExhibit === idx}
                    className={`modal-tab-btn ${activeExhibit === idx ? 'is-active' : ''}`}
                    onClick={() => {
                      sound.playWoodenClick();
                      setActiveExhibit(idx);
                    }}
                  >
                    <IconComponent size={15} />
                    <span>{ex.num}</span>
                    <span className="tab-btn-title">{ex.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Exhibit Content Body */}
            <div className="modal-body">
              <div className="exhibit-header">
                <div className="exhibit-kicker-row">
                  <span className="exhibit-num-tag">{exhibits[activeExhibit].num}</span>
                  <span className="exhibit-kanji-tag" lang="ja">{exhibits[activeExhibit].kanji}</span>
                </div>
                <h4 className="exhibit-title">{exhibits[activeExhibit].title}</h4>
                <p className="exhibit-summary">{exhibits[activeExhibit].summary}</p>
              </div>

              {/* Metadata Key-Value Grid */}
              <div className="exhibit-details-grid">
                {exhibits[activeExhibit].details.map((item, i) => (
                  <div key={i} className="exhibit-detail-card">
                    <span className="detail-label">{item.label}</span>
                    <span className="detail-value">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* In-depth Narrative */}
              <div className="exhibit-text-content">
                <p>{exhibits[activeExhibit].description}</p>
              </div>

              {/* Historical Quote from Masamune */}
              <div className="exhibit-quote-card">
                <div className="quote-mark">“</div>
                <blockquote className="quote-text">
                  Rectitude carried to excess hardens into stiffness; benevolence indulged beyond measure
                  sinks into weakness. Rectitude and benevolence must temper one another.
                </blockquote>
                <div className="quote-author">— Date Masamune, Lord of Sendai (1567–1636)</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <div className="modal-footer-note">
                Source: Sendai City Museum Archives · Aoba Castle Historical Preservation Society
              </div>
              <button type="button" className="modal-close-footer-btn" onClick={handleCloseDrawer}>
                RETURN TO GALLERY
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
