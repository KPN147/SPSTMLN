import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Original effects only. Licensed music is prepared separately by prepare-music.mjs.
const rate = 24000;
const dir = path.resolve('public/audio');
const work = path.resolve('.build/audio');
fs.mkdirSync(dir, { recursive: true });
fs.mkdirSync(work, { recursive: true });
function wav(name, seconds, sample) {
  const count = Math.floor(seconds * rate), data = Buffer.alloc(44 + count * 2);
  data.write('RIFF', 0); data.writeUInt32LE(36 + count * 2, 4); data.write('WAVEfmt ', 8); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22); data.writeUInt32LE(rate, 24); data.writeUInt32LE(rate * 2, 28); data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34); data.write('data', 36); data.writeUInt32LE(count * 2, 40);
  for (let i = 0; i < count; i++) data.writeInt16LE(Math.round(Math.max(-.95, Math.min(.95, sample(i / rate))) * 32767), 44 + i * 2);
  const file = path.join(work, `${name}.wav`); fs.writeFileSync(file, data);
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', file, '-c:a', 'libvorbis', '-q:a', '3', path.join(dir, `${name}.ogg`)]);
}
const tone = (f, t) => Math.sin(2 * Math.PI * f * t);
for (const [name, notes, duration] of [['select', [660], .12], ['open', [330, 440], .3], ['collect', [523.25, 659.25, 783.99], .65], ['connect', [440, 660], .3], ['reject', [220, 207.65], .35], ['insight', [392, 493.88, 587.33], .85], ['chapter', [261.63, 329.63, 392, 523.25], 1.5], ['final', [261.63, 329.63, 392, 523.25, 659.25, 783.99], 3.2]]) {
  wav(name, duration, t => notes.reduce((s, f, i) => { const x = t - i * duration / (notes.length * 2); return s + (x < 0 ? 0 : tone(f, x) * Math.exp(-x * 6) * Math.min(1, x / .012)); }, 0) * .18 * Math.min(1, (duration - t) / .08));
}
console.log('Generated 8 original effects. Licensed background music is preserved.');
