import { chromium } from 'playwright';
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
 const page = await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('view-source:http://localhost:3000/deadlines/1');
 await page.locator('input[type="checkbox"]').check();
 await page.screenshot({path:'docs/bth3/view-source.png'});
} finally { await browser.close(); }
