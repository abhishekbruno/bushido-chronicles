const fs = require('fs');
const svg = fs.readFileSync('kage-samurai-ui/src/assets/vectors/landscape-layer.svg', 'utf8');
const dMatch = svg.match(/d="([^"]+)"/);
if (dMatch) {
  const d = dMatch[1];
  console.log('LANDSCAPE_PATH length:', d.length);
  // find min and max Y coordinates in d
  const numbers = d.match(/-?\d+(\.\d+)?/g).map(Number);
  let minX = 99999, maxX = -99999, minY = 99999, maxY = -99999;
  for (let i = 0; i < numbers.length - 1; i += 2) {
    const x = numbers[i], y = numbers[i+1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  console.log(`LANDSCAPE coords range: X [${minX}, ${maxX}], Y [${minY}, ${maxY}]`);
}

