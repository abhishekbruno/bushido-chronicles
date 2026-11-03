import React, { useRef, useEffect, useCallback } from 'react';
import { windSystem } from '../utils/windSystem';
import { sound } from '../utils/soundEngine';

/**
 * ToriiWindChime (風鈴 — Traditional Japanese Fūrin)
 * -----------------------------------------------------------------------------
 * A beautifully detailed, physically animated traditional Japanese wind chime
 * suspended beneath the horizontal beam of the Shinto Torii gate:
 *  - Antique Cast Bronze Bell with hollow bell opening, weathered bronze gradients,
 *    and warm aged gold rim highlight (#C4A668)
 *  - Fixed Iron Attachment Bracket & Ring bolted to the underside of the Torii beam
 *  - Braided Silk Suspension Cord with traditional amber/cinnabar knot bead
 *  - Internal Bronze Clapper (Zetsu) suspended inside the bell cavity
 *  - Delicate Tanzaku Washi Paper Strip with Japanese calligraphy "静" (Stillness),
 *    crimson hanko seal stamp, reinforced eyelet, and independent flutter/torsion
 *  - Damped Pendulum Physics:
 *      * Solves θ'' = -(g/L) sin(θ) - c θ' + τ_wind / I using semi-implicit Euler
 *      * Bell swings ~1–3° in calm breeze, ~3–6° in moderate breeze, up to ~8–10° in gusts
 *      * Paper strip reacts first, flexing 6°–18° with aerodynamic flutter
 *      * Clapper swings inside bell; on contact with bell rim, triggers soft chime
 *  - Integrated Audio:
 *      * Triggers sound.playFurinChime() with contact-proportional velocity
 *      * Fully respects global sound mute setting (Sound ON/OFF in Navbar)
 *      * Natural cooldown prevents repetitive or loud ringing
 *  - Interactive: Hover or click gives the chime a gentle physical impulse
 *  - 60 FPS Ref-based transforms (0 React re-renders), prefers-reduced-motion safe
 */
