import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('docs/ui', {recursive:true});
const browser = await chromium.launch({channel:'chrome',headless:true});
const page = await browser.newPage();
const results = [];
try {
 for (const [name,path,width,height] of [ ['home-desktop','/',1440,1000], ['home-tablet','/',768,1024], ['home-mobile','/',390,844], ['deadlines-desktop','/deadlines',1440,1000], ['deadlines-mobile','/deadlines',390,844], ['login-desktop','/login',1440,1000], ['login-mobile','/login',390,844], ['detail-desktop','/deadlines/1',1440,1000], ['detail-mobile','/deadlines/1',390,844] ]) {
  await page.setViewportSize({width,height}); await page.goto(`http://localhost:3000${path}`); await page.locator('main').waitFor(); await page.evaluate(() => document.fonts.ready);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name}: viewport overflow`);
  await page.screenshot({path:`docs/ui/${name}.png`,fullPage:true});
  results.push(`${name}: no horizontal page overflow`); console.log('PASS',name);
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://localhost:3000/');
 await page.getByRole('navigation',{name:'Điều hướng chính'}).getByRole('link',{name:'Deadline của lớp',exact:true}).click();
 await page.waitForURL('**/deadlines'); await page.getByRole('heading',{name:'Deadline của lớp',exact:true}).waitFor();
 results.push('Sidebar navigation: passed');
 await writeFile('docs/ui/verification.json',JSON.stringify(results,null,2));
} finally { await browser.close(); }
