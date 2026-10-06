import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] });
const results = [];
for (const mode of ['baseline', 'optimized']) {
 const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
 page.on('pageerror', error => console.error(error.message));
 await page.goto(`http://localhost:5173/benchmark?mode=${mode}`);
 await page.getByRole('article').first().waitFor({ timeout: 120000 });
 await page.waitForTimeout(1000);
 const mounted = await page.getByRole('article').count();
 if ((mode === 'baseline' && mounted !== 10000) || (mode === 'optimized' && mounted >= 20)) throw new Error('Invalid stress fixture');
 await page.evaluate(() => { window.assignmentMetrics = { cardRenders: 0, commits: 0, duration: 0 }; });
 await page.getByLabel('Tìm kiếm bài tập').pressSequentially('Bài', { delay: 100 });
 await page.waitForTimeout(600);
 const search = await page.evaluate(() => window.assignmentMetrics);
 await page.evaluate(() => { window.assignmentMetrics = { cardRenders: 0, commits: 0, duration: 0 }; });
 await page.getByRole('button', { name: /Chủ đề/ }).click();
 const theme = await page.evaluate(() => window.assignmentMetrics);
 await page.screenshot({ path: `docs/performance/${mode}.png` });
 results.push({ mode, mounted, search, theme });
 await page.close();
}
await fs.writeFile('docs/performance/render-results.json', JSON.stringify(results, null, 2));
console.log(results);
await browser.close();
