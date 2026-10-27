import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ baseURL: 'http://localhost:3000', viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = []; page.on('pageerror', e => { errors.push(e.message); console.log('BROWSER ERROR',e.message); });
const results = [];
async function check(name, fn) { try { await fn(); } catch (e) { await page.screenshot({path:'docs/bth3/failure.png',fullPage:true}); console.log('FAIL PAGE',page.url(),(await page.locator('body').innerText()).slice(0,1600)); await browser.close(); throw e; } results.push(name); console.log('PASS', name); }
async function login(email,password) {
 await page.goto('/login'); await page.getByLabel('Email', {exact:true}).fill(email); await page.getByLabel('Mật khẩu', {exact:true}).fill(password);
 await page.getByRole('button', { name: 'Đăng nhập', exact:true }).click(); await page.waitForURL('**/dashboard'); await page.waitForLoadState('networkidle');
}
await check('Public home, 4 subjects, SSR HTML, metadata, JSON-LD', async () => {
 await page.goto('/'); await page.screenshot({ path: 'docs/bth3/home.png', fullPage:true });
 assert.equal(await page.locator('.subject-card').count(),4);
 const response = await context.request.get('/deadlines/1'); const source = await response.text();
 assert.ok(source.includes('Xây dựng Class Deadline Hub')); assert.ok(source.includes('BreadcrumbList')); assert.ok(source.includes('og:image'));
 await writeFile('docs/bth3/deadline-1-source.html', source);
 const image = await context.request.get('/deadlines/1/share'); assert.equal(image.status(),200); assert.ok(image.headers()['content-type'].includes('image/png')); await writeFile('docs/bth3/share.png', await image.body());
});
await check('Guest redirects with callback; missing deadline is 404', async () => {
 await page.goto('/dashboard'); assert.ok(page.url().includes('/login?callbackUrl='));
 await page.goto('/admin'); assert.ok(page.url().includes('/login?callbackUrl='));
 const response = await context.request.get('/deadlines/999999'); assert.equal(response.status(),404);
});
await check('Wrong password rejected', async () => {
 await page.goto('/login'); await page.getByLabel('Email',{exact:true}).fill('sv@ptit.edu.vn'); await page.getByLabel('Mật khẩu',{exact:true}).fill('wrong');
 await page.getByRole('button',{name:'Đăng nhập',exact:true}).click(); await page.getByRole('alert').waitFor();
});
await check('Student login, completion persistence, denied admin', async () => {
 await login('sv@ptit.edu.vn','sv123456');
 const card = page.locator('.hub-card').first(); await card.getByRole('button', {name:'Đánh dấu đã xong', exact:true}).click();
 await card.getByRole('button', {name:'✓ Đã xong · Hoàn tác', exact:true}).waitFor(); await page.reload(); await page.waitForLoadState('networkidle');
 await page.locator('.hub-card').first().getByRole('button', {name:'✓ Đã xong · Hoàn tác', exact:true}).click();
 await page.locator('.hub-card').first().getByRole('button', {name:'Đánh dấu đã xong',exact:true}).waitFor();
 await page.goto('/admin'); await page.waitForURL('**/403');
 await page.getByRole('button',{name:'Đăng xuất',exact:true}).click(); await page.waitForURL('http://localhost:3000/');
});
await check('Admin creates detail, updates sitemap, deletes and invalidates cached detail', async () => {
 await login('admin@ptit.edu.vn','admin123'); await page.goto('/admin'); await page.waitForLoadState('networkidle');
 await page.getByLabel('Tiêu đề',{exact:true}).fill('Deadline kiểm thử tự động'); await page.getByLabel('Mô tả',{exact:true}).fill('Dữ liệu kiểm thử tạm thời, tự xoá khi kết thúc.');
 await page.getByLabel('Hạn nộp (giờ Việt Nam)',{exact:true}).fill('2026-12-01T20:30');
 await page.getByRole('button',{name:'+ Thêm deadline',exact:true}).click();
 const card = page.locator('.hub-card').filter({ has: page.getByRole('heading',{name:'Deadline kiểm thử tự động',exact:true}) }); await card.waitFor();
 assert.ok((await card.locator('time').innerText()).includes('20:30'));
 const href = await card.getByRole('link',{name:'Deadline kiểm thử tự động',exact:true}).getAttribute('href');
 const response = await context.request.get(href); assert.equal(response.status(),200);
 const sitemap = await (await context.request.get('/sitemap.xml')).text(); assert.ok(sitemap.includes(href));
 await page.screenshot({path:'docs/bth3/admin.png',fullPage:true});
 await card.getByRole('button',{name:'Xoá deadline',exact:true}).click(); await card.waitFor({state:'detached'});
 assert.equal((await context.request.get(href)).status(),404);
});
await check('Public filter and responsive layout', async () => {
 await page.goto('/deadlines'); await page.getByRole('button',{name:'Cơ sở dữ liệu',exact:true}).click(); assert.equal(await page.locator('.hub-card').count(),3);
 await page.setViewportSize({width:390,height:844}); await page.goto('/'); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
 await page.screenshot({path:'docs/bth3/mobile.png',fullPage:true});
});
await page.goto('/deadlines/1'); await page.setViewportSize({width:1440,height:1000}); await page.screenshot({path:'docs/bth3/detail.png',fullPage:true});
await page.goto('view-source:http://localhost:3000/deadlines/1');
await page.locator('input[type="checkbox"]').check();
await page.screenshot({path:'docs/bth3/view-source.png'});
const buildLog = (await readFile('docs/bth3/build.log','utf8')).replace(/\x1b\[[0-9;]*m/g, '');
await page.goto('about:blank');
await page.setContent(`<html lang="en"><body style="background:#142b25;color:#e4f7ee;padding:28px;font:16px monospace"><h2>$ npm run build</h2><pre>${buildLog.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</pre></body></html>`);
await page.screenshot({path:'docs/bth3/build.png',fullPage:true});
assert.deepEqual(errors, []);
await writeFile('docs/bth3/verification.json', JSON.stringify({results, browserErrors:errors},null,2));
await browser.close();
