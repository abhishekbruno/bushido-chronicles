# Legendary warriors implementation plan

**Goal:** Implement the supplied detailed brief within the existing four cards.
**Architecture:** Hand-authored SVG portraits, shared equipment primitives, distinct poses; CSS joint motion with IntersectionObserver visibility control. React does not render animation frames.
**Tech stack:** Existing React/Vite; SVG and CSS; browser validation with Playwright.
**Spec:** User attachment, “BUSHIDO CHRONICLES — LEGENDARY WARRIORS REDESIGN”.

- [x] Capture existing gallery and check keyboard dossier access (expected failure).
- [x] Replace icon artwork with WarriorCharacter.jsx: robes and two blades, upright armored commander, crescent kabuto, six-coin spear warrior. Preserve existing data and editorial markup.
- [x] Replace frame state/canvas loop with scoped CSS motion and observer cleanup. Fixed lower legs; torso rotation under 0.6 degrees; rigid weapons share their hand/belt group; reduced motion disables animation.
- [x] Verify seven requested viewport sizes, equipment bounds, mouse/touch/keyboard dossier activation, offscreen pausing, reduced motion, console, and build. Inspect real screenshots.

Design decisions: use a 800×1200 artwork frame with roughly 1000-unit human height; reserve top and left whitespace for existing Japanese text. Anatomy and historical equipment are interpretive, not authenticated portraits. Keep all existing historical prose untouched. No supplied screenshot exists; use the live before capture as baseline.

Reference basis: V&A samurai arms and armour (https://www.vam.ac.uk/articles/samurai-japanese-arms-armour); Met armor component anatomy (https://www.metmuseum.org/art/collection/search/35911); Samurai Museum Berlin kabuto construction and Date crest (https://samuraimuseum.de/en/learn/kabuto/); Kudoyama tourism Sanada six-coin crest (https://www.kudoyama-kanko.jp/download/files/seitijyunrei-eng2020.pdf). Museum examples guide construction, not claims that a specific surviving suit belonged to these men. Sanada antlers are an interpretive traditional motif.

