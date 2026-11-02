import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Maximize2, Minimize2, Sparkles, Wind, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/soundEngine';

/**
 * ZenRestraintWallpaper
 * -----------------------------------------------------------------------------
 * A living Japanese Zen painting converted into an ambient live wallpaper.
 * Preserves the exact composition of "The Way of Restraint" while delivering
 * continuous, organic, multi-layered ambient motion:
 *  - Breathing crimson sun with warm multi-tier radiant glow halo
 *  - Layered rolling hills with slow ambient parallax & drifting valley mist
 *  - Timeless Shinto Torii gate with dynamic mist interactions
 *  - Articulated black bonsai / branch with independent limb sways & foliage flutters
 *  - Poetic distant Zen birds (Chidori) crossing the sky in gentle arcs
 *  - Dedicated 60 FPS atmospheric particle system (ink flecks, gold dust, crimson embers, Momiji leaves)
 *  - Butter-smooth mouse perspective parallax with spring physics
 *  - Fullscreen "Zen Stillness Mode" for desktop wallpaper contemplation
 */
export default function ZenRestraintWallpaper() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const isVisibleRef = useRef(true);

  // Entrance & Fullscreen state
  const [hasEntered, setHasEntered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Mouse parallax physics (lerped)
  const mouseRef = useRef({ targetX: 0, targetY: 0, currX: 0, currY: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Continuous animation clock
  const timeRef = useRef(0);
  const [ambientTick, setAmbientTick] = useState(0);

  // ---------------------------------------------------------------------------
  // 1. Intersection Observer: Pause offscreen for maximum battery / CPU efficiency
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !hasEntered) {
          setHasEntered(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasEntered]);

  // ---------------------------------------------------------------------------
  // 2. Mouse Tracking with Smooth Spring Interpolation
  // ---------------------------------------------------------------------------
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to +0.5
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  }, []);

  // ---------------------------------------------------------------------------
  // 3. Atmospheric Particle System (Canvas)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 750);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool: 28 tranquil ambient particles
    const PARTICLE_COUNT = 32;
    const particles = [];

    // Pre-create maple leaf shape path
    const createLeafPath = () => {
      const p = new Path2D();
      p.moveTo(0, -10);
      p.bezierCurveTo(4, -8, 8, -4, 9, 0);
      p.bezierCurveTo(9, 6, 4, 10, 0, 11);
      p.bezierCurveTo(-4, 10, -9, 6, -9, 0);
      p.bezierCurveTo(-8, -4, -4, -8, 0, -10);
      return p;
    };
    const leafPath = createLeafPath();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isLeaf = i < 4; // 4 falling Momiji maple leaves
      const isCrimson = !isLeaf && i < 12; // 8 glowing crimson embers
      const isGold = !isLeaf && !isCrimson && i < 20; // 8 gold dust flecks
      // Remaining 12 are soft sumi-e ink flecks

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35 + (isLeaf ? 0.3 : 0.05),
        vy: isLeaf ? 0.4 + Math.random() * 0.45 : -(0.15 + Math.random() * 0.35),
        size: isLeaf ? 7 + Math.random() * 4 : 1.2 + Math.random() * 2.5,
        opacity: 0.15 + Math.random() * 0.55,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        type: isLeaf ? 'leaf' : isCrimson ? 'crimson' : isGold ? 'gold' : 'ink',
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.8 + Math.random() * 1.2,
      });
    }

    let localClock = 0;

    const render = (now) => {
      animFrameRef.current = requestAnimationFrame(render);

      if (!isVisibleRef.current) return;

      const dt = Math.min(0.064, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;
      localClock += dt;
      timeRef.current = localClock;

      // Smooth mouse lerp
      const m = mouseRef.current;
      m.currX += (m.targetX - m.currX) * 0.08;
      m.currY += (m.targetY - m.currY) * 0.08;
      setParallax({ x: m.currX, y: m.currY });

      // Update ambient clock state every ~60ms for smooth SVG renders
      if (Math.floor(localClock * 16) !== Math.floor((localClock - dt) * 16)) {
        setAmbientTick(localClock);
      }

      ctx.clearRect(0, 0, width, height);

      // Render & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Natural wind sway
        p.swayPhase += p.swaySpeed * dt;
        const swayX = Math.sin(p.swayPhase) * (p.type === 'leaf' ? 1.2 : 0.4);

        p.x += (p.vx + swayX) * (width / 600);
        p.y += p.vy * (height / 750);
        p.rot += p.vRot;

        // Wrap around boundaries seamlessly
        if (p.type === 'leaf') {
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;
        } else {
          if (p.y < -15) {
            p.y = height + 15;
            p.x = Math.random() * width;
          }
          if (p.x > width + 15) p.x = -15;
          if (p.x < -15) p.x = width + 15;
        }

        // Draw particle based on type
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.type === 'leaf') {
          ctx.scale(p.size / 10, (p.size / 10) * Math.cos(p.rot * 1.5));
          ctx.fillStyle = `rgba(180, 20, 15, ${p.opacity * 0.85})`;
          ctx.fill(leafPath);
          ctx.strokeStyle = `rgba(80, 5, 5, ${p.opacity * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.stroke(leafPath);
        } else if (p.type === 'crimson') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(217, 4, 22, ${p.opacity * 0.8})`;
          ctx.shadowColor = 'rgba(217, 4, 22, 0.6)';
          ctx.shadowBlur = 6;
          ctx.fill();
        } else if (p.type === 'gold') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity * 0.75})`;
          ctx.fill();
        } else {
          // Ink fleck with slight organic distortion
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.7, p.rot, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(15, 16, 20, ${p.opacity * 0.55})`;
          ctx.fill();
        }

        ctx.restore();
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 4. Keyboard Listener: ESC exits fullscreen
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // ---------------------------------------------------------------------------
  // 5. Ambient Motion Calculations
  // ---------------------------------------------------------------------------
  const t = ambientTick;

  // Crimson Sun breathing aura
  const sunPulse = Math.sin(t * 0.9) * 0.035; // ±3.5% scale
  const sunGlowAlpha = 0.82 + Math.sin(t * 0.7) * 0.12; // 0.70 to 0.94
  const sunFloatY = Math.sin(t * 0.6) * 3.5; // slow vertical drift
  const sunParallaxX = -parallax.x * 12;
  const sunParallaxY = -parallax.y * 8 + sunFloatY;

  // Mountain & Hill Parallax offsets
  const farHillParallaxX = -parallax.x * 6 + Math.sin(t * 0.3) * 4;
  const farHillParallaxY = -parallax.y * 3;

  const midHillParallaxX = -parallax.x * 11;
  const midHillParallaxY = -parallax.y * 6;

  const nearHillParallaxX = -parallax.x * 16;
  const nearHillParallaxY = -parallax.y * 9;

  // Torii Gate micro-shift with mid hill
  const toriiParallaxX = midHillParallaxX;
  const toriiParallaxY = midHillParallaxY;

  // Articulated Bonsai Wind Sway Calculations
  // Base trunk flexes gently
  const trunkRot = Math.sin(t * 0.65) * 0.7 + parallax.x * 2.5; // -0.7deg to +0.7deg
  // Secondary main limb
  const mainLimbRot = Math.sin(t * 0.65 - 0.4) * 1.3 + parallax.x * 3.5;
  // Foliage cluster 1 (top left, near sun)
  const pad1Rot = Math.sin(t * 1.1) * 2.2;
  const pad1Y = Math.sin(t * 0.95) * 1.8;
  // Foliage cluster 2 (middle left)
  const pad2Rot = Math.sin(t * 1.25 + 0.5) * 2.4;
  const pad2Y = Math.sin(t * 1.05 + 0.3) * 1.5;
  // Foliage cluster 3 (lower left)
  const pad3Rot = Math.sin(t * 1.0 + 1.1) * 1.9;
  const pad3Y = Math.sin(t * 0.85 + 0.8) * 1.4;
  // Foliage cluster 4 (right crest)
  const pad4Rot = Math.sin(t * 1.3 + 1.8) * 2.1;
  const pad4Y = Math.sin(t * 1.15 + 1.2) * 1.6;

  // Poetic Zen Birds Flight Path
  // Flapping wing cycle (5 Hz)
  const birdWingFlap = Math.sin(t * 14);
  // Flight loop: traverses rightwards across sun every ~20 seconds
  const birdCycleTime = ((t + 4.5) * 0.05) % 1; // 0 to 1 over 20s
  const birdActive = birdCycleTime < 0.75; // Visible during 75% of the loop
  const birdProg = birdCycleTime / 0.75;
  const birdX = -30 + birdProg * 660; // Fly from x=-30 to x=630
  const birdY = 165 + Math.sin(birdProg * Math.PI * 2.2) * 25 - birdProg * 35; // Gentle sine wave climb

  const toggleZenMode = () => {
    sound.playWoodenClick();
    if (!isFullscreen && sound.playZenChime) {
      sound.playZenChime();
    }
    setIsFullscreen(!isFullscreen);
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    const muted = sound.toggleMute();
    setIsAudioActive(!muted);
  };

  return (
    <div
      ref={containerRef}
      className={`zen-wallpaper-root ${isFullscreen ? 'is-fullscreen-zen-mode' : ''} ${hasEntered ? 'has-revealed' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="The Way of Restraint — Live Animated Japanese Zen Scene"
    >
      <div className="zen-wallpaper-card">
        {/* Decorative Crimson Corner Brackets */}
        <div className="frame-corner corner-tl" aria-hidden="true" />
        <div className="frame-corner corner-tr" aria-hidden="true" />
        <div className="frame-corner corner-bl" aria-hidden="true" />
        <div className="frame-corner corner-br" aria-hidden="true" />

        {/* Japanese Calligraphy Hanko Seal (武士魂 - Samurai Soul) */}
        <div className="legacy-hanko-seal" aria-hidden="true" title="武士魂 (Samurai Soul)">
          <span>武</span>
          <span>士</span>
          <span>魂</span>
        </div>

        {/* Ambient Mode Action Controls */}
        <div className="zen-card-controls">
          <button
            className="zen-control-btn interactive"
            onClick={toggleSound}
            title={isAudioActive ? 'Mute Zen Audio' : 'Unmute Zen Ambience'}
            aria-label="Toggle Zen Ambient Audio"
          >
            {isAudioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
          <button
            className="zen-control-btn interactive"
            onClick={toggleZenMode}
            title={isFullscreen ? 'Exit Fullscreen' : 'Zen Wallpaper Fullscreen Mode'}
            aria-label="Toggle Fullscreen Wallpaper"
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span className="btn-label">{isFullscreen ? 'EXIT' : 'ZEN STILLNESS'}</span>
          </button>
        </div>

        {/* Main Scenic Canvas & SVG Composition */}
        <div className="zen-scene-stage">
          {/* 1. Underlying Washi Paper Grain & Vignette Backdrop */}
          <div className="zen-washi-backdrop" />

          {/* 2. Interactive SVG Vector Artwork Layer */}
          <svg
            className="zen-scene-svg"
            viewBox="0 0 600 750"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Sun Radiant Core & Atmosphere Mist Filter */}
              <radialGradient id="zenSunCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EA1024" />
                <stop offset="65%" stopColor="#D90416" />
                <stop offset="90%" stopColor="#BA0313" />
                <stop offset="100%" stopColor="#9B0210" />
              </radialGradient>

              {/* Sun Outer Ambient Aura Halo */}
              <radialGradient id="zenSunAuraGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF3344" stopOpacity="0.45" />
                <stop offset="45%" stopColor="#D90416" stopOpacity="0.22" />
                <stop offset="75%" stopColor="#E2A662" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#EFE8D6" stopOpacity="0" />
              </radialGradient>

              {/* Gentle Valley Mist Fog Gradient */}
              <linearGradient id="zenValleyMistGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#EFE8D6" stopOpacity="0" />
                <stop offset="50%" stopColor="#F5EFE1" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#EFE8D6" stopOpacity="0" />
              </linearGradient>

              {/* Distant Mountains Ethereal Ink Wash */}
              <linearGradient id="zenFarMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D9CEBA" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#BFB39B" stopOpacity="0.9" />
              </linearGradient>

              {/* Midground Hill Ink Wash */}
              <linearGradient id="zenMidHillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#AA9C84" />
                <stop offset="100%" stopColor="#877862" />
              </linearGradient>

              {/* Foreground Dark Sumi-e Earth */}
              <linearGradient id="zenNearHillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5E5343" />
                <stop offset="100%" stopColor="#2E2820" />
              </linearGradient>

              {/* Bonsai Pine Bark Texture */}
              <linearGradient id="zenBonsaiBarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E2024" />
                <stop offset="50%" stopColor="#0F1014" />
                <stop offset="100%" stopColor="#050608" />
              </linearGradient>
            </defs>

            {/* ========================================================== */}
            {/* 1. CURVED DRY-BRUSH INK ARC NEAR TOP                       */}
            {/* ========================================================== */}
            <g className="zen-brush-arc-group">
              <path
                d="M 50 142 C 180 82, 420 72, 550 112"
                stroke="#0A0A0A"
                strokeWidth="7"
                strokeLinecap="round"
                opacity={0.16 + Math.sin(t * 0.5) * 0.04}
              />
              <path
                d="M 60 144 C 185 85, 415 76, 540 114"
                stroke="#1A1B20"
                strokeWidth="2"
                strokeLinecap="round"
                opacity={0.22 + Math.sin(t * 0.5) * 0.05}
              />
            </g>

            {/* ========================================================== */}
            {/* 2. LIVING CRIMSON SUN & RADIANT AURA                       */}
            {/* ========================================================== */}
            <g
              className="zen-sun-living-group"
              style={{
                transform: `translate(${sunParallaxX}px, ${sunParallaxY}px)`,
                transition: 'transform 0.15s ease-out',
              }}
            >
              {/* Outer Radiant Glow Halo (Breathing) */}
              <circle
                cx="300"
                cy="240"
                r={220 * (1 + sunPulse * 1.8)}
                fill="url(#zenSunAuraGrad)"
                opacity={sunGlowAlpha}
              />

              {/* Mid Atmosphere Light Diffusion */}
              <circle
                cx="300"
                cy="240"
                r={165 * (1 + sunPulse * 1.1)}
                fill="#FF4433"
                opacity={0.22 + sunPulse}
              />

              {/* Sacred Core Crimson Sun Disc */}
              <circle
                cx="300"
                cy="240"
                r={138 * (1 + sunPulse * 0.4)}
                fill="url(#zenSunCoreGrad)"
                style={{
                  filter: 'drop-shadow(0 6px 30px rgba(217, 4, 22, 0.45))',
                }}
              />
            </g>

            {/* ========================================================== */}
            {/* 3. POETIC DISTANT BIRDS (CHIDORI) FLIGHT                   */}
            {/* ========================================================== */}
            {birdActive && (
              <g
                className="zen-birds-flight-group"
                style={{
                  transform: `translate(${birdX}px, ${birdY}px)`,
                  opacity: Math.sin(birdProg * Math.PI),
                }}
              >
                {/* Bird 1: Lead Crane */}
                <path
                  d={`M -7 ${-birdWingFlap * 4} Q 0 0 7 ${-birdWingFlap * 4} Q 0 ${birdWingFlap * 2} -7 ${-birdWingFlap * 4}`}
                  fill="#0A0A0A"
                />
                {/* Bird 2: Companion Crane (Trailing slightly) */}
                <path
                  d={`M -21 ${12 - birdWingFlap * 3.5} Q -15 16 -9 ${12 - birdWingFlap * 3.5} Q -15 ${16 + birdWingFlap * 1.8} -21 ${12 - birdWingFlap * 3.5}`}
                  fill="#141416"
                  opacity="0.85"
                />
                {/* Bird 3: Distant fledgling */}
                <path
                  d={`M -32 ${6 - birdWingFlap * 2.8} Q -28 9 -24 ${6 - birdWingFlap * 2.8} Q -28 ${9 + birdWingFlap * 1.4} -32 ${6 - birdWingFlap * 2.8}`}
                  fill="#2A2B30"
                  opacity="0.65"
                />
              </g>
            )}

            {/* ========================================================== */}
            {/* 4. FAR MISTY ROLLING MOUNTAIN RIDGES                       */}
            {/* ========================================================== */}
            <g
              className="zen-far-mountains-group"
              style={{
                transform: `translate(${farHillParallaxX}px, ${farHillParallaxY}px)`,
                transition: 'transform 0.2s ease-out',
              }}
            >
              <path
                d="M 0 460 C 110 405, 220 395, 330 422 C 430 448, 510 408, 600 440 L 600 750 L 0 750 Z"
                fill="url(#zenFarMountainGrad)"
              />
            </g>

            {/* Mid-Valley Billowing Mist Ribbon */}
            <g className="zen-valley-mist-1" style={{ opacity: 0.55 + Math.sin(t * 0.4) * 0.2 }}>
              <path
                d="M 0 485 Q 160 450, 320 480 T 600 465 L 600 525 Q 440 545, 280 515 T 0 535 Z"
                fill="url(#zenValleyMistGrad)"
              />
            </g>

            {/* ========================================================== */}
            {/* 5. MIDGROUND HILL & SACRED SHINTO TORII GATE               */}
            {/* ========================================================== */}
            <g
              className="zen-mid-hill-group"
              style={{
                transform: `translate(${midHillParallaxX}px, ${midHillParallaxY}px)`,
                transition: 'transform 0.18s ease-out',
              }}
            >
              {/* Midground Hill Curve */}
              <path
                d="M 0 530 C 150 475, 270 465, 410 500 C 490 520, 550 495, 600 520 L 600 750 L 0 750 Z"
                fill="url(#zenMidHillGrad)"
              />

              {/* Shinto Torii Gate anchored peacefully on ridge */}
              <g
                className="zen-torii-gate-assembly"
                style={{
                  transform: `translate(${toriiParallaxX * 0.2}px, ${toriiParallaxY * 0.2}px)`,
                }}
              >
                {/* Torii Soft Dynamic Shadow on Grass */}
                <ellipse
                  cx="250"
                  cy="530"
                  rx="48"
                  ry="9"
                  fill="#0A0B0E"
                  opacity={0.35 + Math.sin(t * 0.8) * 0.08}
                />

                {/* Left & Right Hashira (Upright Pillars with slight inward taper) */}
                <path d="M 221 472 L 219 528 L 227 528 L 227 472 Z" fill="#0A0A0A" />
                <path d="M 271 472 L 271 528 L 279 528 L 277 472 Z" fill="#0A0A0A" />

                {/* Kasagi & Shimaki (Curved Top Roof Beams with sweeping crests) */}
                <path
                  d="M 202 466 C 225 457, 275 457, 298 466 L 298 474 C 275 465, 225 465, 202 474 Z"
                  fill="#0A0A0A"
                />

                {/* Nuki (Lower Horizontal Lintel Beam with wedges) */}
                <rect x="214" y="482" width="72" height="5.5" rx="1" fill="#0A0A0A" />

                {/* Gakuzuka (Center Nameplate Strut connecting beams) */}
                <rect x="247" y="471" width="5" height="12" fill="#0A0A0A" />
              </g>
            </g>

            {/* Foreground Soft Drifting Mist Ribbon */}
            <g className="zen-valley-mist-2" style={{ opacity: 0.6 + Math.sin(t * 0.5 + 1.2) * 0.2 }}>
              <path
                d="M 0 540 Q 200 510, 400 545 T 600 530 L 600 590 Q 380 610, 200 570 T 0 590 Z"
                fill="url(#zenValleyMistGrad)"
              />
            </g>

            {/* ========================================================== */}
            {/* 6. FOREGROUND EARTH & ARTICULATED LIVING BONSAI BRANCH     */}
            {/* ========================================================== */}
            <g
              className="zen-near-hill-group"
              style={{
                transform: `translate(${nearHillParallaxX}px, ${nearHillParallaxY}px)`,
                transition: 'transform 0.15s ease-out',
              }}
            >
              {/* Foreground Dark Ridge */}
              <path
                d="M 0 610 C 180 565, 360 590, 600 560 L 600 750 L 0 750 Z"
                fill="url(#zenNearHillGrad)"
              />

              {/* 
                Articulated Bonsai Tree:
                Multiple hierarchical groups that sway organically with wind currents.
              */}
              <g
                className="zen-bonsai-root-group"
                style={{
                  transformOrigin: '510px 680px',
                  transform: `rotate(${trunkRot}deg)`,
                  transition: 'transform 0.08s linear',
                }}
              >
                {/* 1. Main Twisted Trunk */}
                <path
                  d="M 525 680 C 515 600, 475 510, 430 455 C 412 432, 385 438, 372 418 C 365 406, 345 408, 335 398"
                  stroke="url(#zenBonsaiBarkGrad)"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M 515 675 C 506 605, 470 522, 428 468"
                  stroke="#2E3038"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.45"
                />

                {/* 2. Secondary Main Limb (reaching left toward sun) */}
                <g
                  className="zen-bonsai-main-limb"
                  style={{
                    transformOrigin: '430px 455px',
                    transform: `rotate(${mainLimbRot}deg)`,
                    transition: 'transform 0.08s linear',
                  }}
                >
                  <path
                    d="M 430 455 C 405 440, 365 448, 340 435 C 325 425, 305 432, 292 422"
                    stroke="url(#zenBonsaiBarkGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Foliage Pad A: Top-most cloud hovering near the sun */}
                  <g
                    className="zen-foliage-pad pad-a"
                    style={{
                      transformOrigin: '320px 410px',
                      transform: `rotate(${pad1Rot}deg) translateY(${pad1Y}px)`,
                      transition: 'transform 0.08s linear',
                    }}
                  >
                    <ellipse cx="320" cy="410" rx="46" ry="22" fill="#0A0B0E" />
                    <ellipse cx="305" cy="404" rx="36" ry="17" fill="#050608" />
                    <ellipse cx="338" cy="416" rx="32" ry="15" fill="#14151A" />
                  </g>

                  {/* Foliage Pad B: Middle-left reaching arm */}
                  <g
                    className="zen-foliage-pad pad-b"
                    style={{
                      transformOrigin: '280px 425px',
                      transform: `rotate(${pad2Rot}deg) translateY(${pad2Y}px)`,
                      transition: 'transform 0.08s linear',
                    }}
                  >
                    <ellipse cx="282" cy="426" rx="38" ry="18" fill="#0A0B0E" />
                    <ellipse cx="270" cy="422" rx="28" ry="14" fill="#050608" />
                  </g>
                </g>

                {/* 3. Lower Branch (reaching outward) */}
                <g
                  className="zen-bonsai-lower-limb"
                  style={{
                    transformOrigin: '475px 510px',
                    transform: `rotate(${trunkRot * 1.5}deg)`,
                    transition: 'transform 0.08s linear',
                  }}
                >
                  <path
                    d="M 475 510 C 450 515, 420 535, 395 545"
                    stroke="url(#zenBonsaiBarkGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Foliage Pad C: Lower arm cloud */}
                  <g
                    className="zen-foliage-pad pad-c"
                    style={{
                      transformOrigin: '395px 545px',
                      transform: `rotate(${pad3Rot}deg) translateY(${pad3Y}px)`,
                      transition: 'transform 0.08s linear',
                    }}
                  >
                    <ellipse cx="395" cy="545" rx="42" ry="20" fill="#0A0B0E" />
                    <ellipse cx="410" cy="548" rx="30" ry="16" fill="#121318" />
                  </g>
                </g>

                {/* 4. Right Upper Crest Foliage */}
                <g
                  className="zen-foliage-pad pad-d"
                  style={{
                    transformOrigin: '460px 475px',
                    transform: `rotate(${pad4Rot}deg) translateY(${pad4Y}px)`,
                    transition: 'transform 0.08s linear',
                  }}
                >
                  <ellipse cx="462" cy="478" rx="40" ry="19" fill="#0A0B0E" />
                  <ellipse cx="478" cy="482" rx="32" ry="16" fill="#050608" />
                </g>
              </g>
            </g>
          </svg>

          {/* 3. High-Performance Canvas for Ambient Particles & Momiji Leaves */}
          <canvas ref={canvasRef} className="zen-particles-canvas" />
        </div>

        {/* 4. Luxury Editorial Typography & Philosophy Caption */}
        <div className="legacy-art-caption">
          <div className="caption-kicker-row">
            <span className="caption-accent-line" />
            <span className="caption-kanji-kicker">自制の道 · 静寂</span>
            <span className="caption-meta-tag">ZEN MASTER WALLPAPER</span>
          </div>
          <h3 className="caption-title">THE WAY OF RESTRAINT</h3>
          <p className="caption-sub">“A warrior is neither reckless nor timid; he exists in stillness.”</p>
          <div className="caption-footer-meta">
            <span className="caption-telemetry">BUSHIDO PRINCIPLE · STILLNESS & HARMONY · 武士道</span>
          </div>
        </div>
      </div>
    </div>
  );
}
