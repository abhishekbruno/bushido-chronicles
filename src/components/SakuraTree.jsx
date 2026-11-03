import React, { useRef, useEffect } from 'react';
import { windSystem } from '../utils/windSystem';
import { sound } from '../utils/soundEngine';

/**
 * SakuraTree (桜と紅葉 — Living Connected Japanese Bonsai Masterpiece)
 * -----------------------------------------------------------------------------
 * Fully connected, hierarchical animated Japanese watercolor and ink landscape:
 *  - SVG viewBox="0 0 735 1103" strictly scoped to visual frame card
 *  - Fixed, grounded Weathered Granite Crag with exposed Nebari Roots (stationary base)
 *  - Living Crimson Sun:
 *      * Soft-edged atmospheric halo (8-10s breathing cycle)
 *      * Ancient sumi-e weathered surface texture rotating slowly (120s per revolution)
 *      * Disk remains visually anchored
 *  - High-Stiffness Hierarchical Botanical Motion Hierarchy:
 *      * Roots/Rock: 100% stationary and anchored
 *      * Main Trunk: subtle resilient sway (0.2°–0.35° max, transformOrigin: 245px 850px)
 *      * Primary Boughs: 6 articulated boughs with strong spring restoring force (0.4°–0.85° max)
 *      * Motion is primarily lateral/horizontal, strictly preventing downward drooping or sagging
 *      * Blossom Clusters: subtle local follow-through flutter (0.3°–0.65° max), never pulling
 *        the branch downward
 *      * Canopy shape and noble silhouette remain 100% intact and balanced during wind gusts
 *  - Local Falling Sakura Petal Emitter:
 *      * 5–9 active petals visible at any time (restrained, elegant volume)
 *      * Detaches directly from actual blossom cluster coordinates on the canopy
 *      * Aerodynamic drag, horizontal wind drift, and 3D tumbling flips
 *      * Settles and fades naturally near the granite crag base
 *  - Dual Seasonal Modes: Spring Sakura & Autumn Momiji (click tree to toggle)
 *  - Accessible: respects prefers-reduced-motion, pure requestAnimationFrame cleanup
 */

