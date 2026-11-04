# THE WAY OF THE SAMURAI (武士道)
## Premium 4K Cinematic Interactive Website

An immersive, high-end editorial website inspired by traditional Japanese ink art, feudal Japanese warriors, and modern cinematic brutalist web design.

---

### 1. Key Architectural Highlights

- **Ultra-HD 4K Cinematic Scene Construction**:
  - Independent, multi-plane scene design avoiding flat static backgrounds.
  - Procedural **Crimson Rising Sun (`#D90416`)** with radial atmospheric aura, gentle pulse, and multi-depth parallax.
  - **Resolution-Independent 4K Vector Rigged Samurai**:
    - Detailed Kabuto with golden crescent moon (Maedate) crest.
    - Menpo face armor with demon expression and throat guard.
    - Lacquered Dō armor plates with kebiki odoshi crimson lacing.
    - Continuous breathing animation on the torso (`@keyframes samuraiBreathe`).
    - Dynamic wind simulation on Jinbaori surcoat and helmet cords.
    - Hand poised on the braided Katana hilt with micro-motion.
    - Dynamic ink aura dissipation filter (`#inkDissolve`).
  - **Massive Editorial Typography**:
    - Anton, Bebas Neue, Cinzel, Cormorant Garamond, and Noto Serif JP.
    - Z-index layering: typography emerges from behind the warrior with foreground calligraphy accents.
    - Desktop headlines reach 130–220px on 4K displays using responsive `clamp()`.

- **Interactive Sections**:
  1. **Hero**: Multi-depth 3D mouse parallax, entrance animation, primary and secondary CTAs, and continuous scroll indicator.
  2. **Section 01 — The Samurai Legacy**: Editorial split layout, historical eras interactive selector (Kamakura, Sengoku, Edo), sumi-e ink artwork frame.
  3. **Section 02 — The Code of Bushido**: Full-width architectural horizontal panels showcasing the 7 Virtues (Gi, Yu, Jin, Rei, Makoto, Meiyo, Chugi) with expansive philosophy and meditation quotes.
  4. **Section 03 — Legendary Warriors**: 4K showcase of Miyamoto Musashi, Oda Nobunaga, Date Masamune, and Sanada Yukimura, complete with sword-slash hover effects and rich historical dossiers (Fact vs. Legend, battle tactics, verified history).
  5. **Section 04 — The Art of the Blade**: Interactive 4K Katana anatomy exhibit with mouse-following specular light sweep, clickable hotspots (Kissaki, Hamon, Ha, Habaki, Tsuba, Tsuka), and a 5-stage forging masterclass (Tamahagane, Shita-gitae, Kobuse, Yaki-ire, Togi).
  6. **Section 05 — The Spirit of Japan**: Visual storytelling of sacred landscapes (Mount Fuji, Arashiyama Bamboo Groves, Miyajima Floating Torii) with authentic Zen haiku.
  7. **Section 06 — Final Cinematic CTA & Luxury Editorial Footer**: Dramatic closing statement ("A LEGACY THAT NEVER FADES"), interactive personalized Hanko seal stamping pad, Kyoto scholarly source citations, and back-to-top navigation.

- **Atmospheric Systems**:
  - **Web Audio API Sound Engine**: Zero external audio files required! Synthesizes deep Taiko drum strikes, Katana blade slashes, sacred temple bell/gong harmonics, and wooden hyoshigi clacks with instant zero-latency response and audio visualizer toggle.
  - **Dynamic Ink Particles Canvas**: High-DPI 2D canvas simulating drifting sumi-e soot flakes and crimson cherry blossom embers that react to mouse velocity and scroll.
  - **Custom Magnetic Cursor**: Minimal circular cursor with trailing dot, link expansion, and click ink splash.
  - **Cinematic Entrance Preloader**: Sumi-e brush wipe transition with kanji reveal.

---

### 2. Design System & Color Palette

| Token | Hex | Role |
|---|---|---|
| Crimson Red | `#D90416` | Japanese rising sun, highlights, action buttons, seals |
| Ink Black | `#0A0A0A` | Warrior silhouette, brutalist headlines, contrast panels |
| Parchment White | `#F7F2E3` | Primary warm washi paper background |
| Charcoal | `#242424` | Secondary text, structural frames, and surfaces |
| Muted Gray | `#8A8580` | Editorial sub-headings, historical dates, and accents |
| Imperial Gold | `#D4AF37` | Helmet maedate, katana collar, and antique brass details |

