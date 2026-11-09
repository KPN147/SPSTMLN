import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import App from '../App';
import { SAVE_KEY } from '../restoration/engine';

const csrf = 'test-session-csrf-value-with-at-least-32-characters';
const session = () => ({ csrf, expiresAt: Date.now() + 7200000 });
let signedIn = false, denied = false;
const fetcher = vi.fn(async (url: string, init?: RequestInit) => {
  const action = url.split('/').pop();
  if (action === 'session') return Response.json(signedIn ? session() : { message: 'Phiên đã khóa.' }, { status: signedIn ? 200 : 401 });
  if (action === 'login') { signedIn = true; return Response.json(session()); }
  if (action === 'logout') { signedIn = false; return Response.json({ locked: true }); }
  return denied ? Response.json({ message: 'Phiên đã hết hạn.' }, { status: 401 }) : Response.json({ effect: JSON.parse(String(init?.body)).effect, expiresAt: Date.now() + 7200000 });
});
beforeEach(() => { localStorage.clear(); signedIn = false; denied = false; fetcher.mockClear(); vi.stubGlobal('fetch', fetcher); window.history.replaceState({}, '', '/admin'); });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
async function login() { render(<App/>); const input = await screen.findByLabelText('Mã truy cập'); fireEvent.change(input, { target: { value: 'test-only-input' } }); fireEvent.click(screen.getByRole('button', { name: 'Mở bảng thuyết trình' })); await screen.findByRole('button', { name: 'Trình diễn Khởi nguyên' }); }
it('opening admin does not even read main progress or trigger corrupted-save migration', async () => {
  localStorage.setItem(SAVE_KEY, 'broken-v3'); localStorage.setItem('mln131-council-save-v2', 'broken-v2');
  const read = vi.spyOn(Storage.prototype, 'getItem'), write = vi.spyOn(Storage.prototype, 'setItem'); render(<App/>); await screen.findByLabelText('Mã truy cập');
  for (const key of [SAVE_KEY, 'mln131-council-save-v2', 'mln131-escape-save-v1']) { expect(read.mock.calls.some(args => args[0] === key)).toBe(false); expect(write.mock.calls.some(args => args[0] === key)).toBe(false); }
  expect(screen.queryByText('Chọn hành trình của bạn')).not.toBeInTheDocument();
});
it('clears code on submit, shows five effects and authorizes each play and replay', async () => {
  await login(); expect(screen.queryByLabelText('Mã truy cập')).not.toBeInTheDocument(); expect(screen.getAllByRole('button', { name: /^Trình diễn / })).toHaveLength(5);
  const trigger = screen.getByRole('button', { name: 'Trình diễn Khởi nguyên' }); fireEvent.click(trigger); let dialog = await screen.findByRole('dialog');
  expect(fetcher.mock.calls.find(([url]) => url.endsWith('/play'))?.[1]?.headers).toMatchObject({ 'X-Presenter-CSRF': csrf });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Bỏ qua hiệu ứng' })); fireEvent.click(within(dialog).getByRole('button', { name: 'Phát lại' })); dialog = await screen.findByRole('dialog');
  expect(fetcher.mock.calls.filter(([url]) => url.endsWith('/play'))).toHaveLength(2); fireEvent.click(within(dialog).getByRole('button', { name: 'Đóng cửa sổ' })); expect(trigger).toHaveFocus(); expect(localStorage.getItem(SAVE_KEY)).toBeNull();
});
it('double click sends one play request; expired sessions cannot play an effect', async () => {
  await login(); denied = true; const trigger = screen.getByRole('button', { name: 'Trình diễn Toàn thư viện' }); fireEvent.click(trigger); fireEvent.click(trigger);
  await screen.findByLabelText('Mã truy cập'); expect(fetcher.mock.calls.filter(([url]) => url.endsWith('/play'))).toHaveLength(1); expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(screen.getByRole('status')).toHaveTextContent('hết hạn');
});
it('logout clears the UI and calls server-side logout with CSRF', async () => {
  await login(); fireEvent.click(screen.getByRole('button', { name: 'Khóa' })); await screen.findByLabelText('Mã truy cập'); await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Đã khóa'));
  expect(fetcher.mock.calls.find(([url]) => url.endsWith('/logout'))?.[1]?.headers).toMatchObject({ 'X-Presenter-CSRF': csrf });
});
it('handles HTML rate-limit responses and connection failures without exposing a code', async () => {
  fetcher.mockImplementationOnce(async () => Response.json({}, { status: 401 })); render(<App/>); await screen.findByLabelText('Mã truy cập');
  fetcher.mockImplementationOnce(async () => new Response('Limited', { status: 429 })); fireEvent.change(screen.getByLabelText('Mã truy cập'), { target: { value: 'test-only-input' } }); fireEvent.click(screen.getByRole('button', { name: 'Mở bảng thuyết trình' }));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('chờ một phút')); expect(screen.getByLabelText('Mã truy cập')).toHaveValue('');
  fetcher.mockImplementationOnce(async () => { throw new TypeError('Failed to fetch'); }); fireEvent.change(screen.getByLabelText('Mã truy cập'), { target: { value: 'test-only-input' } }); fireEvent.click(screen.getByRole('button', { name: 'Mở bảng thuyết trình' })); await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('kiểm tra Internet'));
});
it('active session restored by the server can play the shared final cinematic', async () => {
  signedIn = true; render(<App/>); fireEvent.click(await screen.findByRole('button', { name: 'Trình diễn Toàn thư viện' })); const dialog = await screen.findByRole('dialog', { name: 'Bạn đã hoàn thành hành trình' });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Bỏ qua hiệu ứng' })); fireEvent.click(within(dialog).getByRole('button', { name: 'Về bảng thuyết trình' })); expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(window.location.pathname).toBe('/admin');
});
it('does not allow a delayed play response to reopen the effect after locking', async () => {
  await login(); let resolve!: (r: Response) => void; fetcher.mockImplementationOnce(() => new Promise<Response>(r => { resolve = r; }));
  fireEvent.click(screen.getByRole('button', { name: 'Trình diễn Sứ mệnh' })); fireEvent.click(screen.getByRole('button', { name: 'Khóa' })); await screen.findByLabelText('Mã truy cập');
  await act(async () => resolve(Response.json({ effect: 'room-2', expiresAt: Date.now() + 7200000 }))); expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
