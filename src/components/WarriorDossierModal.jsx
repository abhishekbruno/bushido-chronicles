import React, { useState } from 'react';
import { X, BookOpen, Shield, Sword, Award, Calendar, Compass } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import { WashiBrushPanel, CrimsonBrushAccent } from './brushstroke';

/**
 * WarriorDossierModal
 * -----------------------------------------------------------------------------
 * Full-screen feudal archival record modal that opens when a warrior card is clicked.
 * Includes deep historical chronicles, verified vs mythical facts, weapons metallurgy,
 * and key campaigns timeline.
 */
export default function WarriorDossierModal({ warrior, onClose }) {
  const [activeTab, setActiveTab] = useState('facts');

  if (!warrior) return null;

  const handleTabChange = (tab) => {
    sound.playWoodenClick();
    setActiveTab(tab);
  };

  return (
    <div className="warrior-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="warrior-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ '--modal-accent': warrior.accentColor || '#D90416' }}
      >
        {/* Archival Modal Header */}
        <div className="modal-header">
          <div className="modal-header-meta">
            <span className="modal-tag">IMPERIAL ARCHIVES · KYOTO FEUDAL RECORD</span>
            <span className="modal-crest-kanji">{warrior.japanese}</span>
            <span className="modal-kanji-honorific">{warrior.kanjiHonorific || '武将'}</span>
          </div>
          <button
            className="modal-close-btn interactive"
            onClick={onClose}
            aria-label="Close warrior dossier"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body-scroll">
          {/* Hero Identity Strip */}
          <div className="modal-hero-strip">
            <div className="modal-title-group">
              <span className="modal-subtitle">{warrior.title}</span>
              <h2 className="modal-warrior-name">{warrior.name}</h2>
              <div className="modal-dates">
                <CrimsonBrushAccent variant="badge">
                  {warrior.era}
                </CrimsonBrushAccent>
              </div>
            </div>
            <div className="modal-hanko" title="Authentic Imperial Seal">
              <span>義</span>
            </div>
          </div>

          {/* Biographical Overview Card (TYPE B: Washi Brush-Frame Panel) */}
          <WashiBrushPanel className="modal-bio-card">
            <p>{warrior.bio}</p>
          </WashiBrushPanel>

          {/* Archival Tabs Navigation */}
          <div className="modal-tabs">
            <button
              className={`modal-tab ${activeTab === 'facts' ? 'active' : ''} interactive`}
              onClick={() => handleTabChange('facts')}
            >
              <BookOpen size={15} />
              <span>CHRONICLES & TACTICS</span>
            </button>

            <button
              className={`modal-tab ${activeTab === 'myths' ? 'active' : ''} interactive`}
              onClick={() => handleTabChange('myths')}
            >
              <Shield size={15} />
              <span>FACT VS. POPULAR MYTH</span>
            </button>

            <button
              className={`modal-tab ${activeTab === 'campaigns' ? 'active' : ''} interactive`}
              onClick={() => handleTabChange('campaigns')}
            >
              <Calendar size={15} />
              <span>KEY CAMPAIGNS</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="modal-tab-content">
            {activeTab === 'facts' && (
              <ul className="modal-facts-list">
                {warrior.verifiedFacts.map((fact, i) => (
                  <li key={i} className="fact-item">
                    <span className="fact-num">0{i + 1}</span>
                    <p>{fact}</p>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'myths' && (
              <div className="modal-myths-list">
                {warrior.legendVsMyth.map((item, i) => (
                  <div key={i} className="myth-card">
                    <div className="myth-split">
                      <p>{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="modal-campaigns-timeline">
                {(warrior.campaigns || [
                  { year: '1582', name: 'Battle of Strategic Turning Point', desc: 'Commanded forces with decisive tactical mastery.' },
                  { year: '1600', name: 'National Unification Campaign', desc: 'Reshaped feudal alliances across the realm.' },
                  { year: '1615', name: 'Final Decisive Stand', desc: 'Cemented legendary status in the annals of Bushido.' }
                ]).map((camp, i) => (
                  <div key={i} className="campaign-timeline-item">
                    <span className="campaign-year-pill">{camp.year}</span>
                    <div className="campaign-info">
                      <h4 className="campaign-name">{camp.name}</h4>
                      <p className="campaign-desc">{camp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weapon & Doctrine Footer Box */}
          <div className="modal-weapon-box">
            <div className="weapon-field">
              <span className="weapon-field-label">SIGNATURE WEAPON & STEEL</span>
              <span className="weapon-field-value">{warrior.signatureWeapon}</span>
            </div>
            <div className="weapon-field">
              <span className="weapon-field-label">MARTIAL DOCTRINE & PHILOSOPHY</span>
              <span className="weapon-field-value">{warrior.style}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

