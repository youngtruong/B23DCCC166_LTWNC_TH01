import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { writeFile } from 'node:fs/promises';
const chrome = await launch({ chromePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', chromeFlags: ['--headless=new','--no-sandbox'] });
const summary = [];
try {
  for (const [name, path] of [['home','/'],['detail','/deadlines/1']]) {
    const result = await lighthouse(`http://localhost:3000${path}`, { port: chrome.port, output: ['html','json'], onlyCategories: ['performance','accessibility','best-practices','seo'], logLevel:'error' });
    await writeFile(`docs/bth3/lighthouse-${name}.html`,result.report[0]);
    await writeFile(`docs/bth3/lighthouse-${name}.json`,result.report[1]);
    const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([key,value]) => [key,Math.round(value.score*100)]));
    summary.push({path,scores,date:result.lhr.fetchTime}); console.log(path,scores);
  }
  await writeFile('docs/bth3/lighthouse-summary.json',JSON.stringify(summary,null,2));
} finally { await chrome.kill(); }
