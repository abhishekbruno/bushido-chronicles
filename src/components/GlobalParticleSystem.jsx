import React, { useEffect, useRef, useState } from 'react';
import { windSystem } from '../utils/windSystem';

// ============================================================================
// JAPANESE MOMIJI (MAPLE LEAF), SAKURA (CHERRY BLOSSOM) & DUST PARTICLE SYSTEM
// High-performance 60 FPS HTML5 Canvas engine with offscreen vector caching
// Fully synchronized with GlobalWindSystem & seasonal section adaptation
// ============================================================================

// 1. 7-lobed classical Japanese maple leaf path in 100x100 coordinate space
const MOMIJI_PATH_SVG = `
  M 50 8
  C 52 18, 56 25, 62 27
  C 67 24, 72 19, 78 16
  C 76 24, 73 30, 76 34
  C 84 31, 91 26, 96 26
  C 90 34, 84 38, 86 44
  C 93 47, 98 49, 100 54
  C 93 57, 85 57, 81 63
  C 85 68, 89 74, 88 80
  C 82 78, 75 73, 70 77
  C 67 82, 65 87, 61 91
  C 57 86, 55 79, 51.5 77
  L 52 99
  L 48 99
  L 48.5 77
  C 45 79, 43 86, 39 91
  C 35 87, 33 82, 30 77
  C 25 73, 18 78, 12 80
  C 11 74, 15 68, 19 63
  C 15 57, 7 57, 0 54
  C 2 49, 7 47, 14 44
  C 16 38, 10 34, 4 26
  C 9 26, 16 31, 24 34
  C 27 30, 24 24, 22 16
  C 28 19, 33 24, 38 27
  C 44 25, 48 18, 50 8
  Z
`.replace(/\s+/g, ' ').trim();

// 2. Classical Japanese notched Sakura petal path in 100x100 coordinate space
const SAKURA_PETAL_PATH_SVG = `
  M 50 92
  C 34 82, 18 55, 22 28
  C 24 14, 38 8, 48 20
  C 49 21, 51 21, 52 20
  C 62 8, 76 14, 78 28
  C 82 55, 66 82, 50 92
  Z
`.replace(/\s+/g, ' ').trim();

// Autumn Momiji Color Palettes (Refined Japanese Editorial Tones)
const MOMIJI_PALETTES = [
  {
    name: 'Shinku (深紅 - Imperial Crimson)',
    base: '#8A020D',
    mid: '#C80415',
    tip: '#E61E2E',
    vein: '#FFA5AB',
    underside: '#A83B43',
    stem: '#4A080C',
  },
  {
    name: 'Akane (茜色 - Radiant Vermilion)',
    base: '#8C2B08',
    mid: '#BA4312',
    tip: '#DE5F23',
    vein: '#FFB88A',
    underside: '#B86242',
    stem: '#4F1805',
  },
  {
    name: 'Kouyou (紅葉 - Autumn Russet / Ochre)',
    base: '#6E1D0E',
    mid: '#9E381C',
    tip: '#C45431',
    vein: '#EAA28A',
    underside: '#9E5540',
    stem: '#3E1008',
  },
  {
    name: 'Kohaku (琥珀 - Golden Amber / Persimmon)',
    base: '#7D4408',
    mid: '#B06817',
    tip: '#D9892B',
    vein: '#FFE2A6',
    underside: '#B37E44',
    stem: '#452504',
  },
  {
    name: 'Kurobeni (黒紅 - Dark Sumi Iron Wine)',
    base: '#380B0F',
    mid: '#5E141B',
    tip: '#852028',
    vein: '#B8555E',
    underside: '#5C2D32',
    stem: '#200507',
  },
  {
    name: 'Yamabuki (山吹 - Faded Antique Gold)',
    base: '#6E521D',
    mid: '#9E7B32',
    tip: '#C29C48',
    vein: '#F0D89A',
    underside: '#9C8350',
    stem: '#3E2E0F',
  },
];

