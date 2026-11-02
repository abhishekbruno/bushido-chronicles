import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SUN_PATH } from '../assets/vectors/vectorPaths';

export default function RisingSun() {
  const sunRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (!sunRef.current) return;
    gsap.fromTo(
      sunRef.current,
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }
    );
  }, []);

  return (
    <div
      ref={sunRef}
      className="scene-layer rising-sun-layer"
      style={{
        transform:
          'translate3d(calc(var(--p-mouse-x, 0) * 18px), calc(var(--p-mouse-y, 0) * 10px - var(--p-scroll-y, 0) * 0.16px), 0)',
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      {/* Atmospheric Crimson Glow behind Sun */}
      <div ref={glowRef} className="sun-atmospheric-halo" />

      {/* Reconstructed Exact Red Sun SVG with Painted Edges and Splatters */}
      <svg
        className="sun-layer-svg"
        viewBox="0 0 1215 1063"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="sunPaintedGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E21D2A" />
            <stop offset="70%" stopColor="#D90416" />
            <stop offset="95%" stopColor="#BA0312" />
            <stop offset="100%" stopColor="#9C020F" />
          </radialGradient>
          <filter id="sunDropGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* The Exact Crimson Sun Vector Path */}
        <path
          d={SUN_PATH}
          fill="url(#sunPaintedGrad)"
          filter="url(#sunDropGlow)"
          className="sun-core-path"
        />

        {/* Floating crimson paint droplets & ink trails to the right */}
        <g className="sun-crimson-splatters" fill="#D90416" opacity="0.95">
          <ellipse cx="780" cy="270" rx="9" ry="6" transform="rotate(-15 780 270)" />
          <ellipse cx="830" cy="285" rx="14" ry="8" transform="rotate(20 830 285)" />
          <ellipse cx="880" cy="295" rx="6" ry="4" />
          <ellipse cx="940" cy="245" rx="4" ry="3" />
          <circle cx="750" cy="260" r="3.5" />
          <circle cx="810" cy="265" r="4.2" />
          <circle cx="855" cy="278" r="2.8" />
          <ellipse cx="715" cy="295" rx="5" ry="3" transform="rotate(10 715 295)" />
        </g>
      </svg>
    </div>
  );
}
