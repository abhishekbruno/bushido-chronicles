import React from 'react';
import { ArrowDown, ExternalLink } from 'lucide-react';
import MonumentGardenScene from './MonumentGardenScene';
import KokoroMonumentArchive from './KokoroMonumentArchive';

export default function SectionMonument() {
  return (
    <section id="monument" className="bc-monument-section" aria-labelledby="bc-monument-heading">
      <div className="bc-monument-intro">
        <div className="bc-monument-copy">
          <p className="bc-monument-eyebrow">07 / THE GUARDIANS OF HISTORY <span>史跡</span></p>
          <p className="bc-monument-jp" lang="ja">楠木正成</p>
          <h2 id="bc-monument-heading">THE GENERAL OF<br/><em>UNWAVERING</em> LOYALTY.</h2>
          <div className="bc-monument-line" aria-hidden="true"/>
          <p>Within the outer gardens of Tokyo’s Imperial Palace stands a bronze equestrian monument commemorating Kusunoki Masashige, the fourteenth-century warrior remembered for loyalty and military ingenuity.</p>
          <div className="bc-monument-metadata"><span>TOKYO · 皇居外苑</span><span>MONUMENT INSTALLED · 1900</span></div>
          <div className="bc-monument-actions"><a className="bc-monument-action" href="#monument-record">EXPLORE THE ARCHIVE <ArrowDown size={15}/></a><a className="bc-monument-source" href="https://www.env.go.jp/garden/kokyogaien/english/statue_of_kusunoki_masashige.html" target="_blank" rel="noopener noreferrer">GARDEN INFORMATION <ExternalLink size={13}/></a></div>
        </div>
        <div className="bc-monument-art-container"><MonumentGardenScene/><div className="bc-monument-art-caption">An artistic interpretation of the monument and its surrounding garden — not a photograph or an exact sculptural replica.</div></div>
      </div>
      <div id="monument-record" className="bc-monument-archive-mount">
        <div className="bc-monument-archive-title"><span>ARCHIVAL DOCUMENT / 01</span><h3>THE KUSUNOKI RECORD <span>記録</span></h3></div>
        <KokoroMonumentArchive onReturn={() => document.getElementById('legacy')?.scrollIntoView({behavior:'smooth'})}/>
      </div>
    </section>
  );
}
