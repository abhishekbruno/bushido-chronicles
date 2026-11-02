import React from 'react';
import KatanaForgingCinematic from './KatanaForgingCinematic';
import AnimatedChapterHeading from './AnimatedChapterHeading';
import JapaneseMapleTree from './JapaneseMapleTree';

export default function SectionBlade() {
  return (
    <section id="blade" className="section-blade">
      {/* Restrained Outer Edge Maple Silhouette */}
      <JapaneseMapleTree variant="blade-edge" />

      <div className="section-container">
        {/* Section Monument Editorial Header */}
        <div className="blade-title-row">
          <div>
            <AnimatedChapterHeading
              chapter="blade"
              sectionLabel="SECTION IV · THE ART OF THE BLADE"
              primaryText="THE ART OF"
              accentText="THE BLADE."
              breakLine={true}
              className="blade-heading"
            />
          </div>
          <p className="blade-intro-desc">
            A katana is not merely manufactured—it is awakened through fire, water, and discipline.
            Scroll downward to witness the master swordsmith guide raw Tamahagane bloom steel through
            hammering, shaping, and water quenching into a razor-honed masterpiece.
          </p>
        </div>
      </div>

      {/* Continuous Scroll-Driven Sword Forging Cinematic & Master Katana Anatomy */}
      <div id="forge" className="forging-cinematic-mount">
        <KatanaForgingCinematic />
      </div>
    </section>
  );
}
