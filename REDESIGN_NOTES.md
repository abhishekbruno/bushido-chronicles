# Bushido Chronicles — tree-free cinematic redesign

## What changed

- Removed the animated Japanese maple tree mounts from the hero, legacy, warrior, blade and closing sections.
- Removed the Sakura/Momiji tree showcase and its season-toggle controls.
- Replaced the Spirit of Japan artwork with a responsive, illustrated four-scene archive: spring petals, Mount Fuji, an abstract vertical bamboo composition, and the Miyajima torii. The four existing story cards now switch the illustration, as well as the text.
- Replaced the old bonsai-focused Zen wallpaper with a tree-free ink poster showing the rising crimson sun, landscape layers and torii gate. The poster retains an immersive full-screen view control (Escape to close).
- Reduced the amount of global falling leaves and dust so the presentation is calmer and the typography stays readable.
- Added responsive, self-contained illustration regions, clearer editorial layout spacing and reduced-motion fallbacks.
- Removed the unused SakuraTree, JapaneseMapleTree and ZenRestraintWallpaper component files and their dedicated stylesheet blocks.

## Running the site

```bash
npm install
npm run dev
```

To build: `npm run build`.

## Note about testing

The edits were statically checked. The execution environment was unable to install npm dependencies and therefore the full production build / browser QA could not be completed here. Run the commands above locally to finish verification. The existing source design and interactions outside these replaced scenes were retained.
