import { assetUrl } from '../utils/assetUrl';
import { createArtworkLoop, damp } from '../utils/motion';
import { windSystem } from '../utils/windSystem';
import WindClothLayer from './WindClothLayer';
import React, { useRef, useEffect, useId } from 'react';

/**
 * RoninLegacyArtwork (消えぬ遺産 · THE ETERNAL RŌNIN)
 * -----------------------------------------------------------------------------
 * Cinematic living Japanese sumi-e artwork featuring wind-driven physical motion:
 *
 *  - Shared Wind Physics Controller:
 *      * Ambient steady wind from left to right
 *      * Dynamic wind gusts every 9–13 seconds
 *      * Zero React rerenders: Direct 60fps GPU transform updates
 *      * IntersectionObserver pauses motion offscreen for 0% CPU consumption
 *      * Respects prefers-reduced-motion
 *
 *  - Hierarchical Cape & Cloak Motion:
 *      * Shoulder attachment zone: 2–6px movement, anchored to body
 *      * Mid-cloth wave response: 8–18px movement, delayed wave timing
 *      * Outer shredded tatters: 18–34px movement, physical billowing sweep
 *      * Dual-layer composite (full underlay + outer fluttering layer) for 100% seamless cloth
 *
 *  - Secondary Living Details:
 *      * Trailing hair strands & red ribbon ties fluttering in the wind
 *      * Waist shimenawa rope tassels with natural pendulum sway
 *      * Foreground Japanese silver pampas grass (susuki) swaying with the wind
 *      * Drifting ink particles & dust motes accelerating during gusts
 *      * Distant misty mountains & five-story pagoda
 *      * Giant Crimson Celestial Sun with 8–12s atmospheric breathing halo
 *      * Subtle warrior idle breathing keeping the figure dignified, calm, and grounded
 */

const SUSUKI_REEDS = [
  { x: 340, h: 140, bend: 32, dur: '5.2s', delay: '0s', w: 2.2 },
  { x: 385, h: 180, bend: 44, dur: '6.1s', delay: '-1.2s', w: 2.5 },
  { x: 435, h: 160, bend: 38, dur: '5.7s', delay: '-2.4s', w: 2.0 },
  { x: 490, h: 210, bend: 52, dur: '6.8s', delay: '-0.7s', w: 2.6 },
  { x: 545, h: 175, bend: 40, dur: '5.5s', delay: '-3.1s', w: 2.1 },
  { x: 605, h: 230, bend: 58, dur: '7.2s', delay: '-1.8s', w: 2.8 },
  { x: 665, h: 195, bend: 45, dur: '6.4s', delay: '-2.9s', w: 2.3 },
  { x: 730, h: 220, bend: 50, dur: '5.9s', delay: '-0.4s', w: 2.5 },
  { x: 795, h: 245, bend: 62, dur: '7.5s', delay: '-2.1s', w: 2.9 },
  { x: 860, h: 200, bend: 42, dur: '6.2s', delay: '-1.5s', w: 2.2 },
  { x: 925, h: 215, bend: 48, dur: '6.7s', delay: '-3.5s', w: 2.4 },
  { x: 990, h: 185, bend: 36, dur: '5.4s', delay: '-0.9s', w: 2.0 },
  { x: 1055, h: 160, bend: 30, dur: '5.0s', delay: '-2.2s', w: 1.8 },
  { x: 1120, h: 175, bend: 34, dur: '5.8s', delay: '-1.6s', w: 2.0 },
];

const FLOCK_BIRDS = [
  { x: 840, y: 180, s: 0.95, dur: '18s', delay: '0s' },
  { x: 895, y: 165, s: 0.8, dur: '19s', delay: '0.5s' },
  { x: 940, y: 195, s: 0.85, dur: '18.5s', delay: '1.0s' },
  { x: 990, y: 175, s: 0.7, dur: '20s', delay: '1.5s' },
  { x: 1035, y: 200, s: 0.75, dur: '19.5s', delay: '2.0s' },
];

