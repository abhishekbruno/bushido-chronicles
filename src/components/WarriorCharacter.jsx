import { createArtworkLoop, damp } from '../utils/motion';
import { drawWindCloth } from '../utils/cloth';
import { windSystem } from '../utils/windSystem';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import './warrior-character.css';

/**
 * WarriorCharacter — 歴戦の武士 (The Living Sengoku Titans)
 * -----------------------------------------------------------------------------
 * Reconstructed 2.5D Japanese woodblock portrait engine:
 *  - High-detail transparent character masterworks extracted from the approved concept.
 *  - Authentic Crimson Sun disc with weathered woodblock bands and slow breathing halo.
 *  - 60 FPS Canvas 2D cloth physics: traveling sine waves rippling across billowing
 *    capes, loose robes, and frayed hemlines from right to left.
 *  - 100% anatomically rigid armor, kabuto helmets, golden crescent crests, antlers,
 *    and signature weapons (Daisho blades, Matchlock/Katana, Yari spear).
 *  - Shared environmental wind engine with ambient breeze and occasional powerful gusts.
 *  - Subtle atmospheric sumi-e ink flecks, dust motes, and dried grass particles.
 *  - Vertical Japanese calligraphy and cinnabar Hanko seal.
 *  - Automatic IntersectionObserver pause when offscreen for zero-lag performance.
 */
