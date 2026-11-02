const fs = require('fs');
const zlib = require('zlib');
const buf = fs.readFileSync('kage-samurai-ui/public/images/samurai-ink.png');
let pos = 8, idatBuffers = [], width = 0, height = 0;
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IHDR') {
    width = buf.readUInt32BE(pos + 8);
    height = buf.readUInt32BE(pos + 12);
  } else if (type === 'IDAT') idatBuffers.push(buf.subarray(pos + 8, pos + 8 + len));
  pos += 12 + len;
}
const decompressed = zlib.inflateSync(Buffer.concat(idatBuffers));
let bpp = 4, stride = width * bpp + 1, prevRow = Buffer.alloc(width * bpp);
const rgba = Buffer.alloc(width * height * 4);
for (let y = 0; y < height; y++) {
  let filter = decompressed[y * stride];
  let row = decompressed.subarray(y * stride + 1, (y + 1) * stride);
  let curRow = Buffer.alloc(width * bpp);
  for (let x = 0; x < width * bpp; x++) {
    let a = x >= bpp ? curRow[x - bpp] : 0, b = prevRow[x], c = x >= bpp ? prevRow[x - bpp] : 0, val = row[x];
    if (filter === 1) val = (val + a) & 0xff;
    else if (filter === 2) val = (val + b) & 0xff;
    else if (filter === 3) val = (val + Math.floor((a + b) / 2)) & 0xff;
    else if (filter === 4) {
      let p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      val = (val + ((pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c))) & 0xff;
    }
    curRow[x] = val;
  }
  prevRow = curRow;
  for (let x = 0; x < width; x++) {
    let idx = (y * width + x) * 4;
    rgba[idx] = curRow[x * 4];
    rgba[idx + 1] = curRow[x * 4 + 1];
    rgba[idx + 2] = curRow[x * 4 + 2];
    rgba[idx + 3] = curRow[x * 4 + 3];
  }
}

// Find shoulder bounding box where pixels have brightness between 70 and 220 in x: 500..660, y: 340..460
let count = 0;
let minX = 9999, maxX = 0, minY = 9999, maxY = 0;
for (let y = 350; y < 460; y++) {
  for (let x = 500; x < 660; x++) {
    const idx = (y * width + x) * 4;
    const r = rgba[idx], g = rgba[idx + 1], b = rgba[idx + 2];
    const lum = 0.299*r + 0.587*g + 0.114*b;
    if (lum > 70 && lum < 220) {
      count++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log(`Shoulder highlight pixels count: ${count}, bounds: [${minX}, ${minY}] to [${maxX}, ${maxY}]`);

