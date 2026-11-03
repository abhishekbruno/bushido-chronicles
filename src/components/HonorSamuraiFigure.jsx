import React, { useRef, useState, useEffect, useCallback } from 'react';
import { sound } from '../utils/soundEngine';

/**
 * HonorSamuraiFigure — 武士の威厳 (The Living Dignity of the Warrior)
 * -----------------------------------------------------------------------------
 * A living cinematic 2.5D Japanese ink composition uniting the hand-drawn Samurai
 * sketch masterwork with an animated atmospheric sumi-e environment:
 *
 *  - Distant mountain ridges and soaring cranes
 *  - Weathered Celestial Crimson Sun with 10s breathing halo
 *  - Atmospheric drifting cloud ribbons
 *  - Layered ground plinth with soft contact shadow
 *  - Physically simulated billowing cloth waves on the Samurai's torn cape (Canvas 2D)
 *  - Real-time traveling sine waves: right-to-left wind force, gusts, micro-flutter
 *  - Anatomically stable core: armor, kabuto, katana blade, and legs remain 100% rigid
 *  - Waist rope tassels with physical pendulum sway
 *  - Cinematic wind particles: sumi-e ink flecks, warm dust motes, drifting reed slivers
 *  - Interactive Katana Blade Glint Shimmer triggered on click & hover
 *  - 2.5D mouse-tracking perspective tilt
 *  - Traditional Japanese Hanko seals (武士 · 名誉) & vertical calligraphy
 */
