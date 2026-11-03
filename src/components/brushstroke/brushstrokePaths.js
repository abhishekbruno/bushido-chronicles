/**
 * Japanese Sumi-e Brushstroke Vector Geometries
 * -----------------------------------------------------------------------------
 * Hand-crafted Bézier paths, dry-brush bristle details, and calligraphic textures.
 * Built with authentic Japanese ink painting proportions:
 *  - Organic pressure variations (tapered entry, thick belly, feathered exit)
 *  - Natural bristle separation and dry-brush trails
 *  - Micro ink splatters and paper absorption bleeds
 */

// TYPE A: Wide Black Ink Brushstroke Banner (ViewBox: 0 0 1000 120)
// Designed to support headings, short quotes, and chapter callouts
export const BRUSH_BANNER_PATH = 
  'M 18,32 ' +
  'C 65,22 135,26 215,20 ' +
  'C 305,14 415,24 530,17 ' +
  'C 645,10 760,22 855,16 ' +
  'C 915,12 955,20 982,28 ' +
  'C 996,33 1000,42 994,52 ' +
  'C 1002,60 998,72 991,82 ' +
  'C 997,91 990,101 978,106 ' +
  'C 952,114 905,108 840,113 ' +
  'C 745,119 635,109 515,116 ' +
  'C 395,122 280,111 180,116 ' +
  'C 115,120 58,114 26,104 ' +
  'C 10,98 3,88 8,76 ' +
  'C 2,66 5,53 11,43 ' +
  'C 6,37 10,33 18,32 Z';

// Secondary inner dry-brush streak (gives depth and texture to Type A)
export const BRUSH_BANNER_STREAK_1 = 
  'M 55,42 ' +
  'C 180,32 360,38 560,28 ' +
  'C 720,20 860,30 945,36 ' +
  'C 920,44 790,38 640,42 ' +
  'C 470,47 280,41 120,49 ' +
  'C 80,51 60,46 55,42 Z';

export const BRUSH_BANNER_STREAK_2 = 
  'M 90,88 ' +
  'C 240,82 430,90 640,84 ' +
  'C 770,80 880,86 940,82 ' +
  'C 890,94 750,91 600,95 ' +
  'C 430,100 270,93 140,97 ' +
  'C 105,97 92,92 90,88 Z';

// Tapered Feathered Bristle Ends (Left Entry & Right Exit)
export const BRUSH_BANNER_BRISTLES_RIGHT = [
  'M 975,34 C 992,36 1004,41 1012,46 C 998,47 984,45 972,42 Z',
  'M 982,54 C 1002,57 1016,63 1022,68 C 1006,69 990,66 978,63 Z',
  'M 978,74 C 995,78 1008,85 1015,92 C 1000,91 986,87 974,82 Z',
  'M 965,95 C 980,101 992,107 998,114 C 984,112 970,108 958,103 Z',
];

export const BRUSH_BANNER_BRISTLES_LEFT = [
  'M 25,36 C 12,38 3,42 -4,47 C 8,48 20,46 30,44 Z',
  'M 18,58 C 4,60 -6,65 -12,71 C 2,71 16,68 25,65 Z',
  'M 22,82 C 10,86 0,92 -8,98 C 6,97 18,93 28,89 Z',
];

// TYPE B: Washi Frame Perimeter Sumi-e Strokes
// 1. Top Horizontal Brushstroke (ViewBox: 0 0 1000 32)
export const BRUSH_FRAME_TOP =
  'M 8,18 ' +
  'C 80,8 190,14 320,7 ' +
  'C 460,1 610,12 760,6 ' +
  'C 860,2 940,11 988,14 ' +
  'C 998,15 1004,18 996,22 ' +
  'C 940,25 850,19 740,24 ' +
  'C 590,30 430,20 280,26 ' +
  'C 170,30 80,25 14,26 ' +
  'C 4,26 0,22 8,18 Z';

