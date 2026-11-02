import React, { useEffect, useState } from 'react';
import { sound } from '../utils/soundEngine';

export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState('brush'); // 'brush' -> 'sun' -> 'fade' -> done
  const [hidden, setHidden] = useState(() => {
    return typeof window !== 'undefined' && window.location.search.includes('nopreloader');
  });

  useEffect(() => {
    if (hidden) {
      if (onComplete) onComplete();
      return;
    }

    // Stage 1: Brush stroke animation
    const t1 = setTimeout(() => {
      setPhase('sun');
    }, 450);

    // Stage 2: Sun and title expand
    const t2 = setTimeout(() => {
      setPhase('fade');
    }, 950);

    // Stage 3: Fade out preloader overlay
    const t3 = setTimeout(() => {
      setHidden(true);
      if (onComplete) onComplete();
    }, 1350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [hidden, onComplete]);

  if (hidden) return null;

  return (
    <div
      className={`cinematic-preloader ${phase === 'fade' ? 'fade-out' : ''}`}
      onClick={() => {
        setPhase('fade');
        setTimeout(() => {
          setHidden(true);
          if (onComplete) onComplete();
        }, 300);
      }}
    >
      <div className="preloader-sun-reveal">
        <div className={`preloader-crimson-sun ${phase === 'sun' || phase === 'fade' ? 'expanded' : ''}`} />
      </div>

      <div className="preloader-brush-stage">
        {/* Animated Sumi-e Brush Stroke SVG */}
        <svg
          className="preloader-brush-svg"
          viewBox="0 0 800 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="brush-path-wipe"
            d="M50 120 C 180 80, 320 160, 480 110 C 600 70, 700 130, 750 115"
            stroke="#0A0A0A"
            strokeWidth="38"
            strokeLinecap="round"
          />
        </svg>

        <div className="preloader-kanji-wrap">
          <span className="preloader-kanji">武士道</span>
          <span className="preloader-sub">BUSHIDO · THE WAY OF THE WARRIOR</span>
        </div>
      </div>

      <div className="preloader-skip-hint">CLICK ANYWHERE TO ENTER</div>
    </div>
  );
}