export default function HonorSamuraiFigure({ className = '', onInteract }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isGlinting, setIsGlinting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [layersLoaded, setLayersLoaded] = useState(false);

  // References for animation loop state
  const animStateRef = useRef({
    rafId: null,
    lastTime: 0,
    waveTime: 0,
    gust: 0,
    gustTarget: 0,
    nextGustTime: 4.0,
    gustDuration: 1.8,
    gustElapsed: 0,
    glintProgress: 1.0, // 0..1 when active, 1 when done
    isVisible: true,
    reducedMotion: false,
    particles: [],
    images: {
      body: null,
      capeLower: null,
      capeUpper: null,
      capeRight: null,
      tassels: null,
    },
  });

  // Smooth mouse tilt effect
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 6, y: -y * 6 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const triggerBladeGlint = useCallback(() => {
    setIsGlinting(true);
    sound.playBladeGlint();
    animStateRef.current.glintProgress = 0.0;
    setTimeout(() => {
      setIsGlinting(false);
    }, 1300);
  }, []);

  const handleClick = (e) => {
    triggerBladeGlint();
    if (onInteract) onInteract(e);
  };

  // 1. Initialize Particles
  const initParticles = useCallback((count = 22) => {
    const types = ['ink', 'ink', 'dust', 'dust', 'reed'];
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 850,
        y: 80 + Math.random() * 850,
        radius: 1.0 + Math.random() * 2.2,
        speedX: 55 + Math.random() * 95, // moves right to left (vx < 0)
        speedY: (Math.random() - 0.35) * 22,
        bobAmp: 8 + Math.random() * 16,
        bobFreq: 1.2 + Math.random() * 2.4,
        bobPhase: Math.random() * Math.PI * 2,
        baseY: 80 + Math.random() * 850,
        alpha: 0.25 + Math.random() * 0.55,
        type: types[Math.floor(Math.random() * types.length)],
        length: 4 + Math.random() * 8, // for reed
        angle: (Math.random() - 0.5) * 0.6,
        rotSpeed: (Math.random() - 0.5) * 2.5,
      });
    }
    return particles;
  }, []);

  // 2. Preload Character Layers & Start Canvas Engine
  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    animStateRef.current.reducedMotion = prefersReducedMotion;

    // Responsive particle count
    const isMobile = window.innerWidth <= 640;
    const isTablet = window.innerWidth <= 1024;
    const particleCount = isMobile ? 7 : isTablet ? 12 : 22;
    animStateRef.current.particles = initParticles(particleCount);

    const layerUrls = {
      body: '/images/samurai_layers/samurai_body.png',
      capeLower: '/images/samurai_layers/samurai_cape_lower.png',
      capeUpper: '/images/samurai_layers/samurai_cape_upper.png',
      capeRight: '/images/samurai_layers/samurai_cape_right.png',
      tassels: '/images/samurai_layers/samurai_tassels.png',
    };

    let loadedCount = 0;
    const totalLayers = Object.keys(layerUrls).length;
    const loadedImgs = {};

    Object.entries(layerUrls).forEach(([key, url]) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedImgs[key] = img;
        loadedCount++;
        if (loadedCount === totalLayers) {
          animStateRef.current.images = loadedImgs;
          setLayersLoaded(true);
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load samurai layer: ${url}`);
      };
    });

    // 3. Intersection Observer to pause RAF when out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          animStateRef.current.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (animStateRef.current.rafId) {
        cancelAnimationFrame(animStateRef.current.rafId);
      }
    };
  }, [initParticles]);

  // 4. Main Canvas Cloth Physics & Particle Render Loop
  useEffect(() => {
    if (!layersLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CW = 819;
    const CH = 1024;
    canvas.width = CW;
    canvas.height = CH;

    const state = animStateRef.current;
    state.lastTime = performance.now();

    const render = (now) => {
      state.rafId = requestAnimationFrame(render);

      if (!state.isVisible) {
        state.lastTime = now;
        return;
      }

      const dt = Math.min((now - state.lastTime) / 1000, 0.08); // cap dt
      state.lastTime = now;

      // Advance wave time
      const timeScale = state.reducedMotion ? 0.35 : 1.0;
      state.waveTime += dt * timeScale;
      const t = state.waveTime;

      // -------------------------------------------------------------
      // Dynamic Wind Gust Engine (Right-to-Left Gust Cycle)
      // -------------------------------------------------------------
      if (t >= state.nextGustTime) {
        state.gustElapsed += dt;
        const p = state.gustElapsed / state.gustDuration;
        if (p <= 1.0) {
          // Bell curve gust profile: smooth onset, powerful peak, gradual tail
          state.gust = Math.sin(p * Math.PI) * 0.95;
        } else {
          state.gust = 0;
          state.gustElapsed = 0;
          // Schedule next gust between 5.5s and 8.0s
          state.nextGustTime = t + 5.5 + Math.random() * 2.5;
        }
      } else {
        state.gust = 0;
      }
      const gust = state.gust;

      // Advance blade glint progress if active
      if (state.glintProgress < 1.0) {
        state.glintProgress = Math.min(1.0, state.glintProgress + dt / 1.15);
      }

      // Clear frame
      ctx.clearRect(0, 0, CW, CH);

      const { capeLower, capeUpper, capeRight, body, tassels } = state.images;

      // =============================================================
      // LAYER 1: UPPER CAPE WING (Left Shoulder / Torn Wing)
      // Root at x ≈ 230px, tip billowing out to x ≈ 0px
      // =============================================================
      if (capeUpper) {
        const numSlicesUpper = 36;
        const spanX = 240;
        const sliceW = spanX / numSlicesUpper;
        const xRoot = 230;

        for (let i = 0; i < numSlicesUpper; i++) {
          const sx = i * sliceW;
          const sw = sliceW + 0.6; // slight subpixel overlap
          const u = Math.max(0, Math.min(1, (xRoot - sx) / xRoot));
          const w = Math.pow(u, 1.3);

          // Delayed traveling wave from right to left
          const phase = t * 2.6 + 0.019 * (xRoot - sx);
          const dy =
            w *
              (9.0 * Math.sin(phase) +
                3.8 * Math.sin(2.4 * phase + 0.9) +
                2.2 * Math.sin(6.8 * phase) * u) *
              (1.0 + 1.1 * gust) -
            6.5 * w * gust;
          const dx = -w * (6.5 * (1 - Math.cos(phase)) + 12.0 * gust * w + 2.5 * Math.sin(1.8 * phase));

          ctx.drawImage(capeUpper, sx, 0, sw, CH, sx + dx, dy, sw, CH);
        }
      }

      // =============================================================
      // LAYER 2: RIGHT CAPE FLAP (Behind Right Arm / Elbow)
      // Gentle flutter on the windward side
      // =============================================================
      if (capeRight) {
        const numSlicesRight = 24;
        const startX = 645;
        const spanX = CW - startX;
        const sliceW = spanX / numSlicesRight;

        for (let i = 0; i < numSlicesRight; i++) {
          const sx = startX + i * sliceW;
          const sw = sliceW + 0.6;
          const u = Math.max(0, Math.min(1, (sx - startX) / (spanX * 0.85)));
          const w = Math.pow(u, 1.25);

          const phase = t * 2.8 + 0.02 * (sx - startX);
          const dy = w * (5.0 * Math.sin(phase) + 2.4 * Math.sin(2.3 * phase + 0.6)) * (1.0 + 0.6 * gust);
          const dx = -w * (3.5 * (1 - Math.cos(phase * 0.8)) + 7.0 * gust);

          ctx.drawImage(capeRight, sx, 0, sw, CH, sx + dx, dy, sw, CH);
        }
      }

      // =============================================================
      // LAYER 3: LOWER BILLOWING FLORAL CAPE (Behind Katana & Leg)
      // Root at x ≈ 290px, tip billowing out to x ≈ 0px
      // Rich traveling waves, tip snapping, and vertical gust lift
      // =============================================================
      if (capeLower) {
        const numSlicesLower = 50;
        const spanX = 310;
        const sliceW = spanX / numSlicesLower;
        const xRoot = 290;

        for (let i = 0; i < numSlicesLower; i++) {
          const sx = i * sliceW;
          const sw = sliceW + 0.6;
          const u = Math.max(0, Math.min(1, (xRoot - sx) / xRoot));
          const w = Math.pow(u, 1.35);

          // Wave equation: Traveling right-to-left wave with phase delay
          const phase = t * 2.3 + 0.016 * (xRoot - sx);
          const dy =
            w *
              (13.5 * Math.sin(phase) +
                5.8 * Math.sin(2.3 * phase + 1.2) +
                2.8 * Math.sin(6.6 * phase) * u) *
              (1.0 + 1.25 * gust) -
            11.0 * w * gust; // lifts cape upward as wind gust accelerates
          const dx = -w * (8.0 * (1 - Math.cos(phase)) + 16.5 * gust * w + 3.2 * Math.sin(1.6 * phase));

          ctx.drawImage(capeLower, sx, 0, sw, CH, sx + dx, dy, sw, CH);
        }
      }

      // =============================================================
      // LAYER 4: CORE RIGID SAMURAI WARRIOR (BODY, KATANA, ARMOR)
      // Must remain 100% rigid, unwarped, crisp, and stable
      // =============================================================
      if (body) {
        ctx.drawImage(body, 0, 0, CW, CH);
      }

      // =============================================================
      // LAYER 5: WAIST ROPE TASSELS (Physical Pendulum Sway)
      // Left tassel knot: (527, 480) | Right tassel knot: (640, 460)
      // =============================================================
      if (tassels) {
        const tasselAngle =
          -0.035 * (1.0 + 1.8 * gust) +
          0.022 * Math.sin(t * 3.2) +
          0.01 * Math.sin(t * 6.5);

        // Left Tassel
        ctx.save();
        ctx.translate(527, 480);
        ctx.rotate(tasselAngle);
        ctx.drawImage(tassels, 498, 478, 56, 85, -29, -2, 56, 85);
        ctx.restore();

        // Right Tassel
        ctx.save();
        ctx.translate(640, 460);
        ctx.rotate(tasselAngle * 0.85);
        ctx.drawImage(tassels, 614, 458, 52, 85, -26, -2, 52, 85);
        ctx.restore();
      }

      // =============================================================
      // LAYER 6: KATANA BLADE GLINT SHIMMER (Interactive Ray)
      // Sweeps along the Katana blade from hilt (335, 510) to tip (780, 745)
      // =============================================================
      if (state.glintProgress < 1.0) {
        const gp = state.glintProgress;
        const hiltX = 335;
        const hiltY = 510;
        const tipX = 780;
        const tipY = 745;

        const curX = hiltX + (tipX - hiltX) * gp;
        const curY = hiltY + (tipY - hiltY) * gp;
        const glintOpacity = Math.sin(gp * Math.PI);

        ctx.save();
        ctx.translate(curX, curY);
        ctx.rotate(0.48); // angle of katana blade

        // Core brilliant flare
        const flareGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 38);
        flareGrad.addColorStop(0, `rgba(255, 255, 255, ${glintOpacity * 0.95})`);
        flareGrad.addColorStop(0.35, `rgba(255, 240, 180, ${glintOpacity * 0.7})`);
        flareGrad.addColorStop(0.7, `rgba(212, 175, 55, ${glintOpacity * 0.35})`);
        flareGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');

        ctx.fillStyle = flareGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 38, 0, Math.PI * 2);
        ctx.fill();

        // Elongated blade shimmer line
        ctx.strokeStyle = `rgba(255, 255, 255, ${glintOpacity * 0.9})`;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-60, 0);
        ctx.lineTo(60, 0);
        ctx.stroke();

        ctx.restore();
      }

      // =============================================================
      // LAYER 7: CINEMATIC WIND PARTICLES & SUMI-E INK FLECKS
      // Flow strictly from RIGHT to LEFT across the canvas
      // Accelerate during gusts
      // =============================================================
      const gustSpeedMult = 1.0 + 1.45 * gust;
      state.particles.forEach((p) => {
        // Horizontal translation right -> left
        p.x -= p.speedX * gustSpeedMult * dt;

        // Bobbing vertical wave
        p.angle += p.rotSpeed * dt;
        const bob = Math.sin(t * p.bobFreq + p.bobPhase) * p.bobAmp;
        const y = p.baseY + bob + p.speedY * dt;
        p.baseY += p.speedY * dt;

        // Recycle particle when exiting left boundary
        if (p.x < -30) {
          p.x = CW + 20 + Math.random() * 40;
          p.baseY = 60 + Math.random() * 880;
          p.bobPhase = Math.random() * Math.PI * 2;
        }

        ctx.save();
        ctx.translate(p.x, y);

        if (p.type === 'ink') {
          // Fine sumi-e ink fleck
          ctx.fillStyle = `rgba(22, 23, 26, ${p.alpha * (0.8 + 0.2 * gust)})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'dust') {
          // Warm glowing parchment dust mote
          const dustGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius * 2.2);
          dustGrad.addColorStop(0, `rgba(255, 248, 225, ${p.alpha * 0.9})`);
          dustGrad.addColorStop(0.5, `rgba(228, 205, 155, ${p.alpha * 0.45})`);
          dustGrad.addColorStop(1, 'rgba(210, 180, 130, 0)');
          ctx.fillStyle = dustGrad;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'reed') {
          // Tiny elongated dried reed / bamboo grass fiber
          ctx.rotate(p.angle);
          ctx.strokeStyle = `rgba(60, 52, 42, ${p.alpha * 0.75})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(-p.length * 0.5, 0);
          ctx.lineTo(p.length * 0.5, 0);
          ctx.stroke();
        }

        ctx.restore();
      });
    };

    state.rafId = requestAnimationFrame(render);

    return () => {
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
      }
    };
  }, [layersLoaded]);

  return (
    <div
      ref={containerRef}
      className={`honor-samurai-figure-mount ${className} ${isGlinting ? 'glint-active' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="img"
      aria-label="Master ink-and-lacquer portrait of a lone armored Samurai standing with quiet dignity before a crimson sun"
    >
      <div
        className="honor-samurai-stage-3d"
        style={{
          transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.8s ease-out',
        }}
      >
        {/* ============================================================== */}
        {/* 1. ATMOSPHERIC BACKDROP & CELESTIAL SUN (SVG LAYER)           */}
        {/* ============================================================== */}
        <svg
          className="honor-samurai-backdrop-svg"
          viewBox="0 0 800 1020"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Parchment Sky Atmosphere */}
            <linearGradient id="hnSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F6EFE3" />
              <stop offset="35%" stopColor="#EFE6D6" />
              <stop offset="70%" stopColor="#E6DCC8" />
              <stop offset="100%" stopColor="#D8CCB6" />
            </linearGradient>

            {/* Crimson Sun Halo & Core */}
            <radialGradient id="hnSunOuterHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C5282F" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#C5282F" stopOpacity="0.22" />
              <stop offset="75%" stopColor="#C5282F" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#C5282F" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="hnSunCoreGrad" cx="42%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#E5353D" />
              <stop offset="45%" stopColor="#C81824" />
              <stop offset="82%" stopColor="#960E18" />
              <stop offset="100%" stopColor="#68060D" />
            </radialGradient>

            {/* Mountain Ridge Washes */}
            <linearGradient id="hnMountainWash1" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#8A8072" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#B2A796" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#DDD4C4" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="hnMountainWash2" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#5E5548" stopOpacity="0.65" />
              <stop offset="65%" stopColor="#8E8272" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#DDD4C4" stopOpacity="0" />
            </linearGradient>

            {/* Soft Ink Mist Filter */}
            <filter id="hnInkSoftBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>

          {/* Archival Parchment Canvas */}
          <rect width="800" height="1020" fill="url(#hnSkyGrad)" />

          {/* Distant Mountain Peak (Left) */}
          <path
            d="M -40 550 C 30 460, 95 370, 160 300 C 185 280, 215 305, 240 350 C 275 420, 320 500, 380 570 L 380 750 L -40 750 Z"
            fill="url(#hnMountainWash1)"
          />

          {/* Sharp High Mountain Ridge (Right) */}
          <path
            d="M 440 570 C 510 440, 580 330, 640 250 C 665 220, 695 250, 720 320 C 750 390, 780 480, 810 560 L 810 750 L 440 750 Z"
            fill="url(#hnMountainWash2)"
          />

          {/* Distant Flying Sumi-e Cranes */}
          <g opacity="0.65" transform="translate(130, 180) scale(0.85)">
            <path d="M 0 0 C 8 -10, 20 -15, 34 -9 C 24 -5, 12 -3, 0 0 Z" fill="#1C1E20" />
            <path d="M 0 0 C -8 -10, -20 -15, -34 -9 C -24 -5, -12 -3, 0 0 Z" fill="#1C1E20" />
            <ellipse cx="0" cy="1" rx="2.5" ry="5.5" fill="#1C1E20" />
          </g>
          <g opacity="0.45" transform="translate(185, 145) scale(0.65)">
            <path d="M 0 0 C 8 -10, 20 -15, 34 -9 C 24 -5, 12 -3, 0 0 Z" fill="#1C1E20" />
            <path d="M 0 0 C -8 -10, -20 -15, -34 -9 C -24 -5, -12 -3, 0 0 Z" fill="#1C1E20" />
            <ellipse cx="0" cy="1" rx="2.5" ry="5.5" fill="#1C1E20" />
          </g>
          <g opacity="0.35" transform="translate(220, 170) scale(0.5)">
            <path d="M 0 0 C 8 -10, 20 -15, 34 -9 C 24 -5, 12 -3, 0 0 Z" fill="#1C1E20" />
            <path d="M 0 0 C -8 -10, -20 -15, -34 -9 C -24 -5, -12 -3, 0 0 Z" fill="#1C1E20" />
            <ellipse cx="0" cy="1" rx="2.5" ry="5.5" fill="#1C1E20" />
          </g>

          {/* CELESTIAL CRIMSON SUN */}
          <g id="CelestialSunGroup" className="honor-sun-assembly">
            {/* Outer Breathing Aura (8s cycle) */}
            <circle
              cx="470"
              cy="380"
              r="260"
              fill="url(#hnSunOuterHalo)"
              className="honor-sun-pulse-aura"
            />
            {/* Main Sun Disc */}
            <circle cx="470" cy="380" r="185" fill="url(#hnSunCoreGrad)" />
            {/* Fine Antique Edge Ring */}
            <circle
              cx="470"
              cy="380"
              r="184.5"
              fill="none"
              stroke="#7C0B14"
              strokeWidth="1.2"
              opacity="0.6"
            />

            {/* Sumi-e Weathered Sun Texture Bands (Ancient Woodblock Lines) */}
            <g stroke="#FDE5D6" strokeWidth="1.6" fill="none" opacity="0.18" strokeLinecap="round">
              <path d="M 350 320 Q 470 300, 590 320" />
              <path d="M 320 360 Q 470 340, 615 360" />
              <path d="M 310 400 Q 470 380, 625 400" />
              <path d="M 330 445 Q 470 425, 605 445" />
              <path d="M 370 485 Q 470 465, 565 485" />
            </g>
            <g stroke="#5E050B" strokeWidth="2.2" fill="none" opacity="0.45" strokeLinecap="round">
              <path d="M 305 375 Q 330 350, 365 365" />
              <path d="M 570 395 Q 600 415, 625 380" />
              <path d="M 435 225 C 425 265, 435 310, 455 345" stroke="#7A0912" strokeWidth="2.5" />
            </g>
          </g>

          {/* Horizontal Drifting Washi Mist Ribbons */}
          <g className="honor-mist-ribbons" opacity="0.6">
            <path
              d="M -50 490 Q 230 460, 470 495 T 850 470 L 850 560 Q 480 530, 210 550 T -50 540 Z"
              fill="#F4EDE0"
              filter="url(#hnInkSoftBlur)"
            />
            <path
              d="M -30 610 Q 260 570, 520 605 T 850 585 L 850 680 Q 490 650, 230 670 T -30 660 Z"
              fill="#EDE3D2"
              filter="url(#hnInkSoftBlur)"
            />
          </g>

          {/* Broad Ground Contact Shadow Plinth */}
          <g id="GroundContactPlinth">
            <ellipse
              cx="400"
              cy="955"
              rx="310"
              ry="42"
              fill="#121316"
              opacity="0.45"
              filter="url(#hnInkSoftBlur)"
            />
            <ellipse
              cx="400"
              cy="950"
              rx="210"
              ry="22"
              fill="#060708"
              opacity="0.75"
            />
          </g>
        </svg>

        {/* ============================================================== */}
        {/* 2. THE LIVING SAMURAI CANVAS ENGINE (CLOTH PHYSICS + PARTICLES) */}
        {/* ============================================================== */}
        <div className="honor-samurai-warrior-layer">
          {/* Animated 60 FPS Canvas with traveling cloth waves & wind particles */}
          <canvas
            ref={canvasRef}
            className={`honor-samurai-cloth-canvas ${layersLoaded ? 'is-ready' : 'is-loading'}`}
            width={819}
            height={1024}
            aria-hidden="true"
          />

          {/* Instant Placeholder Image during initial asset load */}
          {!layersLoaded && (
            <img
              src="/images/honor-samurai-sketch.png"
              alt="Hand-drawn ink samurai warrior with drawn katana and kabuto helmet"
              className="honor-samurai-sketch-img"
              loading="eager"
              draggable="false"
            />
          )}

          {/* Interactive Katana Blade Glint Shimmer Streak */}
          <div className={`honor-blade-glint-streak ${isGlinting ? 'is-animating' : ''}`} aria-hidden="true">
            <span className="glint-flare" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. FOREGROUND MIST, CALLIGRAPHY & TRADITIONAL HANKO SEALS     */}
        {/* ============================================================== */}
        <div className="honor-samurai-foreground-overlay" aria-hidden="true">
          {/* Vertical Traditional Japanese Calligraphy Inscription */}
          <div className="honor-vertical-calligraphy">
            <span className="calligraphy-char">武</span>
            <span className="calligraphy-char">士</span>
            <span className="calligraphy-char">の</span>
            <span className="calligraphy-char">名</span>
            <span className="calligraphy-char">誉</span>
          </div>

          {/* Traditional Crimson Cinnabar Hanko Seals */}
          <div className="honor-hanko-seal-badge">
            <div className="hanko-box">
              <span className="hanko-char">名誉</span>
            </div>
            <span className="hanko-label">MEIYO SEAL</span>
          </div>

          {/* Specimen Archival Code Plate */}
          <div className="honor-specimen-plate">
            <span className="specimen-code">NIPPON KOKORO ARCHIVES · SPECIMEN 06</span>
            <span className="specimen-virtue">HONOR EMBODIED (武士道)</span>
          </div>

          {/* Interactive Tap Hint */}
          <div className="honor-interactive-hint">
            <span className="hint-pulse" />
            <span className="hint-text">CLICK TO DRAW THE BLADE · 抜刀</span>
          </div>
        </div>
      </div>
    </div>
  );
}
