import { createArtworkLoop, damp } from '../utils/motion';
import React, { useRef, useEffect, useState } from 'react';
import { windSystem } from '../utils/windSystem';
import { sound } from '../utils/soundEngine';

/**
 * JapaneseMapleTree (紅葉 - Momiji)
 * -----------------------------------------------------------------------------
 * Authentic traditional sumi-e Japanese Maple Tree directly reconstructed
 * from classical ink-wash landscape masterworks (Reference Image 1).
 *
 * Recreates the exact Niwaki (cloud-pruned) Bonsai architecture:
 *  - Gnarled, twisting ancient trunk with calligraphic dry-brush grooves (fei-bai)
 *  - Mossy stone crags at base with shoreline reeds and small red sapling shrubs
 *  - 4 articulated wind-swaying branch tiers with natural mass inertia
 *  - Horizontally stratified scarlet leaf clouds (Niwaki foliage shelves)
 *  - Overlapping 7-lobed maple leaves in Imperial Crimson, Vermilion, and Autumn Russet
 *  - Real-time 60 FPS wind reactivity (GlobalWindSystem) + interactive gust trigger
 */
export default function JapaneseMapleTree({
  variant = 'hero-left',
  className = '',
  style = {},
  interactive = true,
  opacity = 1,
  scale = 1,
  mirror = false,
}) {
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // References to articulated anatomical branch nodes
  const limbLowerLeftRef = useRef(null);
  const limbMidRightRef = useRef(null);
  const limbUpperLeftRef = useRef(null);
  const limbCrownRef = useRef(null);
  const trunkRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsRevealed(true);
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsRevealed(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(el);

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setIsRevealed(true);
      }

      return () => observer.disconnect();
    }
  }, []);

  // Real-time 60 FPS Wind Sway Physics
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    let animId;

    let force = 0;
    const updatePhysics = ({dt, time, reducedMotion}) => {
      if (reducedMotion) return;
      const wind = windSystem.getState();
      const t = time;
      force = damp(force, Math.min(1.2, wind.windX * 0.5), 2, dt);
      const windEffect = force;

      // Hierarchical limb articulation
      if (limbLowerLeftRef.current) {
        const angle = Math.sin(t * 0.9 + 0.3) * 0.3 + windEffect * 0.3;
        limbLowerLeftRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      if (limbMidRightRef.current) {
        const angle = Math.sin(t * 1.1 + 1.2) * 0.4 + windEffect * 0.4;
        limbMidRightRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      if (limbUpperLeftRef.current) {
        const angle = Math.sin(t * 1.3 + 2.1) * 0.4 + windEffect * 0.5;
        limbUpperLeftRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      if (limbCrownRef.current) {
        const angle = Math.sin(t * 1.5 + 3.0) * 0.45 + windEffect * 0.5;
        limbCrownRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      if (trunkRef.current) {
        const flex = (windEffect * 0.12).toFixed(2);
        trunkRef.current.style.transform = `rotate(${flex}deg)`;
      }


    };

    const stopPhysics = createArtworkLoop(containerRef.current, updatePhysics);
    return stopPhysics;
  }, []);

  const handleClick = () => {
    if (!interactive) return;
    try {
      sound.playTaiko();
    } catch (e) {}
    windSystem.triggerGust(1.8);
  };

  return (
    <div
      ref={containerRef}
      className={`japanese-maple-tree-mount maple-variant-${variant} ${isRevealed ? 'is-revealed' : ''} ${className}`}
      style={{
        opacity,
        transform: `${mirror ? 'scaleX(-1)' : ''} scale(${scale})`,
        ...style,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Japanese Maple (Momiji - 紅葉) · Click to summon wind gust"
      role="img"
      aria-label="Traditional sumi-e Japanese Maple Tree with wind-swaying foliage"
    >
      <svg
        viewBox="0 0 720 840"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="maple-master-svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* Sumi-e Ink Trunk Gradient */}
          <linearGradient id="mapleBarkGrad" x1="0%" y1="100%" x2="70%" y2="0%">
            <stop offset="0%" stopColor="#080706" />
            <stop offset="40%" stopColor="#1B1613" />
            <stop offset="80%" stopColor="#2A201A" />
            <stop offset="100%" stopColor="#0E0C0A" />
          </linearGradient>

          {/* Fei-Bai (Flying White) dry-brush highlights */}
          <linearGradient id="mapleBarkHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4D3B31" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#281C16" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0A0807" stopOpacity="0.9" />
          </linearGradient>

          {/* 7-Lobed Japanese Momiji Leaf Symbol */}
          <g id="momijiLeaf">
            <path
              d="M 0 -22 C 2 -14 5 -8 11 -6 C 14 -8 17 -11 21 -13 C 20 -7 18 -3 21 0 C 26 -2 30 -5 34 -5 C 29 0 25 3 26 7 C 31 9 34 10 36 14 C 30 16 24 16 21 20 C 24 23 27 27 26 31 C 21 29 16 26 13 29 C 11 32 10 36 7 39 C 4 35 3 30 0 28 L 0 42 L -2 42 L -2 28 C -5 30 -6 35 -9 39 C -12 36 -13 32 -15 29 C -18 26 -23 29 -28 31 C -29 27 -26 23 -23 20 C -26 16 -32 16 -38 14 C -36 10 -33 9 -28 7 C -27 3 -31 0 -36 -5 C -32 -5 -28 -2 -23 0 C -20 -3 -22 -7 -23 -13 C -19 -11 -16 -8 -13 -6 C -7 -8 -4 -14 -2 -22 Z"
              fill="currentColor"
            />
          </g>

          {/* Authentic Niwaki Cloud Cluster (Tiered horizontal canopy shelf) */}
          <g id="niwakiCloudShelf">
            {/* Base shadow foliage silhouette with serrated maple scallops */}
            <path
              d="M -70 5
                 C -85 -10, -65 -35, -45 -38
                 C -35 -48, -10 -52, 10 -50
                 C 30 -54, 55 -46, 68 -32
                 C 82 -18, 88 5, 75 20
                 C 62 32, 40 38, 15 35
                 C -15 40, -45 34, -62 20
                 C -72 15, -75 8, -70 5 Z"
              fill="#52070D"
            />
            {/* Mid Crimson layer */}
            <path
              d="M -60 -5
                 C -72 -20, -50 -42, -28 -44
                 C -12 -52, 15 -50, 35 -42
                 C 55 -36, 74 -18, 62 8
                 C 50 25, 22 30, -5 26
                 C -30 30, -55 20, -60 -5 Z"
              fill="#8F0B16"
            />
            {/* Vibrant Vermilion Body */}
            <path
              d="M -48 -12
                 C -58 -28, -35 -45, -15 -42
                 C 5 -46, 25 -42, 45 -28
                 C 58 -12, 52 10, 32 20
                 C 15 24, -15 22, -35 12
                 C -45 5, -50 -5, -48 -12 Z"
              fill="#C71825"
            />
            {/* Radiant Scarlet Crest */}
            <path
              d="M -32 -18
                 C -40 -32, -20 -44, 0 -40
                 C 18 -42, 35 -30, 32 -10
                 C 25 6, 0 14, -20 8
                 C -30 2, -35 -10, -32 -18 Z"
              fill="#E62432"
            />

            {/* Delicate multi-angled Momiji leaves projecting from the shelf edges */}
            <g transform="translate(0, -46) scale(0.38) rotate(0)" color="#FF3A28"><use href="#momijiLeaf" /></g>
            <g transform="translate(-25, -42) scale(0.35) rotate(-25)" color="#E62432"><use href="#momijiLeaf" /></g>
            <g transform="translate(26, -42) scale(0.35) rotate(25)" color="#FF3A28"><use href="#momijiLeaf" /></g>
            <g transform="translate(-50, -28) scale(0.33) rotate(-55)" color="#C71825"><use href="#momijiLeaf" /></g>
            <g transform="translate(52, -26) scale(0.33) rotate(55)" color="#E62432"><use href="#momijiLeaf" /></g>
            <g transform="translate(-68, -8) scale(0.31) rotate(-85)" color="#8F0B16"><use href="#momijiLeaf" /></g>
            <g transform="translate(70, -5) scale(0.31) rotate(85)" color="#FF5238"><use href="#momijiLeaf" /></g>
            <g transform="translate(-45, 18) scale(0.28) rotate(-120)" color="#8F0B16"><use href="#momijiLeaf" /></g>
            <g transform="translate(48, 16) scale(0.28) rotate(120)" color="#C71825"><use href="#momijiLeaf" /></g>
            <g transform="translate(-15, 28) scale(0.26) rotate(-155)" color="#52070D"><use href="#momijiLeaf" /></g>
            <g transform="translate(18, 26) scale(0.26) rotate(155)" color="#8F0B16"><use href="#momijiLeaf" /></g>

            {/* Glowing Golden-Orange interior highlights */}
            <g transform="translate(-10, -32) scale(0.24) rotate(-10)" color="#FFA347"><use href="#momijiLeaf" /></g>
            <g transform="translate(12, -30) scale(0.24) rotate(15)" color="#FF7A38"><use href="#momijiLeaf" /></g>
            <g transform="translate(0, -18) scale(0.22) rotate(5)" color="#FFA347"><use href="#momijiLeaf" /></g>

            {/* Sumi-e twig filaments piercing through the shelf */}
            <path
              d="M 0 35 L 5 10 L -12 -15 M 5 10 L 18 -10"
              stroke="#0D0A08"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>

          {/* Small Shoreline Maple Sapling (Present in Reference Image 1) */}
          <g id="smallSaplingBush">
            <path d="M 0 0 C -8 -20 -15 -35 -10 -50" stroke="#120E0B" strokeWidth="3" strokeLinecap="round" />
            <path d="M -10 -25 C 5 -35 15 -42 18 -55" stroke="#120E0B" strokeWidth="2.2" strokeLinecap="round" />
            <g transform="translate(-10, -50) scale(0.48) rotate(-20)"><use href="#niwakiCloudShelf" /></g>
            <g transform="translate(18, -55) scale(0.42) rotate(25)"><use href="#niwakiCloudShelf" /></g>
          </g>
        </defs>

        {/* ============================================================== */}
        {/* LAYER 1: ROCK CRAGS, WATER REEDS & GNARLED LOWER TRUNK         */}
        {/* ============================================================== */}
        <g ref={trunkRef} className="maple-trunk-anchor" style={{ transformOrigin: '360px 800px' }}>
          {/* Wet Shoreline Rock Outcroppings (Sumi-e Charcoal & Wash) */}
          <path
            d="M 160 820
               C 210 770, 270 780, 310 760
               C 350 740, 420 745, 470 770
               C 520 795, 570 775, 610 825
               L 620 840 L 150 840 Z"
            fill="#12100E"
          />
          <path
            d="M 180 812 C 240 780, 330 775, 400 782 C 460 790, 510 780, 560 815"
            stroke="#2B211C"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Sumi-e Wild Shoreline Reeds & Bamboo Grass */}
          <g stroke="#0E0D0C" strokeWidth="2.6" strokeLinecap="round">
            <path d="M 210 800 Q 190 755 170 735" />
            <path d="M 218 802 Q 205 750 195 725" />
            <path d="M 226 805 Q 220 760 225 738" />
            <path d="M 510 795 Q 530 755 550 735" />
            <path d="M 518 798 Q 545 750 568 740" />
            <path d="M 505 798 Q 498 760 492 745" />
          </g>

          {/* Small Shoreline Red Maple Shrubs (From Reference Image 1) */}
          <g transform="translate(180, 785) scale(0.9)">
            <use href="#smallSaplingBush" />
          </g>
          <g transform="translate(560, 790) scale(0.85) scale(-1, 1)">
            <use href="#smallSaplingBush" />
          </g>

          {/* Sinuous Ancient Claw Roots Strangling the Rocks */}
          <path
            d="M 230 818 C 275 778, 315 725, 340 665 C 362 615, 372 565, 375 510"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="50"
            strokeLinecap="round"
          />
          <path
            d="M 470 810 C 435 770, 405 710, 392 645 C 380 585, 376 530, 375 510"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M 285 825 C 315 785, 335 738, 355 685"
            stroke="#080706"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 525 812 C 480 775, 435 715, 412 655"
            stroke="#080706"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Calligraphic Dry-Brush Bark Grooves (Fei-Bai) */}
          <path
            d="M 330 735 C 348 675 362 605 368 535 M 392 715 C 385 645 380 575 376 515"
            stroke="url(#mapleBarkHighlight)"
            strokeWidth="4.5"
            strokeDasharray="22 10 44 15"
          />

          {/* Ancient S-Curve Trunk: Curves Right, Then Sweeps Left */}
          <path
            d="M 375 510 C 385 450 358 395 328 345 C 300 305 295 255 320 200"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="34"
            strokeLinecap="round"
          />
          <path
            d="M 370 505 C 380 452 352 402 324 352"
            stroke="url(#mapleBarkHighlight)"
            strokeWidth="5"
            strokeDasharray="30 14 50 18"
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 2: LOWER-LEFT BOUGH & HORIZONTAL FOLIAGE SHELF          */}
        {/* ============================================================== */}
        <g
          ref={limbLowerLeftRef}
          className="maple-limb-node maple-limb-lower-left"
          style={{ transformOrigin: '345px 420px' }}
        >
          {/* Main limb curving low left */}
          <path
            d="M 345 420 C 275 440 205 462 135 490 C 95 505 60 528 30 555"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 210 460 C 180 422 148 402 110 395"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 145 488 C 120 522 90 545 58 565"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Dense Horizontal Niwaki Foliage Shelves */}
          <g transform="translate(65, 545) scale(1.3) rotate(-10)">
            <use href="#niwakiCloudShelf" />
          </g>
          <g transform="translate(130, 405) scale(1.2) rotate(15)">
            <use href="#niwakiCloudShelf" />
          </g>
          <g transform="translate(95, 500) scale(1.05) rotate(25)">
            <use href="#niwakiCloudShelf" />
          </g>
        </g>

        {/* ============================================================== */}
        {/* LAYER 3: MID-RIGHT CANOPY SHELF (Sweeping across horizontally) */}
        {/* ============================================================== */}
        <g
          ref={limbMidRightRef}
          className="maple-limb-node maple-limb-mid-right"
          style={{ transformOrigin: '335px 340px' }}
        >
          {/* Sweeping primary bough reaching horizontally right */}
          <path
            d="M 335 340 C 415 325 505 330 580 355 C 630 372 680 400 715 435"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M 470 330 C 510 285 560 265 615 252"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M 565 348 C 610 330 655 330 695 348"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Niwaki Cloud Shelves: Mid-Right Tier */}
          <g transform="translate(595, 360) scale(1.45) rotate(12)">
            <use href="#niwakiCloudShelf" />
          </g>
          <g transform="translate(635, 260) scale(1.3) rotate(-18)">
            <use href="#niwakiCloudShelf" />
          </g>
          <g transform="translate(700, 410) scale(1.15) rotate(30)">
            <use href="#niwakiCloudShelf" />
          </g>
          <g transform="translate(525, 375) scale(1.1) rotate(-6)">
            <use href="#niwakiCloudShelf" />
          </g>
        </g>

        {/* ============================================================== */}
        {/* LAYER 4: UPPER-LEFT ARCHING BOUGH                              */}
        {/* ============================================================== */}
        <g
          ref={limbUpperLeftRef}
          className="maple-limb-node maple-limb-upper-left"
          style={{ transformOrigin: '320px 220px' }}
        >
          {/* Upward-curving limb */}
          <path
            d="M 320 220 C 255 185 190 148 125 120 C 85 102 55 92 20 80"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M 210 155 C 180 112 148 82 102 58"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M 145 125 C 120 155 90 175 58 190"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Niwaki Cloud Shelves: Upper Left */}
          <g transform="translate(120, 120) scale(1.4) rotate(-12)">
            <use href="#niwakiCloudShelf" />
          </g>
          <g transform="translate(95, 60) scale(1.25) rotate(22)">
            <use href="#niwakiCloudShelf" />
          </g>
          <g transform="translate(45, 165) scale(1.1) rotate(-35)">
            <use href="#niwakiCloudShelf" />
          </g>
        </g>

        {/* ============================================================== */}
        {/* LAYER 5: MAJESTIC CANOPY CROWN                                  */}
        {/* ============================================================== */}
        <g
          ref={limbCrownRef}
          className="maple-limb-node maple-limb-crown"
          style={{ transformOrigin: '320px 200px' }}
        >
          {/* Central rising trunk column */}
          <path
            d="M 320 200 C 338 140 342 75 328 15 C 322 -15 310 -40 290 -65"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Crown Right Bough */}
          <path
            d="M 334 135 C 390 108 452 102 510 112 C 545 120 580 135 610 158"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="13"
            strokeLinecap="round"
          />
          {/* Crown Left Fork */}
          <path
            d="M 332 65 C 290 32 250 15 205 5"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Central Apex Twig */}
          <path
            d="M 322 10 C 352 -18 388 -35 428 -45"
            stroke="url(#mapleBarkGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Grand Layered Crown Niwaki Clouds */}
          <g transform="translate(330, 0) scale(1.7) rotate(4)">
            <use href="#niwakiCloudShelf" />
          </g>
          <g transform="translate(420, -45) scale(1.5) rotate(18)">
            <use href="#niwakiCloudShelf" />
          </g>
          <g transform="translate(225, 0) scale(1.45) rotate(-22)">
            <use href="#niwakiCloudShelf" />
          </g>
          <g transform="translate(525, 120) scale(1.4) rotate(14)">
            <use href="#niwakiCloudShelf" />
          </g>
          <g transform="translate(295, -60) scale(1.3) rotate(0)">
            <use href="#niwakiCloudShelf" />
          </g>
          <g transform="translate(445, 65) scale(1.25) rotate(-10)">
            <use href="#niwakiCloudShelf" />
          </g>
        </g>
      </svg>
    </div>
  );
}
