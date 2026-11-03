import React, { useState } from 'react';
import { Check, ShieldCheck, Feather, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEngine';

/**
 * HonorPromise — 武士の誓い (The Warrior's Promise: The Six Inviolable Vows)
 * -----------------------------------------------------------------------------
 * CHAPTER 04 — An interactive ceremonial Japanese covenant scroll (Seishi 誓紙)
 * presenting six timeless tenets of honorable conduct.
 *
 * Readers can click each vow to affix a traditional vermilion cinnabar seal (Hanko),
 * verifying each principle in their own contemplative journey.
 */
export default function HonorPromise() {
  const [sealedVows, setSealedVows] = useState([0, 1]); // initial 2 sealed for demonstration
  const [isFullySealed, setIsFullySealed] = useState(false);

  const vows = [
    {
      id: 0,
      num: '第一条',
      kanji: '真実',
      title: 'THE UNSHEATHED TRUTH',
      subtitle: '無垢の真実 · Speak Without Deceit',
      verse: '“I shall speak with candor that needs no embellishment, guarding against flattering lies and expedient half-truths.”',
      reflection:
        'A warrior does not hide behind verbal ambiguity. When truth is uncomfortable, false silence is an act of cowardice. True honor demands clarity of speech, directness of intention, and refusal to deceive oneself or others.',
    },
    {
      id: 1,
      num: '第二条',
      kanji: '仁愛',
      title: 'THE SHIELD OF THE VULNERABLE',
      subtitle: '弱者の盾 · Strength in Service of Mercy',
      verse: '“Power unanchored to compassion is mere tyranny. My strength shall stand between peril and those without defense.”',
      reflection:
        'The blade was forged to preserve life, never to oppress it. The true measure of any martial training is not the foes struck down, but the weak protected from cruelty. Strength without compassion is a curse upon the world.',
    },
    {
      id: 2,
      num: '第三条',
      kanji: '克己',
      title: 'MASTERY OVER THE EGO',
      subtitle: '己に克つ · The Sovereign Self',
      verse: '“The fiercest adversary does not wait upon the battlefield; it resides in the pride of my own heart. I shall conquer myself daily.”',
      reflection:
        'Victory over ten thousand enemies is hollow if a man is still the slave of his vanity, anger, or appetite. The samurai practiced self-denial and rigorous discipline so that when danger arose, the ego remained silent.',
    },
    {
      id: 3,
      num: '第四条',
      kanji: '信義',
      title: 'WORD AS CARVED STONE',
      subtitle: '言霊の重み · The Inviolable Promise',
      verse: '“A promise is not a wind that disperses; it is an obligation sealed with my spirit. Once given, it shall not be broken.”',
      reflection:
        'In ancient Japan, contracts between warriors were sealed with a simple glance or quiet nod. A man whose word cannot be trusted has already surrendered his honor; he is a ghost masquerading among the living.',
    },
    {
      id: 4,
      num: '第五条',
      kanji: '散美',
      title: 'DIGNITY IN EVERY SEASON',
      subtitle: '散り際の美学 · Grace in Triumph and Loss',
      verse: '“Like the cherry blossom falling in its season, I shall embrace victory with humility and bear defeat without bitterness.”',
      reflection:
        'Pride in triumph is vulgar; despair in defeat is unseemly. The aesthetic of the falling blossom (Mono no Aware) teaches that all seasons pass. What matters is the elegance, courage, and dignity with which one meets both joy and sorrow.',
    },
    {
      id: 5,
      num: '第六条',
      kanji: '余韻',
      title: 'THE QUIET DEPARTURE',
      subtitle: '静寂の去り際 · Virtue Over Monuments',
      verse: '“I shall seek to leave behind righteous deeds rather than gilded monuments. What endures is the quiet memory of honor.”',
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

  return (
    <div className="honor-promise-experience">
      {/* Chapter 04 Header */}
      <div className="honor-chapter-header">
        <div className="honor-chapter-eyebrow">
          <span className="chapter-num-badge">CHAPTER 04</span>
          <span className="chapter-eyebrow-line" />
          <span className="chapter-eyebrow-kanji">武士の誓い</span>
        </div>
        <h3 className="honor-chapter-title">
          THE WARRIOR’S PROMISE<span className="title-crimson-dot">.</span>
        </h3>
        <p className="honor-chapter-desc">
          An original reflection on honorable conduct, cast in the tradition of feudal Japan’s
          sacred covenant scrolls (<em>Seishi</em> 誓紙). Click each seal to verify and meditate
          upon the six inviolable vows of the samurai spirit.
        </p>
      </div>

      {/* The Ceremonial Covenant Scroll Stage */}
      <div className="honor-scroll-document">
        <div className="scroll-paper-texture">
          {/* Scroll Header Seal */}
          <div className="scroll-top-seal-banner">
            <div className="scroll-seal-hanko">
              <span className="hanko-kanji">誓</span>
              <span className="hanko-kanji">紙</span>
            </div>
            <div className="scroll-seal-meta">
              <span className="scroll-archival-num">SACRED COVENANT · RECORD NO. 08</span>
              <h4 className="scroll-title">THE SIX INVIOLABLE VOWS OF CONDUCT</h4>
              <span className="scroll-subtitle">SEISHI JOMOKU · 誓紙条目 · PRESERVED FOR ETERNITY</span>
            </div>
            <div className="scroll-counter-badge">
              <span className="counter-num">{sealedVows.length} / 6</span>
              <span className="counter-label">SEALS AFFIXED</span>
            </div>
          </div>

          {/* Six Grid Vows */}
          <div className="scroll-vows-grid">
            {vows.map((vow) => {
              const isSealed = sealedVows.includes(vow.id);
              return (
                <div
                  key={vow.id}
                  className={`scroll-vow-card ${isSealed ? 'is-sealed' : ''}`}
                  onClick={() => handleToggleSeal(vow.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSealed}
                  title="Click to affix or release your personal seal"
                >
                  <div className="vow-header-row">
                    <div className="vow-article-tag">
                      <span className="article-kanji-num">{vow.num}</span>
                      <span className="article-title">{vow.title}</span>
                    </div>

                    {/* Interactive Vermilion Hanko Seal */}
                    <button
                      type="button"
                      className={`vow-hanko-seal ${isSealed ? 'active-stamp' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSeal(vow.id);
                      }}
                      aria-label={isSealed ? `Release seal for ${vow.title}` : `Affix seal for ${vow.title}`}
                    >
                      <span className="hanko-glyph">{vow.kanji}</span>
                      <span className="hanko-border-ring" />
                      {isSealed && <span className="hanko-verified-dot" />}
                    </button>
                  </div>

                  <div className="vow-sub-headline">{vow.subtitle}</div>
                  <p className="vow-verse-quote">{vow.verse}</p>
                  <p className="vow-reflection-text">{vow.reflection}</p>

                  <div className="vow-card-bottom-bar">
                    <span className="vow-status-text">
                      {isSealed ? (
                        <>
                          <Check size={12} className="text-crimson" /> SEALED IN SPIRIT
                        </>
                      ) : (
                        'CLICK TO AFFIX SEAL'
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Master Scroll Affirmation Bar */}
          <div className="scroll-affirmation-footer">
            <div className="affirmation-quote-block">
              <Feather size={20} className="text-crimson" />
              <p className="affirmation-text">
                “Honor is not an ornament worn for the admiration of others. It is the unyielding
                discipline of a solitary conscience, walking upright through storm and silence.”
              </p>
            </div>

            <div className="affirmation-action-group">
              <button
                type="button"
                className={`btn-seal-covenant ${isFullySealed ? 'is-complete' : ''}`}
                onClick={handleSealAll}
              >
                {isFullySealed ? (
                  <>
                    <ShieldCheck size={16} /> ALL SIX VOWS SEALED · 名誉完遂
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> SEAL THE ENTIRE COVENANT · 全条目捺印
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

