import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const derive = promisify(scrypt);
const COOKIE = '__Host-memory-presenter';
const TTL = 2 * 60 * 60;
const EFFECTS = new Set(['room-1', 'room-2', 'room-3', 'room-4', 'finale']);
const HASH_PATTERN = /^scrypt\$131072\$8\$1\$([a-f0-9]{32})\$([a-f0-9]{128})$/;
const CODE_PATTERN = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{20}$/;

export function normalizeCode(code) {
  return typeof code === 'string' ? code.trim().toUpperCase().replace(/[\s-]/g, '') : '';
}

export async function hashAdminCode(code) {
  const normalized = normalizeCode(code);
  if (!CODE_PATTERN.test(normalized)) throw Error('Invalid code format');
  const salt = randomBytes(16).toString('hex');
  const key = await derive(normalized, salt, 64, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 });
  return `scrypt$131072$8$1$${salt}$${key.toString('hex')}`;
}

function equal(a, b) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function config(env) {
  if (env.ADMIN_ENABLED !== 'true' || env.ADMIN_RATE_LIMIT_READY !== 'true') return null;
  if (env.VERCEL && env.VERCEL_ENV !== 'production') return null;
  const match = HASH_PATTERN.exec(env.ADMIN_CODE_HASH ?? '');
  if (!match || !/^[a-f0-9]{64}$/.test(env.ADMIN_SESSION_SECRET ?? '')) return null;
  try {
    const url = new URL(env.ADMIN_ORIGIN);
    const local = !env.VERCEL && url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
    if ((!local && url.protocol !== 'https:') || url.origin !== env.ADMIN_ORIGIN || url.username || url.password) return null;
    return { origin: url.origin, hash: env.ADMIN_CODE_HASH, salt: match[1], key: match[2], secret: env.ADMIN_SESSION_SECRET };
  } catch { return null; }
}

function sign(value, cfg) { return createHmac('sha256', cfg.secret).update(value).digest('base64url'); }
function version(cfg) { return createHash('sha256').update(`${cfg.origin}\n${cfg.hash}`).digest('hex'); }
function csrf(token, cfg) { return sign(`csrf\n${token}`, cfg); }
function cookie(token, seconds = TTL) { return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${seconds}`; }
function json(status, body, headers = {}) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store, private', 'Pragma': 'no-cache', 'X-Content-Type-Options': 'nosniff', ...headers } });
}

function readSession(request, cfg, now) {
  const matches = (request.headers.get('cookie') ?? '').split(';').map(v => v.trim()).filter(v => v.startsWith(`${COOKIE}=`));
  if (matches.length !== 1) return null;
  const token = matches[0].slice(COOKIE.length + 1);
  if (token.length > 1024 || !/^[\w-]+\.[\w-]+$/.test(token)) return null;
  const [payload, signature] = token.split('.');
  if (!equal(signature, sign(payload, cfg))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (data.v !== 1 || data.ver !== version(cfg) || !/^[a-f0-9]{32}$/.test(data.nonce) || !Number.isInteger(data.iat) || !Number.isInteger(data.exp) || data.iat > now + 5 || data.exp <= now || data.exp - data.iat !== TTL) return null;
    return { token, expiresAt: data.exp * 1000 };
  } catch { return null; }
}

async function body(request) {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') throw Error('Unsupported body');
  if (Number(request.headers.get('content-length') ?? 0) > 1024) throw Error('Body too large');
  const reader = request.body?.getReader();
  if (!reader) throw Error('Missing body');
  let text = '', length = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 1024) { await reader.cancel(); throw Error('Body too large'); }
      text += decoder.decode(value, { stream: true });
    }
    const result = JSON.parse(text + decoder.decode());
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw Error('Invalid body');
    return result;
  } finally { reader.releaseLock(); }
}

// No credentials, bodies, cookies or session tokens are logged by this handler.
export async function handlePresenter(request, env = process.env, now = Math.floor(Date.now() / 1000)) {
  const url = new URL(request.url);
  const path = url.pathname;
  const action = path.startsWith('/api/presenter/') ? path.slice('/api/presenter/'.length) : '';
  // Vercel's dynamic route adds its captured parameter to the URL query.
  // It must agree with the literal path; it cannot select another action.
  const routingQuery = !url.search || (url.searchParams.size === 1 && url.searchParams.get('action') === action);
  if (!['login', 'session', 'play', 'logout'].includes(action) || !routingQuery) return json(404, { message: 'Không tìm thấy thao tác.' });
  const method = action === 'session' ? 'GET' : 'POST';
  if (request.method !== method) return json(405, { message: 'Thao tác không hợp lệ.' }, { Allow: method });
  const cfg = config(env);
  if (!cfg) return json(503, { message: 'Chế độ thuyết trình chưa được bật an toàn trên máy chủ.' });
  const origin = request.headers.get('origin');
  if (url.origin !== cfg.origin || request.headers.get('sec-fetch-site') === 'cross-site' || (method === 'POST' ? origin !== cfg.origin : origin && origin !== cfg.origin)) return json(403, { message: 'Yêu cầu không hợp lệ.' });
  try {
    if (action === 'login') {
      const input = await body(request);
      const code = normalizeCode(input.code);
      if (!CODE_PATTERN.test(code)) return json(401, { message: 'Mã truy cập chưa đúng.' });
      const key = await derive(code, cfg.salt, 64, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 });
      if (!equal(key.toString('hex'), cfg.key)) return json(401, { message: 'Mã truy cập chưa đúng.' });
      const payload = Buffer.from(JSON.stringify({ v: 1, iat: now, exp: now + TTL, nonce: randomBytes(16).toString('hex'), ver: version(cfg) })).toString('base64url');
      const token = `${payload}.${sign(payload, cfg)}`;
      return json(200, { expiresAt: (now + TTL) * 1000, csrf: csrf(token, cfg) }, { 'Set-Cookie': cookie(token) });
    }
    const session = readSession(request, cfg, now);
    if (!session) return json(401, { message: 'Phiên thuyết trình đã khóa. Vui lòng nhập lại mã.' }, { 'Set-Cookie': cookie('', 0) });
    if (action === 'session') return json(200, { expiresAt: session.expiresAt, csrf: csrf(session.token, cfg) });
    if (!equal(request.headers.get('x-presenter-csrf') ?? '', csrf(session.token, cfg))) return json(403, { message: 'Yêu cầu không hợp lệ.' });
    const input = await body(request);
    if (action === 'logout') return json(200, { locked: true }, { 'Set-Cookie': cookie('', 0) });
    if (!EFFECTS.has(input.effect)) return json(400, { message: 'Hiệu ứng không hợp lệ.' });
    return json(200, { effect: input.effect, expiresAt: session.expiresAt });
  } catch { return json(400, { message: 'Không thể xử lý yêu cầu này.' }); }
}
