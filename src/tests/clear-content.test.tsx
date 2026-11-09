import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioProvider } from '../council/Audio';
import { CouncilPanel, EvidenceBody } from '../council/Panels';
import { allEvidence, chapters, knowledge } from '../council/content';
import { blankDraft, judgeCase, parseCouncilSave } from '../council/engine';
import type { CouncilCase, CouncilDraft, Verdict } from '../council/types';
import { fullCouncilSave, winningDraft } from './council-fixtures';

const cases = chapters.flatMap(c => [c.council, c.finalCase]);
const esc = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });

function CouncilHarness({ definition, changed }: { definition: CouncilCase; changed: () => void }) {
  const [draft, setDraft] = useState<CouncilDraft>(blankDraft);
  const [feedback, setFeedback] = useState<Verdict | null>(null);
  const cards = chapters.find(c => c.id === definition.chapterId)!.evidence.filter(e => e.kind !== 'story');
  return <AudioProvider><CouncilPanel definition={definition} draft={draft} cards={cards}
    onChange={next => { changed(); setDraft(next); setFeedback(null); }}
    onSubmit={() => setFeedback(judgeCase(definition, draft, cards.map(e => e.id)))} feedback={feedback} resolved={feedback?.ok}/></AudioProvider>;
}

describe('Đọc hiểu và trả lời hội đồng', () => {
  it.each(cases)('$id: có câu hỏi, căn cứ và ví dụ để tự hoàn thành đủ ba bước', c => {
    const changed = vi.fn();
    render(<CouncilHarness definition={c} changed={changed}/>);
    expect(screen.getByText(c.guide.question)).toBeVisible();
    fireEvent.click(screen.getByText('Xem một cách trả lời mẫu và lý do'));
    const example = screen.getByText('Xem một cách trả lời mẫu và lý do').closest('details')!;
    expect(example).toHaveAttribute('open');
    expect(example).toHaveTextContent(c.guide.explanation);
    expect(changed).not.toHaveBeenCalled();
    expect(screen.getAllByRole('radio').every(input => !(input as HTMLInputElement).checked)).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name: c.conclusions.find(o => o.id === c.correctConclusion)!.text }));
    for (const id of c.evidenceSets[0]) {
      const e = allEvidence.find(e => e.id === id)!;
      fireEvent.click(screen.getByRole('checkbox', { name: new RegExp(`^${esc(e.title)}`) }));
    }
    fireEvent.click(screen.getByRole('radio', { name: c.repairs.find(o => o.id === c.correctRepair)!.text }));
    fireEvent.click(screen.getByRole('button', { name: 'Đề xuất với hội đồng' }));
    expect(screen.getByRole('status')).toHaveTextContent(c.success);
  });

  it('hồ sơ có ý chính dễ đọc, vẫn mở được diễn giải gốc và thấy trạng thái nguồn', () => {
    const e = chapters[0].evidence[0];
    render(<EvidenceBody evidence={e}/>);
    expect(screen.getByText(e.summary)).toBeVisible();
    expect(screen.getByText(e.body)).not.toBeVisible();
    expect(screen.getByText('Diễn giải đang chờ duyệt đối chiếu nguồn.')).toBeVisible();
    fireEvent.click(screen.getByText('Đọc bản diễn giải đầy đủ'));
    expect(screen.getByText(e.body)).toBeVisible();
  });

  it('lựa chọn sai được giải thích đúng phần, nút sửa đưa focus về bước đó', () => {
    const c = chapters[0].council;
    render(<CouncilHarness definition={c} changed={() => {}}/>);
    const wrong = c.conclusions.find(o => o.id !== c.correctConclusion)!;
    fireEvent.click(screen.getByRole('radio', { name: wrong.text }));
    fireEvent.click(screen.getByRole('button', { name: 'Đề xuất với hội đồng' }));
    expect(screen.getByRole('alert')).toHaveTextContent(wrong.explanation);
    fireEvent.click(screen.getByRole('button', { name: 'Sửa bước 1' }));
    expect(document.activeElement).toHaveAttribute('data-step', 'conclusion');
  });
});

describe('Căn cứ chứng minh và tương thích tiến độ', () => {
  it.each(cases)('$id: mọi bộ mẫu đều có lý do, thẻ liên quan bổ sung được chấp nhận', c => {
    const available = allEvidence.filter(e => e.chapterId === c.chapterId).map(e => e.id);
    for (const set of c.evidenceSets) {
      for (const id of set) expect(c.guide.evidenceNotes[id]?.length).toBeGreaterThan(20);
      expect(judgeCase(c, { ...winningDraft(c), evidence: set }, available).ok).toBe(true);
    }
    expect(judgeCase(c, { ...winningDraft(c), evidence: Object.keys(c.guide.evidenceNotes) }, available).ok).toBe(true);
    for (const choice of [...c.conclusions, ...c.repairs]) expect(choice.explanation.length).toBeGreaterThan(20);
  });

  it('nêu tên hồ sơ thiếu và thẻ không liên quan thay vì chỉ báo sai chung chung', () => {
    const c = chapters[0].council, available = chapters[0].evidence.map(e => e.id), good = winningDraft(c);
    const missing = judgeCase(c, { ...good, evidence: ['c1-e1', 'c1-e2'] }, available);
    expect(missing.message).toContain('Hồ sơ tác giả & tác phẩm'); expect(missing.step).toBe('evidence');
    const extra = judgeCase(c, { ...good, evidence: [...good.evidence, 'c1-e4'] }, available);
    expect(extra.ok).toBe(false); expect(extra.message).toContain('Các mốc lịch sử'); expect(extra.message).toContain('Hãy bỏ');
    expect(judgeCase(c, { ...good, evidence: [...good.evidence, 'c1-e7'] }, available).ok).toBe(false);
    expect(judgeCase(c, { ...good, evidence: [...good.evidence, good.evidence[0]] }, available).ok).toBe(false);
  });

  it('đoạn cuối về tuyến chuyển tiếp chấp nhận hồ sơ trực tiếp trả lời câu hỏi', () => {
    const c = chapters[2].finalCase;
    expect(judgeCase(c, { ...winningDraft(c), evidence: ['c3-e3'] }, ['c3-e3']).ok).toBe(true);
  });

  it('giữ được bản lưu cũ dùng hai thẻ ở đoạn cuối về tuyến chuyển tiếp', () => {
    const old = fullCouncilSave(false);
    old.chapters[3].finalDraft.evidence = ['c3-e1', 'c3-e3'];
    expect(parseCouncilSave(JSON.stringify(old))).toEqual(old);
  });

  it('bản đọc ngắn phủ đủ hồ sơ, vẫn giữ nguyên 16 mục tiêu và trạng thái chờ duyệt', () => {
    expect(allEvidence).toHaveLength(28);
    for (const e of allEvidence) expect(e.summary.length).toBeGreaterThan(35);
    const objectives = chapters.flatMap(c => [...c.investigations.map(t => t.objectiveId), `r${c.id}-p4`]);
    expect(new Set(objectives).size).toBe(16);
    for (const id of objectives) expect(knowledge(id).source.sourceReviewStatus).toBe('needs-review');
  });
});
