import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/?only=honor');
  await page.waitForTimeout(2000);

  const ch3 = await page.$('#honor-ch3');
  if (ch3) {
    await ch3.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'ch3_current.png' });
    console.log('Saved ch3_current.png');
  }

  const ch4 = await page.$('#honor-ch4');
  if (ch4) {
    await ch4.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'ch4_current.png' });
    console.log('Saved ch4_current.png');
  }

  await browser.close();
}

main().catch(console.error);

