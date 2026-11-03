import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

/**
 * LegacyInkPoster (Where Silence Holds Strength — Living Japanese Zen Scene)
 * -----------------------------------------------------------------------------
 * Fully coded, live animated Japanese archival scene reconstructing the
 * "Where Silence Holds Strength" poster art in authentic vector layers:
 *  - Background warm parchment washi paper panel
 *  - Living crimson sun with 65s celestial brush rotation, 7.5s organic breathing pulse,
 *    and multi-tier soft radiant light diffusion
 *  - 4 depth tiers of sumi-e mountain ridges with subtle micro-parallax
 *  - Multi-tier drifting mountain haze and valley mist layers
 *  - Authentic flying ink birds (Chidori) with animated wing flapping cycles,
 *    drifting flock trajectory, and solitary thermal soaring
 *  - Grounded Shinto Torii gate with authentic architectural proportions and depth shadow
 *  - Pitch-black atmospheric lower ink gradient
 *  - Spaced typography: "THE IMPERIAL ARCHIVE", "01 / A STUDY IN RESTRAINT",
 *    "WHERE SILENCE HOLDS STRENGTH.", and Japanese vertical calligraphy "武士道の精神"
 *  - Zero heavy CPU usage, CSS transform animations, and prefers-reduced-motion safe.
 */
