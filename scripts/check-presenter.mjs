import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createAdminCredentials } from './admin-credentials.mjs';
import { presenterServer } from './presenter-server.mjs';

/* global document,window,innerWidth,getComputedStyle */
const base = 'http://localhost:4297', credentials = await createAdminCredentials(base);
const env = { ...credentials.env, ADMIN_RATE_LIMIT_READY: 'true' };
// Build with canary secrets present. None may enter browser files.
const buildEnv = { ...process.env, ...env, ADMIN_CODE: credentials.code };
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '-b'], { env: buildEnv, stdio: 'pipe' });
execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], { env: buildEnv, stdio: 'pipe' });
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
const forbidden = [credentials.code, credentials.code.replaceAll('-', ''), env.ADMIN_CODE_HASH, env.ADMIN_SESSION_SECRET];
for (const file of walk('dist')) { const data = fs.readFileSync(file); for (const value of forbidden) assert(!data.includes(Buffer.from(value)), 'Secret leaked into browser artifact'); }
const headers = Object.fromEntries(JSON.parse(fs.readFileSync('vercel.json', 'utf8')).headers.filter(v => v.source === '/(.*)').flatMap(v => v.headers.map(h => [h.key, h.value])));
const dist = path.resolve('dist'), mime = { '.js': 'application/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ogg': 'audio/ogg', '.ttf': 'font/ttf' };
const server = await presenterServer({ env, port: 4297, headers, fallback(req, res) {
  let target = path.resolve(dist, '.' + decodeURIComponent(new URL(req.url, base).pathname));
  if (!target.startsWith(dist + path.sep) && target !== dist) { res.writeHead(400); res.end(); return; }
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) target = path.join(dist, 'index.html');
  res.writeHead(200, { 'Content-Type': mime[path.extname(target)] ?? 'application/octet-stream' }); fs.createReadStream(target).pipe(res);
} });
const runtime = process.env.RUNTIME_NODE_MODULES || path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const { chromium } = createRequire(path.join(runtime, 'package.json'))('playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || path.join(process.env.USERPROFILE, 'AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe') });
const output = path.resolve('output/qa'), screenshots = [], errors = [], checks = [];
fs.mkdirSync(output, { recursive: true });
function watch(p) { p.on('pageerror', e => errors.push(e.message)); p.on('console', m => { if (m.type() === 'error' && /Content Security Policy/i.test(m.text())) errors.push(m.text()); }); }
async function shot(p, name, fullPage = false) {
  await p.evaluate(() => document.fonts.ready); assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name + ' overflows');
  const filename = path.join(output, name + '.png'); await p.screenshot({ path: filename, fullPage }); screenshots.push(filename);
}
try {
  for (const width of [1366, 768, 360]) {
    const context = await browser.newContext({ viewport: { width, height: width === 360 ? 800 : 900 }, isMobile: width === 360, hasTouch: width === 360 });
    await context.addInitScript(() => {
      localStorage.setItem('mln131-restoration-save-v3', 'keep-v3'); localStorage.setItem('mln131-council-save-v2', 'keep-v2'); localStorage.setItem('mln131-escape-save-v1', 'keep-v1');
      localStorage.setItem('mln131-council-settings-v1', JSON.stringify({ muted: false, music: 0, effects: .4, reducedMotion: false }));
      const get = Storage.prototype.getItem, set = Storage.prototype.setItem; window.__storageAccess = []; window.__sounds = [];
      Storage.prototype.getItem = function(key) { window.__storageAccess.push(['read', key]); return get.call(this, key); };
      Storage.prototype.setItem = function(key, value) { window.__storageAccess.push(['write', key]); return set.call(this, key, value); };
      const NativeAudio = window.Audio; window.Audio = function(src) { if (src) window.__sounds.push(src); return src ? new NativeAudio(src) : new NativeAudio(); };
    });
    const p = await context.newPage(); watch(p); await p.goto(base + '/admin'); await p.getByLabel('Mã truy cập').waitFor(); await shot(p, 'presenter-login-' + width);
    await p.getByLabel('Mã truy cập').fill(credentials.code); await p.getByRole('button', { name: 'Mở bảng thuyết trình' }).click(); await p.getByRole('button', { name: 'Trình diễn Khởi nguyên' }).waitFor(); await shot(p, 'presenter-board-' + width, true);
    const cookies = await context.cookies(); assert.equal(cookies.length, 1); assert(cookies[0].httpOnly && cookies[0].secure && cookies[0].sameSite === 'Strict');
    for (const title of ['Khởi nguyên', 'Sứ mệnh', 'Chuyển mình', 'Quyền làm chủ', 'Toàn thư viện']) {
      const trigger = p.getByRole('button', { name: 'Trình diễn ' + title }); await trigger.click(); const dialog = p.getByRole('dialog'); await dialog.waitFor();
      if (title === 'Toàn thư viện' && width === 1366) {
        await shot(p, 'finale-start-1366'); await p.waitForTimeout(3000); await shot(p, 'finale-converge-1366'); await p.waitForTimeout(2600); await shot(p, 'finale-light-1366');
        assert.equal(await dialog.getByRole('button', { name: 'Phát lại', exact: true }).count(), 0);
        await dialog.getByRole('button', { name: 'Phát lại', exact: true }).waitFor();
        assert.equal(await p.evaluate(() => window.__sounds.filter(s => s === '/audio/final.ogg').length), 1);
        assert.equal(await p.evaluate(() => window.__sounds.filter(s => s === '/audio/connect.ogg').length), 1);
      } else await dialog.getByRole('button', { name: 'Bỏ qua hiệu ứng' }).click();
      if (title === 'Toàn thư viện') {
        await shot(p, 'finale-ready-' + width);
        assert.equal(await p.locator('.finale-stage').evaluate(e => e.classList.contains('uses-fallback')), false);
        const cta = await dialog.getByRole('button', { name: 'Về bảng thuyết trình' }).boundingBox(); assert(cta && cta.y >= 0 && cta.y + cta.height <= (width === 360 ? 800 : 900));
        const visible = await p.locator('.finale-particles i').evaluateAll(items => items.filter(e => getComputedStyle(e).display !== 'none').length); assert(visible <= (width === 360 ? 28 : 60));
      }
      if (title === 'Khởi nguyên') { await dialog.getByRole('button', { name: 'Phát lại', exact: true }).click(); await dialog.getByRole('button', { name: 'Bỏ qua hiệu ứng' }).click(); }
      await p.keyboard.press('Escape'); assert.equal(await dialog.count(), 0); assert.equal(await trigger.evaluate(e => e === document.activeElement), true); assert.equal(await p.evaluate(() => document.body.style.overflow), '');
    }
    const access = await p.evaluate(() => window.__storageAccess.filter(([, key]) => ['mln131-restoration-save-v3', 'mln131-council-save-v2', 'mln131-escape-save-v1'].includes(key))); assert.deepEqual(access, []);
    await p.reload(); await p.getByRole('button', { name: 'Trình diễn Khởi nguyên' }).waitFor(); assert.equal(await p.getByRole('dialog').count(), 0);
    await p.getByRole('button', { name: 'Khóa', exact: true }).click(); await p.getByLabel('Mã truy cập').waitFor(); assert.equal((await context.cookies()).length, 0);
    checks.push(`${width}px: real authentication/cookie, 5 effects, replay, Escape/focus/scroll, reload/logout, zero game-save access`); await context.close();
  }
  const reduced = await browser.newContext({ viewport: { width: 360, height: 800 }, reducedMotion: 'reduce' }); const p = await reduced.newPage(); watch(p); await p.goto(base + '/admin'); await p.getByLabel('Mã truy cập').fill(credentials.code); await p.getByRole('button', { name: 'Mở bảng thuyết trình' }).click(); await p.getByRole('button', { name: 'Trình diễn Toàn thư viện' }).click(); await p.getByRole('dialog').getByRole('button', { name: 'Phát lại', exact: true }).waitFor(); assert.equal(await p.locator('.finale').getAttribute('data-state'), 'ready'); await shot(p, 'finale-reduced-360'); await reduced.close();
  // Stand-in for the external WAF locally; the production rule is a separate deployment prerequisite.
  const attempts = []; for (let n = 0; n < 2; n++) attempts.push((await fetch(base + '/api/presenter/login', { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json' }, body: JSON.stringify({ code: 'invalid' }) })).status);
  assert.equal(attempts.at(-1), 429); checks.push('Local limiter returns429; canary secrets absent from production browser files; OS reduced motion');
  assert.deepEqual(errors, []); fs.writeFileSync(path.join(output, 'presenter-report.json'), JSON.stringify({ passed: true, checks, screenshots, errors, vercelProductionTested: false, realAdminCodeUsed: false }, null, 2));
  console.log(JSON.stringify({ passed: true, checks, screenshots: screenshots.length, errors, vercelProductionTested: false }, null, 2));
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
