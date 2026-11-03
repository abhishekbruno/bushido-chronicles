import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  ExternalLink,
  Ruler,
  Sword,
  X,
  Sparkles,
} from 'lucide-react';
import HistoricalBladeGeometry from './HistoricalBladeGeometry';
import { historicalBlades } from '../data/historicalBlades';
import { sound } from '../utils/soundEngine';
import { WashiBrushPanel, CrimsonBrushAccent } from './brushstroke';

gsap.registerPlugin(ScrollTrigger);

function navigateIndex(index, count) {
  return (index + count) % count;
}

function MiniBlade({ blade }) {
  return (
    <svg className="blade-collection-mini" viewBox="0 0 176 42" aria-hidden="true">
      <path d="M12 21H43" stroke="#9f896b" strokeWidth="6" strokeLinecap="round" />
      <path d="M13 19H43" stroke="#202725" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M46 11V31" stroke="#b3a087" strokeWidth="3" />
      <path
        d={`M49 17Q105 ${blade.curvatureCm ? 10 : 15} 157 18L165 21L157 24Q105 27 49 25Z`}
        fill="#e4e8e6"
        stroke="#78888d"
        strokeWidth=".8"
      />
      <path d="M49 23Q105 20 160 21" stroke="#a7b7bb" strokeWidth=".9" />
    </svg>
  );
}

