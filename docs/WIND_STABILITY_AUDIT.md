# Global wind animation stability audit — 4 November 2026

## Outcome and boundaries
Applied to the current working tree without replacing PNGs, changing content, or committing the user’s pre-existing work. Art remains parchment/red/black/ivory. The bronze monument, including its horse, mane, tail, rider and sculpted cape, remains rigid; its surroundings supply motion.

## Inventory and findings

| Live system | Verified cause / audit finding | Treatment |
| --- | --- | --- |
| Shared wind | Retriggers rewound gust age, abruptly collapsed force; negative/large direct deltas could reverse/jump time; RAF not cancelled on stop | Bounded monotonic updates, exponential force smoothing, active-envelope reinforcement, hidden-tab cancellation and HMR cleanup |
| Honor Samurai | Displaced independent strips, overlapping alpha, high-frequency tip terms, moving body/contact anchor, pointer-driven React updates | Continuous shared-edge cloth shear, entire source layer retained, fixed root/body, slower harmonics, damped ref-based tilt, non-restarting blade glint with timer cleanup |
| Miyamoto Musashi | Loose robe strips and body bob were independently animated | Anchored continuous cloth, distinct existing robe parameters, stationary armor/weapons/feet, smooth sun and small particle pool |
| Oda Nobunaga | Same strip renderer; heavier cloak profile | Retained heavy profile with slower restrained waves; same seam and lifecycle corrections |
| Date Masamune | Same strip renderer; thin torn cape edges | Lower-frequency deformation with shared boundaries; crescent, weapons and body stay rigid |
| Sanada Yukimura | Same strip renderer; torn garment and rigid spear | Shared-edge deformation; spear, antlers and stance fixed |
| Rōnin / final legacy | Phase reset on re-entry; frame-based particles; independent cape cutouts translated away from roots; scaling body detached hair/tassels; bird CSS transform replaced SVG placement | Persistent local time, one original full-cape layer with pinned deformation, rotational hair/tassels/grass, fixed body, seconds-based dust, nested bird placement and flight transforms; mobile scene gets enough height |
| Sakura | Particle positions, rotation, opacity and settling were frame-based; particles ignored reduced motion; ambient phases used a continuously advancing global clock | Seconds-based drift/settling, paused local clock, static reduced-motion illustration, restrained existing branch springs, cleanup and resize repaint |
| Monument garden | Frame-based petals; continued RAF polling offscreen; statue hover scaling moved its contact point; hard peripheral image joins | Time-based smaller mobile pool, pause-safe lifecycle, stationary statue, peripheral masks on castle/tree integration |
| Hero | Frame-based particle movement and pointer interpolation; GSAP entrance and CSS parallax wrote the same transforms | Seconds-based updates; entrance moved to a child; CSS retains ownership of outer parallax |
| Legacy ink poster / wind chime | Frame-based pointer smoothing; offscreen RAF polling; abrupt gust threshold | Time-based damping and local-clock lifecycle, smooth gust response, complete disposal |
| CSS birds, reeds, sun halos, mist and decorative ink across main sections | Offscreen CSS loops continued | Section visibility/hidden-tab play-state suspension preserves CSS phase; site-wide reduced-motion duration fallback |
| Spirit landscape, Honor chapters, Bushido, blade and manuscript panels | Existing mostly SVG/CSS/GSAP artwork; no additional PNG deformation engines | Audited imports, transforms, keyframes and reveal paths. Existing artwork/content preserved; shared CSS lifecycle applies. Text-only entrance reversals remain intentional |

## Retained components not currently mounted by App
`ZenRestraintWallpaper`: removed per-frame React state and 16 Hz SVG clock; continuous DOM/CSS-variable updates, time-based particles and paused lifecycle. `JapaneseMapleTree`: bounded restrained branch response, continuous trunk return, paused lifecycle. `InkParticlesCanvas`: time-based integration and lifecycle. Each was mounted, toggled through reduced motion, and unmounted in a browser fixture without page errors. Old `HeroSamurai` is an unused predecessor, not the active hero. Empty DateMasamune section/component/CSS files were pre-existing working-tree changes and were left untouched.

## Validation
- `node --test tests/motion.test.mjs`: five regressions covering gust continuity/repeated triggers, negative/stalled deltas, phase preservation, refresh-rate independent damping and anchored cloth.
- `tests/wind.browser.mjs`: Edge/Chromium desktop 1440×1000, tablet 768×1024 and mobile 390×844; hero, legacy, warriors, Honor, Spirit, monument and Rōnin; normal/stronger wind snapshots, live reduced-motion changes, synthetic visibility events, offscreen suspension, rapid scroll passes, resize, 4× CPU throttling and a 500 ms main-thread stall.
- Continuous cloth alpha test: 120 phases of a semitransparent source; interior alpha remained exactly 128, with no gaps or doubled-alpha columns.
- `tests/warrior-action.browser.mjs`: each portrait changes over time while over 99.8% of fully opaque body pixels remain stable in the sampled run; all four canvases freeze under reduced motion.
- `tests/warriors.browser.mjs`: all four dossiers at 1920, 1440, 768 and 390 px widths; Enter/Space and mobile touch.
- `tests/wind-birds.browser.mjs`: five separate bird placements remain positioned in normal and reduced-motion modes; failed before the nesting correction and passed afterward.
- `npm run build`: production build succeeds. Existing large-bundle advisory remains (~924 KB JS before gzip); no new runtime dependency was added.
- Whole-worktree `git diff --check` reports pre-existing trailing blank lines in `InkBrushTextPanel.jsx` and `InkManuscriptPanel.jsx`; this pass leaves those unrelated edits intact.

Browser scripts accept `PLAYWRIGHT_MODULE`, `BROWSER_CHANNEL`, and `WIND_TEST_URL` / `WARRIOR_TEST_URL`. Local runs used the bundled Playwright runtime and `http://localhost:5175`. `WIND_INTEGRATION_ONLY=1` runs only the stress/integration portion. Visual captures and the final machine-readable report are under `.tmp-warriors/wind/` (ignored local artifacts).

## Review and limitations
Independent read-only review found the repeated-gust suppression and bird-transform collision. Both have failing-then-passing regression coverage and were corrected. No blocking RAF cleanup, StrictMode, clock, or strip-geometry defect was reported.

Minor deferred cleanup: obsolete animation bookkeeping fields/visibility observers remain in several migrated components; the lightweight shared wind clock still ticks with reduced motion while artwork loops stay stopped. These do not drive per-frame React renders.

This is Chromium validation at responsive viewport sizes, not physical iOS/Android or Safari/Firefox testing. Hidden-tab behavior was exercised with visibility events; long-frame recovery with a real main-thread stall. Performance timings are local samples, not a guarantee on every device. Peripheral masks do not repaint texture or cutout boundaries baked inside the original statue artwork. No artwork was regenerated or replaced.
