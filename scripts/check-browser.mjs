import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer, preview } from 'vite';
/* global document, innerWidth, window */

const runtime = process.env.RUNTIME_NODE_MODULES || path.join(process.env.USERPROFILE || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const require = createRequire(path.join(runtime, 'package.json'));
const { chromium } = require('playwright');
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const { chapters } = await vite.ssrLoadModule('/src/council/content.ts');
const { finishThrough, prepareChapter, fullCouncilSave } = await vite.ssrLoadModule('/src/tests/council-fixtures.ts');
const { SAVE_KEY_V2, LEGACY_SAVE_KEY } = await vite.ssrLoadModule('/src/council/engine.ts');
const base = process.env.TEST_URL || 'http://127.0.0.1:4273';
const deployment = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const productionHeaders = Object.fromEntries(deployment.headers.filter(rule => rule.source === '/(.*)').flatMap(rule => rule.headers.map(({ key, value }) => [key, value])));
const localPreview = process.env.TEST_URL ? null : await preview({ preview: { host: '127.0.0.1', port: 4273, strictPort: true, headers: productionHeaders } });
const output = path.resolve('output/qa');
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'browser-report.json'), JSON.stringify({ passed: false, status: 'running' }, null, 2));
const cachedBrowser = path.join(process.env.USERPROFILE || '', 'AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe');
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH || (fs.existsSync(cachedBrowser) ? cachedBrowser : undefined);
const browser = await chromium.launch({ headless: true, executablePath });
const errors = [], failed = [], screenshots = [], measurements = [];
const esc = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
async function stable(page) { await page.waitForLoadState('networkidle'); await page.evaluate(() => document.fonts.ready); }
function observe(page) { page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error' && /content security policy/i.test(message.text())) errors.push(message.text()); }); page.on('response', response => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); }); }
async function capture(page, name) { await stable(page); const file = path.join(output, `${name}.png`); await page.screenshot({ path: file, fullPage: true }); screenshots.push(file); const size = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth })); assert(size.width <= size.viewport + 1, `${name} overflows: ${JSON.stringify(size)}`); }
async function chooseCase(page, region, definition) {
  await region.getByRole('radio', { name: definition.conclusions.find(o => o.id === definition.correctConclusion).text, exact: true }).check();
  for (const id of definition.evidenceSets[0]) { const evidence = chapters.flatMap(c => c.evidence).find(e => e.id === id); await region.getByRole('checkbox', { name: new RegExp(`^${esc(evidence.title)}`) }).check(); }
  await region.getByRole('radio', { name: definition.repairs.find(o => o.id === definition.correctRepair).text, exact: true }).check();
  await region.getByRole('button', { name: /Đề xuất với hội đồng/ }).click();
}
try {
  for (const width of [1366, 768, 360]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width === 360, hasTouch: width === 360 });
    const page = await context.newPage(); observe(page);
    await page.goto(base); await capture(page, `landing-${width}`);
    if (width === 1366) { await page.keyboard.press('Tab'); assert.equal(await page.locator(':focus').textContent(), 'Đến nội dung chính'); }
    const firstLoad = await page.evaluate(() => performance.getEntriesByType('resource').reduce((n, r) => n + (r.transferSize || 0), 0)); measurements.push({ width, firstLoadBytes: firstLoad });
    assert(firstLoad < 4 * 1024 * 1024, 'Initial transfer exceeds 4 MiB');
    const seed = prepareChapter(finishThrough(2), 3);
    await page.evaluate(([key, value]) => localStorage.setItem(key, value), [SAVE_KEY_V2, JSON.stringify(seed)]);
    await page.goto(`${base}/room/3`); await page.getByRole('heading', { name: chapters[2].name }).waitFor();
    if (width === 360) {
      await page.getByRole('button', { name: /^1\. Bản thiết kế/ }).tap();
      await capture(page, 'inspector-360');
      await page.getByRole('dialog').getByRole('button', { name: 'Đóng cửa sổ' }).tap();
      await page.getByRole('button', { name: 'Mở Sổ chung', exact: true }).tap();
      await page.getByRole('dialog').getByRole('button', { name: 'Đóng cửa sổ' }).tap();
      assert(await page.getByRole('button', { name: 'Mở Sổ chung', exact: true }).evaluate(e => e === document.activeElement), 'Focus was not restored');
    }
    await capture(page, `room-3-${width}`);
    await page.getByRole('button', { name: 'Triệu tập hội đồng', exact: true }).click(); await capture(page, `council-${width}`);
    await page.getByRole('dialog').getByRole('button', { name: 'Đóng cửa sổ' }).click();
    await context.close();
  }
  // Full production UI walkthrough; no progress injection or debug routes.
  const context = await browser.newContext({ viewport: { width: 1366, height: 1000 } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    window.__testedAudio = [];
    window.Audio = function (src) { const audio = src === undefined ? new NativeAudio() : new NativeAudio(src); window.__testedAudio.push(audio); return audio; };
  });
  observe(page); await page.goto(`${base}/room/1`);
  for (const c of chapters) {
    await page.getByRole('heading', { name: c.name, exact: true }).waitFor();
    for (const e of c.evidence.slice(0, 6)) {
      await page.getByRole('button', { name: new RegExp(`^${e.index + 1}\\. ${esc(c.hotspotNames[e.index])}`) }).click();
      await page.getByRole('button', { name: /^Ghi nhận chứng cứ · / }).click();
    }
    for (const t of c.investigations) {
      await page.getByRole('group', { name: 'Các bước kiểm chứng' }).getByRole('button', { name: new RegExp(esc(t.title)) }).click();
      const region = page.getByRole('region', { name: t.title });
      for (const item of t.items) {
        await region.getByRole('button', { name: item.label, exact: true }).click();
        await region.getByRole('group', { name: 'Vị trí phục dựng' }).getByRole('button').nth(t.targets.findIndex(target => target.id === item.target)).click();
      }
      await region.getByRole('button', { name: /^(Kiểm tra bản phục dựng|Chạy thử hệ thống|Khởi động đồng hồ)/ }).click();
      await region.getByText(t.success, { exact: true }).waitFor();
    }
    await page.getByRole('button', { name: 'Kiểm tra phong thư', exact: true }).click(); await page.getByRole('button', { name: /Ghi nhận chứng cứ · Vy/ }).click();
    await page.getByRole('button', { name: 'Triệu tập hội đồng', exact: true }).click();
    await chooseCase(page, page.getByRole('dialog'), c.council);
    await page.getByRole('button', { name: 'Ở lại tìm hồ sơ phụ' }).click();
    await page.getByRole('link', { name: c.id === 4 ? 'Đến Phòng Lõi' : 'Điều tra khu vực tiếp theo' }).click();
    if (c.id === 2) await page.reload();
  }
  for (const c of chapters) {
    await page.getByRole('group', { name: 'Các đoạn báo cáo' }).getByRole('button', { name: new RegExp(esc(c.shortName)) }).click();
    await page.getByRole('button', { name: /Phân công .* kiểm tra/ }).click();
    await chooseCase(page, page.getByRole('region', { name: c.finalCase.title }), c.finalCase);
  }
  await page.getByRole('button', { name: 'Khôi phục thư viện', exact: true }).click();
  await page.getByRole('button', { name: /Bỏ qua chuyển cảnh · Xem kết quả/ }).click();
  await page.getByRole('heading', { name: 'Ký ức được nối lại.' }).waitFor(); await capture(page, 'result-complete');
  await page.reload(); await page.getByRole('heading', { name: 'Ký ức được nối lại.' }).waitFor();
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY_V2); assert.equal(saved.finalCompleted, true);
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [SAVE_KEY_V2, JSON.stringify(fullCouncilSave(false))]);
  await page.reload(); await page.getByRole('heading', { name: 'Thư viện đã sáng lại.' }).waitFor();
  // Reduced motion, settings persistence and isolated demo under touch are checked in real Chromium.
  await page.getByRole('button', { name: 'Cài đặt trải nghiệm' }).click(); await page.getByLabel('Giảm chuyển động').check();
  await page.getByRole('dialog').getByRole('button', { name: 'Đóng cửa sổ' }).click(); assert.equal(await page.locator('html').getAttribute('data-reduced-motion'), 'true');
  await page.bringToFront();
  const audioResponse = page.waitForResponse(response => response.url().includes('/audio/explore-ambient.ogg'));
  await page.getByRole('button', { name: 'Bật âm thanh', exact: true }).click();
  assert([200, 206].includes((await audioResponse).status()));
  await page.waitForFunction(() => window.__testedAudio.some(audio => audio.src.includes('/audio/explore-ambient.ogg') && !audio.paused && audio.currentTime > .15));
  await stable(page);
  assert.equal(await page.getByText('Chạm nút âm thanh để bắt đầu phát nhạc.', { exact: true }).count(), 0);
  const musicBefore = await page.evaluate(() => { const audio = window.__testedAudio.find(a => a.src.includes('/audio/explore-ambient.ogg') && !a.paused); return { index: window.__testedAudio.indexOf(audio), time: audio.currentTime, volume: audio.volume }; });
  await page.getByRole('button', { name: 'Cài đặt trải nghiệm' }).click();
  const volumeSlider = page.getByLabel('Âm lượng nhạc nền');
  await volumeSlider.focus(); await volumeSlider.press('ArrowRight');
  const newVolume = Number(await volumeSlider.inputValue());
  const musicAfter = await page.evaluate(() => { const audio = window.__testedAudio.find(a => a.src.includes('/audio/explore-ambient.ogg') && !a.paused); return { index: window.__testedAudio.indexOf(audio), time: audio.currentTime, volume: audio.volume }; });
  assert.equal(musicAfter.index, musicBefore.index); assert(musicAfter.time >= musicBefore.time); assert.equal(musicAfter.volume, newVolume);
  await page.getByRole('dialog').getByRole('button', { name: 'Đóng cửa sổ' }).click();
  await page.goto(`${base}/room/1`);
  await page.getByRole('button', { name: 'Bàn hội đồng', exact: true }).click();
  await page.waitForFunction(() => window.__testedAudio.some(audio => audio.src.includes('/audio/council-ambient.ogg') && !audio.paused && audio.currentTime > .15));
  await page.getByRole('dialog').getByRole('button', { name: 'Đóng cửa sổ' }).click();
  await page.getByRole('button', { name: 'Tắt âm thanh', exact: true }).click();
  await page.goto(`${base}/about`);
  await page.getByRole('region', { name: 'Ghi công nhạc nền' }).waitFor();
  assert.equal(await page.getByRole('link', { name: 'Synthwave 4k', exact: true }).getAttribute('href'), 'https://opengameart.org/content/calm-ambient-1-synthwave-4k');
  assert.equal(await page.getByRole('link', { name: 'Contemplation', exact: true }).getAttribute('href'), 'https://opengameart.org/content/contemplation-0');
  await capture(page, 'music-credits');
  const before = await page.evaluate(([v2, v1]) => [localStorage.getItem(v2), localStorage.getItem(v1)], [SAVE_KEY_V2, LEGACY_SAVE_KEY]);
  await page.goto(`${base}/demo`); await page.getByRole('button', { name: 'Minh: kiểm tra & ghi nhận' }).click(); await page.getByRole('button', { name: 'An: kiểm tra & ghi nhận' }).click();
  const d = { ...chapters[2].council, evidenceSets: [['c3-e2', 'c3-e5']] };
  await chooseCase(page, page.getByRole('region', { name: d.title }), d);
  await page.getByRole('heading', { name: 'Bạn đã nối được hai góc nhìn.' }).waitFor();
  const after = await page.evaluate(([v2, v1]) => [localStorage.getItem(v2), localStorage.getItem(v1)], [SAVE_KEY_V2, LEGACY_SAVE_KEY]); assert.deepEqual(after, before);
  await capture(page, 'demo-complete');
  await context.close();
  assert.deepEqual(errors, [], 'Browser errors'); assert.deepEqual(failed, [], 'Failed resource requests');
  fs.writeFileSync(path.join(output, 'browser-report.json'), JSON.stringify({ passed: true, browser: 'Chromium headless', screenshots, measurements, errors, failed, fullUIWalkthrough: true, audioPlaybackChecked: true, physicalPhoneTested: false, humanPlaytestCompleted: false }, null, 2));
  console.log(JSON.stringify({ passed: true, screenshots: screenshots.length, measurements, errors, failed }, null, 2));
} catch (error) {
  fs.writeFileSync(path.join(output, 'browser-report.json'), JSON.stringify({ passed: false, status: 'failed', error: String(error), screenshots, measurements, errors, failed, physicalPhoneTested: false, humanPlaytestCompleted: false }, null, 2));
  throw error;
} finally { await browser.close(); await vite.close(); if (localPreview) await new Promise(resolve => localPreview.httpServer.close(resolve)); }
