import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import FinalLegacyScene from './FinalLegacyScene';

const archiveLinks = [
  ['The Way of the Samurai', '#hero'],
  ['The Samurai Legacy', '#legacy'],
  ['The Code of Bushido', '#bushido'],
  ['Legendary Warriors', '#warriors'],
  ['The Art of the Blade', '#blade'],
  ['The Spirit of Japan', '#spirit'],
  ['The Guardians of History', '#monument'],
  ['A Legacy That Never Fades', '#cta'],
];
const scholarlySources = [
  ['Go Rin No Sho — Miyamoto Musashi', 'https://en.wikipedia.org/wiki/The_Book_of_Five_Rings'],
  ['Hagakure — Yamamoto Tsunetomo', 'https://miscredirect-prod.cc.columbia.edu/ps/japan/hakagure_wilson_version.pdf'],
  ['Bushido: The Soul of Japan — Inazō Nitobe', 'https://www.gutenberg.org/ebooks/12096'],
  ['Tokyo National Museum', 'https://www.tnm.jp/?lang=en'],
  ['Imperial Palace Outer Garden', 'https://www.env.go.jp/garden/kokyogaien/english/statue_of_kusunoki_masashige.html'],
];
export default function SectionCTA() {
  const exploreArchives = () => {
    document.getElementById('legacy')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <section id="cta" className="section-cta bc-closing-section">
      <FinalLegacyScene onExploreLegacy={exploreArchives}/>
      <footer className="bc-footer" aria-label="Bushido Chronicles footer">
        <div className="bc-footer-ornament" aria-hidden="true"><span>終</span><i/></div>
        <div className="bc-footer-grid">
          <div className="bc-footer-brand">
            <div className="bc-footer-brandline"><span className="bc-footer-hanko" aria-hidden="true">武</span><span>BUSHIDO<br/>CHRONICLES</span></div>
            <p className="bc-footer-jp" lang="ja">武士道の記録</p>
            <p>An interactive digital archive exploring the history, philosophy, craftsmanship, and enduring legacy of Japan's Samurai.</p>
            <span className="bc-footer-note">AN INDEPENDENT CULTURAL STORYTELLING PROJECT</span>
          </div>
          <nav className="bc-footer-links" aria-label="Explore the archive">
            <h3>EXPLORE <span>目次</span></h3>
            <ul>{archiveLinks.map(([title, href]) => <li key={href}><a href={href}>{title}</a></li>)}</ul>
          </nav>
          <div className="bc-footer-references">
            <h3>ARCHIVAL REFERENCES <span>資料</span></h3>
            <ul>{scholarlySources.map(([title, href]) => <li key={title}><a href={href} target="_blank" rel="noopener noreferrer">{title}<ArrowUpRight size={13} aria-hidden="true"/></a></li>)}</ul>
            <p>Sources are provided for further reading; interpretive artwork is original and is not a museum artifact.</p>
          </div>
          <div className="bc-footer-return">
            <h3>THE JOURNEY CONTINUES <span>始まりへ</span></h3>
            <a className="bc-footer-top" href="#hero"><span className="bc-footer-top-icon"><ArrowUp size={23} aria-hidden="true"/></span><strong>RETURN TO THE<br/>BEGINNING</strong><small>始まりへ</small></a>
          </div>
        </div>
        <div className="bc-footer-bottom"><span>© {new Date().getFullYear()} BUSHIDO CHRONICLES</span><span>CRAFTED IN THE SPIRIT OF JAPAN</span><span lang="ja">武士道 · THE WAY OF THE WARRIOR</span></div>
      </footer>
    </section>
  );
}
