import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Application from '../restoration/Application';
import { rooms } from '../restoration/curriculum';
import { fresh, parse, SAVE_KEY } from '../restoration/engine';
import { GUIDE_INTRO_KEY } from '../council/GuideOnboarding';
import { LEGACY_SAVE_KEY, SAVE_KEY_V2 } from '../council/engine';
import { finishThrough } from './council-fixtures';

const saved = () => parse(localStorage.getItem(SAVE_KEY)!);
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear();
  localStorage.setItem(GUIDE_INTRO_KEY, 'seen');
  window.history.replaceState({}, '', '/');
});
afterEach(() => { vi.restoreAllMocks(); });

describe('Chọn hành trình và bảo vệ bản lưu cũ', () => {
  it('chưa ghi V3 trước lựa chọn; tiếp tục giữ phòng đã qua, tài liệu và ghi chú', () => {
    const old = finishThrough(1); old.chapters[1].hypothesis = 'Ghi chú chưa muốn mất';
    const raw = JSON.stringify(old);
    localStorage.setItem(SAVE_KEY_V2, raw); localStorage.setItem(LEGACY_SAVE_KEY, 'old-v1');
    render(<Application/>);
    expect(screen.getByRole('heading', { name: 'Chọn hành trình của bạn' })).toBeVisible();
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Tiếp tục hành trình' }));
    expect(saved().rooms[1].completed).toHaveLength(4);
    expect(saved().rooms[1].imported).toEqual(saved().rooms[1].completed);
    expect(saved().rooms[1].evidence).toEqual(old.chapters[1].discovered);
    expect(saved().rooms[1].notes).toBe('Ghi chú chưa muốn mất');
    expect(localStorage.getItem(SAVE_KEY_V2)).toBe(raw);
    expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBe('old-v1');
    expect(screen.queryByRole('heading', { name: 'Chọn hành trình của bạn' })).not.toBeInTheDocument();
  });

  it('bắt đầu hành trình mới tạo V3 riêng và giữ nguyên V1/V2', () => {
    const raw = JSON.stringify(finishThrough(2));
    localStorage.setItem(SAVE_KEY_V2, raw); localStorage.setItem(LEGACY_SAVE_KEY, 'v1-original');
    window.history.replaceState({}, '', '/room/3');
    render(<Application/>);
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu hành trình mới' }));
    for (const r of rooms) {
      expect(saved().rooms[r.id].completed).toHaveLength(0);
      expect(saved().rooms[r.id].evidence).toHaveLength(0);
    }
    expect(localStorage.getItem(SAVE_KEY_V2)).toBe(raw);
    expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBe('v1-original');
    expect(screen.getByRole('heading', { name: rooms[0].name })).toBeVisible();
  });

  it('V3 lỗi không bị tự ghi đè khi vào phòng; bắt đầu mới cần thao tác rõ ràng', () => {
    const old = JSON.stringify(finishThrough(1));
    localStorage.setItem(SAVE_KEY, '{damaged-v3'); localStorage.setItem(SAVE_KEY_V2, old);
    window.history.replaceState({}, '', '/room/1'); render(<Application/>);
    expect(screen.getByRole('region', { name: 'Khôi phục hành trình' })).toHaveTextContent('Chưa có dữ liệu nào bị ghi đè');
    expect(localStorage.getItem(SAVE_KEY)).toBe('{damaged-v3');
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu bản lưu mới' }));
    expect(saved().version).toBe(3);
    expect(localStorage.getItem(SAVE_KEY_V2)).toBe(old);
    expect(screen.getByRole('heading', { name: rooms[0].name })).toBeVisible();
  });

  it('V2 lỗi được giữ riêng, bản mới vẫn cho chơi và báo tình trạng thật', () => {
    localStorage.setItem(SAVE_KEY_V2, '{damaged-v2');
    render(<Application/>);
    expect(screen.getByRole('status')).toHaveTextContent('Bản lưu cũ không đọc được');
    expect(localStorage.getItem(SAVE_KEY_V2)).toBe('{damaged-v2');
    expect(screen.getByRole('link', { name: 'Mở hồ sơ đầu tiên' })).toBeVisible();
  });

  it('đã có V3 hợp lệ thì tiếp tục V3, không hỏi lại việc chuyển bản', () => {
    const next = fresh(); next.rooms[1].notes = 'Ghi chú của bản mới';
    localStorage.setItem(SAVE_KEY, JSON.stringify(next)); localStorage.setItem(SAVE_KEY_V2, JSON.stringify(finishThrough(2)));
    render(<Application/>);
    expect(screen.queryByRole('heading', { name: 'Chọn hành trình của bạn' })).not.toBeInTheDocument();
    expect(saved().rooms[1].notes).toBe('Ghi chú của bản mới');
    expect(saved().rooms[1].completed).toHaveLength(0);
  });

  it('reset có xác nhận và chỉ thay tiến độ V3', () => {
    const raw = JSON.stringify(finishThrough(1)), next = fresh(); next.rooms[1].notes = 'Giữ ghi chú nếu hủy';
    localStorage.setItem(SAVE_KEY_V2, raw); localStorage.setItem(LEGACY_SAVE_KEY, 'legacy');
    localStorage.setItem(SAVE_KEY, JSON.stringify(next)); render(<Application/>);
    fireEvent.click(screen.getByRole('button', { name: 'Chơi lại hành trình mới' }));
    fireEvent.click(screen.getByRole('button', { name: 'Giữ tiến độ' }));
    expect(saved().rooms[1].notes).toBe('Giữ ghi chú nếu hủy');
    fireEvent.click(screen.getByRole('button', { name: 'Chơi lại hành trình mới' }));
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu lại' }));
    expect(saved().rooms[1].notes).toBe('');
    expect(localStorage.getItem(SAVE_KEY_V2)).toBe(raw);
    expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBe('legacy');
  });
});

