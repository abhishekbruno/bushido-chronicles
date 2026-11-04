import { assetUrl } from '../utils/assetUrl';
import { createArtworkLoop, damp } from '../utils/motion';
import React, { useRef, useEffect } from 'react';
import { windSystem } from '../utils/windSystem';

/**
 * MonumentGardenScene (皇居外苑 · 楠木正成 銅像)
 * -----------------------------------------------------------------------------
 * Museum-grade cinematic recreation of the historic bronze equestrian monument
 * of Kusunoki Masashige (楠木正成) at Tokyo Imperial Palace Outer Gardens.
 *
 * Visual Layers:
 *  1. Panoramic Washi Sky & Distant Mountain Ridges
 *  2. Living Celestial Crimson Sun with 8–12s atmospheric breathing halo
 *  3. Chidorigafuchi Moat with sun reflections & gentle water ripples
 *  4. Architectural Edo Castle Watchtower (Fujimi Yagura), stone ishigaki ramparts & pines
 *  5. Hero Bronze Equestrian Sculpture on stepped granite pedestal (strictly rigid & stationary)
 *  6. Ancient Gnarled Sakura Tree with pink blossoms framing the left foreground
 *  7. Real-Time Canvas Falling Sakura Petals with aerodynamic drag & wind drift
 *  8. Museum Exhibit Plaque Caption
 */

const SAKURA_EMITTERS = [
  { x: 0.08, y: 0.16 },
  { x: 0.14, y: 0.12 },
  { x: 0.18, y: 0.22 },
  { x: 0.22, y: 0.15 },
  { x: 0.27, y: 0.20 },
  { x: 0.15, y: 0.32 },
  { x: 0.22, y: 0.36 },
  { x: 0.30, y: 0.26 },
];