export default function HistoricalBladeGallery() {
  const [index, setIndex] = useState(0);
  const [sheathed, setSheathed] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const [fitToFrame, setFitToFrame] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const galleryShellRef = useRef(null);
  const stageRef = useRef(null);
  const narrativeCardRef = useRef(null);
  const indexRef = useRef(index);
  indexRef.current = index;

  const isUserInteracting = useRef(false);
  const userInteractionTimeout = useRef(null);

  const active = historicalBlades[index];

  // 1. Interactive Selection Handler with Audio Feedback
  const selectBlade = (next, isFromScroll = false) => {
    const nextIdx = navigateIndex(next, historicalBlades.length);
    if (nextIdx === indexRef.current) return;

    if (!isFromScroll) {
      sound.playBladeGlint();
      isUserInteracting.current = true;
      if (userInteractionTimeout.current) clearTimeout(userInteractionTimeout.current);
      userInteractionTimeout.current = setTimeout(() => {
        isUserInteracting.current = false;
      }, 1500);
    }

    setIndex(nextIdx);
    setSheathed(false);
    setFitToFrame(false);

    if (stageRef.current) {
      stageRef.current.style.setProperty('--gallery-tilt-x', '0deg');
      stageRef.current.style.setProperty('--gallery-tilt-y', '0deg');
    }
  };

  // 2. Mouse 2.5D Parallax on Stage
  const handlePointerMove = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty('--gallery-tilt-x', `${(-y * 1.5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--gallery-tilt-y', `${(x * 1.8).toFixed(2)}deg`);
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty('--gallery-tilt-x', '0deg');
    event.currentTarget.style.setProperty('--gallery-tilt-y', '0deg');
  };

  // 3. ScrollTrigger-Driven Exhibit Progression (Milestones)
  useEffect(() => {
    const el = galleryShellRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Track scroll across the exhibition container
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 80%',
      onUpdate: (self) => {
        if (isUserInteracting.current) return;
        const progress = self.progress;
        const targetIdx = Math.min(
          historicalBlades.length - 1,
          Math.floor(progress * historicalBlades.length)
        );
        if (targetIdx !== indexRef.current) {
          selectBlade(targetIdx, true);
        }
      },
    });

    return () => {
      st.kill();
      if (userInteractionTimeout.current) clearTimeout(userInteractionTimeout.current);
    };
  }, []);

  // 4. Manuscript Text Unfold Animation on Active Blade Change
  useEffect(() => {
    const card = narrativeCardRef.current;
    if (!card) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      card,
      {
        opacity: 0,
        rotateX: -6,
        y: 20,
        transformOrigin: 'top center',
        filter: 'sepia(0.2) brightness(0.92)',
      },
      {
        opacity: 1,
        rotateX: 0,
        y: 0,
        filter: 'sepia(0) brightness(1)',
        duration: 0.65,
        ease: 'power2.out',
      }
    );

    // Stagger ledger statistics
    const stats = card.querySelectorAll('.museum-specimen-ledger > div');
    if (stats.length) {
      gsap.fromTo(
        stats,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [index]);

  const toggleSaya = () => {
    sound.playWoodenClick();
    setSheathed((val) => !val);
  };

  const toggleGuides = () => {
    sound.playWoodenClick();
    setShowGuides((val) => !val);
  };

  const toggleZoom = () => {
    sound.playBladeGlint();
    setFitToFrame((val) => !val);
  };

  const toggleSources = () => {
    sound.playWoodenClick();
    setShowSources((val) => !val);
  };

  return (
    <div ref={galleryShellRef} className="museum-gallery-shell" id="gallery">
      {/* Top Gallery Header Bar */}
      <div className="museum-gallery-kicker">
        <span>THE COLLECTION / 五振の記録</span>
        <span>HISTORIC STEEL · INTERACTIVE EXHIBIT 01—05</span>
      </div>

      <div className="museum-gallery-layout">
        {/* Left Column: Curated Collection Rail */}
        <div
          className="museum-collection-rail"
          role="group"
          aria-label="Select a historical Japanese blade"
        >
          <div className="museum-rail-label">THE CURATED COLLECTION</div>
          {historicalBlades.map((blade, itemIndex) => (
            <button
              key={blade.id}
              type="button"
              onClick={() => selectBlade(itemIndex)}
              className={`museum-collection-item ${itemIndex === index ? 'is-active' : ''}`}
              aria-pressed={itemIndex === index}
              aria-label={`View ${blade.name} (${blade.category})`}
            >
              <span className="museum-collection-number">{blade.no}</span>
              <span className="museum-collection-item-main">
                <span className="museum-collection-name">{blade.name}</span>
                <span className="museum-collection-type">{blade.category}</span>
                <MiniBlade blade={blade} />
              </span>
              <span className="museum-collection-jp" lang="ja">
                {blade.japanese}
              </span>
            </button>
          ))}
          <p className="museum-rail-footnote">
            Choose a specimen to explore its profile, sori curvature, temper pattern, and archival
            measurement record.
          </p>
        </div>

        {/* Right Column: Main Exhibition Display Stage & Manuscript Ledger */}
        <div className="museum-gallery-display">
          {/* Topline Metadata */}
          <div className="museum-display-topline">
            <span>
              <span className="museum-red-mark" /> OBJECT STUDY · {active.no} / 05
            </span>
            <span>MEASURED PROFILE · INTERPRETIVE MOUNTING</span>
          </div>

          {/* Active Blade Headline & Classification */}
          <div className="museum-display-heading">
            <div>
              <span className="museum-display-category">{active.category}</span>
              <h3 key={`${active.id}-name`} className="museum-display-name">
                {active.name}
              </h3>
              <span className="museum-display-japanese" lang="ja">
                {active.japanese}
              </span>
            </div>
            <span className="museum-display-period">{active.period}</span>
          </div>

          {/* Main 2.5D Interactive Sword Exhibit Stage */}
          <div
            ref={stageRef}
            className="museum-blade-stage"
            key={active.id}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                selectBlade(index + 1);
              }
              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                selectBlade(index - 1);
              }
            }}
            aria-label="Sword illustration. Use left and right arrow keys to browse the collection."
          >
            {/* Atmospheric Stage Floating Light */}
            <div className="museum-blade-stage-light" aria-hidden="true" />

            {/* Transform Group with Mouse Tilt & Zoom Scaling */}
            <div
              className="museum-blade-art-transform"
              style={{
                '--blade-art-zoom': fitToFrame
                  ? Math.min(2.8, 80 / active.lengthCm)
                  : 1,
              }}
            >
              <HistoricalBladeGeometry
                blade={active}
                sheathed={sheathed}
                showGuides={showGuides}
              />
            </div>

            {/* Traditional Sumi Seal Stamp */}
            <div className="museum-blade-stage-seal" aria-hidden="true">
              刀
            </div>

            {/* Calibration & Scale Indicator Bar */}
            <div className="museum-blade-stage-bottom">
              <span>ILLUSTRATED STUDY · NOT A PHOTOGRAPH OR SCAN</span>
              <span>
                {fitToFrame
                  ? 'ENLARGED FOR DETAIL · NOT TO SCALE'
                  : '8.1 SVG UNITS / CM · LENGTH SCALED'}
              </span>
            </div>
          </div>

          {/* Interactive Inspection Toolstrip */}
          <div
            className="museum-gallery-tools"
            role="group"
            aria-label="Blade viewer controls"
          >
            <button
              type="button"
              onClick={toggleSaya}
              aria-pressed={sheathed}
              title={sheathed ? 'Reveal naked polished steel blade' : 'Display sword in lacquered saya scabbard'}
            >
              <Sword size={16} /> {sheathed ? 'REVEAL STEEL' : 'VIEW SAYA'}
            </button>
            <button
              type="button"
              onClick={toggleGuides}
              aria-pressed={showGuides}
              title={showGuides ? 'Hide measurement dimension lines' : 'Display accurate nagasa and sori guidelines'}
            >
              {showGuides ? <EyeOff size={16} /> : <Eye size={16} />}{' '}
              {showGuides ? 'HIDE MEASUREMENTS' : 'SHOW MEASUREMENTS'}
            </button>
            <button
              type="button"
              onClick={toggleZoom}
              aria-pressed={fitToFrame}
              title={fitToFrame ? 'Return to comparative physical scale' : 'Enlarge blade geometry to inspect hamon and kissaki details'}
            >
              <Ruler size={16} /> {fitToFrame ? 'TRUE SCALE' : 'ENLARGE VIEW'}
            </button>
            <button
              type="button"
              onClick={toggleSources}
              aria-expanded={showSources}
              title="Inspect documented museum source records and provenance"
            >
              <BookOpen size={16} />{' '}
              {showSources ? 'CLOSE CURATOR NOTES' : 'CURATOR NOTES'}
            </button>

            {/* Arrow Navigation */}
            <div className="museum-gallery-arrows">
              <button
                type="button"
                aria-label="Previous sword"
                onClick={() => selectBlade(index - 1)}
                title="View previous sword (Arrow Left)"
              >
                <ArrowLeft size={19} />
              </button>
              <button
                type="button"
                aria-label="Next sword"
                onClick={() => selectBlade(index + 1)}
                title="View next sword (Arrow Right)"
              >
                <ArrowRight size={19} />
              </button>
            </div>
          </div>

          {/* Scroll-Triggered Manuscript Narrative Panel (TYPE B: Washi Brush-Frame Panel) */}
          <WashiBrushPanel
            dark
            interactive
            className="museum-gallery-narrative manuscript-text-card"
          >
            {/* Specimen Ledger: Documented Dimensions & Attribution */}
            <div className="museum-specimen-ledger">
              <div>
                <span>RECORDED LENGTH</span>
                <strong>
                  {active.lengthCm.toFixed(1)} <small>cm</small>
                </strong>
                <em>{active.measureLabel}</em>
              </div>
              <div>
                <span>CURVATURE / SORI</span>
                <strong>
                  {active.curvatureCm === null
                    ? 'N/A'
                    : active.curvatureCm.toFixed(1)}{' '}
                  <small>{active.curvatureCm === null ? '' : 'cm'}</small>
                </strong>
                <em>
                  {active.curvatureCm === null
                    ? 'Not supplied by the source'
                    : 'Museum / government record'}
                </em>
              </div>
              <div>
                <span>MAKER / ATTRIBUTION</span>
                <strong className="museum-specimen-maker">{active.maker}</strong>
                <em>{active.period}</em>
              </div>
            </div>

            {/* Historical Narrative and Scholarly Note */}
            <div className="museum-specimen-copy">
              <p>{active.detail}</p>
              <p className="museum-specimen-disclaimer">{active.historicalNote}</p>
            </div>
          </WashiBrushPanel>

          {/* Curator Archival Notes Drawer */}
          {showSources && (
            <div
              className="museum-sources-panel manuscript-text-card washi-paper-panel washi-panel-manuscript"
              role="region"
              aria-label={`Curator notes for ${active.name}`}
            >
              <div className="museum-sources-heading">
                <Ruler size={17} className="text-crimson" />
                <strong>ARCHIVAL EVIDENCE & VERIFIED PROVENANCE</strong>
                <button
                  type="button"
                  aria-label="Close curator notes"
                  onClick={() => setShowSources(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="museum-verified-facts">
                {active.verified.map((fact) => (
                  <span key={fact}>✓ {fact}</span>
                ))}
              </div>

              <p>
                Source measurements are distinguished from interpretive geometry. This
                interactive SVG uses a uniform centimetre-to-SVG conversion (8.1 units/cm) for
                the selected museum length metric (nagasa or cutting edge, as labeled). The
                enlarged view intentionally breaks the visual scale to show kissaki and hamon
                detail. Fittings, colors, temper lines and scabbards are interpretive
                reconstructions, not exact museum scans.
              </p>

              <a
                href={active.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="museum-external-source-link"
              >
                <span>{active.source}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Gallery Footer Bar */}
      <div className="museum-gallery-bottomline">
        <span>名刀五選 — FIVE STUDIES OF JAPANESE STEEL</span>
        <span>CURVED STEEL · HANDWRAPPED HILTS · LACQUERED MOUNTINGS</span>
      </div>
    </div>
  );
}
