import React, { useEffect, useRef } from 'react';
import { createArtworkLoop, damp } from '../utils/motion';
import { drawWindCloth } from '../utils/cloth';
import { windSystem } from '../utils/windSystem';

export default function WindClothLayer({ src, width, height, root, span, direction, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let dispose;
    let cancelled = false;
    let gust = 0;
    const image = new Image();
    image.onload = () => {
      if (cancelled || !ctx) return;
      dispose = createArtworkLoop(canvas, ({dt, time}) => {
        gust = damp(gust, Math.min(1.4, windSystem.getState().gust), 2, dt);
        ctx.clearRect(0, 0, width, height);
        drawWindCloth(ctx, image, {width, height, root, span, direction, time, gust, amplitude: 7, speed: 1.25});
      });
    };
    image.src = src;
    return () => { cancelled = true; dispose?.(); };
  }, [src, width, height, root, span, direction]);
  return <canvas ref={ref} width={width} height={height} className={className} />;
}
