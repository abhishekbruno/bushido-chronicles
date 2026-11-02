import React, { useRef, useEffect } from 'react';
import { windSystem } from '../utils/windSystem';
import { sound } from '../utils/soundEngine';

/**
 * SakuraTree (桜と紅葉 - Master Sumi-e Japanese Tree Engine)
 * -----------------------------------------------------------------------------
 * Meticulously reconstructed from traditional Japanese ink-wash masterworks
 * and the botanical reference composition (References: Images 1, 2, and 4).
 *
 * Visual & Botanical Highlights:
 *  - Continuous, lush, unified canopy with deep volumetric layering
 *  - Gnarled, muscular S-curved trunk with knot holes, dry-brush grooves, and nebari roots
 *  - Natural Bonsai branching where dark limbs snake THROUGH the blossom clouds
 *  - Dual Seasonal Modes:
 *      * 'sakura': Dense cherry blossom clouds with soft pink, blush and white rosettes
 *      * 'momiji': Tiered scarlet Niwaki cloud shelves with 7-lobed Japanese maple leaves
 *  - Multi-tiered granite crag with shoreline reeds, moss, and sapling shrubs
 *  - Hierarchical 60 FPS wind articulation synchronized with windSystem
 *  - Falling canvas petals (Sakura) or tumbling autumn maple leaves (Momiji)
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

  // Articulated Branch References for Hierarchical Wind Physics
  const trunkRef = useRef(null);
  const crownGroupRef = useRef(null);
  const leftBoughRef = useRef(null);
  const rightBoughRef = useRef(null);
  const lowRightRef = useRef(null);

  // 1. Hierarchical Wind Articulation (60 FPS, Shared Wind System)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId;

    const updatePhysics = () => {
      const wind = windSystem.getState();
      const t = wind.time;
      const windForce = wind.windX * (1 + wind.gust * 2.2);

      // A. Trunk sway (solid anchor: 0.15–0.35°)
      if (trunkRef.current) {
        const trunkAngle = Math.sin(t * 0.7) * 0.25 + windForce * 0.3;
        trunkRef.current.style.transform = `rotate(${trunkAngle.toFixed(2)}deg)`;
      }

      // B. Crown foliage dome (0.6–1.4°)
      if (crownGroupRef.current) {
        const angle = Math.sin(t * 1.2 + 0.8) * 1.0 + windForce * 1.3;
        crownGroupRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      // C. Left arching bough (0.7–1.5°)
      if (leftBoughRef.current) {
        const angle = Math.sin(t * 1.1 + 0.3) * 1.1 + windForce * 1.2;
        leftBoughRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      // D. Right spreading bough (0.8–1.6°)
      if (rightBoughRef.current) {
        const angle = Math.sin(t * 1.3 + 1.5) * 1.2 + windForce * 1.4;
        rightBoughRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      // E. Low right drooping bough (0.9–1.8°)
      if (lowRightRef.current) {
        const angle = Math.sin(t * 1.4 + 2.4) * 1.3 + windForce * 1.5;
        lowRightRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 2. Local Falling Foliage Particles (Canvas 2.5D tumbling)
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

    const isMomiji = mode === 'momiji';
    const colors = isMomiji
      ? ['#A31D24', '#D62828', '#EA4A2A', '#E89A38', '#5E0E14']
      : ['#F7D8DF', '#F4C3D0', '#EDA8BC', '#E58CAB', '#D66B91'];

    const particles = [];
    const count = 18;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: (0.15 + Math.random() * 0.7) * width,
        y: (0.05 + Math.random() * 0.6) * height,
        originX: (0.2 + Math.random() * 0.6) * width,
        originY: (0.08 + Math.random() * 0.35) * height,
        vx: 0.5 + Math.random() * 1.0,
        vy: 0.6 + Math.random() * 1.0,
        size: isMomiji ? 4.5 + Math.random() * 3.5 : 3.5 + Math.random() * 3.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        tumble: Math.random() * Math.PI,
        tumbleSpeed: 0.03 + Math.random() * 0.045,
        opacity: 0.4 + Math.random() * 0.5,
        color: colors[i % colors.length],
        swayPhase: Math.random() * Math.PI * 2,
      });
    }

    let pAnimId;
    const renderParticles = () => {
      ctx.clearRect(0, 0, width, height);

      const wind = windSystem.getState();
      const windX = wind.windX * (1 + wind.gust * 2.0);

      particles.forEach((p) => {
        p.swayPhase += 0.035;
        p.rotation += p.rotSpeed;
        p.tumble += p.tumbleSpeed;

        const sway = Math.sin(p.swayPhase) * 1.4;
        p.x += (p.vx + windX * 1.8 + sway) * 0.85;
        p.y += (p.vy + Math.cos(p.swayPhase * 0.8) * 0.3) * 0.85;

        if (p.x > width + 30 || p.y > height + 20) {
          p.x = p.originX + (Math.random() - 0.5) * 60;
          p.y = p.originY + (Math.random() - 0.5) * 40;
          p.tumble = Math.random() * Math.PI;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const scaleX = Math.cos(p.tumble);
        ctx.scale(scaleX, 1);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (isMomiji) {
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.35, -s * 0.3);
          ctx.lineTo(s * 0.9, -s * 0.3);
          ctx.lineTo(s * 0.45, s * 0.15);
          ctx.lineTo(s * 0.7, s * 0.8);
          ctx.lineTo(0, s * 0.45);
          ctx.lineTo(-s * 0.7, s * 0.8);
          ctx.lineTo(-s * 0.45, s * 0.15);
          ctx.lineTo(-s * 0.9, -s * 0.3);
          ctx.lineTo(-s * 0.35, -s * 0.3);
          ctx.closePath();
          ctx.fill();
        } else {
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, s);
          ctx.bezierCurveTo(-s * 0.8, s * 0.3, -s * 0.9, -s * 0.6, -s * 0.3, -s);
          ctx.lineTo(0, -s * 0.75);
          ctx.lineTo(s * 0.3, -s);
          ctx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.8, s * 0.3, 0, s);
          ctx.fill();
        }

        ctx.restore();
      });

      pAnimId = requestAnimationFrame(renderParticles);
    };

    pAnimId = requestAnimationFrame(renderParticles);

    return () => {
      cancelAnimationFrame(pAnimId);
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
          ? 'Ancient Japanese Momiji Maple Tree on crag'
          : 'Ancient Japanese Sakura Cherry Blossom Tree on rock'
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
          {/* Deep Bark Wood Core Gradient */}
          <linearGradient id="barkCoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0B0908" />
            <stop offset="25%" stopColor="#1E1915" />
            <stop offset="65%" stopColor="#2E2620" />
            <stop offset="85%" stopColor="#181410" />
            <stop offset="100%" stopColor="#080706" />
          </linearGradient>

          {/* Kare-fude (Dry Brush Bark Striations) */}
          <linearGradient id="barkDryBrush" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A3F33" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#302720" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#14100D" stopOpacity="0.9" />
          </linearGradient>

          {/* Fractured Granite Rock Wash Gradient */}
          <linearGradient id="graniteWashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3E4247" />
            <stop offset="35%" stopColor="#282B30" />
            <stop offset="70%" stopColor="#17181B" />
            <stop offset="100%" stopColor="#0C0D0F" />
          </linearGradient>

          {/* Mossy Lichen Wash */}
          <linearGradient id="mossWashGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#464F3B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1E2319" stopOpacity="0" />
          </linearGradient>

          {/* Water Reflection Gradient */}
          <linearGradient id="waterReflectGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A2D30" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#555A60" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FAF5E8" stopOpacity="0.05" />
          </linearGradient>

          {/* SAKURA BLOSSOMS & ORGANIC FOLIAGE CLOUDS */}
          <radialGradient id="sakuraPetalGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D66B91" />
            <stop offset="35%" stopColor="#E58CAB" />
            <stop offset="70%" stopColor="#F4C3D0" />
            <stop offset="100%" stopColor="#FFF2F5" />
          </radialGradient>

          {/* Single 5-Petal Notched Cherry Blossom */}
          <g id="blossomSingle">
            {[0, 72, 144, 216, 288].map((angle, idx) => (
              <path
                key={idx}
                d="M 0 0
                   C -4 -8, -7 -14, -4 -18
                   C -2 -21, 0 -18, 2 -21
                   C 5 -18, 8 -14, 4 -8 Z"
                fill="url(#sakuraPetalGrad)"
                transform={`rotate(${angle})`}
                stroke="rgba(214, 107, 145, 0.4)"
                strokeWidth="0.5"
              />
            ))}
            <circle cx="0" cy="0" r="2.8" fill="#B83A64" />
            <circle cx="0" cy="0" r="1.4" fill="#FFE599" />
          </g>

          {/* High-Density Blossom Bouquet (9 overlapping rosettes + buds) */}
          <g id="blossomBouquet">
            <circle cx="0" cy="0" r="32" fill="#BA3366" opacity="0.4" filter="blur(5px)" />
            <use href="#blossomSingle" transform="translate(0, 0) scale(1.15)" />
            <use href="#blossomSingle" transform="translate(-15, -10) scale(0.95) rotate(18)" />
            <use href="#blossomSingle" transform="translate(16, -8) scale(1.05) rotate(42)" />
            <use href="#blossomSingle" transform="translate(-10, 14) scale(0.9) rotate(95)" />
            <use href="#blossomSingle" transform="translate(12, 12) scale(0.92) rotate(160)" />
            <use href="#blossomSingle" transform="translate(0, -18) scale(0.85) rotate(33)" />
            <use href="#blossomSingle" transform="translate(-22, 2) scale(0.75) rotate(-45)" />
            <use href="#blossomSingle" transform="translate(24, 4) scale(0.78) rotate(75)" />
            <use href="#blossomSingle" transform="translate(-5, -28) scale(0.7) rotate(110)" />
            <circle cx="-24" cy="-12" r="3" fill="#D66B91" />
            <circle cx="26" cy="-16" r="2.6" fill="#E58CAB" />
            <circle cx="-18" cy="22" r="2.8" fill="#F4C3D0" />
            <circle cx="18" cy="24" r="2.4" fill="#D66B91" />
          </g>

          {/* SAKURA: Continuous Volumetric Cloud Shelf */}
          <g id="sakuraCanopyCloud">
            {/* 1. Deep Shadow Background Wash */}
            <path
              d="M -90 10
                 C -110 -15, -85 -50, -55 -55
                 C -40 -68, -12 -75, 15 -72
                 C 42 -78, 75 -66, 92 -45
                 C 112 -25, 118 8, 100 30
                 C 82 48, 52 56, 18 52
                 C -22 58, -62 48, -82 28 Z"
              fill="#9C1E4E"
              opacity="0.88"
            />
            {/* 2. Vibrant Midtone Petal Cloud */}
            <path
              d="M -80 -5
                 C -95 -28, -68 -58, -38 -60
                 C -18 -70, 18 -68, 45 -58
                 C 72 -50, 98 -25, 82 12
                 C 68 35, 30 42, -8 36
                 C -42 42, -75 28, -80 -5 Z"
              fill="#D66B91"
            />
            {/* 3. Pale Blush Canopy Crest */}
            <path
              d="M -65 -15
                 C -78 -38, -48 -60, -20 -58
                 C 8 -62, 35 -56, 62 -38
                 C 78 -16, 70 14, 42 28
                 C 20 34, -20 30, -48 16 Z"
              fill="#F4C3D0"
            />
            {/* 4. Layered Crisp Blossom Bouquets */}
            <use href="#blossomBouquet" transform="translate(-35, -15) scale(0.95)" />
            <use href="#blossomBouquet" transform="translate(35, -12) scale(0.98)" />
            <use href="#blossomBouquet" transform="translate(0, -32) scale(1.05)" />
            <use href="#blossomBouquet" transform="translate(-15, 12) scale(0.9)" />
            <use href="#blossomBouquet" transform="translate(25, 15) scale(0.88)" />
          </g>

          {/* MOMIJI LEAF & CLOUDS (Image 1 Archetype) */}
          <g id="momijiLeaf">
            <path
              d="M 0 -22 C 2 -14 5 -8 11 -6 C 14 -8 17 -11 21 -13 C 20 -7 18 -3 21 0 C 26 -2 30 -5 34 -5 C 29 0 25 3 26 7 C 31 9 34 10 36 14 C 30 16 24 16 21 20 C 24 23 27 27 26 31 C 21 29 16 26 13 29 C 11 32 10 36 7 39 C 4 35 3 30 0 28 L 0 42 L -2 42 L -2 28 C -5 30 -6 35 -9 39 C -12 36 -13 32 -15 29 C -18 26 -23 29 -28 31 C -29 27 -26 23 -23 20 C -26 16 -32 16 -38 14 C -36 10 -33 9 -28 7 C -27 3 -31 0 -36 -5 C -32 -5 -28 -2 -23 0 C -20 -3 -22 -7 -23 -13 C -19 -11 -16 -8 -13 -6 C -7 -8 -4 -14 -2 -22 Z"
              fill="currentColor"
            />
          </g>

          <g id="momijiCanopyCloud">
            <path
              d="M -90 10
                 C -110 -15, -85 -50, -55 -55
                 C -40 -68, -12 -75, 15 -72
                 C 42 -78, 75 -66, 92 -45
                 C 112 -25, 118 8, 100 30
                 C 82 48, 52 56, 18 52
                 C -22 58, -62 48, -82 28 Z"
              fill="#52070D"
            />
            <path
              d="M -80 -5
                 C -95 -28, -68 -58, -38 -60
                 C -18 -70, 18 -68, 45 -58
                 C 72 -50, 98 -25, 82 12
                 C 68 35, 30 42, -8 36
                 C -42 42, -75 28, -80 -5 Z"
              fill="#8F0B16"
            />
            <path
              d="M -65 -15
                 C -78 -38, -48 -60, -20 -58
                 C 8 -62, 35 -56, 62 -38
                 C 78 -16, 70 14, 42 28
                 C 20 34, -20 30, -48 16 Z"
              fill="#C71825"
            />
            <path
              d="M -45 -22
                 C -55 -42, -28 -58, 0 -52
                 C 25 -55, 48 -40, 44 -14
                 C 35 8, 0 18, -28 10 Z"
              fill="#E62432"
            />
            {/* Multi-angled projecting maple leaves */}
            <g transform="translate(0, -62) scale(0.4)" color="#FF3A28"><use href="#momijiLeaf" /></g>
            <g transform="translate(-35, -55) scale(0.38) rotate(-25)" color="#E62432"><use href="#momijiLeaf" /></g>
            <g transform="translate(36, -55) scale(0.38) rotate(25)" color="#FF3A28"><use href="#momijiLeaf" /></g>
            <g transform="translate(-68, -38) scale(0.35) rotate(-55)" color="#C71825"><use href="#momijiLeaf" /></g>
            <g transform="translate(70, -35) scale(0.35) rotate(55)" color="#E62432"><use href="#momijiLeaf" /></g>
            <g transform="translate(-90, -10) scale(0.33) rotate(-85)" color="#8F0B16"><use href="#momijiLeaf" /></g>
            <g transform="translate(92, -8) scale(0.33) rotate(85)" color="#FF5238"><use href="#momijiLeaf" /></g>
            <g transform="translate(-15, -42) scale(0.28) rotate(-10)" color="#FFA347"><use href="#momijiLeaf" /></g>
            <g transform="translate(18, -40) scale(0.28) rotate(15)" color="#FF7A38"><use href="#momijiLeaf" /></g>
          </g>

          {/* Shoreline sapling shrub */}
          <g id="shorelineSapling">
            <path d="M 0 0 C -8 -18 -14 -32 -10 -45" stroke="#120E0B" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M -8 -22 C 6 -32 14 -38 16 -50" stroke="#120E0B" strokeWidth="2.2" strokeLinecap="round" />
            <g transform="translate(-10, -45) scale(0.5) rotate(-18)"><use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} /></g>
            <g transform="translate(16, -50) scale(0.42) rotate(22)"><use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} /></g>
          </g>
        </defs>

        {/* ================================================================ */}
        {/* LAYER 0: WATER SHORELINE & REFLECTION RIPPLES                    */}
        {/* ================================================================ */}
        <g id="WaterShoreline" className="sakura-water-shoreline" opacity="0.8">
          <ellipse cx="280" cy="1030" rx="240" ry="24" fill="url(#waterReflectGrad)" />
          <path d="M 120 1025 Q 240 1032, 380 1026" stroke="#2B2E33" strokeWidth="1.5" strokeDasharray="15 8 30 12" fill="none" opacity="0.6" />
          <path d="M 180 1040 Q 300 1045, 420 1039" stroke="#2B2E33" strokeWidth="1.2" strokeDasharray="25 10 18 15" fill="none" opacity="0.4" />
          <path d="M 80 1055 Q 220 1060, 360 1054" stroke="#2B2E33" strokeWidth="1.0" strokeDasharray="35 15 20 20" fill="none" opacity="0.3" />
        </g>

        {/* ================================================================ */}
        {/* LAYER 1: MULTI-FACETED GRANITE ROCK CRAG & ROOTS (y=760..1020)   */}
        {/* ================================================================ */}
        <g id="RockBase" className="sakura-rock-base">
          <path
            d="M 60 1025
               L 75 965
               L 105 915
               L 90 875
               L 128 825
               L 165 780
               L 225 768
               L 280 790
               L 345 812
               L 395 855
               L 435 918
               L 415 980
               L 430 1025 Z"
            fill="url(#graniteWashGrad)"
            stroke="#0B0C0E"
            strokeWidth="2.5"
          />

          {/* Geological fault lines */}
          <path d="M 128 825 L 170 870 L 195 940 L 190 1025" stroke="#0B0C0E" strokeWidth="3" fill="none" opacity="0.8" />
          <path d="M 225 768 L 260 835 L 295 898 L 320 1025" stroke="#0B0C0E" strokeWidth="3" fill="none" opacity="0.8" />
          <path d="M 90 875 L 140 895 L 165 980" stroke="#0B0C0E" strokeWidth="2.2" fill="none" opacity="0.7" />
          <path d="M 280 790 L 335 845 L 365 930" stroke="#0B0C0E" strokeWidth="2.5" fill="none" opacity="0.7" />
          <path d="M 345 812 L 390 870 L 410 950" stroke="#0B0C0E" strokeWidth="2.2" fill="none" opacity="0.65" />

          {/* Moss wash on ridge */}
          <path
            d="M 128 825
               Q 175 768, 225 768
               Q 285 780, 345 812
               L 335 838
               Q 275 805, 220 795
               Q 165 795, 132 840 Z"
            fill="url(#mossWashGrad)"
          />

          {/* Reeds at base */}
          <g stroke="#141712" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.85">
            <path d="M 85 960 C 75 930, 68 905, 55 885" />
            <path d="M 92 965 C 86 935, 82 910, 72 890" />
            <path d="M 100 970 C 105 935, 115 915, 120 895" />
            <path d="M 390 985 C 405 950, 425 930, 445 915" />
            <path d="M 400 995 C 418 965, 438 945, 460 932" />
          </g>

          {/* Shoreline saplings */}
          <g transform="translate(100, 895) scale(0.85)">
            <use href="#shorelineSapling" />
          </g>
          <g transform="translate(390, 890) scale(0.75) rotate(15)">
            <use href="#shorelineSapling" />
          </g>

          {/* Exposed Muscular Roots (Nebari - 根張り) */}
          <g id="RootSystem" fill="url(#barkCoreGrad)">
            <path
              d="M 152 845
                 C 130 875, 105 915, 88 955
                 C 82 968, 86 975, 96 972
                 C 112 935, 138 890, 172 860 Z"
            />
            <path
              d="M 180 852
                 C 170 895, 178 945, 195 995
                 C 200 1005, 210 1005, 212 995
                 C 198 948, 194 900, 206 855 Z"
            />
            <path
              d="M 225 855
                 C 255 890, 295 930, 325 978
                 C 334 990, 344 985, 342 972
                 C 315 925, 278 885, 252 852 Z"
            />
          </g>
        </g>

        {/* ================================================================ */}
        {/* LAYER 2: BACKGROUND FOLIAGE CLOUDS (Sitting BEHIND branches)      */}
        {/* ================================================================ */}
        <g id="BackgroundCanopyClouds" opacity="0.95">
          {/* Broad background volumes creating depth under the branches */}
          <g transform="translate(180, 360) scale(1.35) rotate(-10)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(260, 220) scale(1.4) rotate(5)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(370, 160) scale(1.45) rotate(18)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(500, 240) scale(1.4) rotate(12)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(620, 290) scale(1.25) rotate(-5)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(120, 460) scale(1.15) rotate(15)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(580, 420) scale(1.2) rotate(20)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
        </g>

        {/* ================================================================ */}
        {/* LAYER 3: GNARLED TRUNK & BRANCH SKELETON (Intertwining through)  */}
        {/* ================================================================ */}
        <g ref={trunkRef} id="MainTrunk" style={{ transformOrigin: '195px 860px' }}>
          {/* Main S-Curved Muscular Trunk Body */}
          <path
            d="M 145 852
               C 155 790, 195 735, 240 682
               C 278 638, 292 610, 294 568
               C 296 515, 278 468, 302 420
               C 314 395, 332 375, 352 360
               L 392 370
               C 372 402, 360 438, 362 480
               C 364 538, 376 585, 358 640
               C 340 702, 305 760, 282 812
               L 258 860 Z"
            fill="url(#barkCoreGrad)"
            stroke="#080706"
            strokeWidth="3.2"
          />

          {/* Gnarled Bark Muscle Grooves & Kare-fude (Dry Brush) */}
          <g stroke="url(#barkDryBrush)" strokeWidth="3.2" strokeLinecap="round" fill="none">
            <path d="M 172 835 C 185 775, 222 720, 262 670 C 290 635, 300 592, 302 545 C 304 498, 298 455, 318 408" />
            <path d="M 208 842 C 222 788, 255 735, 292 682 C 316 648, 328 605, 330 558 C 332 512, 326 470, 342 418" />
            <path d="M 238 848 C 252 798, 286 748, 318 698 C 338 665, 348 622, 350 575" />
          </g>

          {/* Ancient Knot Hollow (Uro - 樹洞) */}
          <ellipse cx="298" cy="565" rx="8" ry="16" transform="rotate(-15, 298, 565)" fill="#050404" />
          <path d="M 288 545 C 282 565, 285 585, 296 595" stroke="#4A3F33" strokeWidth="2.5" fill="none" opacity="0.8" />

          {/* ============================================================== */}
          {/* ARTICULATED BOUGHS (Branching naturally with organic bends)     */}
          {/* ============================================================== */}

          {/* BOUGH 1: Low-Left Bow (Reaching low towards water) */}
          <g ref={leftBoughRef} style={{ transformOrigin: '302px 505px' }}>
            <path
              d="M 300 508
                 C 260 515, 215 510, 175 488
                 C 145 470, 118 448, 95 422
                 L 108 412
                 C 128 435, 155 455, 185 472
                 C 222 492, 265 498, 300 492 Z"
              fill="url(#barkCoreGrad)"
              stroke="#080706"
              strokeWidth="2.4"
            />
            {/* Secondary gnarly branch knuckle */}
            <path d="M 175 488 Q 148 530, 122 558" stroke="#14110E" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 95 422 Q 70 405, 52 375" stroke="#14110E" strokeWidth="4.2" strokeLinecap="round" fill="none" />
            <path d="M 148 530 Q 115 540, 95 565" stroke="#14110E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          </g>

          {/* BOUGH 2: Central High Crown Trunk (Ascending to sky) */}
          <g ref={crownGroupRef} style={{ transformOrigin: '340px 370px' }}>
            <path
              d="M 338 370
                 C 318 310, 292 245, 265 180
                 C 248 140, 228 105, 205 70
                 L 222 62
                 C 245 95, 268 132, 285 172
                 C 312 235, 338 298, 358 362 Z"
              fill="url(#barkCoreGrad)"
              stroke="#080706"
              strokeWidth="2.5"
            />
            {/* Crown forks */}
            <path d="M 265 180 C 285 130, 310 85, 335 42" stroke="#14110E" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 285 172 C 322 148, 362 125, 402 102" stroke="#14110E" strokeWidth="5.2" strokeLinecap="round" fill="none" />
            <path d="M 235 115 C 210 95, 185 75, 160 48" stroke="#14110E" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 310 85 Q 345 70, 375 60" stroke="#14110E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          </g>

          {/* BOUGH 3: Heavy Right Arching Bough (Spanning rightward) */}
          <g ref={rightBoughRef} style={{ transformOrigin: '362px 375px' }}>
            <path
              d="M 362 378
                 C 420 328, 488 288, 560 248
                 C 620 215, 682 180, 730 140
                 L 740 152
                 C 690 192, 630 225, 570 258
                 C 500 298, 432 338, 376 392 Z"
              fill="url(#barkCoreGrad)"
              stroke="#080706"
              strokeWidth="2.6"
            />
            {/* Right bough forks */}
            <path d="M 560 248 C 542 192, 525 138, 508 88" stroke="#14110E" strokeWidth="5.2" strokeLinecap="round" fill="none" />
            <path d="M 620 215 C 645 165, 675 115, 705 75" stroke="#14110E" strokeWidth="4.8" strokeLinecap="round" fill="none" />
            <path d="M 542 192 Q 575 160, 605 135" stroke="#14110E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>

          {/* BOUGH 4: Far-Right & Low-Right Drooping Bough */}
          <g ref={lowRightRef} style={{ transformOrigin: '355px 485px' }}>
            <path
              d="M 352 488
                 C 412 500, 475 525, 538 552
                 C 580 572, 620 598, 655 625
                 L 645 638
                 C 610 610, 572 588, 530 565
                 C 470 538, 408 518, 350 505 Z"
              fill="url(#barkCoreGrad)"
              stroke="#080706"
              strokeWidth="2.2"
            />
            {/* Secondary drooping twigs */}
            <path d="M 538 552 Q 582 530, 622 512" stroke="#14110E" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 450 518 Q 485 490, 520 475" stroke="#14110E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        </g>

        {/* ================================================================ */}
        {/* LAYER 4: FOREGROUND LUSH FOLIAGE CANOPY (Overlapping branches)   */}
        {/* ================================================================ */}
        <g id="ForegroundCanopyClouds">
          {/* Left Low Drooping Foliage */}
          <g transform="translate(105, 435) scale(1.15) rotate(8)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(125, 550) scale(0.92) rotate(22)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(52, 385) scale(0.85) rotate(-15)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>

          {/* Mid-Left Lush Foliage */}
          <g transform="translate(110, 270) scale(1.3) rotate(-8)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(180, 310) scale(1.22) rotate(12)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>

          {/* Crown Apex Sky Dome */}
          <g transform="translate(205, 80) scale(1.35) rotate(-5)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(325, 55) scale(1.32) rotate(15)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(395, 115) scale(1.35) rotate(28)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(275, 145) scale(1.25) rotate(-10)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>

          {/* Main Right Arching Canopy */}
          <g transform="translate(515, 95) scale(1.32) rotate(-10)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(585, 205) scale(1.3) rotate(15)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(705, 95) scale(1.22) rotate(22)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(725, 168) scale(1.35) rotate(8)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>

          {/* Far Right & Low Right Canopy */}
          <g transform="translate(720, 275) scale(1.25) rotate(-12)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(760, 370) scale(1.28) rotate(10)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(645, 625) scale(1.2) rotate(16)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(620, 515) scale(1.1) rotate(-10)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
          <g transform="translate(555, 550) scale(1.15) rotate(6)">
            <use href={isMomiji ? '#momijiCanopyCloud' : '#sakuraCanopyCloud'} />
          </g>
        </g>
      </svg>

      {/* 2. Real-Time Falling Petals/Leaves (Confined strictly to tree visual container) */}
      <canvas ref={canvasRef} className="sakura-local-petals-canvas" />
    </div>
  );
}
