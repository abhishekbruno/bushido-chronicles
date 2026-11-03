import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { InkBrushBanner, CrimsonBrushAccent } from './brushstroke';

/* Original hand-built vector artwork. Each scenic element stays inside its
   own aspect-ratio stage, so none of it can cover the editorial copy. */
function Reeds() {
  const reeds = Array.from({ length: 64 }, (_, i) => {
    const rand = (n) => { const v = Math.sin((i + 5) * n) * 43758.5453123; return v - Math.floor(v); };
    const x = 8 + i * 10.9;
    const length = 24 + rand(33.3) * 68;
    const lean = (rand(7.7) - .5) * 46;
    const width = 1.15 + rand(15.5) * 2.35;
    const tone = i % 7 === 0 ? '#806f5d' : i % 3 === 0 ? '#47443b' : '#252520';
    return { x, length, lean, width, tone, delay: `${(rand(19.7) * -9).toFixed(2)}s`, duration: `${(5 + rand(29.1) * 3.5).toFixed(1)}s` };
  });
  return (
    <g className="bc-reed-field" aria-hidden="true">
      {reeds.map((reed, idx) => (
        <g key={idx} className="bc-reed-stem" style={{ '--reed-delay': reed.delay, '--reed-duration': reed.duration, transformOrigin: `${reed.x}px 710px` }}>
          <path d={`M ${reed.x} 719 Q ${reed.x + reed.lean * .12} ${719 - reed.length * .52} ${reed.x + reed.lean} ${719 - reed.length}`} fill="none" stroke={reed.tone} strokeWidth={reed.width} strokeLinecap="round" />
          {idx % 5 === 0 && <path d={`M ${reed.x + reed.lean} ${719 - reed.length} q -9 -10 -3 -23 q 9 11 3 23 Z`} fill="#a4937b" opacity=".7" />}
        </g>
      ))}
    </g>
  );
}

