import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '../utils/soundEngine';
import { HonorLegacyManuscript } from './brushstroke';
import { BRUSH_BANNER_PATH, BRUSH_BANNER_STREAK_1 } from './brushstroke/brushstrokePaths';

gsap.registerPlugin(ScrollTrigger);

/**
 * HonorLegacy — 名誉の継承 (The Legacy of Honor: The Enduring Flame)
 * -----------------------------------------------------------------------------
 * CHAPTER 05 — A quiet, cinematic, and reflective conclusion connecting
 * historical samurai ideals to their continuing cultural and ethical influence
 * in contemporary Japan and the modern world.
 *
 * Visual & Motion System:
 *  - Bold vintage display typography (Anton/Cinzel) with crimson period dot
 *  - Word-by-word masked scroll entrance with painted red ink underline
 *  - Three asymmetrical washi-paper manuscripts with organic sumi-e borders
 *  - Custom vector motif medallions (Katana, Calligraphy Brush, Immovable Mountain)
 *  - Cinematic massive horizontal sumi-e brushstroke quotation panel
 *  - Refined Japanese archival action button leading into the final legacy chapter
 *  - Full prefers-reduced-motion compatibility and responsive layouts
 */
export default function HonorLegacy({ onExploreNext }) {
  const containerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingWordsRef = useRef([]);
  const dotRef = useRef(null);
  const underlineRef = useRef(null);
  const introPanelRef = useRef(null);
  const quotePanelRef = useRef(null);
  const quoteBrushRef = useRef(null);
  const quoteTextRef = useRef(null);
  const quoteSealRef = useRef(null);
  const quoteAuthorRef = useRef(null);

  const pillars = [
    {
      num: '01',
      kanji: '職人気質',
      title: 'SHOKUNIN KISHITSU',
      subtitle: 'The Artisan’s Sacred Devotion to Perfection',
      desc: 'When the samurai laid down their swords during the Meiji restoration, the fierce discipline of Bushido was channeled into Japanese craftsmanship. Today, swordsmiths, carpenters, potters, and culinary masters approach their work not as mere commercial production, but as a sacred ethical duty (Shokunin) where cutting corners is considered a personal betrayal of honor.',
      tag: 'CRAFTSMANSHIP & INTEGRITY',
      sealChar: '職',
      // Visual Accent: Katana forging blade & sacred circular aura
      accentSvg: (
        <svg viewBox="0 0 80 80" className="legacy-motif-svg" aria-hidden="true">
          <circle cx="40" cy="40" r="32" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.8" />
          <path d="M 18 62 L 62 18" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
          <path d="M 22 58 L 58 22" stroke="#FAF4E8" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 52 14 L 66 14 L 66 28 Z" fill="#C5282F" />
          <circle cx="24" cy="56" r="4" fill="#C5282F" />
          <circle cx="40" cy="40" r="2.5" fill="#D4AF37" />
        </svg>
      ),
    },
    {
      num: '02',
      kanji: '礼儀作法',
      title: 'REIGI & SOCIAL HARMONY',
      subtitle: 'Respect Woven into the Fabric of Daily Life',
      desc: 'From the disciplined bows exchanged at the threshold of a dojo to the precise rituals of the tea ceremony (Chadō), the samurai conviction that courtesy preserves peace endures. Even in modern high-density Japanese cities, clean streets, punctual conduct, and quiet respect for neighbors are direct cultural descendants of the warrior’s code of civility.',
      tag: 'ETIQUETTE & HUMAN DIGNITY',
      sealChar: '礼',
      // Visual Accent: Traditional Fude Calligraphy Brush & Enso Harmony Arc
      accentSvg: (
        <svg viewBox="0 0 80 80" className="legacy-motif-svg" aria-hidden="true">
          <path
            d="M 24 24 C 36 14, 56 16, 62 30 C 68 44, 58 60, 44 64 C 30 68, 16 54, 20 40"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M 28 62 L 52 20" stroke="#C5282F" strokeWidth="3" strokeLinecap="round" />
          <polygon points="52,20 58,14 56,22" fill="#D4AF37" />
          <circle cx="28" cy="62" r="3" fill="#C5282F" />
          <circle cx="40" cy="40" r="2" fill="#FAF4E8" />
        </svg>
      ),
    },
    {
      num: '03',
      kanji: '不動心',
      title: 'FUDOSHIN & ACCOUNTABILITY',
      subtitle: 'The Immovable Mind in the Face of Crisis',
      desc: 'Fudoshin—the state of absolute mental equilibrium unshakeable by panic, threat, or failure—remains the psychological lodestar of modern Japanese leadership. In moments of tragedy or error, the samurai ideal demands profound personal accountability, quiet resilience, and selfless contribution rather than deflection of blame.',
      tag: 'INNER FORTITUDE & LEADERSHIP',
      sealChar: '心',
      // Visual Accent: Sacred Immovable Peak & Tranquil Still-Water Rings
      accentSvg: (
        <svg viewBox="0 0 80 80" className="legacy-motif-svg" aria-hidden="true">
          <polygon points="40,16 64,62 16,62" fill="none" stroke="#D4AF37" strokeWidth="2.2" />
          <polygon points="40,24 56,58 24,58" fill="#1C1D21" opacity="0.6" />
          <line x1="12" y1="62" x2="68" y2="62" stroke="#C5282F" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="40" cy="68" r="14" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" opacity="0.75" />
          <circle cx="40" cy="40" r="3.5" fill="#C5282F" />
        </svg>
      ),
    },
  ];

  // =========================================================================
  // GSAP SCROLLTRIGGER ANIMATIONS
  // =========================================================================
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Chapter Heading Sequence Timeline
      const headerTl = gsap.timeline({ paused: true });

      if (eyebrowRef.current) {
        headerTl.fromTo(
          eyebrowRef.current,
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
          0
        );
      }

      if (headingWordsRef.current.length > 0) {
        headerTl.fromTo(
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

      if (dotRef.current) {
        headerTl.fromTo(
          dotRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' },
          0.45
        );
      }

      if (underlineRef.current) {
        headerTl.fromTo(
          underlineRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.75, ease: 'power2.out' },
          0.35
        );
      }

      if (introPanelRef.current) {
        headerTl.fromTo(
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
        onEnter: () => headerTl.play(),
      });

      // 2. Final Meditation Quotation Scroll Animation
      if (quotePanelRef.current) {
        const quoteTl = gsap.timeline({ paused: true });

        // Sumi-e stroke paints across
        if (quoteBrushRef.current) {
          quoteTl.fromTo(
            quoteBrushRef.current,
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 0.95, ease: 'power2.inOut' },
            0
          );
        }

        // Quote text reveals smoothly
        if (quoteTextRef.current) {
          quoteTl.fromTo(
            quoteTextRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
            0.4
          );
        }

        // Crimson hanko seal pops in
        if (quoteSealRef.current) {
          quoteTl.fromTo(
            quoteSealRef.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' },
            0.65
          );
        }

        // Attribution line reveals
        if (quoteAuthorRef.current) {
          quoteTl.fromTo(
            quoteAuthorRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            0.75
          );
        }

        ScrollTrigger.create({
          trigger: quotePanelRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => quoteTl.play(),
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  const handleNext = () => {
    sound.playWoodenClick();
    if (onExploreNext) {
      onExploreNext();
    } else {
      const cta = document.getElementById('cta');
      if (cta) cta.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headingWords = ['THE', 'LEGACY', 'OF', 'HONOR'];

  return (
    <div ref={containerRef} className="honor-legacy-experience">
      {/* ==================================================================== */}
      {/* 1. CHAPTER 05 HEADING & ARCHIVAL OVERVIEW INTRO PANEL                */}
      {/* ==================================================================== */}
      <div className="honor-chapter-header">
        {/* Archival Eyebrow Tag with Red Horizontal Brushstroke */}
        <div ref={eyebrowRef} className="honor-chapter-eyebrow">
          <span className="chapter-eyebrow-ink-bar" aria-hidden="true" />
          <span className="chapter-num-badge">CHAPTER 05</span>
          <span className="chapter-eyebrow-line" />
          <span className="chapter-eyebrow-kanji">名誉の継承</span>
          <span className="chapter-eyebrow-seal" aria-hidden="true">継</span>
        </div>

        {/* Master Redesigned Display Heading with Word Stagger */}
        <h3 className="honor-chapter-title legacy-display-heading">
          {headingWords.map((word, wIdx) => {
            const isLast = wIdx === headingWords.length - 1;
            const isHonor = word === 'HONOR';
            return (
              <span key={word} className="heading-word-clip">
                <span
                  ref={(elem) => (headingWordsRef.current[wIdx] = elem)}
                  className={`heading-stagger-word ${isHonor ? 'word-honor-accent' : ''}`}
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
        <div ref={underlineRef} className="legacy-heading-brush-underline" aria-hidden="true" />

        {/* Archival Intro Text Box (Japanese Manuscript Style) */}
        <div ref={introPanelRef} className="honor-chapter-intro-panel">
          <div className="intro-panel-ink-accent" aria-hidden="true" />
          <div className="intro-panel-header">
            <span className="intro-hanko-seal" aria-hidden="true">継</span>
            <span className="intro-kicker-text">ARCHIVAL CODEX · 名誉の継承</span>
            <span className="intro-gold-seam" aria-hidden="true" />
          </div>
          <p className="honor-chapter-desc">
            The feudal era of warlords and armor has receded into memory, but the spirit of{' '}
            <em>Meiyo</em> did not vanish. It transformed, infusing modern craftsmanship, daily
            courtesy, and inner resilience across contemporary life.
          </p>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. THREE ASYMMETRICAL WASHI-PAPER MANUSCRIPTS                        */}
      {/* ==================================================================== */}
      <div className="honor-legacy-manuscripts-grid" role="region" aria-label="Three Pillars of Modern Cultural Influence">
        {pillars.map((p, idx) => (
          <HonorLegacyManuscript
            key={p.num}
            num={p.num}
            kanji={p.kanji}
            title={p.title}
            subtitle={p.subtitle}
            desc={p.desc}
            tag={p.tag}
            sealChar={p.sealChar}
            accentSvg={p.accentSvg}
            delay={idx * 0.16}
            foldAngle={16}
            className={`legacy-manuscript-item item-index-${idx}`}
          />
        ))}
      </div>

      {/* ==================================================================== */}
      {/* 3. CINEMATIC SUMI-E CLOSING MEDITATION QUOTATION PANEL               */}
      {/* ==================================================================== */}
      <div ref={quotePanelRef} className="honor-legacy-closing-manuscript">
        <div className="closing-manuscript-surface">
          {/* Organic Sumi-e Background SVG Stroke */}
          <div ref={quoteBrushRef} className="closing-brush-bg-layer" aria-hidden="true">
            <svg
              className="closing-brush-svg"
              viewBox="0 0 1000 120"
              preserveAspectRatio="none"
            >
              <path d={BRUSH_BANNER_PATH} fill="#141518" />
              <path d={BRUSH_BANNER_STREAK_1} fill="#1D1F24" opacity="0.4" />
            </svg>
          </div>

          {/* Antique Brass Corner Brackets */}
          <span className="manuscript-bracket-corner top-left" aria-hidden="true" />
          <span className="manuscript-bracket-corner top-right" aria-hidden="true" />
          <span className="manuscript-bracket-corner bottom-left" aria-hidden="true" />
          <span className="manuscript-bracket-corner bottom-right" aria-hidden="true" />

          {/* Protected Content Area */}
          <div className="closing-manuscript-inner">
            {/* Top Seal & Heading Row */}
            <div className="closing-header-row">
              <div ref={quoteSealRef} className="closing-hanko-pod">
                <span className="closing-cinnabar-hanko" aria-hidden="true">名誉</span>
                <span className="closing-jp-kanji-sub">至誠にして動かざる者なし</span>
              </div>
              <div className="closing-gold-seam" aria-hidden="true" />
              <span className="closing-kicker-tag">PHILOSOPHICAL CODEX · 遺訓</span>
            </div>

            {/* Main Quotation Body */}
            <div ref={quoteTextRef} className="closing-quote-body">
              <span className="closing-quote-glyph-mark" aria-hidden="true">“</span>
              <blockquote className="closing-quote-statement">
                Honor is not an antique blade locked behind museum glass, nor is it a title bestowed
                by emperors. It is the silent, unyielding dignity of every choice made when nobody is
                watching. It is lived in stillness, in integrity, and in grace.
              </blockquote>
            </div>

            {/* Attribution & Japanese Action Row */}
            <div ref={quoteAuthorRef} className="closing-footer-row">
              <cite className="closing-author-citation">
                <span className="citation-dot" />
                <span>BUSHIDO CHRONICLES · PHILOSOPHICAL CODEX · THE WAY OF MEIYO</span>
              </cite>

              {/* Redesigned Japanese Archival Action Button */}
              <button
                type="button"
                className="btn-honor-continue"
                onClick={handleNext}
                aria-label="Continue the journey to final legacy"
              >
                <span className="btn-text-primary">CONTINUE THE JOURNEY TO FINAL LEGACY</span>
                <span className="btn-text-jp" aria-hidden="true">最終章へ</span>
                <ArrowRight size={16} className="btn-arrow-icon" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Subtle Dissolve Seam into Next Section */}
        <div className="legacy-terminus-transition" aria-hidden="true">
          <span className="terminus-brush-line" />
          <span className="terminus-seal-badge">継承の結び · CODEX TERMINUS</span>
          <span className="terminus-brush-line" />
        </div>
      </div>
    </div>
  );
}