---

### 3. Installation & Run Instructions

#### Prerequisites
- Node.js 24 LTS (the version used by the deployment workflow)
- npm, included with Node.js

#### Steps

```bash
# Navigate to the project directory
cd bushido-chronicles

# Install dependencies
npm ci

# Start development server
npm run dev
```

The application will launch on `http://localhost:5173/`.

#### Production Build

```bash
# Build optimized 4K-ready distribution
npm run build

# Preview production build locally
npm run preview
```

Open `http://localhost:4173/bushido-chronicles/` for the production preview.
Development stays at `http://localhost:5173/`. No API keys or runtime environment
variables are required. Google Fonts requires an internet connection; the existing
fallback font stacks remain available when it cannot be reached.

#### GitHub Pages deployment

Expected public URL: https://abhishekbruno.github.io/bushido-chronicles/

1. In [repository Settings → Pages](https://github.com/abhishekbruno/bushido-chronicles/settings/pages),
   set **Build and deployment → Source → GitHub Actions**.
2. Review and commit the local changes, including `.github/workflows/deploy.yml`,
   the asset helper, component fixes, and tests. Push to `main` when ready to publish.
3. Open **Actions → Deploy Bushido Chronicles to Pages** and check that both
   `build` and `deploy` finish successfully. The deployment links to the published site.

Every future push to `main` automatically installs the lockfile dependencies with
`npm ci`, builds with Vite, verifies the production assets and motion utilities,
and deploys **only `dist/`** with the official GitHub Pages actions. You can also
use **Actions → Deploy Bushido Chronicles to Pages → Run workflow → main**.
The `github-pages` deployment environment receives Pages/OIDC permissions; build
jobs only have repository read access. No personal token is needed in the workflow.

Vite uses `/bushido-chronicles/` for build and preview, and `/` for development.
For JavaScript/JSX paths into `public/`, use `assetUrl('/images/example.png')`
from `src/utils/assetUrl.js`. It adds `import.meta.env.BASE_URL`. Do not pass
already-prefixed URLs, external URLs, or imported module assets to this helper.
Vite handles imported assets, CSS URLs, and the HTML favicon automatically.
Keep filenames case-exact: the deployment runner uses Linux.

#### Deployment checks and troubleshooting

```bash
npm ci
npm run build
node --test tests/pages-build.test.mjs tests/motion.test.mjs
node tests/pages.browser.mjs
```

The browser check uses installed Microsoft Edge by default and starts its own Vite
preview on port 4174. To use Chromium instead, install it with
`npx playwright install chromium`, then set `BROWSER_CHANNEL=chromium` in your shell.
Screenshots go to the ignored `.tmp-warriors/pages/` directory.

- **Blank page / JavaScript MIME error:** rebuild and use the preview URL above;
  do not open `dist/index.html` directly or serve the build under the wrong base.
- **Missing image:** check filename capitalization and the `assetUrl` call, then
  check the browser Network panel for the `/bushido-chronicles/` prefix.
- **Pages setup or deployment fails:** confirm the source is GitHub Actions,
  Actions are enabled, and the `github-pages` environment allows deployment from
  `main`. Read the failed step in Actions for any account-specific restriction.
- **404 at the public URL:** verify the first successful deployment and allow it
  to finish publishing. A local build alone does not publish the website.
- **Old content:** verify the latest `main` workflow succeeded, then hard-refresh.

Do not commit `dist`, `node_modules`, `.env` files, or credentials. Existing npm
audit findings in the offline `potrace` dependency chain and Vite's large-bundle
warning are documented in [the readiness report](docs/pages-readiness.md).

---

### 4. Accessibility & Responsiveness

- Supported viewports: 3840×2160 (4K), 2560×1440 (2K), 1920×1080 (FHD), 1024px (Tablet), 768px (Small Tablet), 390px (Mobile).
- Full compliance with `prefers-reduced-motion` to disable high-frequency particle physics and character oscillations when requested by the user.
- Keyboard accessible navigation and interactive modals with focus trapping and ESC-key dismiss.


## Tree-free cinematic redesign

This edition removes the animated tree illustrations and refines the affected scenes with contained ink-painting artwork and responsive editorial spacing. Details: [`REDESIGN_NOTES.md`](./REDESIGN_NOTES.md).