// 2. Bottom Horizontal Grounding Brushstroke (ViewBox: 0 0 1000 34)
export const BRUSH_FRAME_BOTTOM =
  'M 12,12 ' +
  'C 110,6 230,16 370,9 ' +
  'C 520,3 680,14 830,8 ' +
  'C 910,5 965,12 992,16 ' +
  'C 1002,18 998,24 986,26 ' +
  'C 930,29 840,21 720,27 ' +
  'C 560,33 400,22 240,29 ' +
  'C 140,33 55,27 10,24 ' +
  'C 2,23 3,15 12,12 Z';

// 3. Left Vertical Sumi-e Stroke (ViewBox: 0 0 24 1000)
export const BRUSH_FRAME_LEFT =
  'M 14,8 ' +
  'C 8,90 15,220 7,370 ' +
  'C 1,530 13,690 6,840 ' +
  'C 2,930 10,970 14,992 ' +
  'C 17,998 22,994 21,984 ' +
  'C 18,910 24,800 17,670 ' +
  'C 11,510 23,350 15,190 ' +
  'C 11,90 19,30 18,12 ' +
  'C 18,4 16,2 14,8 Z';

// 4. Right Vertical Sumi-e Stroke (ViewBox: 0 0 24 1000)
export const BRUSH_FRAME_RIGHT =
  'M 10,12 ' +
  'C 16,110 9,250 17,410 ' +
  'C 23,580 11,730 18,870 ' +
  'C 21,940 13,978 9,990 ' +
  'C 6,997 2,992 4,982 ' +
  'C 8,890 3,780 9,640 ' +
  'C 15,480 5,320 11,160 ' +
  'C 14,80 7,24 7,14 ' +
  'C 7,4 9,5 10,12 Z';

// Four Handcrafted Sumi-e Corner Marks (L-shaped calligraphic ink corners)
export const CORNER_MARK_TL = 
  'M 4,32 C 6,18 14,8 30,5 C 24,9 20,15 19,26 C 18,34 16,36 4,32 Z ' +
  'M 5,6 L 36,4 C 36,9 28,10 12,12 L 5,6 Z';

export const CORNER_MARK_TR = 
  'M 28,32 C 26,18 18,8 2,5 C 8,9 12,15 13,26 C 14,34 16,36 28,32 Z ' +
  'M 27,6 L -4,4 C -4,9 4,10 20,12 L 27,6 Z';

export const CORNER_MARK_BL = 
  'M 4,0 C 6,14 14,24 30,27 C 24,23 20,17 19,6 C 18,-2 16,-4 4,0 Z ' +
  'M 5,26 L 36,28 C 36,23 28,22 12,20 L 5,26 Z';

export const CORNER_MARK_BR = 
  'M 28,0 C 26,14 18,24 2,27 C 8,23 12,17 13,6 C 14,-2 16,-4 28,0 Z ' +
  'M 27,26 L -4,28 C -4,23 4,22 20,20 L 27,26 Z';

// TYPE C: Crimson Brush Accents
// Horizontal Crimson Stroke (for date badges, active tabs, highlights)
// ViewBox: 0 0 400 48
export const CRIMSON_STROKE_PATH =
  'M 12,22 ' +
  'C 35,14 75,18 125,12 ' +
  'C 185,6 255,16 320,10 ' +
  'C 358,6 385,12 394,18 ' +
  'C 402,23 398,30 388,34 ' +
  'C 355,40 305,34 240,38 ' +
  'C 170,42 105,35 52,38 ' +
  'C 28,40 12,36 6,30 ' +
  'C 2,26 5,23 12,22 Z';

// Traditional Japanese Square Hanko Stamp Seal (ViewBox: 0 0 64 64)
export const HANKO_BORDER_PATH =
  'M 6,10 C 8,7 12,6 18,6 L 46,6 C 54,6 57,8 58,14 ' +
  'L 58,46 C 58,52 55,56 48,58 L 16,58 C 9,58 6,55 6,48 ' +
  'L 6,10 Z';

