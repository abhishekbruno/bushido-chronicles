import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTransitions() {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const createdElements = [];

    const ctx = gsap.context(() => {
      // 1. Reveal CTA heading with dramatic cinematic staggered wipe
      const headings = document.querySelectorAll('.cta-headline');

      headings.forEach((heading) => {
        gsap.fromTo(
          heading,
          {
            y: 60,
            opacity: 0,
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          },
          {
            y: 0,
            opacity: 1,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 1.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // 2. Manuscript Sections Horizontal Brushstroke Seams
      const sections = ['#legacy', '#bushido', '#warriors', '#blade', '#spirit', '#monument', '#masamune', '#cta'];

      sections.forEach((secSelector) => {
        const secEl = document.querySelector(secSelector);
        if (!secEl) return;

        // Check if seam already exists
        if (!secEl.querySelector('.manuscript-scroll-seam')) {
          const seam = document.createElement('div');
          seam.className = 'manuscript-scroll-seam';
          seam.innerHTML = `
            <div class="seam-crease-shadow"></div>
            <div class="seam-brush-stroke"></div>
            <div class="seam-kanji-seal">巻物</div>
          `;
          secEl.prepend(seam);
          createdElements.push(seam);

          const brushStroke = seam.querySelector('.seam-brush-stroke');
          const kanjiSeal = seam.querySelector('.seam-kanji-seal');

          gsap.fromTo(
            brushStroke,
            { scaleX: 0, opacity: 0 },
            {
              scaleX: 1,
              opacity: 0.8,
              duration: 1.4,
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: secEl,
                start: 'top 92%',
                toggleActions: 'play none none none',
              },
            }
          );

          gsap.fromTo(
            kanjiSeal,
            { scale: 0, rotation: -45, opacity: 0 },
            {
              scale: 1,
              rotation: 0,
              opacity: 0.9,
              duration: 0.8,
              ease: 'back.out(1.7)',
              delay: 0.3,
              scrollTrigger: {
                trigger: secEl,
                start: 'top 92%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });

      // 3. Floating Kanji Background Watermark Parallax Drifts
      const watermarks = [
        { selector: '#legacy', kanji: '武士', side: 'right' },
        { selector: '#warriors', kanji: '豪傑', side: 'left' },
        { selector: '#blade', kanji: '名刀', side: 'right' },
        { selector: '#spirit', kanji: '神道', side: 'left' },
      ];

      watermarks.forEach(({ selector, kanji, side }) => {
        const sec = document.querySelector(selector);
        if (!sec || sec.querySelector('.manuscript-kanji-watermark')) return;

        const wm = document.createElement('div');
        wm.className = `manuscript-kanji-watermark watermark-${side}`;
        wm.textContent = kanji;
        sec.appendChild(wm);
        createdElements.push(wm);

        gsap.to(wm, {
          y: -120,
          ease: 'none',
          scrollTrigger: {
            trigger: sec,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      createdElements.forEach((el) => el.remove());
    };
  }, []);

  return <div ref={containerRef} className="scroll-transitions-mount" aria-hidden="true" />;
}
