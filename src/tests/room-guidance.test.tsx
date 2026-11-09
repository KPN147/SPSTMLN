import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
// V2 UI remains under regression to validate the preserved migration source.
import App from '../council/Application';
import { chapters } from '../council/content';
import { newCouncilGame, SAVE_KEY_V2 } from '../council/engine';
import { prepareChapter } from './council-fixtures';

const esc = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); window.history.replaceState({}, '', '/room/1'); });

describe('Hướng dẫn qua phòng', () => {
  it('dẫn người chơi qua phòng chỉ bằng chứng cứ bắt buộc, kiểm chứng và hội đồng', () => {
    render(<App/>);
    const c = chapters[0];
    const guide = screen.getByRole('region', { name: 'Việc cần làm tiếp theo' });
    expect(within(guide).getByText('0/4 bắt buộc')).toBeVisible();
    expect(within(guide).getByText(/không cần tìm đủ 7 hồ sơ/)).toBeVisible();
    for (const e of c.evidence.filter(e => e.kind === 'essential')) {
      fireEvent.click(within(guide).getByRole('button', { name: new RegExp(`^Mở hồ sơ ${e.index + 1}:`) }));
      expect(screen.getByRole('region', { name: `Kiểm tra ${e.title}` })).toBeVisible();
      fireEvent.click(screen.getByRole('button', { name: /^Ghi nhận chứng cứ · / }));
    }
    expect(within(guide).getByText('4/4 bắt buộc')).toBeVisible();
    fireEvent.click(within(guide).getByRole('button', { name: /^Làm kiểm chứng 1:/ }));
    for (const [index, task] of c.investigations.entries()) {
      const panel = within(screen.getByRole('region', { name: task.title }));
      const submit = () => fireEvent.click(panel.getByRole('button', { name: /^(Kiểm tra bản phục dựng|Chạy thử hệ thống|Khởi động đồng hồ)/ }));
      if (index === 0) {
        submit();
        expect(panel.getByRole('alert')).toHaveTextContent('chưa gắn');
      }
      for (const [i, item] of task.items.entries()) {
        const target = task.targets.findIndex(t => t.id === item.target);
        fireEvent.click(panel.getByRole('button', { name: item.label }));
        fireEvent.click(within(panel.getByRole('group', { name: 'Vị trí phục dựng' })).getAllByRole('button')[index === 0 && i === 0 ? (target + 1) % task.targets.length : target]);
      }
      if (index === 0) {
        submit();
        expect(panel.getByRole('alert')).toHaveTextContent(`“${task.items[0].label}” chưa khớp`);
        fireEvent.click(panel.getByRole('button', { name: new RegExp(`^${esc(task.items[0].label)}`) }));
        fireEvent.click(within(panel.getByRole('group', { name: 'Vị trí phục dựng' })).getAllByRole('button')[task.targets.findIndex(t => t.id === task.items[0].target)]);
      }
      submit();
      expect(panel.getByText(task.success)).toBeVisible();
      fireEvent.click(panel.getByRole('button', { name: 'Tiếp tục bước tiếp theo' }));
    }
    const council = within(screen.getByRole('dialog', { name: 'Bàn hội đồng' }));
    expect(council.getByText(/Chọn ít nhất 3 hồ sơ để đủ căn cứ/)).toBeVisible();
    fireEvent.click(council.getByRole('radio', { name: c.council.conclusions.find(o => o.id === c.council.correctConclusion)!.text }));
    for (const id of c.council.evidenceSets[0]) {
      const evidence = c.evidence.find(e => e.id === id)!;
      fireEvent.click(council.getByRole('checkbox', { name: new RegExp(`^${esc(evidence.title)}`) }));
    }
    fireEvent.click(council.getByRole('radio', { name: c.council.repairs.find(o => o.id === c.council.correctRepair)!.text }));
    fireEvent.click(council.getByRole('button', { name: 'Đề xuất với hội đồng' }));
    const save = JSON.parse(localStorage.getItem(SAVE_KEY_V2)!);
    expect(save.chapters[1].restored).toBe(true);
    expect(save.chapters[1].discovered).toHaveLength(4);
    fireEvent.click(screen.getByRole('link', { name: 'Sang phòng 2' }));
    expect(screen.getByRole('heading', { name: chapters[1].name })).toBeVisible();
  });

  it('tải lại khi đủ điều kiện vẫn chỉ thẳng tới hội đồng, không bắt tìm hồ sơ phụ', () => {
    localStorage.setItem(SAVE_KEY_V2, JSON.stringify(prepareChapter(newCouncilGame(), 1, false)));
    render(<App/>);
    const guide = within(screen.getByRole('region', { name: 'Việc cần làm tiếp theo' }));
    expect(guide.getByText('4/4 bắt buộc')).toBeVisible();
    expect(guide.getByText('3/3 hoàn thành')).toBeVisible();
    fireEvent.click(guide.getByRole('button', { name: 'Mở hội đồng để qua phòng' }));
    expect(screen.getByRole('dialog', { name: 'Bàn hội đồng' })).toBeVisible();
  });

  it('đề xuất sớm vẫn cho quay lại hồ sơ cần tìm, giữ nguyên lượt chơi', () => {
    render(<App/>);
    fireEvent.click(screen.getByRole('button', { name: 'Bàn hội đồng' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Đề xuất với hội đồng' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Hồ sơ còn thiếu');
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Đóng cửa sổ' }));
    expect(within(screen.getByRole('region', { name: 'Việc cần làm tiếp theo' })).getByRole('button', { name: /^Mở hồ sơ 1:/ })).toBeVisible();
  });
});
