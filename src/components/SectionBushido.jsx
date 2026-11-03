import React, { useState, useRef } from 'react';
import { sound } from '../utils/soundEngine';
import AnimatedChapterHeading from './AnimatedChapterHeading';
import { InkQuotePanel, CrimsonBrushAccent } from './brushstroke';

export default function SectionBushido() {
  const [activeVirtue, setActiveVirtue] = useState(0);
  const [hoveredVirtue, setHoveredVirtue] = useState(null);
  const containerRef = useRef(null);

  // When hovering, preview that virtue; otherwise show the committed active virtue
  const currentOpenVirtue = hoveredVirtue !== null ? hoveredVirtue : activeVirtue;

  const virtues = [
    {
      id: 'gi',
      number: '01',
      name: 'GI',
      english: 'INTEGRITY & RECTITUDE',
      kanji: '義',
      reading: 'Gi',
      essence: 'The power of deciding upon a course of conduct in accordance with reason, without wavering.',
      deepDive:
        'Rectitude is the bone that gives stature and strength. Without bones, the head cannot rest atop the spine, nor hands move, nor feet stand. In the code of the samurai, rectitude is the unambiguous compass between right and wrong.',
      quote: 'To die when to die is right, to strike when to strike is right.',
      accent: '#D90416',
    },
    {
      id: 'yu',
      number: '02',
      name: 'YU',
      english: 'COURAGE & VALOUR',
      kanji: '勇',
      reading: 'Yū',
      essence: 'Doing what is right in the face of fear. Valour without righteousness is mere savagery.',
      deepDive:
        'Courage was scarcely deemed worthy to be counted among virtues unless it was exercised in the cause of Righteousness. In the samurai mind, courage is tranquil, collected, and never agitated by reckless bravado.',
      quote: 'Perceiving what is right and doing it not argues a lack of courage.',
      accent: '#0A0A0A',
    },
    {
      id: 'jin',
      number: '03',
      name: 'JIN',
      english: 'COMPASSION & BENEVOLENCE',
      kanji: '仁',
      reading: 'Jin',
      essence: 'The warrior who possesses the absolute power to take life must possess equal tenderness to preserve it.',
      deepDive:
        'Bushi no nasake—the tenderness of a warrior—was an acknowledged testament to spiritual maturity. Love, magnanimity, affection for others, and mercy were regarded as the crowning grace of the sword-bearer.',
      quote: 'The strongest hand is the one that knows when to open, not merely when to strike.',
      accent: '#D90416',
    },
    {
      id: 'rei',
      number: '04',
      name: 'REI',
      english: 'RESPECT & POLITENESS',
      kanji: '礼',
      reading: 'Rei',
      essence: 'Politeness should be the expression of a benevolent regard for the feelings of others.',
      deepDive:
        'In its highest form, politeness borders on love. Through tea ceremony (Chadō) and disciplined etiquette, respect became a spiritual exercise that removed pride and fostered absolute awareness of the present moment.',
      quote: 'Ceremony without heart is a mockery; true respect begins in silence.',
      accent: '#0A0A0A',
    },
    {
      id: 'makoto',
      number: '05',
      name: 'MAKOTO',
      english: 'HONESTY & SINCERITY',
      kanji: '誠',
      reading: 'Makoto',
      essence: 'The word of a samurai was sacred. To lie was considered an act of cowardice worse than defeat.',
      deepDive:
        'Bushi no ichi-gon—the word of a samurai—required no written contracts or seals. A pledge given by a warrior was sealed by their life. The kanji 誠 combines "word" (言) and "become" (成): what is spoken must come into being.',
      quote: 'A warrior does not utter two words. What is spoken is forged into stone.',
      accent: '#D90416',
    },
    {
      id: 'meiyo',
      number: '06',
      name: 'MEIYO',
      english: 'HONOR & DIGNITY',
      kanji: '名誉',
      reading: 'Meiyo',
      essence: 'A samurai’s good name is immortal. Dishonor was likened to a scar on tree bark that grows forever.',
      deepDive:
        'A keen sense of honor, nourished from childhood, demanded that shame be avoided at all costs. Life itself was cheap when compared to the purity of a warrior’s reputation and the dignity of their ancestors.',
      quote: 'Dishonor is like a scar on a tree, which time, instead of effacing, only enlarges.',
      accent: '#0A0A0A',
    },
    {
      id: 'chugi',
      number: '07',
      name: 'CHUGI',
      english: 'LOYALTY & DEVOTION',
      kanji: '忠義',
      reading: 'Chūgi',
      essence: 'Unwavering commitment to one’s principles, lord, and brothers-in-arms through life and death.',
      deepDive:
        'Loyalty was not blind subservience; a true samurai was obligated to correct an unjust master even if it cost their own life. It was fidelity to shared purpose, forged through blood, brotherhood, and eternal oaths.',
      quote: 'Where the master goes, the shadow must follow—even into the fire.',
      accent: '#D90416',
    },
  ];

  const handlePanelClick = (index) => {
    sound.playWoodenClick();
    setActiveVirtue(index);
    setHoveredVirtue(null);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePanelClick(index);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (index + 1) % virtues.length;
      handlePanelClick(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (index - 1 + virtues.length) % virtues.length;
      handlePanelClick(prev);
    }
  };

  return (
    <section className="section-bushido" id="bushido" aria-label="The Code of Bushido">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-meta-row">
          <span className="section-index">02 / 06</span>
          <span className="section-meta-tag">THE SEVEN VIRTUES OF THE WARRIOR</span>
          <span className="section-meta-kanji">武士道七徳</span>
        </div>

        <div className="bushido-header-row">
          <div className="bushido-title-col">
            <AnimatedChapterHeading
              chapter="bushido"
              sectionLabel="THE ETERNAL PILLARS"
              primaryText="THE CODE OF"
              accentText="BUSHIDO."
              breakLine={false}
              className="bushido-main-title"
            />
          </div>
          <p className="bushido-header-desc">
            Codified over centuries of battlefield trials and Zen contemplation, the seven virtues
            formed the moral compass of the feudal warrior. Hover or click each parchment leaf to unfold its ancient philosophy.
          </p>
        </div>

        {/* 3D ORIGAMI ACCORDION CONTAINER */}
        <div
          ref={containerRef}
          className="bushido-accordion-container origami-3d-stage"
          onMouseLeave={() => setHoveredVirtue(null)}
          role="tablist"
          aria-label="Seven Virtues of Bushido Accordion"
        >
          {virtues.map((v, index) => {
            const isOpen = currentOpenVirtue === index;
            const isCommitted = activeVirtue === index;

            return (
              <div
                key={v.id}
                role="tab"
                tabIndex={0}
                aria-selected={isOpen}
                aria-expanded={isOpen}
                className={`bushido-panel origami-panel ${isOpen ? 'is-active is-unfolded' : 'is-folded'} ${
                  isCommitted ? 'is-committed' : ''
                } interactive`}
                onMouseEnter={() => setHoveredVirtue(index)}
                onClick={() => handlePanelClick(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {/* 3D ORIGAMI FOLDING EDGES & CREASE ARCHITECTURE */}
                <div className="origami-crease-shadow" aria-hidden="true" />
                <div className="origami-crimson-stroke" aria-hidden="true" />
                <div className="origami-fold-highlight" aria-hidden="true" />

                {/* Narrow Washi Strip (Always Anchors Left) */}
                <div className="panel-collapsed-strip origami-strip-facade">
                  <div className="strip-top">
                    <span className="strip-num">{v.number}</span>
                    <span className="strip-kanji">{v.kanji}</span>
                  </div>

                  <div className="strip-title-vertical">
                    <span>{v.name}</span>
                    <span className="strip-sub">{v.english}</span>
                  </div>

                  <div className="strip-bottom">
                    <span className="strip-indicator" />
                  </div>
                </div>

                {/* 3D Unfolding Leaf & Content Body */}
                <div className="origami-leaf-container">
                  <div className="origami-leaf-wing">
                    <div className="panel-expanded-content origami-interior-content">
                      <div className="expanded-top-meta">
                        <CrimsonBrushAccent variant="badge" className="expanded-virtue-tag">
                          VIRTUE {v.number} OF 07 · 徳目
                        </CrimsonBrushAccent>
                        <span className="expanded-reading">{v.reading} · {v.kanji}</span>
                      </div>

                      <div className="expanded-body-grid">
                        <div className="expanded-main-info">
                          <h3 className="expanded-name">
                            {v.name} <span className="expanded-kanji-large">{v.kanji}</span>
                          </h3>
                          <h4 className="expanded-english">{v.english}</h4>
                          <p className="expanded-essence">{v.essence}</p>
                          <p className="expanded-deepdive">{v.deepDive}</p>
                        </div>

                        {/* TYPE A: Black Ink Brushstroke Quote Panel */}
                        <InkQuotePanel
                          quote={v.quote}
                          source={`MEDITATION · ${v.name}`}
                          sealText={v.kanji.charAt(0)}
                          className="expanded-quote-brush"
                        />
                      </div>

                      {/* Virtue Navigation Dots */}
                      <div className="expanded-nav-dots" role="tablist" aria-label="Virtue quick selector">
                        {virtues.map((dot, dotIdx) => (
                          <button
                            key={dot.id}
                            className={`nav-dot ${dotIdx === currentOpenVirtue ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePanelClick(dotIdx);
                            }}
                            aria-label={`Jump to virtue ${dot.name}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
