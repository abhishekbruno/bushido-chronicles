# Bushido Chronicles — Cinematic Archive Update

This source ZIP is based on the uploaded **bushido-chronicles-main (1)(1).zip** project.

## Completed changes

- Rebuilt the final **A LEGACY THAT NEVER FADES** chapter with the intended Japanese headline, original authored layered SVG rōnin illustration, weathered crimson sun, local swaying reeds, mist, and deliberate editorial layout.
- Removed the duplicate poster navigation, dummy Japanese paragraph, misleading PRE ORDER and CONTACT US actions, fake pledge count, oversized foreground grass, and decorative pagination.
- Replaced those actions with working in-page navigation to the archive and hero.
- Rebuilt the footer with responsive brand, chapter navigation, further-reading links, and a compact Return to the Beginning control. Footer no longer uses giant detached rectangular cards or falling leaves.
- Removed the custom animated cursor component and its mouse-tracking CSS; native browser cursors remain. The original hover states and pointer interaction are preserved.
- Removed the **global falling leaf/particle mount** from the app and deleted its unused rendering component. Localized Sakura petals appear only within the new monument scene.
- Added a dedicated **THE GUARDIANS OF HISTORY** monument section between Spirit of Japan and the final Legacy section, plus a MONUMENT navbar link and manuscript transition integration.
- The monument section presents a **clearly labeled interpretive SVG illustration**, one locally animated Sakura tree, and the existing interactive Kusunoki Masashige archival record. It is **not** an exact 3D replica of the actual sculpture; verified historical source link is provided.
- Removed superseded poster components and 886 lines of inactive Legacy/footer CSS.
- Renamed the package metadata from `kage-samurai-ui` to `bushido-chronicles`.

## Code validation

- TypeScript's JSX parser successfully transpiled all 38 current JavaScript/JSX source files with no parse errors.
- PostCSS parsed the stylesheet successfully.
- All relative imports resolve to files in this package.
- A complete Vite production build and live visual regression test **were not run** because dependency installation was unavailable in this execution environment. These must be run locally.

## Run locally

```powershell
npm ci
npm run dev
npm run build
```

If `npm ci` encounters environment-specific dependency issues, try `npm install` and then rerun the build. Check the opening scene, monument, final Legacy, footer, menu at mobile widths, and scroll-reversal behavior in your browser.

## Design constraints

- Keep the native mouse cursor; do not remount `CustomCursor`.
- Keep all global leaf particle systems disabled.
- The monumental artwork is an original interpretive illustration, not a literal photograph or an authenticated model of the statue.
- No copyrighted reference screenshot was pasted as a background.