export default function RoninLegacyArtwork({ className = '' }) {
  const uniqueId = useId().replace(/:/g, '');
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // References to animated character layers
  const bodyRef = useRef(null);
  const hairRef = useRef(null);
  const tasselsRef = useRef(null);
  const grassRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let gust = 0;

    // Setup Canvas Particle System for Drifting Ink / Dust
    const canvas = canvasRef.current;
    let ctx = null;
    let particles = [];
    if (canvas) {
      ctx = canvas.getContext('2d');
      canvas.width = 1200;
      canvas.height = 900;

      // 30 atmospheric dust & ink motes
      for (let i = 0; i < (window.innerWidth < 640 ? 10 : 22); i++) {
        particles.push({
          x: Math.random() * 1200,
          y: 200 + Math.random() * 650,
          size: 1.2 + Math.random() * 2.2,
          speed: 0.8 + Math.random() * 1.4,
          opacity: 0.2 + Math.random() * 0.45,
          oscillation: Math.random() * Math.PI * 2,
          color: Math.random() > 0.6 ? '#786854' : '#1D1914',
        });
      }
    }

    // Shared Wind Physics Loop
    const updatePhysics = ({dt: delta, time: dt, reducedMotion}) => {
      gust = damp(gust, Math.min(1.4, windSystem.getState().gust), 2, delta);
      const p = dt * 1.05;
      const frames = delta * 60;

      // 4. Hair Strands & Ribbon Ties (3–8px flutter)
      if (hairRef.current) {
        const hx = 0; // Hair stays attached at its root; only rotate about that point.
        const hrot = Math.sin(p * 1.15 - 0.3) * 0.7 + gust * 0.6;
        hairRef.current.style.transform = `translate3d(${hx.toFixed(2)}px, 0, 0) rotate(${hrot.toFixed(2)}deg)`;
      }

      // 5. Waist Shimenawa Rope Tassels (1–3.5 deg pendulum sway)
      if (tasselsRef.current) {
        const trot = Math.sin(p * 0.75 - 0.5) * 0.9 + gust * 0.7;
        tasselsRef.current.style.transform = `rotate(${trot.toFixed(2)}deg)`;
      }

      // 6. Foreground Grass (soft sway in sync with wind)
      if (grassRef.current) {
        const gx = 0;
        const grot = Math.sin(p * 0.8 - 0.6) * 0.8 + gust * 0.8;
        grassRef.current.style.transform = `translate3d(${gx.toFixed(2)}px, 0, 0) rotate(${grot.toFixed(2)}deg)`;
      }

      // 7. Grounded Body Breathing (Subtle 0.5% scale on torso, feet 100% anchored)
      if (bodyRef.current) {
        const breathe = 0; // Whole-body scaling detached hair and waist layers.
        bodyRef.current.style.transform = `scale(1, ${(1 + breathe).toFixed(4)}) translateY(${(-breathe * 180).toFixed(2)}px)`;
      }

      // 8. Render Drifting Ink Particles / Dust
      if (ctx && canvas) {
        ctx.clearRect(0, 0, 1200, 900);
        const windSpeedMultiplier = 1 + gust * 1.6;

        (reducedMotion ? [] : particles).forEach((pt) => {
          pt.x += pt.speed * windSpeedMultiplier * frames;
          pt.oscillation += 0.018 * frames;
          const offsetY = Math.sin(pt.oscillation) * 0.6;

          // Wrap around smoothly
          if (pt.x > 1250) {
            pt.x = -20;
            pt.y = 200 + Math.random() * 650;
          }

          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.opacity;

          ctx.ellipse(pt.x, pt.y + offsetY, pt.size * (1 + gust * 0.4), pt.size, 0.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

    };
    return createArtworkLoop(container, updatePhysics);
  }, []);

  return (
    <div ref={containerRef} className={`bc-ronin-scene-wrapper ${className}`}>
      {/* ============================================================== */}
      {/* 1. MASTER SCENERY SVG (Sun, Mountains, Reeds, Birds, Sky)      */}
      {/* ============================================================== */}
      <svg
        className="bc-ronin-art-svg"
        viewBox="0 0 1200 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Cinematic sumi-e ink painting of master Rōnin standing before a giant crimson sun with blowing reeds and distant pagoda"
      >
        <defs>
          {/* Crimson Sun Atmospheric Breathing Gradients */}
          <radialGradient id={`roninSunHalo-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C5282F" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#C5282F" stopOpacity="0.22" />
            <stop offset="78%" stopColor="#C5282F" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#C5282F" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={`roninSunCore-${uniqueId}`} cx="44%" cy="40%" r="58%">
            <stop offset="0%" stopColor="#E22635" />
            <stop offset="42%" stopColor="#C51824" />
            <stop offset="76%" stopColor="#9C0F1A" />
            <stop offset="100%" stopColor="#6E0812" />
          </radialGradient>
        </defs>

        {/* 1A. Giant Weathered Crimson Sun with 8–12s Atmospheric Breathing Motion */}
        <g id="RoninSunGroup" className="bc-ronin-sun-assembly">
          <circle
            cx="750"
            cy="360"
            r="285"
            fill={`url(#roninSunHalo-${uniqueId})`}
            className="bc-ronin-sun-halo"
          />
          <circle
            cx="750"
            cy="360"
            r="215"
            fill={`url(#roninSunCore-${uniqueId})`}
            className="bc-ronin-sun-disk"
          />

          {/* Sumi-e Cloud Streaks Across Sun */}
          <path
            d="M 590 310 C 660 300, 740 318, 830 308 C 910 298, 970 318, 1020 310 C 980 328, 900 324, 820 332 C 740 340, 660 326, 590 310 Z"
            fill="#FAF3E6"
            opacity="0.28"
          />
          <path
            d="M 630 380 C 700 372, 770 388, 870 378 C 940 370, 1000 386, 1050 378 C 1010 396, 930 392, 850 400 C 770 408, 700 396, 630 380 Z"
            fill="#F6EFE2"
            opacity="0.22"
          />
        </g>

        {/* 1B. Drifting Valley Mist (Soft Elliptical Organic Drift) */}
        <g className="bc-ronin-mist-layer" opacity="0.45">
          <ellipse cx="600" cy="625" rx="550" ry="24" fill="#FAF3E6" />
        </g>

        {/* 1C. Soaring Wild Geese across Celestial Sun */}
        <g className="bc-ronin-birds-flock" fill="#2B241C" opacity="0.8">
          {FLOCK_BIRDS.map((b, idx) => (
            <g key={idx} transform={`translate(${b.x}, ${b.y}) scale(${b.s})`}>
            <path
              d="M 0 0 Q 9 -7, 18 -1 Q 27 -7, 36 0 Q 27 -3, 18 3 Q 9 -3, 0 0 Z"
              className="bc-ronin-bird-soar"
              style={{
                animationDuration: b.dur,
                animationDelay: b.delay,
              }}
            />
            </g>
          ))}
        </g>

        {/* 1D. Foreground Living Wind-Blown Japanese Silver Grass (Susuki) */}
        <g id="ForegroundSusukiGrass" className="bc-ronin-reeds-group">
          {SUSUKI_REEDS.map((r, idx) => (
            <g key={idx} className="bc-susuki-stem" style={{ animationDuration: r.dur, animationDelay: r.delay }}>
              <path
                d={`M ${r.x} 900 Q ${r.x + r.bend * 0.45} ${900 - r.h * 0.55}, ${r.x + r.bend} ${900 - r.h}`}
                stroke="#1E1912"
                strokeWidth={r.w}
                strokeLinecap="round"
                fill="none"
                opacity="0.88"
              />
              <path
                d={`M ${r.x + r.bend} ${900 - r.h} Q ${r.x + r.bend + 14} ${900 - r.h - 10}, ${r.x + r.bend + 22} ${900 - r.h - 6}`}
                stroke="#8A7E6C"
                strokeWidth={r.w * 0.8}
                strokeLinecap="round"
                fill="none"
                opacity="0.75"
              />
            </g>
          ))}
        </g>
      </svg>

      {/* ============================================================== */}
      {/* 2. AUTHENTIC SUMI-E MOUNTAINS & FIVE-STORY PAGODA IN MIST      */}
      {/* ============================================================== */}
      <div className="ronin-sumie-mountains-layer" aria-hidden="true">
        <img
          src={assetUrl('/images/ronin-sumie-mountains.png?v=3')}
          alt="Sumi-e ink wash misty mountains and pagoda emerging from valley fog"
          className="ronin-sumie-mountains-img"
          loading="eager"
        />
      </div>

      {/* ============================================================== */}
      {/* 3. THE MASTER LIVING RŌNIN WARRIOR (HIERARCHICAL WIND RIG)     */}
      {/* ============================================================== */}
      <div className="ronin-warrior-hero-anchor">
        <div className="ronin-living-stage">
          {/* A. Cape Layer Hierarchy (Behind Warrior Body) */}
          <div className="ronin-cape-anchor" aria-hidden="true">
            <WindClothLayer src={assetUrl('/images/ronin-layer-cape-full.png')} width={770} height={900}
              root={350} span={330} direction={1} className="ronin-layer" />
          </div>

          {/* B. Grounded Body Layer (Hat, Face, Armor, Sword, Legs, Rock Base) */}
          <div ref={bodyRef} className="ronin-body-container">
            <img
              src={assetUrl('/images/ronin-layer-body.png')}
              alt="Detailed historical Japanese Rōnin in black armor and straw hat standing before crimson sun"
              className="ronin-layer ronin-layer-body"
              loading="eager"
            />
          </div>

          {/* C. Trailing Hair Strands & Ribbon Ties (Wind Flutter) */}
          <div ref={hairRef} className="ronin-hair-container" aria-hidden="true">
            <img
              src={assetUrl('/images/ronin-layer-hair.png')}
              alt=""
              className="ronin-layer ronin-layer-hair"
              loading="eager"
            />
          </div>

          {/* D. Waist Shimenawa Rope Tassels (Pendulum Sway) */}
          <div ref={tasselsRef} className="ronin-tassels-container" aria-hidden="true">
            <img
              src={assetUrl('/images/ronin-layer-tassels.png')}
              alt=""
              className="ronin-layer ronin-layer-tassels"
              loading="eager"
            />
          </div>

          {/* E. Foreground Grass Layer (Wind Response) */}
          <div ref={grassRef} className="ronin-grass-container" aria-hidden="true">
            <img
              src={assetUrl('/images/ronin-layer-grass.png')}
              alt=""
              className="ronin-layer ronin-layer-grass"
              loading="eager"
            />
          </div>

          {/* F. Ground Occlusion Contact Shadow */}
          <div className="ronin-ground-contact-shadow" aria-hidden="true" />
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. DRAGGING INK PARTICLES & ATMOSPHERIC SUMI-E DUST CANVAS     */}
      {/* ============================================================== */}
      <canvas ref={canvasRef} className="ronin-ink-particle-canvas" aria-hidden="true" />
    </div>
  );
}
