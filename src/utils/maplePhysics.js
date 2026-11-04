import { clampDelta } from './motion.js';

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const gutterWidth = width => width < 1280 ? 0 : Math.min(360, Math.max(28, (width - 1720) / 2));

// Source-pixel coordinates. No weight reaches the trunk, roots or joint collars.
export function rigWeights(x, y) {
  const crown = (1 - smooth(210, 300, x)) * (1 - smooth(75, 190, y));
  const upper = smooth(330, 600, x) * smooth(25, 95, y) * (1 - smooth(355, 430, y));
  const lower = smooth(285, 610, x) * smooth(415, 490, y) * (1 - smooth(735, 815, y));
  const primary = Math.max(crown, upper, lower);
  const secondary = primary * Math.max(smooth(530, 760, x), crown * .35);
  const twig = primary * Math.max(smooth(740, 970, x), crown * (1 - smooth(20, 100, y)));
  return [primary, secondary, twig];
}

export function rigPivots(x, y) {
  if (x < 300 && y < 230) return [[150,210],[90,110],[55,65]];
  return y < 430 ? [[300,320],[530,290],[720,325]] : [[195,610],[545,600],[810,650]];
}

export function createMapleRig(phase) {
  return { phase, springs: [
    { x:0, v:0, drive:0, mass:1.6, k:10, c:8.4, limit:.8 },
    { x:0, v:0, drive:0, mass:1, k:13, c:6.8, limit:2 },
    { x:0, v:0, drive:0, mass:.45, k:17, c:4.8, limit:5 },
  ] };
}

export function advanceMapleRig(rig, wind, delta) {
  let remaining = clampDelta(delta);
  // Fixed maximum integration step keeps damped springs stable even after a stall.
  while (remaining > 1e-8) {
    const dt = Math.min(remaining, 1/120);
    rig.springs.forEach((s, i) => {
      const phase = rig.phase - i * .65;
      const breeze = Math.sin(wind.time * (.48 + i * .07) + phase);
      const target = s.limit * Math.tanh(breeze * .46 + wind.windX * .12 + wind.gust * .28);
      s.drive += (target - s.drive) * -Math.expm1(-(2.8 - i * .6) * dt);
      const windTorque = s.k * s.drive;
      const acceleration = (windTorque - s.k * s.x - s.c * s.v) / s.mass;
      s.v += acceleration * dt;
      s.x += s.v * dt;
    });
    remaining -= dt;
  }
  return rig.springs.map(s => s.x);
}

export function stepLeaf(leaf, wind, delta, width) {
  let remaining = clampDelta(delta);
  while (remaining > 1e-8) {
    const dt = Math.min(remaining, 1/120);
    // Soft restoring force keeps leaves in the gutter without a visible clamp/snap.
    const edge = leaf.x < 12 ? (12-leaf.x)*9 : leaf.x > width-12 ? (width-12-leaf.x)*9 : 0;
    leaf.vx += (wind.windX * 8 + edge - 1.8 * leaf.vx) * dt;
    leaf.vy += (26 - .65 * leaf.vy) * dt;
    leaf.x += leaf.vx * dt;
    leaf.y += leaf.vy * dt;
    leaf.angle += leaf.spin * dt;
    leaf.age += dt;
    remaining -= dt;
  }
}
