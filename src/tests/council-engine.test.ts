import { describe, expect, it } from 'vitest';
import { allEvidence, allInvestigations, chapters, dialogues, finalReviewers, knowledge } from '../council/content';
import { blankDraft, councilReducer, coreUnlocked, judgeCase, judgeChapter, LEGACY_SAVE_KEY, loadCouncilGame, loreCount, newCouncilGame, parseCouncilSave, progressCount, SAVE_KEY_V2, unlocked } from '../council/engine';
import { finishThrough, fullCouncilSave, prepareChapter, winningDraft } from './council-fixtures';

describe('Nội dung Hội đồng phục dựng', () => {
  it('bao phủ 16 mục tiêu, 28 chứng cứ, sáu hotspot mỗi chương', () => {
    expect(chapters).toHaveLength(4); expect(allEvidence).toHaveLength(28); expect(allInvestigations).toHaveLength(12);
    const objectives = chapters.flatMap(c => [...c.investigations.map(t => t.objectiveId), `r${c.id}-p4`]);
    expect(new Set(objectives).size).toBe(16);
    for (const c of chapters) {
      expect(c.hotspotNames).toHaveLength(6); expect(c.evidence.filter(e => e.kind === 'essential')).toHaveLength(4);
      expect(c.evidence.filter(e => e.kind === 'support')).toHaveLength(2); expect(c.evidence.filter(e => e.kind === 'story')).toHaveLength(1);
      expect(dialogues.filter(d => d.chapterId === c.id)).toHaveLength(16);
      for (const e of c.evidence) { expect(e.body.length).toBeGreaterThan(40); if (!e.fiction) expect(knowledge(e.sourceId!).source.printedPages.length).toBeGreaterThan(0); }
      for (const definition of [c.council, c.finalCase]) {
        expect(definition.conclusions.some(o => o.id === definition.correctConclusion)).toBe(true);
        expect(definition.repairs.some(o => o.id === definition.correctRepair)).toBe(true);
        expect(definition.evidenceSets.length).toBeGreaterThan(1);
      }
    }
    expect(chapters[0].evidence[3].body).toContain('1871'); expect(chapters[0].evidence[3].body).toContain('1986');
  });
  it('đồ thị hội thoại không trỏ đến nút hoặc điều kiện không tồn tại', () => {
    const known = [...allEvidence.map(e => e.id), ...allInvestigations.map(t => t.id)];
    for (const d of dialogues) for (const choice of d.choices) { expect(dialogues.some(next => next.id === choice.next && next.chapterId === d.chapterId)).toBe(true); for (const id of choice.requires ?? []) expect(known).toContain(id); }
  });
  it('đáp án sửa hồ sơ không chấp nhận phương án phá hủy dữ liệu', () => {
    for (const c of chapters) for (const definition of [c.council, c.finalCase]) {
      const text = definition.repairs.find(r => r.id === definition.correctRepair)!.text;
      expect(text).not.toMatch(/^Xóa|^Chỉ đổi|^Giữ nguyên|^Sắp lại màu|^Giữ kết quả và xóa/);
    }
  });
});
describe('Luật điều tra và lập luận', () => {
  it.each(chapters)('chương $id hoàn thành bằng bốn chứng cứ thiết yếu, không ép tìm hồ sơ phụ', c => {
    const s = prepareChapter(finishThrough(c.id - 1, false), c.id, false);
    const drafted = councilReducer(s, { type: 'draft', chapter: c.id, draft: winningDraft(c.council) });
    expect(judgeChapter(drafted, c.id).ok).toBe(true);
  });
  it('hai thứ tự điều tra đều đi hết game và mở đủ 16 mục tiêu', () => {
    const s = fullCouncilSave(); expect(s.finalCompleted).toBe(true); expect(progressCount(s)).toBe(16); expect(loreCount(s)).toBe(4); expect(parseCouncilSave(JSON.stringify(s))).toEqual(s);
    let reverse = newCouncilGame();
    for (const c of chapters) {
      for (const index of [3, 2, 1, 0, 5, 4]) { const e = c.evidence[index]; reverse = councilReducer(reverse, { type: 'role', role: e.role }); reverse = councilReducer(reverse, { type: 'collect', chapter: c.id, id: e.id }); }
      for (const t of [...c.investigations].reverse()) { reverse = councilReducer(reverse, { type: 'role', role: t.role }); for (const i of t.items) reverse = councilReducer(reverse, { type: 'answer', chapter: c.id, id: t.id, item: i.id, target: i.target }); reverse = councilReducer(reverse, { type: 'solve', chapter: c.id, id: t.id }); }
      reverse = councilReducer(reverse, { type: 'role', role: 'khoi' }); reverse = councilReducer(reverse, { type: 'draft', chapter: c.id, draft: winningDraft(c.council, 1) }); reverse = councilReducer(reverse, { type: 'restore', chapter: c.id });
    }
    expect(coreUnlocked(reverse)).toBe(true);
  });
  it('không vượt khóa, không lấy chứng cứ bằng sai vai hoặc trước điều kiện', () => {
    const s = newCouncilGame();
    expect(councilReducer(s, { type: 'collect', chapter: 4, id: 'c4-e1' })).toBe(s);
    expect(councilReducer(s, { type: 'collect', chapter: 1, id: 'c1-e1' })).toBe(s);
    const minh = councilReducer(s, { type: 'role', role: 'minh' }); expect(councilReducer(minh, { type: 'collect', chapter: 1, id: 'c1-e5' })).toBe(minh);
    expect(unlocked(s, 2)).toBe(false); expect(councilReducer(s, { type: 'finish' })).toBe(s);
  });
  it('hội đồng phản biện sớm, kết luận sai, thẻ không liên quan và cách sửa sai', () => {
    const c = chapters[0]; expect(judgeChapter(newCouncilGame(), 1).kind).toBe('missing');
    const all = c.evidence.map(e => e.id), good = winningDraft(c.council);
    expect(judgeCase(c.council, { ...good, conclusion: c.council.conclusions.find(o => o.id !== c.council.correctConclusion)!.id }, all).kind).toBe('conclusion');
    expect(judgeCase(c.council, { ...good, evidence: [...good.evidence, c.evidence[6].id] }, all).kind).toBe('evidence');
    expect(judgeCase(c.council, { ...good, evidence: [good.evidence[0]] }, all).ok).toBe(false);
    expect(judgeCase(c.council, { ...good, repair: c.council.repairs.find(o => o.id !== c.council.correctRepair)!.id }, all).kind).toBe('repair');
    expect(judgeCase(c.council, blankDraft(), all).kind).toBe('missing');
  });
  it.each(chapters)('chương $id chấp nhận mọi bộ chứng cứ hợp lệ', c => {
    for (let i = 0; i < c.council.evidenceSets.length; i++) expect(judgeCase(c.council, winningDraft(c.council, i), c.evidence.map(e => e.id)).ok).toBe(true);
    for (let i = 0; i < c.finalCase.evidenceSets.length; i++) expect(judgeCase(c.finalCase, winningDraft(c.finalCase, i), c.evidence.map(e => e.id)).ok).toBe(true);
  });
  it('lấy lại chứng cứ, xem lại hội thoại và nộp lại không nhân tiến độ', () => {
    const s = finishThrough(1), p = s.chapters[1];
    expect(councilReducer(s, { type: 'restore', chapter: 1 })).toBe(s);
    expect(councilReducer(s, { type: 'collect', chapter: 1, id: p.discovered[0] })).toBe(s);
    const viewed = councilReducer(s, { type: 'talk', chapter: 1, id: 'c1-e1-found' }); expect(viewed.chapters[1].discovered).toEqual(p.discovered); expect(progressCount(viewed)).toBe(4);
  });
  it('hội thoại có điều kiện, gợi ý tối đa hai và vẫn sửa được sau khi sai', () => {
    let s = newCouncilGame(); s = councilReducer(s, { type: 'role', role: 'an' }); s = councilReducer(s, { type: 'collect', chapter: 1, id: 'c1-e1' });
    expect(councilReducer(s, { type: 'choose', chapter: 1, choice: 'compare' })).toBe(s);
    s = councilReducer(s, { type: 'choose', chapter: 1, choice: 'clarify' }); expect(s.chapters[1].dialogue).toBe('c1-e1-detail');
    for (let i = 0; i < 4; i++) s = councilReducer(s, { type: 'hint', chapter: 1, id: 'c1-i1' }); expect(s.chapters[1].hints['c1-i1']).toBe(2);
    expect(s.chapters[1].discovered).toHaveLength(1);
  });
  it('hai đoạn kết phụ thuộc thư, không phụ thuộc dùng gợi ý', () => {
    const standard = fullCouncilSave(false), complete = fullCouncilSave(true);
    expect(standard.finalCompleted).toBe(true); expect(loreCount(standard)).toBe(0); expect(loreCount(complete)).toBe(4);
  });
  it('đối chiếu mở hồ sơ bên kia và ghi nhận liên kết, không phát thưởng lần nữa', () => {
    let s = newCouncilGame();
    for (const e of chapters[0].evidence.slice(0, 2)) { s = councilReducer(s, { type: 'role', role: e.role }); s = councilReducer(s, { type: 'collect', chapter: 1, id: e.id }); }
    s = councilReducer(s, { type: 'talk', chapter: 1, id: 'c1-e1-found' }); s = councilReducer(s, { type: 'choose', chapter: 1, choice: 'compare' });
    expect(s.chapters[1].inspected).toBe('c1-e2'); expect(s.chapters[1].flags).toContain('c1-e1-compared'); expect(s.chapters[1].discovered).toHaveLength(2);
  });
  it('báo cáo cuối cần phân công đúng người trước khi Khôi xác nhận', () => {
    let s = finishThrough(4); const c = chapters[0];
    s = councilReducer(s, { type: 'draft', chapter: 1, draft: winningDraft(c.finalCase), final: true });
    expect(councilReducer(s, { type: 'resolveFinal', chapter: 1 })).toBe(s);
    expect(councilReducer(s, { type: 'reviewFinal', chapter: 1 })).toBe(s);
    s = councilReducer(s, { type: 'role', role: finalReviewers[1] }); s = councilReducer(s, { type: 'reviewFinal', chapter: 1 });
    expect(s.chapters[1].finalReviewed).toBe(true); expect(councilReducer(s, { type: 'resolveFinal', chapter: 1 })).toBe(s);
    s = councilReducer(s, { type: 'role', role: 'khoi' }); s = councilReducer(s, { type: 'resolveFinal', chapter: 1 }); expect(s.chapters[1].finalResolved).toBe(true);
  });
});
describe('Bản lưu V2', () => {
  it('giữ lựa chọn chưa nộp, hội thoại và cửa sổ hội đồng qua tải lại', () => {
    let s = prepareChapter(newCouncilGame(), 1); s = councilReducer(s, { type: 'councilOpen', chapter: 1, open: true });
    s = councilReducer(s, { type: 'draft', chapter: 1, draft: { conclusion: chapters[0].council.conclusions[0].id, evidence: ['c1-e1'], repair: '' } });
    expect(parseCouncilSave(JSON.stringify(s))).toEqual(s);
  });
  it.each(['null', '{}', '{bad', JSON.stringify({ version: 1 })])('từ chối bản lưu hỏng %s', raw => expect(() => parseCouncilSave(raw)).toThrow());
  it('từ chối ID lạ, vượt chương, giả hoàn thành hoặc lựa chọn không hợp lệ', () => {
    for (const mutate of [
      (s: ReturnType<typeof newCouncilGame>) => { s.chapters[1].discovered = ['fake']; },
      (s: ReturnType<typeof newCouncilGame>) => { s.chapters[1].restored = true; },
      (s: ReturnType<typeof newCouncilGame>) => { s.chapters[4].discovered = ['c4-e1']; },
      (s: ReturnType<typeof newCouncilGame>) => { s.chapters[1].completed = ['c1-i1']; },
      (s: ReturnType<typeof newCouncilGame>) => { s.finalCompleted = true; },
      (s: ReturnType<typeof newCouncilGame>) => { s.chapters[1].council.evidence = ['c2-e1']; },
    ]) { const s = newCouncilGame(); mutate(s); expect(() => parseCouncilSave(JSON.stringify(s))).toThrow(); }
  });
  it('đọc V2 không đổi hoặc xóa V1, lỗi lưu vẫn trả về hành trình chơi được', () => {
    localStorage.clear(); localStorage.setItem(LEGACY_SAVE_KEY, 'legacy'); expect(loadCouncilGame(localStorage).notice).toContain('giữ'); expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBe('legacy');
    localStorage.setItem(SAVE_KEY_V2, '{bad'); expect(loadCouncilGame(localStorage).notice).toContain('chưa bị xóa'); expect(localStorage.getItem(SAVE_KEY_V2)).toBe('{bad');
    const denied = { getItem: () => { throw Error('Denied'); } } as unknown as Storage; expect(loadCouncilGame(denied).save.version).toBe(2);
  });
});
