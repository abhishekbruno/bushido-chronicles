import React, { useRef, useEffect } from 'react';
import { windSystem } from '../utils/windSystem';
import { sound } from '../utils/soundEngine';

/**
 * SakuraTree (桜と紅葉 - Classical Japanese Bonsai Masterpiece)
 * -----------------------------------------------------------------------------
 * Faithful botanical reconstruction matching the reference artwork (Image 2 & 4):
 * - Scalable SVG viewBox="0 0 735 1103"
 * - Rugged granite rock crag with multi-faceted planes and nebari root grip
 * - Ancient Bonsai trunk with dramatic muscular S-curves, deep bark fissures & knot hollow
 * - Interconnected fractal Bonsai branching with crooked knuckles & visible fine dark twigs
 * - Lush, airy blossom canopy with rich tonal depth, feathered edges, and negative space
 * - Serene misty mountain backdrop with distant sumi-e pines and soaring ink birds
 * - Dual Seasonal Modes: Spring Sakura (#F7D8DF, #EDA8BC, #D66B91) & Autumn Momiji
 * - Hierarchical 60 FPS wind physics synchronized with global windSystem
 * - Real-time falling canvas petals drifting on the wind
 */
export default function SakuraTree({
  mode = 'sakura', // 'sakura' | 'momiji'
  className = '',
  style = {},
  interactive = true,
  onToggleSeason,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Articulated Boughs for Wind Physics
  const trunkRef = useRef(null);
  const crownGroupRef = useRef(null);
  const leftBoughRef = useRef(null);
  const rightBoughRef = useRef(null);
  const lowRightRef = useRef(null);

  // 1. Hierarchical Wind Physics (60 FPS, Shared Wind System)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId;

    const updatePhysics = () => {
      const wind = windSystem.getState();
      const t = wind.time;
      const windForce = wind.windX * (1 + wind.gust * 2.2);

      // A. Trunk sway (solid anchor at nebari root base)
      if (trunkRef.current) {
        const trunkAngle = Math.sin(t * 0.7) * 0.18 + windForce * 0.2;
        trunkRef.current.style.transform = `rotate(${trunkAngle.toFixed(2)}deg)`;
      }

      // B. Crown foliage apex dome
      if (crownGroupRef.current) {
        const angle = Math.sin(t * 1.15 + 0.6) * 0.8 + windForce * 1.05;
        crownGroupRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      // C. Left arching bough
      if (leftBoughRef.current) {
        const angle = Math.sin(t * 1.05 + 0.3) * 0.9 + windForce * 1.0;
        leftBoughRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      // D. Right spreading bough
      if (rightBoughRef.current) {
        const angle = Math.sin(t * 1.25 + 1.4) * 1.0 + windForce * 1.2;
        rightBoughRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      // E. Low right drooping bough
      if (lowRightRef.current) {
        const angle = Math.sin(t * 1.35 + 2.1) * 1.1 + windForce * 1.3;
        lowRightRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 2. Real-Time Falling Petals/Leaves Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const petalCount = mode === 'momiji' ? 18 : 34;
    const petals = Array.from({ length: petalCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      size: Math.random() * 5 + 3.5,
      speedY: Math.random() * 0.75 + 0.45,
      speedX: Math.random() * 0.85 + 0.3,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.04,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.015,
      opacity: Math.random() * 0.45 + 0.45,
      tint:
        mode === 'momiji'
          ? ['#C71825', '#E62432', '#FF4D2E', '#9B111E', '#FFA726'][Math.floor(Math.random() * 5)]
          : ['#F7D8DF', '#F4C3D0', '#EDA8BC', '#E58CAB', '#FFFFFF'][Math.floor(Math.random() * 5)],
    }));

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.spin;
        p.flip += p.flipSpeed;

        if (p.y > height + 20) {
          p.y = -15;
          p.x = Math.random() * (width * 0.75);
        }
        if (p.x > width + 20) {
          p.x = -15;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(Math.cos(p.flip), 1);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.tint;

        if (mode === 'momiji') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.85, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.8, p.size * 0.8, -p.size * 0.3, p.size * 0.3, p.size * 0.7);
          ctx.quadraticCurveTo(0, p.size * 0.4, -p.size * 0.3, p.size * 0.7);
          ctx.bezierCurveTo(-p.size * 0.8, -p.size * 0.3, -p.size * 0.6, -p.size * 0.8, 0, -p.size);
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode]);

  const handleClickTree = () => {
    if (!interactive) return;
    if (mode === 'momiji') {
      sound.playWindWhistle();
    } else {
      sound.playBladeGlint();
    }
    sound.playWoodenClick();
    if (onToggleSeason) {
      onToggleSeason();
    }
  };

  const isMomiji = mode === 'momiji';

  return (
    <div
      ref={containerRef}
      className={`sakura-botanical-root ${className} season-${mode}`}
      style={style}
      onClick={handleClickTree}
      role="img"
      aria-label={
        isMomiji
          ? 'Classical Japanese Momiji Maple Tree on misty crag'
          : 'Classical Japanese Bonsai Sakura Tree on misty crag'
      }
    >
      <svg
        viewBox="0 0 735 1103"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="sakura-master-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* 1. Atmospheric Sky & Mountains */}
          <linearGradient id="sakuraMistySkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ECEEED" />
            <stop offset="28%" stopColor="#E2E5E4" />
            <stop offset="65%" stopColor="#D9DDDC" />
            <stop offset="100%" stopColor="#CBD1D0" />
          </linearGradient>

          <linearGradient id="farMountainPeakGrad" x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="#96A0A2" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#B0BABB" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#DCE0DF" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="midMountainRidgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#646D6E" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#828D8E" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#CED4D3" stopOpacity="0.12" />
          </linearGradient>

          {/* 2. Granite Crag & Surface */}
          <linearGradient id="graniteRockGrad" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#3F4348" />
            <stop offset="25%" stopColor="#2C3034" />
            <stop offset="55%" stopColor="#1B1E21" />
            <stop offset="85%" stopColor="#101214" />
            <stop offset="100%" stopColor="#08090A" />
          </linearGradient>

          <linearGradient id="rockHighlightFacet" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#6C7278" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#464A50" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#202326" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="rockMossWash" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#404A36" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#161A12" stopOpacity="0.0" />
          </linearGradient>

          {/* 3. Ancient Gnarled Bark */}
          <linearGradient id="barkCoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0A0807" />
            <stop offset="22%" stopColor="#1A1411" />
            <stop offset="55%" stopColor="#2A211B" />
            <stop offset="78%" stopColor="#16120E" />
            <stop offset="100%" stopColor="#050403" />
          </linearGradient>

          <linearGradient id="barkHighlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#554538" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#352B22" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#140F0B" stopOpacity="0.9" />
          </linearGradient>

          {/* 4. Sakura Blossom Volumetric Gradients */}
          <radialGradient id="sakuraDeepShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8A1842" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#B23460" stopOpacity="0.35" />
            <stop offset="85%" stopColor="#DB7B98" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#E8A1B6" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="sakuraLobeGrad1" cx="42%" cy="38%" r="58%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="25%" stopColor="#FDE6ED" stopOpacity="0.94" />
            <stop offset="60%" stopColor="#F5B4C7" stopOpacity="0.88" />
            <stop offset="85%" stopColor="#E58CAB" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#D66B91" stopOpacity="0.25" />
          </radialGradient>

          <radialGradient id="sakuraLobeGrad2" cx="48%" cy="44%" r="52%">
            <stop offset="0%" stopColor="#FFF2F6" stopOpacity="0.96" />
            <stop offset="30%" stopColor="#F8C7D7" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#EDA8BC" stopOpacity="0.8" />
            <stop offset="92%" stopColor="#D97296" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#B33B65" stopOpacity="0.1" />
          </radialGradient>

          <radialGradient id="sakuraSinglePetalGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E58CAB" />
            <stop offset="35%" stopColor="#F4C3D0" />
            <stop offset="75%" stopColor="#F7D8DF" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </radialGradient>

          {/* Single 5-Petal Notched Sakura Flower */}
          <g id="sakuraSingleFloret">
            {[0, 72, 144, 216, 288].map((angle, idx) => (
              <path
                key={idx}
                d="M 0 0
                   C -3.8 -7.5, -6.2 -12.5, -3.2 -16.5
                   C -1.6 -18.8, 0 -15.8, 1.6 -18.8
                   C 4.6 -15.8, 6.5 -12.5, 3.8 -7.5 Z"
                fill="url(#sakuraSinglePetalGrad)"
                transform={`rotate(${angle})`}
                stroke="rgba(214, 107, 145, 0.55)"
                strokeWidth="0.5"
              />
            ))}
            <circle cx="0" cy="0" r="3" fill="#BA3C67" />
            <circle cx="0" cy="0" r="1.3" fill="#FFE28A" />
            <g stroke="#C54E6D" strokeWidth="0.6" strokeLinecap="round" opacity="0.8">
              <line x1="0" y1="0" x2="-2" y2="-3.5" />
              <line x1="0" y1="0" x2="2.8" y2="-2.8" />
              <line x1="0" y1="0" x2="3.6" y2="1.8" />
              <line x1="0" y1="0" x2="-1" y2="3.6" />
              <line x1="0" y1="0" x2="-3.5" y2="1" />
            </g>
          </g>

          {/* Bouquet Cluster of Botanical Florets */}
          <g id="sakuraBouquetCluster">
            <ellipse cx="0" cy="0" rx="36" ry="24" fill="url(#sakuraDeepShadow)" />
            <use href="#sakuraSingleFloret" transform="translate(0, 0) scale(1.15)" />
            <use href="#sakuraSingleFloret" transform="translate(-16, -11) scale(0.92) rotate(22)" />
            <use href="#sakuraSingleFloret" transform="translate(18, -9) scale(1.02) rotate(48)" />
            <use href="#sakuraSingleFloret" transform="translate(-12, 14) scale(0.88) rotate(95)" />
            <use href="#sakuraSingleFloret" transform="translate(14, 12) scale(0.9) rotate(165)" />
            <use href="#sakuraSingleFloret" transform="translate(0, -19) scale(0.85) rotate(35)" />
            <use href="#sakuraSingleFloret" transform="translate(-24, 3) scale(0.78) rotate(-40)" />
            <use href="#sakuraSingleFloret" transform="translate(26, 4) scale(0.8) rotate(80)" />
            <use href="#sakuraSingleFloret" transform="translate(-32, -8) scale(0.68) rotate(-20)" />
            <use href="#sakuraSingleFloret" transform="translate(34, -4) scale(0.7) rotate(60)" />
            <circle cx="-28" cy="-15" r="3.2" fill="#D66B91" />
            <circle cx="30" cy="-16" r="2.8" fill="#BA3C67" />
            <circle cx="-20" cy="24" r="2.6" fill="#E58CAB" />
            <circle cx="22" cy="23" r="2.8" fill="#D66B91" />
          </g>

          {/* Classical Botanical Sakura Cloud Shelf */}
          <g id="sakuraCloudShelf">
            <ellipse cx="-35" cy="8" rx="48" ry="28" fill="url(#sakuraDeepShadow)" />
            <ellipse cx="38" cy="10" rx="50" ry="30" fill="url(#sakuraDeepShadow)" />
            <ellipse cx="0" cy="-16" rx="52" ry="34" fill="url(#sakuraDeepShadow)" />

            <ellipse cx="-52" cy="-6" rx="42" ry="30" fill="url(#sakuraLobeGrad2)" />
            <ellipse cx="50" cy="-8" rx="44" ry="32" fill="url(#sakuraLobeGrad2)" />
            <ellipse cx="0" cy="-30" rx="48" ry="36" fill="url(#sakuraLobeGrad1)" />
            <ellipse cx="-25" cy="14" rx="40" ry="28" fill="url(#sakuraLobeGrad2)" />
            <ellipse cx="28" cy="16" rx="38" ry="26" fill="url(#sakuraLobeGrad1)" />
            <ellipse cx="0" cy="0" rx="52" ry="35" fill="url(#sakuraLobeGrad1)" />

            {/* Exposed Fine Dark Twigs */}
            <g stroke="#14100E" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.95">
              <path d="M 0 28 Q -18 10, -36 -2 Q -55 -12, -72 -14" />
              <path d="M 0 24 Q 20 12, 42 4 Q 60 -6, 78 -8" />
              <path d="M -18 10 Q -12 -14, 0 -38" />
              <path d="M 20 12 Q 28 -8, 32 -30" />
            </g>

            {/* Layered Crisp Florets */}
            <use href="#sakuraBouquetCluster" transform="translate(-32, -14) scale(0.95)" />
            <use href="#sakuraBouquetCluster" transform="translate(34, -12) scale(0.98)" />
            <use href="#sakuraBouquetCluster" transform="translate(0, -28) scale(1.05)" />
            <use href="#sakuraBouquetCluster" transform="translate(-14, 12) scale(0.9)" />
            <use href="#sakuraBouquetCluster" transform="translate(22, 14) scale(0.88)" />

            {/* Feathered Edge Florets */}
            <use href="#sakuraSingleFloret" transform="translate(-75, -14) scale(0.88) rotate(24)" />
            <use href="#sakuraSingleFloret" transform="translate(80, -10) scale(0.9) rotate(-18)" />
            <use href="#sakuraSingleFloret" transform="translate(0, -52) scale(0.92) rotate(45)" />
            <use href="#sakuraSingleFloret" transform="translate(-55, 20) scale(0.8) rotate(-32)" />
            <use href="#sakuraSingleFloret" transform="translate(58, 18) scale(0.82) rotate(60)" />
          </g>

          {/* Autumn Momiji Maple Cloud */}
          <g id="momijiMapleLeaf">
            <path
              d="M 0 -22 C 2 -14 5 -8 11 -6 C 14 -8 17 -11 21 -13 C 20 -7 18 -3 21 0 C 26 -2 30 -5 34 -5 C 29 0 25 3 26 7 C 31 9 34 10 36 14 C 30 16 24 16 21 20 C 24 23 27 27 26 31 C 21 29 16 26 13 29 C 11 32 10 36 7 39 C 4 35 3 30 0 28 L 0 42 L -2 42 L -2 28 C -5 30 -6 35 -9 39 C -12 36 -13 32 -15 29 C -18 26 -23 29 -28 31 C -29 27 -26 23 -23 20 C -26 16 -32 16 -38 14 C -36 10 -33 9 -28 7 C -27 3 -31 0 -36 -5 C -32 -5 -28 -2 -23 0 C -20 -3 -22 -7 -23 -13 C -19 -11 -16 -8 -13 -6 C -7 -8 -4 -14 -2 -22 Z"
              fill="currentColor"
            />
          </g>

          <g id="momijiCloudShelf">
            <path
              d="M -85 10 C -105 -15, -80 -48, -52 -52 C -38 -65, -10 -72, 14 -70 C 40 -75, 72 -64, 88 -42 C 108 -24, 112 8, 95 28 C 78 45, 48 52, 16 48 C -20 55, -58 45, -78 26 Z"
              fill="#52070D"
            />
            <path
              d="M -75 -5 C -90 -26, -65 -55, -35 -58 C -16 -68, 16 -65, 42 -55 C 68 -48, 92 -24, 78 10 C 65 32, 28 40, -6 34 C -40 40, -70 26, -75 -5 Z"
              fill="#8F0B16"
            />
            <path
              d="M -60 -14 C -72 -36, -45 -58, -18 -55 C 8 -60, 32 -54, 58 -36 C 74 -15, 66 12, 40 26 C 18 32, -18 28, -45 15 Z"
              fill="#C71825"
            />
            <path
              d="M -42 -20 C -52 -40, -26 -55, 0 -50 C 24 -52, 45 -38, 42 -12 C 32 6, 0 16, -26 8 Z"
              fill="#E62432"
            />
            <g transform="translate(0, -58) scale(0.38)" color="#FF3A28"><use href="#momijiMapleLeaf" /></g>
            <g transform="translate(-32, -52) scale(0.36) rotate(-25)" color="#E62432"><use href="#momijiMapleLeaf" /></g>
            <g transform="translate(34, -52) scale(0.36) rotate(25)" color="#FF3A28"><use href="#momijiMapleLeaf" /></g>
            <g transform="translate(-64, -36) scale(0.33) rotate(-55)" color="#C71825"><use href="#momijiMapleLeaf" /></g>
            <g transform="translate(66, -34) scale(0.33) rotate(55)" color="#E62432"><use href="#momijiMapleLeaf" /></g>
            <g transform="translate(-85, -10) scale(0.3) rotate(-85)" color="#8F0B16"><use href="#momijiMapleLeaf" /></g>
            <g transform="translate(86, -8) scale(0.3) rotate(85)" color="#FF5238"><use href="#momijiMapleLeaf" /></g>
          </g>

          {/* Sumi-e Pine & Shrub */}
          <g id="distantSumiPine">
            <path d="M 0 0 L 0 -110" stroke="#1D2220" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="-20" cy="-28" rx="26" ry="9" fill="#1F2522" />
            <ellipse cx="22" cy="-35" rx="28" ry="10" fill="#222825" />
            <ellipse cx="-16" cy="-52" rx="23" ry="8" fill="#262D2A" />
            <ellipse cx="18" cy="-60" rx="24" ry="8" fill="#2A312E" />
            <ellipse cx="-10" cy="-78" rx="18" ry="7" fill="#303835" />
            <ellipse cx="12" cy="-82" rx="18" ry="7" fill="#323A37" />
            <ellipse cx="0" cy="-98" rx="15" ry="6" fill="#38403C" />
          </g>

          <g id="bareWinterShrub">
            <path d="M 0 0 C -6 -18, -12 -35, -8 -50" stroke="#222728" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M -8 -22 C -18 -34, -28 -42, -34 -55" stroke="#222728" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M -6 -32 C 8 -42, 16 -52, 20 -65" stroke="#222728" strokeWidth="2" strokeLinecap="round" />
            <path d="M -18 -34 C -12 -46, -10 -58, -12 -70" stroke="#222728" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 8 -42 C 6 -56, 10 -68, 8 -78" stroke="#222728" strokeWidth="1.6" strokeLinecap="round" />
          </g>

          <g id="sumiInkBird">
            <path d="M 0 0 C -4 -5, -10 -7, -16 -4 C -11 -2, -6 -1, 0 0 Z" fill="#181B19" />
            <path d="M 0 0 C 4 -5, 10 -7, 16 -4 C 11 -2, 6 -1, 0 0 Z" fill="#181B19" />
            <ellipse cx="0" cy="1.2" rx="1.5" ry="2.8" fill="#0E100F" />
          </g>
        </defs>

        {/* ================================================================ */}
        {/* LAYER 0: MISTY MOUNTAIN LANDSCAPE & SKY                          */}
        {/* ================================================================ */}
        <g id="LandscapeAtmosphere">
          <rect width="735" height="1103" fill="url(#sakuraMistySkyGrad)" />

          {/* Jagged Mountain Peak on Left/Center */}
          <path
            d="M 0 540
               C 35 430, 85 310, 150 240
               C 170 220, 190 245, 215 290
               C 245 350, 290 440, 350 510
               C 410 580, 480 640, 540 720
               L 540 920
               L 0 920 Z"
            fill="url(#midMountainRidgeGrad)"
          />

          {/* Distant Alpine Peak on Upper Right */}
          <path
            d="M 280 620
               C 360 480, 460 320, 550 210
               C 590 160, 630 190, 670 280
               C 700 350, 735 460, 735 600
               L 735 900
               L 280 900 Z"
            fill="url(#farMountainPeakGrad)"
          />

          {/* Layered Mist Streams */}
          <path
            d="M 0 490 Q 220 440, 420 490 T 735 460 L 735 640 Q 480 600, 240 630 T 0 610 Z"
            fill="#EDF1F0"
            opacity="0.82"
            filter="blur(18px)"
          />
          <path
            d="M 50 620 Q 280 570, 510 615 T 735 590 L 735 730 Q 470 700, 220 725 T 50 710 Z"
            fill="#E2E7E5"
            opacity="0.75"
            filter="blur(22px)"
          />

          {/* Soaring Ink Birds (Faithful positions) */}
          <g transform="translate(88, 355) scale(0.95)" className="sakura-bg-bird">
            <use href="#sumiInkBird" />
          </g>
          <g transform="translate(268, 248) scale(0.85)" className="sakura-bg-bird">
            <use href="#sumiInkBird" />
          </g>
          <g transform="translate(306, 282) scale(0.72)" className="sakura-bg-bird">
            <use href="#sumiInkBird" />
          </g>

          {/* Distant Bare Winter Shrub on Far Left Ground */}
          <g transform="translate(85, 870) scale(0.95)" opacity="0.65">
            <use href="#bareWinterShrub" />
          </g>

          {/* Two Distant Sumi-e Pine Trees on Right Slope */}
          <g transform="translate(340, 800) scale(0.78)" opacity="0.62">
            <use href="#distantSumiPine" />
          </g>
          <g transform="translate(305, 700) scale(0.55)" opacity="0.48">
            <use href="#distantSumiPine" />
          </g>
        </g>

        {/* ================================================================ */}
        {/* LAYER 1: WEATHERED GRANITE CRAG & NEBARI ROOTS (y=760..1020)     */}
        {/* ================================================================ */}
        <g id="GraniteCragBase" className="sakura-rock-base">
          <path
            d="M 50 1025
               L 65 965
               L 95 910
               L 85 865
               L 125 815
               L 170 770
               L 235 758
               L 290 780
               L 355 805
               L 405 850
               L 442 915
               L 425 978
               L 438 1025 Z"
            fill="url(#graniteRockGrad)"
            stroke="#050607"
            strokeWidth="2.8"
          />

          {/* Facets & Shading */}
          <path d="M 125 815 L 170 770 L 235 758 L 220 825 L 160 855 Z" fill="url(#rockHighlightFacet)" />
          <path d="M 235 758 L 290 780 L 275 848 L 220 825 Z" fill="url(#rockHighlightFacet)" opacity="0.8" />
          <path d="M 290 780 L 355 805 L 338 870 L 275 848 Z" fill="url(#rockHighlightFacet)" opacity="0.6" />

          {/* Crevices */}
          <path d="M 125 815 L 165 865 L 192 935 L 185 1025" stroke="#030405" strokeWidth="3.2" fill="none" />
          <path d="M 235 758 L 268 830 L 302 892 L 325 1025" stroke="#030405" strokeWidth="3.4" fill="none" />
          <path d="M 85 865 L 138 890 L 162 975" stroke="#030405" strokeWidth="2.4" fill="none" opacity="0.8" />
          <path d="M 290 780 L 345 840 L 375 925" stroke="#030405" strokeWidth="2.6" fill="none" opacity="0.75" />
          <path d="M 355 805 L 400 865 L 420 945" stroke="#030405" strokeWidth="2.2" fill="none" opacity="0.7" />

          {/* Summit Moss */}
          <path
            d="M 125 815
               Q 180 758, 235 758
               Q 295 770, 355 805
               L 345 830
               Q 285 795, 230 785
               Q 175 785, 130 830 Z"
            fill="url(#rockMossWash)"
          />

          {/* Nebari Roots Clinging to Crevices */}
          <g id="NebariRootSystem" fill="url(#barkCoreGrad)">
            <path d="M 195 850 C 170 878, 140 918, 118 958 C 112 968, 116 974, 126 972 C 145 935, 175 890, 215 858 Z" />
            <path d="M 235 855 C 225 895, 232 945, 248 995 C 252 1005, 262 1005, 265 995 C 252 950, 248 900, 260 858 Z" />
            <path d="M 280 852 C 310 885, 348 925, 378 972 C 386 984, 396 978, 394 966 C 368 920, 332 880, 305 848 Z" />
          </g>
        </g>

        {/* ================================================================ */}
        {/* LAYER 2: DEEP UNDER-CANOPY BLOSSOMS (Behind the branches)        */}
        {/* ================================================================ */}
        <g id="DeepBackgroundCanopy" opacity="0.95">
          {/* Low-Left Shelf Base */}
          <g transform="translate(100, 520) scale(1.15) rotate(-10)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          {/* Mid-Left Shelf Base */}
          <g transform="translate(130, 410) scale(1.22) rotate(8)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          {/* Upper-Left Shelf Base */}
          <g transform="translate(170, 300) scale(1.28) rotate(-6)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          {/* Apex Dome Base */}
          <g transform="translate(270, 180) scale(1.35) rotate(14)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          {/* Upper-Right Canopy Base */}
          <g transform="translate(420, 260) scale(1.32) rotate(-8)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          {/* Mid-Right Canopy Base */}
          <g transform="translate(520, 360) scale(1.28) rotate(12)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          {/* Lower-Right Weeping Base */}
          <g transform="translate(500, 520) scale(1.18) rotate(18)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
        </g>

        {/* ================================================================ */}
        {/* LAYER 3: GNARLED BONSAI S-CURVE TRUNK & ARTICULATED BOUGHS       */}
        {/* ================================================================ */}
        <g ref={trunkRef} id="BonsaiMainTrunk" style={{ transformOrigin: '245px 850px' }}>
          {/* Main Dramatic Contorted S-Curved Muscular Trunk Body */}
          <path
            d="M 200 850
               C 205 810, 230 780, 245 760
               C 260 740, 230 700, 190 670
               C 165 650, 175 605, 205 570
               C 220 550, 230 520, 235 480
               L 280 470
               C 275 510, 270 540, 280 560
               C 295 590, 265 630, 240 655
               C 220 675, 270 710, 310 745
               C 335 770, 315 815, 290 850 Z"
            fill="url(#barkCoreGrad)"
            stroke="#040303"
            strokeWidth="3.2"
          />

          {/* S-Curving Longitudinal Bark Grooves & Wood Fibers */}
          <g stroke="url(#barkHighlightGrad)" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 220 848 C 225 808, 248 778, 260 758 C 275 738, 248 698, 212 668 C 190 648, 198 605, 224 570 C 238 550, 246 520, 250 480" />
            <path d="M 240 845 C 245 805, 270 772, 282 752 C 298 732, 270 692, 235 662 C 212 642, 220 598, 248 565 C 262 545, 268 515, 272 478" />
            <path d="M 208 845 C 212 812, 235 785, 248 765 C 255 750, 230 712, 198 680 C 178 660, 185 620, 210 585 C 222 568, 232 535, 238 495" opacity="0.8" />
          </g>

          {/* Ancient Knot Hollow (Uro) nestled into the S-bend */}
          <ellipse cx="238" cy="620" rx="9" ry="18" transform="rotate(-18, 238, 620)" fill="#020101" />
          <path d="M 226 602 C 220 622, 224 642, 236 652" stroke="#524335" strokeWidth="2.4" fill="none" opacity="0.85" />
          <path d="M 248 598 C 255 618, 252 638, 244 648" stroke="#3D3228" strokeWidth="1.8" fill="none" opacity="0.75" />

          {/* ============================================================== */}
          {/* 6 MASTER BONSAI BOUGHS (Crooked, Jagged Tapering & Fine Twigs) */}
          {/* ============================================================== */}

          {/* BOUGH 1: Low-Left Sweeping Bough */}
          <g ref={leftBoughRef} style={{ transformOrigin: '235 480' }}>
            <path
              d="M 235 485
                 C 210 495, 185 515, 165 540
                 C 145 560, 120 555, 95 538"
              stroke="#080605"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M 165 540 C 145 568, 120 580, 88 588" stroke="#0D0907" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 120 555 C 105 535, 85 522, 58 512" stroke="#0D0907" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 88 588 Q 70 598, 48 592" stroke="#120E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 58 512 Q 42 502, 28 506" stroke="#120E0B" strokeWidth="2.6" strokeLinecap="round" fill="none" />
            <path d="M 95 538 Q 78 548, 58 542" stroke="#120E0B" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </g>

          {/* BOUGH 2: Mid-Left Jagged Bonsai Branch */}
          <g style={{ transformOrigin: '240 460' }}>
            <path
              d="M 240 460
                 C 215 442, 188 432, 162 412
                 C 140 396, 118 392, 90 386"
              stroke="#080605"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M 188 432 C 168 412, 148 376, 126 352" stroke="#0D0907" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 162 412 C 146 438, 125 458, 100 472" stroke="#0D0907" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 126 352 Q 110 342, 92 336" stroke="#120E0B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 90 386 Q 74 382, 56 384" stroke="#120E0B" strokeWidth="2.6" strokeLinecap="round" fill="none" />
            <path d="M 100 472 Q 84 484, 68 480" stroke="#120E0B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>

          {/* BOUGH 3: Upper-Left Climbing Branch */}
          <g style={{ transformOrigin: '255 440' }}>
            <path
              d="M 255 440
                 C 242 400, 222 352, 198 312
                 C 182 286, 166 262, 142 236"
              stroke="#080605"
              strokeWidth="13"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M 222 352 C 212 322, 192 282, 182 252" stroke="#0D0907" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 198 312 C 188 332, 162 346, 138 356" stroke="#0D0907" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 142 236 Q 126 222, 110 216" stroke="#120E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 182 252 Q 166 242, 150 240" stroke="#120E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 138 356 Q 120 364, 102 360" stroke="#120E0B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>

          {/* BOUGH 4: Central Apex Crown Trunk & Dome Branches */}
          <g ref={crownGroupRef} style={{ transformOrigin: '260 450' }}>
            <path
              d="M 260 450
                 C 266 392, 276 342, 272 292
                 C 266 252, 272 212, 262 172"
              stroke="#080605"
              strokeWidth="15"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M 276 342 C 296 312, 316 272, 312 232" stroke="#0D0907" strokeWidth="9.5" strokeLinecap="round" fill="none" />
            <path d="M 272 292 C 252 262, 236 232, 226 196" stroke="#0D0907" strokeWidth="7.5" strokeLinecap="round" fill="none" />
            <path d="M 262 172 C 276 146, 292 122, 306 102" stroke="#0D0907" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 312 232 Q 332 216, 350 206" stroke="#120E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 226 196 Q 212 182, 194 176" stroke="#120E0B" strokeWidth="2.6" strokeLinecap="round" fill="none" />
            <path d="M 306 102 Q 322 89, 340 86" stroke="#120E0B" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </g>

          {/* BOUGH 5: Main Right Arching Great Bough */}
          <g ref={rightBoughRef} style={{ transformOrigin: '275 460' }}>
            <path
              d="M 275 460
                 C 310 470, 350 480, 390 470
                 C 430 460, 470 440, 510 410
                 C 545 385, 575 355, 610 320"
              stroke="#080605"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M 390 470 C 410 430, 435 390, 460 350 C 480 320, 510 290, 535 260" stroke="#0D0907" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M 510 410 C 540 415, 580 410, 620 395 C 655 380, 685 360, 715 330" stroke="#0D0907" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M 610 320 Q 636 306, 660 296" stroke="#120E0B" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 535 260 Q 556 246, 580 238" stroke="#120E0B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 715 330 Q 736 320, 754 316" stroke="#120E0B" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </g>

          {/* BOUGH 6: Lower-Right Weeping Bough */}
          <g ref={lowRightRef} style={{ transformOrigin: '390 470' }}>
            <path
              d="M 430 460
                 C 455 490, 485 520, 520 540
                 C 555 560, 595 570, 630 575"
              stroke="#080605"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M 520 540 C 545 565, 575 585, 605 605" stroke="#0D0907" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 630 575 Q 656 580, 680 578" stroke="#120E0B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 605 605 Q 626 618, 650 622" stroke="#120E0B" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </g>
        </g>

        {/* ================================================================ */}
        {/* LAYER 4: FOREGROUND LUSH SAKURA CANOPY (Tiered Cloud Shelves)    */}
        {/* ================================================================ */}
        <g id="ForegroundCanopyClouds">
          {/* Tier 1: Low-Left Shelf */}
          <g transform="translate(80, 540) scale(1.08) rotate(10)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          <g transform="translate(50, 490) scale(0.92) rotate(-15)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>

          {/* Tier 2: Mid-Left Shelf */}
          <g transform="translate(110, 400) scale(1.15) rotate(6)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          <g transform="translate(85, 360) scale(0.98) rotate(-8)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>

          {/* Tier 3: Upper-Left Shelf */}
          <g transform="translate(150, 280) scale(1.22) rotate(14)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          <g transform="translate(125, 230) scale(1.05) rotate(-12)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>

          {/* Tier 4: Apex Crown Dome */}
          <g transform="translate(250, 160) scale(1.3) rotate(8)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          <g transform="translate(300, 100) scale(1.25) rotate(-10)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          <g transform="translate(340, 170) scale(1.2) rotate(18)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>

          {/* Tier 5: Upper-Right Canopy */}
          <g transform="translate(430, 240) scale(1.28) rotate(-6)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          <g transform="translate(500, 210) scale(1.22) rotate(15)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>

          {/* Tier 6: Far-Right Sweeping Canopy */}
          <g transform="translate(560, 320) scale(1.25) rotate(-8)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          <g transform="translate(630, 310) scale(1.18) rotate(12)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          <g transform="translate(690, 320) scale(1.05) rotate(22)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>

          {/* Tier 7: Lower-Right Weeping Shelf */}
          <g transform="translate(540, 480) scale(1.18) rotate(14)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          <g transform="translate(610, 560) scale(1.12) rotate(8)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
          <g transform="translate(640, 610) scale(0.98) rotate(18)">
            <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
          </g>
        </g>
      </svg>

      {/* 2. Real-Time Falling Petals Canvas */}
      <canvas ref={canvasRef} className="sakura-local-petals-canvas" />
    </div>
  );
}