// Spring Sakura Color Palettes (Delicate Translucent Petals)
const SAKURA_PALETTES = [
  {
    name: 'Sakura-Iro (桜色 - Pale Powder Blossom)',
    base: '#FFF5F7',
    mid: '#FCE4E8',
    tip: '#F7BAC5',
    blush: '#EA728C',
    vein: '#F8CBD4',
    underside: '#FAEDF0',
  },
  {
    name: 'Hana-Kasumi (花霞 - Rose Blossom Mist)',
    base: '#FFEBF0',
    mid: '#F5B8C4',
    tip: '#EE8C9E',
    blush: '#D94565',
    vein: '#F3B4C1',
    underside: '#F7D6DE',
  },
  {
    name: 'Beni-Sakura (紅桜 - Deep Spring Crimson Blossom)',
    base: '#FFDCE4',
    mid: '#F398AB',
    tip: '#E35876',
    blush: '#B81B3D',
    vein: '#ECA0B0',
    underside: '#F5BAC6',
  },
  {
    name: 'Yosakura (夜桜 - Moonlit Pure Blossom)',
    base: '#FFFFFF',
    mid: '#FFF0F3',
    tip: '#F2CCD6',
    blush: '#CF7D90',
    vein: '#F7E2E7',
    underside: '#FDF7F8',
  },
];

// Section-specific environmental adaptations
const SECTION_CONFIGS = {
  hero: {
    momijiTarget: 9,
    sakuraTarget: 1,
    particleTarget: 58,
    speedMult: 1.0,
    windMult: 1.1,
  },
  legacy: {
    momijiTarget: 10,
    sakuraTarget: 1,
    particleTarget: 64,
    speedMult: 0.95,
    windMult: 1.0,
  },
  bushido: {
    momijiTarget: 5,
    sakuraTarget: 2,
    particleTarget: 45,
    speedMult: 0.8,
    windMult: 0.7,
  },
  warriors: {
    momijiTarget: 12,
    sakuraTarget: 1,
    particleTarget: 69,
    speedMult: 1.2,
    windMult: 1.3,
  },
  blade: {
    momijiTarget: 8,
    sakuraTarget: 0,
    particleTarget: 50,
    speedMult: 0.9,
    windMult: 0.85,
  },
  spirit: {
    momijiTarget: 1,
    sakuraTarget: 15, // Restrained petals, independent of any tree
    particleTarget: 66,
    speedMult: 0.65,
    windMult: 0.7,
  },
  cta: {
    momijiTarget: 12,
    sakuraTarget: 3,
    particleTarget: 74,
    speedMult: 0.95,
    windMult: 1.15,
  },
};

