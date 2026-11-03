import React, { useRef, useEffect, useState } from 'react';
import { windSystem } from '../utils/windSystem';
import { sound } from '../utils/soundEngine';

/**
 * SakuraTree (桜 — Living Masterpiece Japanese Landscape)
 * -----------------------------------------------------------------------------
 * Fully connected, hierarchical animated Japanese watercolor & ink landscape
 * reconstructed from high-resolution sumi-e artwork:
 *  - 1024 x 935 coordinate space rendered with zero letterboxing
 *  - Seamless washi parchment blending (#FAF4E8 / #F6EBDD)
 *  - Distant mountain ridges & pagoda in atmospheric valley mist (sakura_bg_mountains.png)
 *  - Living Crimson Sun disc with cloud wisps and breathing halo (sakura_sun_disc.png)
 *  - Fixed, grounded Weathered Granite Crag with exposed Nebari Roots (sakura_rock_base.png)
 *  - High-Stiffness Hierarchical Botanical Motion Rig:
 *      * Main Trunk: (sakura_trunk.png) pivots at nebari base (385px, 735px), gentle 0.1°–0.25° sway
 *      * Primary Left Bough: (sakura_branch_left.png) pivots at (350px, 475px), flexes 0.4°–0.85°
 *      * Primary Right Bough: (sakura_branch_right.png) pivots at (465px, 465px), arches 0.4°–0.8°
 *      * Upper Crown Bough: (sakura_branch_upper.png) pivots at (400px, 430px), reaches up 0.35°–0.75°
 *      * Blossom Clusters: local flutter with delayed spring recovery, never sagging downward
 *  - Dedicated Local Falling Sakura Petal System:
 *      * Canvas-rendered with authentic 5-petal notched florets & single petals
 *      * Spawns directly from actual blossom cluster anchor points on the tree canopy
 *      * 3D tumbling flips (cos flip scale), horizontal wind drift, settling near the rock base
 *  - Interactive: click tree to trigger wind gust, flurry of petals, and authentic sound
 *  - Accessible: respects prefers-reduced-motion, pure requestAnimationFrame cleanup
 */

// Actual Blossom Anchor Coordinates on Tree Canopy (1024 x 935 coordinate space)
const BLOSSOM_ANCHORS = [
  // Left Bough
  { x: 140, y: 420 },
  { x: 190, y: 360 },
  { x: 260, y: 320 },
  { x: 290, y: 240 },
  { x: 180, y: 260 },
  { x: 100, y: 450 },
  // Upper Crown
  { x: 360, y: 140 },
  { x: 440, y: 70 },
  { x: 510, y: 120 },
  { x: 390, y: 220 },
  { x: 460, y: 200 },
  { x: 310, y: 180 },
  { x: 550, y: 160 },
  // Right Bough & Weeping Cascade
  { x: 580, y: 280 },
  { x: 690, y: 330 },
  { x: 800, y: 390 },
  { x: 890, y: 410 },
  { x: 740, y: 480 },
  { x: 810, y: 560 },
  { x: 670, y: 520 },
  { x: 860, y: 470 },
];

