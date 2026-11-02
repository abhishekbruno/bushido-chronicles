import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Compass, Shield, Flame } from 'lucide-react';
import { sound } from '../utils/soundEngine';

export default function HeroSamurai({ onEnterLegend, onExploreWarriors }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    // Trigger entrance animation on mount
    const timer = setTimeout(() => setLoaded(true), 150);

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Normalize from -1 to 1
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Parallax offsets
  const sunX = mousePos.x * 20;
  const sunY = mousePos.y * 15 - scrollY * 0.25;

  const textX = mousePos.x * -35;
  const textY = mousePos.y * -20 - scrollY * 0.35;

  const samuraiX = mousePos.x * 45;
  const samuraiY = mousePos.y * 25 - scrollY * 0.12;
  const samuraiRotate = mousePos.x * 2.5;

  return (
    <section ref={heroRef} className={`hero-section ${loaded ? 'is-loaded' : ''}`} id="hero">
      {/* Dynamic Background Washi Texture & Atmospheric Grain */}
      <div className="hero-washi-bg" />

      {/* Atmospheric Mist & Mountain Silhouette Far Layer */}
      <div
        className="hero-mist-layer"
        style={{
          transform: `translate3d(${mousePos.x * 8}px, ${-scrollY * 0.08}px, 0)`,
        }}
      >
        <svg
          className="distant-mountains"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 320L120 280C240 240 480 180 720 210C960 240 1200 270 1320 285L1440 300V320H0Z"
            fill="#EADBCE"
            fillOpacity="0.45"
          />
          <path
            d="M0 320L180 290C360 260 720 220 980 235C1240 250 1380 275 1440 285V320H0Z"
            fill="#D5C5B5"
            fillOpacity="0.3"
          />
        </svg>
      </div>

      {/* INDEPENDENT LAYER 1: The Procedural Ultra-HD Crimson Red Sun */}
      <div
        className="hero-sun-container"
        style={{
          transform: `translate3d(${sunX}px, ${sunY}px, 0)`,
        }}
      >
        <div className="hero-sun-element">
          {/* Subtle atmospheric aura bleed */}
          <div className="sun-inner-glow" />
          <svg
            className="sun-svg"
            viewBox="0 0 600 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="300"
              cy="300"
              r="280"
              fill="#D90416"
              className="sun-core"
            />
            {/* Subtle Japanese ray rings */}
            <circle
              cx="300"
              cy="300"
              r="278"
              fill="none"
              stroke="#B30212"
              strokeWidth="2"
              strokeDasharray="16 8"
              opacity="0.4"
            />
          </svg>
        </div>
      </div>

      {/* INDEPENDENT LAYER 2: Massive Expressive Hero Typography Behind the Samurai */}
      <div
        className="hero-typography-layer hero-typography-back"
        style={{
          transform: `translate3d(${textX}px, ${textY}px, 0)`,
        }}
      >
        <div className="hero-text-block">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" />
            <span className="eyebrow-text">KYOTO ARCHIVES · VOL. IX</span>
            <span className="eyebrow-kanji">武士道</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-line hero-line-1">THE WAY</span>
            <span className="hero-line hero-line-2">OF THE</span>
            <span className="hero-line hero-line-3">SAMURAI<span className="hero-dot">.</span></span>
          </h1>
        </div>

        {/* Large Decorative Vertical Japanese Calligraphy */}
        <div className="hero-kanji-pillar-left" aria-hidden="true">
          <span>武</span>
          <span>士</span>
          <span>道</span>
          <span>精</span>
          <span>神</span>
        </div>
      </div>

      {/* INDEPENDENT LAYER 3: The 4K Multi-Layered Black-Armored Samurai Warrior */}
      <div
        className="hero-samurai-stage"
        style={{
          transform: `translate3d(${samuraiX}px, ${samuraiY}px, 0) rotate(${samuraiRotate}deg)`,
        }}
      >
        <div className="samurai-character-rig">
          {/* Billowing Haori / Jinbaori Cloak Behind Body */}
          <div className="samurai-cloak-layer" />

          {/* Master 4K Resolution-Independent Rigged Vector Samurai */}
          <svg
            className="samurai-vector-svg"
            viewBox="0 0 800 1100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Armor gradients and lacquer gloss */}
              <linearGradient id="goldCrest" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="45%" stopColor="#D4AF37" />
                <stop offset="80%" stopColor="#AA820A" />
                <stop offset="100%" stopColor="#6E5002" />
              </linearGradient>

              <linearGradient id="armorPlate" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1C1C1C" />
                <stop offset="50%" stopColor="#0D0D0D" />
                <stop offset="100%" stopColor="#050505" />
              </linearGradient>

              <linearGradient id="crimsonLace" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D90416" />
                <stop offset="100%" stopColor="#8A020E" />
              </linearGradient>

              <linearGradient id="steelBlade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#D8D8D8" />
                <stop offset="70%" stopColor="#888888" />
                <stop offset="100%" stopColor="#3A3A3A" />
              </linearGradient>

              {/* Ink Smoke Dispersion Filter */}
              <filter id="inkDissolve" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            {/* AURA: Dynamic ink shadow dissipation */}
            <g className="ink-aura-group" opacity="0.45" filter="url(#inkDissolve)">
              <ellipse cx="400" cy="620" rx="260" ry="380" fill="#0A0A0A" opacity="0.3" />
              <path d="M220 850 C 180 720, 240 500, 320 400 C 480 320, 560 520, 600 750 C 620 900, 520 1020, 380 1040 Z" fill="#0A0A0A" opacity="0.2" />
            </g>

            {/* FLOWING JINBAORI / SURCOAT (Back tails moving with the wind) */}
            <g className="jinbaori-wind-group">
              <path
                className="cloak-flutter-1"
                d="M260 580 C 190 700, 140 850, 110 990 C 180 970, 260 920, 320 860 C 290 760, 270 660, 260 580 Z"
                fill="#151515"
              />
              <path
                className="cloak-flutter-2"
                d="M540 580 C 610 710, 670 860, 710 1000 C 640 980, 560 930, 490 870 C 515 765, 530 665, 540 580 Z"
                fill="#181818"
              />
            </g>

            {/* LOWER BODY: HAKAMA & HAIDATE (Thigh Guards) */}
            <g className="lower-body-group">
              <path
                d="M270 780 L230 1080 L370 1080 L400 850 L430 1080 L570 1080 L530 780 Z"
                fill="#0A0A0A"
              />
              {/* Pleats and Shadow Creases */}
              <path d="M300 800 L280 1080 M340 810 L350 1080 M460 810 L450 1080 M500 800 L520 1080" stroke="#1A1A1A" strokeWidth="4" />
            </g>

            {/* SAYA & DAISHO (Swords at hip) */}
            <g className="sword-hip-group">
              {/* Katana Scabbard (Saya) slung through obi sash */}
              <path
                d="M240 730 L80 940 L70 930 L235 715 Z"
                fill="#1B1212"
                stroke="#D4AF37"
                strokeWidth="1.5"
              />
              {/* Kurigata & Sageo cord */}
              <path d="M210 755 C 190 790, 170 820, 140 850" stroke="#D90416" strokeWidth="3" strokeLinecap="round" />
              {/* Wakizashi (Companion short blade) */}
              <path
                d="M250 710 L150 820 L140 812 L242 700 Z"
                fill="#0A0A0A"
                stroke="#8A8580"
                strokeWidth="1"
              />
            </g>

            {/* TORSO & DO ARMOR: Breathing Animation Group */}
            <g className="samurai-breathing-group">
              {/* Chest Plate (Do) */}
              <path
                d="M310 460 C 350 450, 450 450, 490 460 L520 740 C 470 760, 330 760, 280 740 Z"
                fill="url(#armorPlate)"
                stroke="#2A2A2A"
                strokeWidth="2"
              />

              {/* Laced Kozane Plates (Kebiki Odoshi horizontal cord lacing) */}
              <g className="kebiki-lacing">
                <rect x="305" y="490" width="190" height="8" rx="2" fill="url(#crimsonLace)" />
                <rect x="295" y="525" width="210" height="8" rx="2" fill="url(#crimsonLace)" />
                <rect x="290" y="560" width="220" height="8" rx="2" fill="url(#crimsonLace)" />
                <rect x="285" y="595" width="230" height="8" rx="2" fill="url(#crimsonLace)" />
                <rect x="280" y="630" width="240" height="8" rx="2" fill="url(#crimsonLace)" />
                <rect x="280" y="665" width="240" height="8" rx="2" fill="url(#crimsonLace)" />
              </g>

              {/* Clan Mon / Insignia on Chest */}
              <circle cx="400" cy="535" r="24" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
              <path d="M386 535 L414 535 M400 521 L400 549" stroke="#D4AF37" strokeWidth="2.5" />

              {/* Obi (Waist Sash) */}
              <rect x="280" y="700" width="240" height="42" fill="#D90416" rx="3" />
              <path d="M280 721 L520 721" stroke="#90030E" strokeWidth="3" />

              {/* O-SODE (Great Shoulder Armor Shields) */}
              {/* Left Shoulder */}
              <g className="shoulder-left">
                <path d="M210 450 L310 470 L280 680 L180 640 Z" fill="url(#armorPlate)" stroke="#333" strokeWidth="2" />
                <line x1="200" y1="495" x2="295" y2="515" stroke="#D90416" strokeWidth="4" />
                <line x1="195" y1="535" x2="290" y2="555" stroke="#D90416" strokeWidth="4" />
                <line x1="190" y1="575" x2="285" y2="595" stroke="#D90416" strokeWidth="4" />
                <line x1="185" y1="615" x2="280" y2="635" stroke="#D90416" strokeWidth="4" />
                {/* Gold Crest on shoulder */}
                <circle cx="245" cy="485" r="12" fill="url(#goldCrest)" />
              </g>

              {/* Right Shoulder */}
              <g className="shoulder-right">
                <path d="M590 450 L490 470 L520 680 L620 640 Z" fill="url(#armorPlate)" stroke="#333" strokeWidth="2" />
                <line x1="505" y1="515" x2="600" y2="495" stroke="#D90416" strokeWidth="4" />
                <line x1="510" y1="555" x2="605" y2="535" stroke="#D90416" strokeWidth="4" />
                <line x1="515" y1="595" x2="610" y2="575" stroke="#D90416" strokeWidth="4" />
                <line x1="520" y1="635" x2="615" y2="615" stroke="#D90416" strokeWidth="4" />
                {/* Gold Crest on shoulder */}
                <circle cx="555" cy="485" r="12" fill="url(#goldCrest)" />
              </g>

              {/* ARMS & HANDS */}
              {/* Right Arm grasping sword hilt */}
              <g className="right-arm-group">
                <path d="M570 540 C 585 640, 520 730, 450 740 L440 705 C 490 690, 530 630, 520 540 Z" fill="#0F0F0F" />
                {/* Hand on Hilt */}
                <ellipse cx="445" cy="722" rx="18" ry="14" fill="#1C1C1C" stroke="#2B2B2B" strokeWidth="1.5" />
              </g>

              {/* Left Arm poised at side */}
              <g className="left-arm-group">
                <path d="M230 540 C 215 640, 260 740, 310 750 L320 715 C 285 700, 255 630, 270 540 Z" fill="#0F0F0F" />
                <ellipse cx="310" cy="735" rx="16" ry="14" fill="#1C1C1C" stroke="#2B2B2B" strokeWidth="1.5" />
              </g>

              {/* KATANA HILT & TSUBA DETAIL */}
              <g className="katana-hilt-detail">
                {/* Tsuba (Iron Guard) */}
                <ellipse cx="435" cy="705" rx="18" ry="8" fill="#1A1A1A" stroke="#D4AF37" strokeWidth="2" transform="rotate(-30 435 705)" />
                {/* Tsuka (Braided Hilt) */}
                <path d="M430 700 L380 645 L365 658 L415 712 Z" fill="#0A0A0A" stroke="#D90416" strokeWidth="1.5" />
                {/* Kashira (Pommel Cap) */}
                <ellipse cx="372" cy="651" rx="8" ry="6" fill="url(#goldCrest)" transform="rotate(-30 372 651)" />
              </g>
            </g>

            {/* HEAD, MENPO (MASK) & KABUTO (HELMET) */}
            <g className="samurai-head-group">
              {/* Shikoro (Neck Guard Lames) */}
              <path
                d="M260 380 C 320 440, 480 440, 540 380 L560 460 C 470 510, 330 510, 240 460 Z"
                fill="url(#armorPlate)"
                stroke="#222"
                strokeWidth="2"
              />
              <path d="M250 410 C 330 460, 470 460, 550 410" stroke="#D90416" strokeWidth="3" />
              <path d="M245 440 C 330 485, 470 485, 555 440" stroke="#D90416" strokeWidth="3" />

              {/* Menpo (Demon Face Armor) */}
              <g className="menpo-mask">
                <path
                  d="M340 330 C 340 410, 370 450, 400 450 C 430 450, 460 410, 460 330 Z"
                  fill="#111111"
                  stroke="#262626"
                  strokeWidth="2"
                />
                {/* Fierce Mustache & Nose Ridge */}
                <path d="M370 365 Q400 375 430 365" stroke="#D90416" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M365 400 Q400 425 435 400" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
                {/* Glowing warrior eyes in shadow */}
                <ellipse cx="375" cy="328" rx="7" ry="3" fill="#D90416" opacity="0.9" />
                <ellipse cx="425" cy="328" rx="7" ry="3" fill="#D90416" opacity="0.9" />
              </g>

              {/* Kabuto (Helmet Bowl & Visor) */}
              <g className="kabuto-helmet">
                {/* Main Dome */}
                <path
                  d="M270 320 C 270 170, 530 170, 530 320 C 530 340, 490 355, 400 355 C 310 355, 270 340, 270 320 Z"
                  fill="url(#armorPlate)"
                  stroke="#333"
                  strokeWidth="2"
                />
                {/* Mabizashi (Forehead Visor) */}
                <path
                  d="M260 315 C 310 295, 490 295, 540 315 L525 335 C 480 320, 320 320, 275 335 Z"
                  fill="#1A1A1A"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                />
                {/* Fukikaeshi (Curved Wing Guards at sides) */}
                <path d="M255 290 C 235 340, 240 380, 270 390 L280 340 Z" fill="url(#armorPlate)" stroke="#D4AF37" strokeWidth="1.5" />
                <path d="M545 290 C 565 340, 560 380, 530 390 L520 340 Z" fill="url(#armorPlate)" stroke="#D4AF37" strokeWidth="1.5" />

                {/* THE ICONIC GOLDEN CRESCENT MOON (Maedate - 前立) */}
                <g className="maedate-crest">
                  <path
                    d="M400 280 C 400 130, 240 70, 180 80 C 290 80, 410 150, 430 280 Z"
                    fill="url(#goldCrest)"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                  />
                  {/* Subtle right crescent wing */}
                  <path
                    d="M400 280 C 400 150, 530 90, 600 100 C 500 105, 410 170, 390 280 Z"
                    fill="url(#goldCrest)"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                  />
                  {/* Center Sun Disc Mount */}
                  <circle cx="400" cy="275" r="14" fill="#D90416" stroke="url(#goldCrest)" strokeWidth="2.5" />
                </g>

                {/* Agemaki & Helmet Cords Fluttering */}
                <path
                  className="ribbon-flutter-left"
                  d="M275 370 C 220 440, 190 530, 160 620"
                  stroke="#D90416"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  className="ribbon-flutter-right"
                  d="M525 370 C 580 440, 610 530, 640 620"
                  stroke="#D90416"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* INDEPENDENT LAYER 4: Foreground Editorial Details, Badges & CTAs */}
      <div className="hero-foreground-content">
        <div className="hero-content-inner">
          <div className="hero-meta-badge">
            <span className="badge-pulse" />
            <span className="badge-text">ERA: 1185 – 1868 · FEUDAL JAPAN</span>
          </div>

          <p className="hero-description">
            A digital monument to the disciplined path of honor, the philosophy of Bushido,
            and the unyielding craftsmanship of the master blade.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn btn-primary interactive"
              onClick={() => {
                sound.playSwordSlash();
                sound.playTaiko();
                onEnterLegend();
              }}
            >
              <span className="btn-ink-fill" />
              <span className="btn-text">ENTER THE LEGEND</span>
              <span className="btn-icon">
                <ArrowRight size={18} />
              </span>
            </button>

            <button
              className="btn btn-secondary interactive"
              onClick={() => {
                sound.playWoodenClick();
                onExploreWarriors();
              }}
            >
              <span className="btn-text">EXPLORE THE WARRIORS</span>
              <span className="btn-kanji">武将</span>
            </button>
          </div>

          {/* Minimalist Continuous Scroll Indicator */}
          <div className="hero-scroll-indicator" aria-hidden="true">
            <div className="scroll-kanji">下</div>
            <div className="scroll-line">
              <span className="scroll-dot" />
            </div>
            <div className="scroll-label">SCROLL TO AWAKEN</div>
          </div>
        </div>
      </div>
    </section>
  );
}

