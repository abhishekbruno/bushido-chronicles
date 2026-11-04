import test from 'node:test';
import assert from 'node:assert/strict';
import { createMapleRig, advanceMapleRig, rigWeights, stepLeaf, gutterWidth } from '../src/utils/maplePhysics.js';

test('trunk, roots and anatomical joints remain pinned', () => {
  for (const [x, y] of [[110,900],[200,780],[100,520],[240,370],[300,320],[195,610]]) {
    assert.deepEqual(rigWeights(x,y), [0,0,0], `${x},${y}`);
  }
  assert.ok(rigWeights(740,300).some(w => w > 0));
});

test('long-running wind and repeated gusts stay within the requested angles', () => {
  const rig = createMapleRig(0);
  let last = [0,0,0];
  for(let i=0;i<36000;i++) {
    const angles = advanceMapleRig(rig, {time:i/60, windX:1.5, gust:i%240<100?2.5:0}, 1/60);
    angles.forEach((a,j) => {
      assert.ok(Number.isFinite(a));
      assert.ok(Math.abs(a) <= [.8,2,5][j]);
      assert.ok(Math.abs(a-last[j]) < .18, 'no snapping');
    });
    last = [...angles];
  }
});

test('stalled/negative delta cannot jump or reverse the spring', () => {
  const a = createMapleRig(0), b = createMapleRig(0);
  const wind = {time:1, windX:2, gust:2};
  advanceMapleRig(a, wind, 30);
  advanceMapleRig(b, wind, .05);
  assert.deepEqual(a,b);
  const before = structuredClone(a);
  advanceMapleRig(a, wind, -1);
  assert.deepEqual(a,before);
});

test('desktop gutters never take the content column and mobile has no simulation', () => {
  assert.equal(gutterWidth(390),0);
  assert.equal(gutterWidth(1024),0);
  assert.ok(gutterWidth(1440) <= 32);
  assert.ok(gutterWidth(1920) <= 100);
  assert.ok(gutterWidth(2560) <= 420);
});

test('leaf gravity, drag and soft edge force remain finite under a strong gust', () => {
  const leaf = {x:40,y:0,vx:0,vy:10,angle:0,spin:.2,age:0};
  for(let i=0;i<1200;i++) stepLeaf(leaf, {windX:6}, 1/60, 120);
  assert.ok(leaf.y > 100);
  assert.ok(leaf.x > -12 && leaf.x < 132);
  assert.ok(leaf.vy > 0 && leaf.vy < 100);
});
