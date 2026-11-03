import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '../utils/soundEngine';

gsap.registerPlugin(ScrollTrigger);

/**
 * HonorPrinciples — 五常の徳 (The Five Pillars of Samurai Honor)
 * -----------------------------------------------------------------------------
 * Cinematic, vintage-modern samurai codex exploring the 5 foundational virtues:
 *  1. 名誉 — MEIYO (HONOR & PERSONAL DIGNITY)
 *  2. 誠 — MAKOTO (SINCERITY & TRUTHFULNESS)
 *  3. 忠義 — CHŪGI (LOYALTY & SACRIFICIAL DEVOTION)
 *  4. 勇 — YŪ (COURAGE & RIGHTEOUS FORTITUDE)
 *  5. 礼 — REI (RESPECT & CIVIC GRACE)
 *
 * Visual & Motion System:
 *  - Bold, vintage editorial heading with GSAP ScrollTrigger reveal
 *  - Washi-parchment archival intro card with cinnabar seal and ink accents
 *  - Left sidebar: Codex index cards with active dark-ink & crimson states
 *  - Right content panel: Layered Japanese manuscript with brass corner brackets,
 *    rich vector emblem medallions, brushstroke quote banner, and two-column
 *    essence/history narrative.
 *  - Fully responsive on desktop, tablet, and mobile.
 *  - Respects prefers-reduced-motion.
 */
