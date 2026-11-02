const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const potrace = require(path.join(__dirname, '../kage-samurai-ui/node_modules/potrace'));

const pngPath = path.join(__dirname, '../kage-samurai-ui/public/images/samurai-ink.png');
const buf = fs.readFileSync(pngPath);
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

function createBmpBuffer(width, height, isPixelBlackFn) {
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const imageSize = rowSize * height;
  const fileSize = 54 + imageSize;
  const bmp = Buffer.alloc(fileSize);

  bmp.write('BM', 0);
  bmp.writeUInt32LE(fileSize, 2);
  bmp.writeUInt32LE(54, 10);
  bmp.writeUInt32LE(40, 14);
  bmp.writeInt32LE(width, 18);
  bmp.writeInt32LE(height, 22);
  bmp.writeUInt16LE(1, 26);
  bmp.writeUInt16LE(24, 28);
  bmp.writeUInt32LE(0, 30);
  bmp.writeUInt32LE(imageSize, 34);

  for (let y = 0; y < height; y++) {
    const srcY = height - 1 - y;
    const rowOffset = 54 + y * rowSize;
    for (let x = 0; x < width; x++) {
      const isBlack = isPixelBlackFn(x, srcY);
      const val = isBlack ? 0 : 255;
      const pIdx = rowOffset + x * 3;
      bmp[pIdx] = val;
      bmp[pIdx + 1] = val;
      bmp[pIdx + 2] = val;
    }
  }
  return bmp;
}

// Shoulder armor highlights: brightness > 75 in the sode area
const shoulderBmp = createBmpBuffer(width, height, (x, y) => {
  if (x < 515 || x > 655 || y < 355 || y > 460) return false;
  const idx = (y * width + x) * 4;
  const r = rgba[idx], g = rgba[idx + 1], b = rgba[idx + 2];
  const lum = 0.299*r + 0.587*g + 0.114*b;
  return lum > 70;
});

potrace.trace(shoulderBmp, { color: '#FFFFFF', threshold: 128, optCurve: true, turdSize: 2 }, (err, svg) => {
  if (err) throw err;
  fs.writeFileSync(path.join(__dirname, '../kage-samurai-ui/src/assets/vectors/shoulder-highlight.svg'), svg);
  console.log('Saved shoulder-highlight.svg with enhanced detail!');
});

