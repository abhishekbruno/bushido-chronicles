// Local elapsed time never includes hidden/offscreen time. Preserve phase on resume.
export const clampDelta = (dt) => Number.isFinite(dt) ? Math.max(0, Math.min(dt, 0.05)) : 0;
export const damp = (value, target, rate, dt) => value + (target - value) * -Math.expm1(-rate * dt);

export function createMotionClock() {
  let previous = null;
  let time = 0;
  return {
    get time() { return time; },
    pause() { previous = null; },
    tick(now) {
      const dt = previous === null ? 0 : clampDelta((now - previous) / 1000);
      previous = previous === null ? now : Math.max(previous, now);
      time += dt;
      return { dt, time };
    },
  };
}

// One RAF owner per artwork, no background polling and no React frame updates.
// A zero-delta render leaves a complete illustration under reduced motion.
export function createArtworkLoop(element, render) {
  const clock = createMotionClock();
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let disposed = false;
  let frame = null;
  const tick = (now) => {
    frame = null;
    if (disposed || !visible || document.hidden || media.matches) return;
    render({ ...clock.tick(now), reducedMotion: false });
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    clock.pause();
    if (disposed) return;
    if (media.matches) render({ dt: 0, time: clock.time, reducedMotion: true });
    else if (visible && !document.hidden) frame = requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }, { threshold: 0 });
  observer.observe(element);
  const resizeObserver = new ResizeObserver(() => {
    if (!disposed && (visible || media.matches)) {
      render({ dt: 0, time: clock.time, reducedMotion: media.matches });
    }
  });
  resizeObserver.observe(element);
  document.addEventListener('visibilitychange', sync);
  media.addEventListener('change', sync);
  // Paint before observer delivery, without advancing time.
  render({ dt: 0, time: 0, reducedMotion: media.matches });
  return () => {
    disposed = true;
    if (frame !== null) cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener('visibilitychange', sync);
    media.removeEventListener('change', sync);
  };
}