export default function HonorPrinciples() {
  const [activePrinciple, setActivePrinciple] = useState(0);

  const containerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const introPanelRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
      });

      // 1. Archival label reveals first (0.5s)
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          0
        );
      }

      // 2. Large display heading reveals with upward motion & soft mask (0.85s)
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
          0.15
        );
      }

      // 3. Archival intro text box fades in smoothly (0.65s)
      if (introPanelRef.current) {
        tl.fromTo(
          introPanelRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
          0.35
        );
      }

      ScrollTrigger.create({
        trigger: el,
        start: 'top 82%',
        once: true,
        onEnter: () => tl.play(),
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  const principles = [
    {
      id: 'meiyo',
      num: '01',
      kanji: '名誉',
      glyph: '誉',
      english: 'MEIYO',
      title: 'HONOR & PERSONAL DIGNITY',
      subtitle: 'The Sacred Mirror of Reputation & Moral Self-Reckoning',
      tagline: 'A stain upon honor outlives ten thousand generations.',
      quoteJp: '武士に二言なし · 名を惜しむ',
      essence:
        'To the Samurai, Meiyo was not mere superficial vanity or boastful fame. It was a rigorous, inward-looking moral mirror. A warrior understood that their name did not belong to them alone, but was held in sacred trust for ancestors and descendants. Every word uttered, every vow sealed, and every solitary choice was an indelible stroke upon their living legacy.',
      historicalRecord:
        'In Nitobe Inazō’s definitive treatise Bushido, Meiyo is celebrated as the acute consciousness of personal dignity and moral responsibility. A samurai would rather suffer bodily wound or severe defeat than commit an act of spiritual baseness. True honor required living so transparently that one had nothing to conceal even before the gods (Kami).',
      symbolSvg: (
        <svg viewBox="0 0 100 100" className="principle-symbol-svg" aria-hidden="true">
          <circle cx="50" cy="50" r="38" fill="none" stroke="url(#hnGoldGrad)" strokeWidth="3" />
          <circle cx="50" cy="50" r="32" fill="#121316" stroke="#C5282F" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="22" fill="none" stroke="url(#hnGoldGrad)" strokeDasharray="4 3" strokeWidth="1.5" />
          <polygon points="50,26 57,43 74,50 57,57 50,74 43,57 26,50 43,43" fill="url(#hnGoldGrad)" opacity="0.9" />
          <circle cx="50" cy="50" r="5" fill="#C5282F" />
        </svg>
      ),
    },
    {
      id: 'makoto',
      num: '02',
      kanji: '誠',
      glyph: '誠',
      english: 'MAKOTO',
      title: 'SINCERITY & TRUTHFULNESS',
      subtitle: 'The Indivisible Harmony of Thought, Word & Action',
      tagline: 'The word of a warrior is as unyielding as forged steel.',
      quoteJp: '言霊の一致 · 偽りのなき心',
      essence:
        'Makoto asserts that intention without decisive action is empty, and action without truth is deception. Between samurai of honor, formal written oaths and notarized seals were often viewed as insulting; the spoken word of a bushi (Bushi no ichigon) was inviolable. To utter a falsehood was considered an act of profound spiritual cowardice.',
      historicalRecord:
        'The kanji for Makoto (誠) is composed of two roots: "words" (言) and "to complete / become" (成). Thus, sincerity literally meant "bringing words into real existence." When the famed Shinsengumi raised their standard in 19th-century Kyoto, their banner bore only this single, towering crimson character.',
      symbolSvg: (
        <svg viewBox="0 0 100 100" className="principle-symbol-svg" aria-hidden="true">
          <line x1="15" y1="50" x2="85" y2="50" stroke="url(#hnGoldGrad)" strokeWidth="3" strokeLinecap="round" />
          <polygon points="85,50 72,42 76,50 72,58" fill="url(#hnCrimsonOdoshi)" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#C5282F" strokeWidth="2" strokeDasharray="8 4" />
          <circle cx="50" cy="50" r="16" fill="none" stroke="url(#hnGoldGrad)" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="4" fill="#C5282F" />
          <path d="M 22 42 L 32 50 L 22 58" stroke="url(#hnGoldGrad)" strokeWidth="2" fill="none" />
        </svg>
      ),
    },
    {
      id: 'chugi',
      num: '03',
      kanji: '忠義',
      glyph: '忠',
      english: 'CHŪGI',
      title: 'LOYALTY & SACRIFICIAL DEVOTION',
      subtitle: 'The Unbroken Bond Between Retainer, Master & Moral Duty',
      tagline: 'True loyalty guides the master toward righteousness.',
      quoteJp: '死生を共にする · 義理の絆',
      essence:
        'Chūgi is frequently misunderstood as robotic, unthinking obedience. In traditional samurai philosophy, blind submission was viewed with disdain. The highest expression of loyalty was Kanshi (諫死)—moral remonstrance—wherein a retainer risked their position and life to confront their lord when the master strayed from the path of righteousness.',
      historicalRecord:
        'When Kusunoki Masashige received Emperor Go-Daigo’s doomed military command to meet Ashikaga Takauji’s overwhelming armada in open combat at Minatogawa, Masashige calmly obeyed while sending his 11-year-old son home with the instruction to uphold virtue over vengeance. His loyalty was not to personal victory, but to the immortal bond of oath.',
      symbolSvg: (
        <svg viewBox="0 0 100 100" className="principle-symbol-svg" aria-hidden="true">
          <circle cx="50" cy="50" r="35" fill="none" stroke="#292A25" strokeWidth="2" />
          <path
            d="M 28 35 C 40 20, 60 20, 72 35 C 80 45, 80 55, 72 65 C 60 80, 40 80, 28 65 C 20 55, 20 45, 28 35 Z"
            fill="none"
            stroke="url(#hnGoldGrad)"
            strokeWidth="3"
          />
          <path
            d="M 35 28 C 20 40, 20 60, 35 72 C 45 80, 55 80, 65 72 C 80 60, 80 40, 65 28 C 55 20, 45 20, 35 28 Z"
            fill="none"
            stroke="url(#hnCrimsonOdoshi)"
            strokeWidth="2.5"
          />
          <circle cx="50" cy="50" r="6" fill="url(#hnGoldGrad)" />
        </svg>
      ),
    },
    {
      id: 'yu',
      num: '04',
      kanji: '勇気',
      glyph: '勇',
      english: 'YŪ',
      title: 'COURAGE & RIGHTEOUS FORTITUDE',
      subtitle: 'Decisive Action in the Direct Presence of Peril',
      tagline: 'To perceive what is just and fail to act is true cowardice.',
      quoteJp: '見義不為無勇也 · 泰然自若',
      essence:
        'Courage in Bushido was never measured by reckless bravado or frantic aggression. Blind bloodlust was regarded as mere panic in disguise. Yū is calm equilibrium (Fudoshin): the serenity to assess danger without trembling, to stand alone against popular madness, and to step forward when duty calls, regardless of personal cost.',
      historicalRecord:
        'As Confucius recorded in the Analects—a core philosophical text in samurai academies—"To perceive what is right and not do it is the lack of courage." The samurai practiced Zen breathwork and swordsmanship not merely to strike an opponent, but to vanquish the inner terror of death and the paralysis of hesitation.',
      symbolSvg: (
        <svg viewBox="0 0 100 100" className="principle-symbol-svg" aria-hidden="true">
          <path
            d="M 50 18 C 58 32, 70 42, 66 56 C 62 70, 42 78, 52 86 C 36 80, 30 65, 36 50 C 40 40, 44 32, 50 18 Z"
            fill="url(#hnCrimsonOdoshi)"
          />
          <path
            d="M 50 35 C 54 44, 60 50, 58 58 C 55 66, 44 70, 50 76 C 40 72, 38 62, 42 54 C 44 48, 46 42, 50 35 Z"
            fill="url(#hnGoldGrad)"
          />
          <circle cx="50" cy="50" r="36" fill="none" stroke="url(#hnGoldGrad)" strokeWidth="1.5" strokeDasharray="3 5" />
        </svg>
      ),
    },
    {
      id: 'rei',
      num: '05',
      kanji: '礼儀',
      glyph: '礼',
      english: 'REI',
      title: 'RESPECT & CIVIC GRACE',
      subtitle: 'The Discipline of Compassion Expressed Through Form',
      tagline: 'Courtesy without sincerity is an empty spectacle.',
      quoteJp: '礼節を重んず · 和の精神',
      essence:
        'In a feudal society where every warrior carried two razor-sharp blades capable of ending life in a heartbeat, etiquette was the essential firewall of civilization. Rei is not cold formalism or stiff bowing; it is reverence for human dignity, recognizing that strength without gentleness decays into mere brutality.',
      historicalRecord:
        'A warrior who defeated an adversary was expected to clean the fallen foe’s blade, bow before their remains, and accord them honorable burial. Through the Chanoyu (Tea Ceremony), samurai washed away their martial pride at the teahouse entrance, crawling through the humble nijiriguchi portal as equals in human frailty.',
      symbolSvg: (
        <svg viewBox="0 0 100 100" className="principle-symbol-svg" aria-hidden="true">
          <path d="M 50 82 L 20 40 Q 50 25 80 40 Z" fill="#1A1C1E" stroke="url(#hnGoldGrad)" strokeWidth="2" />
          <path d="M 50 82 L 32 34 M 50 82 L 44 28 M 50 82 L 56 28 M 50 82 L 68 34" stroke="url(#hnCrimsonOdoshi)" strokeWidth="1.6" />
          <circle cx="50" cy="82" r="5" fill="url(#hnGoldGrad)" />
          <circle cx="50" cy="46" r="10" fill="none" stroke="#C5282F" strokeWidth="1.5" />
          <circle cx="50" cy="46" r="3" fill="url(#hnGoldGrad)" />
        </svg>
      ),
    },
  ];

  const handleSelect = (idx) => {
    sound.playWoodenClick();
    if (idx === activePrinciple) return;
    setActivePrinciple(idx);
  };

  const current = principles[activePrinciple];

  return (
    <div ref={containerRef} className="honor-principles-experience">
      {/* SVG Global Defs for Principle Emblems & Shaders */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="hnGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2D6" />
            <stop offset="30%" stopColor="#E2C26E" />
            <stop offset="70%" stopColor="#B38D35" />
            <stop offset="100%" stopColor="#7A5D1B" />
          </linearGradient>
          <linearGradient id="hnCrimsonOdoshi" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E63842" />
            <stop offset="50%" stopColor="#C5282F" />
            <stop offset="100%" stopColor="#87141A" />
          </linearGradient>
          <linearGradient id="hnSumiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E3138" />
            <stop offset="50%" stopColor="#17181C" />
            <stop offset="100%" stopColor="#0B0C0E" />
          </linearGradient>
        </defs>
      </svg>

      {/* ==================================================================== */}
      {/* 1. CHAPTER 02 HEADING & REDESIGNED ARCHIVAL INTRO PANEL              */}
      {/* ==================================================================== */}
      <div className="honor-chapter-header">
        {/* Archival Eyebrow Tag */}
        <div ref={eyebrowRef} className="honor-chapter-eyebrow">
          <span className="chapter-num-badge">CHAPTER 02</span>
          <span className="chapter-eyebrow-line" />
          <span className="chapter-eyebrow-kanji">五常の徳</span>
          <span className="chapter-eyebrow-seal" aria-hidden="true">徳</span>
        </div>

        {/* Master Redesigned Display Heading */}
        <h3 ref={headingRef} className="honor-chapter-title">
          THE FIVE PILLARS OF SAMURAI HONOR<span className="title-crimson-dot">.</span>
        </h3>

        {/* Redesigned Archival Intro Text Box (Japanese Manuscript Style) */}
        <div ref={introPanelRef} className="honor-chapter-intro-panel">
          <div className="intro-panel-ink-accent" aria-hidden="true" />
          <div className="intro-panel-header">
            <span className="intro-hanko-seal" aria-hidden="true">概</span>
            <span className="intro-kicker-text">ARCHIVAL OVERVIEW · 概説</span>
            <span className="intro-gold-seam" aria-hidden="true" />
          </div>
          <p className="honor-chapter-desc">
            Beyond battlefield tactics, the standing of a samurai was governed by five
            indivisible virtues. Select each manuscript entry below to unfold its philosophical
            meaning, historical origin, and enduring lesson.
          </p>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. FIVE CODEX INDEX CARDS (LEFT) + ACTIVE MANUSCRIPT VIEW (RIGHT)     */}
      {/* ==================================================================== */}
      <div className="honor-principles-manuscript-grid">
        {/* Left Column: Codex Chapter Selector Cards */}
        <div className="honor-principles-tablist" role="tablist" aria-label="Five Principles of Honor">
          {principles.map((item, idx) => {
            const isActive = activePrinciple === idx;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`honor-principle-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => handleSelect(idx)}
              >
                {/* Active Left Crimson Indicator Bar */}
                <span className="tab-left-indicator-bar" aria-hidden="true" />

                <div className="tab-left-meta">
                  <span className="tab-item-num">{item.num}</span>
                  <span className="tab-item-num-dot">·</span>
                  <span className="tab-item-kanji">{item.kanji}</span>
                </div>

                <div className="tab-right-info">
                  <span className="tab-item-english">{item.english}</span>
                  <span className="tab-item-title">{item.title}</span>
                </div>

                {/* Arrow Pointer into active card */}
                <div className="tab-active-indicator" aria-hidden="true">
                  <span className="indicator-arrow" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Principle Expanded Manuscript View */}
        <div className="honor-principle-active-manuscript">
          <div className="manuscript-parchment-frame">
            {/* Chiseled Antique Brass Corner Brackets */}
            <span className="parchment-bracket top-left" aria-hidden="true" />
            <span className="parchment-bracket top-right" aria-hidden="true" />
            <span className="parchment-bracket bottom-left" aria-hidden="true" />
            <span className="parchment-bracket bottom-right" aria-hidden="true" />

            {/* Top Identity Header Row */}
            <div className="manuscript-header-row">
              <div className="manuscript-title-pack">
                <div className="manuscript-index-tag">
                  <span className="tag-cinnabar-hanko">{current.glyph}</span>
                  <span className="tag-archival-text">VIRTUE {current.num} / 05 · {current.kanji}</span>
                  <span className="tag-sub-dot">·</span>
                  <span className="tag-latin-reading">{current.english}</span>
                </div>
                <h4 className="manuscript-main-heading">{current.english} — {current.title}</h4>
                <div className="manuscript-subtitle-line">
                  <span className="subtitle-gold-dash">—</span>
                  <span>{current.subtitle}</span>
                </div>
              </div>

              {/* Medallion Pod with Vector Emblem */}
              <div className="manuscript-symbol-pod" title={current.quoteJp}>
                <div className="symbol-circle-frame">
                  {current.symbolSvg}
                </div>
                <span className="symbol-jp-caption">{current.quoteJp}</span>
              </div>
            </div>

            {/* Redesigned Commanding Quote Callout Banner */}
            <div className="manuscript-quote-banner">
              <div className="quote-brush-bg" aria-hidden="true" />
              <div className="quote-inner-flex">
                <span className="quote-glyph-mark" aria-hidden="true">“</span>
                <p className="manuscript-quote-text">{current.tagline}</p>
                <span className="quote-glyph-mark" aria-hidden="true">”</span>
              </div>
              <span className="quote-cinnabar-seal" aria-hidden="true">銘</span>
            </div>

            {/* Two-Column Deep Manuscript Narrative */}
            <div className="manuscript-body-grid">
              {/* Column 1: Essence & Philosophy */}
              <div className="manuscript-body-column">
                <div className="column-card-inner">
                  <div className="column-header">
                    <span className="column-label-hanko" aria-hidden="true">本</span>
                    <h5 className="column-label">
                      <span className="column-label-kanji">本質</span> ESSENCE & PHILOSOPHY
                    </h5>
                  </div>
                  <p className="column-paragraph">{current.essence}</p>
                </div>
              </div>

              {/* Column 2: Historical Record & Action */}
              <div className="manuscript-body-column">
                <div className="column-card-inner">
                  <div className="column-header">
                    <span className="column-label-hanko" aria-hidden="true">史</span>
                    <h5 className="column-label">
                      <span className="column-label-kanji">史記</span> HISTORICAL RECORD & ACTION
                    </h5>
                  </div>
                  <p className="column-paragraph">{current.historicalRecord}</p>
                </div>
              </div>
            </div>

            {/* Bottom Archival Footnote & Verification Ribbon */}
            <div className="manuscript-bottom-footer">
              <div className="footer-left-pack">
                <span className="footer-seal-dot" />
                <span className="footer-doc-code">BUSHIDO ARCHIVE · CHAPTER VI · CODEX {current.english}</span>
              </div>
              <div className="footer-right-pack">
                <span className="footer-seal-mark">名誉の銘 · VERIFIED</span>
                <span className="footer-hanko-mini" aria-hidden="true">印</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
