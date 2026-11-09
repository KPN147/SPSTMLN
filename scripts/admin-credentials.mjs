import { randomBytes } from 'node:crypto';
import { hashAdminCode } from '../server/presenter.mjs';

// Generates credentials in memory. Caller chooses secure delivery and storage.
// Never call this during the application build or import it into frontend code.
export async function createAdminCredentials(origin) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const code = [...randomBytes(20)].map(n => alphabet[n & 31]).join('');
  return { code: code.match(/.{5}/g).join('-'), env: { ADMIN_ENABLED: 'true', ADMIN_RATE_LIMIT_READY: 'false', ADMIN_ORIGIN: origin, ADMIN_CODE_HASH: await hashAdminCode(code), ADMIN_SESSION_SECRET: randomBytes(32).toString('hex') } };
}
