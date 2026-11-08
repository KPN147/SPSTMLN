import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const output = path.resolve('.build/music-sources/verified');
fs.mkdirSync(output, { recursive: true });
const tracks = [
  ['001_Synthwave_4k.mp3', 'https://opengameart.org/sites/default/files/001_Synthwave_4k_0.mp3'],
  ['Contemplation.mp3', 'https://opengameart.org/sites/default/files/Contemplation.mp3'],
];
for (const [name, url] of tracks) {
  execFileSync('curl.exe', ['--fail', '--location', '--silent', '--show-error', '--connect-timeout', '15', '--max-time', '120', '--output', path.join(output, name), url]);
  console.log(`Downloaded ${name}`);
}
execFileSync('curl.exe', ['--fail', '--location', '--silent', '--show-error', '--max-time', '30', '--output', 'public/audio/CC0-1.0.txt', 'https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt']);
