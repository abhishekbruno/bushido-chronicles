const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../kage-samurai-ui/src/assets/vectors/');

function extractPathD(filename) {
  const content = fs.readFileSync(path.join(dir, filename), 'utf8');
  const match = content.match(/<path\s+[^>]*d="([^"]+)"/i);
  return match ? match[1] : '';
}

const sunD = extractPathD('sun-layer.svg');
const calD = extractPathD('calligraphy-layer.svg');
const samD = extractPathD('samurai-warrior.svg');
const samSolidD = extractPathD('samurai-solid.svg');
const landD = extractPathD('landscape-layer.svg');
const shoulderD = extractPathD('shoulder-highlight.svg');

const js = `// Vector paths extracted directly from the reference image
export const SUN_PATH = ${JSON.stringify(sunD)};
export const CALLIGRAPHY_PATH = ${JSON.stringify(calD)};
export const SAMURAI_PATH = ${JSON.stringify(samD)};
export const SAMURAI_SOLID_PATH = ${JSON.stringify(samSolidD)};
export const LANDSCAPE_PATH = ${JSON.stringify(landD)};
export const SHOULDER_PATH = ${JSON.stringify(shoulderD)};
`;

fs.writeFileSync(path.join(dir, 'vectorPaths.js'), js);
console.log('Successfully generated vectorPaths.js with SAMURAI_SOLID_PATH!');
