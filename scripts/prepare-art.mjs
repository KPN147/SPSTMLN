import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const runtime = process.env.RUNTIME_NODE_MODULES || path.join(process.env.USERPROFILE || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const require = createRequire(path.join(runtime, 'package.json'));
const sharp = require('sharp');
const inputs = JSON.parse(fs.readFileSync(new URL('./art-inputs.local.json', import.meta.url), 'utf8'));
const output = path.resolve('public/art');
fs.mkdirSync(output, { recursive: true });
const log = [];
for (const [name, source] of Object.entries(inputs)) {
  if (!fs.existsSync(source)) throw Error(`Missing generated asset: ${name}`);
  const image = sharp(source);
  const metadata = await image.metadata();
  const portrait = name.startsWith('portrait-'), evidence = name.startsWith('evidence-');
  const width = portrait ? 1152 : evidence ? 1536 : 2048;
  const height = portrait ? 768 : evidence ? 768 : name === 'hero' ? 1365 : 1152;
  await image.resize(width, height, { fit: 'fill' }).webp({ quality: portrait ? 83 : evidence ? 83 : 80, alphaQuality: 95 }).toFile(path.join(output, `${name}.webp`));
  log.push({ name, source, width, height, hasAlpha: metadata.hasAlpha, bytes: fs.statSync(path.join(output, `${name}.webp`)).size });
}
fs.mkdirSync('.build', { recursive: true });
fs.writeFileSync('.build/art-report.json', JSON.stringify(log, null, 2));
console.log(`Prepared ${log.length} illustrated atlases/backgrounds: ${(log.reduce((n, a) => n + a.bytes, 0) / 1048576).toFixed(2)} MiB`);
