import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
const base=process.env.WARRIOR_TEST_URL||'http://localhost:5175';
try {
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${base}/?only=warriors`);
 for(const [width,height] of [[1920,1080],[1440,900],[768,1024],[390,844]]) {
  await page.setViewportSize({width,height});await page.locator('.warrior-living-canvas.is-ready').first().waitFor();
  assert.equal(await page.locator('.warrior-living-canvas.is-ready').count(),4);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  for(let i=0;i<4;i++) {
   const card=page.locator('.warrior-card').nth(i);await card.scrollIntoViewIfNeeded();await card.focus();await page.keyboard.press(i%2?'Space':'Enter');
   await page.getByRole('dialog').waitFor();assert.equal(await page.locator('.modal-warrior-name').innerText(),await card.locator('h3').innerText());
   await page.getByRole('button',{name:'Close warrior dossier'}).click();
  }
  console.log('Warrior dossiers and keyboard',width);
 }
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
 const mobile=await touch.newPage();await mobile.goto(`${base}/?only=warriors`);await mobile.locator('.warrior-card').first().tap();await mobile.getByRole('dialog').waitFor();
 await mobile.getByRole('button',{name:'Close warrior dossier'}).tap();assert.deepEqual(errors,[]);console.log('Touch passed; no page errors');
}finally{await browser.close();}
