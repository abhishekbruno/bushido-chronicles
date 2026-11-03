import assert from 'node:assert/strict';
import fs from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.WIND_TEST_URL || 'http://localhost:5175';
fs.mkdirSync('.tmp-warriors/wind', {recursive:true});
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'msedge',headless:true});
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.addInitScript(()=>{
 window.canvasDrawCounts=new WeakMap();const clear=CanvasRenderingContext2D.prototype.clearRect;
 CanvasRenderingContext2D.prototype.clearRect=function(...args){window.canvasDrawCounts.set(this.canvas,(window.canvasDrawCounts.get(this.canvas)||0)+1);return clear.apply(this,args);};
});
page.on('pageerror',e=>errors.push(e.stack));
page.on('console',m=>{if(m.type()==='error') errors.push(m.text())});
const pause=ms=>page.waitForTimeout(ms);
const hash=locator=>locator.evaluate(c=>{
 const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let h=2166136261;
 for(let i=0;i<d.length;i+=13) h=Math.imul(h^d[i],16777619);
 return h>>>0;
});
const sections=[['hero','.samurai-scene-hero'],['legacy','.legacy-cinematic-poster'],['warriors','.warriors-grid'],['honor','.honor-samurai-figure-mount'],['spirit','.sakura-falling-petals-canvas'],['monument','.bc-monument-scene-panoramic'],['cta','.bc-ronin-scene-wrapper']];
const results=[];
try {
 for(const [width,height] of (process.env.WIND_INTEGRATION_ONLY ? [] : [[1440,1000],[768,1024],[390,844]])) {
  await page.setViewportSize({width,height});
  for(const [id,selector] of sections) {
   await page.goto(`${base}/?only=${id}`); await pause(900);
   let art=page.locator(selector).first();if(!await art.count()) art=page.locator('main section').first();
   await art.scrollIntoViewIfNeeded(); await pause(650);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`overflow ${id} ${width}`);
   assert.equal(await page.locator('img').evaluateAll(es=>es.some(e=>e.complete&&e.naturalWidth===0)),false,`missing image ${id}`);
   const canvas=art.locator('canvas').first();
   const target=(await canvas.count())?canvas:(await art.evaluate(e=>e.tagName==='CANVAS')?art:null);
   if(target) {
    const first=await hash(target);await pause(250);assert.notEqual(await hash(target),first,`animation ${id} ${width}`);
    await page.emulateMedia({reducedMotion:'reduce'});await pause(100);
    const still=await hash(target);await pause(250);assert.equal(await hash(target),still,`reduced motion ${id}`);
    await page.emulateMedia({reducedMotion:'no-preference'});await pause(120);
    // Synthetic visibility event exercises the same lifecycle used by tab switches.
    await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
    await pause(50);const hidden=await hash(target);await pause(180);assert.equal(await hash(target),hidden,`hidden ${id}`);
    await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await pause(180);
    assert.notEqual(await hash(target),hidden,`resume ${id}`);
    await page.evaluate(async()=>{const {windSystem}=await import('/src/utils/windSystem.js');windSystem.triggerGust(1.8);});
    await pause(450);
    await art.screenshot({path:`.tmp-warriors/wind/${id}-${width}-gust.png`,animations:'allow'});
   }
   await art.screenshot({path:`.tmp-warriors/wind/${id}-${width}.png`,animations:'allow'});
   results.push({id,width,animation:!!target,reducedMotion:!!target,hiddenResume:!!target});
  }
  console.log('sections passed',width);
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(`${base}/?only=warriors`);await pause(1200);
 for(let i=0;i<4;i++) {
  const card=page.locator('.warrior-card').nth(i);await card.scrollIntoViewIfNeeded();await card.hover();await pause(200);
  await card.focus();await page.keyboard.press(i%2?'Space':'Enter');await page.getByRole('dialog').waitFor();
  assert.equal(await page.locator('.modal-warrior-name').innerText(),await card.locator('h3').innerText());
  await page.getByRole('button',{name:'Close warrior dossier'}).click();
 }
 // Seam test: continuous deformation must not punch gaps or darken translucent columns.
 const cloth=await page.evaluate(async()=>{
  const {drawWindCloth}=await import('/src/utils/cloth.js');
  const source=document.createElement('canvas');source.width=160;source.height=120;
  const s=source.getContext('2d');s.fillStyle='rgba(0,0,0,.5)';s.fillRect(0,20,160,80);
  const dest=document.createElement('canvas');dest.width=160;dest.height=120;const c=dest.getContext('2d');
  let min=255,max=0;
  for(let t=0;t<12;t+=.1){c.clearRect(0,0,160,120);drawWindCloth(c,source,{width:160,height:120,root:120,time:t,gust:1.4});
   const data=c.getImageData(0,45,160,20).data;for(let i=3;i<data.length;i+=4){min=Math.min(min,data[i]);max=Math.max(max,data[i]);}}
  return {min,max};
 });
 assert.ok(cloth.min>=126&&cloth.max<=129,JSON.stringify(cloth));
 // Global gust continuity under repeated clicks, then a stalled main thread.
 const gust=await page.evaluate(async()=>{
  const {windSystem:w}=await import('/src/utils/windSystem.js');w.triggerGust(1.8);
  await new Promise(r=>setTimeout(r,900));const before=w.gust;w.triggerGust(2);await new Promise(requestAnimationFrame);return {before,after:w.gust};
 });assert.ok(Math.abs(gust.after-gust.before)<.16,JSON.stringify(gust));
 const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 const frames=await page.evaluate(()=>new Promise(resolve=>{const samples=[];let last;function frame(t){if(last)samples.push(t-last);last=t;if(samples.length<45)requestAnimationFrame(frame);else resolve(samples)}requestAnimationFrame(frame)}));
 await page.evaluate(()=>{const until=performance.now()+500;while(performance.now()<until){};});await pause(200);
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
 // Full-page offscreen freezing, re-entry, CSS pause and multiple rapid scroll passes.
 await page.goto(`${base}/?nopreloader`);await pause(3500);
 const ronin=page.locator('.bc-ronin-scene-wrapper');await ronin.scrollIntoViewIfNeeded();await pause(200);
 const roninCanvas=ronin.locator('canvas').first();await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await pause(250);
 await page.waitForFunction(()=>document.querySelector('.bc-ronin-scene-wrapper').getBoundingClientRect().top>innerHeight);
 const draws=await roninCanvas.evaluate(c=>window.canvasDrawCounts.get(c));
 // Chromium may migrate GPU-backed canvas storage on first readback; count actual draws.
 await hash(roninCanvas);await hash(roninCanvas);const frozen=await hash(roninCanvas);
 await pause(250);assert.equal(await roninCanvas.evaluate(c=>window.canvasDrawCounts.get(c)),draws,'offscreen canvas draw count');
 assert.equal(await page.locator('#cta').getAttribute('data-motion-paused'),'true');
 for(let pass=0;pass<2;pass++)for(const id of ['warriors','honor','spirit','monument','cta','hero']){await page.locator(`#${id}`).scrollIntoViewIfNeeded();await pause(90);}
 await ronin.scrollIntoViewIfNeeded();await pause(200);assert.notEqual(await hash(roninCanvas),frozen,'offscreen resume');
 // Resizing and live reduced motion keep all illustrations painted.
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:430,height:900});await pause(200);
 assert.ok(await roninCanvas.evaluate(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0)));
 assert.deepEqual(errors,[]);
 const report={results,cloth,gust,throttledFrameMs:{median:frames.sort((a,b)=>a-b)[22],max:Math.max(...frames)},dossiers:4,offscreen:true,rapidScroll:true,resize:true,errors};
 fs.writeFileSync('.tmp-warriors/wind/verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
} finally {await browser.close();}
