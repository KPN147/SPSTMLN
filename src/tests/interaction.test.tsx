import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { chapters } from '../council/content';
import { LEGACY_SAVE_KEY, SAVE_KEY_V2 } from '../council/engine';
import { finishThrough, fullCouncilSave } from './council-fixtures';
import type { CouncilCase } from '../council/types';

const esc = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function chooseCase(container: HTMLElement, definition: CouncilCase) {
  const ui = within(container);
  fireEvent.click(ui.getByRole('radio', { name: definition.conclusions.find(o => o.id === definition.correctConclusion)!.text }));
  for (const id of definition.evidenceSets[0]) {
    const e = chapters.flatMap(c => c.evidence).find(e => e.id === id)!;
    fireEvent.click(ui.getByRole('checkbox', { name: new RegExp(`^${esc(e.title)}`) }));
  }
  fireEvent.click(ui.getByRole('radio', { name: definition.repairs.find(o => o.id === definition.correctRepair)!.text }));
}
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); window.history.replaceState({}, '', '/'); });
describe('Hành trình điều tra', () => {
  it('mở thẳng phòng không tự ghi đè bản lưu hỏng trước thao tác người chơi', () => {
    localStorage.setItem(SAVE_KEY_V2, '{bad'); localStorage.setItem(LEGACY_SAVE_KEY, 'legacy-safe');
    window.history.replaceState({}, '', '/room/1'); render(<App/>);
    expect(screen.getByRole('status')).toHaveTextContent('bản lưu cũ chưa bị xóa'); expect(localStorage.getItem(SAVE_KEY_V2)).toBe('{bad');
    fireEvent.click(screen.getByRole('button', { name: /^1\. Kệ bản thảo/ })); expect(JSON.parse(localStorage.getItem(SAVE_KEY_V2)!).version).toBe(2); expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBe('legacy-safe');
  });
  it('panel đồ vật trên điện thoại đóng sau ghi nhận và khôi phục focus', () => {
    const width = window.innerWidth; Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 360 });
    try {
      window.history.replaceState({}, '', '/room/1'); const view = render(<App/>);
      const hotspot = screen.getByRole('button', { name: /^1\. Kệ bản thảo/ }); hotspot.focus(); fireEvent.click(hotspot);
      expect(screen.getByRole('dialog')).toBeVisible(); fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /An: Đối chiếu & lưu/ }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(document.body.style.overflow).toBe(''); expect(document.activeElement).toBe(hotspot);
      expect(JSON.parse(localStorage.getItem(SAVE_KEY_V2)!).chapters[1].discovered).toContain('c1-e1'); view.unmount();
    } finally { Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width }); }
  });
  it('không lưu được vẫn cho thu thập chứng cứ trong tab', () => {
    const write = vi.spyOn(Storage.prototype, 'setItem'); const original = write.getMockImplementation();
    write.mockImplementation(function (this: Storage, key, value) { if (key === SAVE_KEY_V2) throw Error('Storage blocked'); if (original) original.call(this, key, value); });
    try {
      window.history.replaceState({}, '', '/room/1'); render(<App/>);
      expect(screen.getByRole('status')).toHaveTextContent('Không thể lưu'); fireEvent.click(screen.getByRole('button', { name: /^1\. Kệ bản thảo/ })); fireEvent.click(screen.getByRole('button', { name: /An: Đối chiếu & lưu/ }));
      expect(screen.getByText('Đã đưa vào Sổ chung')).toBeVisible();
    } finally { write.mockRestore(); }
  });
  it('giữ lựa chọn đang làm khi mở Sổ chung, tải lại và đổi vai', () => {
    window.history.replaceState({}, '', '/room/1'); let view = render(<App/>);
    fireEvent.click(screen.getByRole('button', { name: /^1\. Kệ bản thảo/ }));
    fireEvent.click(screen.getByRole('button', { name: /An: Đối chiếu & lưu/ }));
    fireEvent.click(screen.getByRole('button', { name: /01 Đưa bản thảo về đúng ngăn/ }));
    const task = chapters[0].investigations[0];
    let region = screen.getByRole('region', { name: task.title });
    fireEvent.click(within(region).getByRole('button', { name: task.items[0].label }));
    fireEvent.click(within(region).getByRole('group', { name: 'Vị trí phục dựng' }).querySelectorAll('button')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Mở Sổ chung' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Đóng cửa sổ' }));
    region = screen.getByRole('region', { name: task.title }); expect(within(region).getByRole('button', { name: new RegExp(`^${esc(task.items[0].label)}`) })).toHaveTextContent(task.targets[0].label);
    view.unmount(); view = render(<App/>);
    fireEvent.click(screen.getByRole('button', { name: /01 Đưa bản thảo về đúng ngăn/ }));
    region = screen.getByRole('region', { name: task.title }); expect(within(region).getByRole('button', { name: new RegExp(`^${esc(task.items[0].label)}`) })).toHaveTextContent(task.targets[0].label);
    fireEvent.click(within(screen.getByRole('group', { name: 'Chuyển nhân vật' })).getByRole('button', { name: /Minh/ }));
    expect(JSON.parse(localStorage.getItem(SAVE_KEY_V2)!).activeRole).toBe('minh'); view.unmount();
  });
  it('chặn phòng, Phòng Lõi và kết quả chưa mở', () => {
    for (const [path, heading] of [['/room/4', 'Khu vực chưa mở'], ['/final', 'Phòng Lõi chưa mở'], ['/result', 'Hành trình còn tiếp diễn']]) { window.history.replaceState({}, '', path); const v = render(<App/>); expect(screen.getByRole('heading', { name: heading })).toBeVisible(); v.unmount(); }
  });
  it('giữ bản lưu V1 khi reset V2 và luôn hỏi xác nhận', () => {
    localStorage.setItem(LEGACY_SAVE_KEY, 'legacy-sentinel'); localStorage.setItem(SAVE_KEY_V2, JSON.stringify(finishThrough(2))); window.history.replaceState({}, '', '/room/3'); render(<App/>);
    expect(screen.getByRole('heading', { name: chapters[2].name })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Chơi lại hành trình mới' }));
    fireEvent.click(screen.getByRole('button', { name: 'Giữ tiến độ' })); expect(JSON.parse(localStorage.getItem(SAVE_KEY_V2)!).chapters[2].restored).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Chơi lại hành trình mới' })); fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu lại' }));
    expect(JSON.parse(localStorage.getItem(SAVE_KEY_V2)!).chapters[1].restored).toBe(false); expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBe('legacy-sentinel'); expect(window.location.pathname).toBe('/');
  });
  it('chơi qua bốn cuộc điều tra, 28 hồ sơ, Phòng Lõi và kết thúc đặc biệt', () => {
    window.history.replaceState({}, '', '/room/1'); let view = render(<App/>);
    for (const c of chapters) {
      expect(screen.getByRole('heading', { name: c.name })).toBeVisible();
      for (const e of c.evidence.slice(0, 6)) {
        fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${e.index + 1}\\. ${esc(c.hotspotNames[e.index])}`) }));
        fireEvent.click(screen.getByRole('button', { name: /^(An: Đối chiếu & lưu|Minh: Kiểm tra & trích xuất|Vy: Điều tra & ghi nhận)/ }));
      }
      for (const t of c.investigations) {
        fireEvent.click(within(screen.getByRole('group', { name: 'Các bước kiểm chứng' })).getByRole('button', { name: new RegExp(esc(t.title)) }));
        const region = within(screen.getByRole('region', { name: t.title }));
        for (const item of t.items) {
          fireEvent.click(region.getByRole('button', { name: item.label }));
          fireEvent.click(within(region.getByRole('group', { name: 'Vị trí phục dựng' })).getAllByRole('button')[t.targets.findIndex(target => target.id === item.target)]);
        }
        fireEvent.click(region.getByRole('button', { name: /^(Kiểm tra bản phục dựng|Chạy thử hệ thống|Khởi động đồng hồ)/ }));
        expect(region.getByText(t.success)).toBeVisible();
      }
      fireEvent.click(screen.getByRole('button', { name: 'Kiểm tra phong thư' }));
      fireEvent.click(screen.getByRole('button', { name: /Vy: Điều tra & ghi nhận/ }));
      fireEvent.click(screen.getByRole('button', { name: /Triệu tập hội đồng/ }));
      const dialog = screen.getByRole('dialog'); chooseCase(dialog, c.council);
      fireEvent.click(within(dialog).getByRole('button', { name: /Đề xuất với hội đồng/ }));
      expect(screen.getByRole('heading', { name: 'Một khu vực đã được phục dựng' })).toBeVisible();
      fireEvent.click(screen.getByRole('button', { name: 'Ở lại tìm hồ sơ phụ' }));
      fireEvent.click(screen.getByRole('link', { name: c.id === 4 ? 'Đến Phòng Lõi' : 'Điều tra khu vực tiếp theo' }));
      if (c.id === 2) { view.unmount(); view = render(<App/>); expect(screen.getByRole('heading', { name: chapters[2].name })).toBeVisible(); }
    }
    for (const c of chapters) {
      const tabs = within(screen.getByRole('group', { name: 'Các đoạn báo cáo' })); fireEvent.click(tabs.getByRole('button', { name: new RegExp(esc(c.shortName)) }));
      fireEvent.click(screen.getByRole('button', { name: /Phân công .* kiểm tra/ }));
      const region = screen.getByRole('region', { name: c.finalCase.title }); chooseCase(region, c.finalCase);
      fireEvent.click(within(region).getByRole('button', { name: /Đề xuất với hội đồng/ }));
      expect(within(region).getByRole('button', { name: /Đã xác nhận phục dựng/ })).toBeDisabled();
    }
    fireEvent.click(screen.getByRole('button', { name: 'Khôi phục thư viện' }));
    fireEvent.click(screen.getByRole('button', { name: /Bỏ qua chuyển cảnh · Xem kết quả/ }));
    expect(screen.getByRole('heading', { name: 'Ký ức được nối lại.' })).toBeVisible();
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY_V2)!); expect(saved.finalCompleted).toBe(true);
    view.unmount(); render(<App/>); expect(screen.getByRole('heading', { name: 'Ký ức được nối lại.' })).toBeVisible();
  }, 45000);
  it('kết thúc thường vẫn cho quay lại tìm thư', () => {
    localStorage.setItem(SAVE_KEY_V2, JSON.stringify(fullCouncilSave(false))); window.history.replaceState({}, '', '/result'); render(<App/>);
    expect(screen.getByRole('heading', { name: 'Thư viện đã sáng lại.' })).toBeVisible(); expect(screen.getByRole('link', { name: 'Tìm lại các ký ức' })).toBeVisible();
  });
});
describe('Bản chơi thử độc lập', () => {
  it('không đọc hoặc ghi V1/V2 kể cả khi chơi xong và chơi lại', () => {
    localStorage.setItem(SAVE_KEY_V2, 'v2-sentinel'); localStorage.setItem(LEGACY_SAVE_KEY, 'v1-sentinel'); window.history.replaceState({}, '', '/demo');
    const get = vi.spyOn(Storage.prototype, 'getItem'), set = vi.spyOn(Storage.prototype, 'setItem'); render(<App/>);
    fireEvent.click(screen.getByRole('button', { name: 'Minh: kiểm tra & ghi nhận' })); fireEvent.click(screen.getByRole('button', { name: 'An: kiểm tra & ghi nhận' }));
    const c = chapters[2].council; fireEvent.click(screen.getByRole('radio', { name: c.conclusions.find(o => o.id === c.correctConclusion)!.text }));
    for (const name of ['Nhật ký xóa toàn bộ', 'Phạm vi của “bỏ qua”']) fireEvent.click(screen.getByRole('checkbox', { name: new RegExp(`^${esc(name)}`) }));
    fireEvent.click(screen.getByRole('radio', { name: c.repairs.find(o => o.id === c.correctRepair)!.text })); fireEvent.click(screen.getByRole('button', { name: /Đề xuất với hội đồng/ }));
    expect(screen.getByRole('heading', { name: 'Bạn đã nối được hai góc nhìn.' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Chơi lại bản thử' })); expect(screen.getByRole('button', { name: 'Minh: kiểm tra & ghi nhận' })).toBeEnabled();
    expect(get).not.toHaveBeenCalledWith(SAVE_KEY_V2); expect(get).not.toHaveBeenCalledWith(LEGACY_SAVE_KEY);
    expect(set.mock.calls.some(call => call[0] === SAVE_KEY_V2 || call[0] === LEGACY_SAVE_KEY)).toBe(false); get.mockRestore(); set.mockRestore();
    expect(localStorage.getItem(SAVE_KEY_V2)).toBe('v2-sentinel'); expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBe('v1-sentinel');
  });
});
