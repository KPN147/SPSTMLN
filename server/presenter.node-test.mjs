import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { handlePresenter, hashAdminCode, normalizeCode } from './presenter.mjs';

// Ephemeral credentials for tests. No production access code is stored in this repository.
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const code = [...randomBytes(20)].map(n => alphabet[n & 31]).join('');
const origin = 'https://presenter.example';
const now = 1700000000;
let env;
before(async () => { env = { VERCEL: '1', VERCEL_ENV: 'production', ADMIN_ENABLED: 'true', ADMIN_RATE_LIMIT_READY: 'true', ADMIN_ORIGIN: origin, ADMIN_SESSION_SECRET: randomBytes(32).toString('hex'), ADMIN_CODE_HASH: await hashAdminCode(code) }; });
function request(action, { method = action === 'session' ? 'GET' : 'POST', input, headers = {}, url = `${origin}/api/presenter/${action}` } = {}) {
  return new Request(url, { method, headers: { Origin: origin, ...(input !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers }, ...(input === undefined ? {} : { body: JSON.stringify(input) }) });
}
async function login() { const response = await handlePresenter(request('login', { input: { code } }), env, now); assert.equal(response.status, 200); return { response, cookie: response.headers.get('set-cookie').split(';')[0], ...(await response.json()) }; }

test('code normalization accepts grouping, rejects invalid format when hashing', async () => {
  assert.equal(normalizeCode('abcde-fghjk lmnpq-rstuv'), 'ABCDEFGHJKLMNPQRSTUV');
  await assert.rejects(() => hashAdminCode('short'));
});
test('missing settings, missing WAF acknowledgement, preview and malformed settings fail closed', async () => {
  for (const changes of [{ ADMIN_ENABLED: 'false' }, { ADMIN_RATE_LIMIT_READY: 'false' }, { ADMIN_SESSION_SECRET: 'short' }, { ADMIN_CODE_HASH: 'bad' }, { ADMIN_ORIGIN: `${origin}/` }, { ADMIN_ORIGIN: 'http://example.com' }, { VERCEL_ENV: 'preview' }]) assert.equal((await handlePresenter(request('login', { input: { code } }), { ...env, ...changes }, now)).status, 503);
});
test('unknown paths, query parameters, direct handler and wrong method are rejected', async () => {
  assert.equal((await handlePresenter(request('unknown'), env, now)).status, 404);
  assert.equal((await handlePresenter(request('login', { url: `${origin}/api/presenter` }), env, now)).status, 404);
  assert.equal((await handlePresenter(request('login', { url: `${origin}/api/presenter/login?code=x` }), env, now)).status, 404);
  const r = await handlePresenter(request('login', { method: 'GET' }), env, now); assert.equal(r.status, 405); assert.equal(r.headers.get('allow'), 'POST');
});
test('login rejects cross-origin, missing Origin, different Host and cross-site requests', async () => {
  for (const headers of [{ Origin: 'https://evil.example' }, { Origin: '' }, { 'Sec-Fetch-Site': 'cross-site' }]) assert.equal((await handlePresenter(request('login', { input: { code }, headers }), env, now)).status, 403);
  assert.equal((await handlePresenter(request('login', { input: { code }, url: 'https://old-deployment.example/api/presenter/login' }), env, now)).status, 403);
});
test('empty, oversized, non-JSON and malformed request bodies do not crash or authenticate', async () => {
  const inputs = [new Request(`${origin}/api/presenter/login`, { method: 'POST', headers: { Origin: origin } }), request('login', { input: { code: 'A'.repeat(2000) } }), request('login', { input: { code }, headers: { 'Content-Type': 'text/plain' } }), new Request(`${origin}/api/presenter/login`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{' })];
  for (const input of inputs) assert.equal((await handlePresenter(input, env, now)).status, 400);
});
test('wrong code gives generic failure without a session cookie', async () => {
  for (const input of [{ code: 'no' }, { code: code[0] === 'A' ? `B${code.slice(1)}` : `A${code.slice(1)}` }]) { const r = await handlePresenter(request('login', { input }), env, now); assert.equal(r.status, 401); assert.equal(r.headers.get('set-cookie'), null); assert.equal((await r.json()).message, 'Mã truy cập chưa đúng.'); }
});
test('valid login issues a two-hour hardened cookie and never returns the access code', async () => {
  const { response, expiresAt, csrf } = await login();
  assert.equal(expiresAt, (now + 7200) * 1000); assert.equal(csrf.length, 43);
  const set = response.headers.get('set-cookie'); for (const flag of ['__Host-memory-presenter=', 'Secure', 'HttpOnly', 'SameSite=Strict', 'Path=/', 'Max-Age=7200']) assert(set.includes(flag));
  assert(!set.includes(code)); assert(!set.includes('Domain=')); assert.equal(response.headers.get('cache-control'), 'no-store, private');
});
test('session is required for viewing state and playing every effect', async () => {
  assert.equal((await handlePresenter(request('session'), env, now)).status, 401);
  assert.equal((await handlePresenter(request('session', { url: `${origin}/api/presenter/session?action=session` }), env, now)).status, 401);
  assert.equal((await handlePresenter(request('session', { url: `${origin}/api/presenter/session?action=login` }), env, now)).status, 404);
  for (const effect of ['room-1', 'room-2', 'room-3', 'room-4', 'finale']) assert.equal((await handlePresenter(request('play', { input: { effect } }), env, now)).status, 401);
});
test('authorized session can play only whitelisted effects using its CSRF token', async () => {
  const s = await login(), headers = { Cookie: s.cookie, 'X-Presenter-CSRF': s.csrf };
  const session = await handlePresenter(request('session', { headers: { Cookie: s.cookie } }), env, now + 1); assert.equal((await session.json()).csrf, s.csrf);
  for (const effect of ['room-1', 'room-2', 'room-3', 'room-4', 'finale']) { const r = await handlePresenter(request('play', { input: { effect }, headers }), env, now + 1); assert.equal(r.status, 200); assert.equal((await r.json()).effect, effect); }
  assert.equal((await handlePresenter(request('play', { input: { effect: 'unlock-all' }, headers }), env, now)).status, 400);
});
test('CSRF is required and tied to the individual session', async () => {
  const a = await login(), b = await login();
  for (const token of ['', b.csrf, 'forged']) assert.equal((await handlePresenter(request('play', { input: { effect: 'finale' }, headers: { Cookie: a.cookie, 'X-Presenter-CSRF': token } }), env, now)).status, 403);
});
test('forged, duplicate and expired cookies are rejected', async () => {
  const s = await login();
  for (const value of ['__Host-memory-presenter=forged', `${s.cookie}; ${s.cookie}`, `${s.cookie.slice(0,-5)}xxxxx`]) assert.equal((await handlePresenter(request('session', { headers: { Cookie: value } }), env, now)).status, 401);
  assert.equal((await handlePresenter(request('session', { headers: { Cookie: s.cookie } }), env, now + 7200)).status, 401);
});
test('rotating signing key or access-code hash invalidates previous sessions', async () => {
  const s = await login();
  for (const changes of [{ ADMIN_SESSION_SECRET: randomBytes(32).toString('hex') }, { ADMIN_CODE_HASH: await hashAdminCode(code) }]) assert.equal((await handlePresenter(request('session', { headers: { Cookie: s.cookie } }), { ...env, ...changes }, now)).status, 401);
});
test('logout expires the browser cookie and requires CSRF', async () => {
  const s = await login();
  assert.equal((await handlePresenter(request('logout', { input: {}, headers: { Cookie: s.cookie } }), env, now)).status, 403);
  const r = await handlePresenter(request('logout', { input: {}, headers: { Cookie: s.cookie, 'X-Presenter-CSRF': s.csrf } }), env, now); assert.equal(r.status, 200); assert(r.headers.get('set-cookie').includes('Max-Age=0'));
});
