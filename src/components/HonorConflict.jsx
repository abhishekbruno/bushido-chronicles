import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '../utils/soundEngine';
import { InkManuscriptPanel } from './brushstroke';

gsap.registerPlugin(ScrollTrigger);

/**
 * HonorConflict — 名誉の葛藤 (The Burden of Honor: Giri vs Ninjō)
 * -----------------------------------------------------------------------------
 * CHAPTER 03 — A profound philosophical exploration of the deepest inner tension
 * in Samurai life: the conflict between GIRI (義理 - Obligation, Feudal Oath & Law)
 * and NINJŌ (人情 - Human Compassion, Mercy & Spiritual Conscience).
 *
 * Visual & Motion System:
 *  - Bold vintage display typography (Anton/Cinzel) with crimson period dot
 *  - Cinematic GSAP ScrollTrigger word-stagger reveal with painted sumi-e underline
 *  - Slim archival manuscript case selector tabs (styled as folded historical documents)
 *  - Traditional Japanese sumi-e symbolic balance motif (authentic brush arch, no modern scale)
 *  - Reusable InkManuscriptPanel containers with paper-folding scroll animations
 *  - Expressive ink-brush quote banners with cinnabar glyphs and hanko seals
 *  - Warm archival resolution panel with generous book typography
 *  - Full prefers-reduced-motion compatibility and responsive layouts
 */
