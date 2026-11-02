import React from 'react';

/**
 * WashiPaperPanel
 * -----------------------------------------------------------------------------
 * Reusable handcrafted Japanese paper container system.
 *
 * Three core variants:
 *  - 'soft' (Variant A): Warm ivory washi, gentle organic corners, minimal grain,
 *                        soft natural paper shadow. For descriptions, quotes, and reading panels.
 *  - 'manuscript' (Variant B): Ancient aged washi, irregular deckled edges, faint fold creases,
 *                              slightly aged corners, and sumi-e corner marks. For historical
 *                              chronicles, Bushido virtues, and forging stories.
 *  - 'ink-frame' (Variant C): Charcoal or museum-ivory exhibit panel, brush-style double
 *                             hairline frame, restrained crimson accents, museum typography.
 *                             For warrior dossiers, katana anatomy, and archival exhibits.
 */
export default function WashiPaperPanel({
  variant = 'soft', // 'soft' | 'manuscript' | 'ink-frame'
  dark = false, // boolean for dark ink washi
  as: Component = 'div',
  className = '',
  style = {},
  hasFold = false, // renders faint diagonal/horizontal fold crease
  cornerMarks = false, // renders 4 delicate sumi-e ink corner brackets
  crimsonAccent = false, // renders vermilion seal / accent bar
  interactive = false, // subtle paper lift on hover
  children,
  ...props
}) {
  const variantClass = `washi-panel-${variant}`;
  const darkClass = dark ? 'washi-dark' : 'washi-light';
  const interactiveClass = interactive ? 'washi-interactive' : '';

  return (
    <Component
      className={`washi-paper-panel ${variantClass} ${darkClass} ${interactiveClass} ${className}`}
      style={style}
      {...props}
    >
      {/* 1. Subtle Paper Texture & Micro-Fiber Overlay (CSS-driven, GPU light) */}
      <div className="washi-texture-fiber" aria-hidden="true" />

      {/* 2. Aged Paper Vignette & Discoloration Edge */}
      <div className="washi-edge-vignette" aria-hidden="true" />

      {/* 3. Optional Ancient Manuscript Fold Crease */}
      {(hasFold || variant === 'manuscript') && (
        <div className="washi-fold-crease" aria-hidden="true" />
      )}

      {/* 4. Optional Sumi-e Double Hairline Frame (Ink-Frame Variant) */}
      {variant === 'ink-frame' && (
        <div className="washi-inner-ink-stroke" aria-hidden="true" />
      )}

      {/* 5. Optional Corner Notches / Ink Brackets */}
      {(cornerMarks || variant === 'manuscript' || variant === 'ink-frame') && (
        <div className="washi-corner-brackets" aria-hidden="true">
          <span className="washi-corner corner-tl" />
          <span className="washi-corner corner-tr" />
          <span className="washi-corner corner-bl" />
          <span className="washi-corner corner-br" />
        </div>
      )}

      {/* 6. Optional Crimson Vermilion Accent Bar */}
      {crimsonAccent && (
        <span className="washi-crimson-bar" aria-hidden="true" />
      )}

      {/* 7. Actual Panel Content */}
      <div className="washi-panel-content">
        {children}
      </div>
    </Component>
  );
}

// Reusable convenience exports
export function ManuscriptCard(props) {
  return <WashiPaperPanel variant="manuscript" cornerMarks hasFold {...props} />;
}

export function InkFrame(props) {
  return <WashiPaperPanel variant="ink-frame" cornerMarks {...props} />;
}

export function SoftParchment(props) {
  return <WashiPaperPanel variant="soft" {...props} />;
}

