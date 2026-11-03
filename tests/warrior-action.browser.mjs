import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto(`${process.env.WARRIOR_TEST_URL||'http://localhost:5175'}/?only=warriors`);
 await page.locator('.warriors-grid').scrollIntoViewIfNeeded();await page.locator('.warrior-living-canvas.is-ready').nth(3).waitFor();await page.waitForTimeout(800);
 const results=await page.evaluate(async()=>{
  const canvases=[...document.querySelectorAll('.warrior-living-canvas')];const ids=['musashi','nobunaga','masamune','yukimura'];
  const bodies=await Promise.all(ids.map(id=>new Promise(resolve=>{const image=new Image();image.onload=()=>{const c=document.createElement('canvas');c.width=666;c.height=870;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);resolve(ctx.getImageData(0,0,666,870).data)};image.src=`/images/warriors_concept/warrior_body_${id}.png`})));
  const snapshot=()=>canvases.map(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data);
  snapshot();snapshot();const before=snapshot();await new Promise(r=>setTimeout(r,800));const after=snapshot();
  return before.map((a,j)=>{let solid=0,stable=0,changed=0;for(let i=0;i<a.length;i+=4){const delta=Math.abs(a[i]-after[j][i])+Math.abs(a[i+1]-after[j][i+1])+Math.abs(a[i+2]-after[j][i+2]);if(delta>5)changed++;if(bodies[j][i+3]===255){solid++;if(delta<12)stable++;}}return {id:ids[j],stable:stable/solid,changed}});
 });
 for(const result of results){assert.ok(result.stable>.985,JSON.stringify(result));assert.ok(result.changed>50,JSON.stringify(result));}
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
 const a=await page.locator('canvas').evaluateAll(es=>es.map(e=>e.toDataURL()));await page.waitForTimeout(200);assert.deepEqual(await page.locator('canvas').evaluateAll(es=>es.map(e=>e.toDataURL())),a);
 console.log('Anchored opaque body pixels and moving cloth:',JSON.stringify(results));
}finally{await browser.close();}
