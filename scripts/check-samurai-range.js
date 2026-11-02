const fs = require('fs');
const vp = require('C:/gitrepo/D1/kage-samurai-ui/src/assets/vectors/vectorPaths.js');
function getRange(d) {
  const numbers = d.match(/-?\d+(\.\d+)?/g).map(Number);
  let minX = 99999, maxX = -99999, minY = 99999, maxY = -99999;
  for (let i = 0; i < numbers.length - 1; i += 2) {
    const x = numbers[i], y = numbers[i+1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, maxX, minY, maxY };
}
console.log('SAMURAI_PATH range:', getRange(vp.SAMURAI_PATH));
console.log('SAMURAI_SOLID_PATH range:', getRange(vp.SAMURAI_SOLID_PATH));

