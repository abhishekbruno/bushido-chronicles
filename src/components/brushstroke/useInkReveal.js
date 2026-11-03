import { useState, useEffect, useRef } from 'react';

/**
 * useInkReveal
 * -----------------------------------------------------------------------------
 * Lightweight, high-performance IntersectionObserver hook for Japanese sumi-e
 * brushstroke animations.
 *
 * Rules:
 *  - Only paints once when entering viewport (prevents repetitive repainting on normal scroll)
 *  - Immediately reveals without delays if user has `prefers-reduced-motion` enabled
 *  - Auto-disconnects observer upon trigger to conserve CPU/GPU
 */
export default function useInkReveal(threshold = 0.15) {
  const domRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // 1. Accessibility: Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    const node = domRef.current;
    if (!node) return;

    // 2. Single-trigger IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px', // slightly before bottom edge of viewport
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return [domRef, isRevealed];
}

