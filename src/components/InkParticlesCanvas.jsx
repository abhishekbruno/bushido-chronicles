import { createArtworkLoop, damp } from '../utils/motion';
import React, { useEffect, useRef } from 'react';

export default function InkParticlesCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Particle setup
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    const particles = [];

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120,
    };

    for (let i = 0; i < particleCount; i++) {
      const isRed = Math.random() < 0.22;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isRed ? Math.random() * 2.5 + 1.2 : Math.random() * 3.8 + 0.8,
        speedX: (Math.random() - 0.4) * 0.7,
        speedY: -(Math.random() * 0.8 + 0.3),
        opacity: Math.random() * 0.5 + 0.15,
        color: isRed ? '#D90416' : '#0A0A0A',
        shape: Math.random() > 0.4 ? 'circle' : 'flake',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
      });
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });



    const render = ({dt, reducedMotion}) => {
      const frames = dt * 60;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < (reducedMotion ? 0 : particles.length); i++) {
        const p = particles[i];

        // Move particle
        p.x += p.speedX * frames;
        p.y += p.speedY * frames;
        p.rotation += p.rotSpeed * frames;

        // Mouse interaction (gentle wind push)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 3 * frames;
          p.y += (dy / dist) * force * 3 * frames;
        }

        // Screen wrap
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Asymmetric ink flake / brush petal
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.7, p.rotation, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }


    };

    const stop = createArtworkLoop(canvas.parentElement, render);

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="ink-particles-canvas"
      aria-hidden="true"
    />
  );
}

