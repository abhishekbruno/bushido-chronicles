import React, { useEffect, useRef, useState } from 'react';

/**
 * DateMasamuneLivingScene
 * -----------------------------------------------------------------------------
 * Multi-layer 2.5D Living Canvas Scene depicting Date Masamune (The One-Eyed Dragon)
 * at Aoba Castle Ruins, Sendai, Miyagi.
 *
 * Physical & Visual Systems:
 *  1. Shared natural wind controller (ambient right-to-left breeze + organic gusts)
 *  2. Celestial crimson sun with slow breathing radiance (9-11s cycle)
 *  3. Drifting Sendai valley mist and clouds
 *  4. 4 sumi-e silhouette birds gliding along curved flight paths
 *  5. Stationary, rigid bronze equestrian monument & plinth (100% stable)
 *  6. Wind-responsive bronze horse tail (anchored at croup, gentle traveling wave)
 *  7. Wind-flexing top-right sakura canopy (anchored trunk, flexing branches)
 *  8. Fluttering cherry blossom petal particle system (tumbling in 3D wind)
 *  9. Lower foreground sakura sprig with subtle parallax sway
 * 10. Organic washi parchment left-edge blending (zero hard borders)
 * 11. Battery & reduced-motion friendly (IntersectionObserver + prefers-reduced-motion)
 */
