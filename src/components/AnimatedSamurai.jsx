import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SAMURAI_PATH, SHOULDER_PATH } from '../assets/vectors/vectorPaths';

export default function AnimatedSamurai() {
  const warriorRef = useRef(null);

  useEffect(() => {
    if (!warriorRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.fromTo(
      warriorRef.current.querySelector('.samurai-character-inner'),
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }
    );
    return () => tween.kill();
  }, []);

  return (
    <div
      ref={warriorRef}
      className="scene-layer animated-samurai-layer"
      style={{
        transform:
          'translate3d(calc(var(--p-mouse-x, 0) * 22px), calc(var(--p-mouse-y, 0) * 12px - var(--p-scroll-y, 0) * 0.12px), 0) rotate(calc(var(--p-mouse-x, 0) * 0.9deg))',
        willChange: 'transform',
      }}
      aria-label="Black-armored Samurai warrior standing in three-quarter profile with drawn katana"
    >
      <div className="samurai-character-inner">
        <svg
          className="samurai-master-svg"
          viewBox="0 0 1215 1063"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Specular Sheen for Katana Blade Edge */}
            <linearGradient id="bladeEdgeSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#E2E2E2" stopOpacity="0.8" />
              <stop offset="85%" stopColor="#8A8580" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#050505" stopOpacity="0" />
            </linearGradient>

            {/* Specular Gradient for Segmented Sode Shoulder Armor */}
            <linearGradient id="shoulderLameGleam" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#EDEDED" />
              <stop offset="65%" stopColor="#B3B0AA" />
              <stop offset="100%" stopColor="#5A5652" />
            </linearGradient>

            {/* Gold Maedate Crest Gradient */}
            <linearGradient id="crestGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9E076" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#9A7B1C" />
            </linearGradient>

            {/* Sumi-e Ink Fade Gradients for Organic Grounding */}
            <linearGradient id="samuraiBottomFadeMask" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="85%" stopColor="#FFFFFF" />
              <stop offset="97%" stopColor="#000000" />
            </linearGradient>
            <linearGradient id="samuraiRightFadeMask" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="85%" stopColor="#FFFFFF" />
              <stop offset="98%" stopColor="#000000" />
            </linearGradient>

            {/* Master Sumi-e Fade Mask */}
            <mask id="samuraiSumiFadeMask">
              <rect x="0" y="0" width="1215" height="1063" fill="url(#samuraiBottomFadeMask)" />
              <rect x="880" y="0" width="335" height="1063" fill="url(#samuraiRightFadeMask)" style={{ mixBlendMode: 'multiply' }} />
            </mask>

            {/* Subtle Drop Shadow for 3D Depth */}
            <filter id="warriorDepth" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#000000" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* MAIN WARRIOR & LANDSCAPE SILHOUETTE: PURE INKY JET BLACK (#050505) WITH SUMI-E FADE */}
          <g className="samurai-breathing-torso" filter="url(#warriorDepth)" mask="url(#samuraiSumiFadeMask)">
            {/* Opaque solid inner backing: Completely prevents text/sun background from bleeding through body holes */}
            <ellipse cx="490" cy="350" rx="85" ry="95" fill="#050505" />
            <ellipse cx="510" cy="520" rx="125" ry="195" fill="#050505" />
            <ellipse cx="495" cy="710" rx="150" ry="110" fill="#050505" />

            {/* Master Sumi-e Vector Path */}
            <path
              d={SAMURAI_PATH}
              fill="#050505"
              stroke="#050505"
              strokeWidth="0.8"
              className="samurai-body-path"
            />

            {/* Articulated Golden Kabuto Maedate Crescent Crest */}
            <path
              d="M 440 230 C 452 210, 480 198, 510 195 C 492 205, 475 220, 465 240 Z"
              fill="url(#crestGoldGrad)"
              opacity="0.95"
            />
          </g>

          {/* SHOULDER ARMOR SPECULAR HIGHLIGHTS (Curved Segmented Lames with Metallic Gleam) */}
          <g className="samurai-shoulder-highlights">
            <path
              d={SHOULDER_PATH}
              fill="url(#shoulderLameGleam)"
              opacity="0.98"
              className="shoulder-specular-lames"
            />
          </g>

          {/* DRAWN KATANA BLADE HIGHLIGHT (Extending to Upper-Left at ~45-50°) */}
          <g className="drawn-blade-accent">
            <line
              x1="38"
              y1="168"
              x2="338"
              y2="570"
              stroke="url(#bladeEdgeSheen)"
              strokeWidth="2.8"
              strokeLinecap="round"
              className="blade-glint-line"
            />
            <line
              x1="45"
              y1="178"
              x2="310"
              y2="540"
              stroke="#FFFFFF"
              strokeWidth="1"
              strokeOpacity="0.6"
              strokeLinecap="round"
            />
          </g>

          {/* SAGEO CORDS & CLOTH FLUTTER OVERLAY (Wind simulation) */}
          <g className="fluttering-cords-group" stroke="#050505" strokeWidth="2.5" fill="none">
            <path className="cord-flutter-1" d="M135 628 Q 148 660 154 701" />
            <path className="cord-flutter-2" d="M152 642 Q 170 675 178 718" />
          </g>
        </svg>
      </div>
    </div>
  );
}
