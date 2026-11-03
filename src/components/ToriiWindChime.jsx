import React, { useRef, useEffect, useCallback } from 'react';
import { windSystem } from '../utils/windSystem';
import { sound } from '../utils/soundEngine';

/**
 * ToriiWindChime (風鈴 — Traditional Japanese Fūrin)
 * -----------------------------------------------------------------------------
 * A physically simulated Japanese wind chime suspended beneath the Shinto Torii gate.
 *
 * Physical Model & Coupled Pendulum Dynamics:
 *  1. Attachment & Suspension:
 *     - Fixed forged iron bracket bolted under the horizontal Torii beam at (0, 5)
 *     - Braided silk suspension cord hanging from (0, 5) to (0, 28)
 *     - Heavy cast bronze bell dome (m ≈ 75g, I ≈ mL²) pivoting at (0, 5)
 *  2. Clapper (Zetsu):
 *     - Suspended on an inner silk thread inside the bell cavity at (0, 2)
 *     - Medium inertia pellet (m ≈ 15g) hanging at rim height (y = 16.5)
 *     - Constrained inside the bell cavity (hits the bell wall at ~15° relative swing)
 *  3. Tanzaku Washi Paper Strip (Aerodynamic Sail):
 *     - Tied to the clapper bottom ring at (0, 26)
 *     - Ultra-lightweight paper (m ≈ 2g) with high surface area and aerodynamic drag
 *     - Reacts immediately to wind gusts, pulling the clapper and hanging assembly
 *     - Flexible multi-segment geometry: upper segment (kanji 静) + lower segment (seal 印)
 *       with aeroelastic flutter, 3D torsion, and trailing wind curl
 *  4. Delayed Chain Reaction:
 *     - Wind accelerates paper strip first (almost immediate)
 *     - Paper tension pulls the clapper with secondary lag (100–250ms delay)
 *     - Clapper pull and impact transfer to the heavy bronze bell (smooth delayed pendulum swing, T ≈ 2.4s)
 *     - After gusts, the paper settles quickly while the bell continues gentle damped harmonic oscillation
 *  5. Acoustic Chime Trigger:
 *     - Physical rim collision detection triggers sound.playFurinChime(intensity)
 *     - Fully respects global sound mute setting (Sound ON/OFF in Navbar)
 *     - Natural meditative cooldown (1.6s–3.0s) prevents repetitive or frantic ringing
 *  6. Performance & Lifecycle:
 *     - Zero React re-renders during 60 FPS animation (direct SVG attribute manipulation)
 *     - IntersectionObserver pauses simulation when offscreen
 *     - Supports prefers-reduced-motion
 */