export default function DateMasamuneLivingScene() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const isVisibleRef = useRef(true);

  // Asset references
  const assetsRef = useRef({
    landscape: null,
    sun: null,
    clouds: null,
    castle: null,
    pedestal: null,
    statue: null,
    tail: null,
    sakuraTop: null,
    sakuraBottom: null,
  });

  // Falling Petals System
  const petalsRef = useRef([]);

  // Preload all assets
  useEffect(() => {
    const assetSources = {
      landscape: '/images/masamune_monument/masamune_distant_landscape.png',
      sun: '/images/masamune_monument/masamune_sun.png',
      clouds: '/images/masamune_monument/masamune_clouds.png',
      castle: '/images/masamune_monument/masamune_castle_rampart.png',
      pedestal: '/images/masamune_monument/masamune_pedestal.png',
      statue: '/images/masamune_monument/masamune_statue.png',
      tail: '/images/masamune_monument/masamune_tail.png',
      sakuraTop: '/images/masamune_monument/masamune_sakura_top.png',
      sakuraBottom: '/images/masamune_monument/masamune_sakura_bottom.png',
    };

    let loadedCount = 0;
    const totalCount = Object.keys(assetSources).length;

    Object.entries(assetSources).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        assetsRef.current[key] = img;
        loadedCount += 1;
        if (loadedCount === totalCount) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load Masamune asset: ${src}`);
        loadedCount += 1;
        if (loadedCount === totalCount) {
          setImagesLoaded(true);
        }
      };
    });

    // Initialize 14 petals
    const petals = [];
    for (let i = 0; i < 14; i++) {
      petals.push({
        x: 1300 + Math.random() * 700,
        y: Math.random() * 600,
        vx: -1.2 - Math.random() * 1.5,
        vy: 0.8 + Math.random() * 0.9,
        size: 7 + Math.random() * 7,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        tumble: Math.random() * Math.PI * 2,
        tumbleSpeed: 0.03 + Math.random() * 0.05,
        opacity: 0.7 + Math.random() * 0.3,
        pinkHue: Math.random() > 0.5 ? '#FBCFE8' : '#F472B6',
      });
    }
    petalsRef.current = petals;
  }, []);

  // IntersectionObserver to pause loop when scrolled away
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let startTime = performance.now();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = (now) => {
      if (!isVisibleRef.current) {
        animId = requestAnimationFrame(render);
        return;
      }

      const t = prefersReducedMotion ? 0 : now - startTime;
      const sec = t * 0.001;

      // Internal coordinate space: 2048 x 1536
      const W = 2048;
      const H = 1536;

      ctx.clearRect(0, 0, W, H);

      // --- 1. Background Washi Tone ---
      ctx.fillStyle = '#F5E8D3';
      ctx.fillRect(0, 0, W, H);

      // Subtle atmospheric warm sky wash
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, 'rgba(247, 237, 222, 0.95)');
      skyGrad.addColorStop(0.5, 'rgba(245, 232, 211, 0.85)');
      skyGrad.addColorStop(1, 'rgba(235, 220, 195, 0.95)');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // --- Wind Physics Controller ---
      // Prevailing breeze moving right-to-left
      const ambientBreeze = 0.55 + 0.3 * Math.sin(sec * 0.85);
      const slowVariation = 0.2 * Math.sin(sec * 0.32 + 1.4);
      // Smooth periodic gusts
      const gustRaw = Math.sin(sec * 0.2);
      const gust = gustRaw > 0.6 ? Math.pow((gustRaw - 0.6) / 0.4, 2) : 0;
      const currentWind = ambientBreeze + slowVariation + gust * 0.8;

      const isCompact = window.innerWidth <= 960;
      const sceneShiftX = isCompact ? -420 : 0;

      ctx.save();
      if (sceneShiftX !== 0) {
        ctx.translate(sceneShiftX, 0);
      }

      // --- 2. Distant Sendai Landscape ---
      if (assetsRef.current.landscape) {
        ctx.drawImage(assetsRef.current.landscape, 0, 0, W, H);
      }

      // --- 3. Celestial Crimson Sun (with breathing illumination) ---
      if (assetsRef.current.sun) {
        const sunCx = 1380;
        const sunCy = 440;
        const sunRadius = 380;
        const sunBreath = 1.0 + 0.008 * Math.sin(sec * 0.65);

        // Radiant halo behind sun
        const haloRadius = sunRadius * (1.18 + 0.02 * Math.sin(sec * 0.65));
        const haloGrad = ctx.createRadialGradient(sunCx, sunCy, sunRadius * 0.8, sunCx, sunCy, haloRadius);
        haloGrad.addColorStop(0, 'rgba(185, 45, 35, 0.18)');
        haloGrad.addColorStop(0.5, 'rgba(215, 80, 60, 0.08)');
        haloGrad.addColorStop(1, 'rgba(245, 232, 211, 0)');

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(sunCx, sunCy, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw breathing sun disk
        ctx.save();
        ctx.translate(sunCx, sunCy);
        ctx.scale(sunBreath, sunBreath);
        ctx.drawImage(assetsRef.current.sun, -sunCx, -sunCy, W, H);
        ctx.restore();
      }

      // --- 4. Drifting Valley Mist & Clouds ---
      if (assetsRef.current.clouds) {
        const cloudDriftX = Math.sin(sec * 0.35) * 18 - 8;
        ctx.save();
        ctx.translate(cloudDriftX, 0);
        ctx.globalAlpha = 0.88 + 0.08 * Math.sin(sec * 0.5);
        ctx.drawImage(assetsRef.current.clouds, 0, 0, W, H);
        ctx.restore();
      }

      // --- 5. Four Gliding Silhouette Birds ---
      const birds = [
        { startX: 1950, speed: 45, baseY: 220, amp: 22, freq: 0.9, flapFreq: 6.5, scale: 0.8 },
        { startX: 1800, speed: 38, baseY: 275, amp: 16, freq: 1.1, flapFreq: 5.8, scale: 0.65 },
        { startX: 2150, speed: 42, baseY: 175, amp: 26, freq: 0.8, flapFreq: 7.2, scale: 0.75 },
        { startX: 1650, speed: 34, baseY: 310, amp: 14, freq: 1.3, flapFreq: 5.2, scale: 0.55 },
      ];

      birds.forEach((bird, idx) => {
        const flightX = (bird.startX - sec * bird.speed) % (W + 600);
        const curX = flightX < -200 ? flightX + W + 600 : flightX;
        const curY = bird.baseY + Math.sin(sec * bird.freq + idx) * bird.amp;
        const flap = Math.sin(sec * bird.flapFreq + idx * 1.5) * 8;

        ctx.save();
        ctx.translate(curX, curY);
        ctx.scale(bird.scale, bird.scale);
        ctx.fillStyle = '#26221E';

        // Sumi-e style bird path
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Left wing
        ctx.quadraticCurveTo(-14, -12 + flap, -28, -6 + flap);
        ctx.quadraticCurveTo(-15, -2 + flap * 0.5, 0, 0);
        // Right wing
        ctx.quadraticCurveTo(14, -12 + flap, 28, -6 + flap);
        ctx.quadraticCurveTo(15, -2 + flap * 0.5, 0, 0);
        ctx.fill();
        ctx.restore();
      });

      // --- 6. Castle Ramparts, Wall, and Pine Trees ---
      if (assetsRef.current.castle) {
        ctx.drawImage(assetsRef.current.castle, 0, 0, W, H);
      }

      // --- 7. Granite Pedestal ---
      if (assetsRef.current.pedestal) {
        ctx.drawImage(assetsRef.current.pedestal, 0, 0, W, H);
      }

      // --- 8. Living Bronze Horse Tail (Anchored at Croup, Fluid Wave Flutter) ---
      if (assetsRef.current.tail) {
        // Croup attachment coordinate in 2048x1536 space: (1890, 760)
        const pivotX = 1890;
        const pivotY = 760;

        // Tail sway angles: gentle physical elastic response to prevailing wind & gusts
        const tailHarmonic = Math.sin(sec * 1.8) * 0.012 + Math.sin(sec * 3.4) * 0.007;
        const tailGustLift = gust * 0.024;
        const tailAngle = tailHarmonic + tailGustLift + (currentWind - 0.55) * 0.015;

        ctx.save();
        ctx.translate(pivotX, pivotY);
        ctx.rotate(tailAngle);
        ctx.drawImage(assetsRef.current.tail, -pivotX, -pivotY, W, H);
        ctx.restore();
      }

      // --- 9. Stationary Rigid Bronze Equestrian Statue of Date Masamune ---
      // (100% anatomically stable, rigid bronze with golden crescent maedate)
      if (assetsRef.current.statue) {
        ctx.drawImage(assetsRef.current.statue, 0, 0, W, H);
      }

      // --- 10. Sakura Canopy Top (Gentle wind sway, anchored at top right) ---
      if (assetsRef.current.sakuraTop) {
        const anchorX = 2048;
        const anchorY = 40;

        // Branch flexing: mature wood flexes 0.4° to 1.1°
        const branchHarmonic = Math.sin(sec * 1.1) * 0.007 + Math.sin(sec * 2.3) * 0.004;
        const branchGust = gust * 0.012;
        const canopyAngle = branchHarmonic + branchGust;

        ctx.save();
        ctx.translate(anchorX, anchorY);
        ctx.rotate(canopyAngle);
        ctx.drawImage(assetsRef.current.sakuraTop, -anchorX, -anchorY, W, H);
        ctx.restore();
      }

      // --- 11. Falling Sakura Petal Particles ---
      const petals = petalsRef.current;
      petals.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx * currentWind;
          p.y += p.vy + Math.sin(sec * 2.5 + p.x * 0.01) * 0.4;
          p.rotation += p.rotSpeed;
          p.tumble += p.tumbleSpeed;

          // Recycle petals leaving view
          if (p.x < -40 || p.y > H + 40) {
            p.x = 1350 + Math.random() * 700;
            p.y = Math.random() * 250;
            p.vx = -1.2 - Math.random() * 1.5;
            p.vy = 0.8 + Math.random() * 0.9;
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        // 3D tumble scaling
        const tumbleScale = Math.cos(p.tumble);
        ctx.scale(Math.abs(tumbleScale) * 0.7 + 0.3, 1.0);
        ctx.globalAlpha = p.opacity;

        // Draw elegant sakura petal shape
        ctx.fillStyle = p.pinkHue;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.7, p.size * 0.8, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.8, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
        ctx.fill();

        // Delicate inner vein
        ctx.strokeStyle = 'rgba(219, 39, 119, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.6);
        ctx.lineTo(0, p.size * 0.6);
        ctx.stroke();

        ctx.restore();
      });

      // --- 12. Foreground Sakura Sprig (Lower right subtle parallax) ---
      if (assetsRef.current.sakuraBottom) {
        const sprigAnchorX = 2048;
        const sprigAnchorY = 1536;
        const sprigAngle = Math.sin(sec * 0.95) * 0.005 + gust * 0.008;

        ctx.save();
        ctx.translate(sprigAnchorX, sprigAnchorY);
        ctx.rotate(sprigAngle);
        ctx.drawImage(assetsRef.current.sakuraBottom, -sprigAnchorX, -sprigAnchorY, W, H);
        ctx.restore();
      }

      ctx.restore(); // Restore sceneShiftX

      // --- 13. Organic Left Edge Washi Vignette / Inkwash Mask ---
      // Seamlessly blends the scene into the website parchment background (#F5E8D3) on desktop
      if (!isCompact) {
        const edgeGrad = ctx.createLinearGradient(0, 0, 950, 0);
        edgeGrad.addColorStop(0, '#FAF2E5');
        edgeGrad.addColorStop(0.45, 'rgba(250, 242, 229, 0.98)');
        edgeGrad.addColorStop(0.72, 'rgba(250, 242, 229, 0.65)');
        edgeGrad.addColorStop(0.88, 'rgba(250, 242, 229, 0.22)');
        edgeGrad.addColorStop(1, 'rgba(250, 242, 229, 0)');

        ctx.fillStyle = edgeGrad;
        ctx.fillRect(0, 0, 950, H);
      } else {
        // Soft vignette on both borders for mobile/tablet container
        const edgeL = ctx.createLinearGradient(0, 0, 150, 0);
        edgeL.addColorStop(0, '#FAF2E5');
        edgeL.addColorStop(1, 'rgba(250, 242, 229, 0)');
        ctx.fillStyle = edgeL;
        ctx.fillRect(0, 0, 150, H);

        const edgeR = ctx.createLinearGradient(W - 150, 0, W, 0);
        edgeR.addColorStop(0, 'rgba(250, 242, 229, 0)');
        edgeR.addColorStop(1, '#FAF2E5');
        ctx.fillStyle = edgeR;
        ctx.fillRect(W - 150, 0, 150, H);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [imagesLoaded]);

  return (
    <div ref={containerRef} className="masamune-living-scene-container" aria-label="Living painting of Date Masamune monument at Aoba Castle">
      {/* 2048 x 1536 internal resolution */}
      <canvas
        ref={canvasRef}
        width={2048}
        height={1536}
        className="masamune-living-canvas"
      />

      {/* Subtle Washi Texture Overlay for Authentic Traditional Paper Grain */}
      <div className="masamune-washi-overlay" aria-hidden="true" />
    </div>
  );
}
