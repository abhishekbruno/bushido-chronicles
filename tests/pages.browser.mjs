import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { preview } from 'vite';
import fs from 'node:fs';

// Exercise the built site under the same subdirectory used on GitHub Pages.
const server = await preview({ preview: { host: '127.0.0.1', port: 4174, strictPort: true } });
const base = 'http://127.0.0.1:4174/bushido-chronicles/';
let browser;
try {
  const html = await (await fetch(base)).text();
  const script = html.match(/<script[^>]+src="([^"]+)"/)[1];
  const bundle = await fetch(new URL(script, base));
  assert.match(bundle.headers.get('content-type'), /javascript/, 'Production JS must not fall back to HTML');
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
  const page = await browser.newPage();
  await page.addInitScript(() => {
    window.drawCounts = new WeakMap();
    const original = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      window.drawCounts.set(this.canvas, (window.drawCounts.get(this.canvas) || 0) + 1);
      return original.apply(this, args);
    };
  });
  const errors = [];
  const rootAssetRequests = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.origin === new URL(base).origin && !url.pathname.startsWith('/bushido-chronicles/')) rootAssetRequests.push(url.pathname);
  });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', request => errors.push(`${request.failure()?.errorText} ${request.url()}`));
  await page.goto(base);
  await page.locator('.warrior-living-canvas.is-ready').first().waitFor();
  assert.equal(await page.locator('.warrior-living-canvas.is-ready').count(), 4);
  await page.locator('.cinematic-preloader').waitFor({ state: 'detached' });
  fs.mkdirSync('.tmp-warriors/pages', { recursive: true });
  const sections = ['hero', 'legacy', 'bushido', 'warriors', 'blade', 'spirit', 'honor', 'monument', 'final-legacy', 'cta'];
  for (const [width, height] of [[2560,1440],[1920,1080],[1440,900],[1024,768],[768,1024],[390,844],[375,667]]) {
    await page.setViewportSize({ width, height });
    for (const id of sections) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      assert.ok(await section.isVisible(), `${id} visible at ${width}`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `overflow ${id} at ${width}`);
    }
    await page.locator('img').evaluateAll(async images => {
      for (const image of images) await image.decode();
    });
    assert.ok(await page.locator('.bc-creator-watermark').isVisible());
    await page.screenshot({ path: `.tmp-warriors/pages/legacy-${width}.png` });
    await page.locator('.bc-footer-bottom').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `.tmp-warriors/pages/footer-${width}.png` });
    await page.locator('#hero').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `.tmp-warriors/pages/hero-${width}.png` });
    // Menu navigation uses the same anchors at desktop and mobile widths.
    const menu = page.getByRole('button', { name: 'Toggle navigation menu' });
    if (await menu.isVisible()) {
      await menu.click();
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      await page.locator('.mobile-menu-overlay a[href="#legacy"]').click();
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    } else {
      await page.locator('.navbar-desktop-nav a[href="#legacy"]').click();
    }
    await page.waitForFunction(() => Math.abs(document.getElementById('legacy').getBoundingClientRect().top) < 160);
    console.log(`Sections, decoded images, navigation and overflow passed: ${width}x${height}`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  for (let i = 0; i < 4; i++) {
    const card = page.locator('.warrior-card').nth(i);
    await card.scrollIntoViewIfNeeded();
    await card.focus();
    await page.keyboard.press(i % 2 ? 'Space' : 'Enter');
    await page.getByRole('dialog').waitFor();
    assert.equal(await page.locator('.modal-warrior-name').innerText(), await card.locator('h3').innerText());
    await page.getByRole('button', { name: 'Close warrior dossier' }).click();
  }
  console.log('Four keyboard-operated warrior dossiers passed');
  for (const selector of ['.honor-dilemma-selector-bar', '.honor-principles-tablist', '.spirit-stories-selector']) {
    const tabs = page.locator(`${selector} button`);
    assert.ok(await tabs.count() > 1);
    for (let i = 0; i < await tabs.count(); i++) {
      await tabs.nth(i).click();
      await page.waitForFunction(({ selector, i }) => document.querySelectorAll(`${selector} button`)[i].getAttribute('aria-selected') === 'true', { selector, i });
      if (selector === '.honor-dilemma-selector-bar') {
        await page.waitForFunction(() => getComputedStyle(document.querySelector('.honor-conflict-parchment-stage')).opacity === '1');
      }
    }
  }
  for (const tab of await page.locator('.era-tab').all()) {
    await tab.click();
    assert.match(await tab.getAttribute('class'), /active/);
  }
  for (const tab of await page.locator('.bushido-panel').all()) {
    await tab.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await tab.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(el => el.getAttribute('aria-selected') === 'true', await tab.elementHandle());
  }
  console.log('Historical cases, honor principles, landscapes, eras and seven Bushido virtues passed');
  const blades = page.locator('.museum-collection-item');
  for (let i = 0; i < await blades.count(); i++) {
    const blade = blades.nth(i);
    await blade.scrollIntoViewIfNeeded();
    // Let the scroll-driven exhibit settle before testing explicit selection.
    await page.evaluate(() => new Promise(resolve => {
      let last = scrollY, stable = 0;
      function frame() {
        stable = scrollY === last ? stable + 1 : 0;
        last = scrollY;
        if (stable >= 8) resolve(); else requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }));
    await blade.click();
    await page.waitForFunction(i => document.querySelectorAll('.museum-collection-item')[i].getAttribute('aria-pressed') === 'true', i);
  }
  for (const control of await page.getByRole('group', { name: 'Blade viewer controls' }).locator('button[aria-pressed]').all()) {
    const before = await control.getAttribute('aria-pressed');
    await control.click();
    assert.notEqual(await control.getAttribute('aria-pressed'), before);
  }
  await page.getByRole('button', { name: 'CURATOR NOTES', exact: true }).click();
  await page.getByRole('button', { name: 'Close curator notes', exact: true }).click();
  console.log('Five blade exhibits, saya, measurements, zoom and curator notes passed');
  // The existing design starts with two demonstration seals. Clear them first.
  const releasedSeals = page.getByRole('button', { name: /^Release seal for/ });
  while (await releasedSeals.count()) await releasedSeals.first().click();
  assert.equal((await page.locator('.ms4-counter-num').innerText()).trim(), '0 / 6');
  for (const seal of await page.locator('.ms4-hanko-seal').all()) await seal.click();
  assert.equal((await page.locator('.ms4-counter-num').innerText()).trim(), '6 / 6');
  for (const selector of ['.warrior-living-canvas', '.ronin-cape-anchor canvas']) {
    const canvas = page.locator(selector).first();
    await canvas.scrollIntoViewIfNeeded();
    const before = await canvas.evaluate(c => window.drawCounts.get(c) || 0);
    await page.waitForFunction(({ selector, before }) => window.drawCounts.get(document.querySelector(selector)) > before + 2, { selector, before });
    assert.ok(await canvas.evaluate(c => c.getContext('2d').getImageData(0, 0, c.width, c.height).data.some((v, i) => i % 4 === 3 && v > 0)));
  }
  await page.locator('.ms4-hanko-seal').first().click();
  assert.equal((await page.locator('.ms4-counter-num').innerText()).trim(), '5 / 6');
  await page.locator('.ms4-seal-btn').click();
  assert.equal((await page.locator('.ms4-counter-num').innerText()).trim(), '6 / 6');
  const missingAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(a => a.getAttribute('href')).filter(href => href !== '#' && !document.getElementById(href.slice(1))));
  assert.deepEqual(missingAnchors, []);
  assert.match(await page.locator('.bc-footer-bottom').innerText(), /2026 Abhishek Bruno/);
  assert.equal(await page.locator('.bc-footer-creator-links a').first().getAttribute('href'), 'https://github.com/abhishekbruno');
  // Decode every shipped PNG/SVG, including layers loaded only by canvases or inactive scenes.
  const artwork = fs.readdirSync('public', { recursive: true }).map(p => p.replaceAll('\\', '/')).filter(p => /\.(png|svg)$/.test(p));
  await page.evaluate(async ({ base, artwork }) => {
    for (const file of artwork) { const image = new Image(); image.src = base + file; await image.decode(); }
  }, { base, artwork });
  assert.deepEqual(rootAssetRequests, []);
  assert.deepEqual(errors, []);
  console.log(`Production interactions, ${artwork.length} artwork decodes, all anchors and attribution passed; no browser/network errors`);
} finally {
  await browser?.close();
  server.httpServer.closeAllConnections();
  await new Promise(resolve => server.httpServer.close(resolve));
}
