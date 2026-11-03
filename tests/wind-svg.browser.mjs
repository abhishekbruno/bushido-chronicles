import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
try {
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [width,height] of [[1440,1000],[768,1024],[390,844]]) {
  await page.setViewportSize({width,height});await page.goto(`${process.env.WIND_TEST_URL||'http://localhost:5175'}/?only=legacy`);
  const art=page.locator('.legacy-cinematic-poster');await art.scrollIntoViewIfNeeded();await page.waitForTimeout(400);
  const chime=page.locator('#BellAndCordAssembly');
  const first=await chime.getAttribute('transform');await page.waitForTimeout(250);assert.notEqual(await chime.getAttribute('transform'),first);
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(50);const still=await chime.getAttribute('transform');await page.waitForTimeout(200);assert.equal(await chime.getAttribute('transform'),still);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(100);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))});
  const hidden=await chime.getAttribute('transform');await page.waitForTimeout(200);assert.equal(await chime.getAttribute('transform'),hidden);
  assert.equal(await page.locator('.zen-sun-breathe-container').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});await page.waitForTimeout(250);assert.notEqual(await chime.getAttribute('transform'),hidden);
  console.log('Legacy chime and CSS lifecycle',width);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