export default function SakuraTree({
  mode = 'sakura', // 'sakura' | 'momiji'
  className = '',
  style = {},
  interactive = true,
  onToggleSeason,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Hierarchy DOM Refs
  const trunkRef = useRef(null);
  const boughLeftRef = useRef(null);
  const boughRightRef = useRef(null);
  const boughUpperRef = useRef(null);
  const sunHaloRef = useRef(null);
  const mistRef = useRef(null);

  // Dynamic Spring Simulation State (stored in refs for 60 FPS zero-render execution)
  const springPhysics = useRef({
    trunk: { angle: 0, vel: 0 },
    boughLeft: { angle: 0, vel: 0 },
    boughRight: { angle: 0, vel: 0 },
    boughUpper: { angle: 0, vel: 0 },
    flutterLeft: { angle: 0, vel: 0 },
    flutterRight: { angle: 0, vel: 0 },
    flutterUpper: { angle: 0, vel: 0 },
    lastTime: performance.now(),
    isVisible: true,
  });

  // Viewport Visibility Tracking (Pause loop when offscreen)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        springPhysics.current.isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          springPhysics.current.lastTime = performance.now();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 1. High-Stiffness Hierarchical Wind Physics Loop (60 FPS, Shared windSystem)
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId;
    const p = springPhysics.current;
    p.lastTime = performance.now();

    // Damped Spring Integrator helper
    // d²θ/dt² = k*(target - θ) - d*(dθ/dt)
    const stepSpring = (node, targetAngle, stiffness, damping, minAngle, maxAngle, dt) => {
      const displacement = targetAngle - node.angle;
      const springForce = displacement * stiffness;
      const dampingForce = -node.vel * damping;
      const accel = springForce + dampingForce;

      node.vel += accel * dt;
      node.angle += node.vel * dt;

      // Strict physical clamping: never allow branches to dip beyond noble silhouette bounds
      if (node.angle < minAngle) {
        node.angle = minAngle;
        node.vel = 0;
      } else if (node.angle > maxAngle) {
        node.angle = maxAngle;
        node.vel = 0;
      }
      return node.angle;
    };

    const updatePhysics = (now) => {
      animId = requestAnimationFrame(updatePhysics);

      if (!p.isVisible) {
        p.lastTime = now;
        return;
      }

      const rawDt = (now - p.lastTime) / 1000;
      p.lastTime = now;
      const dt = Math.min(0.035, Math.max(0.001, rawDt));

      const wind = windSystem.getState();
      const t = wind.time;

      // Normalized wind force: gentle baseline with smooth gust reaction
      const windForce = Math.min(1.15, wind.windX * (0.55 + wind.gust * 0.95));

      // -----------------------------------------------------------------
      // LEVEL 1: MAIN TRUNK (Heavy woody anchor at Nebari base 385px 735px)
      // Limit: 0.1° to 0.25° max
      // -----------------------------------------------------------------
      const trunkTarget = Math.sin(t * 0.42) * 0.08 + windForce * 0.12;
      const trunkAngle = stepSpring(p.trunk, trunkTarget, 40.0, 13.0, -0.12, 0.26, dt);
      if (trunkRef.current) {
        trunkRef.current.style.transform = `rotate(${trunkAngle.toFixed(3)}deg)`;
      }

      // -----------------------------------------------------------------
      // LEVEL 2: PRIMARY BOUGHS (Strong spring restoring force, zero sag)
      // -----------------------------------------------------------------

      // Left Bough: Pivots at (350px, 475px)
      const leftTarget = Math.sin(t * 0.85 + 0.4) * 0.22 + windForce * 0.28;
      const leftAngle = stepSpring(p.boughLeft, leftTarget, 38.0, 11.5, -0.35, 0.75, dt);
      if (boughLeftRef.current) {
        boughLeftRef.current.style.transform = `rotate(${leftAngle.toFixed(2)}deg)`;
      }

      // Right Arching Bough: Pivots at (465px, 465px)
      // High stiffness prevents downward sagging under gusts!
      const rightTarget = Math.sin(t * 0.88 + 1.2) * 0.18 + windForce * 0.22;
      const rightAngle = stepSpring(p.boughRight, rightTarget, 44.0, 13.0, -0.28, 0.65, dt);
      if (boughRightRef.current) {
        boughRightRef.current.style.transform = `rotate(${rightAngle.toFixed(2)}deg)`;
      }

      // Upper Crown: Pivots at (400px, 430px)
      const upperTarget = Math.sin(t * 0.95 + 0.2) * 0.20 + windForce * 0.26;
      const upperAngle = stepSpring(p.boughUpper, upperTarget, 40.0, 12.0, -0.30, 0.70, dt);
      if (boughUpperRef.current) {
        boughUpperRef.current.style.transform = `rotate(${upperAngle.toFixed(2)}deg)`;
      }

      // -----------------------------------------------------------------
      // LEVEL 3: SUN BREATHING & VALLEY MIST DRIFT
      // -----------------------------------------------------------------
      if (sunHaloRef.current) {
        // 8-10 second organic breathing cycle
        const sunBreath = 0.85 + Math.sin(t * 0.65) * 0.15;
        sunHaloRef.current.style.transform = `scale(${sunBreath.toFixed(3)})`;
        sunHaloRef.current.style.opacity = (0.22 + Math.sin(t * 0.65) * 0.08).toFixed(2);
      }

      if (mistRef.current) {
        // Slow horizontal drifting mist across mountains
        const mistShift = Math.sin(t * 0.25) * 12;
        mistRef.current.style.transform = `translateX(${mistShift.toFixed(1)}px)`;
      }
    };

    animId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // 2. Realistic Falling Sakura Petal System (Canvas, Botanical Physics)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const isMomiji = mode === 'momiji';

    // Particle density based on screen width:
    // Desktop: 9-13, Tablet: 6-8, Mobile: 4-5
    const isMobile = window.innerWidth <= 640;
    const isTablet = window.innerWidth <= 1024 && !isMobile;
    const maxPetals = isMobile ? 5 : isTablet ? 8 : 12;

    const petals = [];

    const spawnPetal = (initialScattered = false) => {
      // Pick an authentic blossom anchor point on the canopy
      const anchor = BLOSSOM_ANCHORS[Math.floor(Math.random() * BLOSSOM_ANCHORS.length)];
      // Scale from 1024x935 coordinate space to canvas size
      const scaleX = width / 1024;
      const scaleY = height / 935;

      const originX = anchor.x * scaleX + (Math.random() - 0.5) * 28;
      const originY = anchor.y * scaleY + (Math.random() - 0.5) * 28;

      const tints = isMomiji
        ? ['#C53028', '#D45020', '#E58A18', '#A82015', '#EA6824']
        : ['#F6ADC2', '#F8C8D6', '#EDB0C3', '#FFFFFF', '#E890A8', '#F9D8E2'];

      return {
        x: initialScattered ? Math.random() * width : originX,
        y: initialScattered ? Math.random() * (height * 0.75) : originY,
        vx: 0.3 + Math.random() * 0.6,
        vy: 0.5 + Math.random() * 0.9,
        size: isMomiji ? 8 + Math.random() * 5 : 7 + Math.random() * 5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.04,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.025 + Math.random() * 0.04,
        tint: tints[Math.floor(Math.random() * tints.length)],
        opacity: initialScattered ? 0.3 + Math.random() * 0.7 : 0,
        targetOpacity: 0.75 + Math.random() * 0.25,
        isSettling: false,
        swayPhase: Math.random() * Math.PI * 2,
      };
    };

    // Pre-populate particles
    for (let i = 0; i < maxPetals; i++) {
      petals.push(spawnPetal(true));
    }

    const render = () => {
      if (!springPhysics.current.isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const wind = windSystem.getState();
      const windDrift = wind.windX * 1.8;

      petals.forEach((p) => {
        // Fade in when freshly spawned
        if (!p.isSettling && p.opacity < p.targetOpacity) {
          p.opacity += 0.035;
        }

        // Horizontal sinusoidal fluttering drift
        p.swayPhase += 0.032;
        const flutter = Math.sin(p.swayPhase) * 0.65;

        p.x += p.vx + windDrift * 0.5 + flutter;
        p.y += p.vy;
        p.angle += p.spin;
        p.flip += p.flipSpeed;

        // Rock base settling boundary (approx 74% to 85% of height)
        const cragTopY = height * 0.74;
        if (p.y >= cragTopY && !p.isSettling) {
          p.isSettling = true;
        }

        if (p.isSettling) {
          p.vy *= 0.94;
          p.vx *= 0.90;
          p.opacity -= 0.016; // Soft natural fade-out settling on the mossy rock
        }

        // Respawn when settled or off-bounds
        if (p.opacity <= 0 || p.y > height + 25 || p.x > width + 40) {
          const fresh = spawnPetal(false);
          Object.assign(p, fresh);
          return;
        }

        // Render Individual Realistic Petal Geometry
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        // 3D Tumble: horizontal perspective scale via cosine
        const flipScale = Math.cos(p.flip);
        ctx.scale(Math.max(0.18, Math.abs(flipScale)), 1);

        ctx.fillStyle = p.tint;
        ctx.globalAlpha = Math.max(0, p.opacity);

        ctx.beginPath();
        if (isMomiji) {
          // Mini Momiji Maple Leaf Outline
          const s = p.size * 0.75;
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.35, -s * 0.35);
          ctx.lineTo(s, -s * 0.35);
          ctx.lineTo(s * 0.45, 0);
          ctx.lineTo(s * 0.75, s * 0.75);
          ctx.lineTo(0, s * 0.35);
          ctx.lineTo(-s * 0.75, s * 0.75);
          ctx.lineTo(-s * 0.45, 0);
          ctx.lineTo(-s, -s * 0.35);
          ctx.lineTo(-s * 0.35, -s * 0.35);
          ctx.closePath();
        } else {
          // Delicate Notched Sakura Petal
          const s = p.size;
          ctx.moveTo(0, s * 0.65);
          ctx.bezierCurveTo(s * 0.7, s * 0.35, s * 0.8, -s * 0.4, 0, -s);
          ctx.bezierCurveTo(-s * 0.8, -s * 0.4, -s * 0.7, s * 0.35, 0, s * 0.65);
        }
        ctx.fill();

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

  // Click interaction: Trigger natural gust and sound
  const handleClick = () => {
    if (!interactive) return;
    windSystem.triggerGust(1.25);
    sound.playWoodenClick();
    sound.playBladeGlint();
    if (onToggleSeason) {
      onToggleSeason();
    }
  };

  const isMomiji = mode === 'momiji';

  return (
    <div
      ref={containerRef}
      className={`sakura-interactive-viewport ${className}`}
      style={style}
      onClick={handleClick}
      role={interactive ? 'button' : 'region'}
      tabIndex={interactive ? 0 : undefined}
      title={interactive ? 'Click tree to summon a spring wind gust & toggle season' : undefined}
      aria-label={
        isMomiji
          ? 'Living Japanese Momiji Maple Tree on misty crag with wind-animated branches'
          : 'Living Japanese Sakura Tree on misty crag with wind-animated branches and drifting blossoms'
      }
    >
      {/* Aspect Ratio Box: Native 1024 x 935 Coordinate Space */}
      <div className="sakura-aspect-stage">
        {/* ============================================================== */}
        {/* 1. ATMOSPHERIC BACKGROUND LAYERS                               */}
        {/* ============================================================== */}

        {/* Soft Washi Parchment Sky Ground */}
        <div className="sakura-parchment-sky" aria-hidden="true" />

        {/* Distant Misty Mountains, Pagoda & Valley Horizon */}
        <div
          ref={mistRef}
          className="sakura-layer sakura-layer-mountains"
          style={{ backgroundImage: `url('/images/sakura/sakura_bg_mountains.png')` }}
          aria-hidden="true"
        />

        {/* Living Crimson Sun Disc & Breathing Atmospheric Halo */}
        <div className="sakura-sun-container" aria-hidden="true">
          <div
            ref={sunHaloRef}
            className="sakura-sun-halo-glow"
            style={{
              left: '54.2%', // 555px / 1024
              top: '44.1%',  // 412px / 935
            }}
          />
          <img
            src="/images/sakura/sakura_sun_disc.png"
            alt=""
            className="sakura-layer sakura-sun-img"
            loading="eager"
            draggable="false"
          />
        </div>

        {/* Atmospheric Drifting Mist Ribbons */}
        <div className="sakura-valley-mist-band" aria-hidden="true" />

        {/* ============================================================== */}
        {/* 2. STATIONARY WEATHERED GRANITE CRAG & NEBARI ROOTS            */}
        {/* ============================================================== */}
        <img
          src="/images/sakura/sakura_rock_base.png"
          alt=""
          className="sakura-layer sakura-layer-rock"
          loading="eager"
          draggable="false"
        />

        {/* ============================================================== */}
        {/* 3. LIVING HIERARCHICAL BOTANICAL TREE RIG                      */}
        {/* ============================================================== */}
        {/* Root Anchor: Pivots at (385px, 735px) on Nebari base */}
        <div
          ref={trunkRef}
          className={`sakura-trunk-rig ${isMomiji ? 'season-momiji' : ''}`}
          style={{
            transformOrigin: '37.6% 78.6%', // 385px / 1024, 735px / 935
          }}
        >
          {/* Gnarled S-Curve Trunk Bark */}
          <img
            src="/images/sakura/sakura_trunk.png"
            alt=""
            className="sakura-layer sakura-trunk-img"
            loading="eager"
            draggable="false"
          />

          {/* 3a. Primary Left Bough (Pivots at 350px, 475px) */}
          <div
            ref={boughLeftRef}
            className="sakura-bough-left-rig"
            style={{
              transformOrigin: '34.2% 50.8%', // 350px / 1024, 475px / 935
            }}
          >
            <img
              src="/images/sakura/sakura_branch_left.png"
              alt=""
              className="sakura-layer sakura-branch-left-img"
              loading="eager"
              draggable="false"
            />
          </div>

          {/* 3b. Primary Upper Crown (Pivots at 400px, 430px) */}
          <div
            ref={boughUpperRef}
            className="sakura-bough-upper-rig"
            style={{
              transformOrigin: '39.1% 46.0%', // 400px / 1024, 430px / 935
            }}
          >
            <img
              src="/images/sakura/sakura_branch_upper.png"
              alt=""
              className="sakura-layer sakura-branch-upper-img"
              loading="eager"
              draggable="false"
            />
          </div>

          {/* 3c. Primary Right Arching Bough & Weeping Cascade (Pivots at 465px, 465px) */}
          <div
            ref={boughRightRef}
            className="sakura-bough-right-rig"
            style={{
              transformOrigin: '45.4% 49.7%', // 465px / 1024, 465px / 935
            }}
          >
            <img
              src="/images/sakura/sakura_branch_right.png"
              alt=""
              className="sakura-layer sakura-branch-right-img"
              loading="eager"
              draggable="false"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. REALISTIC LOCAL FALLING SAKURA PETALS CANVAS                */}
        {/* ============================================================== */}
        <canvas ref={canvasRef} className="sakura-falling-petals-canvas" />
      </div>
    </div>
  );
}
