import React from 'react';
import { ArrowRight } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import { WashiBrushPanel } from './brushstroke';

export default function HeroForegroundDock({ onEnterLegend, onExploreWarriors }) {
  return (
    <div className="hero-foreground-dock-container" aria-label="Hero navigation and calls to action">
      <WashiBrushPanel className="hero-dock-card">
        <p className="hero-philosophical-sub">
          In the stillness of the blade lies the courage of an immortal soul.
          Preserving the sacred code of Bushido, forged in silence and honor.
        </p>

        <div className="hero-button-row">
          <button
            className="btn btn-primary interactive"
            onClick={() => {
              sound.playSwordSlash();
              sound.playTaiko();
              onEnterLegend();
            }}
          >
            <span className="btn-ink-fill" />
            <span className="btn-text">ENTER THE LEGEND</span>
            <span className="btn-icon">
              <ArrowRight size={18} />
            </span>
          </button>

          <button
            className="btn btn-secondary interactive"
            onClick={() => {
              sound.playWoodenClick();
              onExploreWarriors();
            }}
          >
            <span className="btn-text">EXPLORE THE WARRIORS</span>
            <span className="btn-kanji">武将</span>
          </button>
        </div>
      </WashiBrushPanel>

      {/* Minimalist Continuous Scroll Indicator */}
      <div className="hero-scroll-prompt" aria-hidden="true">
        <span className="scroll-kanji-icon">下</span>
        <div className="scroll-track">
          <span className="scroll-runner" />
        </div>
        <span className="scroll-text-hint">SCROLL TO ENTER</span>
      </div>
    </div>
  );
}

