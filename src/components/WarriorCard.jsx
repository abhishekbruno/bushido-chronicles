import React, { useRef, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import WarriorCharacter from './WarriorCharacter';

/**
 * WarriorCard — 英雄録カード (The Archival Samurai Manuscript Card)
 * -----------------------------------------------------------------------------
 * Completely reconstructed to match the approved vintage Japanese concept:
 *  - Archival double hairline borders with ornate brass corner brackets
 *  - 2.5D Living artwork viewport with Canvas cloth physics & glowing sun
 *  - Crisp vertical Japanese calligraphy (宮本 武蔵, etc.)
 *  - Refined typography: NO. 0X, Historical Era, Vintage Serif names
 *  - Moniker badge and historical philosophical quotation
 *  - Signature weapon archival note
 *  - Functional "VIEW DOSSIER ›" lacquer button with keyboard accessibility
 *  - Preserves complete dossier dialog interactions
 */
export default function WarriorCard({ warrior, index, onSelect }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        card.dataset.visible = String(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const handleCardClick = () => {
    sound.playSwordSlash();
    if (onSelect) onSelect(warrior);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!event.repeat) {
        handleCardClick();
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    sound.playBladeGlint();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <article
      ref={cardRef}
      className={`warrior-card interactive ${isHovered ? 'is-card-hovered' : ''}`}
      data-visible="false"
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`Historical Dossier for ${warrior.name} — ${warrior.title}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ '--card-accent': warrior.accentColor }}
    >
      <div className="warrior-card-inner">
        {/* Double Hairline Archival Frame & Brass Corner Accents */}
        <div className="card-archival-frame" aria-hidden="true">
          <span className="frame-corner top-left" />
          <span className="frame-corner top-right" />
          <span className="frame-corner bottom-left" />
          <span className="frame-corner bottom-right" />
        </div>

        {/* ============================================================ */}
        {/* TOP: LIVING 2.5D ARTWORK VIEWPORT (SUN, CHARACTER, CLOTH)    */}
        {/* ============================================================ */}
        <div className="warrior-art-box">
          <WarriorCharacter warrior={warrior} index={index} isHovered={isHovered} />
        </div>

        {/* ============================================================ */}
        {/* BOTTOM: ARCHIVAL HISTORICAL DOSSIER INFORMATION              */}
        {/* ============================================================ */}
        <div className="warrior-info-box">
          {/* Era / Number Identification Row */}
          <div className="warrior-era-row">
            <span className="warrior-index">NO. 0{index + 1}</span>
            <span className="warrior-era-text">{warrior.era}</span>
          </div>

          {/* Warrior Name (Editorial Display Serif) */}
          <h3 className="warrior-name">{warrior.name}</h3>

          {/* Warrior Subtitle / Moniker */}
          <div className="warrior-title-tag">{warrior.title}</div>

          {/* Philosophical Quotation / Reflection */}
          <p className="warrior-quote">“{warrior.quote}”</p>

          {/* Signature Equipment / Weapon Info */}
          <div className="warrior-weapon-info">
            <span className="weapon-text">{warrior.signatureWeapon}</span>
          </div>

          {/* Action Button: VIEW DOSSIER */}
          <div className="warrior-action-row">
            <button
              type="button"
              className="warrior-dossier-btn"
              tabIndex={-1} // card container itself handles tabIndex
              aria-hidden="true"
            >
              <span>VIEW DOSSIER</span>
              <ChevronRight size={14} className="btn-chevron" />
            </button>
          </div>
        </div>

        {/* Decorative Traditional Japanese Wave Watermark at Base */}
        <div className="card-bottom-watermark" aria-hidden="true" />
      </div>
    </article>
  );
}
