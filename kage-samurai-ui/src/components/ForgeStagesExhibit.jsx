import React, { useState, useEffect, useRef } from 'react';
import { Flame, Hammer, Sparkles, Wind, Layers, RefreshCw, ChevronRight, Droplets, Shield, Award } from 'lucide-react';
import { sound } from '../utils/soundEngine';

export default function ForgeStagesExhibit() {
  const [activeStage, setActiveStage] = useState(1); // Default to Stage 2 (Shita-gitae) for maximum visual action
  const [isStriking, setIsStriking] = useState(false);
  const [sparkKey, setSparkKey] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const stages = [
    {
      num: '01',
      id: 'tamahagane',
      kanji: '玉鋼',
      name: 'Tamahagane',
      title: 'THE JEWEL STEEL & TATARA SMELT',
      subtitle: 'Smelted from black iron sand over three days and nights',
      temp: '1,300°C · TATARA HEARTH',
      carbon: '0.6% – 1.5% Carbon Content',
      desc: 'Inside the clay Tatara furnace, master Murage craftsmen consume 10 tons of pine charcoal and 8 tons of iron sand (satetsu) over 72 sleepless hours. The furnace yields a glowing 2-ton bloom (kera), broken by sledgehammer to select the highest-purity high-carbon "jewel steel".',
      technique: 'Direct smelting reduction in low-temperature clay hearth',
      stateBadge: 'RAW MATERIAL TRANSFORMATION',
    },
    {
      num: '02',
      id: 'shitagitae',
      kanji: '下鍛',
      name: 'Shita-gitae',
      title: 'THE 15 FOLDS & 32,768 STRATA',
      subtitle: 'Folding steel upon itself to purge slag and distribute carbon',
      temp: '1,250°C · FORGE ANVIL',
      carbon: '32,768 Micro-Layers Formed',
      desc: 'The swordsmith stacks steel fragments on a spatula, welds them at white-hot heat, then repeatedly chisels, notches, and folds the block 15 consecutive times. This creates 32,768 microscopic alternating laminations (hada), expelling slag inclusions and ensuring absolute metallurgical cohesion.',
      technique: 'Continuous hammer forging and bifold lamination',
      stateBadge: 'PURIFICATION & STRATIFICATION',
    },
    {
      num: '03',
      id: 'kobuse',
      kanji: '甲伏',
      name: 'Kobuse',
      title: 'COMPOSITE CORE CONSTRUCTION',
      desc: 'A katana must never bend, never break, and slice through steel. To achieve this paradox, the swordsmith wraps a ductile, shock-absorbing low-carbon core (Shingane, 0.2% C) inside a razor-hard high-carbon outer jacket (Kawagane, 0.75% C), producing a blade of supreme resilience.',
      subtitle: 'Soft flexible heart wrapped inside an unbreakable high-carbon jacket',
      temp: '1,100°C · STRUCTURAL WELD',
      carbon: 'Dual-Hardness Martensite/Ferrite',
      technique: 'U-shaped jacket wrapping soft iron core',
      stateBadge: 'SACRED ARCHITECTURAL ASSEMBLY',
    },
    {
      num: '04',
      id: 'yakiire',
      kanji: '焼入',
      name: 'Yaki-ire',
      title: 'CLAY QUENCHING & THE HAMON BIRTH',
      subtitle: 'Plunging white-hot steel into water to lock the spirit',
      temp: '800°C → 20°C IN 2.5 SECONDS',
      carbon: 'Martensite Phase Lock · 62 HRC',
      desc: 'The smith paints the blade with a secret slurry of clay, charcoal powder, and ground sandstone—thick on the spine (mune), razor-thin on the cutting edge (ha). Heated in pitch darkness to the color of the morning moon (800°C), it is plunged into cold water. The edge freezes instantaneously into glass-hard martensite crystals, birthing the wavy Hamon.',
      technique: 'Differential thermal quenching with insulating yakibatsuchi slurry',
      stateBadge: 'THERMAL TRANSFIGURATION',
    },
    {
      num: '05',
      id: 'togi',
      kanji: '研磨',
      name: 'Togi',
      title: 'THE 14-STAGE POLISH & MIRROR FINISH',
      subtitle: 'Revealing the steel grain and crystalline hamon soul',
      temp: 'AMBIENT · 120 HOURS HANDWORK',
      carbon: 'Full Optical & Structural Revelation',
      desc: 'The Togishi (sword polisher) uses fourteen progressively microscopic Japanese waterstones—from coarse Omura stone down to paper-thin Uchigumori finger stones (hazuya and jizuya). Over two weeks, the steel grain (hada) and the shimmering crystalline Nie and Nioi blossoms of the hamon are unveiled in breathtaking mirror clarity.',
      technique: '14 stone progressions from Foundation (Shitaji-togi) to Finish (Shiage-togi)',
      stateBadge: 'AESTHETIC & SACRED REVELATION',
    },
  ];

  const current = stages[activeStage];

  // Rhythmic swordsmith hammer strike loop
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      // Trigger strike
      setIsStriking(true);
      setSparkKey((prev) => prev + 1);

      // Play authentic sound based on active stage
      if (activeStage === 3) {
        sound.playQuenchSteam();
      } else {
        sound.playHammerStrike();
      }

      // Return hammer
      const timeout = setTimeout(() => {
        setIsStriking(false);
      }, 350);

      return () => clearTimeout(timeout);
    }, 2400);

    return () => clearInterval(interval);
  }, [autoPlay, activeStage]);

  const selectStage = (idx) => {
    sound.playWoodenClick();
    setActiveStage(idx);
    setIsStriking(true);
    setSparkKey((prev) => prev + 1);

    if (idx === 3) {
      sound.playQuenchSteam();
    } else {
      sound.playHammerStrike();
    }

    setTimeout(() => {
      setIsStriking(false);
    }, 400);
  };

  return (
    <div className="forge-master-experience-wrapper">
      {/* ============================================================== */}
      {/* VINTAGE JAPANESE FRAMED POSTER (EXACT LAYOUT REFERENCE)        */}
      {/* ============================================================== */}
      <div className="forge-poster-outer-frame">
        {/* Top Poster Status Bar */}
        <div className="poster-top-header">
          <div className="poster-brand-insignia">
            <span className="poster-red-stamp">鍛</span>
            <div className="poster-brand-meta">
              <span className="brand-name">SAMURAI · 刀鍛冶</span>
              <span className="brand-sub">ANCIENT TATARA WORKSHOP · EDO ERA</span>
            </div>
          </div>

          <div className="poster-nav-tabs">
            <span className="nav-item active">FORGE</span>
            <span className="nav-item">METALLURGY</span>
            <span className="nav-item">MASTERS</span>
            <button
              className="poster-order-btn interactive"
              onClick={() => {
                sound.playHammerStrike();
                setIsStriking(true);
                setSparkKey((prev) => prev + 1);
                setTimeout(() => setIsStriking(false), 400);
              }}
            >
              <span>STRIKE STEEL</span>
            </button>
          </div>
        </div>

        {/* 5-STAGE CHAPTER SELECTOR RAIL */}
        <div className="forge-stages-nav-rail">
          {stages.map((stg, idx) => (
            <button
              key={stg.id}
              className={`stage-rail-btn ${activeStage === idx ? 'is-active' : ''} interactive`}
              onClick={() => selectStage(idx)}
            >
              <div className="rail-btn-top">
                <span className="rail-step-num">{stg.num}</span>
                <span className="rail-step-kanji">{stg.kanji}</span>
              </div>
              <span className="rail-step-name">{stg.name}</span>
              <div className="rail-brush-indicator" />
            </button>
          ))}
        </div>

        {/* MAIN POSTER EDITORIAL BODY (Side-by-side or Stacked) */}
        <div className="poster-body-grid">
          {/* LEFT COLUMN: OVERSIZED JAPANESE & ENGLISH TYPOGRAPHY */}
          <div className="poster-typography-col">
            {/* Authentic Japanese Heading (matching reference screenshot layout) */}
            <div className="poster-jp-headline-group">
              <span className="jp-headline-large">魂を打つ</span>
              <span className="jp-headline-sub">自分自身の戦いを戦う少年</span>
            </div>

            {/* Massive Bold English Condensed Title */}
            <h3 className="poster-main-title">
              FIVE STAGES <br />
              OF THE <span className="text-crimson">FORGE.</span>
            </h3>

            {/* Introductory Craftsmanship Paragraph */}
            <p className="poster-intro-paragraph">
              From iron sand smelted in the Tatara furnace to the fourteenth waterstone of the master
              polisher, a true samurai blade is not simply forged—it is born through flame, water,
              and thirty-two thousand microscopic strata of folded steel.
            </p>

            {/* Action Buttons styled like the reference screenshot */}
            <div className="poster-actions-row">
              <button
                className="btn-poster-primary interactive"
                onClick={() => selectStage((activeStage + 1) % stages.length)}
              >
                <span>NEXT STAGE →</span>
              </button>
              <button
                className="btn-poster-secondary interactive"
                onClick={() => {
                  sound.playWoodenClick();
                  setAutoPlay(!autoPlay);
                }}
              >
                <span>{autoPlay ? 'PAUSE FORGE' : 'RESUME FORGE'}</span>
              </button>
            </div>

            {/* Active Stage Technical Data Plaque */}
            <div className="active-stage-meta-card">
              <div className="meta-card-badge">
                <Flame size={13} />
                <span>{current.temp}</span>
              </div>
              <div className="meta-card-title">{current.title}</div>
              <div className="meta-card-subtitle">{current.subtitle}</div>
              <p className="meta-card-desc">{current.desc}</p>

              <div className="meta-card-footer">
                <span className="meta-stat-label">TECHNIQUE:</span>
                <span className="meta-stat-val">{current.technique}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVING CINEMATIC FORGE ARTWORK */}
          <div className="poster-artwork-col">
            {/* Giant Hollow Japanese Watermark Kanji (matching "年" in reference) */}
            <div className="poster-hollow-kanji-watermark" aria-hidden="true">
              鍛
            </div>

            {/* High-Resolution Vector Illustrated Forge Scene */}
            <div className="forge-living-canvas">
              <svg
                viewBox="0 0 720 540"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="forge-master-svg"
              >
                <defs>
                  {/* Faded Crimson Japanese Sun Gradient (soft atmospheric glow) */}
                  <radialGradient id="forgeSunGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#DF1B29" stopOpacity="0.95" />
                    <stop offset="70%" stopColor="#D90416" stopOpacity="0.88" />
                    <stop offset="90%" stopColor="#C41423" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#A80F1C" stopOpacity="0" />
                  </radialGradient>

                  {/* Heated Glowing Steel (Bright yellow/orange to molten crimson) */}
                  <linearGradient id="moltenSteel" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFE082" />
                    <stop offset="35%" stopColor="#FF9100" />
                    <stop offset="70%" stopColor="#FF3D00" />
                    <stop offset="100%" stopColor="#D50000" />
                  </linearGradient>

                  {/* Hot Anvil Steel Strike Glow Burst */}
                  <radialGradient id="sparkStrikeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                    <stop offset="40%" stopColor="#FFD54F" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="#FF6D00" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FF3D00" stopOpacity="0" />
                  </radialGradient>

                  {/* Charcoal Hearth Shadow */}
                  <linearGradient id="hearthGlow" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FF6D00" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#D90416" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>

                  {/* Soft Blur for Smoke & Glow */}
                  <filter id="forgeSmokeBlur" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" />
                  </filter>
                </defs>

                {/* ---------------------------------------------------------- */}
                {/* 1. FADED CRIMSON JAPANESE SUN (EXACT POSITION AS REFERENCE)*/}
                {/* ---------------------------------------------------------- */}
                <g className="forge-sun-group">
                  <circle
                    cx="420"
                    cy="250"
                    r="165"
                    fill="url(#forgeSunGradient)"
                    className="forge-sun-disc"
                  />
                  {/* Subtle Ukiyo-e Sun Weathering Ring */}
                  <circle
                    cx="420"
                    cy="250"
                    r="165"
                    stroke="#B81422"
                    strokeWidth="3"
                    strokeDasharray="16 8 32 12"
                    opacity="0.4"
                  />
                </g>

                {/* ---------------------------------------------------------- */}
                {/* 2. FORGE HEARTH ILLUMINATION & DRIFTING SMOKE              */}
                {/* ---------------------------------------------------------- */}
                {/* Warm Hearth Illumination on Background */}
                <ellipse cx="430" cy="410" rx="200" ry="60" fill="url(#hearthGlow)" />

                {/* Ethereal Sumi-e Smoke Wisps Curling Upward */}
                <g className="forge-smoke-layer" opacity="0.14" filter="url(#forgeSmokeBlur)">
                  <path
                    d="M 390 340 C 360 260, 420 200, 390 140 C 370 100, 410 60, 430 30"
                    stroke="#1C1D22"
                    strokeWidth="28"
                    strokeLinecap="round"
                    fill="none"
                    className="smoke-drift smoke-1"
                  />
                  <path
                    d="M 440 330 C 470 240, 410 180, 450 120 C 470 80, 430 50, 460 20"
                    stroke="#24262E"
                    strokeWidth="22"
                    strokeLinecap="round"
                    fill="none"
                    className="smoke-drift smoke-2"
                  />
                </g>

                {/* ---------------------------------------------------------- */}
                {/* 3. WORKSHOP FOREGROUND SILHOUETTE (EARTH & ANVIL BASE)     */}
                {/* ---------------------------------------------------------- */}
                {/* Layered Grass / Earth Mound (Matching Reference Screenshot Foreground) */}
                <path
                  d="M 0 460
                     C 120 440, 240 450, 360 445
                     C 480 440, 600 450, 720 460
                     L 720 540 L 0 540 Z"
                  fill="#0A0A0C"
                />

                {/* Tall Grass Blades Silhouette (Direct Reference Feature) */}
                <g fill="#0A0A0C" opacity="0.95">
                  <polygon points="40,460 48,410 52,460" />
                  <polygon points="75,465 85,395 90,465" />
                  <polygon points="110,460 118,415 125,460" />
                  <polygon points="160,455 172,390 178,455" />
                  <polygon points="210,455 220,405 228,455" />
                  <polygon points="560,455 570,400 578,455" />
                  <polygon points="610,460 622,390 630,460" />
                  <polygon points="660,465 672,405 680,465" />
                </g>

                {/* Heavy Oak Anvil Block (Dai) */}
                <path
                  d="M 370 420 L 475 420 L 485 470 L 360 470 Z"
                  fill="#141518"
                  stroke="#0A0A0C"
                  strokeWidth="2"
                />
                {/* Iron Strapping Band on Wooden Block */}
                <rect x="365" y="440" width="115" height="10" fill="#0A0A0C" />

                {/* Blackened Wrought-Iron Anvil (Kanatoko) */}
                <g className="forge-anvil">
                  {/* Anvil Base Foot */}
                  <path d="M 380 420 L 465 420 L 460 410 L 385 410 Z" fill="#1C1D22" />
                  {/* Anvil Waist Column */}
                  <rect x="400" y="385" width="45" height="25" fill="#18191E" />
                  {/* Anvil Face & Horns */}
                  <path
                    d="M 370 385 L 475 385 L 485 375 L 485 365 L 365 365 L 350 375 Z"
                    fill="#24262E"
                    stroke="#0A0A0C"
                    strokeWidth="1.5"
                  />
                  {/* Anvil Horn (Bick) */}
                  <path d="M 350 375 L 330 370 L 350 365 Z" fill="#24262E" />
                  {/* Polished Anvil Top Face catching forge light */}
                  <line x1="355" y1="365" x2="480" y2="365" stroke="#FFE082" strokeWidth="1.2" opacity="0.6" />
                </g>

                {/* ---------------------------------------------------------- */}
                {/* 4. WORKPIECE: VARYING METALLURGY BASED ON ACTIVE STAGE     */}
                {/* ---------------------------------------------------------- */}
                <g className="forge-workpiece">
                  {/* Stage 1: Raw Jewel Steel Bloom (Tamahagane) */}
                  {activeStage === 0 && (
                    <g className="workpiece-tamahagane">
                      <polygon points="390,364 415,350 445,352 460,364 430,365" fill="url(#moltenSteel)" />
                      <polygon points="415,350 435,340 455,352 445,352" fill="#FFE57F" />
                    </g>
                  )}

                  {/* Stage 2: Bifold Layered Billet being Hammered (Shita-gitae) */}
                  {activeStage === 1 && (
                    <g className="workpiece-layered-billet">
                      <rect x="380" y="358" width="80" height="7" rx="1.5" fill="url(#moltenSteel)" />
                      {/* Micro-folds highlight */}
                      <line x1="382" y1="360" x2="458" y2="360" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
                      <line x1="382" y1="362" x2="458" y2="362" stroke="#FFD54F" strokeWidth="1" opacity="0.9" />
                    </g>
                  )}

                  {/* Stage 3: Elongated Sunobe / Pre-formed Blade (Kobuse) */}
                  {activeStage === 2 && (
                    <g className="workpiece-sunobe">
                      <path
                        d="M 345 363 C 380 361, 420 360, 470 362 L 470 366 C 420 364, 380 365, 345 365 Z"
                        fill="url(#moltenSteel)"
                      />
                      <line x1="345" y1="364" x2="470" y2="363" stroke="#FFF7C2" strokeWidth="1.2" />
                    </g>
                  )}

                  {/* Stage 4: Clay-Coated Blade in Quenching Trough (Yaki-ire) */}
                  {activeStage === 3 && (
                    <g className="workpiece-yakiire">
                      {/* Wooden Quench Trough (Mizubune) */}
                      <rect x="340" y="380" width="160" height="40" rx="3" fill="#2E2318" stroke="#18130D" strokeWidth="2" />
                      <rect x="345" y="385" width="150" height="15" fill="#4A6572" opacity="0.85" />

                      {/* Quenched Blade entering Water with Steam */}
                      <path
                        d="M 330 375 L 480 372 L 480 378 L 330 380 Z"
                        fill="url(#moltenSteel)"
                      />
                      {/* Billows of White Steam Rising */}
                      <g className="quench-steam-plumes" fill="#FFFFFF" opacity="0.75" filter="url(#forgeSmokeBlur)">
                        <ellipse cx="380" cy="360" rx="35" ry="40" className="steam-cloud steam-1" />
                        <ellipse cx="430" cy="340" rx="45" ry="50" className="steam-cloud steam-2" />
                        <ellipse cx="470" cy="320" rx="40" ry="45" className="steam-cloud steam-3" />
                      </g>
                    </g>
                  )}

                  {/* Stage 5: Finished Master Katana Gleaming (Togi) */}
                  {activeStage === 4 && (
                    <g className="workpiece-togi">
                      {/* Polished Curved Katana Blade on Anvil */}
                      <path
                        d="M 320 362 C 370 359, 430 358, 485 361 L 485 366 C 430 363, 370 364, 320 365 Z"
                        fill="#FFFFFF"
                        stroke="#1C1D22"
                        strokeWidth="1.2"
                      />
                      {/* Crystalline Wavy Hamon Line */}
                      <path
                        d="M 325 364 Q 350 361, 375 364 Q 400 361, 425 363 Q 450 360, 480 363"
                        stroke="#D90416"
                        strokeWidth="1.8"
                        fill="none"
                      />
                      {/* Specular Light Gleam */}
                      <circle cx="410" cy="362" r="6" fill="#FFFFFF" opacity="0.9" filter="url(#forgeSmokeBlur)" />
                    </g>
                  )}
                </g>

                {/* ---------------------------------------------------------- */}
                {/* 5. SPARKS BURST FROM HAMMER IMPACT (DYNAMIC ACTIVATION)    */}
                {/* ---------------------------------------------------------- */}
                {isStriking && activeStage !== 4 && (
                  <g key={sparkKey} className="hammer-strike-burst">
                    {/* Anvil Strike Flash */}
                    <circle cx="415" cy="362" r="28" fill="url(#sparkStrikeGlow)" />

                    {/* Flying Incandescent Sparks */}
                    {[
                      { x1: 415, y1: 362, x2: 365, y2: 310, r: 2.2 },
                      { x1: 415, y1: 362, x2: 380, y2: 280, r: 2.8 },
                      { x1: 415, y1: 362, x2: 410, y2: 260, r: 2.0 },
                      { x1: 415, y1: 362, x2: 435, y2: 275, r: 3.2 },
                      { x1: 415, y1: 362, x2: 460, y2: 295, r: 2.5 },
                      { x1: 415, y1: 362, x2: 485, y2: 325, r: 1.8 },
                      { x1: 415, y1: 362, x2: 345, y2: 345, r: 2.4 },
                      { x1: 415, y1: 362, x2: 495, y2: 355, r: 2.0 },
                    ].map((spk, sIdx) => (
                      <g key={sIdx} className="spark-particle-trail">
                        <line
                          x1={spk.x1}
                          y1={spk.y1}
                          x2={spk.x2}
                          y2={spk.y2}
                          stroke="#FFF9C4"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <circle cx={spk.x2} cy={spk.y2} r={spk.r} fill="#FF9100" />
                      </g>
                    ))}
                  </g>
                )}

                {/* ---------------------------------------------------------- */}
                {/* 6. THE TRADITIONAL JAPANESE SWORDSMITH SILHOUETTE          */}
                {/* ---------------------------------------------------------- */}
                <g className="swordsmith-master-figure">
                  {/* Left Arm & Tongs Holding Billet on Anvil */}
                  <g className="swordsmith-tongs-arm">
                    {/* Iron Tongs (Yatoko) gripping steel */}
                    <line x1="495" y1="363" x2="435" y2="363" stroke="#0A0B0E" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="475" cy="363" r="3" fill="#A68B56" />

                    {/* Left Hand & Arm holding tongs handle */}
                    <path
                      d="M 490 361 L 525 355 L 528 370 L 493 372 Z"
                      fill="#0A0A0C"
                    />
                    <path
                      d="M 525 355 C 555 350, 565 375, 570 400 L 550 405 C 545 385, 538 370, 528 370 Z"
                      fill="#0A0A0C"
                    />
                  </g>

                  {/* Swordsmith Kneeling/Standing Body & Kimono */}
                  <g className="swordsmith-body">
                    {/* Head with White Hachimaki (Headband) Knot */}
                    <ellipse cx="530" cy="275" rx="18" ry="22" fill="#0A0A0C" />
                    {/* White Hachimaki Band */}
                    <path
                      d="M 514 270 Q 530 266, 546 270 L 546 275 Q 530 271, 514 275 Z"
                      fill="#FFF9E6"
                    />
                    {/* Hachimaki Trailing Tie Ribbon */}
                    <path
                      d="M 545 272 Q 565 275, 575 285 Q 565 288, 545 278 Z"
                      fill="#FFF9E6"
                    />

                    {/* Powerful Neck and Torso (Traditional Folded Robe) */}
                    <path
                      d="M 515 295
                         C 495 330, 490 390, 500 450
                         L 575 450
                         C 585 390, 580 330, 550 295 Z"
                      fill="#0A0A0C"
                    />

                    {/* Obi Sash tied at Waist in Crimson */}
                    <rect x="502" y="380" width="70" height="9" rx="1.5" fill="#D90416" />

                    {/* Wide Folded Hakama Robes resting on floor */}
                    <path
                      d="M 495 440
                         C 485 455, 475 465, 460 470
                         L 580 470
                         C 575 460, 570 450, 565 440 Z"
                      fill="#0A0A0C"
                    />
                  </g>

                  {/* Independently Animated Right Arm & Forging Hammer (Kozuchi) */}
                  <g
                    className={`swordsmith-hammer-arm ${isStriking ? 'strike-down' : 'ready-up'}`}
                    style={{
                      transformOrigin: '535px 305px',
                      transition: isStriking ? 'transform 0.12s ease-in' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                  >
                    {/* Shoulder & Bicep */}
                    <path
                      d="M 535 305
                         C 525 320, 505 325, 485 325
                         L 485 310
                         C 505 310, 520 305, 535 305 Z"
                      fill="#0A0A0C"
                    />

                    {/* Forearm extending down to hammer shaft */}
                    <path
                      d="M 485 325 L 450 335 L 448 322 L 485 310 Z"
                      fill="#0A0A0C"
                    />

                    {/* Gauntlet Hand gripping hammer */}
                    <ellipse cx="445" cy="328" rx="7" ry="6" fill="#141518" stroke="#0A0A0C" strokeWidth="1" />

                    {/* Wooden Hammer Shaft */}
                    <line x1="480" y1="305" x2="415" y2="355" stroke="#A68B56" strokeWidth="4.5" strokeLinecap="round" />

                    {/* Heavy Steel Hammer Head (Kozuchi) */}
                    <path
                      d="M 410 348 L 426 359 L 418 370 L 402 359 Z"
                      fill="#2A2C35"
                      stroke="#0A0A0C"
                      strokeWidth="1.5"
                    />
                    {/* Hammer Face striking edge highlight */}
                    <line x1="402" y1="359" x2="418" y2="370" stroke="#FFE082" strokeWidth="1.5" />
                  </g>
                </g>

                {/* ---------------------------------------------------------- */}
                {/* 7. FLOATING GOLDEN FORGE EMBERS DRIFTING UPWARD             */}
                {/* ---------------------------------------------------------- */}
                <g className="floating-forge-embers">
                  {[
                    { cx: 390, cy: 370, r: 1.8, dur: '3.5s', delay: '0s' },
                    { cx: 430, cy: 360, r: 2.2, dur: '4.2s', delay: '0.8s' },
                    { cx: 410, cy: 320, r: 1.5, dur: '3.8s', delay: '1.4s' },
                    { cx: 450, cy: 300, r: 2.5, dur: '4.5s', delay: '0.3s' },
                    { cx: 370, cy: 270, r: 1.7, dur: '5.0s', delay: '2.0s' },
                    { cx: 440, cy: 230, r: 2.0, dur: '4.0s', delay: '1.2s' },
                  ].map((emb, eIdx) => (
                    <circle
                      key={eIdx}
                      cx={emb.cx}
                      cy={emb.cy}
                      r={emb.r}
                      fill="#FF9100"
                      className="rising-forge-ember"
                      style={{
                        animationDuration: emb.dur,
                        animationDelay: emb.delay,
                      }}
                    />
                  ))}
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* BOTTOM POSTER FOOTER BAR (MATCHING REFERENCE SCREENSHOT) */}
        <div className="poster-bottom-bar">
          {/* Left Carousel / Stage Indicator Dots */}
          <div className="poster-carousel-dots">
            {stages.map((_, dotIdx) => (
              <button
                key={dotIdx}
                className={`carousel-dot ${activeStage === dotIdx ? 'is-active' : ''} interactive`}
                onClick={() => selectStage(dotIdx)}
                aria-label={`Go to stage ${dotIdx + 1}`}
              />
            ))}
            <span className="dots-counter">STAGE 0{activeStage + 1} / 05</span>
          </div>

          {/* Right Authentic Japanese Caption Motto */}
          <div className="poster-motto-caption">
            <span>千年受け継がれる刀鍛冶の魂 · 鉄と炎と精神の結晶</span>
          </div>
        </div>
      </div>
    </div>
  );
}
