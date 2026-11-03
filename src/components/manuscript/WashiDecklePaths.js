/**
 * WashiDecklePaths.js
 * -----------------------------------------------------------------------------
 * Hand-crafted Bézier curves for authentic Japanese washi deckled edges,
 * traditional scroll dowel ends (Jiku-gi 軸木), sumi-e borders, and hanko seals.
 */

// Deckled paper edges with natural fibrous irregularities
export const DECKLE_TOP =
  'M 0,16 ' +
  'Q 75,10 150,14 ' +
  'T 300,11 ' +
  'Q 425,18 550,12 ' +
  'T 800,15 ' +
  'Q 900,10 1000,16 ' +
  'L 1000,24 L 0,24 Z';

export const DECKLE_BOTTOM =
  'M 0,8 ' +
  'Q 80,14 160,10 ' +
  'T 320,13 ' +
  'Q 460,7 600,12 ' +
  'T 840,9 ' +
  'Q 920,15 1000,8 ' +
  'L 1000,0 L 0,0 Z';

export const DECKLE_LEFT =
  'M 16,0 ' +
  'Q 10,90 14,180 ' +
  'T 11,360 ' +
  'Q 18,500 12,640 ' +
  'T 15,860 ' +
  'Q 10,930 16,1000 ' +
  'L 24,1000 L 24,0 Z';

export const DECKLE_RIGHT =
  'M 8,0 ' +
  'Q 14,80 10,160 ' +
  'T 13,340 ' +
  'Q 7,480 12,620 ' +
  'T 9,840 ' +
  'Q 15,920 8,1000 ' +
  'L 0,1000 L 0,0 Z';

// Traditional Japanese Scroll Dowel Knob (Jiku-gi 軸木) - Left & Right ends
export const SCROLL_DOWEL_LEFT =
  'M 36,6 C 36,3 32,0 28,0 L 14,0 C 8,0 4,4 4,10 L 4,14 C 2,15 0,18 0,22 ' +
  'L 0,58 C 0,62 2,65 4,66 L 4,70 C 4,76 8,80 14,80 L 28,80 C 32,80 36,77 36,74 Z';

export const SCROLL_DOWEL_RIGHT =
  'M 0,6 C 0,3 4,0 8,0 L 22,0 C 28,0 32,4 32,10 L 32,14 C 34,15 36,18 36,22 ' +
  'L 36,58 C 36,62 34,65 32,66 L 32,70 C 32,76 28,80 22,80 L 8,80 C 4,80 0,77 0,74 Z';

// Fine Sumi-e Outline Strokes for Archival Cases & Manuscripts
export const INK_STROKE_HORIZONTAL =
  'M 4,6 Q 250,2 500,5 T 996,4 Q 750,9 500,7 T 4,6 Z';

// Organic Broad Sumi-e Brush Banner for Philosophical Statements
export const SUMIE_BROAD_BANNER =
  'M 12,38 ' +
  'C 60,24 140,28 230,20 ' +
  'C 340,12 470,26 600,16 ' +
  'C 730,8 860,22 960,14 ' +
  'C 1010,10 1050,18 1076,28 ' +
  'C 1092,34 1098,46 1090,58 ' +
  'C 1098,68 1094,82 1084,94 ' +
  'C 1090,106 1082,118 1068,124 ' +
  'C 1038,134 985,126 910,132 ' +
  'C 800,140 670,128 530,136 ' +
  'C 390,144 260,130 150,136 ' +
  'C 80,140 35,132 14,120 ' +
  'C 2,112 0,98 6,84 ' +
  'C 0,72 4,58 10,48 ' +
  'C 6,42 9,39 12,38 Z';

// Flying White / Dry-Brush Streaks (Kasuri 掠れ) for broad banner
export const SUMIE_KASURI_1 =
  'M 45,46 C 180,36 380,42 610,32 C 780,24 930,34 1025,40 ' +
  'C 990,48 850,42 690,46 C 510,51 300,45 125,54 C 80,56 55,50 45,46 Z';

export const SUMIE_KASURI_2 =
  'M 80,98 C 240,92 450,100 680,94 C 820,90 940,96 1010,92 ' +
  'C 950,105 800,101 640,106 C 460,111 290,104 150,108 C 110,108 85,102 80,98 Z';

// Traditional Square Hanko Stamp Frame
export const HANKO_SQUARE_PATH =
  'M 4,8 C 5,5 9,4 14,4 L 50,4 C 55,4 59,5 60,8 ' +
  'L 60,56 C 59,59 55,60 50,60 L 14,60 C 9,60 5,59 4,56 Z';

// Traditional Round Hanko Stamp Frame
export const HANKO_ROUND_PATH =
  'M 32,4 A 28,28 0 1,1 31.9,4 Z';

