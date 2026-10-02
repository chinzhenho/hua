// Bouquet designs. All share the same palette, wrapping papers and bear.
// t: rose | ran (garden rose / ranunculus) | spray | gerbera | dahlia | carnation | orchid

export const BOUQUETS = {
  // A — mixed bouquet like the reference photo
  A: {
    name: 'A 混搭花束',
    wrap: 'tall',
    bear: { left: '47%', top: '6%', width: '38%' },
    back: [
      { t: 'spray', x: 40, y: 262, r: 28, tone: 'pink', rot: 10, lean: -20, tilt: 0.8 },
      { t: 'orchid', x: 62, y: 210, s: 1.0, rot: -30 },
      { t: 'gerbera', x: 104, y: 166, r: 36, tone: 'blush', lean: -12, tilt: 0.8 },
      { t: 'ran', x: 164, y: 150, r: 32, tone: 'cream', rot: 40, tilt: 0.8 },
      { t: 'spray', x: 214, y: 168, r: 26, tone: 'pink', rot: 120, tilt: 0.8 },
      { t: 'carnation', x: 352, y: 190, r: 30, tone: 'ivory', lean: 20, tilt: 0.84 },
      { t: 'rose', x: 368, y: 250, r: 28, tone: 'blush', rot: 30, lean: 24, tilt: 0.8 },
    ],
    mid: [
      { t: 'spray', x: 86, y: 232, r: 30, tone: 'pink', rot: 200, lean: -16, tilt: 0.84 },
      { t: 'carnation', x: 120, y: 278, r: 32, tone: 'blush', lean: -10, tilt: 0.86 },
      { t: 'ran', x: 150, y: 222, r: 40, tone: 'cream', rot: 12, tilt: 0.86 },
      { t: 'rose', x: 208, y: 214, r: 34, tone: 'ivory', rot: 90, tilt: 0.86 },
      { t: 'rose', x: 266, y: 228, r: 34, tone: 'blush', rot: 210, tilt: 0.86 },
      { t: 'spray', x: 322, y: 226, r: 32, tone: 'blush', rot: 300, lean: 12, tilt: 0.84 },
      { t: 'orchid', x: 56, y: 298, s: 0.95, rot: 20 },
      { t: 'dahlia', x: 236, y: 272, r: 44, tone: 'blush', rot: 4, tilt: 0.88 },
      { t: 'gerbera', x: 330, y: 282, r: 38, tone: 'pink', lean: 14, tilt: 0.84 },
    ],
    front: [
      { t: 'carnation', x: 34, y: 322, r: 30, tone: 'blush', lean: -20, tilt: 0.82 },
      { t: 'spray', x: 362, y: 304, r: 24, tone: 'pink', rot: 40, lean: 20, tilt: 0.82 },
      { t: 'gerbera', x: 102, y: 320, r: 38, tone: 'blush', lean: -8, tilt: 0.9 },
      { t: 'ran', x: 174, y: 316, r: 40, tone: 'cream', rot: 250, tilt: 0.92 },
      { t: 'spray', x: 256, y: 322, r: 34, tone: 'pink', rot: 160, tilt: 0.9 },
      { t: 'carnation', x: 334, y: 334, r: 34, tone: 'blush', lean: 16, tilt: 0.86 },
      { t: 'carnation', x: 70, y: 362, r: 26, tone: 'pink', lean: -14, tilt: 0.86 },
      { t: 'spray', x: 138, y: 366, r: 28, tone: 'pink', rot: 60, tilt: 0.9 },
      { t: 'ran', x: 214, y: 366, r: 32, tone: 'ivory', rot: 20, tilt: 0.9 },
      { t: 'orchid', x: 290, y: 370, s: 0.85, rot: 10 },
    ],
  },

  // B — a round dome of garden roses, fan wrapping, bear in the centre
  B: {
    name: 'B 玫瑰花園',
    wrap: 'fan',
    bear: { left: '31%', top: '3%', width: '38%' },
    back: [
      { t: 'rose', x: 78, y: 204, r: 34, tone: 'blush', rot: 30, lean: -20, tilt: 0.8 },
      { t: 'ran', x: 322, y: 200, r: 34, tone: 'cream', rot: 60, lean: 20, tilt: 0.8 },
      { t: 'spray', x: 122, y: 150, r: 24, tone: 'pink', rot: 10, tilt: 0.8 },
      { t: 'spray', x: 280, y: 148, r: 24, tone: 'blush', rot: 90, tilt: 0.8 },
      { t: 'spray', x: 46, y: 264, r: 26, tone: 'pink', rot: 140, lean: -24, tilt: 0.8 },
      { t: 'rose', x: 354, y: 262, r: 28, tone: 'ivory', rot: 200, lean: 24, tilt: 0.8 },
    ],
    mid: [
      { t: 'ran', x: 108, y: 244, r: 40, tone: 'cream', rot: 12, tilt: 0.86 },
      { t: 'rose', x: 174, y: 226, r: 40, tone: 'pink', rot: 80, tilt: 0.86 },
      { t: 'rose', x: 240, y: 228, r: 40, tone: 'blush', rot: 160, tilt: 0.86 },
      { t: 'ran', x: 302, y: 246, r: 40, tone: 'ivory', rot: 240, tilt: 0.86 },
      { t: 'rose', x: 58, y: 304, r: 32, tone: 'pink', rot: 300, lean: -18, tilt: 0.84 },
      { t: 'spray', x: 346, y: 304, r: 32, tone: 'blush', rot: 20, lean: 18, tilt: 0.84 },
    ],
    front: [
      { t: 'rose', x: 92, y: 322, r: 40, tone: 'cream', rot: 40, tilt: 0.9 },
      { t: 'rose', x: 166, y: 302, r: 44, tone: 'pink', rot: 110, tilt: 0.92 },
      { t: 'ran', x: 240, y: 304, r: 44, tone: 'cream', rot: 190, tilt: 0.92 },
      { t: 'rose', x: 314, y: 324, r: 40, tone: 'blush', rot: 280, tilt: 0.9 },
      { t: 'spray', x: 130, y: 366, r: 30, tone: 'pink', rot: 60, tilt: 0.9 },
      { t: 'rose', x: 204, y: 364, r: 34, tone: 'ivory', rot: 20, tilt: 0.9 },
      { t: 'spray', x: 280, y: 366, r: 30, tone: 'pink', rot: 120, tilt: 0.9 },
      { t: 'spray', x: 38, y: 344, r: 24, tone: 'blush', rot: 0, lean: -20, tilt: 0.84 },
      { t: 'ran', x: 362, y: 344, r: 26, tone: 'cream', rot: 90, lean: 20, tilt: 0.84 },
    ],
  },

  // C — airy gerberas and orchids, tall wrapping, bear on the left
  C: {
    name: 'C 非洲菊與蝴蝶蘭',
    wrap: 'tall',
    bear: { left: '12%', top: '8%', width: '36%' },
    back: [
      { t: 'gerbera', x: 236, y: 150, r: 36, tone: 'blush', lean: 8, tilt: 0.8 },
      { t: 'orchid', x: 306, y: 184, s: 1.1, rot: 20 },
      { t: 'gerbera', x: 338, y: 240, r: 32, tone: 'pink', lean: 20, tilt: 0.8 },
      { t: 'spray', x: 52, y: 256, r: 26, tone: 'cream', rot: 30, lean: -20, tilt: 0.8 },
      { t: 'orchid', x: 176, y: 168, s: 0.9, rot: -10 },
    ],
    mid: [
      { t: 'gerbera', x: 92, y: 244, r: 36, tone: 'pink', lean: -12, tilt: 0.84 },
      { t: 'orchid', x: 152, y: 252, s: 1.0, rot: -16 },
      { t: 'gerbera', x: 214, y: 232, r: 40, tone: 'blush', tilt: 0.86 },
      { t: 'ran', x: 280, y: 252, r: 34, tone: 'ivory', rot: 40, tilt: 0.86 },
      { t: 'orchid', x: 342, y: 292, s: 0.95, rot: 30 },
    ],
    front: [
      { t: 'gerbera', x: 66, y: 320, r: 36, tone: 'blush', lean: -12, tilt: 0.88 },
      { t: 'ran', x: 138, y: 312, r: 36, tone: 'cream', rot: 80, tilt: 0.9 },
      { t: 'gerbera', x: 210, y: 300, r: 42, tone: 'pink', tilt: 0.92 },
      { t: 'orchid', x: 282, y: 316, s: 1.1, rot: 0 },
      { t: 'gerbera', x: 342, y: 334, r: 34, tone: 'blush', lean: 14, tilt: 0.86 },
      { t: 'spray', x: 120, y: 364, r: 28, tone: 'pink', rot: 60, tilt: 0.9 },
      { t: 'gerbera', x: 198, y: 364, r: 32, tone: 'ivory', tilt: 0.9 },
      { t: 'carnation', x: 268, y: 368, r: 28, tone: 'blush', tilt: 0.88 },
    ],
  },

  // D — fluffy dahlias and carnations, fan wrapping
  D: {
    name: 'D 大理花與康乃馨',
    wrap: 'fan',
    bear: { left: '40%', top: '4%', width: '36%' },
    back: [
      { t: 'carnation', x: 88, y: 184, r: 34, tone: 'ivory', lean: -16, tilt: 0.82 },
      { t: 'dahlia', x: 148, y: 156, r: 30, tone: 'blush', tilt: 0.8 },
      { t: 'carnation', x: 336, y: 214, r: 30, tone: 'pink', lean: 18, tilt: 0.82 },
      { t: 'spray', x: 50, y: 252, r: 26, tone: 'pink', lean: -20, tilt: 0.8 },
      { t: 'dahlia', x: 362, y: 266, r: 28, tone: 'blush', lean: 22, tilt: 0.8 },
    ],
    mid: [
      { t: 'dahlia', x: 100, y: 244, r: 40, tone: 'pink', tilt: 0.86 },
      { t: 'carnation', x: 170, y: 228, r: 38, tone: 'blush', tilt: 0.86 },
      { t: 'carnation', x: 240, y: 230, r: 36, tone: 'ivory', tilt: 0.86 },
      { t: 'dahlia', x: 308, y: 252, r: 38, tone: 'blush', tilt: 0.86 },
      { t: 'carnation', x: 56, y: 304, r: 30, tone: 'pink', lean: -16, tilt: 0.84 },
    ],
    front: [
      { t: 'carnation', x: 82, y: 322, r: 38, tone: 'blush', tilt: 0.9 },
      { t: 'dahlia', x: 158, y: 304, r: 44, tone: 'pink', tilt: 0.92 },
      { t: 'carnation', x: 238, y: 306, r: 42, tone: 'cream', tilt: 0.92 },
      { t: 'dahlia', x: 316, y: 322, r: 40, tone: 'blush', tilt: 0.9 },
      { t: 'carnation', x: 128, y: 364, r: 30, tone: 'ivory', tilt: 0.9 },
      { t: 'dahlia', x: 206, y: 364, r: 32, tone: 'blush', tilt: 0.9 },
      { t: 'carnation', x: 282, y: 366, r: 30, tone: 'pink', tilt: 0.9 },
      { t: 'spray', x: 358, y: 334, r: 26, tone: 'pink', lean: 20, tilt: 0.84 },
      { t: 'spray', x: 36, y: 346, r: 24, tone: 'blush', lean: -20, tilt: 0.84 },
    ],
  },
}