function RoninArtwork() {
  return (
    <svg className="bc-ronin-art" viewBox="0 0 700 750" role="img" aria-label="An original ink-painted rōnin in traditional robes beneath a weathered crimson sun, standing among quiet Japanese wild grasses">
      <defs>
        <radialGradient id="bc-sun-grad" cx="44%" cy="40%" r="67%"><stop stopColor="#d94c48"/><stop offset=".72" stopColor="#b92530"/><stop offset="1" stopColor="#8f1824"/></radialGradient>
        <linearGradient id="bc-cloth-grad" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#292b28"/><stop offset=".45" stopColor="#111514"/><stop offset="1" stopColor="#050706"/></linearGradient>
        <linearGradient id="bc-hakama-grad" x1="0" y1="0" x2="1" y2=".7"><stop stopColor="#323630"/><stop offset=".55" stopColor="#171a17"/><stop offset="1" stopColor="#080a09"/></linearGradient>
        <linearGradient id="bc-mountain-grad" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#998d78" stopOpacity=".28"/><stop offset="1" stopColor="#5f5b50" stopOpacity=".1"/></linearGradient>
        <filter id="bc-paper-edge"><feTurbulence baseFrequency="0.014" numOctaves="2" seed="9" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="4"/></filter>
      </defs>
      <g className="bc-sun-layer">
        <circle cx="424" cy="260" r="182" fill="url(#bc-sun-grad)" opacity=".96" filter="url(#bc-paper-edge)"/>
        <circle cx="424" cy="260" r="180" fill="none" stroke="#8c2127" strokeWidth="2.8" strokeDasharray="91 13 60 17" opacity=".55" />
        <g fill="none" stroke="#f5c2ab" strokeWidth="2" opacity=".17"><path d="M320 200H505M354 227H550M303 278H511M376 321H541"/></g>
      </g>
      <path d="M0 529 Q95 505 150 491 L239 444 L305 488 L371 473 L470 511 L546 473 L700 519 V740H0Z" fill="url(#bc-mountain-grad)" />
      <path d="M0 604 Q125 570 222 586 T456 578 Q555 570 700 601 V742H0Z" fill="#918675" opacity=".2" />
      <g className="bc-mist-layer" fill="none" stroke="#f4ecd9" strokeLinecap="round"><path d="M27 568 Q175 542 329 565 T678 552" strokeWidth="23" opacity=".65"/><path d="M45 608 Q213 577 349 606 T678 596" strokeWidth="13" opacity=".7"/></g>
      <ellipse cx="410" cy="689" rx="155" ry="17" fill="#211f1b" opacity=".18" />
      {/* Sword is attached at the waist, rendered behind the leading hand and cloth. */}
      <g className="bc-ronin-sword">
        <path d="M392 448 Q314 458 191 499 Q181 504 170 503" stroke="#131716" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d="M390 449 Q300 462 182 499" stroke="#6a6155" strokeWidth="2.5" fill="none" opacity=".7" />
        <ellipse cx="382" cy="447" rx="7" ry="16" fill="#887963" transform="rotate(75 382 447)" />
        <path d="M389 441 L454 430" stroke="#151919" strokeWidth="12" strokeLinecap="round" />
        <path d="M398 439 L445 431 M404 444 L452 435" stroke="#a08b6b" strokeWidth="1.4" strokeDasharray="5 6" />
      </g>
      {/* Stable body with independent garment-edge groups (no artificial torso bounce). */}
      <g className="bc-ronin-body">
        {/* Rear hakama leg */}
        <path d="M389 513 C383 569 363 633 341 688 L368 697 Q407 631 424 568 L435 686 Q453 701 475 691 L473 526Z" fill="#0d100e" stroke="#0a0c0a" strokeWidth="4" />
        <path d="M376 651Q362 676 345 684L334 702Q353 707 376 696L388 678Z" fill="#171a16" />
        <path d="M454 663L470 678L488 695Q476 709 448 703L439 685Z" fill="#171a16" />
        {/* Robe silhouette, layered with geometric cloth pleats and shaded seams */}
        <path d="M361 371 Q386 348 417 361 Q454 360 478 396 L489 477 Q482 514 503 570 L477 658 Q443 671 412 652 Q389 670 341 651 L349 544 Q351 501 339 470Z" fill="url(#bc-cloth-grad)" stroke="#080a08" strokeWidth="5" />
        <path d="M369 403 Q381 452 371 509L355 626 Q377 643 396 637 L410 542 L404 421Z" fill="#272b27" opacity=".8" />
        <path d="M445 416 Q464 465 459 525L480 634Q460 645 446 638L425 534Z" fill="#080c0a" />
        <path d="M388 384 L429 438 L413 471 L376 412Z" fill="#404039" stroke="#222720" strokeWidth="2" />
        <path d="M431 385 L405 437 L429 471 L452 417Z" fill="#282d28" stroke="#111612" strokeWidth="2" />
        <path d="M367 460Q419 480 466 459" stroke="#887962" strokeWidth="12" fill="none" opacity=".92" />
        <path d="M367 460Q420 477 463 458" stroke="#0d0f0d" strokeWidth="5" fill="none" />
        <path d="M374 493L358 626M397 503L388 648M423 509L429 648M455 493L467 629" stroke="#b3aa8d" strokeWidth="2" opacity=".25" fill="none" />
        {/* Draped left sleeve and hand at the sash */}
        <path d="M360 384 Q334 389 321 425 Q306 464 326 496 L356 497L375 445Z" fill="#171c19" stroke="#343932" strokeWidth="3" />
        <path d="M325 478Q340 487 356 485" stroke="#8c8a78" strokeWidth="2" fill="none" opacity=".5" />
        <path d="M343 483Q352 479 362 482L368 491Q357 503 345 497Z" fill="#74665a" />
        {/* Right arm */}
        <path d="M456 388 Q494 394 500 436 L488 487 Q479 494 464 488 L459 454Z" fill="#191e1b" stroke="#35392f" strokeWidth="3" />
        <path d="M471 476 Q481 488 487 487 Q488 500 477 507 Q466 505 464 494Z" fill="#877765" />
        {/* cloth texture strokes */}
        <path d="M375 403Q376 431 382 452M462 403Q473 431 472 453M352 527Q358 551 354 576" fill="none" stroke="#9d9884" strokeWidth="2.2" opacity=".24" />
      </g>
      {/* Neck / head connected under the straw hat */}
      <path d="M408 364L410 338L434 333L441 374Q426 383 408 364Z" fill="#4b4135" />
      <path d="M402 291 Q405 270 426 268 Q448 272 450 304 L448 339 Q437 352 421 346 Q402 332 402 291Z" fill="#6a5546" stroke="#211b18" strokeWidth="3" />
      <path d="M443 313Q442 331 429 340L449 338L455 320Z" fill="#2b2721" />
      <path d="M416 311Q424 315 433 312" stroke="#1d1b17" fill="none" strokeWidth="2" opacity=".8" />
      {/* Sugegasa / straw travel hat, radial fiber strokes */}
      <g className="bc-ronin-hat">
        <path d="M329 291 Q392 211 426 205 Q461 215 530 286 Q444 303 329 291Z" fill="#151816" stroke="#3c332b" strokeWidth="5" />
        <path d="M349 286 Q404 239 425 218 Q461 240 506 282" fill="none" stroke="#98866c" strokeWidth="3.5" opacity=".72" />
        <path d="M368 283L424 215M395 287L425 213M426 289V215M459 289L426 217M487 284L426 216" stroke="#b29b77" strokeWidth="2" opacity=".55" />
        <path d="M330 290 Q433 312 528 286" stroke="#100f0e" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M411 295Q401 315 408 351M443 297Q449 322 441 350" stroke="#6a5843" fill="none" strokeWidth="2.5" />
      </g>
      <g className="bc-robe-loose" fill="#212521"><path d="M349 559 Q332 610 310 648 Q342 637 365 610Z"/><path d="M482 575Q504 612 507 653Q483 639 473 616Z"/></g>
      <Reeds />
      <path d="M0 711 Q156 703 253 716 T475 713 T700 714V750H0Z" fill="#262823" opacity=".92" />
      <path d="M0 712Q153 707 286 717T700 714" stroke="#8e826b" strokeWidth="2" fill="none" opacity=".45" />
    </svg>
  );
}