// Actual Blossom Anchor Coordinates on Tree Canopy (SVG viewBox 735 x 1103)
const BLOSSOM_ANCHORS = [
  { x: 90, y: 535 },   // Low-left shelf
  { x: 55, y: 495 },   // Low-left outer twig
  { x: 115, y: 400 },  // Mid-left shelf
  { x: 85, y: 360 },   // Mid-left outer twig
  { x: 155, y: 280 },  // Upper-left shelf
  { x: 125, y: 230 },  // Upper-left outer twig
  { x: 295, y: 105 },  // Crown apex top
  { x: 250, y: 160 },  // Crown apex left
  { x: 340, y: 170 },  // Crown apex right
  { x: 435, y: 240 },  // Upper-right bough
  { x: 505, y: 215 },  // Mid-right upper bough
  { x: 565, y: 320 },  // Far-right bough
  { x: 635, y: 310 },  // Far-right outer tip
  { x: 545, y: 485 },  // Low-right weeping shelf
  { x: 615, y: 560 },  // Low-right drooping tip
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

  // SVG Refs for Connected Hierarchical Wind Physics
  const trunkRef = useRef(null);
  // 6 Primary Boughs
  const bough1Ref = useRef(null); // Low-Left
  const bough2Ref = useRef(null); // Mid-Left
  const bough3Ref = useRef(null); // Upper-Left
  const bough4Ref = useRef(null); // Apex Crown
  const bough5Ref = useRef(null); // Great Right
  const bough6Ref = useRef(null); // Low-Right
  // Blossom Cluster Groups nested directly inside each bough
  const blossomCluster1Ref = useRef(null);
  const blossomCluster2Ref = useRef(null);
  const blossomCluster3Ref = useRef(null);
  const blossomCluster4Ref = useRef(null);
  const blossomCluster5Ref = useRef(null);
  const blossomCluster6Ref = useRef(null);

  // Dynamic Spring Simulation State (stored in refs for 60 FPS zero-render execution)
  const springPhysics = useRef({
    trunk: { angle: 0, vel: 0 },
    bough1: { angle: 0, vel: 0 },
    bough2: { angle: 0, vel: 0 },
    bough3: { angle: 0, vel: 0 },
    bough4: { angle: 0, vel: 0 },
    bough5: { angle: 0, vel: 0 },
    bough6: { angle: 0, vel: 0 },
    blossom1: { angle: 0, vel: 0 },
    blossom2: { angle: 0, vel: 0 },
    blossom3: { angle: 0, vel: 0 },
    blossom4: { angle: 0, vel: 0 },
    blossom5: { angle: 0, vel: 0 },
    blossom6: { angle: 0, vel: 0 },
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
    // Solves d²θ/dt² = k*(target - θ) - d*(dθ/dt)
    const stepSpring = (node, targetAngle, stiffness, damping, minAngle, maxAngle, dt) => {
      const displacement = targetAngle - node.angle;
      const springForce = displacement * stiffness;
      const dampingForce = -node.vel * damping;
      const accel = springForce + dampingForce;

      node.vel += accel * dt;
      node.angle += node.vel * dt;

      // Strict physical clamping: never allow branches to dip beyond safe silhouette bounds
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

      // Normalized wind force: gentle baseline with smooth gust reaction (clamped 0 to 1.15)
      const windForce = Math.min(1.15, wind.windX * (0.55 + wind.gust * 0.95));

      // -----------------------------------------------------------------
      // LEVEL 1: TRUNK (Heavy, woody, anchored at nebari base 245px 850px)
      // Motion limit: 0.2° to 0.35° max
      // -----------------------------------------------------------------
      const trunkTarget = Math.sin(t * 0.45) * 0.10 + windForce * 0.14;
      const trunkAngle = stepSpring(p.trunk, trunkTarget, 38.0, 12.0, -0.15, 0.35, dt);
      if (trunkRef.current) {
        trunkRef.current.style.transform = `rotate(${trunkAngle.toFixed(3)}deg)`;
      }

      // -----------------------------------------------------------------
      // LEVEL 2: PRIMARY BOUGHS (High stiffness, lateral sway, zero sag)
      // Motion limits: 0.4° to 0.85° max
      // -----------------------------------------------------------------

      // BOUGH 1: Low-Left Sweeping Bough (Pivots at 235px 485px)
      const b1Target = Math.sin(t * 0.85 + 0.3) * 0.20 + windForce * 0.26;
      const b1Angle = stepSpring(p.bough1, b1Target, 42.0, 12.5, -0.32, 0.65, dt);
      if (bough1Ref.current) {
        bough1Ref.current.style.transform = `rotate(${b1Angle.toFixed(2)}deg)`;
      }

      // BOUGH 2: Mid-Left Bonsai Branch (Pivots at 240px 460px)
      const b2Target = Math.sin(t * 0.92 + 0.7) * 0.24 + windForce * 0.30;
      const b2Angle = stepSpring(p.bough2, b2Target, 40.0, 12.0, -0.36, 0.72, dt);
      if (bough2Ref.current) {
        bough2Ref.current.style.transform = `rotate(${b2Angle.toFixed(2)}deg)`;
      }

      // BOUGH 3: Upper-Left Climbing Branch (Pivots at 255px 440px)
      const b3Target = Math.sin(t * 1.0 + 1.1) * 0.26 + windForce * 0.34;
      const b3Angle = stepSpring(p.bough3, b3Target, 38.0, 11.5, -0.40, 0.80, dt);
      if (bough3Ref.current) {
        bough3Ref.current.style.transform = `rotate(${b3Angle.toFixed(2)}deg)`;
      }

      // BOUGH 4: Central Apex Crown (Pivots at 260px 450px)
      const b4Target = Math.sin(t * 1.05 + 0.2) * 0.28 + windForce * 0.36;
      const b4Angle = stepSpring(p.bough4, b4Target, 36.0, 11.0, -0.42, 0.82, dt);
      if (bough4Ref.current) {
        bough4Ref.current.style.transform = `rotate(${b4Angle.toFixed(2)}deg)`;
      }

      // BOUGH 5: Main Right Arching Great Bough (Pivots at 275px 460px)
      // Stiff woody resistance prevents downward sagging under gusts!
      const b5Target = Math.sin(t * 0.88 + 1.4) * 0.16 + windForce * 0.20;
      const b5Angle = stepSpring(p.bough5, b5Target, 46.0, 13.5, -0.25, 0.50, dt);
      if (bough5Ref.current) {
        bough5Ref.current.style.transform = `rotate(${b5Angle.toFixed(2)}deg)`;
      }

      // BOUGH 6: Lower-Right Bough (Pivots at junction 430px 460px on Bough 5)
      // Since it is a child of Bough 5, its relative rotation is tightly restrained
      const b6Target = Math.sin(t * 1.15 + 2.0) * 0.22 + windForce * 0.25;
      const b6Angle = stepSpring(p.bough6, b6Target, 45.0, 13.0, -0.30, 0.60, dt);
      if (bough6Ref.current) {
        bough6Ref.current.style.transform = `rotate(${b6Angle.toFixed(2)}deg)`;
      }

      // -----------------------------------------------------------------
      // LEVEL 3: BLOSSOM CLUSTERS (Subtle local follow-through flutter)
      // Motion limits: 0.3° to 0.65° max — zero heavy downward drag!
      // -----------------------------------------------------------------

      // Blossom Cluster 1 (Low-Left)
      const bl1Target =
        Math.sin(t * 2.8 + 1.2) * 0.22 +
        Math.sin(t * 5.4) * 0.08 +
        windForce * 0.20;
      const bl1Angle = stepSpring(p.blossom1, bl1Target, 48.0, 13.5, -0.40, 0.58, dt);
      if (blossomCluster1Ref.current) {
        blossomCluster1Ref.current.style.transform = `rotate(${bl1Angle.toFixed(2)}deg)`;
      }

      // Blossom Cluster 2 (Mid-Left)
      const bl2Target =
        Math.sin(t * 2.9 + 1.5) * 0.24 +
        Math.sin(t * 5.6 + 0.4) * 0.09 +
        windForce * 0.22;
      const bl2Angle = stepSpring(p.blossom2, bl2Target, 48.0, 13.5, -0.42, 0.60, dt);
      if (blossomCluster2Ref.current) {
        blossomCluster2Ref.current.style.transform = `rotate(${bl2Angle.toFixed(2)}deg)`;
      }

      // Blossom Cluster 3 (Upper-Left)
      const bl3Target =
        Math.sin(t * 3.0 + 1.8) * 0.25 +
        Math.sin(t * 5.8 + 0.8) * 0.10 +
        windForce * 0.24;
      const bl3Angle = stepSpring(p.blossom3, bl3Target, 46.0, 13.0, -0.45, 0.65, dt);
      if (blossomCluster3Ref.current) {
        blossomCluster3Ref.current.style.transform = `rotate(${bl3Angle.toFixed(2)}deg)`;
      }

      // Blossom Cluster 4 (Apex Crown)
      const bl4Target =
        Math.sin(t * 3.1 + 0.9) * 0.26 +
        Math.sin(t * 6.0 + 0.2) * 0.10 +
        windForce * 0.25;
      const bl4Angle = stepSpring(p.blossom4, bl4Target, 46.0, 13.0, -0.45, 0.65, dt);
      if (blossomCluster4Ref.current) {
        blossomCluster4Ref.current.style.transform = `rotate(${bl4Angle.toFixed(2)}deg)`;
      }

      // Blossom Cluster 5 (Great Right)
      const bl5Target =
        Math.sin(t * 3.2 + 2.1) * 0.22 +
        Math.sin(t * 6.2 + 1.1) * 0.08 +
        windForce * 0.20;
      const bl5Angle = stepSpring(p.blossom5, bl5Target, 50.0, 14.0, -0.38, 0.55, dt);
      if (blossomCluster5Ref.current) {
        blossomCluster5Ref.current.style.transform = `rotate(${bl5Angle.toFixed(2)}deg)`;
      }

      // Blossom Cluster 6 (Low-Right)
      const bl6Target =
        Math.sin(t * 3.3 + 2.6) * 0.24 +
        Math.sin(t * 6.4 + 1.5) * 0.09 +
        windForce * 0.22;
      const bl6Angle = stepSpring(p.blossom6, bl6Target, 48.0, 13.5, -0.40, 0.58, dt);
      if (blossomCluster6Ref.current) {
        blossomCluster6Ref.current.style.transform = `rotate(${bl6Angle.toFixed(2)}deg)`;
      }
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 2. Falling Petals Emitter (Canvas 60 FPS, Restrained 5–9 Active Petals)
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
    const activePetalTarget = isMomiji ? 7 : 8; // 5 to 9 active petals
    let gustCooldown = 0;

    // Helper: spawn a petal directly from an authentic blossom canopy node
    const spawnPetal = (isInitial = false) => {
      const anchor = BLOSSOM_ANCHORS[Math.floor(Math.random() * BLOSSOM_ANCHORS.length)];
      // Convert SVG viewBox coordinate (735 x 1103) to canvas px
      const sx = (anchor.x / 735) * width + (Math.random() - 0.5) * 20;
      const sy = (anchor.y / 1103) * height + (Math.random() - 0.5) * 16;

      // On initial page load, distribute along fall height so they don't all detach simultaneously
      const startY = isInitial ? sy + Math.random() * (height * 0.5) : sy;

      const momijiPalette = ['#C71825', '#E62432', '#FF4D2E', '#9B111E', '#FFA726'];
      const sakuraPalette = ['#FFFFFF', '#F8DBE2', '#F4C5D3', '#EFA8BD', '#DB88A5'];

      return {
        x: sx,
        y: startY,
        startX: sx,
        vx: (Math.random() - 0.2) * 0.35,
        vy: Math.random() * 0.3 + 0.3,
        size: Math.random() * 3.2 + 4.2, // 4.2 - 7.4 px single petal
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.035,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.028 + 0.018,
        opacity: isInitial ? Math.random() * 0.45 + 0.45 : 0.0,
        targetOpacity: Math.random() * 0.35 + 0.6,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.035 + 0.02,
        tint: isMomiji
          ? momijiPalette[Math.floor(Math.random() * momijiPalette.length)]
          : sakuraPalette[Math.floor(Math.random() * sakuraPalette.length)],
        isSettling: false,
        dormantDelay: isInitial ? 0 : Math.floor(Math.random() * 100),
      };
    };

    const petals = Array.from({ length: activePetalTarget }, () => spawnPetal(true));

    let animId;
    let lastTime = performance.now();

    const render = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      const wind = windSystem.getState();
      const windPushX = wind.windX * 0.85;

      // Wind gust reaction: trigger release of dormant petals when wind gusts
      gustCooldown -= dt;
      if (wind.gust > 0.45 && gustCooldown <= 0) {
        gustCooldown = 4.0;
        petals.forEach((p) => {
          if (p.dormantDelay > 0) {
            p.dormantDelay = 0;
            p.opacity = 0.8;
          }
        });
      }

      petals.forEach((p) => {
        // Dormant delay before detaching from flower
        if (p.dormantDelay > 0) {
          p.dormantDelay -= 1;
          return;
        }

        // Smooth fade-in as petal detaches from the tree
        if (p.opacity < p.targetOpacity && !p.isSettling) {
          p.opacity += 0.035;
        }

        // Aerodynamics: slow gravity + lateral wind drift
        p.vy = Math.min(1.35, p.vy + 0.012);
        p.vx += (windPushX - p.vx) * 0.035;

        // Oscillating horizontal flutter
        p.swayPhase += p.swaySpeed;
        const flutterX = Math.sin(p.swayPhase) * 0.5;

        p.x += p.vx + flutterX;
        p.y += p.vy;
        p.angle += p.spin;
        p.flip += p.flipSpeed;

        // Settling threshold near the granite rock base (approx 74% - 85% of height)
        const cragTopY = height * 0.74;
        if (p.y >= cragTopY && !p.isSettling) {
          p.isSettling = true;
        }

        if (p.isSettling) {
          p.vy *= 0.94;
          p.vx *= 0.90;
          p.opacity -= 0.018; // Soft natural fade-out settling on the mossy rock
        }

        // Respawn when settled or off-bounds
        if (p.opacity <= 0 || p.y > height + 20 || p.x > width + 40) {
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
        ctx.scale(Math.max(0.2, Math.abs(flipScale)), 1);

        ctx.fillStyle = p.tint;
        ctx.globalAlpha = Math.max(0, p.opacity);

        ctx.beginPath();
        if (isMomiji) {
          // Mini Momiji Maple Leaf Outline
          const s = p.size * 0.7;
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
          // Delicate Heart/Notched Sakura Petal
          const s = p.size;
          ctx.moveTo(0, s * 0.6);
          ctx.bezierCurveTo(s * 0.65, s * 0.35, s * 0.75, -s * 0.4, 0, -s);
          ctx.bezierCurveTo(-s * 0.75, -s * 0.4, -s * 0.65, s * 0.35, 0, s * 0.6);
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

  // Click interaction: Toggle Sakura & Momiji Seasonal Mode with authentic audio
  const handleClick = () => {
    if (!interactive) return;
    if (onToggleSeason) {
      onToggleSeason();
    } else {
      sound.playWoodenClick();
      sound.playBladeGlint();
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
      title={interactive ? 'Click tree to toggle Spring Sakura & Autumn Momiji' : undefined}
      aria-label={
        isMomiji
          ? 'Living Japanese Momiji Maple Tree on misty crag with connected branch and leaf motion'
          : 'Living Japanese Bonsai Sakura Tree on misty crag with connected branch and blossom motion'
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
          {/* ============================================================== */}
          {/* 1. ATMOSPHERIC SKY & CRIMSON SUN GRADIENTS                     */}
          {/* ============================================================== */}
          <linearGradient id="sakuraMistySkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ECEEED" />
            <stop offset="28%" stopColor="#E2E5E4" />
            <stop offset="65%" stopColor="#D9DDDC" />
            <stop offset="100%" stopColor="#CBD1D0" />
          </linearGradient>

          {/* Crimson Sun Halo Gradients */}
          <radialGradient id="sakuraSunHaloOuter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C91B28" stopOpacity="0.32" />
            <stop offset="45%" stopColor="#C91B28" stopOpacity="0.12" />
            <stop offset="85%" stopColor="#C91B28" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#C91B28" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="sakuraSunHaloMid" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D92230" stopOpacity="0.52" />
            <stop offset="55%" stopColor="#BA1421" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#8A0C16" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="sakuraSunBodyGrad" cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#E22635" />
            <stop offset="38%" stopColor="#C81726" />
            <stop offset="76%" stopColor="#9C0F1A" />
            <stop offset="100%" stopColor="#6E0812" />
          </radialGradient>

          {/* Mountain Gradients */}
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

          {/* ============================================================== */}
          {/* 2. WEATHERED GRANITE CRAG GRADIENTS                            */}
          {/* ============================================================== */}
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

          {/* Ancient Gnarled Bark Fibers */}
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

          {/* ============================================================== */}
          {/* 3. SAKURA BLOSSOM VOLUMETRIC GRADIENTS                         */}
          {/* ============================================================== */}
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

          {/* Single Authentic 5-Petal Notched Sakura Flower */}
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

          {/* Volumetric Botanical Sakura Cloud Shelf */}
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

            {/* Exposed Fine Dark Twigs Weaving Outward */}
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
            <ellipse cx="0" cy="0" rx="55" ry="35" fill="rgba(139, 11, 22, 0.45)" />
            <ellipse cx="-40" cy="0" rx="42" ry="26" fill="rgba(199, 24, 37, 0.55)" />
            <ellipse cx="40" cy="0" rx="45" ry="28" fill="rgba(230, 36, 50, 0.55)" />
            <ellipse cx="0" cy="-20" rx="48" ry="30" fill="rgba(255, 77, 46, 0.65)" />
            <use href="#momijiMapleLeaf" transform="translate(0, 0) scale(0.42)" color="#E62432" />
            <use href="#momijiMapleLeaf" transform="translate(-25, -12) scale(0.38) rotate(32)" color="#C71825" />
            <use href="#momijiMapleLeaf" transform="translate(28, -10) scale(0.36) rotate(-28)" color="#FF4D2E" />
            <use href="#momijiMapleLeaf" transform="translate(-16, 14) scale(0.32) rotate(-15)" color="#FFA726" />
            <use href="#momijiMapleLeaf" transform="translate(18, 16) scale(0.34) rotate(42)" color="#9B111E" />
          </g>

          {/* Sumi-e Soaring Birds & Shrub Defs */}
          <g id="sumiInkBirdArticulated">
            <path d="M 0 0 C 6 -8, 16 -12, 28 -7 C 20 -4, 10 -2, 0 0 Z" fill="#0D0E0F" opacity="0.9" />
            <path d="M 0 0 C -6 -8, -16 -12, -28 -7 C -20 -4, -10 -2, 0 0 Z" fill="#0D0E0F" opacity="0.9" />
            <ellipse cx="0" cy="1" rx="2.4" ry="4.5" fill="#0D0E0F" />
          </g>

          <g id="bareWinterShrub">
            <path d="M 0 0 L -6 -18 M 0 0 L 8 -22 M -6 -18 L -14 -28 M -6 -18 L -2 -30 M 8 -22 L 4 -32 M 8 -22 L 16 -30" stroke="#221C18" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </g>

          <g id="distantSumiPine">
            <path d="M 0 0 L 0 -45" stroke="#1C1814" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M -16 -20 Q 0 -30, 16 -20" stroke="#16120E" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M -12 -32 Q 0 -40, 12 -32" stroke="#16120E" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M -8 -42 Q 0 -48, 8 -42" stroke="#16120E" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.9" />
          </g>
        </defs>

        {/* ================================================================ */}
        {/* BACKGROUND LAYER: MISTY SKY, MOUNTAINS, AND SUN                  */}
        {/* ================================================================ */}
        <g id="AtmosphericBackdrop">
          <rect width="735" height="1103" fill="url(#sakuraMistySkyGrad)" />

          {/* Sun Halo Layers (Gentle ambient breathing) */}
          <circle cx="280" cy="380" r="280" fill="url(#sakuraSunHaloOuter)" className="sakura-sun-halo-breathe" />
          <circle cx="280" cy="380" r="215" fill="url(#sakuraSunHaloMid)" />

          {/* Core Celestial Red Sun Disk */}
          <g id="CelestialSunGroup">
            <circle cx="280" cy="380" r="165" fill="url(#sakuraSunBodyGrad)" />
            <circle cx="280" cy="380" r="164.5" fill="none" stroke="#7A0A13" strokeWidth="1.2" opacity="0.45" />

            {/* Rotating Weathered Texture (One gentle revolution in 120s) */}
            <g className="sakura-sun-weathered-spin" style={{ transformOrigin: '280px 380px' }}>
              <g stroke="#F8CFBA" strokeWidth="1.8" fill="none" opacity="0.14" strokeLinecap="round">
                <path d="M 175 320 Q 280 305, 385 320" />
                <path d="M 155 355 Q 280 340, 405 355" />
                <path d="M 150 395 Q 280 380, 410 395" />
                <path d="M 165 435 Q 280 420, 395 435" />
                <path d="M 200 470 Q 280 455, 360 470" />
              </g>
              <g stroke="#6A0810" strokeWidth="2.2" fill="none" opacity="0.45" strokeLinecap="round">
                <path d="M 145 375 Q 165 350, 195 365" />
                <path d="M 370 390 Q 395 405, 415 375" />
                <path d="M 250 255 C 242 290, 248 325, 265 355" stroke="#700A12" strokeWidth="2.4" fill="none" opacity="0.55" />
              </g>
            </g>
          </g>

          {/* Jagged Mountain Peak on Left */}
          <path
            d="M 0 540 C 35 430, 85 310, 150 240 C 170 220, 190 245, 215 290 C 245 350, 290 440, 350 510 C 410 580, 480 640, 540 720 L 540 920 L 0 920 Z"
            fill="url(#midMountainRidgeGrad)"
          />

          {/* Distant Alpine Peak on Right */}
          <path
            d="M 280 620 C 360 480, 460 320, 550 210 C 590 160, 630 190, 670 280 C 700 350, 735 460, 735 600 L 735 900 L 280 900 Z"
            fill="url(#farMountainPeakGrad)"
          />

          {/* Drifting Mist Streams */}
          <path d="M -50 490 Q 220 440, 420 490 T 785 460 L 785 640 Q 480 600, 240 630 T -50 610 Z" fill="#EDF1F0" opacity="0.82" filter="blur(18px)" className="sakura-mist-layer-1" />
          <path d="M 0 620 Q 280 570, 510 615 T 785 590 L 785 730 Q 470 700, 220 725 T 0 710 Z" fill="#E2E7E5" opacity="0.75" filter="blur(22px)" className="sakura-mist-layer-2" />

          {/* Articulated Soaring Ink Birds */}
          <g className="sakura-bird-soar-1"><use href="#sumiInkBirdArticulated" /></g>
          <g className="sakura-bird-soar-2"><use href="#sumiInkBirdArticulated" /></g>
          <g className="sakura-bird-soar-3"><use href="#sumiInkBirdArticulated" /></g>

          {/* Distant Vegetation */}
          <g transform="translate(85, 870) scale(0.95)" opacity="0.65"><use href="#bareWinterShrub" /></g>
          <g transform="translate(340, 800) scale(0.78)" opacity="0.62"><use href="#distantSumiPine" /></g>
          <g transform="translate(305, 700) scale(0.55)" opacity="0.48"><use href="#distantSumiPine" /></g>
        </g>

        {/* ================================================================ */}
        {/* LAYER 1: WEATHERED GRANITE CRAG (Completely Rooted & Still)      */}
        {/* ================================================================ */}
        <g id="GraniteCragBase" className="sakura-rock-base">
          <path
            d="M 50 1025 L 65 965 L 95 910 L 85 865 L 125 815 L 170 770 L 235 758 L 290 780 L 355 805 L 405 850 L 442 915 L 425 978 L 438 1025 Z"
            fill="url(#graniteRockGrad)"
            stroke="#050607"
            strokeWidth="2.8"
          />
          <path d="M 125 815 L 170 770 L 235 758 L 220 825 L 160 855 Z" fill="url(#rockHighlightFacet)" />
          <path d="M 235 758 L 290 780 L 275 848 L 220 825 Z" fill="url(#rockHighlightFacet)" opacity="0.8" />
          <path d="M 290 780 L 355 805 L 338 870 L 275 848 Z" fill="url(#rockHighlightFacet)" opacity="0.6" />

          {/* Crevices */}
          <path d="M 125 815 L 165 865 L 192 935 L 185 1025" stroke="#030405" strokeWidth="3.2" fill="none" />
          <path d="M 235 758 L 268 830 L 302 892 L 325 1025" stroke="#030405" strokeWidth="3.4" fill="none" />
          <path d="M 85 865 L 138 890 L 162 975" stroke="#030405" strokeWidth="2.4" fill="none" opacity="0.8" />
          <path d="M 290 780 L 345 840 L 375 925" stroke="#030405" strokeWidth="2.6" fill="none" opacity="0.75" />
          <path d="M 355 805 L 400 865 L 420 945" stroke="#030405" strokeWidth="2.2" fill="none" opacity="0.7" />

          {/* Moss */}
          <path d="M 125 815 Q 180 758, 235 758 Q 295 770, 355 805 L 345 830 Q 285 795, 230 785 Q 175 785, 130 830 Z" fill="url(#rockMossWash)" />

          {/* Nebari Root Grip Anchored into Crevices */}
          <g id="NebariRootSystem" fill="url(#barkCoreGrad)">
            <path d="M 195 850 C 170 878, 140 918, 118 958 C 112 968, 116 974, 126 972 C 145 935, 175 890, 215 858 Z" />
            <path d="M 235 855 C 225 895, 232 945, 248 995 C 252 1005, 262 1005, 265 995 C 252 950, 248 900, 260 858 Z" />
            <path d="M 280 852 C 310 885, 348 925, 378 972 C 386 984, 396 978, 394 966 C 368 920, 332 880, 305 848 Z" />
          </g>
        </g>

        {/* ================================================================ */}
        {/* LAYER 2: THE HIGH-STIFFNESS ANIMATED SAKURA TREE HIERARCHY       */}
        {/* Anchored at nebari base: transformOrigin: 245px 850px            */}
        {/* ================================================================ */}
        <g ref={trunkRef} id="RootedMainTrunk" style={{ transformOrigin: '245px 850px' }}>
          {/* Main Dramatic Contorted S-Curved Trunk */}
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

          {/* Bark Fibers & Knots */}
          <g stroke="url(#barkHighlightGrad)" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 220 848 C 225 808, 248 778, 260 758 C 275 738, 248 698, 212 668 C 190 648, 198 605, 224 570 C 238 550, 246 520, 250 480" />
            <path d="M 240 845 C 245 805, 270 772, 282 752 C 298 732, 270 692, 235 662 C 212 642, 220 598, 248 565 C 262 545, 268 515, 272 478" />
            <path d="M 208 845 C 212 812, 235 785, 248 765 C 255 750, 230 712, 198 680 C 178 660, 185 620, 210 585 C 222 568, 232 535, 238 495" opacity="0.8" />
          </g>

          <ellipse cx="238" cy="620" rx="9" ry="18" transform="rotate(-18, 238, 620)" fill="#020101" />
          <path d="M 226 602 C 220 622, 224 642, 236 652" stroke="#524335" strokeWidth="2.4" fill="none" opacity="0.85" />
          <path d="M 248 598 C 255 618, 252 638, 244 648" stroke="#3D3228" strokeWidth="1.8" fill="none" opacity="0.75" />

          {/* ============================================================== */}
          {/* PRIMARY BOUGH 1: LOW-LEFT SWEEPING BOUGH                       */}
          {/* Pivots at branch junction: transformOrigin: '235px 485px'      */}
          {/* ============================================================== */}
          <g ref={bough1Ref} id="PrimaryBoughLowLeft" style={{ transformOrigin: '235px 485px' }}>
            {/* Deep Under-Canopy for this Bough */}
            <g transform="translate(100, 520) scale(1.15) rotate(-10)" opacity="0.92">
              <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
            </g>

            {/* Branch Wood Structure */}
            <path
              d="M 235 485 C 210 495, 185 515, 165 540 C 145 560, 120 555, 95 538"
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

            {/* Attached Blossom Clusters (Inherits Bough Motion + Adds Flutter) */}
            <g ref={blossomCluster1Ref} id="BlossomsLowLeft" style={{ transformOrigin: '95px 538px' }}>
              <g transform="translate(80, 540) scale(1.08) rotate(10)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
              <g transform="translate(50, 490) scale(0.92) rotate(-15)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
            </g>
          </g>

          {/* ============================================================== */}
          {/* PRIMARY BOUGH 2: MID-LEFT JAGGED BONSAI BRANCH                 */}
          {/* Pivots at branch junction: transformOrigin: '240px 460px'      */}
          {/* ============================================================== */}
          <g ref={bough2Ref} id="PrimaryBoughMidLeft" style={{ transformOrigin: '240px 460px' }}>
            <g transform="translate(130, 410) scale(1.22) rotate(8)" opacity="0.92">
              <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
            </g>

            <path
              d="M 240 460 C 215 442, 188 432, 162 412 C 140 396, 118 392, 90 386"
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

            <g ref={blossomCluster2Ref} id="BlossomsMidLeft" style={{ transformOrigin: '110px 400px' }}>
              <g transform="translate(110, 400) scale(1.15) rotate(6)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
              <g transform="translate(85, 360) scale(0.98) rotate(-8)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
            </g>
          </g>

          {/* ============================================================== */}
          {/* PRIMARY BOUGH 3: UPPER-LEFT CLIMBING BRANCH                    */}
          {/* Pivots at branch junction: transformOrigin: '255px 440px'      */}
          {/* ============================================================== */}
          <g ref={bough3Ref} id="PrimaryBoughUpperLeft" style={{ transformOrigin: '255px 440px' }}>
            <g transform="translate(170, 300) scale(1.28) rotate(-6)" opacity="0.92">
              <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
            </g>

            <path
              d="M 255 440 C 242 400, 222 352, 198 312 C 182 286, 166 262, 142 236"
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

            <g ref={blossomCluster3Ref} id="BlossomsUpperLeft" style={{ transformOrigin: '150px 280px' }}>
              <g transform="translate(150, 280) scale(1.22) rotate(14)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
              <g transform="translate(125, 230) scale(1.05) rotate(-12)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
            </g>
          </g>

          {/* ============================================================== */}
          {/* PRIMARY BOUGH 4: CENTRAL APEX CROWN TRUNK & DOME               */}
          {/* Pivots at branch junction: transformOrigin: '260px 450px'      */}
          {/* ============================================================== */}
          <g ref={bough4Ref} id="PrimaryBoughApexCrown" style={{ transformOrigin: '260px 450px' }}>
            <g transform="translate(270, 180) scale(1.35) rotate(14)" opacity="0.92">
              <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
            </g>

            <path
              d="M 260 450 C 266 392, 276 342, 272 292 C 266 252, 272 212, 262 172"
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

            <g ref={blossomCluster4Ref} id="BlossomsApexCrown" style={{ transformOrigin: '290px 160px' }}>
              <g transform="translate(250, 160) scale(1.3) rotate(8)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
              <g transform="translate(300, 100) scale(1.25) rotate(-10)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
              <g transform="translate(340, 170) scale(1.2) rotate(18)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
            </g>
          </g>

          {/* ============================================================== */}
          {/* PRIMARY BOUGH 5: MAIN RIGHT ARCHING GREAT BOUGH                */}
          {/* Pivots at branch junction: transformOrigin: '275px 460px'      */}
          {/* Strong woody resilience prevents downward sagging in wind      */}
          {/* ============================================================== */}
          <g ref={bough5Ref} id="PrimaryBoughGreatRight" style={{ transformOrigin: '275px 460px' }}>
            <g transform="translate(420, 260) scale(1.32) rotate(-8)" opacity="0.92">
              <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
            </g>
            <g transform="translate(520, 360) scale(1.28) rotate(12)" opacity="0.92">
              <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
            </g>

            <path
              d="M 275 460 C 310 470, 350 480, 390 470 C 430 460, 470 440, 510 410 C 545 385, 575 355, 610 320"
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

            {/* Attached Upper & Mid-Right Blossom Canopy Shelves */}
            <g ref={blossomCluster5Ref} id="BlossomsGreatRight" style={{ transformOrigin: '530px 290px' }}>
              <g transform="translate(430, 240) scale(1.28) rotate(-6)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
              <g transform="translate(500, 210) scale(1.22) rotate(15)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
              <g transform="translate(560, 320) scale(1.25) rotate(-8)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
              <g transform="translate(630, 310) scale(1.18) rotate(12)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
              <g transform="translate(690, 320) scale(1.05) rotate(22)">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>
            </g>

            {/* ============================================================ */}
            {/* PRIMARY BOUGH 6: LOWER-RIGHT SECONDARY BOUGH                 */}
            {/* Branch off lower side of right bough: origin: '430px 460px'  */}
            {/* ============================================================ */}
            <g ref={bough6Ref} id="PrimaryBoughLowRight" style={{ transformOrigin: '430px 460px' }}>
              <g transform="translate(500, 520) scale(1.18) rotate(18)" opacity="0.92">
                <use href={isMomiji ? '#momijiCloudShelf' : '#sakuraCloudShelf'} />
              </g>

              <path
                d="M 430 460 C 455 490, 485 520, 520 540 C 555 560, 595 570, 630 575"
                stroke="#080605"
                strokeWidth="11"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M 520 540 C 545 565, 575 585, 605 605" stroke="#0D0907" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M 630 575 Q 656 580, 680 578" stroke="#120E0B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M 605 605 Q 626 618, 650 622" stroke="#120E0B" strokeWidth="2.4" strokeLinecap="round" fill="none" />

              <g ref={blossomCluster6Ref} id="BlossomsLowRight" style={{ transformOrigin: '550px 520px' }}>
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
            </g>
          </g>
        </g>
      </svg>

      {/* 2. Real-Time Falling Petals/Leaves Canvas */}
      <canvas ref={canvasRef} className="sakura-local-petals-canvas" />
    </div>
  );
}
