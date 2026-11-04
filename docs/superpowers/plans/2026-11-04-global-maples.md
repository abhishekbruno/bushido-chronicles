# Persistent maple background implementation plan

Goal: frame the existing site with the supplied transparent artwork, preserving
content geometry, Samurai animations, navigation and attribution.

Implementation decisions: use two fixed side gutters outside the content-safe
column; hide below 1280px. Preserve the source PNG at original resolution. Use
cached transparent mesh layers with shared boundary vertices rather than rotate
the whole PNG or invent replacement artwork. Pin trunk/root geometry; smoothly
taper branch deformation at anatomical pivots. Reuse the existing wind clock via
one subscription for both trees and falling leaves; add no RAF or React frame state.
Reduced motion shows a still tree without falling leaves. Hidden documents pause.

1. Add physics tests for spring stability, attachment weights, capped time and
   particle confinement; run failing tests, then implement `maplePhysics.js`.
2. Copy the original PNG to `public/images/maple/`; add a cached mesh/texture
   renderer and persistent React component. Keep detached source leaves in a
   separate particle atlas. Preserve alpha with premultiplied blending and shared
   mesh edges. Use a static fallback if WebGL is unavailable.
3. Mount once beside App in `src/main.jsx`; scope all CSS to the new background.
   Verify actual content bounds before choosing safe gutter widths.
4. Test production subpath, desktop/mobile, forward/reverse scroll continuity,
   rooted branches, gusts, leaf count, reduced motion, visibility and cleanup.
   Inspect screenshots and run build, existing checks, and independent review.

Review focus: full-width opaque chapter backgrounds, modal stacking, StrictMode
double effects, GPU context loss, image decoding after unmount, transparent edges,
and resize/visibility events must not reset or duplicate the simulation.