export default function GlobalParticleSystem() {
  const canvasRef = useRef(null);
  const activeSectionRef = useRef('hero');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = width < 768;

    // Environmental state smoothly lerped
    let currentConfig = {
      momijiTarget: isMobile ? 10 : 22,
      sakuraTarget: isMobile ? 2 : 4,
      particleTarget: isMobile ? 50 : 110,
      speedMult: 1.0,
      windMult: 1.0,
    };

    // ------------------------------------------------------------------------
    // 1. PRE-RENDER CACHED OFFSCREEN SPRITES FOR MAPLE LEAVES & SAKURA PETALS
    // ------------------------------------------------------------------------
    const SPRITE_SIZE = 96;
    const momijiSprites = [];
    const sakuraSprites = [];

    // Momiji (Maple) Sprites
    const momijiPath2D = new Path2D(MOMIJI_PATH_SVG);
    MOMIJI_PALETTES.forEach((pal) => {
      // Front Face
      const frontCanvas = document.createElement('canvas');
      frontCanvas.width = SPRITE_SIZE;
      frontCanvas.height = SPRITE_SIZE;
      const fCtx = frontCanvas.getContext('2d');
      fCtx.scale(SPRITE_SIZE / 100, SPRITE_SIZE / 100);

      const grad = fCtx.createRadialGradient(50, 75, 4, 50, 45, 52);
      grad.addColorStop(0, pal.base);
      grad.addColorStop(0.5, pal.mid);
      grad.addColorStop(1, pal.tip);

      fCtx.fillStyle = grad;
      fCtx.fill(momijiPath2D);

      fCtx.strokeStyle = pal.vein;
      fCtx.lineWidth = 0.9;
      fCtx.globalAlpha = 0.55;

      fCtx.beginPath();
      fCtx.moveTo(50, 77);
      fCtx.lineTo(50, 16);
      fCtx.stroke();

      const veinTargets = [
        [78, 20], [92, 30], [96, 52], [85, 76],
        [22, 20], [8, 30], [4, 52], [15, 76],
      ];
      veinTargets.forEach(([tx, ty]) => {
        fCtx.beginPath();
        fCtx.moveTo(50, 77);
        fCtx.lineTo(tx, ty);
        fCtx.stroke();
      });

      // Stem
      fCtx.strokeStyle = pal.stem;
      fCtx.lineWidth = 1.8;
      fCtx.globalAlpha = 0.85;
      fCtx.beginPath();
      fCtx.moveTo(50, 77);
      fCtx.lineTo(50, 99);
      fCtx.stroke();

      // Underside Face
      const underCanvas = document.createElement('canvas');
      underCanvas.width = SPRITE_SIZE;
      underCanvas.height = SPRITE_SIZE;
      const uCtx = underCanvas.getContext('2d');
      uCtx.scale(SPRITE_SIZE / 100, SPRITE_SIZE / 100);
      uCtx.fillStyle = pal.underside;
      uCtx.fill(momijiPath2D);

      uCtx.strokeStyle = pal.vein;
      uCtx.lineWidth = 0.7;
      uCtx.globalAlpha = 0.35;
      uCtx.beginPath();
      uCtx.moveTo(50, 77);
      uCtx.lineTo(50, 18);
      uCtx.stroke();

      momijiSprites.push({
        front: frontCanvas,
        underside: underCanvas,
      });
    });

    // Sakura (Cherry Blossom Petal) Sprites
    const sakuraPath2D = new Path2D(SAKURA_PETAL_PATH_SVG);
    SAKURA_PALETTES.forEach((pal) => {
      // Front Face
      const frontCanvas = document.createElement('canvas');
      frontCanvas.width = SPRITE_SIZE;
      frontCanvas.height = SPRITE_SIZE;
      const fCtx = frontCanvas.getContext('2d');
      fCtx.scale(SPRITE_SIZE / 100, SPRITE_SIZE / 100);

      const grad = fCtx.createLinearGradient(50, 92, 50, 15);
      grad.addColorStop(0, pal.base);
      grad.addColorStop(0.4, pal.mid);
      grad.addColorStop(1, pal.tip);

      fCtx.fillStyle = grad;
      fCtx.fill(sakuraPath2D);

      // Delicate petal central blush & cleft shadow
      const blushGrad = fCtx.createRadialGradient(50, 26, 2, 50, 26, 24);
      blushGrad.addColorStop(0, pal.blush);
      blushGrad.addColorStop(1, 'transparent');
      fCtx.fillStyle = blushGrad;
      fCtx.globalAlpha = 0.65;
      fCtx.fill(sakuraPath2D);

      // Fine central vein
      fCtx.strokeStyle = pal.vein;
      fCtx.lineWidth = 0.8;
      fCtx.globalAlpha = 0.45;
      fCtx.beginPath();
      fCtx.moveTo(50, 90);
      fCtx.lineTo(50, 24);
      fCtx.stroke();

      // Underside Face (slightly softer and paler)
      const underCanvas = document.createElement('canvas');
      underCanvas.width = SPRITE_SIZE;
      underCanvas.height = SPRITE_SIZE;
      const uCtx = underCanvas.getContext('2d');
      uCtx.scale(SPRITE_SIZE / 100, SPRITE_SIZE / 100);
      uCtx.fillStyle = pal.underside;
      uCtx.fill(sakuraPath2D);

      uCtx.strokeStyle = pal.vein;
      uCtx.lineWidth = 0.6;
      uCtx.globalAlpha = 0.3;
      uCtx.beginPath();
      uCtx.moveTo(50, 88);
      uCtx.lineTo(50, 30);
      uCtx.stroke();

      sakuraSprites.push({
        front: frontCanvas,
        underside: underCanvas,
      });
    });

    // ------------------------------------------------------------------------
    // 2. RESIZE HANDLER WITH CANVAS DPR ADJUSTMENT
    // ------------------------------------------------------------------------
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ------------------------------------------------------------------------
    // 3. PARTICLE POOLS (MOMIJI, SAKURA, ATMOSPHERIC DUST)
    // ------------------------------------------------------------------------
    const MAX_MOMIJI = isMobile ? 16 : 38;
    const MAX_SAKURA = isMobile ? 18 : 42;
    const MAX_PARTICLES = isMobile ? 65 : 160;

    const momijiLeaves = [];
    const sakuraPetals = [];
    const particles = [];

    // Initialize Momiji leaf
    const createMomijiLeaf = (initialSpawn = false) => {
      const z = Math.random();
      return {
        x: Math.random() * (width + 120) - 60,
        y: initialSpawn ? Math.random() * (height + 100) - 50 : -80 - Math.random() * 120,
        z,
        scale: 0.22 + z * 0.16,
        baseSpeedY: 0.75 + z * 0.9 + Math.random() * 0.4,
        speedX: (Math.random() - 0.4) * 0.6,
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: 0.018 + Math.random() * 0.022,
        swayAmp: 1.2 + z * 1.5 + Math.random() * 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.02 + Math.random() * 0.035,
        opacity: 0.45 + z * 0.45,
        paletteIdx: Math.floor(Math.random() * momijiSprites.length),
      };
    };

    // Initialize Sakura petal (lighter, floats with flutter)
    const createSakuraPetal = (initialSpawn = false) => {
      const z = Math.random();
      return {
        x: Math.random() * (width + 140) - 70,
        y: initialSpawn ? Math.random() * (height + 100) - 50 : -60 - Math.random() * 100,
        z,
        scale: 0.14 + z * 0.14,
        baseSpeedY: 0.42 + z * 0.5 + Math.random() * 0.25, // slower descent than heavy leaves
        speedX: (Math.random() - 0.35) * 0.75, // higher drift
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: 0.025 + Math.random() * 0.035,
        swayAmp: 1.8 + z * 1.8 + Math.random() * 1.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.032,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.03 + Math.random() * 0.045,
        opacity: 0.55 + z * 0.4,
        paletteIdx: Math.floor(Math.random() * sakuraSprites.length),
      };
    };

    for (let i = 0; i < MAX_MOMIJI; i++) momijiLeaves.push(createMomijiLeaf(true));
    for (let i = 0; i < MAX_SAKURA; i++) sakuraPetals.push(createSakuraPetal(true));

    // Initialize atmospheric dust/ink speck
    const createDustParticle = (initialSpawn = false) => {
      const typeRand = Math.random();
      let type = 'dust';
      let color = 'rgba(75, 73, 70, ';
      let size = Math.random() * 2.2 + 0.8;

      if (typeRand < 0.28) {
        type = 'ink';
        color = 'rgba(10, 10, 10, ';
        size = Math.random() * 2.8 + 1.2;
      } else if (typeRand < 0.50) {
        type = 'ember';
        color = 'rgba(217, 4, 22, ';
        size = Math.random() * 2.2 + 1.0;
      } else if (typeRand < 0.70) {
        type = 'washi';
        color = 'rgba(180, 140, 80, ';
        size = Math.random() * 3.2 + 1.4;
      }

      return {
        x: Math.random() * width,
        y: initialSpawn ? Math.random() * height : -15,
        size,
        type,
        colorPrefix: color,
        speedX: (Math.random() - 0.45) * 0.8,
        speedY: Math.random() * 0.75 + 0.25,
        opacity: Math.random() * 0.45 + 0.15,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    };

    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push(createDustParticle(true));
    }

    // ------------------------------------------------------------------------
    // 4. MOUSE AERODYNAMIC INTERACTION
    // ------------------------------------------------------------------------
    const mouse = {
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      lastX: 0,
      lastY: 0,
    };

    const handleMouseMove = (e) => {
      const curX = e.clientX;
      const curY = e.clientY;
      mouse.vx = (curX - mouse.lastX) * 0.25;
      mouse.vy = (curY - mouse.lastY) * 0.25;
      mouse.lastX = curX;
      mouse.lastY = curY;
      mouse.x = curX;
      mouse.y = curY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ------------------------------------------------------------------------
    // 5. SECTION INTERSECTION OBSERVER FOR SEASONAL WEATHER ADAPTATION
    // ------------------------------------------------------------------------
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          const secId = entry.target.id;
          if (SECTION_CONFIGS[secId]) {
            activeSectionRef.current = secId;
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: [0.25, 0.5, 0.75],
    });

    const sectionElements = document.querySelectorAll(
      '#hero, #legacy, #bushido, #warriors, #blade, #spirit, #cta'
    );
    sectionElements.forEach((el) => observer.observe(el));

    // ------------------------------------------------------------------------
    // 6. ANIMATION RENDER LOOP (TARGET 60 FPS)
    // ------------------------------------------------------------------------
    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Damp mouse velocity
      mouse.vx *= 0.92;
      mouse.vy *= 0.92;

      // Smoothly interpolate environmental configuration
      const targetCfg = SECTION_CONFIGS[activeSectionRef.current] || SECTION_CONFIGS.hero;
      const momijiTarget = isMobile ? Math.floor(targetCfg.momijiTarget * 0.5) : targetCfg.momijiTarget;
      const sakuraTarget = isMobile ? Math.floor(targetCfg.sakuraTarget * 0.5) : targetCfg.sakuraTarget;
      const particleTarget = isMobile ? Math.floor(targetCfg.particleTarget * 0.55) : targetCfg.particleTarget;

      currentConfig.speedMult += (targetCfg.speedMult - currentConfig.speedMult) * 0.05;
      currentConfig.windMult += (targetCfg.windMult - currentConfig.windMult) * 0.05;

      // Query GlobalWindSystem for unified site-wide breeze & gust vector
      const windState = windSystem.getState();
      const unifiedWind = (windState.windX * (1 + windState.gust * 2.2)) * currentConfig.windMult;

      ctx.clearRect(0, 0, width, height);

      // A. RENDER ATMOSPHERIC INK & DUST PARTICLES
      for (let i = 0; i < particleTarget; i++) {
        const p = particles[i];

        p.x += (p.speedX + unifiedWind * 0.35) * currentConfig.speedMult;
        p.y += p.speedY * currentConfig.speedMult;
        p.rotation += p.rotSpeed;
        p.pulsePhase += dt * 2.5;

        // Mouse breeze deflection
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150;
          p.x += (dx / dist + mouse.vx * 0.08) * force * 3.5;
          p.y += (dy / dist + mouse.vy * 0.08) * force * 3.5;
        }

        // Screen wrapping
        if (p.y > height + 20) {
          p.y = -15;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        let alpha = p.opacity;
        if (p.type === 'ember') {
          alpha = p.opacity * (0.8 + Math.sin(p.pulsePhase) * 0.25);
        }

        ctx.fillStyle = `${p.colorPrefix}${alpha})`;

        if (p.type === 'washi') {
          ctx.fillRect(-p.size * 1.5, -p.size * 0.4, p.size * 3, p.size * 0.8);
        } else if (p.type === 'ink') {
          ctx.beginPath();
          ctx.moveTo(-p.size, -p.size * 0.6);
          ctx.lineTo(p.size * 0.8, -p.size);
          ctx.lineTo(p.size, p.size * 0.7);
          ctx.lineTo(-p.size * 0.5, p.size);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // B. RENDER JAPANESE MAPLE LEAVES (MOMIJI) WITH 3D FLUTTER
      if (!prefersReducedMotion) {
        for (let i = 0; i < momijiTarget; i++) {
          const leaf = momijiLeaves[i];

          leaf.swayAngle += leaf.swaySpeed * currentConfig.speedMult;
          const swayOffset = Math.sin(leaf.swayAngle) * leaf.swayAmp;

          leaf.x += (leaf.speedX + swayOffset + unifiedWind * 1.1) * currentConfig.speedMult;
          leaf.y += leaf.baseSpeedY * currentConfig.speedMult;

          leaf.rotation += leaf.rotSpeed * currentConfig.speedMult;
          leaf.flipAngle += leaf.flipSpeed * currentConfig.speedMult;

          // Mouse aerodynamic reaction
          const mdx = leaf.x - mouse.x;
          const mdy = leaf.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 180 && mDist > 0) {
            const mForce = (180 - mDist) / 180;
            leaf.x += (mdx / mDist * 2.2 + mouse.vx * 0.12) * mForce;
            leaf.y += (mdy / mDist * 1.4 + mouse.vy * 0.12) * mForce;
            leaf.rotation += mForce * 0.05;
          }

          // Screen wrapping
          if (leaf.y > height + 80) {
            leaf.y = -70 - Math.random() * 60;
            leaf.x = Math.random() * (width + 120) - 60;
            leaf.paletteIdx = Math.floor(Math.random() * momijiSprites.length);
          }
          if (leaf.x < -100) leaf.x = width + 60;
          if (leaf.x > width + 100) leaf.x = -60;

          // 3D Flip foreshortening
          const flipCos = Math.cos(leaf.flipAngle);
          const absFlip = Math.max(0.12, Math.abs(flipCos));
          const isUnderside = flipCos < 0;

          const spritePair = momijiSprites[leaf.paletteIdx];
          const spriteImg = isUnderside ? spritePair.underside : spritePair.front;

          ctx.save();
          ctx.translate(leaf.x, leaf.y);
          ctx.rotate(leaf.rotation);
          ctx.scale(leaf.scale * absFlip, leaf.scale);
          ctx.globalAlpha = leaf.opacity;

          ctx.drawImage(
            spriteImg,
            -SPRITE_SIZE / 2,
            -SPRITE_SIZE / 2,
            SPRITE_SIZE,
            SPRITE_SIZE
          );
          ctx.restore();
        }

        // C. RENDER SAKURA (CHERRY BLOSSOM) PETALS (GRACEFUL FLOATING BLIZZARD)
        for (let i = 0; i < sakuraTarget; i++) {
          const petal = sakuraPetals[i];

          petal.swayAngle += petal.swaySpeed * currentConfig.speedMult;
          const swayOffset = Math.sin(petal.swayAngle) * petal.swayAmp;

          // Sakura petals are lighter, thus carried farther by wind
          petal.x += (petal.speedX + swayOffset + unifiedWind * 1.4) * currentConfig.speedMult;
          petal.y += petal.baseSpeedY * currentConfig.speedMult;

          petal.rotation += petal.rotSpeed * currentConfig.speedMult;
          petal.flipAngle += petal.flipSpeed * currentConfig.speedMult;

          // Mouse aerodynamic reaction
          const mdx = petal.x - mouse.x;
          const mdy = petal.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 160 && mDist > 0) {
            const mForce = (160 - mDist) / 160;
            petal.x += (mdx / mDist * 2.5 + mouse.vx * 0.14) * mForce;
            petal.y += (mdy / mDist * 1.6 + mouse.vy * 0.14) * mForce;
            petal.rotation += mForce * 0.08;
          }

          // Screen wrapping
          if (petal.y > height + 60) {
            petal.y = -50 - Math.random() * 50;
            petal.x = Math.random() * (width + 140) - 70;
            petal.paletteIdx = Math.floor(Math.random() * sakuraSprites.length);
          }
          if (petal.x < -80) petal.x = width + 50;
          if (petal.x > width + 80) petal.x = -50;

          // 3D Flip foreshortening
          const flipCos = Math.cos(petal.flipAngle);
          const absFlip = Math.max(0.15, Math.abs(flipCos));
          const isUnderside = flipCos < 0;

          const spritePair = sakuraSprites[petal.paletteIdx];
          const spriteImg = isUnderside ? spritePair.underside : spritePair.front;

          ctx.save();
          ctx.translate(petal.x, petal.y);
          ctx.rotate(petal.rotation);
          ctx.scale(petal.scale * absFlip, petal.scale);
          ctx.globalAlpha = petal.opacity;

          ctx.drawImage(
            spriteImg,
            -SPRITE_SIZE / 2,
            -SPRITE_SIZE / 2,
            SPRITE_SIZE,
            SPRITE_SIZE
          );
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="global-atmospheric-particle-root"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        className="global-atmospheric-canvas"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
