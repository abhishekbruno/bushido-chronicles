import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
import { preview } from 'vite';

const server=await preview({preview:{host:'127.0.0.1',port:4178,strictPort:true}});
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'msedge',headless:true});
const output='.tmp-warriors/maples';fs.mkdirSync(output,{recursive:true});
try {
  const page=await browser.newPage({viewport:{width:2560,height:1440}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.addInitScript(()=>{
    window.mapleDraws=new WeakMap();
    const draw=WebGLRenderingContext.prototype.drawElements;
    WebGLRenderingContext.prototype.drawElements=function(...args){
      window.mapleDraws.set(this.canvas,(window.mapleDraws.get(this.canvas)||0)+1);
      return draw.apply(this,args);
    };
  });
  await page.goto('http://127.0.0.1:4178/bushido-chronicles/');
  await page.waitForFunction(()=>document.querySelector('.global-maple-background')?.dataset.renderer==='webgl');
  await page.locator('.cinematic-preloader').waitFor({state:'detached'});
  const root=page.locator('.global-maple-background');
  const canvas=page.locator('.global-maple-canvas');
  assert.equal(await root.count(),1);
  assert.equal(await root.evaluate(e=>!!e.closest('main,section,article')),false);
  await canvas.evaluate(c=>window.originalMaple=c);
  const draws=()=>canvas.evaluate(c=>window.mapleDraws.get(c));
  const before=await draws();
  await page.waitForFunction(before=>window.mapleDraws.get(document.querySelector('.global-maple-canvas'))>before+12,before);
  for(const [width,height] of [[2560,1440],[1920,1080],[1440,900],[1024,768],[768,1024],[390,844],[375,667]]) {
    await page.setViewportSize({width,height});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    assert.equal(await root.isVisible(),width>=1280);
    if(width>=1280) assert.equal(await root.getAttribute('data-leaves'),width>=1600?'14':'8');
    await page.locator('#hero').scrollIntoViewIfNeeded();
    await page.screenshot({path:`${output}/hero-${width}.png`});
    console.log(`Maple viewport ${width}x${height} passed`);
  }
  await page.setViewportSize({width:1920,height:1080});
  for(const id of ['legacy','warriors','honor','monument','cta','monument','spirit','bushido','hero']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    assert.equal(await canvas.evaluate(c=>c===window.originalMaple),true,'persistent canvas');
    assert.equal(await root.evaluate(e=>getComputedStyle(e).position),'fixed');
    assert.equal((await root.boundingBox()).y,0);
    const n=await draws();
    await page.waitForFunction(n=>window.mapleDraws.get(window.originalMaple)>n+6,n);
    if(['honor','monument','cta'].includes(id)) await page.screenshot({path:`${output}/${id}-1920.png`});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.global-maple-background').dataset.motion==='reduced');
  const still=await draws();await page.waitForTimeout(200);assert.equal(await draws(),still);
  assert.equal(await root.getAttribute('data-leaves'),'0');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForFunction(n=>window.mapleDraws.get(window.originalMaple)>n+6,still);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  const hidden=await draws();await page.waitForTimeout(200);assert.equal(await draws(),hidden);
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await page.waitForFunction(n=>window.mapleDraws.get(window.originalMaple)>n+6,hidden);
  const baseline=await page.locator('#hero').boundingBox();
  await root.evaluate(e=>e.style.display='none');
  assert.deepEqual(await page.locator('#hero').boundingBox(),baseline,'background cannot alter layout');
  await root.evaluate(e=>e.style.display='');
  // Existing dossiers must still overlay the global background and accept input.
  await page.locator('.warrior-card').first().click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button',{name:'Close warrior dossier'}).click();
  assert.deepEqual(errors,[]);
  console.log('Forward/reverse scrolling, continuous drawing, reduced motion, visibility, layout and dossier checks passed');
} finally {
  await browser.close();server.httpServer.closeAllConnections();
  await new Promise(resolve=>server.httpServer.close(resolve));
}
