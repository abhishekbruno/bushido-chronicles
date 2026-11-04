# GitHub Pages readiness report

Date: 2026-11-04. Repository: `abhishekbruno/bushido-chronicles`, branch `main`.

## Scope and recovery

Local checkpoint **118d7fe** preserves the pre-existing uncommitted honor,
final-legacy, footer, creator-credit, watermark, and Vite configuration work.
The deployment changes remain uncommitted for review. Nothing was pushed.
To inspect the checkpoint without overwriting current work, use
`git show 118d7fe:path/to/file` or create a separate checkout from that commit.

Work covered the source/dependency/asset audit, subdirectory fixes, workflow,
production verification, responsive repairs, and deployment documentation.
No artwork, historical copy, colors, fonts, character geometry, or animation
algorithms were changed.

## Issues found and resolved

- Vite already selected the production base during build, but preview selected
  `/`. The production bundle URL returned HTML, preventing React startup.
  `isPreview` now selects `/bushido-chronicles/` too; development remains `/`.
- **27 public artwork URL call sites across six components** bypassed the base.
  `assetUrl()` now handles ordinary images, dynamic warrior canvas/preload layers,
  Ronin cloth, samurai layers, monument artwork, and the Sakura inline background.
  Existing query strings are preserved. Vite-managed imports, CSS data URLs, and
  the HTML favicon were left to Vite; they are not double-prefixed.
- There was no deployment workflow. The new workflow builds on Ubuntu using
  Node 24, npm caching and `npm ci`, verifies assets/motion, uploads `dist`, and
  deploys using official Pages actions. Push to `main` and manual dispatch are
  supported. Deployment is restricted to `main`.
- The offscreen Bushido heading entrance widened the mobile document. A scoped
  horizontal clip contains it without changing the animation.
- The covenant action's nonwrapping text and quote minimum width clipped content
  on mobile. The existing mobile rules now allow wrapping and shrinking.

## Files

Modified:

- `vite.config.js`
- `src/components/HonorSamuraiFigure.jsx`
- `src/components/KokoroMonumentArchive.jsx`
- `src/components/MonumentGardenScene.jsx`
- `src/components/RoninLegacyArtwork.jsx`
- `src/components/SakuraTree.jsx`
- `src/components/WarriorCharacter.jsx`
- `src/components/honor.css`
- `src/styles.css`
- `README.md`

Created:

- `.github/workflows/deploy.yml`
- `src/utils/assetUrl.js`
- `tests/pages-build.test.mjs`
- `tests/pages.browser.mjs`
- `docs/pages-readiness.md`

## Verification

- `npm ci`: successful with the existing lockfile, Node 24.21.0 / npm 11.19.0.
- `npm run build`: successful; `dist/index.html`, CSS and JavaScript generated.
- `node --test tests/pages-build.test.mjs tests/motion.test.mjs`: 8 passed.
  All 77 public files match their originals byte-for-byte. Source imports and
  artwork references, including dynamic warrior variants, match exact filename
  capitalization. Generated entry URLs use the correct base.
- The production-browser regression test first failed on the incorrect bundle
  MIME type, proving the original preview failure before the fix.
- `node tests/pages.browser.mjs`: passed against the actual Vite production
  preview under `/bushido-chronicles/`, with zero console errors, page exceptions,
  failed requests, HTTP errors, or same-origin requests escaping the base path.
  All 77 PNG/SVG files decoded successfully, including canvas-only layers.
  Verified all ten requested section/attribution areas, navigation, image decoding
  and absence of horizontal overflow at 2560×1440, 1920×1080, 1440×900, 1024×768,
  768×1024, 390×844 and 375×667. Hero, final-legacy and footer screenshots were
  captured at each size; representative desktop and mobile images were reviewed.
  Interaction checks passed for all four keyboard-operated warrior dossiers,
  historical cases, five honor principles, landscapes, historical eras, seven
  Bushido virtues, all five blade exhibits, saya/measurement/zoom controls,
  curator notes, individual vow release/sealing and seal-all. All internal anchor
  destinations exist; creator attribution and the GitHub destination are intact.
  Warrior and Ronin cape canvases contain visible pixels and continue drawing.
- Development smoke check: base `/`, four initialized warriors, HMR client HTTP
  200, no page or HTTP errors. A temporary port 5177 avoided existing servers;
  the normal development command retains Vite's default port 5173.
- `actionlint` 1.7.12: passed. The downloaded validator's SHA-256 matched its
  published checksum. All five pinned official action manifests returned HTTP
  200. The workflow has not run on GitHub because it has not been pushed.
- Independent read-only review: no actionable deployment-code defects; all
  eight static/motion checks also passed for the reviewer.
- No public artwork changed; `dist`, `node_modules`, credentials and environment
  files are not tracked or added. Browser screenshots and local tools stay in
  the already-ignored `.tmp-warriors` directory.

## Remaining publication steps and limitations

The expected public URL returned **HTTP 404** during this audit:
https://abhishekbruno.github.io/bushido-chronicles/

Repository metadata confirms a public repository with default branch `main`.
The account's Pages source setting was **not verified or changed**. Open
[Settings → Pages](https://github.com/abhishekbruno/bushido-chronicles/settings/pages)
and choose **Build and deployment → Source → GitHub Actions**. Review and commit
the local changes, then explicitly approve/push to `main`. Confirm successful
`build` and `deploy` jobs and check the public URL afterward. No successful live
deployment is claimed.

The build still reports a large JavaScript chunk (928.03 kB, 324.44 kB gzip).
This was already present; this deployment repair avoids restructuring the
cinematic application. Existing animation lifecycle/offscreen handling remains
intact. No low-quality compression, artwork resizing, or feature removal was used.

`npm audit` reports five moderate findings in the existing `potrace` → `jimp` →
`phin` tooling chain. No application module imports `potrace`; it is not bundled
into the static browser app. A forced dependency downgrade was not applied.
Google Fonts remains an external network dependency, with existing fallback fonts.
Browser checks use desktop Edge with resized viewports, not physical devices or
a cross-browser performance benchmark.

Workflow references checked against the current
[GitHub custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
and [Vite's maintained Pages workflow](https://github.com/vitejs/vite/blob/main/docs/guide/static-deploy-github-pages.yaml).
