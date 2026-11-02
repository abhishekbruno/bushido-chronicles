const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const potrace = require(path.join(__dirname, '../kage-samurai-ui/node_modules/potrace'));

const pngPath = path.join(__dirname, '../kage-samurai-ui/public/images/samurai-ink.png');
const outDir = path.join(__dirname, '../kage-samurai-ui/src/assets/vectors');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Decode PNG
const buf = fs.readFileSync(pngPath);
let pos = 8, idatBuffers = [], width = 0, height = 0, colorType = 0;
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IHDR') {
    width = buf.readUInt32BE(pos + 8);
    height = buf.readUInt32BE(pos + 12);
    colorType = buf[pos + 17];
  } else if (type === 'IDAT') idatBuffers.push(buf.subarray(pos + 8, pos + 8 + len));
  pos += 12 + len;
}

console.log(`Decoding ${width}x${height} PNG...`);
const decompressed = zlib.inflateSync(Buffer.concat(idatBuffers));
let bpp = 4, stride = width * bpp + 1, prevRow = Buffer.alloc(width * bpp);

// Allocate raw RGBA buffer
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

// Function to encode 1-bit or 24-bit BMP buffer for potrace
function createBmpBuffer(width, height, isPixelBlackFn) {
  // 24-bit uncompressed BMP
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const imageSize = rowSize * height;
  const fileSize = 54 + imageSize;
  const bmp = Buffer.alloc(fileSize);

  // BMP Header
  bmp.write('BM', 0);
  bmp.writeUInt32LE(fileSize, 2);
  bmp.writeUInt32LE(54, 10); // data offset

  // DIB Header (BITMAPINFOHEADER)
  bmp.writeUInt32LE(40, 14);
  bmp.writeInt32LE(width, 18);
  bmp.writeInt32LE(height, 22); // positive = bottom-up
  bmp.writeUInt16LE(1, 26); // planes
  bmp.writeUInt16LE(24, 28); // bpp
  bmp.writeUInt32LE(0, 30); // compression BI_RGB
  bmp.writeUInt32LE(imageSize, 34);

  // Write pixel rows from bottom to top
  for (let y = 0; y < height; y++) {
    const srcY = height - 1 - y;
    const rowOffset = 54 + y * rowSize;
    for (let x = 0; x < width; x++) {
      const isBlack = isPixelBlackFn(x, srcY);
      const val = isBlack ? 0 : 255;
      const pIdx = rowOffset + x * 3;
      bmp[pIdx] = val;     // B
      bmp[pIdx + 1] = val; // G
      bmp[pIdx + 2] = val; // R
    }
  }

  return bmp;
}

// 1. Trace Red Sun
console.log('Tracing Red Sun...');
const sunBmp = createBmpBuffer(width, height, (x, y) => {
  const idx = (y * width + x) * 4;
  const r = rgba[idx], g = rgba[idx + 1], b = rgba[idx + 2];
  // Red sun pixels
  return r > 140 && g < 75 && b < 75;
});

potrace.trace(sunBmp, { color: '#D90416', threshold: 128 }, (err, svg) => {
  if (err) throw err;
  fs.writeFileSync(path.join(outDir, 'sun-layer.svg'), svg);
  console.log('Saved sun-layer.svg');
});

// 2. Trace Japanese Calligraphy (Upper Left)
console.log('Tracing Calligraphy...');
const calBmp = createBmpBuffer(width, height, (x, y) => {
  if (x > 320 || y > 350) return false;
  const idx = (y * width + x) * 4;
  const r = rgba[idx], g = rgba[idx + 1], b = rgba[idx + 2];
  return r < 100 && g < 100 && b < 100;
});

potrace.trace(calBmp, { color: '#0A0A0A', threshold: 128 }, (err, svg) => {
  if (err) throw err;
  fs.writeFileSync(path.join(outDir, 'calligraphy-layer.svg'), svg);
  console.log('Saved calligraphy-layer.svg');
});

// 3. Trace Samurai Character (Excluding bottom ground landscape)
console.log('Tracing Samurai Warrior...');
const samBmp = createBmpBuffer(width, height, (x, y) => {
  // Exclude calligraphy in upper left
  if (x < 260 && y < 300) return false;
  // Exclude bottom ground pine trees at bottom
  if (y > 880) return false;
  const idx = (y * width + x) * 4;
  const r = rgba[idx], g = rgba[idx + 1], b = rgba[idx + 2];
  return r < 85 && g < 85 && b < 85;
});

potrace.trace(samBmp, { color: '#0A0A0A', threshold: 128, optCurve: true, turdSize: 3 }, (err, svg) => {
  if (err) throw err;
  fs.writeFileSync(path.join(outDir, 'samurai-warrior.svg'), svg);
  console.log('Saved samurai-warrior.svg');
});

// 4. Trace Bottom Landscape (Ground and Pine Trees)
console.log('Tracing Bottom Landscape...');
const landBmp = createBmpBuffer(width, height, (x, y) => {
  if (y <= 780) return false;
  const idx = (y * width + x) * 4;
  const r = rgba[idx], g = rgba[idx + 1], b = rgba[idx + 2];
  return r < 95 && g < 95 && b < 95;
});

potrace.trace(landBmp, { color: '#0A0A0A', threshold: 128, optCurve: true }, (err, svg) => {
  if (err) throw err;
  fs.writeFileSync(path.join(outDir, 'landscape-layer.svg'), svg);
  console.log('Saved landscape-layer.svg');
});

// 5. Trace Shoulder Highlights (Metallic curved plates)
console.log('Tracing Shoulder Armor Highlights...');
const shoulderBmp = createBmpBuffer(width, height, (x, y) => {
  if (x < 510 || x > 660 || y < 350 || y > 460) return false;
  const idx = (y * width + x) * 4;
  const r = rgba[idx], g = rgba[idx + 1], b = rgba[idx + 2];
  // Highlight pixels
  return r > 115 && g > 115 && b > 115;
});

potrace.trace(shoulderBmp, { color: '#E8E8E8', threshold: 128, optCurve: true }, (err, svg) => {
  if (err) throw err;
  fs.writeFileSync(path.join(outDir, 'shoulder-highlight.svg'), svg);
  console.log('Saved shoulder-highlight.svg');
});