export default function ToriiWindChime({
  anchorX = 276,
  anchorY = 140,
  className = '',
}) {
  const rootRef = useRef(null);
  const cordRef = useRef(null);
  const bellGroupRef = useRef(null);
  const clapperRef = useRef(null);
  const paperGroupRef = useRef(null);
  const paperLowerRef = useRef(null);

  // Physics Simulation State (stored in refs for 60 FPS zero-render execution)
  const physics = useRef({
    // Bronze Bell Pendulum State
    bellAngle: 0.0,      // radians
    bellVelocity: 0.0,   // rad/s
    // Internal Clapper State
    clapperAngle: 0.0,   // radians
    clapperVelocity: 0.0,// rad/s
    // Tanzaku Paper Strip State
    paperAngle: 0.0,     // radians
    paperVelocity: 0.0,  // rad/s
    paperCurl: 0.0,      // radians
    // Audio Collision Cooldown
    chimeCooldown: 0.0,  // seconds
    lastTime: performance.now(),
    isActive: true,
  });

  // 1. Semi-Implicit Euler Physics Engine Loop
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId;
    const p = physics.current;
    p.lastTime = performance.now();

    // Physical Constants
    const CORD_LEN = 26;       // px
    const G_BELL = 8.8;        // g/L for bell pendulum
    const DAMP_BELL = 1.15;    // damping coefficient for heavy bronze
    const G_CLAPPER = 12.0;    // g/L for inner clapper
    const DAMP_CLAPPER = 1.8;  // clapper damping
    const G_PAPER = 14.5;      // g/L for light washi paper
    const DAMP_PAPER = 2.4;    // aerodynamic drag on paper
    const CONTACT_LIMIT = 0.072; // rad (~4.1° relative displacement triggers rim contact)

    const updatePhysics = (now) => {
      const rawDt = (now - p.lastTime) / 1000;
      p.lastTime = now;
      // Clamp dt to 40ms max to prevent physics instability when backgrounded
      const dt = Math.min(0.04, Math.max(0.001, rawDt));

      const wind = windSystem.getState();
      const t = wind.time;

      // Decrement chime cooldown
      if (p.chimeCooldown > 0) {
        p.chimeCooldown -= dt;
      }

      // Wind field forces
      // Baseline breeze: 0.2 - 0.8, gusts: up to 1.8+
      const windPush = wind.windX * 0.45 + wind.gust * 0.65;
      const windGustFactor = 1.0 + wind.gust * 2.2;

      // -------------------------------------------------------------
      // A. Tanzaku Paper Physics (Lightweight washi catches wind first)
      // -------------------------------------------------------------
      const paperWindTorque = windPush * 18.0 * windGustFactor;
      const paperGravityTorque = -G_PAPER * Math.sin(p.paperAngle);
      const paperAlpha = paperGravityTorque + paperWindTorque - DAMP_PAPER * p.paperVelocity;

      p.paperVelocity += paperAlpha * dt;
      p.paperAngle += p.paperVelocity * dt;

      // Paper torsion & curl (flutter frequency increases with wind speed)
      const flutterPhase = t * 6.2;
      const flutterMag = Math.min(1.2, wind.speed * 0.45 + wind.gust * 0.8);
      p.paperCurl = Math.sin(flutterPhase) * 0.18 * flutterMag;

      // -------------------------------------------------------------
      // B. Clapper Physics (Connected to paper & inner bell cavity)
      // -------------------------------------------------------------
      // Paper exerts pull torque on clapper
      const paperPullOnClapper = (p.paperAngle - p.clapperAngle) * 9.5;
      const clapperGravityTorque = -G_CLAPPER * Math.sin(p.clapperAngle);
      const clapperAlpha = clapperGravityTorque + paperPullOnClapper - DAMP_CLAPPER * p.clapperVelocity;

      p.clapperVelocity += clapperAlpha * dt;
      p.clapperAngle += p.clapperVelocity * dt;

      // -------------------------------------------------------------
      // C. Bronze Bell Pendulum Physics (Heavy inertia & suspension)
      // -------------------------------------------------------------
      // Bell experiences gentle direct wind + pull transmitted from clapper/paper
      const clapperForceOnBell = (p.clapperAngle - p.bellAngle) * 3.8;
      const directBellWind = windPush * 2.2;
      const bellGravityTorque = -G_BELL * Math.sin(p.bellAngle);
      const bellAlpha = bellGravityTorque + directBellWind + clapperForceOnBell - DAMP_BELL * p.bellVelocity;

      p.bellVelocity += bellAlpha * dt;
      p.bellAngle += p.bellVelocity * dt;

      // -------------------------------------------------------------
      // D. Clapper / Bell Rim Collision & Acoustic Chime Trigger
      // -------------------------------------------------------------
      const relAngle = p.clapperAngle - p.bellAngle;
      if (Math.abs(relAngle) >= CONTACT_LIMIT) {
        const sign = Math.sign(relAngle);
        // Hard boundary collision limit
        p.clapperAngle = p.bellAngle + sign * CONTACT_LIMIT;

        const relVelocity = Math.abs(p.clapperVelocity - p.bellVelocity);

        // Sound trigger condition: sufficient impact velocity + cooldown elapsed
        if (relVelocity > 0.38 && p.chimeCooldown <= 0) {
          const intensity = Math.min(1.0, relVelocity / 1.6);
          sound.playFurinChime(intensity);
          p.chimeCooldown = 1.3 + Math.random() * 0.7; // 1.3 - 2.0s cooldown between chimes
        }

        // Elastic rebound
        const restitution = 0.32;
        p.clapperVelocity = p.bellVelocity - sign * relVelocity * restitution;
      }

      // -------------------------------------------------------------
      // E. Update SVG Node Transforms Directly (Zero React Re-renders)
      // -------------------------------------------------------------
      const bellDeg = (p.bellAngle * (180 / Math.PI)).toFixed(2);
      const clapperRelDeg = ((p.clapperAngle - p.bellAngle) * (180 / Math.PI)).toFixed(2);
      const paperRelDeg = ((p.paperAngle - p.bellAngle) * (180 / Math.PI)).toFixed(2);
      const curlDeg = (p.paperCurl * (180 / Math.PI)).toFixed(2);

      // 1. Suspension Cord: angle follows bell swing
      if (cordRef.current) {
        cordRef.current.setAttribute('transform', `rotate(${bellDeg})`);
      }

      // 2. Bronze Bell Body: swings with cord angle
      if (bellGroupRef.current) {
        bellGroupRef.current.setAttribute('transform', `rotate(${bellDeg})`);
      }

      // 3. Clapper: swings inside bell with relative angle
      if (clapperRef.current) {
        clapperRef.current.setAttribute('transform', `rotate(${clapperRelDeg})`);
      }

      // 4. Tanzaku Paper: flutters and deflects independently
      if (paperGroupRef.current) {
        // Subtle 3D perspective foreshortening via cos
        const torsionScaleX = Math.max(0.65, Math.abs(Math.cos(p.paperCurl * 2.2))).toFixed(3);
        paperGroupRef.current.setAttribute(
          'transform',
          `rotate(${paperRelDeg}) scale(${torsionScaleX}, 1)`
        );
      }

      // 5. Lower Paper Segment: independent flex / curling
      if (paperLowerRef.current) {
        paperLowerRef.current.setAttribute('transform', `rotate(${curlDeg})`);
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 2. Interactive Tactile Chime (Hover / Click gives an organic impulse)
  const handleInteract = useCallback((e) => {
    e.stopPropagation();
    const p = physics.current;
    // Add physical impulse
    p.paperVelocity += (Math.random() > 0.5 ? 1 : -1) * 2.2;
    p.clapperVelocity += (Math.random() > 0.5 ? 1 : -1) * 1.5;
    p.bellVelocity += (Math.random() > 0.5 ? 1 : -1) * 0.4;
    sound.playFurinChime(0.85);
    sound.playWoodenClick();
  }, []);

  const handleMouseEnter = useCallback(() => {
    const p = physics.current;
    // Gentle disturbance on hover
    p.paperVelocity += 0.9;
    p.clapperVelocity += 0.5;
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
      {/* 1. FIXED ATTACHMENT POINT ON TORII BEAM                         */}
      {/* ============================================================== */}
      <g id="ChimeFixedAnchor">
        {/* Forged Iron Mounting Bracket */}
        <rect x="-3.5" y="0" width="7" height="3" rx="0.8" fill="#0C0E0D" />
        <rect x="-2" y="2.5" width="4" height="2" fill="#141715" />
        {/* Iron Eyelet Ring */}
        <circle cx="0" cy="5" r="2.2" stroke="#2B2620" strokeWidth="1" fill="none" />
      </g>

      {/* ============================================================== */}
      {/* 2. SUSPENSION CORD (Pivots smoothly at attachment eyelet)      */}
      {/* ============================================================== */}
      <g ref={cordRef} style={{ transformOrigin: '0px 5px' }}>
        {/* Braided Silk Cord */}
        <line x1="0" y1="5" x2="0" y2="28" stroke="#3D3023" strokeWidth="0.9" strokeLinecap="round" />
        {/* Top Cord Knot */}
        <circle cx="0" cy="7" r="1.1" fill="#1C1610" />
        {/* Amber / Cinnabar Decorative Knot Bead above Bell */}
        <circle cx="0" cy="26" r="1.6" fill="#8C2B1D" />
        <circle cx="0" cy="26" r="0.8" fill="#D9533B" opacity="0.85" />
      </g>

      {/* ============================================================== */}
      {/* 3. BRONZE BELL (Fūrin Body — Pivots with Cord at y=5px)        */}
      {/* ============================================================== */}
      <g ref={bellGroupRef} style={{ transformOrigin: '0px 5px' }}>
        {/* Bell Assembly translated to bottom of cord (y=28px) */}
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

          {/* Delicate Horizontal Incised Detail Lines on Bell Waist */}
          <path d="M -7.5 7 Q 0 8.5, 7.5 7" stroke="#221B13" strokeWidth="0.6" fill="none" opacity="0.75" />
          <path d="M -8.2 12 Q 0 13.8, 8.2 12" stroke="#221B13" strokeWidth="0.6" fill="none" opacity="0.75" />
          <path d="M -8.2 12.8 Q 0 14.6, 8.2 12.8" stroke="#8A7352" strokeWidth="0.4" fill="none" opacity="0.65" />

          {/* Warm Sunlight Glint Reflection on Left Shoulder */}
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

          {/* ============================================================ */}
          {/* 4. INTERNAL CLAPPER (Zetsu — Pivots from inside Bell at y=2) */}
          {/* ============================================================ */}
          <g ref={clapperRef} id="InternalClapper" style={{ transformOrigin: '0px 2px' }}>
            {/* Inner Silk Thread */}
            <line x1="0" y1="2" x2="0" y2="18" stroke="#3D3023" strokeWidth="0.6" />

            {/* Bronze Clapper Pellet (Hangs at rim level to contact inner wall) */}
            <circle cx="0" cy="18.5" r="2.2" fill="#524332" stroke="#1D1711" strokeWidth="0.5" />
            <circle cx="-0.6" cy="17.8" r="0.7" fill="#8F785C" opacity="0.7" />

            {/* Clapper Bottom Eyelet Ring */}
            <circle cx="0" cy="21.5" r="1.3" stroke="#3D3023" strokeWidth="0.6" fill="none" />

            {/* Connecting Silk Thread to Tanzaku Paper */}
            <line x1="0" y1="21.5" x2="0" y2="28" stroke="#3D3023" strokeWidth="0.6" />

            {/* ========================================================== */}
            {/* 5. TANZAKU WASHI PAPER STRIP (Pivots from Clapper Ring)    */}
            {/* ========================================================== */}
            <g ref={paperGroupRef} id="TanzakuPaper" style={{ transformOrigin: '0px 28px' }}>
              {/* Upper Paper Segment (y=28..52px) */}
              <g id="PaperUpperSegment">
                {/* Washi Paper Base Rectangle */}
                <path
                  d="M -6 28 L 6 28 L 6 52 L -6 52 Z"
                  fill="url(#tanzakuWashiGrad)"
                  stroke="rgba(80, 65, 48, 0.22)"
                  strokeWidth="0.4"
                />

                {/* Reinforced Punched Hanging Hole */}
                <circle cx="0" cy="30.5" r="1.4" fill="none" stroke="#695744" strokeWidth="0.6" />
                <circle cx="0" cy="30.5" r="0.7" fill="#1A1510" />

                {/* Subtle Vertical Washi Crease Line */}
                <line x1="0.5" y1="32" x2="0.5" y2="52" stroke="#D1C2A5" strokeWidth="0.4" opacity="0.6" />

                {/* Hand-Brushed Japanese Calligraphy Kanji: 静 (Silence / Stillness) */}
                <text
                  x="0"
                  y="46"
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

              {/* Lower Paper Segment with Independent Flutter & Curl (y=52..74px) */}
              <g ref={paperLowerRef} id="PaperLowerSegment" style={{ transformOrigin: '0px 52px' }}>
                {/* Lower Washi Paper Extension */}
                <path
                  d="M -6 52 L 6 52 L 6 74 L -6 74 Z"
                  fill="url(#tanzakuWashiGrad)"
                  stroke="rgba(80, 65, 48, 0.22)"
                  strokeWidth="0.4"
                />

                {/* Lower Crease Continuation */}
                <line x1="0.5" y1="52" x2="0.5" y2="72" stroke="#D1C2A5" strokeWidth="0.4" opacity="0.6" />

                {/* Authentic Red Lacquer Hanko Seal Stamp (印 - Sacred Seal) */}
                <rect x="-4.2" y="64" width="4.8" height="4.8" rx="0.5" fill="#A8282B" opacity="0.88" />
                <rect x="-3.8" y="64.4" width="4" height="4" fill="none" stroke="#FAF4EB" strokeWidth="0.4" opacity="0.7" />
                <circle cx="-1.8" cy="66.4" r="1.1" fill="#FAF4EB" opacity="0.85" />

                {/* Delicate Translucent Fibers on Bottom Edge */}
                <path d="M -6 74 L -5 74.5 L -3 74 L 0 74.4 L 3 74 L 6 74.3 L 6 74 Z" fill="#D6C5AA" opacity="0.5" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