export default function LegacyInkPoster() {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);

  // Decoupled micro-parallax (0 React re-renders on mousemove)
  const mouseTargetX = useRef(0);
  const mouseTargetY = useRef(0);
  const mouseCurrX = useRef(0);
  const mouseCurrY = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const updateParallax = () => {
      // Smooth linear interpolation (lerp)
      mouseCurrX.current += (mouseTargetX.current - mouseCurrX.current) * 0.06;
      mouseCurrY.current += (mouseTargetY.current - mouseCurrY.current) * 0.06;

      if (el) {
        el.style.setProperty('--poster-mouse-x', mouseCurrX.current.toFixed(4));
        el.style.setProperty('--poster-mouse-y', mouseCurrY.current.toFixed(4));
      }

      animFrameRef.current = requestAnimationFrame(updateParallax);
    };

    animFrameRef.current = requestAnimationFrame(updateParallax);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    // Normalized -1 to +1
    mouseTargetX.current = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseTargetY.current = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseTargetX.current = 0;
    mouseTargetY.current = 0;
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [expanded]);

  return (
    <div
      ref={containerRef}
      className={`legacy-cinematic-poster ${expanded ? 'is-immersive' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {expanded && (
        <button
          type="button"
          className="legacy-poster-scrim"
          aria-label="Close immersive artwork view"
          onClick={() => setExpanded(false)}
        />
      )}

      <div className="legacy-poster-inner">
        {/* Top-left small label & immersive toggle */}
        <header className="legacy-poster-overline">
          <span className="overline-brand">THE IMPERIAL ARCHIVE</span>
          <button
            type="button"
            className="legacy-poster-expand interactive"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Exit immersive artwork' : 'Expand artwork'}
            title={expanded ? 'Exit immersive view' : 'Expand full view'}
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </header>

        {/* Master Living Scene SVG Art Canvas */}
        <div
          className="legacy-poster-art"
          aria-label="Living Japanese Zen artwork: rotating crimson sun, Shinto torii, flying ink birds, and layered misty mountains"
          role="img"
        >
          <svg
            viewBox="0 0 720 940"
            preserveAspectRatio="xMidYMid slice"
            className="zen-scene-master-svg"
            aria-hidden="true"
          >
            <defs>
              {/* Antique Washi Paper Sky Gradient */}
              <linearGradient id="zenParchmentSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F4EDE0" />
                <stop offset="42%" stopColor="#EDE3D1" />
                <stop offset="78%" stopColor="#E0D3BE" />
                <stop offset="100%" stopColor="#C8BCAB" />
              </linearGradient>

              {/* Crimson Sun Radial Gradients (Multi-tier glow diffusion) */}
              <radialGradient id="zenSunGlowOuter" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C91B28" stopOpacity="0.22" />
                <stop offset="55%" stopColor="#C91B28" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#C91B28" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="zenSunGlowMid" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D92230" stopOpacity="0.45" />
                <stop offset="65%" stopColor="#B31522" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#8A0C16" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="zenSunCoreGrad" x1="25%" y1="0%" x2="75%" y2="100%">
                <stop offset="0%" stopColor="#E02837" />
                <stop offset="35%" stopColor="#C61826" />
                <stop offset="75%" stopColor="#9E101B" />
                <stop offset="100%" stopColor="#6E0811" />
              </linearGradient>

              {/* Lower Pitch-Black Sumi Ink Wash Gradient */}
              <linearGradient id="zenBaseInkWash" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#141713" stopOpacity="0" />
                <stop offset="38%" stopColor="#121411" stopOpacity="0.65" />
                <stop offset="75%" stopColor="#0D0E0C" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#080907" stopOpacity="1" />
              </linearGradient>

              {/* Soft Torii Grounding Shadow */}
              <filter id="zenToriiShadow" x="-15%" y="-10%" width="130%" height="135%">
                <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#000000" floodOpacity="0.32" />
              </filter>
            </defs>

            {/* LAYER 0: Base Parchment Canvas */}
            <rect width="720" height="940" fill="url(#zenParchmentSky)" />

            {/* Subtle Japanese Washi Paper Texture Grid Lines */}
            <g opacity="0.04" stroke="#000000" strokeWidth="0.5">
              <line x1="0" y1="235" x2="720" y2="235" strokeDasharray="4 6" />
              <line x1="0" y1="470" x2="720" y2="470" strokeDasharray="4 6" />
              <line x1="0" y1="705" x2="720" y2="705" strokeDasharray="4 6" />
              <line x1="240" y1="0" x2="240" y2="940" strokeDasharray="4 6" />
              <line x1="480" y1="0" x2="480" y2="940" strokeDasharray="4 6" />
            </g>

            {/* ========================================================== */}
            {/* LAYER 1: LIVING ROTATING CRIMSON SUN                       */}
            {/* ========================================================== */}
            <g className="zen-sun-parallax-group">
              <g className="zen-sun-breathe-container">
                {/* 1A. Outer Soft Ambient Radial Diffusion Glow */}
                <circle
                  cx="405"
                  cy="355"
                  r="275"
                  fill="url(#zenSunGlowOuter)"
                  className="zen-sun-glow-outer"
                />

                {/* 1B. Mid-Tier Radiant Glow Corona */}
                <circle
                  cx="405"
                  cy="355"
                  r="230"
                  fill="url(#zenSunGlowMid)"
                  className="zen-sun-glow-mid"
                />

                {/* 1C. Painted Crimson Sun Body Disk */}
                <circle
                  cx="405"
                  cy="355"
                  r="198"
                  fill="url(#zenSunCoreGrad)"
                  className="zen-sun-body-disk"
                />

                {/* 1D. Celestial Brush Stroke Rim (Rotates Slowly 65s) */}
                <g className="zen-sun-rotating-rim">
                  <circle
                    cx="405"
                    cy="355"
                    r="203"
                    stroke="#59070D"
                    strokeWidth="3.2"
                    strokeDasharray="95 14 36 12 140 18 60 15"
                    fill="none"
                    opacity="0.65"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="405"
                    cy="355"
                    r="192"
                    stroke="#FF4D5A"
                    strokeWidth="1.2"
                    strokeDasharray="40 18 90 25"
                    fill="none"
                    opacity="0.25"
                  />
                  {/* Faint rotating sun flecks along perimeter */}
                  <circle cx="210" cy="355" r="2.5" fill="#54080D" opacity="0.6" />
                  <circle cx="598" cy="355" r="2" fill="#54080D" opacity="0.5" />
                  <circle cx="405" cy="160" r="3" fill="#54080D" opacity="0.6" />
                  <circle cx="405" cy="550" r="2" fill="#54080D" opacity="0.4" />
                </g>
              </g>
            </g>

            {/* ========================================================== */}
            {/* LAYER 2: DISTANT MOUNTAIN SILHOUETTE (Tier 1)              */}
            {/* ========================================================== */}
            <g className="zen-mountain-distant">
              <path
                d="M 0 520
                   C 80 475, 150 455, 235 470
                   C 320 485, 385 450, 480 478
                   C 565 500, 640 472, 720 458
                   L 720 940 L 0 940 Z"
                fill="#6A685D"
                opacity="0.42"
              />
            </g>

            {/* LAYER 3: DRIFTING MIST RIBBON 1 (Upper Saddle Fog) */}
            <g className="zen-mist-tier-1">
              <path
                d="M -40 515
                   Q 160 485, 360 510
                   T 760 495
                   L 760 555
                   Q 560 540, 360 555
                   T -40 545 Z"
                fill="#EDE5D6"
                opacity="0.48"
                filter="blur(5px)"
              />
            </g>

            {/* ========================================================== */}
            {/* LAYER 4: MID-RANGE MOUNTAIN RIDGES (Tier 2)                */}
            {/* ========================================================== */}
            <g className="zen-mountain-mid">
              <path
                d="M 0 605
                   C 115 558, 215 582, 310 550
                   C 405 520, 520 575, 630 545
                   C 675 532, 700 540, 720 548
                   L 720 940 L 0 940 Z"
                fill="#4C4A40"
                opacity="0.65"
              />
            </g>

            {/* LAYER 5: DRIFTING MIST RIBBON 2 (Valley Smoke Haze) */}
            <g className="zen-mist-tier-2">
              <path
                d="M -30 600
                   Q 180 575, 390 605
                   T 750 580
                   L 750 645
                   Q 530 630, 330 645
                   T -30 635 Z"
                fill="#E5DAC7"
                opacity="0.55"
                filter="blur(7px)"
              />
            </g>

            {/* ========================================================== */}
            {/* LAYER 6: FOREGROUND MOUNTAIN CRAG (Tier 3)                 */}
            {/* ========================================================== */}
            <g className="zen-mountain-foreground">
              <path
                d="M 0 715
                   C 130 670, 245 700, 350 662
                   C 445 628, 555 675, 665 642
                   C 690 635, 705 640, 720 646
                   L 720 940 L 0 940 Z"
                fill="#272924"
                opacity="0.94"
              />
            </g>

            {/* ========================================================== */}
            {/* LAYER 7: GROUNDED SHINTO TORII GATE                        */}
            {/* ========================================================== */}
            <g className="zen-torii-parallax-group" filter="url(#zenToriiShadow)">
              <g id="shintoTorii" transform="translate(138, 442)">
                {/* 7A. Upper Curved Lintel (Kasagi & Shimaki) */}
                {/* Main sweeping upward-flared Kasagi roof beam */}
                <path
                  d="M 28 8
                     Q 175 42, 328 -2
                     L 348 24
                     Q 175 75, 5 32 Z"
                  fill="#171A18"
                />
                {/* Shimaki sub-lintel beam directly underneath */}
                <path
                  d="M 52 50
                     L 292 50
                     L 290 70
                     L 54 70 Z"
                  fill="#121513"
                />

                {/* 7B. Tie-Beam (Nuki) with mortise/tenon pegs (Kusabi) */}
                <path
                  d="M 24 120
                     L 318 120
                     L 318 140
                     L 24 140 Z"
                  fill="#171A18"
                />
                {/* Left/Right protruding wooden pegs */}
                <rect x="20" y="116" width="6" height="28" rx="1.5" fill="#0D0F0E" />
                <rect x="316" y="116" width="6" height="28" rx="1.5" fill="#0D0F0E" />

                {/* 7C. Central Support Plaque Strut (Gakuzuka) */}
                <rect x="162" y="70" width="16" height="50" fill="#151816" />

                {/* 7D. Sturdy Inward-Tapered Pillars (Hashira) */}
                {/* Left Pillar */}
                <path
                  d="M 92 68
                     L 116 68
                     L 122 300
                     L 94 300 Z"
                  fill="#141715"
                />
                {/* Left Pillar Base Collar (Nemaki) */}
                <rect x="91" y="272" width="34" height="28" rx="2" fill="#0A0C0B" />

                {/* Right Pillar */}
                <path
                  d="M 226 68
                     L 250 68
                     L 248 300
                     L 220 300 Z"
                  fill="#141715"
                />
                {/* Right Pillar Base Collar (Nemaki) */}
                <rect x="217" y="272" width="34" height="28" rx="2" fill="#0A0C0B" />

                {/* Delicate Pillar Highlights */}
                <line x1="97" y1="72" x2="99" y2="270" stroke="#2B2F2C" strokeWidth="1.5" opacity="0.6" />
                <line x1="225" y1="72" x2="223" y2="270" stroke="#2B2F2C" strokeWidth="1.5" opacity="0.6" />
              </g>
            </g>

            {/* ========================================================== */}
            {/* LAYER 8: ANIMATED FLYING INK BIRDS (CHIDORI / CRANES)      */}
            {/* ========================================================== */}
            {/* 8A. Drifting Flock: 3 Birds in Formation gliding across sky */}
            <g className="zen-birds-flock-drift">
              {/* Bird 1: Lead Bird (Center Sky) */}
              <g className="zen-bird-item zen-bird-1" transform="translate(145, 230) scale(0.95)">
                <path
                  className="zen-wing zen-wing-left"
                  d="M 0 0 C -8 -11 -20 -15 -32 -9 C -22 -5 -12 -3 0 0 Z"
                  fill="#232722"
                />
                <path
                  className="zen-wing zen-wing-right"
                  d="M 0 0 C 8 -11 20 -15 32 -9 C 22 -5 12 -3 0 0 Z"
                  fill="#232722"
                />
                <ellipse cx="0" cy="2" rx="2.5" ry="5.5" fill="#181B17" />
              </g>

              {/* Bird 2: Trailing Higher Bird */}
              <g className="zen-bird-item zen-bird-2" transform="translate(195, 205) scale(0.78)">
                <path
                  className="zen-wing zen-wing-left"
                  d="M 0 0 C -8 -11 -20 -15 -32 -9 C -22 -5 -12 -3 0 0 Z"
                  fill="#232722"
                />
                <path
                  className="zen-wing zen-wing-right"
                  d="M 0 0 C 8 -11 20 -15 32 -9 C 22 -5 12 -3 0 0 Z"
                  fill="#232722"
                />
                <ellipse cx="0" cy="2" rx="2.5" ry="5.5" fill="#181B17" />
              </g>

              {/* Bird 3: Trailing Lower Bird */}
              <g className="zen-bird-item zen-bird-3" transform="translate(95, 260) scale(0.68)">
                <path
                  className="zen-wing zen-wing-left"
                  d="M 0 0 C -8 -11 -20 -15 -32 -9 C -22 -5 -12 -3 0 0 Z"
                  fill="#232722"
                />
                <path
                  className="zen-wing zen-wing-right"
                  d="M 0 0 C 8 -11 20 -15 32 -9 C 22 -5 12 -3 0 0 Z"
                  fill="#232722"
                />
                <ellipse cx="0" cy="2" rx="2.5" ry="5.5" fill="#181B17" />
              </g>
            </g>

            {/* 8B. Solitary Thermal Glider Pair (Mid-Right Ridge) */}
            <g className="zen-birds-soar-glide">
              {/* Bird 4: Soaring Crane */}
              <g className="zen-bird-item zen-bird-4" transform="translate(565, 235) scale(0.85)">
                <path
                  className="zen-wing zen-wing-left"
                  d="M 0 0 C -9 -12 -23 -16 -36 -10 C -25 -6 -13 -4 0 0 Z"
                  fill="#212520"
                />
                <path
                  className="zen-wing zen-wing-right"
                  d="M 0 0 C 9 -12 23 -16 36 -10 C 25 -6 13 -4 0 0 Z"
                  fill="#212520"
                />
                <ellipse cx="0" cy="2" rx="2.8" ry="6" fill="#141713" />
              </g>

              {/* Bird 5: Distant Companion */}
              <g className="zen-bird-item zen-bird-5" transform="translate(615, 258) scale(0.62)">
                <path
                  className="zen-wing zen-wing-left"
                  d="M 0 0 C -8 -11 -20 -15 -32 -9 C -22 -5 -12 -3 0 0 Z"
                  fill="#282C27"
                  opacity="0.85"
                />
                <path
                  className="zen-wing zen-wing-right"
                  d="M 0 0 C 8 -11 20 -15 32 -9 C 22 -5 12 -3 0 0 Z"
                  fill="#282C27"
                  opacity="0.85"
                />
                <ellipse cx="0" cy="2" rx="2.2" ry="4.8" fill="#1C1F1B" />
              </g>
            </g>

            {/* ========================================================== */}
            {/* LAYER 9: LOW VALLEY FOG (Streaming Around Torii Base)      */}
            {/* ========================================================== */}
            <g className="zen-mist-tier-3">
              <path
                d="M 20 765
                   Q 185 735, 360 760
                   T 710 740
                   L 710 815
                   Q 510 790, 310 815
                   T 20 805 Z"
                fill="#F2E8D8"
                opacity="0.45"
                filter="blur(8px)"
              />
              <path
                d="M 0 810
                   Q 210 780, 420 815
                   T 740 790
                   L 740 860
                   Q 480 840, 240 855
                   T 0 845 Z"
                fill="#E8DEC9"
                opacity="0.35"
                filter="blur(10px)"
              />
            </g>

            {/* ========================================================== */}
            {/* LAYER 10: DRAMATIC PITCH-BLACK SUMI INK WASH BASE          */}
            {/* ========================================================== */}
            <rect
              y="620"
              width="720"
              height="320"
              fill="url(#zenBaseInkWash)"
              pointerEvents="none"
            />
          </svg>

          {/* Vertical Japanese Calligraphy on Right (武士道の精神 - Spirit of Bushido) */}
          <div className="legacy-poster-vertical" aria-hidden="true" lang="ja">
            <span className="zen-vertical-kanji">武士道の精神</span>
            <span className="zen-vertical-seal" title="印 (Seal)">印</span>
          </div>
        </div>

        {/* Bottom Editorial Caption (01 / A STUDY IN RESTRAINT · WHERE SILENCE HOLDS STRENGTH.) */}
        <footer className="legacy-poster-caption">
          <span className="caption-eyebrow">01 / A STUDY IN RESTRAINT</span>
          <strong className="caption-headline">WHERE SILENCE HOLDS STRENGTH.</strong>
          <span className="legacy-poster-caption-jp" lang="ja">
            静けさの中に力あり · The stillness before the strike
          </span>
        </footer>
      </div>
    </div>
  );
}