export default function FinalLegacyScene({ onExploreLegacy }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVisible(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: .16 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div className={`bc-legacy ${visible ? 'bc-visible' : ''}`} ref={sectionRef}>
      <div className="bc-legacy-inner">
        <div className="bc-legacy-copy">
          <div className="bc-kicker">
            <span className="bc-kicker-line" /> 終章 / THE FINAL CHAPTER{' '}
            <CrimsonBrushAccent variant="badge" className="bc-kicker-index">
              08 — 08
            </CrimsonBrushAccent>
          </div>
          <p className="bc-legacy-ideogram" lang="ja">色褪せぬ<br/>武士の魂</p>
          <h2 className="bc-legacy-title">A LEGACY THAT<br/>NEVER FADES<span>.</span></h2>
          <p className="bc-legacy-description">Through centuries of change, the Samurai spirit endures — a legacy of courage, discipline, and honor, carried across generations.</p>
          <div className="bc-legacy-actions">
            <button className="bc-btn bc-btn-primary" type="button" onClick={onExploreLegacy}>EXPLORE THE ARCHIVES <ArrowUpRight size={16} aria-hidden="true"/></button>
            <a href="#hero" className="bc-btn bc-btn-outline">RETURN TO THE BEGINNING <ArrowRight size={16} aria-hidden="true"/></a>
          </div>
          
          {/* TYPE A: Black Ink Brushstroke Archival Signature Banner */}
          <InkBrushBanner
            kicker="BUSHIDO CODE · 武士道"
            title="THE WAY OF THE WARRIOR"
            subtext="勇気 · 誠実 · 名誉 — Courage · Integrity · Honor"
            sealText="武"
            className="bc-signature-brush-banner"
          />
        </div>
        <div className="bc-legacy-visual"><RoninArtwork/><div className="bc-art-caption"><span>孤高の浪人 — THE LAST RŌNIN</span><span>ILLUSTRATED IN INK & SILENCE</span></div></div>
      </div>
      <div className="bc-legacy-endline" aria-hidden="true"><span>武士道</span><i/><span>THE END IS ANOTHER BEGINNING</span></div>
    </div>
  );
}
