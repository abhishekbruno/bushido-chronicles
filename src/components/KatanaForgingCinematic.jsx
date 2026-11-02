import React, { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Flame,
  Hammer,
  Droplets,
  Sparkles,
  Compass,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Clock,
  Layers,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { sound } from '../utils/soundEngine';

gsap.registerPlugin(ScrollTrigger);

export default function KatanaForgingCinematic() {
  const outerWrapperRef = useRef(null);
  const pinnedStageRef = useRef(null);
  const stageInteractiveRef = useRef(null);

  // Scroll Progress (0.00 to 1.00)
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isAnatomyMode, setIsAnatomyMode] = useState(false);

  // Anatomy Inspection States
  const [activePart, setActivePart] = useState('hamon');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shimmerPos, setShimmerPos] = useState(50);

  // Sparks & Strike Effect State
  const [strikeSparks, setStrikeSparks] = useState([]);
  const lastAudioTriggerRef = useRef(-1);
  const sparkTimerRef = useRef(null);

  // 7 Cinematic Chapters Definitions
  const chapters = useMemo(() => [
    {
      num: '01',
      key: 'fall',
      kanji: '落下',
      title: 'THE FALLING KATANA',
      subtitle: 'A finished blade plummets from the heavens, striking the earth to begin its ancestral memory.',
      meta: 'MOMENTUM & DESCENT · VERTICAL ROTATION · GROUND STONE IMPACT',
      stateBadge: 'ANCESTRAL AWAKENING',
      temp: 'AMBIENT (ORIGIN)',
      scrollRange: [0.00, 0.14],
    },
    {
      num: '02',
      key: 'steel',
      kanji: '玉鋼',
      title: 'ORIGIN OF STEEL — TATARA',
      subtitle: 'From black iron sand and pine charcoal, the jewel steel is born in ancient clay furnaces.',
      meta: 'TATARA CLAY HEARTH · 1,300°C · HIGH-PURITY BLOOM STEEL',
      stateBadge: 'MATERIAL CREATION',
      temp: '1,300°C',
      scrollRange: [0.14, 0.28],
    },
    {
      num: '03',
      key: 'heat',
      kanji: '火入',
      title: 'THE FORGE — HEATING THE STEEL',
      subtitle: 'The swordsmith guides raw bloom steel into charcoal coals, awakening its plastic soul.',
      meta: 'PINE CHARCOAL HEARTH · 1,300°C · THERMAL EXPANSION',
      stateBadge: 'FORGE HEATING',
      temp: '1,300°C',
      scrollRange: [0.28, 0.42],
    },
    {
      num: '04',
      key: 'hammer',
      kanji: '下鍛',
      title: 'FORGED THROUGH FIRE — 15 FOLDS',
      subtitle: 'Heavy sledgehammer blows rhythmically flatten and fold the billet into 32,768 microscopic strata.',
      meta: '15 FOLDS · 32,768 MICRO-STRATA · IMPURITIES EXPELLED',
      stateBadge: 'LAMINATION & PURIFICATION',
      temp: '1,250°C',
      scrollRange: [0.42, 0.62],
    },
    {
      num: '05',
      key: 'quench',
      kanji: '焼入',
      title: 'THE TRIAL OF FIRE & WATER',
      subtitle: 'Insulating clay slurry protects the spine as the 800°C blade plunges into water, freezing martensite.',
      meta: 'MIZU-BUNE TROUGH · 800°C → 20°C IN 2.5s · MARTENSITE CRYSTALS',
      stateBadge: 'DIFFERENTIAL QUENCHING',
      temp: '800°C → 20°C',
      scrollRange: [0.62, 0.78],
    },
    {
      num: '06',
      key: 'polish',
      kanji: '研磨',
      title: '14-STAGE POLISH & MOUNTINGS',
      subtitle: 'Progressive water stones reveal the crystalline Hamon as gold Habaki and silk Tsuka assemble.',
      meta: '14-STAGE POLISH · CHŌJI-MIDARE HAMON · KOSHIRAE MOUNTINGS',
      stateBadge: 'POLISHING & ASSEMBLY',
      temp: '22°C (Ambient)',
      scrollRange: [0.78, 0.92],
    },
    {
      num: '07',
      key: 'born',
      kanji: '完成',
      title: 'THE KATANA IS BORN',
      subtitle: 'Forged in fire. Shaped by honor. The living soul of the Samurai stands eternal before the rising sun.',
      meta: 'MASTER BLADE COMPLETE · FULL ANATOMICAL INSPECTION · TORII-SORI',
      stateBadge: 'LEGEND REVEALED',
      temp: '22°C (Ambient)',
      scrollRange: [0.92, 1.00],
    },
  ], []);

  // Hotspot definitions for the Anatomy Inspector
  const bladeParts = useMemo(() => ({
    kissaki: {
      name: 'Kissaki',
      kanji: '切先',
      title: 'THE CHISEL POINT & YOKOTE RIDGE',
      desc: 'The supreme test of a master swordsmith. The geometric chisel tip features a distinct Yokote line perpendicular to the edge and a curved Boshi temper line. It demands millimeter-level clay application to withstand armor impacts without fracturing.',
      specs: 'Chū-kissaki (Medium 3.6cm) · Hardened Martensite · Yokote Crest',
      x: 9,
      y: 47,
      zoomTarget: { x: 260, y: 20, scale: 1.8 },
    },
    hamon: {
      name: 'Hamon',
      kanji: '刃文',
      title: 'THE CRYSTALLINE TEMPER WAVE',
      desc: 'The visual soul of Japanese steel. Formed during the explosive water quench (Yaki-ire), where insulating clay slurry allows the cutting edge to freeze into glass-hard martensite crystals (Nie and Nioi) while the spine cools slowly into ductile shock-absorbing pearlite.',
      specs: 'Choji-Midare (Clove Blossom Wave) · 62 HRC Edge / 44 HRC Spine',
      x: 32,
      y: 48,
      zoomTarget: { x: 80, y: -10, scale: 1.6 },
    },
    ha: {
      name: 'Ha',
      kanji: '刃',
      title: 'THE RAZOR CUTTING EDGE & BO-HI',
      desc: 'Forged from folded high-carbon Tamahagane steel (Kawagane). Flattened and folded 15 times to form 32,768 micro-laminations that purge impurities. Paired with an engraved Bo-hi groove along the shinogi-ji to reduce blade weight by 15% without sacrificing strength.',
      specs: 'Kawagane Outer Jacket (0.75% Carbon) · 32,768 Layers · Razor Honed',
      x: 54,
      y: 50,
      zoomTarget: { x: -60, y: -20, scale: 1.5 },
    },
    habaki: {
      name: 'Habaki',
      kanji: '鎺',
      title: 'THE GOLD-FOILED BLADE COLLAR',
      desc: 'A precision-cast copper wedge clad in hammered 24K gold leaf (Kin-muku). Features diagonal Neko-gaki ("cat scratch") rain striations that grip the interior mouth of the magnolia scabbard (Koiguchi), suspending the razor edge safely in mid-air inside the saya.',
      specs: 'Nijū-habaki (Two-tier) · Hand-carved Copper & 24K Gold Leaf Inlay',
      x: 69,
      y: 49,
      zoomTarget: { x: -220, y: -20, scale: 2.1 },
    },
    tsuba: {
      name: 'Tsuba',
      kanji: '鍔',
      title: 'THE BLACKENED IRON SUKASHI GUARD',
      desc: 'Forged from hammer-beaten wrought iron with an authentic Mokko-gata (four-lobed) contour. Pierced with delicate Sukashi openwork depicting celestial dragon clouds, finished with a hand-burnished Shakudo gold rim to balance the sword’s center of gravity.',
      specs: 'Mokko-gata Blackened Iron · Dragon Sukashi Piercings · Gold Rim',
      x: 75,
      y: 49,
      zoomTarget: { x: -300, y: -20, scale: 2.0 },
    },
    tsuka: {
      name: 'Tsuka',
      kanji: '柄',
      title: 'THE RAY SKIN & SILK BRAIDED HILT',
      desc: 'Constructed from seasoned Japanese magnolia wood (Hō-no-ki), enveloped in genuine white noduled Samegawa (giant ray skin). Tightly laced with black lacquered silk cord (Tsuka-ito) in traditional diamond folds (Hishigami), securing sculpted bronze dragon Menuki beneath.',
      specs: 'White Emperor Samegawa · Black Silk Tsukamaki · Bronze Dragon Menuki',
      x: 88,
      y: 51,
      zoomTarget: { x: -440, y: -30, scale: 1.7 },
    },
  }), []);

  // GSAP ScrollTrigger Setup
  useEffect(() => {
    // Check for direct progress/chapter query parameter (e.g. ?p=0.45 or ?stage=4)
    const urlParams = new URLSearchParams(window.location.search);
    const pParam = urlParams.get('p');
    const stageParam = urlParams.get('stage');

    if (pParam !== null) {
      const parsedP = Math.max(0, Math.min(1, parseFloat(pParam)));
      setProgress(parsedP);
      const chIdx = Math.min(6, Math.floor(parsedP / (1 / 7)));
      setActiveChapter(chIdx);
      if (parsedP >= 0.92) setIsAnatomyMode(true);
    } else if (stageParam !== null) {
      const sIdx = Math.max(0, Math.min(6, parseInt(stageParam, 10) - 1));
      const targetP = sIdx * (1 / 7) + 0.07;
      setProgress(targetP);
      setActiveChapter(sIdx);
      if (sIdx >= 6) setIsAnatomyMode(true);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setProgress(1.0);
      setActiveChapter(6);
      setIsAnatomyMode(true);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outerWrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinnedStageRef.current,
        scrub: 0.7,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);

          // Calculate active chapter (0 to 6)
          let cIdx = 0;
          for (let i = 0; i < chapters.length; i++) {
            if (p >= chapters[i].scrollRange[0] && p <= chapters[i].scrollRange[1]) {
              cIdx = i;
              break;
            }
          }
          if (p >= 0.92) cIdx = 6;
          setActiveChapter(cIdx);

          // Enter anatomy mode at end of stage 7 (> 92%)
          if (p >= 0.92) {
            setIsAnatomyMode(true);
          } else {
            setIsAnatomyMode(false);
          }

          // Audio cue 1: Sword ground impact in Chapter 1 (p ~ 0.108)
          if (p >= 0.10 && p <= 0.118 && lastAudioTriggerRef.current !== 1) {
            lastAudioTriggerRef.current = 1;
            sound.playGroundImpact();
          }

          // Audio cue 2: Hammer strikes in Chapter 4 (p between 0.44 and 0.60)
          if (p >= 0.44 && p <= 0.62) {
            const strikes = [0.465, 0.51, 0.555, 0.595];
            strikes.forEach((threshold, idx) => {
              if (Math.abs(p - threshold) < 0.012 && lastAudioTriggerRef.current !== (10 + idx)) {
                lastAudioTriggerRef.current = 10 + idx;
                triggerHammerImpact();
              }
            });
          }

          // Audio cue 3: Water quench hiss in Chapter 5 (p ~ 0.69)
          if (p >= 0.68 && p <= 0.72 && lastAudioTriggerRef.current !== 30) {
            lastAudioTriggerRef.current = 30;
            sound.playQuenchSteam();
          }

          // Audio cue 4: Polish specular glint ring in Chapter 6/7 (p ~ 0.88)
          if (p >= 0.87 && p <= 0.90 && lastAudioTriggerRef.current !== 40) {
            lastAudioTriggerRef.current = 40;
            sound.playBladeGlint();
          }

          // Reset audio triggers if scrolled away
          if (p < 0.08) lastAudioTriggerRef.current = -1;
          if (p > 0.13 && p < 0.40) lastAudioTriggerRef.current = 2;
        },
      });
    }, outerWrapperRef);

    return () => ctx.revert();
  }, [chapters]);

  // Hammer strike spark effect
  const triggerHammerImpact = () => {
    sound.playHammerStrike();
    const sparks = Array.from({ length: 18 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      angle: (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
      distance: 40 + Math.random() * 70,
      size: 2.5 + Math.random() * 4,
    }));
    setStrikeSparks(sparks);
    setTimeout(() => setStrikeSparks([]), 380);
  };

  // Jump smoothly to a specific stage by scrolling the page
  const jumpToStage = (targetProgress) => {
    sound.playWoodenClick();
    setProgress(targetProgress);
    let cIdx = 0;
    for (let i = 0; i < chapters.length; i++) {
      if (targetProgress >= chapters[i].scrollRange[0] && targetProgress <= chapters[i].scrollRange[1]) {
        cIdx = i;
        break;
      }
    }
    setActiveChapter(cIdx);
    if (targetProgress >= 0.92) {
      setIsAnatomyMode(true);
    } else {
      setIsAnatomyMode(false);
    }
    if (!outerWrapperRef.current) return;
    const rect = outerWrapperRef.current.getBoundingClientRect();
    const startY = window.scrollY + rect.top;
    const totalDist = outerWrapperRef.current.offsetHeight - window.innerHeight;
    const targetY = startY + totalDist * targetProgress;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  // 3D tilt calculation in Anatomy mode
  const handleMouseMoveStage = (e) => {
    if (!stageInteractiveRef.current || !isAnatomyMode) return;
    const rect = stageInteractiveRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const normX = (mouseX / rect.width) * 100;
    setShimmerPos(Math.max(5, Math.min(95, normX)));

    const tiltAmountX = (mouseY / rect.height - 0.5) * -10;
    const tiltAmountY = (mouseX / rect.width - 0.5) * 12;
    setTilt({ x: tiltAmountX, y: tiltAmountY });
  };

  const handleMouseLeaveStage = () => {
    setTilt({ x: 0, y: 0 });
  };

  const currentPart = bladeParts[activePart] || bladeParts.hamon;
  const zoomConfig = currentPart.zoomTarget || { x: 0, y: 0, scale: 1 };
  const currentChapterInfo = chapters[activeChapter] || chapters[0];

  // -------------------------------------------------------------------------
  // MATHEMATICAL SCROLL-DRIVEN STATE CALCULATIONS (100% REVERSIBLE)
  // -------------------------------------------------------------------------

  // CHAPTER 1: Falling Katana & Ground Impact (0.00 -> 0.14)
  const isCh1 = progress < 0.14;
  const fallNorm = Math.min(1, progress / 0.108); // 0 to 1 as it falls
  const fallingSwordY = -220 + fallNorm * 480; // Drops from sky (-220px) to ground (260px)
  const fallingSwordRotZ = -22 + fallNorm * 22; // Straightens to 0 deg vertical
  const fallingSwordSpin = Math.sin(progress * 45) * 180; // 3D spin on descent

  // Impact burst at ground (0.105 -> 0.13)
  const impactProgress = progress >= 0.105 && progress <= 0.135 ? (progress - 0.105) / 0.03 : 0;
  const impactOpacity = impactProgress > 0 ? Math.max(0, 1 - impactProgress * 1.2) : 0;
  const impactScale = 0.4 + impactProgress * 2.4;

  // Red Japanese Brush Flashback Wipe (0.12 -> 0.16)
  const flashbackProgress = progress >= 0.12 && progress <= 0.16 ? (progress - 0.12) / 0.04 : progress > 0.16 ? 0 : 0;
  const flashbackOpacity = progress >= 0.12 && progress <= 0.16
    ? Math.sin(((progress - 0.12) / 0.04) * Math.PI)
    : 0;

  // CHAPTER 2: Tatara Iron Sand & Smelt (0.14 -> 0.28)
  const isCh2 = progress >= 0.14 && progress < 0.29;
  const tataraPushZoom = progress >= 0.14 && progress <= 0.28 ? (progress - 0.14) / 0.14 : 0;

  // CHAPTER 3 & 4: Forge Hearth & Swordsmith Hammering (0.28 -> 0.62)
  const isForgeActive = progress >= 0.28 && progress < 0.76;
  const forgeGlowOpacity = progress >= 0.28 && progress < 0.65
    ? Math.min(1, (progress - 0.28) * 8)
    : Math.max(0, 1 - (progress - 0.65) * 6);

  // Articulated Hammer arm angle tied directly to scroll progress
  // Discrete strikes at 0.465, 0.51, 0.555, 0.595
  let hammerArmAngle = 0;
  if (progress >= 0.42 && progress <= 0.62) {
    const cycleP = ((progress - 0.42) / 0.20) * 4; // 4 strike cycles
    const phase = cycleP % 1; // 0 to 1 within each strike
    if (phase < 0.65) {
      // Raising hammer back
      hammerArmAngle = -42 * (phase / 0.65);
    } else {
      // Snapping down to strike anvil
      const snapP = (phase - 0.65) / 0.35;
      hammerArmAngle = -42 + snapP * 62; // -42deg -> +20deg strike
    }
  }

  // Steel Billet elongation & dimensions during hammering
  const hammerProgress = progress >= 0.42 ? Math.min(1, (progress - 0.42) / 0.19) : 0;
  const billetWidth = 190 + hammerProgress * 410; // 190px -> 600px
  const billetHeight = 68 - hammerProgress * 36; // 68px -> 32px
  const strataFoldsCount = hammerProgress < 0.25 ? 2 : hammerProgress < 0.55 ? 32 : hammerProgress < 0.85 ? 1024 : 32768;

  // CHAPTER 5: Water Quench & Steam (0.62 -> 0.78)
  const isQuenchActive = progress >= 0.62 && progress <= 0.80;
  const waterTroughY = progress >= 0.60 && progress <= 0.82 ? 0 : 140;
  const quenchBladeY = progress >= 0.67 && progress <= 0.75 ? 38 : 0;
  const steamOpacity = progress >= 0.68 && progress <= 0.77 ? Math.sin(((progress - 0.68) / 0.09) * Math.PI) : 0;

  // CHAPTER 6: Polishing & Koshirae Assembly (0.78 -> 0.92)
  const isPolishActive = progress >= 0.76 && progress < 0.93;
  const polishSheenProgress = progress >= 0.78 ? Math.min(1, (progress - 0.78) / 0.14) : 0;
  const fittingsSlideX = Math.max(0, (1 - polishSheenProgress) * 75); // Slides 75px -> 0px
  const fittingsOpacity = Math.min(1, polishSheenProgress * 1.8);

  // CHAPTER 7: The Katana is Born & Anatomy Mode (0.92 -> 1.00)
  const isBornActive = progress >= 0.90;
  const sunScale = progress >= 0.88 ? Math.min(1, (progress - 0.88) / 0.08) : 0;
  const sunOpacity = progress >= 0.88 ? Math.min(0.92, (progress - 0.88) / 0.08) : 0;

  // Swordsmith visibility: only active in forge/hammer/quench chapters (0.28 -> 0.76)
  const smithOpacity = progress >= 0.28 && progress < 0.76
    ? (progress < 0.32 ? (progress - 0.28) / 0.04 : progress > 0.72 ? Math.max(0, 1 - (progress - 0.72) * 25) : 1)
    : 0;

  return (
    <div className="katana-forging-scroll-wrapper" ref={outerWrapperRef}>
      {/* 
        Pinned Cinematic Viewport: Remains locked in screen as visitor scrubs the 550vh track
      */}
      <div className="forging-pinned-canvas" ref={pinnedStageRef}>
        {/* Background Vintage Washi Texture */}
        <div className="forging-washi-backdrop" />

        {/* Faded Crimson Japanese Sun (Expands majestically in Chapter 7) */}
        <div
          className="forging-sun-halo"
          style={{
            transform: `translate(-50%, -50%) scale(${sunScale})`,
            opacity: sunOpacity,
          }}
          aria-hidden="true"
        />

        {/* ================================================================ */}
        {/* TOP STATUS BAR: CHAPTER INDICATOR, PROGRESS RUNNER & STAGE CHIPS  */}
        {/* ================================================================ */}
        <div className="forging-top-control-bar">
          <div className="stage-num-badge">
            <span className="badge-index">{isAnatomyMode ? 'ANATOMY' : `${currentChapterInfo.num} / 07`}</span>
            <span className="badge-kanji">{currentChapterInfo.kanji}</span>
            <span className="badge-state">{currentChapterInfo.stateBadge}</span>
          </div>

          {/* Interactive Chapter Chips: Clicking smoothly scrubs straight to scene */}
          <div className="forging-chips-rail" role="tablist" aria-label="Forging Chapters">
            {chapters.map((ch, idx) => {
              const isPassed = progress >= ch.scrollRange[0];
              const isCurrent = activeChapter === idx && !isAnatomyMode;
              return (
                <button
                  key={ch.key}
                  role="tab"
                  aria-selected={isCurrent}
                  className={`stage-chip-btn ${isCurrent ? 'active' : ''} ${isPassed ? 'passed' : ''} interactive`}
                  onClick={() => jumpToStage(ch.scrollRange[0] + 0.03)}
                  title={`Jump to ${ch.title}`}
                >
                  <span className="chip-dot" />
                  <span className="chip-label">{ch.num} {ch.key.toUpperCase()}</span>
                </button>
              );
            })}
            <button
              role="tab"
              aria-selected={isAnatomyMode}
              className={`stage-chip-btn chip-inspect ${isAnatomyMode ? 'active' : ''} interactive`}
              onClick={() => jumpToStage(0.96)}
              title="Inspect Katana Anatomy"
            >
              <Compass size={13} />
              <span>INSPECT</span>
            </button>
          </div>

          {/* Telemetry pill */}
          <div className="forging-telemetry-badge">
            <Flame size={13} className="text-crimson" />
            <span>{currentChapterInfo.temp}</span>
          </div>
        </div>

        {/* Glowing Scroll Progress Runner Line */}
        <div className="forging-scroll-track" aria-hidden="true">
          <div
            className="forging-scroll-runner"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>

        {/* ================================================================ */}
        {/* MAIN VISUAL STAGE: 7 CINEMATIC CHAPTER SCENES                    */}
        {/* ================================================================ */}
        <div
          ref={stageInteractiveRef}
          className={`forging-interactive-stage ${isAnatomyMode ? 'is-anatomy-mode' : ''} ${isRotating ? 'is-floating' : ''}`}
          onMouseMove={handleMouseMoveStage}
          onMouseLeave={handleMouseLeaveStage}
        >
          {/* ============================================================== */}
          {/* CHAPTER 7 MONUMENT HEADLINE: "FORGED IN FIRE. SHAPED BY HONOR." */}
          {/* ============================================================== */}
          {progress >= 0.88 && (
            <div
              className="forging-chapter7-monument-banner"
              style={{
                opacity: Math.min(1, (progress - 0.88) / 0.05),
                transform: `translate(-50%, ${Math.max(0, (0.94 - progress) * 80)}px)`,
              }}
              aria-hidden="true"
            >
              <div className="monument-kicker-row">
                <span className="monument-rule" />
                <span className="monument-kanji-kicker">完成 · 刀魂</span>
                <span className="monument-kicker-text">MASTERWORK COMPLETE · ANCESTRAL SOUL</span>
                <span className="monument-rule" />
              </div>
              <h2 className="monument-main-heading">FORGED IN FIRE. SHAPED BY HONOR.</h2>
              <p className="monument-subtitle-desc">
                The living soul of the Samurai stands eternal — tap or hover any anatomical marker below to inspect the master blade.
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/* SCENE 1: THE FALLING KATANA & IMPACT (0.00 -> 0.14)            */}
          {/* ============================================================== */}
          {isCh1 && (
            <div className="scene-falling-katana-layer" aria-hidden="true">
              {/* Suspended & Falling Vertical Katana */}
              <div
                className="falling-katana-object"
                style={{
                  transform: `translate(-50%, ${fallingSwordY}px) rotate(${fallingSwordRotZ}deg) scaleX(${Math.cos((progress / 0.11) * Math.PI * 4)})`,
                }}
              >
                <svg viewBox="0 0 120 700" className="falling-sword-svg">
                  <defs>
                    <linearGradient id="fallBladeShine" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="35%" stopColor="#DDE2E8" />
                      <stop offset="70%" stopColor="#8A9098" />
                      <stop offset="100%" stopColor="#1E2024" />
                    </linearGradient>
                  </defs>
                  {/* Katana Tsuka / Hilt at Top */}
                  <rect x="52" y="10" width="16" height="150" rx="3" fill="#0A0B0E" stroke="#1A1B20" strokeWidth="2" />
                  <rect x="44" y="158" width="32" height="8" rx="2" fill="#25262B" stroke="#D4AF37" strokeWidth="1" />
                  <ellipse cx="60" cy="166" rx="24" ry="7" fill="#18191E" stroke="#2D2F36" strokeWidth="2" />
                  {/* Habaki */}
                  <rect x="53" y="172" width="14" height="22" fill="#D4AF37" stroke="#7A5D0F" strokeWidth="1" />
                  {/* Steel Blade extending downward to sharp tip at y=680 */}
                  <path
                    d="M 54 194 L 54 650 L 60 680 L 66 650 L 66 194 Z"
                    fill="url(#fallBladeShine)"
                    stroke="#1A1B20"
                    strokeWidth="1.2"
                  />
                  {/* Hamon temper wave along edge */}
                  <path
                    d="M 55 200 Q 58 230, 55 260 T 55 320 T 55 380 T 55 440 T 55 500 T 55 560 T 55 620 L 60 680"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    fill="none"
                    opacity="0.8"
                  />
                </svg>
              </div>

              {/* Ground Stone Impact & Radial Ink Splatter */}
              <div
                className="falling-ground-stone"
                style={{ opacity: progress >= 0.08 ? 1 : progress / 0.08 }}
              >
                <div className="impact-stone-block" />
                {/* Radial Ink Spatter Burst */}
                {impactOpacity > 0 && (
                  <div
                    className="impact-ink-burst"
                    style={{
                      transform: `translate(-50%, -50%) scale(${impactScale})`,
                      opacity: impactOpacity,
                    }}
                  >
                    <svg viewBox="0 0 200 200" className="impact-ink-svg">
                      <circle cx="100" cy="100" r="14" fill="#0A0B0E" />
                      <path
                        d="M 100 100 L 140 70 M 100 100 L 160 115 M 100 100 L 130 150 M 100 100 L 70 160 M 100 100 L 40 120 M 100 100 L 50 65 M 100 100 L 85 40 M 100 100 L 120 45"
                        stroke="#0A0B0E"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Red Japanese Brush-Stroke Flashback Wipe (0.12 -> 0.16) */}
          {flashbackOpacity > 0 && (
            <div
              className="flashback-red-brush-wipe"
              style={{
                opacity: flashbackOpacity,
                transform: `scale(${1 + flashbackProgress * 0.4})`,
              }}
              aria-hidden="true"
            >
              <div className="brush-wipe-ink-bar" />
              <div className="brush-wipe-kanji">時を溯る · RECALLING THE ANCESTRAL STEEL</div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SCENE 2: TATARA FURNACE & TAMAHAGANE BLOOM SELECTION (14-28%)  */}
          {/* ============================================================== */}
          {isCh2 && (
            <div
              className="scene-tatara-layer"
              style={{
                transform: `scale(${1 + tataraPushZoom * 0.25})`,
                opacity: progress < 0.26 ? 1 : Math.max(0, 1 - (progress - 0.26) * 35),
              }}
            >
              {/* Traditional Clay Tatara Smelting Furnace SVG */}
              <div className="tatara-furnace-body">
                <svg viewBox="0 0 500 320" className="tatara-furnace-svg">
                  {/* Satetsu Iron Sand Mounds */}
                  <ellipse cx="110" cy="280" rx="90" ry="25" fill="#15161A" />
                  <ellipse cx="390" cy="285" rx="80" ry="22" fill="#181A20" />
                  <text x="75" y="278" fill="#F4ECE1" fontSize="10" opacity="0.6">SATETSU · 砂鉄</text>
                  <text x="360" y="282" fill="#F4ECE1" fontSize="10" opacity="0.6">CHARCOAL · 木炭</text>

                  {/* Clay Tatara Furnace Structure */}
                  <path
                    d="M 170 300 L 190 120 C 190 110, 205 100, 250 100 C 295 100, 310 110, 310 120 L 330 300 Z"
                    fill="#3A2D22"
                    stroke="#5A4736"
                    strokeWidth="3"
                  />
                  {/* Air Tuyere Blowers */}
                  <rect x="150" y="220" width="30" height="14" rx="2" fill="#201A15" stroke="#7A6048" />
                  <rect x="320" y="220" width="30" height="14" rx="2" fill="#201A15" stroke="#7A6048" />

                  {/* Roaring Interior Smelting Fire Glow */}
                  <ellipse cx="250" cy="200" rx="42" ry="55" fill="#FF5500" style={{ filter: 'blur(8px)' }} />
                  <ellipse cx="250" cy="200" rx="22" ry="35" fill="#FFEE33" style={{ filter: 'blur(4px)' }} />
                </svg>
              </div>

              {/* Prized Tamahagane Bloom Lump floating forward */}
              <div className="tatara-bloom-lump-container">
                <div className="bloom-lump-graphic">
                  <svg viewBox="0 0 320 180" className="tamahagane-bloom-svg">
                    <defs>
                      <radialGradient id="tataraBloomHeat" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="25%" stopColor="#FFEE55" />
                        <stop offset="65%" stopColor="#FF6600" />
                        <stop offset="100%" stopColor="#991100" />
                      </radialGradient>
                    </defs>
                    <polygon
                      points="40,90 70,45 130,35 190,40 250,55 285,90 270,135 210,155 130,150 65,130"
                      fill="#222328"
                      stroke="#FF7700"
                      strokeWidth="2.5"
                      style={{ filter: 'drop-shadow(0 0 25px rgba(255, 100, 0, 0.8))' }}
                    />
                    <polygon
                      points="75,85 110,60 160,55 220,70 245,100 225,125 160,130 95,115"
                      fill="url(#tataraBloomHeat)"
                    />
                    <line x1="90" y1="85" x2="220" y2="95" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                    <line x1="140" y1="55" x2="165" y2="130" stroke="#FFEE55" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <div className="bloom-tag-badge">TAMAHAGANE SELECTED · 玉鋼選別</div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SCENE 3 & 4: FORGE HEARTH & ARTICULATED SWORDSMITH HAMMERING   */}
          {/* ============================================================== */}
          {isForgeActive && (
            <>
              {/* Charcoal Forge Hearth Flames on Right */}
              <div
                className="forge-hearth-glow-layer"
                style={{ opacity: forgeGlowOpacity }}
                aria-hidden="true"
              >
                <div className="forge-hearth-flames">
                  <span className="flame-tongue flame-1" />
                  <span className="flame-tongue flame-2" />
                  <span className="flame-tongue flame-3" />
                </div>
                <div className="forge-glowing-coals" />
                <div className="forge-embers-drift">
                  <span className="ember-spark e-1" />
                  <span className="ember-spark e-2" />
                  <span className="ember-spark e-3" />
                </div>
              </div>

              {/* Articulated Traditional Japanese Swordsmith on Left */}
              <div
                className="swordsmith-silhouette-layer"
                style={{ opacity: smithOpacity }}
                aria-hidden="true"
              >
                <svg viewBox="0 0 460 520" className="smith-silhouette-svg">
                  {/* Oak Kanatoko Anvil Stand */}
                  <path
                    d="M 230 330 L 390 330 C 400 330, 410 340, 410 355 L 395 500 L 220 500 L 220 355 C 220 340, 225 330, 230 330 Z"
                    fill="#121316"
                    stroke="#26272D"
                    strokeWidth="2"
                  />
                  {/* Iron Anvil Block */}
                  <path
                    d="M 240 330 L 260 285 L 380 285 L 395 330 Z"
                    fill="#202126"
                    stroke="#3D3E45"
                    strokeWidth="2"
                  />
                  <path d="M 220 295 L 260 285 L 260 330 L 235 330 Z" fill="#1A1B20" />

                  {/* Swordsmith Lower Body & Hakama */}
                  <path
                    d="M 100 360 C 90 410, 110 490, 160 500 L 245 500 C 240 450, 230 400, 220 360 Z"
                    fill="#0A0B0E"
                  />

                  {/* Torso & Kimono with White Tasuki Cords */}
                  <path d="M 130 180 Q 180 170 230 180 L 235 370 L 105 370 Z" fill="#0A0B0E" />
                  <line x1="140" y1="210" x2="215" y2="310" stroke="#F4ECE1" strokeWidth="2.5" opacity="0.75" />
                  <line x1="215" y1="210" x2="140" y2="310" stroke="#F4ECE1" strokeWidth="2.5" opacity="0.75" />

                  {/* Head with White Hachimaki Headband */}
                  <circle cx="175" cy="135" r="42" fill="#0A0B0E" />
                  <path d="M 195 130 L 222 142 L 205 152 Z" fill="#0A0B0E" />
                  <path d="M 135 125 L 225 122 L 220 140 L 140 142 Z" fill="#F4ECE1" opacity="0.85" />
                  <path d="M 135 135 Q 110 145 95 180 Q 110 160 135 145 Z" fill="#F4ECE1" opacity="0.8" />

                  {/* Left Arm Gripping Forged Yatoko Tongs */}
                  <path
                    d="M 145 200 L 85 265 L 175 300"
                    stroke="#0A0B0E"
                    strokeWidth="26"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path d="M 75 265 L 310 295" stroke="#363840" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 75 275 L 310 300" stroke="#25262B" strokeWidth="7" strokeLinecap="round" />

                  {/* Right Arm Swinging Hammer — ROTATION TIED STRICTLY TO SCROLL SCRUB */}
                  <g
                    className="smith-hammer-arm-articulated"
                    style={{
                      transform: `rotate(${hammerArmAngle}deg)`,
                      transformOrigin: '225px 195px',
                      transition: 'transform 0.05s linear',
                    }}
                  >
                    <path
                      d="M 225 195 Q 285 210 295 265"
                      stroke="#0A0B0E"
                      strokeWidth="26"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Oak Hammer Shaft */}
                    <line x1="285" y1="230" x2="355" y2="300" stroke="#66462C" strokeWidth="11" strokeLinecap="round" />
                    {/* Forged Iron Hammer Head */}
                    <rect
                      x="335"
                      y="280"
                      width="42"
                      height="26"
                      rx="3"
                      fill="#1E2026"
                      stroke="#474A55"
                      strokeWidth="2"
                      transform="rotate(45 356 293)"
                    />
                  </g>
                </svg>
              </div>

              {/* Radial Hammer Strike Spark Bursts */}
              {strikeSparks.length > 0 && (
                <div className="forge-impact-sparks-root" aria-hidden="true">
                  {strikeSparks.map((spark) => {
                    const tx = Math.cos(spark.angle) * spark.distance;
                    const ty = Math.sin(spark.angle) * spark.distance;
                    return (
                      <span
                        key={spark.id}
                        className="impact-spark-particle"
                        style={{
                          '--tx': `${tx}px`,
                          '--ty': `${ty}px`,
                          width: `${spark.size}px`,
                          height: `${spark.size}px`,
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ============================================================== */}
          {/* SCENE 4 & 5: ELONGATING BILLET / BLADE BLANK / WATER QUENCH    */}
          {/* ============================================================== */}
          <div
            className="forging-sword-stage-view"
            style={{
              transform: isAnatomyMode
                ? (isZoomed
                  ? `perspective(1200px) translate3d(${zoomConfig.x}px, ${zoomConfig.y}px, 60px) scale(${zoomConfig.scale})`
                  : `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1)`)
                : `perspective(1200px) translateY(${quenchBladeY}px)`,
              transition: isAnatomyMode && isZoomed ? 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.2s ease-out',
            }}
          >
            {/* Stage 4: Elongating Billet with Fold Strata on Anvil (0.42 -> 0.62) */}
            {progress >= 0.40 && progress < 0.64 && (
              <div className="forging-ingot-layer">
                <div
                  className="ingot-metal-body"
                  style={{
                    width: `${billetWidth}px`,
                    height: `${billetHeight}px`,
                    backgroundColor: `rgb(${245}, ${130 + hammerProgress * 30}, ${20})`,
                    boxShadow: '0 0 35px #FF6600',
                  }}
                >
                  <div className="billet-fold-strata">
                    <span className="strata-line line-1" />
                    {hammerProgress > 0.3 && <span className="strata-line line-2" />}
                    {hammerProgress > 0.6 && <span className="strata-line line-3" />}
                    <span className="strata-label">{strataFoldsCount.toLocaleString()} LAYERS (FOLDED STEEL)</span>
                  </div>
                  <div className="ingot-heat-core" />
                </div>
              </div>
            )}

            {/* Stage 5: Shaped Blade Blank & Water Quench (0.62 -> 0.78) */}
            {progress >= 0.62 && progress < 0.80 && (
              <div className="forging-blade-blank-layer">
                <svg viewBox="0 0 1400 300" className="blade-blank-svg">
                  <defs>
                    <linearGradient id="quenchHeatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={progress < 0.72 ? '#FFAA00' : '#8A9098'} />
                      <stop offset="60%" stopColor={progress < 0.72 ? '#FF4400' : '#45484F'} />
                      <stop offset="100%" stopColor={progress < 0.72 ? '#881100' : '#25272D'} />
                    </linearGradient>
                  </defs>
                  {/* Classical Torii-Sori Upward Curvature Blade Profile */}
                  <path
                    d="M 100 150 C 400 120, 700 125, 960 142 L 960 164 C 700 152, 400 150, 100 150 Z"
                    fill="url(#quenchHeatGrad)"
                    stroke={progress < 0.72 ? '#FF8800' : '#8A9098'}
                    strokeWidth="1.5"
                    style={{
                      filter: progress < 0.72 ? 'drop-shadow(0 0 25px rgba(255, 100, 0, 0.7))' : 'none',
                    }}
                  />
                  {/* Chū-Kissaki Chisel Tip line */}
                  <line x1="140" y1="126" x2="140" y2="152" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
                  {/* Hamon crystallization emerging during quench */}
                  {progress >= 0.70 && (
                    <path
                      d="M 100 150 Q 150 145, 200 148 T 280 144 T 360 148 T 440 144 T 520 148 T 600 144 T 680 148 T 760 144 T 840 148 T 920 144 L 960 148"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      fill="none"
                      style={{
                        opacity: Math.min(1, (progress - 0.70) * 12),
                        filter: 'drop-shadow(0 0 6px #FFFFFF)',
                      }}
                    />
                  )}
                </svg>
              </div>
            )}

            {/* Quenching Water Trough & Billowing Steam Cloud */}
            {isQuenchActive && (
              <div
                className="quenching-trough-container"
                style={{
                  transform: `translate(-50%, ${waterTroughY}px)`,
                }}
                aria-hidden="true"
              >
                <div className="water-trough-body">
                  <span className="trough-iron-band band-1" />
                  <span className="trough-iron-band band-2" />
                  <div className="trough-water-surface">
                    <span className="water-wave-line wave-1" />
                    <span className="water-wave-line wave-2" />
                  </div>
                </div>
                {/* Dense Billowing Steam Eruption */}
                <div
                  className="quenching-steam-cloud"
                  style={{ opacity: steamOpacity }}
                >
                  <div className="steam-puff puff-1" />
                  <div className="steam-puff puff-2" />
                  <div className="steam-puff puff-3" />
                  <div className="steam-puff puff-4" />
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SCENE 6 & 7: POLISHED KATANA & KOSHIRAE ASSEMBLY (0.78-1.00) */}
            {/* ============================================================ */}
            {progress >= 0.76 && (
              <div
                className="forging-master-katana-layer"
                style={{
                  opacity: Math.min(1, (progress - 0.76) * 7),
                }}
              >
                <svg
                  className="katana-master-svg"
                  viewBox="0 0 1400 300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="bladeTamahaganeCinematic" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="18%" stopColor="#EDEDED" />
                      <stop offset="45%" stopColor="#C8CCD0" />
                      <stop offset="70%" stopColor="#8A9098" />
                      <stop offset="90%" stopColor="#3C3F45" />
                      <stop offset="100%" stopColor="#1A1B1E" />
                    </linearGradient>

                    <linearGradient id="habakiGoldCinematic" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF2A1" />
                      <stop offset="35%" stopColor="#D4AF37" />
                      <stop offset="75%" stopColor="#997A15" />
                      <stop offset="100%" stopColor="#5E4B0D" />
                    </linearGradient>

                    <linearGradient id="ironTsubaCinematic" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#323338" />
                      <stop offset="50%" stopColor="#1B1C20" />
                      <stop offset="100%" stopColor="#0D0E11" />
                    </linearGradient>

                    <pattern id="samegawaRaySkinCinematic" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                      <rect width="8" height="8" fill="#F4ECE1" />
                      <circle cx="2" cy="2" r="1.4" fill="#E2D4C3" />
                      <circle cx="6" cy="6" r="1.4" fill="#E2D4C3" />
                      <circle cx="2" cy="6" r="0.9" fill="#D5C5B2" />
                      <circle cx="6" cy="2" r="0.9" fill="#D5C5B2" />
                    </pattern>
                  </defs>

                  {/* 1. Master Blade Steel & Torii-Sori Geometry */}
                  <g className="katana-blade-assembly">
                    <path
                      d="M 100 150 C 400 120, 700 125, 960 142 L 960 164 C 700 152, 400 150, 100 150 Z"
                      fill="url(#bladeTamahaganeCinematic)"
                      stroke="#222328"
                      strokeWidth="1.2"
                    />

                    {/* Kissaki Chisel Tip with Yokote Line */}
                    <path
                      d="M 100 150 L 140 128 L 140 152 Z"
                      fill="#FFFFFF"
                      fillOpacity="0.85"
                    />
                    <line x1="140" y1="126" x2="140" y2="154" stroke="#7E848D" strokeWidth="1.2" />

                    {/* Wavy Chōji-midare Hamon Line with Nie Crystals */}
                    <path
                      d="M 100 150 Q 150 145, 200 148 T 280 144 T 360 148 T 440 144 T 520 148 T 600 144 T 680 148 T 760 144 T 840 148 T 920 144 L 960 148"
                      stroke="#FFFFFF"
                      strokeWidth="2.8"
                      fill="none"
                      style={{
                        filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.85))',
                      }}
                    />

                    {/* Bo-hi Fuller Blood Groove */}
                    <path
                      d="M 160 134 C 410 122, 690 126, 940 144"
                      stroke="#1A1B1E"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M 160 135 C 410 123, 690 127, 940 145"
                      stroke="#4F535B"
                      strokeWidth="1"
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Specular Glint Bar moving across blade */}
                    <line
                      x1={shimmerPos * 10}
                      y1="120"
                      x2={shimmerPos * 10 + 35}
                      y2="165"
                      stroke="#FFFFFF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      style={{
                        opacity: 0.75,
                        filter: 'drop-shadow(0 0 8px #FFFFFF)',
                      }}
                    />
                  </g>

                  {/* 2. Koshirae Fittings Assembly (Slides in during Chapter 6) */}
                  <g
                    className="koshirae-fittings-group"
                    style={{
                      transform: `translateX(${fittingsSlideX}px)`,
                      opacity: fittingsOpacity,
                      transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
                    }}
                  >
                    {/* Habaki (Gold Blade Collar) */}
                    <g className="habaki-assembly">
                      <path
                        d="M 960 136 L 989 137 L 989 168 L 960 166 Z"
                        fill="url(#habakiGoldCinematic)"
                        stroke="#6B3F00"
                        strokeWidth="1.2"
                      />
                      <g stroke="#9E6500" strokeWidth="1" opacity="0.8">
                        <line x1="967" y1="137" x2="964" y2="166" />
                        <line x1="973" y1="137" x2="970" y2="166" />
                        <line x1="979" y1="137" x2="976" y2="166" />
                        <line x1="985" y1="137" x2="982" y2="166" />
                      </g>
                    </g>

                    {/* Seppa Washers */}
                    <rect x="989" y="125" width="4" height="46" rx="2" fill="url(#habakiGoldCinematic)" stroke="#6B3F00" strokeWidth="1" />
                    <rect x="1005" y="125" width="4" height="46" rx="2" fill="url(#habakiGoldCinematic)" stroke="#6B3F00" strokeWidth="1" />

                    {/* Mokko-Gata Blackened Iron Tsuba */}
                    <g className="tsuba-assembly">
                      <path
                        d="M 997 108 C 1005 108, 1009 118, 1009 128 C 1014 136, 1014 158, 1009 166 C 1009 176, 1005 188, 997 188 C 989 188, 985 176, 985 166 C 980 158, 980 136, 985 128 C 985 118, 989 108, 997 108 Z"
                        fill="url(#ironTsubaCinematic)"
                        stroke="#141416"
                        strokeWidth="2.5"
                      />
                      <ellipse cx="997" cy="120" rx="4" ry="7" fill="#FAF5E8" stroke="#050507" strokeWidth="1" />
                      <ellipse cx="997" cy="176" rx="4" ry="7" fill="#FAF5E8" stroke="#050507" strokeWidth="1" />
                    </g>

                    {/* Fuchi Collar */}
                    <rect x="1009" y="128" width="12" height="40" rx="3" fill="#18191D" stroke="#D4AF37" strokeWidth="1.2" />

                    {/* Tsuka (Ray Skin + Tsukamaki Black Silk Braid) */}
                    <path
                      d="M 1021 129 L 1290 132 C 1298 132, 1304 137, 1304 147 C 1304 157, 1298 162, 1290 162 L 1021 165 Z"
                      fill="url(#samegawaRaySkinCinematic)"
                      stroke="#1E1E22"
                      strokeWidth="1.6"
                    />

                    {/* Tsukamaki Diamond Braid */}
                    {[...Array(14)].map((_, i) => {
                      const gx = 1029 + i * 19;
                      return (
                        <g key={i}>
                          <polygon points={`${gx},129 ${gx + 9.5},147 ${gx + 19},129`} fill="#0A0B0E" stroke="#1E1E24" strokeWidth="1" />
                          <polygon points={`${gx},165 ${gx + 9.5},147 ${gx + 19},165`} fill="#0A0B0E" stroke="#1E1E24" strokeWidth="1" />
                          <polygon points={`${gx + 9.5},134 ${gx + 16},147 ${gx + 9.5},160 ${gx + 3},147`} fill="url(#samegawaRaySkinCinematic)" stroke="#15161A" strokeWidth="1.2" />
                        </g>
                      );
                    })}

                    {/* Kashira Pommel Cap */}
                    <path
                      d="M 1295 131 C 1308 133, 1312 142, 1312 147 C 1312 152, 1308 161, 1295 163 Z"
                      fill="#18191D"
                      stroke="#D4AF37"
                      strokeWidth="1.6"
                    />
                    <ellipse cx="1302" cy="147" rx="3.5" ry="5" fill="#D4AF37" />
                  </g>
                </svg>

                {/* Hotspot Interactive Markers (Only visible in Anatomy Inspection mode at 100%) */}
                {isAnatomyMode && (
                  <div className="katana-hotspots-overlay" aria-label="Interactive Katana Hotspots">
                    {Object.entries(bladeParts).map(([key, part]) => (
                      <button
                        key={key}
                        className={`blade-hotspot ${activePart === key ? 'active' : ''} interactive`}
                        style={{ left: `${part.x}%`, top: `${part.y}%` }}
                        onClick={() => {
                          sound.playSwordSlash();
                          setActivePart(key);
                        }}
                        aria-label={`Inspect ${part.name}`}
                      >
                        <span className="hotspot-pulse" />
                        <span className="hotspot-core" />
                        <span className="hotspot-label">{part.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interactive Inspection Mode Tooling Bar */}
          {isAnatomyMode && (
            <div className="anatomy-controls-pill">
              <button
                className="stage-action-btn interactive"
                onClick={() => {
                  sound.playWoodenClick();
                  setIsZoomed(!isZoomed);
                }}
              >
                {isZoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
                <span>{isZoomed ? 'OVERVIEW' : 'MACRO FOCUS'}</span>
              </button>
              <button
                className="stage-action-btn interactive"
                onClick={() => {
                  sound.playWoodenClick();
                  setIsRotating(!isRotating);
                }}
              >
                <RefreshCw size={14} className={isRotating ? 'animate-spin' : ''} />
                <span>{isRotating ? 'LOCKED POSE' : 'CINEMATIC FLOAT'}</span>
              </button>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* EDITORIAL STORYTELLING PANEL: DYNAMIC TEXT PER CHAPTER           */}
        {/* ================================================================ */}
        <div className="forging-editorial-card">
          {!isAnatomyMode ? (
            <div className="forging-stage-story" key={currentChapterInfo.num}>
              <div className="stage-header-row">
                <span className="stage-accent-rule" />
                <span className="stage-roman-index">CHAPTER {currentChapterInfo.num} · {currentChapterInfo.stateBadge}</span>
                <span className="stage-japanese-tag">{currentChapterInfo.kanji}</span>
              </div>
              <h3 className="stage-monument-heading">{currentChapterInfo.title}</h3>
              <p className="stage-poetic-quote">"{currentChapterInfo.subtitle}"</p>
              <div className="stage-meta-telemetry">
                <span className="telemetry-item">{currentChapterInfo.meta}</span>
              </div>
            </div>
          ) : (
            <div className="blade-inspector-drawer" key={activePart}>
              <div className="inspector-stage-banner">
                <span className="inspector-chapter-tag">CHAPTER 07 · 完成</span>
                <span className="inspector-quote-pill">"FORGED IN FIRE. SHAPED BY HONOR."</span>
              </div>
              <div className="inspector-top-row">
                <div className="inspector-tag-group">
                  <span className="inspector-kanji">{currentPart.kanji}</span>
                  <span className="inspector-name">{currentPart.name.toUpperCase()}</span>
                  <span className="inspector-badge">ANATOMICAL SPECIFICATION</span>
                </div>
                <div className="inspector-specs-badge">{currentPart.specs}</div>
              </div>
              <h4 className="inspector-feature-title">{currentPart.title}</h4>
              <p className="inspector-feature-desc">{currentPart.desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
