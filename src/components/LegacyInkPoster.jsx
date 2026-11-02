import React, { useEffect, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

/** Tree-free cinematic engraving in the legacy chapter. */
export default function LegacyInkPoster() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [expanded]);

  return (
    <div className={`legacy-cinematic-poster ${expanded ? 'is-immersive' : ''}`}>
      {expanded && <button className="legacy-poster-scrim" aria-label="Close immersive artwork" onClick={() => setExpanded(false)} />}
      <div className="legacy-poster-inner">
        <header className="legacy-poster-overline">
          <span>THE IMPERIAL ARCHIVE</span>
          <button type="button" className="legacy-poster-expand interactive" onClick={() => setExpanded(v => !v)} aria-label={expanded ? 'Exit immersive artwork' : 'Expand artwork'}>
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </header>
        <div className="legacy-poster-art" aria-label="Japanese sun, ancient torii and misty mountain ridges, without trees" role="img">
          <svg viewBox="0 0 720 920" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="legacyPaperSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F0E7D6" />
                <stop offset="1" stopColor="#BFB6A5" />
              </linearGradient>
              <linearGradient id="legacyRedSun" x1="0" x2="0.9" y1="0" y2="1">
                <stop offset="0" stopColor="#CE3139" />
                <stop offset="1" stopColor="#8F1824" />
              </linearGradient>
            </defs>
            <rect width="720" height="920" fill="url(#legacyPaperSky)" />
            <g className="legacy-poster-halo"><circle cx="402" cy="347" r="232" fill="#C22A33" opacity=".09" /><circle cx="402" cy="347" r="206" fill="url(#legacyRedSun)" /><circle cx="402" cy="347" r="210" stroke="#7B1721" strokeWidth="3" strokeDasharray="63 7 28 8" fill="none" opacity=".55" /></g>
            <path d="M0 523C101 469 182 452 266 470C362 476 421 447 525 480C611 497 656 470 720 454V920H0Z" fill="#646459" opacity=".48" />
            <path d="M0 614C133 560 245 586 344 552S576 580 720 542V920H0Z" fill="#48473D" opacity=".65" />
            <path d="M0 739C144 687 275 716 381 673C471 647 586 688 720 654V920H0Z" fill="#272924" />
            <g fill="#171A19" transform="translate(146 455)">
              <path d="M38 0Q181 39 337-9L357 18Q180 73 13 27Z" />
              <path d="M70 55H302V76H70Z" />
              <path d="M106 72H132V286H106ZM246 72H271V286H246Z" />
              <path d="M116 127H257V143H116Z" />
            </g>
            <g className="legacy-poster-mist" fill="none" stroke="#E7DBCA" strokeLinecap="round" opacity=".56">
              <path d="M43 773Q178 744 331 766T685 743" strokeWidth="15" />
              <path d="M17 811Q182 797 342 815T722 791" strokeWidth="8" />
            </g>
            <g fill="none" stroke="#222621" strokeWidth="3" opacity=".55" strokeLinecap="round"><path d="M93 256q15-12 30 0q16-11 30 0M560 243q11-8 23 0q10-8 19 0" /></g>
          </svg>
          <span className="legacy-poster-vertical" lang="ja">武士道の精神</span>
        </div>
        <footer className="legacy-poster-caption">
          <span>01 / A STUDY IN RESTRAINT</span>
          <strong>WHERE SILENCE HOLDS STRENGTH.</strong>
          <span className="legacy-poster-caption-jp" lang="ja">静けさの中に力あり</span>
        </footer>
      </div>
    </div>
  );
}
