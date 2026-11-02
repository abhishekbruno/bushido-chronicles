// Mathematical coordinates for 7-pointed Japanese Maple Leaf (Acer palmatum / Momiji)
// Returns array of command points or SVG path
function getMomijiPath() {
  // 7 Lobes:
  // Center tip (0 deg)
  // Left 1 (~28 deg), Left 2 (~58 deg), Left 3 (~88 deg)
  // Right 1 (~28 deg), Right 2 (~58 deg), Right 3 (~88 deg)
  // Base petiole / stem at bottom
  return `
    M 50 8
    C 52 18, 56 25, 62 27
    C 67 24, 72 19, 78 16
    C 76 24, 73 30, 76 34
    C 84 31, 91 26, 96 26
    C 90 34, 84 38, 86 44
    C 93 47, 98 49, 100 54
    C 93 57, 85 57, 81 63
    C 85 68, 89 74, 88 80
    C 82 78, 75 73, 70 77
    C 67 82, 65 87, 61 91
    C 57 86, 55 79, 51.5 77
    L 52 99
    L 48 99
    L 48.5 77
    C 45 79, 43 86, 39 91
    C 35 87, 33 82, 30 77
    C 25 73, 18 78, 12 80
    C 11 74, 15 68, 19 63
    C 15 57, 7 57, 0 54
    C 2 49, 7 47, 14 44
    C 16 38, 10 34, 4 26
    C 9 26, 16 31, 24 34
    C 27 30, 24 24, 22 16
    C 28 19, 33 24, 38 27
    C 44 25, 48 18, 50 8
    Z
  `.replace(/\s+/g, ' ').trim();
}

console.log("Momiji path defined successfully!");

