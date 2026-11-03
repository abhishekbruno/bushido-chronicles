# Legendary Warriors — implementation and verification

The existing card data, quotes, equipment descriptions, crimson brush badges, and dossier modal are preserved. Artwork is now hand-authored SVG in `src/components/WarriorCharacter.jsx`, using roughly 7.5-head proportions, connected hands and equipment, layered robes/armor, grounded feet, and distinct helmet/hair treatments. These are historically inspired interpretations, not authenticated likenesses.

Animation uses independently timed CSS groups, with hand-held weapons inside the hand group and scabbards inside the torso group. Helmet crests remain rigid. Feet are outside animated groups. IntersectionObserver pauses the rig offscreen and disconnects on unmount. Reduced motion removes all portrait animation. The old requestAnimationFrame loop and per-frame React state updates were removed. Dossier cards now support Enter and Space as well as click/tap.

## Verification

- Production build passed; Vite reports the existing large application chunk warning.
- Browser-tested at 3840×2160, 1920×1080, 1440×900, 1024×768, 768×1024, 390×844, and 375×667.
- All four dossiers opened with correct names and closed at every size (28 checks).
- No horizontal page overflow; all SVG character bounds contained within the artwork viewBox.
- Keyboard Enter/Space and touch tap passed.
- Reduced motion disables the rig; offscreen state pauses animations; feet remain fixed while the torso moves.
- Hover does not scale the portrait, including with reduced motion.
- No page JavaScript exceptions recorded during the browser run.
- Before/after gallery screenshots inspected. No screenshot was included in the user's attachment, so the existing live page was captured as the baseline. Gallery-only captures hide the fixed navigation to prevent offscreen fixed layers contaminating tall element screenshots; application navigation is unchanged.
- Code review found and resolved the legacy hover scale cascade and the spear/card-label mismatch.

Re-run with a running Vite server and Playwright available: `node tests/warriors.browser.mjs`. Optional environment variables: `PLAYWRIGHT_MODULE` (module specifier or file URL), `BROWSER_CHANNEL` (defaults to msedge), `WARRIOR_TEST_URL` (defaults to http://localhost:5173). Captures and results go to ignored `.tmp-warriors/`.

Historical reference links and interpretation limits are recorded in the implementation plan. Existing historical prose was intentionally preserved rather than independently reverified.

## Vintage cinematic art-direction revision

Reworked the gallery after visual feedback: muted vermilion etched suns, warm weathered paper, fine engraved grain, distant reeds and ground haze, angular poster frames, and red seal motifs. Expanded Musashi's hakama and loose sleeves, Nobunaga's wind-swept coat, and armored thigh protection. Added static asymmetric rest poses while retaining low-amplitude joint motion and fixed feet. Reframed armored figures to keep equipment within the artwork. Date typography now sits directly on paper for legibility; all underlying historical text is retained.

## Live profile silhouettes (user reference revision)

Replaced the frontal figure geometry with original layered side-profile SVG artwork in `ProfileWarrior.jsx`, inspired by the supplied silhouette references. No reference image, watermark, photograph, or raster cutout is embedded. Robes, profile faces, ponytails, armor lacing, crescent/antler kabuto, rough ink edges, and drifting fragments define the silhouettes.

The user explicitly requested visible weapon performance, superseding the initial idle-only direction. Musashi, Nobunaga, and Masamune now perform shoulder-led sword phrases (anticipation, cut, hold, recovery); Yukimura performs a spear guard movement. Cycles last 10.7–14.3 seconds with individual phase offsets. Hands and rigid equipment share a shoulder group. Feet remain outside the action groups. Idle cloth/hair and ink fragments move independently. CSS and the existing visibility observer handle motion without React frame updates. Reduced motion disables all action and idle animation.

`tests/warrior-action.browser.mjs` samples 101 phases per portrait, checks every path against artwork bounds, captures resting/cut poses, and verifies reduced-motion action suppression. This passed, alongside the seven-size gallery/dossier suite. Build passes with the existing bundle-size warning.
