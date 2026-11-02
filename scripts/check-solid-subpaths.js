const fs = require('fs');
const svg = fs.readFileSync('kage-samurai-ui/src/assets/vectors/samurai-solid.svg', 'utf8');
const dMatch = svg.match(/d="([^"]+)"/);
if (dMatch) {
  const d = dMatch[1];
  const mMatches = d.match(/M\s+[^M]+/g);
  console.log('Number of subpaths in samurai-solid.svg:', mMatches.length);
  // sort by length
  mMatches.sort((a, b) => b.length - a.length);
  console.log('Top 5 subpath lengths:', mMatches.slice(0, 5).map(m => m.length));
}

