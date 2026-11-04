import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEngine';

gsap.registerPlugin(ScrollTrigger);

/**
 * HonorPromise — 武士の誓い (The Warrior's Promise: The Six Inviolable Vows)
 * Chapter 04 — Cinematic manuscript redesign with archival washi oath cards,
 * sumi-e closing panel, and GSAP ScrollTrigger reveal animations.
 * All original state, handlers, aria attributes, and sound calls are preserved.
 */
export default function HonorPromise() {
  const [sealedVows, setSealedVows] = useState([0, 1]); // initial 2 sealed for demonstration
  const [isFullySealed, setIsFullySealed] = useState(false);

  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const vows = [
    {
      id: 0,
      num: '第一条',
      kanji: '真実',
      title: 'THE UNSHEATHED TRUTH',
      subtitle: '無垢の真実 · Speak Without Deceit',
      verse: '\u201cI shall speak with candor that needs no embellishment, guarding against flattering lies and expedient half-truths.\u201d',
      reflection:
        'A warrior does not hide behind verbal ambiguity. When truth is uncomfortable, false silence is an act of cowardice. True honor demands clarity of speech, directness of intention, and refusal to deceive oneself or others.',
    },
    {
      id: 1,
      num: '第二条',
      kanji: '仁愛',
      title: 'THE SHIELD OF THE VULNERABLE',
      subtitle: '弱者の盾 · Strength in Service of Mercy',
      verse: '\u201cPower unanchored to compassion is mere tyranny. My strength shall stand between peril and those without defense.\u201d',
      reflection:
        'The blade was forged to preserve life, never to oppress it. The true measure of any martial training is not the foes struck down, but the weak protected from cruelty. Strength without compassion is a curse upon the world.',
    },
    {
      id: 2,
      num: '第三条',
      kanji: '克己',
      title: 'MASTERY OVER THE EGO',
      subtitle: '己に克つ · The Sovereign Self',
      verse: '\u201cThe fiercest adversary does not wait upon the battlefield; it resides in the pride of my own heart. I shall conquer myself daily.\u201d',
      reflection:
        'Victory over ten thousand enemies is hollow if a man is still the slave of his vanity, anger, or appetite. The samurai practiced self-denial and rigorous discipline so that when danger arose, the ego remained silent.',
    },
    {
      id: 3,
      num: '第四条',
      kanji: '信義',
      title: 'WORD AS CARVED STONE',
      subtitle: '言霊の重み · The Inviolable Promise',
      verse: '\u201cA promise is not a wind that disperses; it is an obligation sealed with my spirit. Once given, it shall not be broken.\u201d',
      reflection:
        'In ancient Japan, contracts between warriors were sealed with a simple glance or quiet nod. A man whose word cannot be trusted has already surrendered his honor; he is a ghost masquerading among the living.',
    },
    {
      id: 4,
      num: '第五条',
      kanji: '散美',
      title: 'DIGNITY IN EVERY SEASON',
      subtitle: '散り際の美学 · Grace in Triumph and Loss',
      verse: '\u201cLike the cherry blossom falling in its season, I shall embrace victory with humility and bear defeat without bitterness.\u201d',
      reflection:
        'Pride in triumph is vulgar; despair in defeat is unseemly. The aesthetic of the falling blossom (Mono no Aware) teaches that all seasons pass. What matters is the elegance, courage, and dignity with which one meets both joy and sorrow.',
    },
    {
      id: 5,
      num: '第六条',
      kanji: '余韻',
      title: 'THE QUIET DEPARTURE',
      subtitle: '静寂の去り際 · Virtue Over Monuments',
      verse: '\u201cI shall seek to leave behind righteous deeds rather than gilded monuments. What endures is the quiet memory of honor.\u201d',
      reflection:
        'Bronze statues weather and stone tablets crumble to dust, but the memory of a righteous deed ripples across generations. The honorable warrior lives without grasping for fame, departing quietly with a peaceful conscience.',
    },
  ];

  const handleToggleSeal = (idx) => {
    sound.playWoodenClick();
    setSealedVows((prev) => {
      const exists = prev.includes(idx);
      const updated = exists ? prev.filter((i) => i !== idx) : [...prev, idx];
      if (updated.length === vows.length) {
        sound.playBladeGlint();
        setIsFullySealed(true);
      } else {
        setIsFullySealed(false);
      }
      return updated;
    });
  };

  const handleSealAll = () => {
    sound.playTaiko();
    sound.playBladeGlint();
    setSealedVows([0, 1, 2, 3, 4, 5]);
    setIsFullySealed(true);
  };

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
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length === 0) return;

      // Row 1: cards 0–2 (bidirectional — scroll up re-hides, scroll down re-reveals)
      const row1Tl = gsap.timeline({ paused: true });
      row1Tl.fromTo(
        cards.slice(0, 3),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out' }
      );
      ScrollTrigger.create({
        trigger: cards[0],
        start: 'top 88%',
        end: 'top 10%',
        toggleActions: 'play reverse play reverse',
        animation: row1Tl,
      });

      // Row 2: cards 3–5 (bidirectional)
      if (cards[3]) {
        const row2Tl = gsap.timeline({ paused: true });
        row2Tl.fromTo(
          cards.slice(3, 6),
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out' }
        );
        ScrollTrigger.create({
          trigger: cards[3],
          start: 'top 90%',
          end: 'top 10%',
          toggleActions: 'play reverse play reverse',
          animation: row2Tl,
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="honor-promise-experience">
      {/* Chapter 04 Header */}
      <div className="honor-chapter-header">
        <div className="honor-chapter-eyebrow">
          <span className="chapter-num-badge">CHAPTER 04</span>
          <span className="chapter-eyebrow-line" />
          <span className="chapter-eyebrow-kanji">武士の誓い</span>
        </div>
        <h3 className="honor-chapter-title">
          THE WARRIOR'S PROMISE<span className="title-crimson-dot">.</span>
        </h3>
        <p className="honor-chapter-desc">
          An original reflection on honorable conduct, cast in the tradition of feudal Japan's
          sacred covenant scrolls (<em>Seishi</em> 誓紙). Click each seal to verify and meditate
          upon the six inviolable vows of the samurai spirit.
        </p>
      </div>

      {/* The Ceremonial Covenant Scroll Stage */}
      <div className="ms4-scroll-document">
        {/* Scroll Header */}
        <div className="ms4-scroll-header">
          <div className="ms4-header-hanko" aria-hidden="true">
            <span>誓</span>
            <span>紙</span>
          </div>
          <div className="ms4-header-meta">
            <span className="ms4-header-archival">SACRED COVENANT · RECORD NO. 08</span>
            <h4 className="ms4-header-title">THE SIX INVIOLABLE VOWS OF CONDUCT</h4>
            <span className="ms4-header-subtitle">SEISHI JOMOKU · 誓紙条目 · PRESERVED FOR ETERNITY</span>
          </div>
          <div className="ms4-counter-pod" aria-live="polite">
            <span className="ms4-counter-num">{sealedVows.length} / 6</span>
            <span className="ms4-counter-label">SEALS AFFIXED</span>
          </div>
        </div>

        {/* Six Oath Cards Grid */}
        <div className="ms4-oaths-grid">
          {vows.map((vow, idx) => {
            const isSealed = sealedVows.includes(vow.id);
            return (
              <div
                key={vow.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                className={`ms4-oath-card${isSealed ? ' ms4-sealed' : ''}`}
                onClick={() => handleToggleSeal(vow.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isSealed}
                title="Click to affix or release your personal seal"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleSeal(vow.id);
                  }
                }}
              >
                {/* Card Header */}
                <div className="ms4-card-header">
                  <div className="ms4-card-article">
                    <span className="ms4-card-num">{vow.num}</span>
                    <span className="ms4-card-title">{vow.title}</span>
                  </div>

                  {/* Interactive Vermilion Hanko Seal */}
                  <button
                    type="button"
                    className={`ms4-hanko-seal${isSealed ? ' ms4-seal-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSeal(vow.id);
                    }}
                    aria-label={isSealed ? `Release seal for ${vow.title}` : `Affix seal for ${vow.title}`}
                  >
                    <span className="ms4-hanko-glyph">{vow.kanji}</span>
                  </button>
                </div>

                {/* Card Content */}
                <div className="ms4-card-subtitle">{vow.subtitle}</div>
                <p className="ms4-card-verse">{vow.verse}</p>
                <p className="ms4-card-reflection">{vow.reflection}</p>

                {/* Card Footer Status */}
                <div className="ms4-card-footer">
                  <div className="ms4-card-status">
                    {isSealed ? (
                      <>
                        <Check size={12} />
                        SEALED IN SPIRIT
                      </>
                    ) : (
                      'CLICK TO AFFIX SEAL'
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sumi-e Closing Quotation Panel */}
        <div className="ms4-sumi-closing">
          <div className="ms4-sumi-quote-block">
            <div className="ms4-sumi-seal-row">
              <span className="ms4-sumi-hanko" aria-hidden="true">武士道</span>
              <div>
                <span className="ms4-sumi-label">MASTER CLOSING PRINCIPLE</span>
                <span className="ms4-sumi-jp-label"> · 武士道の要諦</span>
              </div>
            </div>
            <span className="ms4-sumi-quote-mark" aria-hidden="true">"</span>
            <p className="ms4-sumi-quote-text">
              Honor is not an ornament worn for the admiration of others. It is the unyielding
              discipline of a solitary conscience, walking upright through storm and silence.
            </p>
          </div>

          <div className="ms4-sumi-action-pod">
            <button
              type="button"
              className={`ms4-seal-btn${isFullySealed ? ' ms4-covenant-complete' : ''}`}
              onClick={handleSealAll}
            >
              {isFullySealed ? (
                <>
                  <ShieldCheck size={16} />
                  ALL SIX VOWS SEALED · 名誉完遂
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  SEAL THE ENTIRE COVENANT · 全条目捺印
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
