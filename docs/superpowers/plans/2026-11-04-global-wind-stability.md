# Global wind stability implementation plan

> Use superpowers:executing-plans for inline execution.

**Goal:** Stabilize every live artwork system without changing the artwork or editorial design.
**Architecture:** Shared pause-safe animation lifecycle and bounded monotonic clocks; continuous anchored cloth sampling; time-based particle physics; CSS ambient lifecycle scoped to sections.
**Tech Stack:** React, Canvas 2D, CSS, GSAP, Vite, Node tests, Chromium browser checks.
**Spec:** User attachment `C:/Users/zone/.codex/attachments/3ddb6063-8b72-4a73-b10c-8fa234ee399b/Pasted text.txt`.

## Constraints
Preserve existing uncommitted work, all artwork, content, layout, and parchment palette. No per-frame React updates. Honor reduced motion and offscreen suspension. No deployment or unrelated refactoring.

## Review focus
Repeated gust triggers; first frame after hidden/offscreen periods; alpha continuity at cloth boundaries; live reduced-motion toggles; resize and mobile density.

## Tasks
- [ ] 1. Add failing regression tests for time progression, suspension, gust retrigger continuity and cloth root anchoring. Implement `createMotionClock`, `damp`, `createArtworkLoop`, and `drawWindCloth` in focused utilities. Verify with `node --test tests/motion.test.mjs`.
- [ ] 2. Migrate Honor and all four warrior portraits to shared lifecycle, continuous cloth, smoothed global gusts and fixed body anchors. Migrate Ronin without phase resets or independently translated overlapping cape cutouts. Keep existing PNG assets.
- [ ] 3. Convert particle integrations, tree/chime clocks, and pointer interpolation to elapsed seconds. Suspend CSS ambient animations offscreen and when hidden; preserve phases. Audit inactive components separately and remove per-frame React animation in Zen wallpaper.
- [ ] 4. Run production build and real browser checks at desktop/tablet/mobile widths: all sections, four dossiers, hover, repeated scroll, gust retriggers, resizing, reduced motion, stall recovery and errors. Capture review images and document verified scope and limitations in `docs/WIND_STABILITY_AUDIT.md`.

## Execution notes
Apply changes in the current checkout to retain the user’s substantial uncommitted artwork. Do not stage or commit unrelated work. Existing warrior browser tests target an obsolete SVG renderer; update their assertions to exercise current Canvas behavior. Native implementation is authorized by the request to apply fixes; no additional design approval is needed for these bug fixes.
