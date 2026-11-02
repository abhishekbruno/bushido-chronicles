import React, { useState, useEffect } from 'react';
import { Menu, X, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/soundEngine';

export default function Navbar({ activeSection, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);

      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (winHeight > 0) {
        setScrollProgress((offset / winHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { label: 'HOME', href: '#hero', kanji: '始' },
    { label: 'LEGACY', href: '#legacy', kanji: '遺' },
    { label: 'BUSHIDO', href: '#bushido', kanji: '道' },
    { label: 'WARRIORS', href: '#warriors', kanji: '武' },
    { label: 'THE BLADE', href: '#blade', kanji: '刀' },
    { label: 'SPIRIT', href: '#spirit', kanji: '魂' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    sound.playWoodenClick();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Scroll Reading Progress Line */}
      <div
        className="nav-scroll-progress"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      <header className={`navbar-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Brand Wordmark & Red Hanko Insignia */}
          <a
            href="#hero"
            className="navbar-brand interactive"
            onClick={(e) => handleLinkClick(e, '#hero')}
          >
            <span className="brand-insignia">
              <span className="insignia-kanji">武</span>
            </span>
            <span className="brand-text">
              SAMURAI<span className="brand-period">.</span>
              <small className="brand-sub">THE WAY OF THE WARRIOR</small>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="navbar-desktop-nav" aria-label="Main Navigation">
            <ul className="nav-links-list">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="nav-link-item interactive"
                    onClick={(e) => handleLinkClick(e, link.href)}
                  >
                    <span className="nav-item-kanji">{link.kanji}</span>
                    <span className="nav-item-label">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Action Group: Sound Synthesizer Toggle & Mobile Menu Button */}
          <div className="navbar-actions">
            {/* Audio Toggle with Animated Visualizer */}
            <button
              className={`sound-toggle-btn ${!isMuted ? 'is-playing' : ''} interactive`}
              onClick={toggleSound}
              aria-label={isMuted ? 'Unmute Japanese acoustic ambience' : 'Mute audio'}
              title={isMuted ? 'Enable ambient sound' : 'Mute sound'}
            >
              <div className="sound-visualizer-bars" aria-hidden="true">
                <span className="bar bar-1" />
                <span className="bar bar-2" />
                <span className="bar bar-3" />
              </div>
              <span className="sound-toggle-label">
                {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-menu-toggle interactive"
              onClick={() => {
                sound.playWoodenClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN EDITORIAL MOBILE NAVIGATION DRAWER */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-menu-paper-bg" />
        <div className="mobile-menu-container">
          <div className="mobile-menu-header">
            <div className="mobile-menu-brand">
              <span className="brand-insignia">
                <span className="insignia-kanji">武</span>
              </span>
              <span className="brand-text">SAMURAI.</span>
            </div>
            <button
              className="mobile-menu-close interactive"
              onClick={() => {
                sound.playWoodenClick();
                setMobileMenuOpen(false);
              }}
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>

          <div className="mobile-menu-links">
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                className="mobile-nav-link interactive"
                style={{ '--menu-delay': `${idx * 80}ms` }}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                <span className="mobile-link-index">0{idx + 1}</span>
                <span className="mobile-link-label">{link.label}</span>
                <span className="mobile-link-kanji">{link.kanji}</span>
              </a>
            ))}
          </div>

          <div className="mobile-menu-footer">
            <div className="mobile-creed">HONOR · DISCIPLINE · LEGACY</div>
            <div className="mobile-kanji-row">義 · 勇 · 仁 · 礼 · 誠 · 名誉 · 忠義</div>
          </div>
        </div>
      </div>
    </>
  );
}

