import React, { useRef, useEffect } from 'react';
import { windSystem } from '../utils/windSystem';

/**
 * AnimatedGrass (風に揺れるススキ - Living Japanese Pampas Grass)
 * -----------------------------------------------------------------------------
 * Lush, atmospheric multi-layered Japanese grassland inspired by the reference poster.
 * Features:
 *  - Bold, calligraphic sumi-e grass blades with wide tapered bases
 *  - Pampas grass seed tassels (Susuki plumes)
 *  - 3 depth planes: Distant, Midground (overlapping warrior), Foreground
 *  - 60 FPS wind articulation driven by GlobalWindSystem
 */
export default function AnimatedGrass({ className = '', style = {}, isRevealed = true }) {
  const containerRef = useRef(null);
  const clusterRefs = useRef([]);

  // 42 distinct grass blade tufts across 1400px coordinate space
  const grassClusters = [
    // Layer 1: Distant / Back Row (0-13)
    { x: 30, y: 220, scale: 0.85, layer: 'back', phase: 0.2, flex: 0.8 },
    { x: 120, y: 218, scale: 0.90, layer: 'back', phase: 1.4, flex: 0.9 },
    { x: 210, y: 222, scale: 0.86, layer: 'back', phase: 2.1, flex: 0.85 },
    { x: 310, y: 216, scale: 0.92, layer: 'back', phase: 0.7, flex: 0.95 },
    { x: 410, y: 220, scale: 0.88, layer: 'back', phase: 3.2, flex: 0.88 },
    { x: 510, y: 218, scale: 0.90, layer: 'back', phase: 1.8, flex: 0.92 },
    { x: 610, y: 222, scale: 0.86, layer: 'back', phase: 2.7, flex: 0.86 },
    { x: 710, y: 215, scale: 0.94, layer: 'back', phase: 0.5, flex: 0.94 },
    { x: 810, y: 220, scale: 0.90, layer: 'back', phase: 3.8, flex: 0.89 },
    { x: 910, y: 218, scale: 0.92, layer: 'back', phase: 1.5, flex: 0.91 },
    { x: 1010, y: 222, scale: 0.88, layer: 'back', phase: 2.9, flex: 0.87 },
    { x: 1110, y: 216, scale: 0.90, layer: 'back', phase: 0.9, flex: 0.93 },
    { x: 1210, y: 220, scale: 0.87, layer: 'back', phase: 3.4, flex: 0.88 },
    { x: 1310, y: 217, scale: 0.91, layer: 'back', phase: 1.2, flex: 0.92 },

    // Layer 2: Midground Row (14-27) — overlaps samurai feet around x: 750-1050
    { x: 60, y: 236, scale: 1.18, layer: 'mid', phase: 0.8, flex: 1.3 },
    { x: 160, y: 232, scale: 1.24, layer: 'mid', phase: 2.4, flex: 1.4 },
    { x: 260, y: 238, scale: 1.12, layer: 'mid', phase: 1.1, flex: 1.25 },
    { x: 370, y: 230, scale: 1.28, layer: 'mid', phase: 3.5, flex: 1.5 },
    { x: 470, y: 235, scale: 1.20, layer: 'mid', phase: 0.3, flex: 1.35 },
    { x: 570, y: 232, scale: 1.26, layer: 'mid', phase: 1.9, flex: 1.42 },
    { x: 680, y: 236, scale: 1.22, layer: 'mid', phase: 2.8, flex: 1.38 },
    { x: 770, y: 230, scale: 1.32, layer: 'mid', phase: 0.6, flex: 1.48 }, // Feet overlap left
    { x: 860, y: 235, scale: 1.25, layer: 'mid', phase: 3.1, flex: 1.40 }, // Feet overlap center
    { x: 950, y: 232, scale: 1.28, layer: 'mid', phase: 1.7, flex: 1.44 }, // Feet overlap right
    { x: 1050, y: 238, scale: 1.18, layer: 'mid', phase: 2.5, flex: 1.32 },
    { x: 1150, y: 234, scale: 1.24, layer: 'mid', phase: 0.4, flex: 1.39 },
    { x: 1250, y: 237, scale: 1.16, layer: 'mid', phase: 2.2, flex: 1.34 },
    { x: 1350, y: 233, scale: 1.22, layer: 'mid', phase: 1.6, flex: 1.41 },

    // Layer 3: Foreground Tall Pampas Blades (28-41)
    { x: 20, y: 255, scale: 1.55, layer: 'front', phase: 1.2, flex: 2.1 },
    { x: 110, y: 250, scale: 1.68, layer: 'front', phase: 2.9, flex: 2.3 },
    { x: 220, y: 258, scale: 1.52, layer: 'front', phase: 0.4, flex: 1.95 },
    { x: 320, y: 248, scale: 1.74, layer: 'front', phase: 3.7, flex: 2.4 },
    { x: 440, y: 255, scale: 1.62, layer: 'front', phase: 1.5, flex: 2.2 },
    { x: 550, y: 250, scale: 1.70, layer: 'front', phase: 0.1, flex: 2.35 },
    { x: 670, y: 256, scale: 1.60, layer: 'front', phase: 2.3, flex: 2.15 },
    { x: 790, y: 248, scale: 1.78, layer: 'front', phase: 3.3, flex: 2.5 }, // Tall blade front of warrior
    { x: 890, y: 254, scale: 1.64, layer: 'front', phase: 0.7, flex: 2.25 },
    { x: 990, y: 250, scale: 1.72, layer: 'front', phase: 2.0, flex: 2.38 },
    { x: 1090, y: 258, scale: 1.56, layer: 'front', phase: 3.4, flex: 2.05 },
    { x: 1190, y: 252, scale: 1.66, layer: 'front', phase: 1.1, flex: 2.28 },
    { x: 1290, y: 256, scale: 1.58, layer: 'front', phase: 2.6, flex: 2.18 },
    { x: 1380, y: 250, scale: 1.65, layer: 'front', phase: 0.8, flex: 2.32 },
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId;

    const updatePhysics = () => {
      const wind = windSystem.getState();
      const t = wind.time;
      const windForce = wind.windX * (1 + wind.gust * 2.5);

      clusterRefs.current.forEach((el, idx) => {
        if (!el) return;
        const config = grassClusters[idx];
        if (!config) return;

        const sway = Math.sin(t * 1.8 + config.phase) * (2.4 * config.flex);
        const gustDeflection = windForce * (4.2 * config.flex);
        const totalAngle = (sway + gustDeflection).toFixed(2);

        el.style.transform = `rotate(${totalAngle}deg)`;
      });

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`legacy-animated-grass-root ${isRevealed ? 'is-revealed' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="legacy-grass-master-svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Deep Sumi-e Ground Wash Gradient */}
          <linearGradient id="grassGroundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1C1E22" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#121316" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#08080A" stopOpacity="1" />
            <stop offset="100%" stopColor="#020203" stopOpacity="1" />
          </linearGradient>

          {/* Bold Calligraphic Pampas Grass Blade Tuft Symbol */}
          <g id="grassTuftBlade">
            {/* Center Primary Blade - Wide tapering calligraphy stroke */}
            <path
              d="M 0 0
                 C 4 -35, 12 -75, 28 -120
                 C 32 -132, 28 -132, 22 -124
                 C 8 -82, 2 -40, -4 0 Z"
              fill="currentColor"
            />
            {/* Left Curving Blade */}
            <path
              d="M -3 0
                 C -8 -30, -22 -65, -38 -102
                 C -42 -108, -38 -109, -32 -104
                 C -16 -70, -6 -35, 2 0 Z"
              fill="currentColor"
            />
            {/* Right Arching Blade */}
            <path
              d="M 2 0
                 C 10 -25, 26 -58, 48 -88
                 C 53 -95, 49 -96, 44 -90
                 C 22 -62, 8 -30, -2 0 Z"
              fill="currentColor"
            />
            {/* Fine Sub-blade Accent */}
            <path
              d="M -1 0
                 C 2 -20, 6 -45, 12 -70
                 C 14 -76, 12 -76, 10 -72
                 C 4 -48, 1 -24, -2 0 Z"
              fill="currentColor"
              opacity="0.9"
            />
            {/* Susuki Pampas Grass Feather Seed Tassel */}
            <path
              d="M 22 -124
                 Q 32 -145, 45 -158
                 Q 35 -142, 26 -130"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M 26 -130
                 Q 38 -148, 52 -156
                 Q 40 -144, 30 -134"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>
        </defs>

        {/* 1. Rolling Dark Ground Horizon (Full Width) */}
        <path
          d="M 0 220
             C 240 210, 480 216, 720 224
             C 960 230, 1180 218, 1400 225
             L 1400 320 L 0 320 Z"
          fill="url(#grassGroundGrad)"
        />

        {/* 2. Layer 1: Distant Background Grass */}
        <g className="grass-plane-back" color="#1E2026">
          {grassClusters
            .filter((c) => c.layer === 'back')
            .map((c, i) => {
              const globalIdx = grassClusters.indexOf(c);
              return (
                <g key={`back-${i}`} transform={`translate(${c.x}, ${c.y}) scale(${c.scale})`}>
                  <g
                    ref={(el) => (clusterRefs.current[globalIdx] = el)}
                    style={{ transformOrigin: '0px 0px' }}
                  >
                    <use href="#grassTuftBlade" />
                  </g>
                </g>
              );
            })}
        </g>

        {/* 3. Layer 2: Mid-ground Grass (Overlaps Samurai Feet & Robes) */}
        <g className="grass-plane-mid" color="#101114">
          {grassClusters
            .filter((c) => c.layer === 'mid')
            .map((c, i) => {
              const globalIdx = grassClusters.indexOf(c);
              return (
                <g key={`mid-${i}`} transform={`translate(${c.x}, ${c.y}) scale(${c.scale})`}>
                  <g
                    ref={(el) => (clusterRefs.current[globalIdx] = el)}
                    style={{ transformOrigin: '0px 0px' }}
                  >
                    <use href="#grassTuftBlade" />
                  </g>
                </g>
              );
            })}
        </g>

        {/* 4. Layer 3: Foreground Tall Pampas Grass (Deep Jet Ink) */}
        <g className="grass-plane-front" color="#050506">
          {grassClusters
            .filter((c) => c.layer === 'front')
            .map((c, i) => {
              const globalIdx = grassClusters.indexOf(c);
              return (
                <g key={`front-${i}`} transform={`translate(${c.x}, ${c.y}) scale(${c.scale})`}>
                  <g
                    ref={(el) => (clusterRefs.current[globalIdx] = el)}
                    style={{ transformOrigin: '0px 0px' }}
                  >
                    <use href="#grassTuftBlade" />
                  </g>
                </g>
              );
            })}
        </g>
      </svg>
    </div>
  );
}