export default function HonorConflict() {
  const [activeDilemma, setActiveDilemma] = useState(0);
  const [balanceBias, setBalanceBias] = useState(50); // 0 (100% Ninjo) to 100 (100% Giri)
  const [isTransitioning, setIsTransitioning] = useState(false);

  const containerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingWordsRef = useRef([]);
  const dotRef = useRef(null);
  const underlineRef = useRef(null);
  const introPanelRef = useRef(null);
  const caseContentRef = useRef(null);

  const dilemmas = [
    {
      id: 'minatogawa',
      caseNum: '01',
      kanjiNum: '巻一',
      title: 'THE SACRIFICE OF MINATOGAWA (1336)',
      jpTitle: '湊川の選択 · 義理と親心',
      protagonist: 'Kusunoki Masashige',
      protagonistJp: '楠木正成',
      dates: '1294 – 1336',
      sealChar: '楠',
      conflict: 'Imperial Command vs Strategic Truth & Fatherly Love',
      conflictJp: '勅命の重圧と父子の情愛',
      giriText:
        'Emperor Go-Daigo ordered Masashige to march into an open, flat coastal plain to face Ashikaga Takauji’s massive naval and cavalry armada. Masashige knew this strategy was military suicide, but feudal Giri demanded absolute fidelity to the sovereign’s seal. A warrior’s oath could not waver even when commanded into the jaws of destruction.',
      ninjoText:
        'Ninjō cried out for the preservation of life, clan, and family. In his private heart, Masashige longed to see his 11-year-old son Masatsura grow to manhood. At Sakurai post station, weeping in secret, he ordered his young son to turn back home to protect their clan’s line and preserve justice for future generations.',
      resolution:
        'Masashige marched forward into battle with 700 loyal samurai against 100,000 foes, fighting with heroic brilliance until the end. His death established him as the eternal avatar of unwavering loyalty, while his compassion secured the survival of his heirs.',
      moralLesson:
        'Honor is not the absence of heartbreak; it is doing what duty demands while protecting what the heart treasures.',
      biasDefault: 50,
    },
    {
      id: 'kanshi',
      caseNum: '02',
      kanjiNum: '巻二',
      title: 'THE SILENT REMONSTRANCE (1553)',
      jpTitle: '平手政秀の諫死 · 命を賭した忠言',
      protagonist: 'Hirate Masahide',
      protagonistJp: '平手政秀',
      dates: '1492 – 1553',
      sealChar: '平',
      conflict: 'Silent Retainership vs Moral Awakening of a Young Lord',
      conflictJp: '主君への諫言と自決の忠節',
      giriText:
        'As senior counselor and guardian to the unruly young Oda Nobunaga, Masahide was bound by Giri to defend his master’s authority before rival clans. Public rebellion or insubordination was strictly forbidden under feudal law. Direct defiance would shatter clan unity and invite destruction.',
      ninjoText:
        'Masahide loved Nobunaga like a son and recognized his raw, unorthodox genius. Yet Nobunaga’s reckless, delinquent behavior was threatening to tear the Owari province apart. Ordinary verbal rebukes had failed repeatedly; Masahide knew only a supreme moral shock could awaken the youth’s dormant greatness.',
      resolution:
        'Masahide committed seppuku (ritual suicide) in solitude, leaving behind a searing final letter of admonishment and plea. Shattered by grief and remorse, Nobunaga underwent an immediate moral transformation, commissioned the Seishu-ji temple in Masahide’s honor, and focused his life on unifying Japan.',
      moralLesson:
        'The highest loyalty is Kanshi (諫死)—standing by righteousness even when it costs one’s life to awaken another.',
      biasDefault: 35,
    },
    {
      id: 'salt',
      caseNum: '03',
      kanjiNum: '巻三',
      title: 'THE GIFT OF SALT TO THE ENEMY (1567)',
      jpTitle: '敵に塩を送る · 武士道の仁義',
      protagonist: 'Uesugi Kenshin',
      protagonistJp: '上杉謙信',
      dates: '1530 – 1578',
      sealChar: '杉',
      conflict: 'War Exploitation vs The Inviolable Sanctity of Civilian Life',
      conflictJp: '戦術的優位と民生への慈悲',
      giriText:
        'Uesugi Kenshin and Takeda Shingen were sworn rival warlords locked in bloody clashes across Kawanakajima. When neighboring clans imposed a total salt embargo on Shingen’s landlocked province to starve his people, military pragmatism urged Kenshin to support the blockade and crush his rival.',
      ninjoText:
        'Kenshin believed war was a contest of honor between armed warriors, not a weapon of mass cruelty against commoners. Depriving innocent peasants and children of salt—a basic biological necessity—struck him as cowardly, ignominious, and beneath the sacred dignity of Bushido.',
      resolution:
        'Kenshin broke the embargo and dispatched salt shipments to Shingen’s lands at fair peacetime prices, famously writing: "Wars are decided by bows and swords, not by rice and salt." The act stunned feudal Japan and gave rise to the enduring proverb "sending salt to an enemy" (敵に塩を送る).',
      moralLesson:
        'Victory achieved through cruelty is defeat disguised; true honor refuses to weaponize the vulnerability of the innocent.',
      biasDefault: 65,
    },
  ];

  // =========================================================================
  // GSAP SCROLLTRIGGER ENTRANCE CHOREOGRAPHY
  // =========================================================================
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      // 1. Chapter label appears through crimson ink stroke (0.5s)
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
          0
        );
      }

      // 2. Heading words reveal upward from masked boundary with subtle stagger (0.85s)
      if (headingWordsRef.current.length > 0) {
        tl.fromTo(
          headingWordsRef.current,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: 'power3.out',
          },
          0.12
        );
      }

      // 3. Crimson period dot pops in last (0.35s)
      if (dotRef.current) {
        tl.fromTo(
          dotRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' },
          0.45
        );
      }

      // 4. Sumi-e painted underline sweeps across beneath heading (0.75s)
      if (underlineRef.current) {
        tl.fromTo(
          underlineRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.75, ease: 'power2.out' },
          0.35
        );
      }

      // 5. Archival intro text panel fades in and rises gently (0.65s)
      if (introPanelRef.current) {
        tl.fromTo(
          introPanelRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
          0.45
        );
      }

      ScrollTrigger.create({
        trigger: el,
        start: 'top 84%',
        once: true,
        onEnter: () => tl.play(),
      });
    }, el);

    return () => ctx.revert();
  }, []);

  // =========================================================================
  // TAB SELECTION WITH TACTILE CROSS-FOLD TRANSITION
  // =========================================================================
  const handleSelectDilemma = (idx) => {
    if (idx === activeDilemma || isTransitioning) return;
    sound.playWoodenClick();
    setIsTransitioning(true);

    const targetBias = dilemmas[idx].biasDefault;

    // Smooth case transition: fade/fold current content, update state, unfold new case
    if (caseContentRef.current) {
      gsap.to(caseContentRef.current, {
        opacity: 0.25,
        y: 6,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          setActiveDilemma(idx);
          setBalanceBias(targetBias);
          gsap.to(caseContentRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
            onComplete: () => setIsTransitioning(false),
          });
        },
      });
    } else {
      setActiveDilemma(idx);
      setBalanceBias(targetBias);
      setIsTransitioning(false);
    }
  };

  const current = dilemmas[activeDilemma];
  const headingWords = ['THE', 'BURDEN', 'OF', 'HONOR'];

  return (
    <div ref={containerRef} className="honor-conflict-experience">
      {/* ==================================================================== */}
      {/* 1. CHAPTER 03 HEADING & ARCHIVAL OVERVIEW INTRO PANEL                */}
      {/* ==================================================================== */}
      <div className="honor-chapter-header">
        {/* Archival Eyebrow Tag with Horizontal Crimson Ink Stroke */}
        <div ref={eyebrowRef} className="honor-chapter-eyebrow">
          <span className="chapter-eyebrow-ink-bar" aria-hidden="true" />
          <span className="chapter-num-badge">CHAPTER 03</span>
          <span className="chapter-eyebrow-line" />
          <span className="chapter-eyebrow-kanji">名誉の葛藤</span>
          <span className="chapter-eyebrow-seal" aria-hidden="true">葛</span>
        </div>

        {/* Master Redesigned Display Heading with Word Stagger */}
        <h3 className="honor-chapter-title conflict-display-heading">
          {headingWords.map((word, wIdx) => {
            const isLast = wIdx === headingWords.length - 1;
            return (
              <span key={word} className="heading-word-clip">
                <span
                  ref={(el) => (headingWordsRef.current[wIdx] = el)}
                  className="heading-stagger-word"
                >
                  {word}
                  {isLast && (
                    <span ref={dotRef} className="title-crimson-dot">
                      .
                    </span>
                  )}
                </span>
              </span>
            );
          })}
        </h3>

        {/* Calligraphic Sumi-e Brush Underline */}
        <div ref={underlineRef} className="conflict-heading-brush-underline" aria-hidden="true" />

        {/* Archival Intro Text Box (Japanese Manuscript Style) */}
        <div ref={introPanelRef} className="honor-chapter-intro-panel">
          <div className="intro-panel-ink-accent" aria-hidden="true" />
          <div className="intro-panel-header">
            <span className="intro-hanko-seal" aria-hidden="true">葛</span>
            <span className="intro-kicker-text">ARCHIVAL CRUCIBLE · 葛藤の記録</span>
            <span className="intro-gold-seam" aria-hidden="true" />
          </div>
          <p className="honor-chapter-desc">
            For the samurai, honor was never an effortless ideal. It was forged in the agonizing
            crucible between two conflicting duties: <em>Giri</em> (external obligation and feudal oath)
            and <em>Ninjō</em> (human compassion and moral conscience). Select each historical record
            below to explore how warriors confronted this ultimate moral trial.
          </p>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. THREE SLIM ARCHIVAL MANUSCRIPT CASE SELECTORS                     */}
      {/* ==================================================================== */}
      <div className="honor-dilemma-selector-bar" role="tablist" aria-label="Historical Cases of Moral Conflict">
        {dilemmas.map((d, idx) => {
          const isActive = activeDilemma === idx;
          return (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`dilemma-select-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => handleSelectDilemma(idx)}
            >
              {/* Active State Crimson Indicator Bar */}
              <span className="tab-active-crimson-bar" aria-hidden="true" />

              <div className="tab-meta-top-row">
                <span className="tab-dilemma-kanji-num">{d.kanjiNum}</span>
                <span className="tab-dilemma-num">CASE {d.caseNum}</span>
                {isActive && <span className="tab-active-seal" aria-hidden="true">選</span>}
              </div>

              <h4 className="tab-dilemma-title">{d.title}</h4>
              <span className="tab-dilemma-jp">{d.jpTitle}</span>

              {/* Painted Underline Accent for Active Card */}
              <div className="tab-brush-underline" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* 3. ACTIVE CASE HISTORICAL DOSSIER STAGE                              */}
      {/* ==================================================================== */}
      <div ref={caseContentRef} className="honor-conflict-parchment-stage">
        {/* Top Hero Overview for Current Case */}
        <div className="conflict-hero-meta">
          <div className="conflict-hero-protagonist">
            <div className="meta-tag-line">
              <span className="meta-tag-seal" aria-hidden="true">{current.sealChar}</span>
              <span className="meta-kicker">HISTORICAL PROTAGONIST · 歴史的当事者</span>
              <span className="meta-dates-badge">{current.dates}</span>
            </div>
            <div className="protagonist-name-lockup">
              <h4 className="meta-name">{current.protagonist}</h4>
              <span className="protagonist-kanji-name">{current.protagonistJp}</span>
            </div>
            <div className="protagonist-brush-divider" aria-hidden="true" />
          </div>

          <div className="conflict-hero-theme">
            <span className="meta-kicker">THE MORAL CRUCIBLE · 葛藤の核心</span>
            <div className="meta-theme-text">{current.conflict}</div>
            <div className="meta-theme-jp">{current.conflictJp}</div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 4. TRADITIONAL JAPANESE SUMI-E SYMBOLIC BALANCE MOTIF               */}
        {/* ================================================================== */}
        <div className="conflict-balance-visualizer" aria-label="Giri vs Ninjo Balance Visualizer">
          {/* Left Pod: Ninjo */}
          <div className="balance-side left-side">
            <div className="balance-label-badge ninjo-badge">
              <span className="badge-kanji">情</span>
              <div className="badge-text-block">
                <span className="badge-name">NINJŌ · 人情</span>
                <span className="badge-sub">HUMAN CONSCIENCE</span>
              </div>
            </div>
            <p className="balance-desc-micro">Mercy · Empathy · Moral Truth · Family</p>
          </div>

          {/* Center Traditional Japanese Sumi-e Balance Motif */}
          <div className="balance-center-scale" aria-hidden="true">
            <svg
              className="balance-sumie-svg"
              viewBox="0 0 240 100"
              style={{
                transform: `rotate(${(balanceBias - 50) * 0.22}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              <defs>
                <linearGradient id="balanceArchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C5282F" />
                  <stop offset="50%" stopColor="#1E2024" />
                  <stop offset="100%" stopColor="#8C6E26" />
                </linearGradient>
              </defs>
              {/* Organic Brush Arch Beam */}
              <path
                d="M 20 62 Q 120 22 220 62"
                fill="none"
                stroke="url(#balanceArchGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Fine Suspension Ink Lines */}
              <line x1="26" y1="62" x2="26" y2="82" stroke="#C5282F" strokeWidth="1.6" strokeDasharray="2 2" />
              <line x1="214" y1="62" x2="214" y2="82" stroke="#1E2024" strokeWidth="1.6" strokeDasharray="2 2" />
              {/* Left Hanging Washi Weight (Ninjo) */}
              <circle cx="26" cy="85" r="9" fill="#F4E9D5" stroke="#C5282F" strokeWidth="2" />
              <circle cx="26" cy="85" r="4" fill="#C5282F" />
              {/* Right Hanging Washi Weight (Giri) */}
              <circle cx="214" cy="85" r="9" fill="#F4E9D5" stroke="#1E2024" strokeWidth="2" />
              <circle cx="214" cy="85" r="4" fill="#1E2024" />
              {/* Center Fulcrum Medallion */}
              <circle cx="120" cy="42" r="14" fill="#17181C" stroke="#D4AF37" strokeWidth="1.8" />
              <circle cx="120" cy="42" r="9" fill="#C5282F" />
            </svg>
            <div className="scale-center-seal-text" aria-hidden="true">和</div>
          </div>

          {/* Right Pod: Giri */}
          <div className="balance-side right-side">
            <div className="balance-label-badge giri-badge">
              <div className="badge-text-block">
                <span className="badge-name">GIRI · 義理</span>
                <span className="badge-sub">OBLIGATION & LAW</span>
              </div>
              <span className="badge-kanji">義</span>
            </div>
            <p className="balance-desc-micro">Duty · Clan Oath · Feudal Law · Allegiance</p>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 5. DUAL-COLUMN REUSABLE INK MANUSCRIPTS (NINJŌ VS GIRI)            */}
        {/* ================================================================== */}
        <div className="conflict-dual-panels-grid">
          {/* Left Column: NINJŌ MANUSCRIPT */}
          <InkManuscriptPanel
            accent="crimson"
            seal="情"
            sealColor="#C5282F"
            sectionLabel="NINJŌ · 人情"
            heading="THE VOICE OF NINJŌ"
            subheading="HUMAN CONSCIENCE & MORAL RECKONING"
            quote="Compassion is the soul of justice; law without mercy is mere tyranny."
            delay={0.1}
            foldAngle={16}
            className="conflict-manuscript-column"
          >
            <p className="manuscript-paragraph-body">{current.ninjoText}</p>
          </InkManuscriptPanel>

          {/* Right Column: GIRI MANUSCRIPT */}
          <InkManuscriptPanel
            accent="charcoal"
            seal="義"
            sealColor="#1A1C20"
            sectionLabel="GIRI · 義理"
            heading="THE DEMAND OF GIRI"
            subheading="OBLIGATION, FEUDAL LAW & MASTER'S COMMAND"
            quote="A vow once spoken cannot be recalled; allegiance must endure beyond convenience."
            delay={0.25}
            foldAngle={16}
            className="conflict-manuscript-column"
          >
            <p className="manuscript-paragraph-body">{current.giriText}</p>
          </InkManuscriptPanel>
        </div>

        {/* ================================================================== */}
        {/* 6. HISTORICAL RESOLUTION & ETHICAL SYNTHESIS MANUSCRIPT            */}
        {/* ================================================================== */}
        <div className="conflict-resolution-manuscript-wrapper">
          <InkManuscriptPanel
            accent="gold"
            seal="結"
            sealColor="#8C6E26"
            sectionLabel="HISTORICAL RESOLUTION & ETHICAL SYNTHESIS · 結末と教訓"
            heading="THE RESOLUTION OF THE TRIAL"
            subheading="HOW THE WARRIOR RECONCILED THE IRRECONCILABLE"
            delay={0.35}
            foldAngle={12}
            className="resolution-manuscript-panel"
          >
            <p className="resolution-narrative-text">{current.resolution}</p>

            {/* Final Highlighted Moral Lesson Callout */}
            <div className="resolution-verdict-banner">
              <div className="verdict-banner-ink-bar" aria-hidden="true" />
              <div className="verdict-banner-header">
                <span className="verdict-banner-seal" aria-hidden="true">銘</span>
                <span className="verdict-banner-label">THE ENDURING LESSON · 遺訓</span>
              </div>
              <p className="verdict-quote-text">
                <span className="verdict-glyph" aria-hidden="true">“</span>
                {current.moralLesson}
                <span className="verdict-glyph" aria-hidden="true">”</span>
              </p>
            </div>

            {/* Archival Verification Footnote */}
            <div className="resolution-footer-footnote">
              <div className="footnote-left">
                <span className="footnote-dot" />
                <span>BUSHIDO CODEX · CHAPTER III · GIRI VS NINJŌ · {current.protagonist.toUpperCase()}</span>
              </div>
              <div className="footnote-right">
                <span className="footnote-verified-text">名誉の葛藤 · VERIFIED CHRONICLE</span>
                <span className="footnote-seal-stamp" aria-hidden="true">印</span>
              </div>
            </div>
          </InkManuscriptPanel>
        </div>
      </div>
    </div>
  );
}
