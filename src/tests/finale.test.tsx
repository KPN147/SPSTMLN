import { StrictMode } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import App from '../App';
import { rooms } from '../restoration/curriculum';
import { SAVE_KEY, parse, reducer } from '../restoration/engine';
import { completedRooms, winningAnswer } from './restoration-fixtures';
import { GUIDE_INTRO_KEY } from '../council/GuideOnboarding';

const sounds: HTMLAudioElement[] = [];
function seed(complete = false) {
  let s = completedRooms(4);
  for (const r of rooms) { s = reducer(s, { type: 'answer', id: r.finalCase.id, answer: winningAnswer(r.finalCase, s) }); s = reducer(s, { type: 'submit', id: r.finalCase.id }); }
  if (complete) s = reducer(s, { type: 'finish' });
  localStorage.setItem(SAVE_KEY, JSON.stringify(s)); window.history.replaceState({}, '', complete ? '/result' : '/final');
}
function loaded() { document.querySelectorAll('.finale-camera>img').forEach(image => fireEvent.load(image)); }
beforeEach(() => {
  localStorage.clear(); localStorage.setItem(GUIDE_INTRO_KEY, 'seen');
  localStorage.setItem('mln131-council-settings-v1', JSON.stringify({ muted: false, reducedMotion: false, music: 0, effects: .4 }));
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false); sounds.length = 0;
  vi.stubGlobal('Audio', function(src?: string) { const e = document.createElement('audio'); if (src) e.src = src; sounds.push(e); return e; });
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it('saves before playing, runs nine seconds, plays each cue once under StrictMode and holds', () => {
  vi.useFakeTimers(); seed(); render(<StrictMode><App/></StrictMode>);
  const button = screen.getByRole('button', { name: 'Khôi phục thư viện' }); fireEvent.click(button); fireEvent.click(button); loaded();
  expect(parse(localStorage.getItem(SAVE_KEY)!).finalComplete).toBe(true); expect(screen.getAllByRole('dialog')).toHaveLength(1);
  act(() => vi.advanceTimersByTime(2999)); expect(sounds.filter(e => e.src.endsWith('/connect.ogg'))).toHaveLength(0);
  act(() => vi.advanceTimersByTime(1)); expect(sounds.filter(e => e.src.endsWith('/connect.ogg'))).toHaveLength(1);
  act(() => vi.advanceTimersByTime(2500)); expect(sounds.filter(e => e.src.endsWith('/final.ogg'))).toHaveLength(1);
  act(() => vi.advanceTimersByTime(3499)); expect(screen.queryByRole('button', { name: 'Xem kết quả' })).not.toBeInTheDocument();
  act(() => vi.advanceTimersByTime(1)); expect(screen.getByRole('button', { name: 'Xem kết quả' })).toHaveFocus();
  act(() => vi.advanceTimersByTime(20000)); expect(screen.getByRole('dialog')).toBeVisible(); expect(sounds.filter(e => e.src.endsWith('/final.ogg'))).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Xem kết quả' })); expect(window.location.pathname).toBe('/result'); expect(document.body.style.overflow).toBe('');
});
it.each(['skip', 'Escape', 'Đóng cửa sổ'])('%s reaches results without losing completion or replaying sound on reload', action => {
  seed(); const view = render(<App/>); fireEvent.click(screen.getByRole('button', { name: 'Khôi phục thư viện' })); const saved = localStorage.getItem(SAVE_KEY);
  if (action === 'skip') { fireEvent.click(screen.getByRole('button', { name: 'Bỏ qua hiệu ứng' })); fireEvent.click(screen.getByRole('button', { name: 'Xem kết quả' })); }
  else if (action === 'Escape') fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true })); else fireEvent.click(screen.getByRole('button', { name: action }));
  expect(window.location.pathname).toBe('/result'); expect(localStorage.getItem(SAVE_KEY)).toBe(saved); view.unmount(); render(<App/>); expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(sounds.filter(e => e.src.endsWith('/final.ogg'))).toHaveLength(0);
});
it('explicit replay returns focus to results and does not mutate the save', () => {
  seed(true); render(<App/>); const saved = localStorage.getItem(SAVE_KEY), button = screen.getByRole('button', { name: 'Xem lại khoảnh khắc phục dựng' });
  fireEvent.click(button); fireEvent.click(screen.getByRole('button', { name: 'Bỏ qua hiệu ứng' })); fireEvent.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  expect(button).toHaveFocus(); expect(localStorage.getItem(SAVE_KEY)).toBe(saved);
});
it('hidden tab settles immediately and later return does not replay climax audio', () => {
  vi.useFakeTimers(); seed(); render(<App/>); fireEvent.click(screen.getByRole('button', { name: 'Khôi phục thư viện' })); loaded();
  vi.mocked(vi.spyOn(document, 'hidden', 'get')).mockReturnValue(true); fireEvent(document, new Event('visibilitychange'));
  expect(screen.getByRole('button', { name: 'Xem kết quả' })).toBeVisible();
  vi.mocked(vi.spyOn(document, 'hidden', 'get')).mockReturnValue(false); fireEvent(document, new Event('visibilitychange')); act(() => vi.advanceTimersByTime(10000)); expect(sounds.filter(e => e.src.endsWith('/final.ogg'))).toHaveLength(0);
});
it('reduced motion and mute show the completed scene immediately with no sound', () => {
  seed(); localStorage.setItem('mln131-council-settings-v1', JSON.stringify({ muted: true, reducedMotion: true, music: 0, effects: .4 })); render(<App/>); fireEvent.click(screen.getByRole('button', { name: 'Khôi phục thư viện' })); expect(document.querySelector('.finale')).toHaveClass('is-reduced', 'is-ready'); expect(screen.getByRole('button', { name: 'Xem kết quả' })).toBeVisible(); expect(sounds.filter(e => e.src.endsWith('/final.ogg'))).toHaveLength(0);
});
it('slow or broken art falls back; complete image failure still permits finishing', () => {
  vi.useFakeTimers(); seed(); render(<App/>); fireEvent.click(screen.getByRole('button', { name: 'Khôi phục thư viện' })); act(() => vi.advanceTimersByTime(1000)); expect(document.querySelector('.finale-stage')).toHaveClass('uses-fallback');
  fireEvent.error(screen.getByAltText('Thư viện đã sáng lại')); fireEvent.click(screen.getByRole('button', { name: 'Bỏ qua hiệu ứng' })); expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'Xem kết quả' })).toBeVisible();
});
it('cannot start the finale before all core sections are complete', () => {
  localStorage.setItem(SAVE_KEY, JSON.stringify(completedRooms(4))); window.history.replaceState({}, '', '/final'); render(<App/>); expect(screen.getByRole('button', { name: 'Khôi phục thư viện' })).toBeDisabled(); expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
