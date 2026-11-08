import { musicLicense, musicTracks } from './music';

export function MusicCredits() {
  return <section className="music-credits" aria-label="Ghi công nhạc nền"><h3>Nhạc nền miễn phí</h3><p>Hai bản ambient được tác giả công bố trên OpenGameArt theo <a href={musicLicense} target="_blank" rel="noreferrer">CC0 1.0</a>. Nguồn và tác giả được ghi lại dưới đây.</p>{Object.values(musicTracks).map(track => <article key={track.src}><h4><a href={track.source} target="_blank" rel="noreferrer">{track.title}</a></h4><p><a href={track.authorUrl} target="_blank" rel="noreferrer">{track.author}</a> · {track.use}.</p><small>{track.changes} Xuất Ogg Vorbis để phát trong game.</small></article>)}</section>;
}
