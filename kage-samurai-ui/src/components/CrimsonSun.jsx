import React, { useRef, useEffect } from 'react';
import { windSystem } from '../utils/windSystem';

/**
 * CrimsonSun (紅日 - Kōjitsu)
 * -----------------------------------------------------------------------------
 * Rich painted circular crimson sun positioned directly behind the Samurai warrior.
 * Color: #C72C35 with atmospheric radial halo, gentle breathing pulse,
 * and subtle wind responsiveness. Reconstructed from the reference poster.
 */
export default function CrimsonSun({ className = '', style = {} }) {
  const coronaRef = useRef(null);
  const coreRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId;
    const update = () => {
      const wind = windSystem.getState();
      const t = wind.time * 0.8;
      const breath = Math.sin(t) * 0.02 + 1;
      const glow = (0.4 + Math.sin(t * 1.2) * 0.06 + wind.gust * 0.12).toFixed(3);

      if (coreRef.current) {
        coreRef.current.style.transform = `scale(${breath.toFixed(4)})`;
      }
      if (coronaRef.current) {
        coronaRef.current.style.opacity = glow;
      }
      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className={`legacy-crimson-sun-root ${className}`} style={style} aria-hidden="true">
      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="legacy-sun-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Atmospheric Glow Filter */}
          <filter id="sunHaloGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="32" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Core Painted Crimson Gradient */}
          <radialGradient id="sunCoreGrad" cx="48%" cy="46%" r="56%">
            <stop offset="0%" stopColor="#D93640" />
            <stop offset="60%" stopColor="#C72C35" />
            <stop offset="90%" stopColor="#B02028" />
            <stop offset="100%" stopColor="#96151D" />
          </radialGradient>

          {/* Outer Atmospheric Corona Gradient */}
          <radialGradient id="sunCoronaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C72C35" stopOpacity="0.75" />
            <stop offset="65%" stopColor="#C72C35" stopOpacity="0.30" />
            <stop offset="85%" stopColor="#C72C35" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#C72C35" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Large Atmospheric Radial Corona */}
        <circle
          ref={coronaRef}
          cx="300"
          cy="300"
          r="285"
          fill="url(#sunCoronaGrad)"
          className="sun-corona-circle"
          filter="url(#sunHaloGlow)"
        />

        {/* 2. Painted Core Crimson Disc */}
        <g ref={coreRef} style={{ transformOrigin: '300px 300px' }} className="sun-core-group">
          <circle
            cx="300"
            cy="300"
            r="238"
            fill="url(#sunCoreGrad)"
            className="sun-core-circle"
          />

          {/* Organic hand-painted edge brush contour */}
          <circle
            cx="300"
            cy="300"
            r="238"
            stroke="#8A0D15"
            strokeWidth="3.5"
            strokeDasharray="40 12 24 16 50 10"
            fill="none"
            opacity="0.45"
          />
        </g>
      </svg>
    </div>
  );
}
