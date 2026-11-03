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
import SectionHonor from './components/SectionHonor';
import SectionMonument from './components/SectionMonument';
import SectionDateMasamune from './components/SectionDateMasamune';
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
          {onlySection === 'honor' && <SectionHonor />}
          {onlySection === 'monument' && <SectionMonument />}
          {onlySection === 'masamune' && <SectionDateMasamune />}
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

        {/* SECTION 06: The Honor of the Samurai (武士の名誉 — Five-Chapter Immersive Chapter) */}
        <SectionHonor />

        {/* SECTION 07: The Guardians of History (楠木正成 — Bronze Equestrian Monument) */}
        <SectionMonument />

        {/* SECTION 08: The One-Eyed Dragon (伊達政宗 — Date Masamune at Aoba Castle) */}
        <SectionDateMasamune />

        {/* SECTION 09: Final Cinematic CTA & Luxury Editorial Footer */}
        <SectionCTA onExploreLegacy={handleExploreLegacy} />
      </main>
    </div>
  );
}