export default function ToriiWindChime({
  anchorX = 276,
  anchorY = 140,
  className = '',
}) {
  const rootRef = useRef(null);
  const bellAndCordGroupRef = useRef(null);
  const clapperGroupRef = useRef(null);
  const paperRootGroupRef = useRef(null);
  const paperLowerGroupRef = useRef(null);

  // Dynamic Multi-Body Physics Simulation State
  const physics = useRef({
    // 1. Bronze Bell Pendulum (Absolute world angle in radians from vertical)
    bellAngle: 0.0,
    bellVelocity: 0.0,

    // 2. Clapper (Absolute world angle in radians from vertical)
    clapperAngle: 0.0,
    clapperVelocity: 0.0,

    // 3. Tanzaku Paper Strip (Absolute world angle of upper paper in radians)
    paperAngle: 0.0,
    paperVelocity: 0.0,

    // 4. Lower Paper Curl (Relative flex angle in radians from upper paper)
    curlAngle: 0.0,
    curlVelocity: 0.0,

    // 5. 3D Aerodynamic Torsion (Twist around Y-axis in radians)
    torsionAngle: 0.0,

    // Audio & Interaction Timing
    chimeCooldown: 0.0,
    lastTime: performance.now(),
    isVisible: true,
  });

  // 1. Viewport Visibility Tracking (Pause loop when offscreen to save CPU)
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        physics.current.isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          physics.current.lastTime = performance.now();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2. 60 FPS Semi-Implicit Euler Coupled Physics Loop
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId;
    const p = physics.current;
    p.lastTime = performance.now();

    // Physical Constants
    const G_BELL = 7.2;          // Natural frequency squared (g/L_eff) for heavy bronze bell (T ≈ 2.4s)
    const DAMP_BELL = 0.88;       // Low viscous damping (bronze bell swings gracefully for multiple cycles)
    const K_WIND_BELL = 1.9;      // Aerodynamic drag on smooth compact bronze dome

    const G_CLAPPER = 12.2;       // Natural frequency squared for inner clapper
    const DAMP_CLAPPER = 1.55;    // Clapper air & pivot damping
    const K_PULL_BY_PAPER = 10.8; // Tension torque transmitted from paper onto clapper
    const K_BELL_COUPLE = 4.2;    // Clapper pivot acceleration from bell movement

    const G_PAPER = 15.5;         // Restoring gravity on paper
    const DAMP_PAPER = 2.75;      // Aerodynamic drag on lightweight paper
    const K_WIND_PAPER = 29.5;    // High wind sail area (paper reacts first!)
    const K_COUPLE_PAPER = 12.0;  // Tension alignment with clapper

    const K_SPRING_CURL = 42.0;   // Spring stiffness of lower paper flex
    const DAMP_CURL = 6.5;        // Damping on paper flex
    const CONTACT_LIMIT = 0.26;   // rad (~15.0° relative displacement before rim collision)

    const updatePhysics = (now) => {
      animId = requestAnimationFrame(updatePhysics);

      if (!p.isVisible) {
        p.lastTime = now;
        return;
      }

      const rawDt = (now - p.lastTime) / 1000;
      p.lastTime = now;
      // Clamp dt to 35ms max to avoid numerical instability after tab backgrounding
      const dt = Math.min(0.035, Math.max(0.001, rawDt));

      // Decrement chime cooldown
      if (p.chimeCooldown > 0) {
        p.chimeCooldown -= dt;
      }

      // ==============================================================
      // A. COMPUTE SMOOTH REALISTIC AERODYNAMIC WIND SIGNAL
      // ==============================================================
      const wind = windSystem.getState();
      const t = wind.time;

      // 1. Organic multi-frequency shifting breeze
      const ambientBreeze =
        0.38 +
        0.18 * Math.sin(t * 0.48) +
        0.12 * Math.cos(t * 1.12 + 0.5) +
        0.06 * Math.sin(t * 1.95 + 1.8);

      // 2. Slow directional shift (predominantly blowing to the right into the shrine)
      const dirShift = 1.0 + 0.18 * Math.sin(t * 0.22);

      // 3. Natural gusts with smooth bell envelope and micro-turbulence
      const gustEnvelope = wind.gust > 0.05 ? wind.gust * 2.3 : 0;
      const microTurbulence =
        (Math.sin(t * 3.8) * 0.12 + Math.sin(t * 7.4) * 0.07) *
        (0.25 + gustEnvelope * 0.75);

      // Total effective horizontal wind speed (always smooth and positive)
      const windSpeed = Math.max(
        0.04,
        (ambientBreeze * dirShift + gustEnvelope + microTurbulence) *
          (wind.windX > 0 ? 1 : 0.85)
      );

      // ==============================================================
      // B. TANZAKU PAPER PHYSICS (First Responder: Catches Wind First)
      // ==============================================================
      // Aerodynamic horizontal push on the paper
      const paperWindTorque = K_WIND_PAPER * windSpeed * Math.max(0.3, Math.cos(p.paperAngle));
      // Gravity restoring torque
      const paperGravityTorque = -G_PAPER * Math.sin(p.paperAngle);
      // Tension coupling pulling paper toward clapper
      const paperTensionTorque = -K_COUPLE_PAPER * (p.paperAngle - p.clapperAngle);
      // Aerodynamic damping
      const paperAlpha =
        paperGravityTorque +
        paperWindTorque +
        paperTensionTorque -
        DAMP_PAPER * p.paperVelocity;

      p.paperVelocity += paperAlpha * dt;
      p.paperAngle += p.paperVelocity * dt;

      // Lower paper segment curl / trailing bend
      const targetCurl = 0.38 * (p.paperAngle - p.clapperAngle) + 0.16 * windSpeed;
      const flutter =
        Math.sin(t * (7.5 + windSpeed * 5.0)) * (0.035 + windSpeed * 0.12);
      const curlAlpha =
        K_SPRING_CURL * (targetCurl + flutter - p.curlAngle) -
        DAMP_CURL * p.curlVelocity;

      p.curlVelocity += curlAlpha * dt;
      p.curlAngle += p.curlVelocity * dt;

      // 3D Aerodynamic Torsion (Paper twisting along vertical axis as it spills wind)
      const targetTorsion =
        Math.sin(t * (5.2 + windSpeed * 3.8) + 1.1) *
        Math.min(0.65, 0.12 + windSpeed * 0.32);
      p.torsionAngle += (targetTorsion - p.torsionAngle) * Math.min(1.0, dt * 6.0);

      // ==============================================================
      // C. CLAPPER DYNAMICS (Intermediate Link: Pulled by Paper)
      // ==============================================================
      // Gravity restoring torque
      const clapperGravityTorque = -G_CLAPPER * Math.sin(p.clapperAngle);
      // Upward tension pull transmitted from the deflected paper strip
      const clapperPullFromPaper = K_PULL_BY_PAPER * (p.paperAngle - p.clapperAngle);
      // Inertial coupling from the swinging bell
      const clapperCoupleFromBell = K_BELL_COUPLE * (p.bellAngle - p.clapperAngle);

      const clapperAlpha =
        clapperGravityTorque +
        clapperPullFromPaper +
        clapperCoupleFromBell -
        DAMP_CLAPPER * p.clapperVelocity;

      p.clapperVelocity += clapperAlpha * dt;
      p.clapperAngle += p.clapperVelocity * dt;

      // ==============================================================
      // D. BRONZE BELL PENDULUM (Heavy Suspended Mass: Delayed Swing)
      // ==============================================================
      // Heavy bell inertia resists quick changes; responds with dignified lag
      const bellGravityTorque = -G_BELL * Math.sin(p.bellAngle);
      // Direct wind force on bronze dome (small)
      const bellWindTorque = K_WIND_BELL * windSpeed * Math.cos(p.bellAngle);
      // Reaction pull transmitted from clapper suspension
      const bellFromClapper = 3.2 * (p.clapperAngle - p.bellAngle);

      const bellAlpha =
        bellGravityTorque +
        bellWindTorque +
        bellFromClapper -
        DAMP_BELL * p.bellVelocity;

      p.bellVelocity += bellAlpha * dt;
      p.bellAngle += p.bellVelocity * dt;

      // ==============================================================
      // E. CLAPPER / BELL RIM COLLISION & ACOUSTIC CHIME
      // ==============================================================
      const relAngle = p.clapperAngle - p.bellAngle;
      if (Math.abs(relAngle) >= CONTACT_LIMIT) {
        const sign = Math.sign(relAngle);
        // Hard boundary collision limit (clapper cannot pierce bell wall)
        p.clapperAngle = p.bellAngle + sign * CONTACT_LIMIT;

        const relVelocity = p.clapperVelocity - p.bellVelocity;

        // Only process impact if clapper is moving into the rim
        if (relVelocity * sign > 0) {
          const restitution = 0.28;
          // Elastic rebound with damping
          p.clapperVelocity = p.bellVelocity - sign * Math.abs(relVelocity) * restitution;
          // Momentum transfer kick to bell
          p.bellVelocity += sign * Math.abs(relVelocity) * 0.16;

          // Acoustic chime trigger condition:
          // 1. Sufficient impact velocity (> 0.40 rad/s)
          // 2. Natural peaceful cooldown elapsed
          const impactSpeed = Math.abs(relVelocity);
          if (impactSpeed > 0.40 && p.chimeCooldown <= 0) {
            const intensity = Math.min(1.0, impactSpeed / 1.7);
            sound.playFurinChime(intensity);
            p.chimeCooldown = 1.6 + Math.random() * 1.4; // 1.6 - 3.0s peaceful cooldown
          }
        }
      }

      // ==============================================================
      // F. UPDATE SVG NODE TRANSFORMS (Zero React Re-renders)
      // ==============================================================
      // 1. Bell & Suspension Cord: Rotates at Torii eyelet (0, 5)
      const bellDeg = (p.bellAngle * (180 / Math.PI)).toFixed(2);
      if (bellAndCordGroupRef.current) {
        bellAndCordGroupRef.current.setAttribute(
          'transform',
          `rotate(${bellDeg}, 0, 5)`
        );
      }

      // 2. Clapper Assembly: Rotates relative to Bell at inner ceiling (0, 2)
      const clapperRelDeg = (
        (p.clapperAngle - p.bellAngle) *
        (180 / Math.PI)
      ).toFixed(2);
      if (clapperGroupRef.current) {
        clapperGroupRef.current.setAttribute(
          'transform',
          `translate(0, 2) rotate(${clapperRelDeg}, 0, 0)`
        );
      }

      // 3. Tanzaku Paper: Rotates relative to Clapper bottom ring at (0, 26)
      // Includes 3D aerodynamic torsion scale (cos) and wind skew
      const paperRelDeg = (
        (p.paperAngle - p.clapperAngle) *
        (180 / Math.PI)
      ).toFixed(2);
      const torsionScaleX = Math.max(
        0.65,
        Math.abs(Math.cos(p.torsionAngle))
      ).toFixed(3);
      const skewY = (Math.sin(p.torsionAngle) * 3.2).toFixed(2);

      if (paperRootGroupRef.current) {
        paperRootGroupRef.current.setAttribute(
          'transform',
          `translate(0, 26) rotate(${paperRelDeg}, 0, 0) scale(${torsionScaleX}, 1) skewY(${skewY})`
        );
      }

      // 4. Lower Paper Segment: Bends and curls at mid-crease (0, 24)
      const curlDeg = (p.curlAngle * (180 / Math.PI)).toFixed(2);
      if (paperLowerGroupRef.current) {
        paperLowerGroupRef.current.setAttribute(
          'transform',
          `translate(0, 24) rotate(${curlDeg}, 0, 0)`
        );
      }
    };

    animId = requestAnimationFrame(updatePhysics);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // 3. Interactive Tactile Chime (Hover / Click delivers an organic impulse)
  const handleInteract = useCallback((e) => {
    e.stopPropagation();
    const p = physics.current;
    // Add physical impulse: disturbance ripples through paper and clapper
    const dir = Math.random() > 0.5 ? 1 : -1;
    p.paperVelocity += dir * 2.4;
    p.clapperVelocity += dir * 1.6;
    p.bellVelocity += dir * 0.45;
    p.curlVelocity += dir * 1.8;
    sound.playFurinChime(0.85);
    sound.playWoodenClick();
  }, []);

  const handleMouseEnter = useCallback(() => {
    const p = physics.current;
    // Gentle air disturbance on hover
    p.paperVelocity += 1.1;
    p.clapperVelocity += 0.55;
    p.curlVelocity += 0.9;
  }, []);

  return (
    <g
      ref={rootRef}
      id="ToriiWindChime"
      className={`torii-wind-chime ${className}`}
      transform={`translate(${anchorX}, ${anchorY})`}
      onClick={handleInteract}
      onMouseEnter={handleMouseEnter}
      role="button"
      tabIndex={0}
      aria-label="Traditional Japanese Wind Chime (風鈴 — Fūrin) hanging from Torii gate. Click to chime."
      style={{ cursor: 'pointer' }}
    >
      <title>風鈴 — Traditional Japanese Wind Chime (Click to chime)</title>

      <defs>
        {/* Antique Cast Bronze Outer Shell Gradient */}
        <linearGradient id="furinBronzeOuter" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#241E17" />
          <stop offset="25%" stopColor="#4A3D2F" />
          <stop offset="55%" stopColor="#736049" />
          <stop offset="78%" stopColor="#4A3D2F" />
          <stop offset="100%" stopColor="#1E1913" />
        </linearGradient>

        {/* Warm Aged Gold Rim Highlight */}
        <linearGradient id="furinGoldRim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7A6038" />
          <stop offset="35%" stopColor="#C4A668" />
          <stop offset="65%" stopColor="#E0C88E" />
          <stop offset="85%" stopColor="#A68449" />
          <stop offset="100%" stopColor="#5E4728" />
        </linearGradient>

        {/* Deep Bell Cavity Interior Shadow */}
        <radialGradient id="furinInnerShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B0907" />
          <stop offset="60%" stopColor="#18130E" />
          <stop offset="100%" stopColor="#2D2319" />
        </radialGradient>

        {/* Tanzaku Washi Paper Pale Ivory Gradient */}
        <linearGradient id="tanzakuWashiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F9F5EC" />
          <stop offset="35%" stopColor="#F4EDE0" />
          <stop offset="75%" stopColor="#ECE1CF" />
          <stop offset="100%" stopColor="#E2D4BF" />
        </linearGradient>
      </defs>

      {/* ============================================================== */}
      {/* 1. FIXED ATTACHMENT BRACKET ON TORII BEAM (Never Moves)       */}
      {/* ============================================================== */}
      <g id="ChimeFixedAnchor">
        {/* Forged Iron Mounting Bracket */}
        <rect x="-3.5" y="0" width="7" height="3" rx="0.8" fill="#0C0E0D" />
        <rect x="-2" y="2.5" width="4" height="2" fill="#141715" />
        {/* Iron Eyelet Ring centered at (0, 5) */}
        <circle cx="0" cy="5" r="2.2" stroke="#2B2620" strokeWidth="1" fill="none" />
      </g>

      {/* ============================================================== */}
      {/* 2. MAIN HANGING ASSEMBLY (Suspension Cord + Bronze Bell Body)   */}
      {/*    Pivots at the exact Torii bracket eyelet: (0, 5)            */}
      {/* ============================================================== */}
      <g ref={bellAndCordGroupRef} id="BellAndCordAssembly" transform="rotate(0, 0, 5)">
        {/* Braided Silk Cord from eyelet (0, 5) to bell top (0, 28) */}
        <line
          x1="0"
          y1="5"
          x2="0"
          y2="28"
          stroke="#3D3023"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        {/* Top Cord Knot at eyelet */}
        <circle cx="0" cy="7" r="1.1" fill="#1C1610" />
        {/* Amber / Cinnabar Decorative Knot Bead above Bell */}
        <circle cx="0" cy="26" r="1.6" fill="#8C2B1D" />
        <circle cx="0" cy="26" r="0.8" fill="#D9533B" opacity="0.85" />

        {/* Bronze Bell Body starting at (0, 28) */}
        <g id="BronzeBell" transform="translate(0, 28)">
          {/* Bell Top Suspension Loop */}
          <path
            d="M -1.8 0 C -1.8 -2.5, 1.8 -2.5, 1.8 0"
            stroke="#4A3D2F"
            strokeWidth="0.9"
            fill="none"
          />

          {/* Antique Bronze Outer Shell (Temple Bell Dome Contour) */}
          <path
            d="M -2 1.5
               C -2 0.8, -1 0.2, 0 0.2
               C 1 0.2, 2 0.8, 2 1.5
               C 5 4, 8 8, 8.5 13.5
               C 8.8 15.5, 9.8 17.5, 10 18.5
               L -10 18.5
               C -9.8 17.5, -8.8 15.5, -8.5 13.5
               C -8 8, -5 4, -2 1.5 Z"
            fill="url(#furinBronzeOuter)"
            stroke="#16120D"
            strokeWidth="0.6"
          />

          {/* Incised Line Detailing on Bell Waist */}
          <path
            d="M -7.5 7 Q 0 8.5, 7.5 7"
            stroke="#221B13"
            strokeWidth="0.6"
            fill="none"
            opacity="0.75"
          />
          <path
            d="M -8.2 12 Q 0 13.8, 8.2 12"
            stroke="#221B13"
            strokeWidth="0.6"
            fill="none"
            opacity="0.75"
          />
          <path
            d="M -8.2 12.8 Q 0 14.6, 8.2 12.8"
            stroke="#8A7352"
            strokeWidth="0.4"
            fill="none"
            opacity="0.65"
          />

          {/* Warm Sunlight Glint Reflection on Shoulder */}
          <path
            d="M -4 3 C -6 6, -6.5 10, -6.8 14"
            stroke="rgba(235, 215, 175, 0.45)"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Hollow Bell Interior Opening & Deep Shadow Cavity */}
          <ellipse cx="0" cy="18.5" rx="10" ry="3.2" fill="url(#furinInnerShadow)" />

          {/* Flanged Golden Bronze Bottom Rim */}
          <ellipse
            cx="0"
            cy="18.5"
            rx="10"
            ry="3.2"
            fill="none"
            stroke="url(#furinGoldRim)"
            strokeWidth="1.1"
          />

          {/* ========================================================== */}
          {/* 3. INTERNAL CLAPPER (Zetsu)                                */}
          {/*    Suspended from inner ceiling at (0, 2) inside bell       */}
          {/* ========================================================== */}
          <g ref={clapperGroupRef} id="InternalClapper" transform="translate(0, 2) rotate(0, 0, 0)">
            {/* Inner Silk Thread from (0, 0) to Pellet (0, 16.5) */}
            <line x1="0" y1="0" x2="0" y2="16.5" stroke="#3D3023" strokeWidth="0.6" />

            {/* Bronze Clapper Pellet (Hangs at rim level) */}
            <circle cx="0" cy="16.5" r="2.2" fill="#524332" stroke="#1D1711" strokeWidth="0.5" />
            <circle cx="-0.6" cy="15.8" r="0.7" fill="#8F785C" opacity="0.7" />

            {/* Clapper Bottom Eyelet Ring */}
            <circle cx="0" cy="19.5" r="1.3" stroke="#3D3023" strokeWidth="0.6" fill="none" />

            {/* Connecting Silk Thread to Tanzaku Paper Tie at (0, 26) */}
            <line x1="0" y1="19.5" x2="0" y2="26" stroke="#3D3023" strokeWidth="0.6" />

            {/* ======================================================== */}
            {/* 4. TANZAKU WASHI PAPER STRIP (Tied to Clapper Bottom)   */}
            {/*    Pivots from clapper tie point at (0, 26)              */}
            {/* ======================================================== */}
            <g ref={paperRootGroupRef} id="TanzakuPaper" transform="translate(0, 26) rotate(0, 0, 0)">
              {/* Upper Paper Segment (Length: 24px) */}
              <g id="PaperUpperSegment">
                <path
                  d="M -6 0 L 6 0 L 6 24 L -6 24 Z"
                  fill="url(#tanzakuWashiGrad)"
                  stroke="rgba(80, 65, 48, 0.22)"
                  strokeWidth="0.4"
                />

                {/* Reinforced Punched Hanging Hole */}
                <circle cx="0" cy="2.5" r="1.4" fill="none" stroke="#695744" strokeWidth="0.6" />
                <circle cx="0" cy="2.5" r="0.7" fill="#1A1510" />

                {/* Vertical Washi Crease Line */}
                <line
                  x1="0.5"
                  y1="4"
                  x2="0.5"
                  y2="24"
                  stroke="#D1C2A5"
                  strokeWidth="0.4"
                  opacity="0.6"
                />

                {/* Japanese Calligraphy Kanji: 静 (Stillness) */}
                <text
                  x="0"
                  y="17"
                  textAnchor="middle"
                  fontFamily="'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', serif"
                  fontSize="8.5"
                  fontWeight="600"
                  fill="#1B1C18"
                  opacity="0.88"
                  style={{ userSelect: 'none' }}
                >
                  静
                </text>
              </g>

              {/* Lower Paper Segment (Length: 22px, pivots at y=24 with flex/curl) */}
              <g ref={paperLowerGroupRef} id="PaperLowerSegment" transform="translate(0, 24) rotate(0, 0, 0)">
                <path
                  d="M -6 0 L 6 0 L 6 22 L -6 22 Z"
                  fill="url(#tanzakuWashiGrad)"
                  stroke="rgba(80, 65, 48, 0.22)"
                  strokeWidth="0.4"
                />

                {/* Crease continuation */}
                <line
                  x1="0.5"
                  y1="0"
                  x2="0.5"
                  y2="20"
                  stroke="#D1C2A5"
                  strokeWidth="0.4"
                  opacity="0.6"
                />

                {/* Authentic Red Lacquer Hanko Seal Stamp (印 - Sacred Seal) */}
                <rect x="-4.2" y="12" width="4.8" height="4.8" rx="0.5" fill="#A8282B" opacity="0.88" />
                <rect x="-3.8" y="12.4" width="4" height="4" fill="none" stroke="#FAF4EB" strokeWidth="0.4" opacity="0.7" />
                <circle cx="-1.8" cy="14.4" r="1.1" fill="#FAF4EB" opacity="0.85" />

                {/* Translucent Fibers on Bottom Deckled Edge */}
                <path
                  d="M -6 22 L -5 22.5 L -3 22 L 0 22.4 L 3 22 L 6 22.3 L 6 22 Z"
                  fill="#D6C5AA"
                  opacity="0.5"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}
