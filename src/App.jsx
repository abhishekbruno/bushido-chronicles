import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import SamuraiScene from './components/SamuraiScene';
import ScrollTransitions from './components/ScrollTransitions';
import SectionLegacy from './components/SectionLegacy';
import SectionBushido from './components/SectionBushido';
import SectionWarriors from './components/SectionWarriors';
import SectionBlade from './components/SectionBlade';
import SectionSpirit from './components/SectionSpirit';
import SectionCTA from './components/SectionCTA';
import SectionMonument from './components/SectionMonument';
import './styles.css';

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const onlySection = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('only') : null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const targetSection = params.get('section');
    if (targetSection) {
      setTimeout(() => {
        const el = document.getElementById(targetSection);
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }, 50);
    }
  }, []);

  if (onlySection) {
    return (
      <div className="samurai-app-root">
        <ScrollTransitions />
        <Navbar />
        <main className="main-content-flow" style={{ paddingTop: '70px' }}>
          {onlySection === 'hero' && (
            <SamuraiScene onEnterLegend={() => {}} onExploreWarriors={() => {}} />
          )}
          {onlySection === 'legacy' && <SectionLegacy />}
          {onlySection === 'bushido' && <SectionBushido />}
          {onlySection === 'warriors' && <SectionWarriors />}
          {onlySection === 'blade' && <SectionBlade />}
          {onlySection === 'forge' && <SectionBlade />}
          {onlySection === 'spirit' && <SectionSpirit />}
          {onlySection === 'monument' && <SectionMonument />}
          {onlySection === 'cta' && <SectionCTA onExploreLegacy={() => {}} />}
        </main>
      </div>
    );
  }

  const handleEnterLegend = () => {
    const legacyEl = document.getElementById('legacy');
    if (legacyEl) {
      legacyEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreWarriors = () => {
    const warriorsEl = document.getElementById('warriors');
    if (warriorsEl) {
      warriorsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreLegacy = () => {
    const bushidoEl = document.getElementById('bushido');
    if (bushidoEl) {
      bushidoEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="samurai-app-root">
      {/* 1. Cinematic Entrance Preloader with Sumi-e Brush Reveal */}
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* 3. GSAP ScrollTrigger Storytelling Transitions */}
      <ScrollTransitions />

      {/* 4. Minimalist Fixed Navigation Bar with Ambient Audio Engine */}
      <Navbar />

      <main className="main-content-flow">
        {/* HERO SECTION: The Exact Reconstructed Reference Artwork as Live Interactive Scene */}
        <SamuraiScene
          onEnterLegend={handleEnterLegend}
          onExploreWarriors={handleExploreWarriors}
        />

        {/* SECTION 01: The Samurai Legacy & Historical Eras */}
        <SectionLegacy />

        {/* SECTION 02: The Code of Bushido (The 7 Virtues) */}
        <SectionBushido />

        {/* SECTION 03: Legendary Warriors (Musashi, Nobunaga, Masamune, Yukimura) */}
        <SectionWarriors />

        {/* SECTION 04: The Art of the Blade (Interactive Katana Anatomy & Forging) */}
        <SectionBlade />

        {/* SECTION 05: The Spirit of Japan (Sacred Zen Landscapes & Haiku) */}
        <SectionSpirit />

        {/* SECTION 06: Dedicated monumental historical archive */}
        <SectionMonument />

        {/* SECTION 07: Final Cinematic CTA & Luxury Editorial Footer */}
        <SectionCTA onExploreLegacy={handleExploreLegacy} />
      </main>
    </div>
  );
}
