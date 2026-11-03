import { useEffect } from 'react';

// CSS keeps its own timeline; pausing play-state preserves phase on rapid scrolls.
export default function ArtworkMotionLifecycle() {
  useEffect(() => {
    const sections = [...document.querySelectorAll('main section')];
    const visible = new Set();
    const sync = () => sections.forEach(section => {
      section.dataset.motionPaused = String(document.hidden || !visible.has(section));
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      sync();
    });
    sections.forEach(section => observer.observe(section));
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      sections.forEach(section => delete section.dataset.motionPaused);
    };
  }, []);
  return null;
}
