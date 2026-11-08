import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioProvider, useAudio } from '../council/Audio';
import { musicTracks } from '../council/music';

function Controls() {
  const { settings, update, setMood } = useAudio();
  return <><button onClick={() => update({ muted: false })}>Bật nhạc thử</button><button onClick={() => setMood('council')}>Đến hội đồng</button><input aria-label="Âm lượng thử" type="range" min="0" max="1" step="0.01" value={settings.music} onChange={e => update({ music: Number(e.target.value) })}/></>;
}
describe('Nhạc nền được cấp phép', () => {
  const instances: HTMLAudioElement[] = [];
  beforeEach(() => {
    localStorage.clear(); instances.length = 0;
    vi.stubGlobal('Audio', function () { const element = document.createElement('audio'); instances.push(element); return element; });
  });
  afterEach(() => vi.unstubAllGlobals());
  it('chỉ tải nhạc mới sau khi bật, và dùng đúng nhạc cho từng bối cảnh', () => {
    render(<AudioProvider><Controls/></AudioProvider>);
    expect(instances.every(element => !element.hasAttribute('src'))).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Bật nhạc thử' }));
    expect(instances.at(-1)!.getAttribute('src')).toBe(musicTracks.explore.src);
    expect(instances.at(-1)!.volume).toBe(.12);
    fireEvent.click(screen.getByRole('button', { name: 'Đến hội đồng' }));
    expect(instances.at(-1)!.getAttribute('src')).toBe(musicTracks.council.src);
  });
  it('chỉnh âm lượng không tạo lại hoặc tua nhạc về đầu', () => {
    render(<AudioProvider><Controls/></AudioProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Bật nhạc thử' }));
    const current = instances.at(-1)!; current.currentTime = 72;
    const count = instances.length;
    fireEvent.change(screen.getByLabelText('Âm lượng thử'), { target: { value: '0.65' } });
    expect(instances.length).toBe(count); expect(instances.at(-1)).toBe(current);
    expect(current.currentTime).toBe(72); expect(current.volume).toBe(.65);
  });
});
