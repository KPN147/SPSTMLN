import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

// Sources are the author's uploads on OpenGameArt; see public/audio/CREDITS.md.
const input = path.resolve(process.env.MUSIC_SOURCE_DIR || '.build/music-sources/verified');
const output = path.resolve('public/audio');
fs.mkdirSync(output, { recursive: true });
const tracks = [
  { filename: '001_Synthwave_4k.mp3', output: 'explore-ambient.ogg', start: 0, title: 'Synthwave 4k', author: 'The Cynic Project', source: 'https://opengameart.org/content/calm-ambient-1-synthwave-4k' },
  { filename: 'Contemplation.mp3', output: 'council-ambient.ogg', start: 0, title: 'Contemplation', author: 'Joth', source: 'https://opengameart.org/content/contemplation-0' },
];
const report = [];
for (const track of tracks) {
  const source = path.join(input, track.filename);
  if (!fs.existsSync(source)) throw Error(`Download the licensed original first: ${track.filename}`);
  const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'json', source], { encoding: 'utf8' }));
  const sourceDuration = Number(probe.format.duration);
  const duration = sourceDuration;
  if (!Number.isFinite(sourceDuration) || sourceDuration < track.start + duration - .1) throw Error(`Invalid source duration: ${track.filename}`);
  const file = path.join(output, track.output);
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(track.start), '-i', source, '-t', String(duration), '-vn', '-af', `highpass=f=45,lowpass=f=6500,loudnorm=I=-22:TP=-4:LRA=7,afade=t=in:st=0:d=2.5,afade=t=out:st=${duration - 3}:d=3`, '-ar', '44100', '-ac', '2', '-c:a', 'libvorbis', '-q:a', '2', '-metadata', `title=${track.title}`, '-metadata', `artist=${track.author}`, '-metadata', 'license=CC0 1.0 https://creativecommons.org/publicdomain/zero/1.0/', '-metadata', `comment=Source ${track.source}; EQ/loudness/fades by Hoi dong phuc dung`, file]);
  report.push({ ...track, duration, sourceDuration, sourceSha256: createHash('sha256').update(fs.readFileSync(source)).digest('hex'), outputSha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex'), bytes: fs.statSync(file).size });
}
fs.mkdirSync('.build/music-sources', { recursive: true });
fs.writeFileSync('.build/music-sources/processing-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.map(({ title, duration, bytes }) => ({ title, duration, bytes })), null, 2));
