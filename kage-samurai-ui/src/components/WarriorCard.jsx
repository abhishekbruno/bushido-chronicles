import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ExternalLink, Sparkles, Shield, Sword } from 'lucide-react';
import { sound } from '../utils/soundEngine';

/**
 * WarriorCard
 * -----------------------------------------------------------------------------
 * A living Japanese character panel for the Legendary Warriors gallery.
 * Reconstructs each warrior card as a layered, continuously animated panel:
 *  - Multi-tier pulsing sun halo with ambient warm diffusion
 *  - Character-specific articulated silhouettes with organic idle breathing
 *  - Character-specific details:
 *      * Musashi: dual crossed blades shifting specular angles & drifting hair topknot
 *      * Nobunaga: leaning matchlock arquebus tilt, commanding armor & ash embers
 *      * Masamune: towering golden crescent moon crest gleam & pulsing eye accent
 *      * Yukimura: swaying antler horns, fluttering helmet cords & glowing Rokumonsen coins
 *  - 60 FPS lightweight canvas particle engine (ink flecks & crimson sparks)
 *  - Interactive 3D mouse parallax tilt
 *  - Deep hover state with sword-slash specular shimmer & "VIEW DOSSIER" prompt
 */
export default function WarriorCard({ warrior, index, onSelect }) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Parallax spring physics
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ targetX: 0, targetY: 0, currX: 0, currY: 0 });

  // Ambient time clock
  const [time, setTime] = useState(0);

  // 1. Intersection Observer to save CPU when offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Mouse move handler for 3D tilt
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    sound.playBladeGlint();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  // 3. Canvas Particles & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 380);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 16 subtle atmospheric particles per card
    const particles = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const isEmber = i < 6;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.2 + Math.random() * 0.35),
        size: isEmber ? 1.2 + Math.random() * 1.8 : 0.8 + Math.random() * 2,
        opacity: 0.15 + Math.random() * 0.5,
        isEmber,
        swayPhase: Math.random() * Math.PI * 2,
      });
    }

    let clock = index * 1.25; // Phase offset per card so they don't pulse synchronously

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      if (!isVisibleRef.current) return;

      clock += 0.024;
      setTime(clock);

      // Smooth tilt lerp
      const m = mouseRef.current;
      m.currX += (m.targetX - m.currX) * 0.1;
      m.currY += (m.targetY - m.currY) * 0.1;
      setTilt({ rx: -m.currY * 12, ry: m.currX * 12 });

      ctx.clearRect(0, 0, width, height);

      // Render drifting particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.swayPhase += 0.03;
        p.x += p.vx + Math.sin(p.swayPhase) * 0.2;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (p.isEmber) {
          ctx.fillStyle = `rgba(217, 4, 22, ${p.opacity * (isHovered ? 0.9 : 0.6)})`;
          ctx.shadowColor = '#D90416';
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = `rgba(30, 32, 40, ${p.opacity * 0.45})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [index, isHovered]);

  // Ambient Sine Waves
  const t = time;
  // Breathing scale (torso / silhouette)
  const breath = Math.sin(t * 1.1) * 0.015; // ±1.5%
  // Sun breathing pulse
  const sunPulse = Math.sin(t * 0.8) * 0.03;
  const sunAuraOpacity = 0.55 + Math.sin(t * 0.7) * 0.15;

  // Character specific motions:
  // Musashi: crossed blades shift & topknot flutter
  const musashiBladeRot1 = Math.sin(t * 0.9) * 1.8;
  const musashiBladeRot2 = Math.cos(t * 0.85) * 1.6;
  const musashiHairDrift = Math.sin(t * 1.4) * 2.5;

  // Nobunaga: matchlock arquebus tilt & commanding chest expansion
  const nobunagaGunTilt = Math.sin(t * 0.6) * 1.2;
  const nobunagaCrestRot = (t * 4) % 360;

  // Masamune: crescent helmet sway & eye gleam
  const masamuneCrescentSway = Math.sin(t * 0.8) * 2.2;
  const masamuneEyeGlow = 0.6 + Math.sin(t * 2.2) * 0.4;

  // Yukimura: antler horn flex & Rokumonsen coin glow
  const yukimuraHornSway = Math.sin(t * 1.0) * 2.5;
  const yukimuraCoinPulse = 0.5 + Math.sin(t * 1.8) * 0.4;

  return (
    <article
      ref={cardRef}
      className={`warrior-card interactive ${isHovered ? 'is-card-hovered' : ''}`}
      onClick={() => onSelect(warrior)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        '--card-accent': warrior.accentColor,
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) ${isHovered ? 'translateY(-10px)' : 'translateY(0)'}`,
      }}
      aria-label={`Dossier for ${warrior.name}`}
    >
      <div className="warrior-card-inner">
        {/* Visual Artwork Box with Layered SVG Character & Atmosphere */}
        <div className="warrior-art-box">
          {/* Decorative Corner Accents */}
          <div className="card-mini-corner corner-tl" aria-hidden="true" />
          <div className="card-mini-corner corner-tr" aria-hidden="true" />
          <div className="card-mini-corner corner-bl" aria-hidden="true" />
          <div className="card-mini-corner corner-br" aria-hidden="true" />

          {/* Canvas for Floating Embers & Ink Particles */}
          <canvas ref={canvasRef} className="warrior-canvas-fx" />

          {/* Layered Interactive SVG Portrait */}
          <svg
            className="warrior-svg-portrait"
            viewBox="0 0 320 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Sun Radiant Core Gradient */}
              <radialGradient id={`sunGrad-${warrior.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EA1024" />
                <stop offset="70%" stopColor={warrior.accentColor || '#D90416'} />
                <stop offset="100%" stopColor="#8A020D" />
              </radialGradient>

              {/* Sun Outer Ambient Aura */}
              <radialGradient id={`sunAura-${warrior.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={warrior.accentColor || '#D90416'} stopOpacity="0.45" />
                <stop offset="60%" stopColor={warrior.accentColor || '#D90416'} stopOpacity="0.15" />
                <stop offset="100%" stopColor="#EBDFA8" stopOpacity="0" />
              </radialGradient>

              {/* Steel Blade Gradient */}
              <linearGradient id="bladeGleamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#E0E4E8" />
                <stop offset="70%" stopColor="#9CA3AF" />
                <stop offset="100%" stopColor="#374151" />
              </linearGradient>

              {/* Gold Crest Gradient */}
              <linearGradient id="goldCrestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2A1" />
                <stop offset="40%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#8A6C12" />
              </linearGradient>
            </defs>

            {/* ======================================================== */}
            {/* LAYER 1: LIVING SUN & PULSING AMBIENT HALO               */}
            {/* ======================================================== */}
            <g
              className="warrior-sun-group"
              style={{
                transform: `translate(${mouseRef.current.currX * -8}px, ${mouseRef.current.currY * -6}px)`,
                transition: 'transform 0.15s ease-out',
              }}
            >
              {/* Outer Radiant Aura Halo (Breathing) */}
              <circle
                cx="160"
                cy="140"
                r={150 * (1 + sunPulse * 1.5 + (isHovered ? 0.08 : 0))}
                fill={`url(#sunAura-${warrior.id})`}
                opacity={sunAuraOpacity}
              />

              {/* Core Sun Disc */}
              <circle
                cx="160"
                cy="140"
                r={110 * (1 + sunPulse * 0.4)}
                fill={`url(#sunGrad-${warrior.id})`}
                style={{
                  filter: `drop-shadow(0 4px 25px ${warrior.accentColor}66)`,
                }}
              />
            </g>

            {/* ======================================================== */}
            {/* LAYER 2: CHARACTER-SPECIFIC ARTICULATED SILHOUETTES      */}
            {/* ======================================================== */}

            {/* WARRIOR 01: MIYAMOTO MUSASHI (Two Swords Saint) */}
            {warrior.id === 'musashi' && (
              <g
                className="warrior-silhouette-musashi"
                style={{
                  transform: `translate(${mouseRef.current.currX * -4}px, ${mouseRef.current.currY * -3}px) scale(${1 + breath})`,
                  transformOrigin: '160px 300px',
                }}
              >
                {/* Long Katana Blade (Right-upward) */}
                <g
                  style={{
                    transformOrigin: '160px 240px',
                    transform: `rotate(${musashiBladeRot1}deg)`,
                  }}
                >
                  <line x1="55" y1="365" x2="265" y2="55" stroke="url(#bladeGleamGrad)" strokeWidth="6" strokeLinecap="round" />
                  <line x1="60" y1="360" x2="260" y2="60" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  {/* Tsuba guard */}
                  <circle cx="160" cy="210" r="7" fill="#0A0B0E" stroke="#D4AF37" strokeWidth="1" />
                </g>

                {/* Wakizashi Companion Blade (Left-upward) */}
                <g
                  style={{
                    transformOrigin: '160px 240px',
                    transform: `rotate(${musashiBladeRot2}deg)`,
                  }}
                >
                  <line x1="265" y1="345" x2="75" y2="75" stroke="url(#bladeGleamGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="260" y1="340" x2="80" y2="80" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                  <circle cx="170" cy="210" r="6" fill="#0A0B0E" stroke="#D4AF37" strokeWidth="1" />
                </g>

                {/* Musashi Powerful Shoulders & Haori Robes */}
                <path
                  d="M 65 400 L 115 255 C 115 255, 130 240, 160 240 C 190 240, 205 255, 205 255 L 255 400 Z"
                  fill="#0A0B0E"
                />

                {/* Chest & Keikogi Collar V-fold */}
                <path d="M 140 245 L 160 280 L 180 245 Z" fill="#1C1E24" opacity="0.6" />

                {/* Musashi Rugged Head & Jaw Profile */}
                <path
                  d="M 125 185 C 122 135, 198 135, 195 185 C 195 225, 160 245, 160 245 C 160 245, 125 225, 125 185 Z"
                  fill="#0A0B0E"
                />

                {/* Wild Samurai Topknot & Wind-blown Strands */}
                <g
                  style={{
                    transformOrigin: '160px 125px',
                    transform: `rotate(${musashiHairDrift}deg)`,
                  }}
                >
                  <path d="M 145 125 C 142 85, 185 75, 175 120 Z" fill="#0A0B0E" />
                  <path d="M 160 85 Q 185 70, 205 85" stroke="#0A0B0E" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 155 90 Q 180 80, 195 95" stroke="#0A0B0E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              </g>
            )}

            {/* WARRIOR 02: ODA NOBUNAGA (The Great Unifier) */}
            {warrior.id === 'nobunaga' && (
              <g
                className="warrior-silhouette-nobunaga"
                style={{
                  transform: `translate(${mouseRef.current.currX * -4}px, ${mouseRef.current.currY * -3}px) scale(${1 + breath})`,
                  transformOrigin: '160px 300px',
                }}
              >
                {/* Oda Mokkō Crest (Subtle Rotating Spirit Halo) */}
                <circle cx="160" cy="140" r="56" fill="none" stroke="#F7F2E3" strokeWidth="2" opacity="0.3" strokeDasharray="6 4" />
                <g
                  style={{
                    transformOrigin: '160px 140px',
                    transform: `rotate(${nobunagaCrestRot}deg)`,
                  }}
                >
                  {[0, 72, 144, 216, 288].map((angle, i) => (
                    <circle
                      key={i}
                      cx={160 + Math.cos((angle * Math.PI) / 180) * 44}
                      cy={140 + Math.sin((angle * Math.PI) / 180) * 44}
                      r="7"
                      fill="none"
                      stroke="#F7F2E3"
                      strokeWidth="1.2"
                      opacity="0.35"
                    />
                  ))}
                </g>

                {/* Tanegashima Matchlock Arquebus (Tilting gracefully) */}
                <g
                  style={{
                    transformOrigin: '230px 360px',
                    transform: `rotate(${nobunagaGunTilt}deg)`,
                  }}
                >
                  {/* Gun Barrel */}
                  <rect x="220" y="70" width="8" height="290" fill="#2E3038" stroke="#121318" strokeWidth="1" transform="rotate(12 220 70)" />
                  {/* Brass Band Mounts */}
                  <rect x="223" y="110" width="10" height="4" fill="url(#goldCrestGrad)" transform="rotate(12 223 110)" />
                  <rect x="238" y="180" width="10" height="4" fill="url(#goldCrestGrad)" transform="rotate(12 238 180)" />
                  {/* Muzzle Flash Rod */}
                  <circle cx="218" cy="68" r="4" fill="#D90416" opacity={0.6 + Math.sin(t * 3) * 0.4} />
                </g>

                {/* European Nanban Iron Cuirass High Collar & Body */}
                <path d="M 85 400 L 105 240 L 150 200 L 170 200 L 215 240 L 235 400 Z" fill="#0A0B0E" />

                {/* European Ruffled Collar / Girdle */}
                <path d="M 130 195 C 145 185, 175 185, 190 195 L 185 210 L 135 210 Z" fill="#1F2128" />

                {/* Commanding Head Profile with Distinctive Sengoku Beard */}
                <path d="M 135 150 C 130 115, 190 115, 185 150 C 185 180, 160 195, 160 195 C 160 195, 135 180, 135 150 Z" fill="#0A0B0E" />
                {/* Pointed Daimyo Goatee */}
                <path d="M 155 185 L 160 205 L 165 185 Z" fill="#0A0B0E" />
                {/* Traditional Court Eboshi / Topknot */}
                <path d="M 150 120 L 170 120 L 165 95 L 155 95 Z" fill="#0A0B0E" />
              </g>
            )}

            {/* WARRIOR 03: DATE MASAMUNE (The One-Eyed Dragon) */}
            {warrior.id === 'masamune' && (
              <g
                className="warrior-silhouette-masamune"
                style={{
                  transform: `translate(${mouseRef.current.currX * -4}px, ${mouseRef.current.currY * -3}px) scale(${1 + breath})`,
                  transformOrigin: '160px 300px',
                }}
              >
                {/* Sendai Lacquered Armor Body */}
                <path d="M 75 400 L 115 230 L 140 210 L 180 210 L 205 230 L 245 400 Z" fill="#0A0B0E" />

                {/* Broad Armored Sode Shoulder Guards */}
                <path d="M 68 250 L 115 230 L 105 295 L 58 310 Z" fill="#14151B" stroke="#050608" strokeWidth="1.5" />
                <path d="M 252 250 L 205 230 L 215 295 L 262 310 Z" fill="#14151B" stroke="#050608" strokeWidth="1.5" />

                {/* Kabuto Helmet & Face */}
                <circle cx="160" cy="165" r="44" fill="#0A0B0E" />

                {/* Iconic Eyepatch Slash Accent */}
                <path d="M 132 155 L 188 175" stroke="#D90416" strokeWidth="3.5" strokeLinecap="round" />
                {/* One-Eyed Dragon Red Eye Gleam */}
                <circle
                  cx="148"
                  cy="162"
                  r="3.5"
                  fill="#D90416"
                  opacity={masamuneEyeGlow}
                  style={{ filter: 'drop-shadow(0 0 6px #D90416)' }}
                />

                {/* Towering Golden Crescent Moon (Maedate) Swaying in Wind */}
                <g
                  style={{
                    transformOrigin: '160px 135px',
                    transform: `rotate(${masamuneCrescentSway}deg)`,
                  }}
                >
                  <path
                    d="M 160 135 C 165 50, 70 8, 20 18 C 95 18, 175 60, 185 135 Z"
                    fill="url(#goldCrestGrad)"
                    stroke="#5E4B0D"
                    strokeWidth="1.5"
                    style={{
                      filter: 'drop-shadow(0 4px 12px rgba(212, 175, 55, 0.5))',
                    }}
                  />
                  {/* Crescent Tip Gleam */}
                  <circle
                    cx="25"
                    cy="20"
                    r="2.5"
                    fill="#FFFFFF"
                    opacity={0.7 + Math.sin(t * 2) * 0.3}
                  />
                </g>
              </g>
            )}

            {/* WARRIOR 04: SANADA YUKIMURA (The Crimson Demon) */}
            {warrior.id === 'yukimura' && (
              <g
                className="warrior-silhouette-yukimura"
                style={{
                  transform: `translate(${mouseRef.current.currX * -4}px, ${mouseRef.current.currY * -3}px) scale(${1 + breath})`,
                  transformOrigin: '160px 300px',
                }}
              >
                {/* Six Coins (Rokumonsen) Crest Shining with Ancestral Power */}
                <g
                  opacity={yukimuraCoinPulse}
                  fill="url(#goldCrestGrad)"
                  stroke="#5E4B0D"
                  strokeWidth="0.8"
                >
                  <circle cx="130" cy="98" r="11" />
                  <circle cx="160" cy="98" r="11" />
                  <circle cx="190" cy="98" r="11" />
                  <circle cx="130" cy="126" r="11" />
                  <circle cx="160" cy="126" r="11" />
                  <circle cx="190" cy="126" r="11" />
                  {/* Square center holes */}
                  <rect x="127" y="95" width="6" height="6" fill="#D90416" />
                  <rect x="157" y="95" width="6" height="6" fill="#D90416" />
                  <rect x="187" y="95" width="6" height="6" fill="#D90416" />
                  <rect x="127" y="123" width="6" height="6" fill="#D90416" />
                  <rect x="157" y="123" width="6" height="6" fill="#D90416" />
                  <rect x="187" y="123" width="6" height="6" fill="#D90416" />
                </g>

                {/* Famous Crimson Armor (Akazonae) Silhouette */}
                <path d="M 75 400 L 115 230 L 140 210 L 180 210 L 205 230 L 245 400 Z" fill="#0A0B0E" />

                {/* Jūmonji Cross-Spear Points over shoulder */}
                <path d="M 50 180 L 110 270" stroke="#889098" strokeWidth="4" strokeLinecap="round" />
                <path d="M 40 185 L 65 170" stroke="#889098" strokeWidth="3" strokeLinecap="round" />

                {/* Kabuto Helmet & Mask */}
                <circle cx="160" cy="165" r="44" fill="#0A0B0E" />

                {/* Towering Antler Horns (Shikatsuno) Swaying in Battle Breeze */}
                <g
                  style={{
                    transformOrigin: '140px 135px',
                    transform: `rotate(${-yukimuraHornSway}deg)`,
                  }}
                >
                  <path
                    d="M 140 135 C 115 85, 80 45, 45 35 Q 60 55, 75 80"
                    stroke="#0A0B0E"
                    strokeWidth="9"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path d="M 90 75 Q 80 50, 65 35" stroke="#0A0B0E" strokeWidth="6" strokeLinecap="round" fill="none" />
                </g>
                <g
                  style={{
                    transformOrigin: '180px 135px',
                    transform: `rotate(${yukimuraHornSway}deg)`,
                  }}
                >
                  <path
                    d="M 180 135 C 205 85, 240 45, 275 35 Q 260 55, 245 80"
                    stroke="#0A0B0E"
                    strokeWidth="9"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path d="M 230 75 Q 240 50, 255 35" stroke="#0A0B0E" strokeWidth="6" strokeLinecap="round" fill="none" />
                </g>

                {/* Fluttering Red Silk Cords from Kabuto */}
                <path
                  d={`M 145 190 Q ${135 + Math.sin(t * 2) * 8} 240, 130 280`}
                  stroke="#D90416"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={`M 175 190 Q ${185 - Math.sin(t * 2) * 8} 240, 190 280`}
                  stroke="#D90416"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            )}
          </svg>

          {/* Sword-Slash Shimmer Light Bar on Hover */}
          <div className="art-slash-blade" aria-hidden="true" />

          {/* Japanese Vertical Kanji Calligraphy Stamp */}
          <div className="warrior-kanji-stamp" aria-hidden="true">
            {warrior.japanese}
          </div>

          {/* Hover Prompt Pill: VIEW DOSSIER */}
          <div className="warrior-hover-badge">
            <span>VIEW DOSSIER</span>
            <ExternalLink size={13} className="hover-arrow-icon" />
          </div>
        </div>

        {/* Card Editorial Meta & Typography */}
        <div className="warrior-info-box">
          <div className="warrior-era-row">
            <span className="warrior-index">NO. 0{index + 1}</span>
            <span className="warrior-era-tag">{warrior.era}</span>
          </div>

          <h3 className="warrior-name">{warrior.name}</h3>
          <div className="warrior-title-tag">{warrior.title}</div>

          <p className="warrior-quote">“{warrior.quote}”</p>

          <div className="warrior-footer-row">
            <span className="warrior-weapon-label">{warrior.signatureWeapon}</span>
            <span className="warrior-arrow-icon">→</span>
          </div>
        </div>
      </div>
    </article>
  );
}