export default function WarriorCharacter({ warrior, index, isHovered = false }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const id = warrior.id;

  // Animation state reference
  const stateRef = useRef({
    rafId: null,
    lastTime: 0,
    waveTime: index * 1.8, // staggered phase
    gust: 0,
    gustElapsed: 0,
    gustDuration: 2.2,
    nextGustTime: 4.5 + index * 1.5,
    isVisible: true,
    reducedMotion: false,
    particles: [],
    images: {
      char: null,
      cloth: null,
      body: null,
    },
    // Distinct physical properties per warrior
    params: {
      musashi: {
        clothRootX: 235,
        clothSpanX: 235,
        waveSpeed: 2.5,
        waveAmp: 9.5,
        gustMult: 1.35,
        breathDuration: 6.8,
        clothSlices: 38,
      },
      nobunaga: {
        clothRootX: 270,
        clothSpanX: 270,
        waveSpeed: 1.8, // heavy ceremonial cloak moves slower
        waveAmp: 11.5,
        gustMult: 1.45,
        breathDuration: 7.8,
        clothSlices: 44,
      },
      masamune: {
        clothRootX: 260,
        clothSpanX: 260,
        waveSpeed: 2.2,
        waveAmp: 10.5,
        gustMult: 1.3,
        breathDuration: 6.2,
        clothSlices: 42,
      },
      yukimura: {
        clothRootX: 265,
        clothSpanX: 265,
        waveSpeed: 2.4, // fluttering battle garment
        waveAmp: 11.0,
        gustMult: 1.4,
        breathDuration: 5.8,
        clothSlices: 42,
      },
    }[id] || {
      clothRootX: 260,
      clothSpanX: 260,
      waveSpeed: 2.2,
      waveAmp: 10.5,
      gustMult: 1.3,
      breathDuration: 6.5,
      clothSlices: 40,
    },
  });

  // 1. Initialize Atmospheric Particles (3-6 per card)
  const initParticles = useCallback((count = 5) => {
    const types = ['dust', 'dust', 'ink', 'reed'];
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 700,
        y: 120 + Math.random() * 680,
        radius: 1.0 + Math.random() * 2.0,
        speedX: 45 + Math.random() * 65,
        speedY: (Math.random() - 0.3) * 16,
        bobAmp: 6 + Math.random() * 12,
        bobFreq: 1.2 + Math.random() * 2.0,
        bobPhase: Math.random() * Math.PI * 2,
        baseY: 120 + Math.random() * 680,
        alpha: 0.2 + Math.random() * 0.45,
        type: types[Math.floor(Math.random() * types.length)],
        length: 3 + Math.random() * 6,
        angle: (Math.random() - 0.5) * 0.5,
      });
    }
    return particles;
  }, []);

  // 2. Preload Warrior Assets & Check Settings
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    stateRef.current.reducedMotion = prefersReducedMotion;

    // Responsive particle count
    const isMobile = window.innerWidth <= 640;
    const isTablet = window.innerWidth <= 1024;
    const count = isMobile ? 3 : isTablet ? 4 : 6;
    stateRef.current.particles = initParticles(count);

    const urls = {
      char: `/images/warriors_concept/warrior_char_${id}.png`,
      cloth: `/images/warriors_concept/warrior_cloth_${id}.png`,
      body: `/images/warriors_concept/warrior_body_${id}.png`,
    };

    let cancelled = false;
    let loaded = 0;
    const imgs = {};
    Object.entries(urls).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (cancelled) return;
        imgs[key] = img;
        loaded++;
        if (loaded === 3) {
          stateRef.current.images = imgs;
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        console.warn(`Failed loading warrior asset: ${src}`);
      };
    });

    // 3. Intersection Observer for battery/performance savings
    return () => {
      // Late image loads must not update state after unmount.
      cancelled = true;
    };
  }, [id, initParticles]);

  // 4. Main Canvas Render Loop
  useEffect(() => {
    if (!isLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CW = 666;
    const CH = 870;
    canvas.width = CW;
    canvas.height = CH;

    const state = stateRef.current;
    const render = ({dt, reducedMotion}) => {
      state.reducedMotion = reducedMotion;
      state.waveTime += dt;
      const t = state.waveTime;
      state.gust = damp(state.gust, Math.min(1.4, windSystem.getState().gust), 2.2, dt);
      const gust = state.gust;
      // Clear frame
      ctx.clearRect(0, 0, CW, CH);

      // =============================================================
      // 1. RECONSTRUCTED CRIMSON CELESTIAL SUN & PARCHMENT MIST
      // Weathered Japanese woodblock red disc with subtle breathing glow
      // =============================================================
      const sunCenterX = 355;
      const sunCenterY = 325;
      const sunRadius = 215;

      // Breathing sun aura
      const sunPulse = 1.0 + 0.035 * Math.sin(t * 0.7 + index * 1.3);
      const outerHaloGrad = ctx.createRadialGradient(
        sunCenterX,
        sunCenterY,
        sunRadius * 0.6,
        sunCenterX,
        sunCenterY,
        sunRadius * 1.35 * sunPulse
      );
      outerHaloGrad.addColorStop(0, 'rgba(184, 34, 24, 0.45)');
      outerHaloGrad.addColorStop(0.5, 'rgba(184, 34, 24, 0.15)');
      outerHaloGrad.addColorStop(1, 'rgba(184, 34, 24, 0)');

      ctx.fillStyle = outerHaloGrad;
      ctx.beginPath();
      ctx.arc(sunCenterX, sunCenterY, sunRadius * 1.35 * sunPulse, 0, Math.PI * 2);
      ctx.fill();

      // Core Sun Disc
      const sunGrad = ctx.createRadialGradient(
        sunCenterX - 35,
        sunCenterY - 45,
        sunRadius * 0.15,
        sunCenterX,
        sunCenterY,
        sunRadius
      );
      sunGrad.addColorStop(0, '#B82218');
      sunGrad.addColorStop(0.65, '#9A1912');
      sunGrad.addColorStop(1, '#6E0E0A');

      ctx.save();
      ctx.beginPath();
      ctx.arc(sunCenterX, sunCenterY, sunRadius, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = sunGrad;
      ctx.fill();

      // Weathered woodblock horizontal texture lines
      ctx.strokeStyle = 'rgba(245, 235, 218, 0.22)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(150, 240);
      ctx.lineTo(560, 240);
      ctx.moveTo(130, 280);
      ctx.lineTo(580, 280);
      ctx.moveTo(135, 320);
      ctx.lineTo(575, 320);
      ctx.moveTo(160, 365);
      ctx.lineTo(550, 365);
      ctx.moveTo(190, 410);
      ctx.lineTo(520, 410);
      ctx.stroke();

      // Atmospheric mist wash over lower sun
      const sunMistGrad = ctx.createLinearGradient(0, 340, 0, 540);
      sunMistGrad.addColorStop(0, 'rgba(238, 228, 207, 0)');
      sunMistGrad.addColorStop(0.7, 'rgba(238, 228, 207, 0.35)');
      sunMistGrad.addColorStop(1, 'rgba(238, 228, 207, 0.75)');
      ctx.fillStyle = sunMistGrad;
      ctx.fillRect(100, 340, 500, 200);

      ctx.restore();

      // Subtle outer antique boundary line
      ctx.strokeStyle = 'rgba(126, 18, 14, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(sunCenterX, sunCenterY, sunRadius, 0, Math.PI * 2);
      ctx.stroke();

      // =============================================================
      // 2. BILLOWING CLOTH PHYSICS (Canvas 2D Traveling Wave Slices)
      // The torn cape / loose fabric on the left billows into the wind
      // =============================================================
      const { cloth, body } = state.images;
      const { clothRootX, clothSpanX, waveSpeed, waveAmp, gustMult, clothSlices } = state.params;

      if (cloth) drawWindCloth(ctx, cloth, {
        width: CW, height: CH, root: clothRootX, span: clothSpanX,
        time: t, gust, amplitude: waveAmp * 0.65, speed: waveSpeed * 0.65,
      });

      // =============================================================
      // 3. CORE RIGID SAMURAI WARRIOR (BODY, ARMOR, HELMET, WEAPONS)
      // Must remain 100% rigid, unwarped, sharp, and stable
      // Subtle physical breathing motion (1.2px)
      // =============================================================
      if (body) {
        const breathY = 0; // Keep feet, armor and cloth attachment on the same fixed anchor.
        ctx.drawImage(body, 0, breathY, CW, CH);
      }

      // =============================================================
      // 4. CINEMATIC WIND PARTICLES (Dust Motes, Ink Flecks, Reeds)
      // Traveling from right to left
      // =============================================================
      const particleGustSpeed = 1.0 + 1.3 * gust;
      (reducedMotion ? [] : state.particles).forEach((p) => {
        p.x -= p.speedX * particleGustSpeed * dt;
        const bob = Math.sin(t * p.bobFreq + p.bobPhase) * p.bobAmp;
        const y = p.baseY + bob + p.speedY * dt;
        p.baseY += p.speedY * dt;

        // Recycle when exiting left border
        if (p.x < -20) {
          p.x = CW + 20 + Math.random() * 30;
          p.baseY = 120 + Math.random() * 680;
          p.bobPhase = Math.random() * Math.PI * 2;
        }

        ctx.save();
        ctx.translate(p.x, y);

        if (p.type === 'ink') {
          ctx.fillStyle = `rgba(20, 21, 24, ${p.alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'dust') {
          const dustGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius * 2);
          dustGrad.addColorStop(0, `rgba(255, 248, 230, ${p.alpha * 0.85})`);
          dustGrad.addColorStop(0.5, `rgba(224, 200, 150, ${p.alpha * 0.4})`);
          dustGrad.addColorStop(1, 'rgba(210, 180, 130, 0)');
          ctx.fillStyle = dustGrad;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'reed') {
          ctx.rotate(p.angle);
          ctx.strokeStyle = `rgba(70, 60, 48, ${p.alpha * 0.7})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(-p.length * 0.5, 0);
          ctx.lineTo(p.length * 0.5, 0);
          ctx.stroke();
        }

        ctx.restore();
      });
    };

    return createArtworkLoop(containerRef.current, render);
  }, [isLoaded, id, index]);

  return (
    <div ref={containerRef} className="warrior-portrait-wrapper" aria-hidden="true">
      {/* 60 FPS Canvas with living cloth physics, glowing sun, and particles */}
      <canvas
        ref={canvasRef}
        className={`warrior-living-canvas ${isLoaded ? 'is-ready' : 'is-loading'}`}
        width={666}
        height={870}
      />

      {/* Immediate Placeholder before canvas assets load */}
      {!isLoaded && (
        <img
          src={`/images/warriors_concept/warrior_char_${id}.png`}
          alt={warrior.name}
          className="warrior-portrait-fallback"
          loading="eager"
          draggable="false"
        />
      )}

      {/* Vertical Japanese Calligraphy at Top-Left */}
      <div className="warrior-vertical-kanji">
        {warrior.japanese.replace(/\s+/g, '')}
      </div>

      {/* Traditional Cinnabar Hanko Seal at Right */}
      <div className="warrior-cinnabar-seal">
        <div className="seal-box">
          <span className="seal-char">侍</span>
        </div>
      </div>
    </div>
  );
}
