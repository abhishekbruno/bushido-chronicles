import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Sparkles, ChevronDown } from 'lucide-react';
import { sound } from '../utils/soundEngine';

gsap.registerPlugin(ScrollTrigger);

/**
 * VerticalBladeIntro
 * -----------------------------------------------------------------------------
 * Cinematic Scroll Introduction for Chapter 4: THE HISTORY OF THE BLADE.
 *
 * Visual & Motion Choreography:
 *  1. Textured dark parchment museum background fades in.
 *  2. Japanese chapter title "鋼に刻まれた歴史" reveals via ink-brush stroke mask.
 *  3. English heading "THE HISTORY OF THE BLADE / A LEGACY FORGED IN STEEL."
 *     unfolds like an antique Japanese manuscript.
 *  4. A detailed vertical Japanese sword emerges through an overhead atmospheric spotlight.
 *  5. Camera/SVG framing reveals the blade from kissaki (tip) down to tsuka (hilt).
 *  6. Specular light gleam travels along the polished steel.
 *  7. Archival metadata plinths reveal.
 *  8. Bidirectional GSAP ScrollTrigger with prefers-reduced-motion safety.
 */
export default function VerticalBladeIntro({ onScrollToExhibits }) {
  const containerRef = useRef(null);
  const swordRef = useRef(null);
  const lightBeamRef = useRef(null);
  const specularRef = useRef(null);
  const textGroupRef = useRef(null);
  const metadataRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(el.querySelectorAll('.blade-intro-anim'), { opacity: 1, y: 0, clipPath: 'none' });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 78%',
          end: 'bottom 25%',
          toggleActions: 'play reverse play reverse',
        },
      });

      // 1. Japanese ink calligraphy stroke reveal
      tl.fromTo(
        el.querySelector('.blade-intro-jp-title'),
        { opacity: 0, y: -20, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' },
        0.1
      );

      // 2. English heading manuscript unfolding
      tl.fromTo(
        el.querySelector('.blade-intro-headline'),
        { opacity: 0, y: 25, rotateX: -12, transformOrigin: 'top center' },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.85, ease: 'power3.out' },
        0.25
      );

      // 3. Subtitle and narrative text
      tl.fromTo(
        el.querySelectorAll('.blade-intro-sub-item'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' },
        0.45
      );

      // 4. Overhead atmospheric light beam illumination
      if (lightBeamRef.current) {
        tl.fromTo(
          lightBeamRef.current,
          { opacity: 0, scaleY: 0.3, transformOrigin: 'top center' },
          { opacity: 0.85, scaleY: 1, duration: 0.9, ease: 'power2.out' },
          0.3
        );
      }

      // 5. Vertical blade reveal from tip toward handle
      if (swordRef.current) {
        tl.fromTo(
          swordRef.current,
          { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0.4 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.15, ease: 'power2.inOut' },
          0.4
        );
      }

      // 6. Specular light traveling down polished steel
      if (specularRef.current) {
        tl.fromTo(
          specularRef.current,
          { y: -300, opacity: 0 },
          { y: 350, opacity: 1, duration: 1.2, ease: 'power1.inOut' },
          0.7
        );
      }

      // 7. Metadata badges
      if (metadataRef.current) {
        tl.fromTo(
          metadataRef.current.children,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
          0.85
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  const handlePromptClick = () => {
    sound.playBladeGlint();
    if (onScrollToExhibits) {
      onScrollToExhibits();
    } else {
      const el = document.getElementById('gallery');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="blade-intro-showcase-stage">
      {/* 1. Atmospheric Ambient Lighting & Ink Wash */}
      <div className="blade-intro-atmosphere" aria-hidden="true">
        <div ref={lightBeamRef} className="blade-intro-light-beam" />
        <div className="blade-intro-radial-halo" />
        <div className="blade-intro-ink-wash-texture" />
      </div>

      <div className="blade-intro-content-grid">
        {/* Left Column: Historical Heading & Manuscript Description */}
        <div ref={textGroupRef} className="blade-intro-text-column">
          {/* Chapter Eyebrow Tag */}
          <div className="blade-intro-eyebrow-row blade-intro-anim">
            <span className="blade-intro-chapter-badge">第四章 · SECTION IV</span>
            <span className="blade-intro-eyebrow-divider" />
            <span className="blade-intro-eyebrow-en">JAPANESE SWORD EXHIBITION</span>
          </div>

          {/* Japanese Chapter Title with Ink-Brush Style */}
          <div className="blade-intro-jp-title blade-intro-anim" lang="ja">
            鋼に刻まれた歴史
          </div>

          {/* Master Monument English Heading */}
          <h2 className="blade-intro-headline blade-intro-anim">
            THE HISTORY OF <span className="headline-crimson-accent">THE BLADE.</span>
          </h2>

          {/* Subtitle */}
          <div className="blade-intro-subtitle blade-intro-sub-item">
            A LEGACY FORGED IN STEEL.
          </div>

          {/* Supporting Narrative Paragraph */}
          <p className="blade-intro-narrative blade-intro-sub-item">
            Across centuries of Japanese history, swordsmiths transformed steel into objects
            of extraordinary craftsmanship. Each blade carries the traditions, innovations,
            and artistic identity of its era.
          </p>

          {/* Archival Metadata Plinths */}
          <div ref={metadataRef} className="blade-intro-metadata-row">
            <div className="blade-intro-meta-card">
              <span className="meta-card-label">CHRONOLOGY</span>
              <strong className="meta-card-val">Heian – Edo</strong>
              <span className="meta-card-sub">10th to 19th Century</span>
            </div>
            <div className="blade-intro-meta-card">
              <span className="meta-card-label">EXHIBITS</span>
              <strong className="meta-card-val">05 Masterpieces</strong>
              <span className="meta-card-sub">Tachi · Katana · Wakizashi · Tantō</span>
            </div>
            <div className="blade-intro-meta-card">
              <span className="meta-card-label">CURATION</span>
              <strong className="meta-card-val">National Treasures</strong>
              <span className="meta-card-sub">Tokyo & Fukuoka Museums · The Met</span>
            </div>
          </div>

          {/* Interactive Scroll Prompt Button */}
          <div className="blade-intro-action-row blade-intro-sub-item">
            <button
              type="button"
              className="blade-intro-explore-btn interactive"
              onClick={handlePromptClick}
            >
              <Sparkles size={16} className="text-crimson" />
              <span>EXPLORE THE FIVE SACRED BLADES</span>
              <ChevronDown size={16} />
            </button>
            <span className="blade-intro-prompt-note">Scroll to browse exhibits 01—05</span>
          </div>
        </div>

        {/* Right Column: Detailed Vertical Blade Emergence */}
        <div className="blade-intro-sword-column">
          <div className="blade-intro-sword-pedestal">
            {/* Museum Exhibit Plinth Lighting Glow */}
            <div className="sword-pedestal-glow" aria-hidden="true" />

            {/* Vertical Katana SVG Illustration */}
            <div ref={swordRef} className="blade-vertical-svg-host">
              <svg
                viewBox="0 0 240 640"
                className="blade-vertical-svg"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Vertical Japanese Katana illuminated by museum spotlight, tip pointing upward with visible hamon line, hand guard, and woven hilt."
              >
                <defs>
                  {/* Steel Blade Surface Gradient */}
                  <linearGradient id="vSteelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4A535A" />
                    <stop offset="18%" stopColor="#E2E6E7" />
                    <stop offset="42%" stopColor="#8A959A" />
                    <stop offset="65%" stopColor="#F4F6F6" />
                    <stop offset="85%" stopColor="#5B646B" />
                    <stop offset="100%" stopColor="#30373C" />
                  </linearGradient>

                  {/* Hamon Cloud Wash */}
                  <linearGradient id="vHamonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#E0DDD0" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
                  </linearGradient>

                  {/* Bronze Habaki & Fittings */}
                  <linearGradient id="vBronzeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5E462E" />
                    <stop offset="35%" stopColor="#D4A76A" />
                    <stop offset="70%" stopColor="#9C7345" />
                    <stop offset="100%" stopColor="#4E3622" />
                  </linearGradient>

                  {/* Tsuka Wrapped Hilt */}
                  <linearGradient id="vHiltGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#121517" />
                    <stop offset="50%" stopColor="#252A2D" />
                    <stop offset="100%" stopColor="#0B0D0E" />
                  </linearGradient>

                  {/* Soft Light Diffuse Filter */}
                  <filter id="vLightGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" />
                  </filter>
                </defs>

                {/* Backlight Aura */}
                <ellipse cx="120" cy="220" rx="35" ry="180" fill="#E6D3B3" opacity="0.12" filter="url(#vLightGlow)" />

                {/* 1. STEEL BLADE (Kissaki Tip at top, tapering down to Habaki) */}
                {/* Blade Outer Silhouette with slight gentle curve */}
                <path
                  d="M 120 45
                     C 123 58, 127 75, 127 100
                     L 128 360
                     L 112 360
                     L 113 100
                     C 113 75, 117 58, 120 45 Z"
                  fill="url(#vSteelGrad)"
                  stroke="#CAD1D3"
                  strokeWidth="1.2"
                />

                {/* Kissaki Tip Bevel (Yokote line and faceted tip) */}
                <path d="M 113 95 L 127 95" stroke="#717E85" strokeWidth="1" opacity="0.8" />
                <path d="M 120 45 L 120 95" stroke="#F6F8F8" strokeWidth="1.2" opacity="0.9" />

                {/* Shinogi Blade Ridge Line (Spine) */}
                <path d="M 120 95 L 121 360" stroke="#3A464E" strokeWidth="1.6" opacity="0.85" />

                {/* Hamon (Crescent undulating temper line along the cutting edge) */}
                <path
                  d="M 114 95
                     Q 117 125, 115 155
                     T 117 215
                     T 114 275
                     T 117 335
                     L 114 360"
                  stroke="url(#vHamonGrad)"
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                {/* Specular Light Traveling along Polished Steel (Animated via GSAP) */}
                <g ref={specularRef} className="blade-vertical-specular">
                  <ellipse cx="120" cy="180" rx="14" ry="40" fill="#FFFFFF" opacity="0.75" filter="url(#vLightGlow)" />
                  <line x1="114" y1="140" x2="126" y2="220" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.9" strokeLinecap="round" />
                </g>

                {/* 2. HABAKI (Sword Collar) */}
                <rect x="110" y="360" width="20" height="22" rx="2" fill="url(#vBronzeGrad)" stroke="#2F2317" strokeWidth="1.2" />
                <line x1="110" y1="371" x2="130" y2="371" stroke="#F5E4B8" strokeWidth="1" opacity="0.75" />

                {/* 3. TSUBA (Hand Guard) */}
                {/* Iron Mokko/Oval plate with bronze rim */}
                <ellipse cx="120" cy="385" rx="36" ry="12" fill="#0C0E10" stroke="url(#vBronzeGrad)" strokeWidth="3" />
                <ellipse cx="120" cy="385" rx="25" ry="8" fill="none" stroke="#2D3336" strokeWidth="1.2" />

                {/* Seppa Spacers */}
                <ellipse cx="120" cy="382" rx="22" ry="5" fill="url(#vBronzeGrad)" opacity="0.9" />
                <ellipse cx="120" cy="388" rx="22" ry="5" fill="url(#vBronzeGrad)" opacity="0.9" />

                {/* 4. TSUKA (Hilt / Handle with Diamond Tsukamaki Wrap) */}
                <rect x="111" y="388" width="18" height="150" rx="4" fill="url(#vHiltGrad)" stroke="#060708" strokeWidth="1.5" />
                {/* Samegawa (Ray Skin Inner Layer) */}
                <rect x="113" y="392" width="14" height="142" rx="2" fill="#E6DDCF" opacity="0.4" />
                {/* Tsukamaki Diamond Wrapping Patterns */}
                {[...Array(8)].map((_, i) => {
                  const y = 398 + i * 17;
                  return (
                    <g key={i} opacity="0.95" fill="none" stroke="#101314" strokeWidth="4.2">
                      <path d={`M 111 ${y - 4} L 129 ${y + 12}`} />
                      <path d={`M 111 ${y + 12} L 129 ${y - 4}`} />
                      {/* Menuki Ornament inside central diamonds */}
                      {i === 3 && (
                        <circle cx="120" cy={y + 4} r="2.8" fill="url(#vBronzeGrad)" stroke="none" />
                      )}
                    </g>
                  );
                })}

                {/* 5. KASHIRA (Pommel Cap at Base of Hilt) */}
                <rect x="110" y="538" width="20" height="15" rx="4" fill="url(#vBronzeGrad)" stroke="#22180F" strokeWidth="1.5" />
                <circle cx="120" cy="545" r="3" fill="#15100B" />

                {/* Museum Stand Horizon Plinth Line */}
                <line x1="20" y1="580" x2="220" y2="580" stroke="#A99577" strokeWidth="1" opacity="0.35" />
                <ellipse cx="120" cy="582" rx="60" ry="8" fill="#040708" opacity="0.45" filter="url(#vLightGlow)" />
              </svg>
            </div>

            {/* Pedestal Engraved Plate */}
            <div className="sword-pedestal-caption">
              <span className="pedestal-kicker">EXHIBIT ORIENTATION</span>
              <strong className="pedestal-title">KATANA IN VERTICAL REST</strong>
              <span className="pedestal-sub">Measured Profile · Hand-Finished Steel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
