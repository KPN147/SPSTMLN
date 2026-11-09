import http from 'node:http';
import { Readable } from 'node:stream';
import { handlePresenter } from '../server/presenter.mjs';

// Local adapter only. Production login limiting belongs to the Vercel WAF.
export function presenterServer({ env, fallback, headers = {}, port = 5173 }) {
  let windowStart = 0, attempts = 0;
  const server = http.createServer(async (req, res) => {
    for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
    if (!req.url?.startsWith('/api/')) return fallback(req, res);
    try {
      const url = new URL(req.url, env.ADMIN_ORIGIN);
      if (url.pathname === '/api/presenter/login') {
        const now = Date.now(); if (now - windowStart >= 60000) { windowStart = now; attempts = 0; }
        if (++attempts > 5) { res.writeHead(429, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Retry-After': '60' }); res.end(JSON.stringify({ message: 'Vui lòng chờ một phút.' })); return; }
      }
      const request = new Request(url, { method: req.method, headers: req.headers, ...(['GET', 'HEAD'].includes(req.method) ? {} : { body: Readable.toWeb(req), duplex: 'half' }) });
      const response = await handlePresenter(request, env);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch { res.writeHead(400, { 'Cache-Control': 'no-store' }); res.end(); }
  });
  return new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', () => resolve(server)); });
}
