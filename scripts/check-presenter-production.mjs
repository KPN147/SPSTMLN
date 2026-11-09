import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createInterface } from 'node:readline';

// Read the real access code through stdin only. Never echo, save, screenshot or log it.
const base = process.env.PRESENTER_URL || 'https://spstmln-rho.vercel.app';
if (process.stdin.isTTY) process.stdin.setRawMode(true);
const input = createInterface({ input: process.stdin, terminal: false });
console.log('Waiting for private test input.');
const code = await new Promise(resolve => input.once('line', line => { if (process.stdin.isTTY) process.stdin.setRawMode(false); input.close(); resolve(line.trim()); }));
const checks = [], output = path.resolve('output/qa'); fs.mkdirSync(output, { recursive: true });
const post = (action, body, headers = {}) => fetch(`${base}/api/presenter/${action}`, { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
const unauthenticated = await fetch(base + '/api/presenter/session'); assert.equal(unauthenticated.status, 401); assert(unauthenticated.headers.get('content-type').includes('application/json'));
assert.equal((await post('play', { effect: 'finale' })).status, 401);
const login = await post('login', { code }); assert.equal(login.status, 200, 'Production login failed');
const setCookie = login.headers.get('set-cookie'), cookie = setCookie.split(';')[0], session = await login.json();
for (const flag of ['Secure', 'HttpOnly', 'SameSite=Strict', 'Max-Age=7200']) assert(setCookie.includes(flag));
assert.equal((await post('play', { effect: 'finale' }, { Cookie: cookie })).status, 403);
for (const effect of ['room-1', 'room-2', 'room-3', 'room-4', 'finale']) assert.equal((await post('play', { effect }, { Cookie: cookie, 'X-Presenter-CSRF': session.csrf })).status, 200);
checks.push('Production JSON API, real-code login, hardened cookie, session/CSRF enforcement, all5 authorized effects');

const runtime = process.env.RUNTIME_NODE_MODULES || path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const { chromium } = createRequire(path.join(runtime, 'package.json'))('playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || path.join(process.env.USERPROFILE, 'AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe') });
const errors = [], screenshots = [];
try {
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const at = cookie.indexOf('='); await context.addCookies([{ name: cookie.slice(0, at), value: cookie.slice(at + 1), url: base, httpOnly: true, secure: true, sameSite: 'Strict', expires: session.expiresAt / 1000 }]);
  await context.addInitScript(() => { localStorage.setItem('mln131-restoration-save-v3', 'production-keep-v3'); localStorage.setItem('mln131-council-save-v2', 'production-keep-v2'); localStorage.setItem('mln131-escape-save-v1', 'production-keep-v1'); });
  const p = await context.newPage(); p.on('pageerror', e => errors.push(e.message)); p.on('response', r => { if (r.status() >= 400 && !r.url().includes('/api/')) errors.push(`${r.status()} ${new URL(r.url()).pathname}`); });
  await p.goto(base + '/admin'); await p.getByRole('button', { name: 'Trình diễn Khởi nguyên' }).waitFor();
  for (const width of [1366, 768, 360]) {
    await p.setViewportSize({ width, height: width === 360 ? 800 : 900 });
    for (const title of ['Khởi nguyên', 'Sứ mệnh', 'Chuyển mình', 'Quyền làm chủ', 'Toàn thư viện']) {
      await p.getByRole('button', { name: 'Trình diễn ' + title }).click(); const dialog = p.getByRole('dialog'); await dialog.getByRole('button', { name: 'Bỏ qua hiệu ứng' }).click();
      await dialog.getByRole('button', { name: 'Phát lại', exact: true }).waitFor();
      if (title === 'Toàn thư viện') { const file = path.join(output, `production-finale-${width}.png`); await p.screenshot({ path: file }); screenshots.push(file); }
      await dialog.getByRole('button', { name: 'Về bảng thuyết trình' }).click();
    }
  }
  const saves = await p.evaluate(() => ['mln131-restoration-save-v3', 'mln131-council-save-v2', 'mln131-escape-save-v1'].map(key => localStorage.getItem(key))); assert.deepEqual(saves, ['production-keep-v3', 'production-keep-v2', 'production-keep-v1']);
  await p.reload(); await p.getByRole('button', { name: 'Trình diễn Khởi nguyên' }).waitFor(); assert.equal(await p.getByRole('dialog').count(), 0);
  await p.getByRole('button', { name: 'Khóa', exact: true }).click(); await p.getByLabel('Mã truy cập').waitFor(); await p.getByRole('status').filter({ hasText: 'Đã khóa bảng điều khiển.' }).waitFor(); assert.equal((await context.cookies()).filter(c => c.name === '__Host-memory-presenter').length, 0);
  await context.close(); checks.push('Production browser: all5 effects at1366/768/360px; no save changes; reload, logout');
} finally { await browser.close(); }
let limited = false;
for (let n = 0; n < 6; n++) { const response = await post('login', { code: 'invalid' }); if (response.status === 429) { limited = true; break; } assert.equal(response.status, 401); }
assert(limited, 'Live Vercel WAF did not return429'); checks.push('Live Vercel WAF returns429 after login limit');
assert.deepEqual(errors, []); const report = { passed: true, base, checks, screenshots, errors, vercelProductionTested: true };
fs.writeFileSync(path.join(output, 'presenter-production-report.json'), JSON.stringify(report, null, 2)); console.log(JSON.stringify({ ...report, screenshots: screenshots.length }, null, 2));
