import React, { useEffect, useRef } from 'react';

export default function InkParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

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

    // Particle pool: concentrated drifting rightward from center-left (behind samurai)
    const particleCount = Math.min(Math.floor((width * height) / 16000), 85);
    const particles = [];

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    for (let i = 0; i < particleCount; i++) {
      const isRed = Math.random() < 0.28;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.85,
        size: isRed ? Math.random() * 3.2 + 1.2 : Math.random() * 4.2 + 0.8,
        speedX: Math.random() * 0.9 + 0.3, // Drifting horizontally rightward
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        color: isRed ? '#D90416' : '#0A0A0A',
        shape: Math.random() > 0.45 ? 'circle' : 'flake',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
      });
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        // Mouse deflection
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 3.5;
          p.y += (dy / dist) * force * 3.5;
        }

        // Screen wrap
        if (p.x > width + 20) {
          p.x = -15;
          p.y = Math.random() * height * 0.85;
        }
        if (p.y < -20) p.y = height + 10;
        if (p.y > height + 20) p.y = -10;

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
          // Asymmetric brush flake
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.8, p.size * 0.6, p.rotation, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="ink-particles-layer"
      aria-hidden="true"
    />
  );
}

