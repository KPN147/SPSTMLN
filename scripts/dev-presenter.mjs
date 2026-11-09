import { createServer, loadEnv } from 'vite';
import { presenterServer } from './presenter-server.mjs';

const port = Number(process.env.PORT || 5173);
const env = { ...loadEnv('admin', process.cwd(), 'ADMIN_'), ADMIN_ORIGIN: `http://localhost:${port}`, ADMIN_ENABLED: 'true', ADMIN_RATE_LIMIT_READY: 'true' };
if (!env.ADMIN_CODE_HASH || !env.ADMIN_SESSION_SECRET) throw Error('Configure the ignored .env.admin.local file before running the presenter server.');
const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
const server = await presenterServer({ env, port, fallback: vite.middlewares });
console.log(`Presenter and game: http://localhost:${port}/admin`);
async function close() { await vite.close(); server.close(); }
process.on('SIGINT', close); process.on('SIGTERM', close);
