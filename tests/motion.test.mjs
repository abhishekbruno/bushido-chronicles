import test from 'node:test';
import assert from 'node:assert/strict';
import wind from '../src/utils/windSystem.js';

test('retriggering a gust does not collapse the current force', () => {
  wind.triggerGust(1);
  for (let i=0;i<60;i++) wind.update(1/60);
  const before=wind.gust;
  wind.triggerGust(1.8);
  wind.update(1/60);
  assert.ok(Math.abs(wind.gust-before)<0.08, `${before} -> ${wind.gust}`);
});

test('negative and stalled timestamps cannot reverse or jump wind time', () => {
  const before=wind.time;
  wind.update(-1);
  assert.equal(wind.time,before);
  wind.update(10);
  assert.ok(wind.time-before<=0.05+1e-12+1e-12);
});

test('motion clock preserves phase through pause and clamps stalls', async () => {
  const {createMotionClock,damp}=await import('../src/utils/motion.js');
  const clock=createMotionClock();
  assert.equal(clock.tick(1000).dt,0);
  assert.ok(Math.abs(clock.tick(1016).dt-.016)<1e-9);
  clock.pause();
  assert.equal(clock.tick(60000).dt,0);
  assert.equal(clock.time,.016);
  assert.ok(clock.tick(61000).dt<=.05);
  assert.equal(clock.tick(60000).dt,0);
  let a=0,b=0;
  for(let i=0;i<30;i++) a=damp(a,1,5,1/30);
  for(let i=0;i<144;i++) b=damp(b,1,5,1/144);
  assert.ok(Math.abs(a-b)<1e-10);
});

test('cloth attachments are fixed and edge velocity is bounded', async () => {
  const {clothOffset}=await import('../src/utils/cloth.js');
  for(let t=0;t<20;t+=1/60){
    assert.ok(Math.abs(clothOffset(1,t,1,10,1.4))<1e-12);
    const delta=clothOffset(0,t+1/60,1,10,1.4)-clothOffset(0,t,1,10,1.4);
    assert.ok(Math.abs(delta)<.8);
  }
});

test('repeated gust requests preserve the active envelope phase', () => {
  const w = new wind.constructor();
  w.triggerGust(1);
  for (let i=0;i<45;i++) w.update(1/60);
  for (let i=0;i<20;i++) {
    const age=w.gustTimer;
    w.triggerGust(1.8);
    assert.equal(w.gustTimer,age);
    w.update(1/60);
  }
});
