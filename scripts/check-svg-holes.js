const fs = require('fs');
const svg = fs.readFileSync('kage-samurai-ui/src/assets/vectors/samurai-warrior.svg', 'utf8');

// Let's check how many <path tags are in samurai-warrior.svg
const pathMatches = svg.match(/<path[^>]+>/g);
console.log('Number of path elements in samurai-warrior.svg:', pathMatches ? pathMatches.length : 0);

// Let's check the fill rule
console.log('Fill rule in SVG:', svg.includes('fill-rule') ? 'Has fill-rule' : 'No fill-rule');

// If there are subpaths (multiple M commands), potrace uses evenodd fill-rule by default!
// With evenodd, if an outer contour encloses an inner contour, the inner area becomes a HOLE!
const dMatch = svg.match(/d="([^"]+)"/);
if (dMatch) {
  const mCount = (dMatch[1].match(/M/g) || []).length;
  console.log('Number of M commands (sub-paths) in d:', mCount);
}

