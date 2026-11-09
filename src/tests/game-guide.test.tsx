import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
// V2 UI remains under regression to validate the preserved migration source.
import App from '../council/Application';
import { GUIDE_INTRO_KEY } from '../council/GuideOnboarding';
import { chapters } from '../council/content';
import { LEGACY_SAVE_KEY, newCouncilGame, SAVE_KEY_V2 } from '../council/engine';
import { prepareChapter } from './council-fixtures';

const nav = () => within(screen.getByRole('navigation', { name: 'Điều hướng chính' }));
const hint = () => screen.queryByRole('region', { name: 'Gợi ý cho người mới' });
const guideLink = () => nav().getByRole('link', { name: 'Hướng dẫn' });
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); window.history.replaceState({}, '', '/'); });
afterEach(() => { vi.restoreAllMocks(); });

describe('Tab hướng dẫn và gợi ý lần đầu', () => {
  it('chỉ đúng tab, mở trang riêng, giữ trạng thái đã đọc sau khi tải lại', () => {
    const view = render(<App/>);
    expect(hint()).toBeVisible();
    expect(guideLink()).toHaveAccessibleDescription(/Bấm tab Hướng dẫn/);
    fireEvent.click(guideLink());
    expect(window.location.pathname).toBe('/guide');
    expect(guideLink()).toHaveAttribute('aria-current', 'page');
    expect(document.title).toMatch(/^Hướng dẫn ·/);
    expect(hint()).not.toBeInTheDocument();
    expect(localStorage.getItem(GUIDE_INTRO_KEY)).toBe('seen');
    const toc = screen.getByRole('navigation', { name: 'Mục lục hướng dẫn' });
    expect(within(toc).getAllByRole('link')).toHaveLength(10);
    for (const link of within(toc).getAllByRole('link')) {
      expect(document.querySelector(link.getAttribute('href')!)).toHaveAttribute('aria-labelledby');
    }
    fireEvent.click(screen.getByRole('link', { name: 'Quay lại trang vừa mở' }));
    expect(window.location.pathname).toBe('/');
    view.unmount(); render(<App/>);
    expect(hint()).not.toBeInTheDocument();
    expect(guideLink()).toBeVisible();
  });

  it.each(['Đóng gợi ý hướng dẫn', 'Để sau'])('%s đóng gợi ý, trả focus về tab và nhớ lựa chọn', label => {
    const view = render(<App/>);
    fireEvent.click(within(hint()!).getByRole('button', { name: label }));
    expect(hint()).not.toBeInTheDocument();
    expect(guideLink()).toHaveFocus();
    view.unmount(); render(<App/>);
    expect(hint()).not.toBeInTheDocument();
  });

  it('Escape đóng gợi ý nhưng không xử lý phím của cửa sổ đang mở', () => {
    render(<App/>);
    fireEvent.click(screen.getByRole('button', { name: 'Cài đặt trải nghiệm' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(hint()).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Đóng cửa sổ' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(hint()).not.toBeInTheDocument();
    expect(guideLink()).toHaveFocus();
  });

  it('vào trực tiếp hướng dẫn cũng ghi nhận đã đọc và không phủ gợi ý', () => {
    window.history.replaceState({}, '', '/guide'); render(<App/>);
    expect(hint()).not.toBeInTheDocument();
    expect(localStorage.getItem(GUIDE_INTRO_KEY)).toBe('seen');
    fireEvent.click(nav().getByRole('link', { name: 'Bản đồ' }));
    expect(hint()).not.toBeInTheDocument();
  });

  it('khi thiết bị chặn lưu, đóng gợi ý vẫn có tác dụng qua cả demo trong tab hiện tại', () => {
    const original = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      if (key === GUIDE_INTRO_KEY) throw new Error('Storage denied');
      original.call(this, key, value);
    });
    render(<App/>);
    fireEvent.click(within(hint()!).getByRole('button', { name: 'Để sau' }));
    fireEvent.click(screen.getByRole('link', { name: 'Chơi thử 3 phút' }));
    expect(window.location.pathname).toBe('/demo');
    expect(hint()).not.toBeInTheDocument();
    fireEvent.click(nav().getByRole('link', { name: 'Bản đồ' }));
    expect(hint()).not.toBeInTheDocument();
  });
});

describe('Hướng dẫn chi tiết và ví dụ độc lập', () => {
  it('tập ghép thẻ có phản hồi thiếu/sai/đúng và làm lại, không ghi tiến độ game', () => {
    const saved = JSON.stringify(prepareChapter(newCouncilGame(), 1));
    localStorage.setItem(SAVE_KEY_V2, saved);
    localStorage.setItem(LEGACY_SAVE_KEY, 'legacy-untouched');
    window.history.replaceState({}, '', '/guide'); render(<App/>);
    const practice = within(screen.getByLabelText('Thử ghép một thẻ'));
    const check = () => fireEvent.click(practice.getByRole('button', { name: '3. Kiểm tra ví dụ' }));
    const card = () => practice.getByRole('button', { name: /^Học thuyết tiến hóa/ });
    expect(practice.getByRole('button', { name: 'Khoa học tự nhiên' })).toBeDisabled();
    check(); expect(practice.getByRole('status')).toHaveTextContent('Bạn chưa gắn thẻ');
    fireEvent.click(card());
    fireEvent.click(practice.getByRole('button', { name: 'Điều kiện kinh tế – xã hội' }));
    check(); expect(practice.getByRole('status')).toHaveTextContent('Chọn lại thẻ');
    fireEvent.click(card());
    fireEvent.click(practice.getByRole('button', { name: 'Khoa học tự nhiên' }));
    check(); expect(practice.getByRole('status')).toHaveTextContent('Đúng rồi!');
    fireEvent.click(practice.getByRole('button', { name: 'Làm lại ví dụ' }));
    expect(practice.queryByRole('status')).not.toBeInTheDocument();
    expect(card()).toHaveAttribute('aria-pressed', 'false');
    expect(localStorage.getItem(SAVE_KEY_V2)).toBe(saved);
    expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBe('legacy-untouched');
  });

  it('đi từ phòng sang hướng dẫn và quay lại vẫn giữ lựa chọn, hội thoại và ghi chú', () => {
    const saved = prepareChapter(newCouncilGame(), 1);
    saved.chapters[1].council = { conclusion: chapters[0].council.correctConclusion, evidence: ['c1-e1'], repair: '' };
    saved.chapters[1].hypothesis = 'Cần đối chiếu xuất xứ';
    localStorage.setItem(SAVE_KEY_V2, JSON.stringify(saved));
    window.history.replaceState({}, '', '/room/1'); render(<App/>);
    const before = JSON.parse(localStorage.getItem(SAVE_KEY_V2)!);
    fireEvent.click(guideLink());
    expect(window.location.pathname).toBe('/guide');
    expect(JSON.parse(localStorage.getItem(SAVE_KEY_V2)!)).toEqual(before);
    // Browsers discard history state for native same-page anchors.
    act(() => {
      window.history.pushState(null, '', '/guide#hoi-dong');
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });
    expect(screen.getByRole('link', { name: 'Quay lại trang vừa mở' })).toHaveAttribute('href', '/room/1');
    fireEvent.click(screen.getByRole('link', { name: 'Quay lại trang vừa mở' }));
    expect(window.location.pathname).toBe('/room/1');
    expect(JSON.parse(localStorage.getItem(SAVE_KEY_V2)!).chapters).toEqual(before.chapters);
  });

  it('đọc hướng dẫn không thay thế bản lưu lỗi hoặc đi theo địa chỉ trả về bên ngoài', () => {
    localStorage.setItem(SAVE_KEY_V2, '{damaged-save');
    window.history.replaceState({ usr: { guideFrom: 'https://example.com' } }, '', '/guide');
    render(<App/>);
    expect(localStorage.getItem(SAVE_KEY_V2)).toBe('{damaged-save');
    expect(screen.getByRole('link', { name: 'Mở bản đồ để bắt đầu' })).toHaveAttribute('href', '/play');
    expect(screen.queryByRole('link', { name: 'Quay lại trang vừa mở' })).not.toBeInTheDocument();
  });
});
