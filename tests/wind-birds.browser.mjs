import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto(process.env.WIND_TEST_URL ? `${process.env.WIND_TEST_URL}/?only=cta` : 'http://localhost:5175/?only=cta');
 await page.locator('.bc-ronin-scene-wrapper').scrollIntoViewIfNeeded();await page.waitForTimeout(600);
 for(const reducedMotion of ['no-preference','reduce']) {
  await page.emulateMedia({reducedMotion});await page.waitForTimeout(100);
  const positions=await page.locator('.bc-ronin-bird-soar').evaluateAll(es=>es.map(e=>({x:e.getCTM().e,y:e.getCTM().f})));
  assert.equal(positions.length,5);assert.ok(positions.every(p=>p.x>400&&p.y>50),JSON.stringify({reducedMotion,positions}));
 }
 console.log('Bird placement survives animation and reduced motion');
} finally {await browser.close();}