export default function MonumentGardenScene({ className = '', onMonumentClick }) {
  const canvasRef = useRef(null);

  // Real-Time Canvas Falling Sakura Petals Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 1200);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 680);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const sakuraColors = ['#FFFFFF', '#FDE4EB', '#F7C4D3', '#EFA8BD', '#E28CA5'];

    const spawnPetal = (isInitial = false) => {
      const anchor = SAKURA_EMITTERS[Math.floor(Math.random() * SAKURA_EMITTERS.length)];
      const sx = anchor.x * width + (Math.random() - 0.5) * 40;
      const sy = anchor.y * height + (Math.random() - 0.5) * 30;

      return {
        x: sx,
        y: isInitial ? sy + Math.random() * (height * 0.7) : sy,
        vx: Math.random() * 0.4 + 0.35,
        vy: Math.random() * 0.45 + 0.3,
        size: Math.random() * 3.5 + 4.5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.035,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.025 + 0.015,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.035 + 0.02,
        opacity: isInitial ? Math.random() * 0.5 + 0.45 : 0.0,
        targetOpacity: Math.random() * 0.35 + 0.6,
        color: sakuraColors[Math.floor(Math.random() * sakuraColors.length)],
        isSettling: false,
        dormant: isInitial ? 0 : Math.floor(Math.random() * 60),
      };
    };

    const activePetals = Array.from({ length: window.innerWidth < 640 ? 7 : 14 }, () => spawnPetal(true));

    const render = ({dt, reducedMotion}) => {
      const frames = dt * 60;
      ctx.clearRect(0, 0, width, height);
      const wind = windSystem?.getState?.() || { windX: 0.4, gust: 0 };
      const currentWindX = wind.windX * 0.85;

      for (let i = 0; i < (reducedMotion ? 0 : activePetals.length); i++) {
        const p = activePetals[i];

        if (p.dormant > 0) {
          p.dormant -= frames;
          continue;
        }

        if (p.opacity < p.targetOpacity && !p.isSettling) {
          p.opacity = Math.min(p.targetOpacity, p.opacity + 0.035 * frames);
        }

        p.vy = Math.min(1.4, p.vy + 0.012 * frames);
        p.vx = damp(p.vx, currentWindX, 1.83, dt);

        p.swayPhase += p.swaySpeed * frames;
        const flutter = Math.sin(p.swayPhase) * 0.5;

        p.x += (p.vx + flutter) * frames;
        p.y += p.vy * frames;
        p.angle += p.spin * frames;
        p.flip += p.flipSpeed * frames;

        if (p.y >= height * 0.82 && !p.isSettling) {
          p.isSettling = true;
        }

        if (p.isSettling) {
          p.vy *= 0.94 ** frames;
          p.vx *= 0.91 ** frames;
          p.opacity -= 0.016 * frames;
        }

        if (p.opacity <= 0 || p.y > height + 25 || p.x > width + 30) {
          activePetals[i] = spawnPetal(false);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(Math.max(0.2, Math.abs(Math.cos(p.flip))), 1);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);

        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.75, -s * 0.75, s * 0.9, s * 0.3, 0, s);
        ctx.bezierCurveTo(-s * 0.9, s * 0.3, -s * 0.75, -s * 0.75, 0, -s);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }


    };

    const stop = createArtworkLoop(canvas, render);

    return () => {
      stop();
      window.removeEventListener('resize', handleResize);

    };
  }, []);

  return (
    <div className={`bc-monument-scene-panoramic ${className}`} onClick={onMonumentClick}>
      {/* 1. MASTER SCENERY SVG (Sky, Sun, Mountains, Moat, Birds) */}
      <svg
        className="monument-scenery-svg"
        viewBox="0 0 1600 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Tokyo Imperial Palace Outer Gardens with celestial crimson sun, Chidorigafuchi moat, and ancient Sakura tree"
      >
        <defs>
          {/* Atmosphere Washi Sky */}
          <linearGradient id="monSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5EBDD" />
            <stop offset="35%" stopColor="#F0E3D1" />
            <stop offset="70%" stopColor="#E8D8C3" />
            <stop offset="100%" stopColor="#DDCCB3" />
          </linearGradient>

          {/* Crimson Sun Gradients */}
          <radialGradient id="monSunHaloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C41E28" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#C41E28" stopOpacity="0.22" />
            <stop offset="80%" stopColor="#C41E28" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#C41E28" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="monSunCoreGrad" cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#E22635" />
            <stop offset="38%" stopColor="#C81726" />
            <stop offset="76%" stopColor="#9C0F1A" />
            <stop offset="100%" stopColor="#6E0812" />
          </radialGradient>

          {/* Distant Ridge Shaders */}
          <linearGradient id="monMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A89D8E" stopOpacity="0.75" />
            <stop offset="65%" stopColor="#C2B7A6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DDD3C2" stopOpacity="0.05" />
          </linearGradient>

          {/* Imperial Moat Water Gradient */}
          <linearGradient id="monMoatWater" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5E6D65" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#45544C" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2A352F" stopOpacity="0.98" />
          </linearGradient>
        </defs>

        {/* 1A. Background Washi Canvas */}
        <rect width="1600" height="900" fill="url(#monSkyGrad)" />

        {/* 1B. Distant Musashi Plain Ridges */}
        <path
          d="M 0 540 Q 320 490, 680 520 T 1250 510 Q 1420 480, 1600 515 L 1600 750 L 0 750 Z"
          fill="url(#monMountainGrad)"
        />

        {/* 1C. Giant Weathered Crimson Sun with 8-12s Breathing Halo */}
        <g id="MonSunGroup" className="monument-sun-group">
          <circle
            cx="1080"
            cy="330"
            r="285"
            fill="url(#monSunHaloGrad)"
            className="monument-sun-halo-breathe"
          />
          <circle
            cx="1080"
            cy="330"
            r="220"
            fill="url(#monSunCoreGrad)"
            className="monument-sun-core"
          />

          {/* Sumi-e Cloud Drift Streaks Across Sun */}
          <path
            d="M 920 280 C 990 270, 1070 288, 1160 278 C 1240 268, 1300 288, 1350 280 C 1310 298, 1230 294, 1150 302 C 1070 310, 990 296, 920 280 Z"
            fill="#FAF2E3"
            opacity="0.32"
          />
          <path
            d="M 960 350 C 1030 342, 1100 358, 1200 348 C 1270 340, 1330 356, 1380 348 C 1340 366, 1260 362, 1180 370 C 1100 378, 1030 366, 960 350 Z"
            fill="#F6EBDB"
            opacity="0.25"
          />
        </g>

        {/* 1D. Tokyo Imperial Palace Moat (Chidorigafuchi) & Reflections */}
        <g id="ImperialMoat">
          <rect x="0" y="650" width="1600" height="250" fill="url(#monMoatWater)" />

          {/* Water Ripples & Crimson Sun Shimmer */}
          <ellipse cx="1080" cy="710" rx="160" ry="8" fill="#C41E28" opacity="0.18" />
          <ellipse cx="1070" cy="740" rx="130" ry="6" fill="#C41E28" opacity="0.12" />
          <ellipse cx="1090" cy="770" rx="90" ry="5" fill="#C41E28" opacity="0.08" />

          {/* Ambient Moat Ripple Lines */}
          <line x1="850" y1="680" x2="1350" y2="680" stroke="#7E8E85" strokeWidth="1.2" opacity="0.4" />
          <line x1="780" y1="705" x2="1420" y2="705" stroke="#7E8E85" strokeWidth="1" opacity="0.3" />
          <line x1="820" y1="735" x2="1390" y2="735" stroke="#7E8E85" strokeWidth="0.8" opacity="0.25" />
          <line x1="880" y1="770" x2="1320" y2="770" stroke="#7E8E85" strokeWidth="0.8" opacity="0.2" />
        </g>

        {/* 1E. Morning Mist Layers */}
        <g id="MorningMist" opacity="0.6">
          <rect x="0" y="610" width="1600" height="45" fill="#FAF2E3" opacity="0.5" className="monument-mist-drift-1" />
          <rect x="0" y="640" width="1600" height="35" fill="#F4EADB" opacity="0.4" className="monument-mist-drift-2" />
        </g>

        {/* 1F. Distant Soaring Birds across Sky */}
        <g className="monument-birds-flock" fill="#26231E" opacity="0.75">
          <path d="M 0 0 Q 7 -5, 14 -1 Q 21 -5, 28 0 Q 21 -2, 14 2 Q 7 -2, 0 0 Z" transform="translate(1360, 270) scale(0.9)" />
          <path d="M 0 0 Q 6 -4, 12 -1 Q 18 -4, 24 0 Q 18 -2, 12 2 Q 6 -2, 0 0 Z" transform="translate(1415, 255) scale(0.8)" />
          <path d="M 0 0 Q 6 -4, 12 -1 Q 18 -4, 24 0 Q 18 -2, 12 2 Q 6 -2, 0 0 Z" transform="translate(1460, 285) scale(0.75)" />
          <path d="M 0 0 Q 5 -3, 10 -1 Q 15 -3, 20 0 Q 15 -2, 10 2 Q 5 -2, 0 0 Z" transform="translate(1500, 265) scale(0.65)" />
        </g>
      </svg>

      {/* 2. EDO CASTLE WATCHTOWER & PINE RAMPARTS (High-Fidelity Right Midground) */}
      <div className="monument-castle-rampart-layer" aria-hidden="true">
        <img
          src={assetUrl('/images/kusunoki-castle-rampart.png?v=3')}
          alt="Edo Castle Fujimi Yagura watchtower and pine ramparts across the moat"
          className="monument-castle-rampart-img"
          loading="eager"
        />
      </div>

      {/* 3. THE MAGNIFICENT BRONZE EQUESTRIAN MONUMENT ON GRANITE PEDESTAL */}
      {/* Strictly rigid, stationary sculpture with authentic metallic reflections */}
      <div className="monument-statue-hero-anchor">
        <img
          src={assetUrl('/images/kusunoki-monument-statue.png?v=3')}
          alt="Bronze equestrian monument of Kusunoki Masashige on carved granite pedestal at Tokyo Imperial Palace"
          className="monument-statue-image"
          loading="eager"
        />
        {/* Contact Shadow beneath Pedestal */}
        <div className="monument-pedestal-shadow" aria-hidden="true" />
      </div>

      {/* 4. ANCIENT SAKURA TREE FRAMING THE LEFT FOREGROUND */}
      <div className="monument-sakura-tree-layer" aria-hidden="true">
        <img
          src={assetUrl('/images/kusunoki-sakura-tree.png?v=3')}
          alt="Ancient Sakura tree with blooming pink cherry blossoms framing the scene"
          className="monument-sakura-tree-img"
          loading="eager"
        />
      </div>

      {/* 5. Real-Time Canvas Falling Sakura Petals Overlay */}
      <canvas ref={canvasRef} className="monument-falling-petals-canvas" />

      {/* 6. Bottom Museum Exhibit Caption */}
      <div className="monument-museum-plaque-caption">
        <span className="caption-gold-text">楠木正成 銅像</span>
        <span className="caption-divider">·</span>
        <span>BRONZE EQUESTRIAN MONUMENT (1900)</span>
        <span className="caption-divider">·</span>
        <span>TOKYO IMPERIAL PALACE OUTER GARDENS</span>
      </div>
    </div>
  );
}