describe('Lưu bị chặn và demo độc lập', () => {
  it('không ghi được vẫn thu thập, đổi vai và tra hướng dẫn trong cùng tab', () => {
    const original = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      if (key === SAVE_KEY) throw Error('Storage denied');
      original.call(this, key, value);
    });
    window.history.replaceState({}, '', '/room/1'); render(<Application/>);
    const roles = within(screen.getByRole('group', { name: 'Chuyển nhân vật' }));
    fireEvent.click(roles.getByRole('button', { name: /Vy/ }));
    expect(roles.getByRole('button', { name: /Vy/ })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: /^Mở hồ sơ:/ }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^Ghi nhận chứng cứ/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Không thể lưu');
    expect(screen.getByRole('region', { name: rooms[0].steps[0].title })).toBeVisible();
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
    const nav = within(screen.getByRole('navigation', { name: 'Điều hướng chính' }));
    fireEvent.click(nav.getByRole('link', { name: 'Hướng dẫn' }));
    fireEvent.click(screen.getAllByRole('link', { name: 'Quay lại chơi' })[0]);
    expect(window.location.pathname).toBe('/room/1');
    expect(screen.getByRole('region', { name: rooms[0].steps[0].title })).toBeVisible();
  });

  it('demo hoàn thành cả ba phần mà không đọc hoặc ghi bản lưu V1/V2/V3', () => {
    const previous = { [SAVE_KEY]: '{damaged-but-keep', [SAVE_KEY_V2]: JSON.stringify(finishThrough(1)), [LEGACY_SAVE_KEY]: 'v1' };
    for (const [key, value] of Object.entries(previous)) localStorage.setItem(key, value);
    const original = Storage.prototype.getItem;
    const reads = vi.spyOn(Storage.prototype, 'getItem');
    const writes = vi.spyOn(Storage.prototype, 'setItem');
    window.history.replaceState({}, '', '/demo'); render(<Application/>);
    fireEvent.click(screen.getByRole('button', { name: /^Ghi nhận chứng cứ/ }));
    fireEvent.click(screen.getByRole('button', { name: /^Ghi nhận chứng cứ/ }));
    const task = rooms[2].steps[3], i = task.interaction;
    if (i.kind !== 'council') throw Error('Demo cần hội đồng');
    fireEvent.click(screen.getByRole('radio', { name: i.decisions.find(o => o.id === i.correctDecision)!.text }));
    fireEvent.click(screen.getByRole('button', { name: 'Tiếp theo' }));
    const proof = i.proofOptions.find(p => p.reasonIds.length)!;
    fireEvent.click(screen.getByRole('radio', { name: proof.text }));
    fireEvent.click(screen.getByRole('button', { name: 'Tiếp theo' }));
    fireEvent.click(screen.getByRole('radio', { name: i.reasons.find(r => r.id === proof.reasonIds[0])!.text }));
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận phục dựng' }));
    expect(screen.getByRole('status')).toHaveTextContent(task.finding.text);
    const sensitive = Object.keys(previous);
    expect(reads.mock.calls.filter(([key]) => sensitive.includes(key))).toHaveLength(0);
    expect(writes.mock.calls.filter(([key]) => sensitive.includes(key))).toHaveLength(0);
    for (const [key, value] of Object.entries(previous)) expect(original.call(localStorage, key)).toBe(value);
  });
});
