import { beforeEach, describe, expect, it } from 'vitest';
import { allSteps, room, rooms } from '../restoration/curriculum';
import type { LearningStep } from '../restoration/model';
import { canRead, coreOpen, countGoals, countLetters, emptyAnswer, findings, fresh, judge, migrate, nextStep, openRoom, parse, proofAvailable, ready, reducer, REVISION, SAVE_KEY } from '../restoration/engine';
import type { Answer, Save } from '../restoration/engine';
import { chapter, chapters, knowledge } from '../council/content';
import { LEGACY_SAVE_KEY, newCouncilGame, SAVE_KEY_V2 } from '../council/engine';
import { finishThrough, fullCouncilSave, prepareChapter } from './council-fixtures';

beforeEach(() => { localStorage.clear(); });

function collect(s: Save, roomId: LearningStep['roomId'], id: string): Save {
  if (s.rooms[roomId].evidence.includes(id)) return s;
  const e = chapter(roomId).evidence.find(e => e.id === id)!;
  for (const requirement of e.requires) {
    if (chapter(roomId).evidence.some(e => e.id === requirement)) s = collect(s, roomId, requirement);
  }
  expect(canRead(s, roomId, id), `Không mở được ${id}`).toBe(true);
  return reducer(s, { type: 'collect', id: roomId, evidence: id });
}

function prepare(s: Save, t: LearningStep): Save {
  for (const id of t.requiresEvidence) s = collect(s, t.roomId, id);
  return s;
}

function answerFor(t: LearningStep, s: Save): Answer {
  const a = emptyAnswer(), i = t.interaction;
  if (i.kind === 'matching' || i.kind === 'timeline') a.placements = Object.fromEntries(i.items.map(item => [item.id, item.target]));
  else if (i.kind === 'decision') a.choice = i.correct;
  else {
    const proof = i.proofOptions.find(p => p.reasonIds.length > 0 && proofAvailable(s, t, p.id));
    expect(proof, `${t.id}: không có căn cứ hợp lệ đã mở`).toBeDefined();
    a.decision = i.correctDecision; a.proof = proof!.id; a.reason = proof!.reasonIds[0]; a.page = 2;
  }
  return a;
}

function solve(s: Save, t: LearningStep): Save {
  s = prepare(s, t);
  const a = answerFor(t, s);
  expect(judge(t, a, s).ok, t.id).toBe(true);
  s = reducer(s, { type: 'answer', id: t.id, answer: a });
  return reducer(s, { type: 'submit', id: t.id });
}

function through(last: number): Save {
  let s = fresh();
  for (const r of rooms.filter(r => r.id <= last)) for (const t of r.steps) s = solve(s, t);
  return s;
}

function complete(): Save {
  let s = through(4);
  for (const r of rooms) s = solve(s, r.finalCase);
  return reducer(s, { type: 'finish' });
}

describe('Nội dung điều tra V3', () => {
  it('giữ đủ 16 mục tiêu có nguồn, thêm bốn tình huống vận dụng trong Phòng Lõi', () => {
    expect(rooms).toHaveLength(4); expect(allSteps).toHaveLength(20);
    const goals = rooms.flatMap(r => r.steps.map(t => t.objectiveId));
    expect(new Set(goals).size).toBe(16);
    expect(goals).toEqual(rooms.flatMap(r => [1, 2, 3, 4].map(n => `r${r.id}-p${n}`)));
    for (const t of allSteps) {
      expect(knowledge(t.sourceId).source.printedPages.length).toBeGreaterThan(0);
      expect(t.concept.length).toBeGreaterThan(30);
      expect(t.scenario.length).toBeGreaterThan(20);
      expect(t.finding.text.length).toBeGreaterThan(15);
      expect(t.hints).toHaveLength(2);
      expect(t.success.length).toBeGreaterThan(15);
    }
  });

  it('mọi phát hiện chính có nơi sử dụng; quan hệ bối cảnh và căn cứ được khai báo riêng', () => {
    const known = new Set(allSteps.map(t => t.finding.id));
    const uses = allSteps.flatMap(t => t.usesFindings);
    for (const use of uses) {
      expect(known.has(use.id), use.id).toBe(true);
      expect(['context', 'supports']).toContain(use.relation);
    }
    for (const t of rooms.flatMap(r => r.steps)) expect(uses.some(use => use.id === t.finding.id), t.id).toBe(true);
    expect(uses.some(use => use.relation === 'context')).toBe(true);
    expect(uses.some(use => use.relation === 'supports')).toBe(true);
  });

  it('có lựa chọn tình huống, ghép và dòng thời gian; không dùng một kiểu cho cả hành trình', () => {
    const kinds = allSteps.map(t => t.interaction.kind);
    for (const kind of ['decision', 'matching', 'timeline', 'council']) expect(kinds).toContain(kind);
    for (const t of allSteps) {
      const i = t.interaction;
      if (i.kind === 'decision') {
        expect(i.options.some(o => o.id === i.correct)).toBe(true);
        for (const o of i.options) expect(o.feedback.length).toBeGreaterThan(15);
      } else if (i.kind === 'matching' || i.kind === 'timeline') {
        for (const item of i.items) { expect(i.targets.some(target => target.id === item.target)).toBe(true); expect(item.feedback.length).toBeGreaterThan(15); }
      } else {
        expect(i.decisions.some(o => o.id === i.correctDecision)).toBe(true);
        expect(i.proofOptions.filter(p => p.reasonIds.length).length).toBeGreaterThanOrEqual(2);
        expect(i.proofOptions.some(p => !p.reasonIds.length)).toBe(true);
        for (const proof of i.proofOptions) {
          for (const id of proof.reasonIds) expect(i.reasons.some(reason => reason.id === id)).toBe(true);
          for (const id of proof.evidenceIds) expect(chapters.flatMap(c => c.evidence).some(e => e.id === id)).toBe(true);
          for (const id of proof.findingIds) expect(allSteps.some(t => t.finding.id === id)).toBe(true);
        }
      }
    }
  });
});

describe('Từ tài liệu cần dùng đến quyết định và phát hiện', () => {
  it('bắt đầu được bước đầu bằng tài liệu của bước đó, không đợi đủ bốn hồ sơ', () => {
    let s = fresh(); const first = room(1).steps[0];
    expect(ready(s, first)).toBe(false);
    s = prepare(s, first);
    expect(s.rooms[1].evidence.length).toBeLessThan(4);
    expect(ready(s, first)).toBe(true);
    s = solve(s, first);
    expect(nextStep(s, 1)?.id).toBe(room(1).steps[1].id);
    expect(findings(s).map(f => f.id)).toContain(first.finding.id);
  });

  it('tìm đủ tài liệu không cho vượt bước hoặc vào phòng chưa mở', () => {
    let s = fresh(); const later = room(1).steps[2];
    for (const e of chapter(1).evidence.slice(0, 6)) s = collect(s, 1, e.id);
    const before = structuredClone(s);
    expect(ready(s, later)).toBe(false);
    s = reducer(s, { type: 'answer', id: later.id, answer: answerFor(later, s) });
    s = reducer(s, { type: 'submit', id: later.id });
    s = reducer(s, { type: 'enter', id: 4 });
    expect(s).toEqual(before); expect(openRoom(s, 2)).toBe(false);
  });

  it('gợi ý ba cấp không tự chọn đáp án, cộng tiến độ hoặc xóa các lựa chọn đang làm', () => {
    let s = prepare(fresh(), room(1).steps[0]); const t = room(1).steps[0];
    const a = answerFor(t, s);
    s = reducer(s, { type: 'answer', id: t.id, answer: a });
    for (let n = 0; n < 5; n++) s = reducer(s, { type: 'help', id: t.id });
    expect(s.rooms[1].help[t.id]).toBe(3);
    expect(s.rooms[1].answers[t.id]).toEqual(a);
    expect(countGoals(s)).toBe(0);
    expect(findings(s)).toHaveLength(0);
  });

  it('nộp sai không mất tiến độ và có thể sửa từng lựa chọn rồi nộp lại', () => {
    let s = prepare(fresh(), room(1).steps[0]); const t = room(1).steps[0];
    const before = structuredClone(s);
    expect(judge(t, emptyAnswer(), s).ok).toBe(false);
    s = reducer(s, { type: 'submit', id: t.id }); expect(s).toEqual(before);
    s = solve(s, t); expect(countGoals(s)).toBe(1);
    expect(s.rooms[1].evidence).toEqual(before.rooms[1].evidence);
  });

  it('xem lại, nộp lại và ghi nhận lại không cộng phát hiện hoặc chứng cứ lần hai', () => {
    let s = solve(fresh(), room(1).steps[0]); const t = room(1).steps[0];
    const before = structuredClone(s);
    s = reducer(s, { type: 'submit', id: t.id });
    s = reducer(s, { type: 'answer', id: t.id, answer: emptyAnswer() });
    for (const id of s.rooms[1].evidence) s = reducer(s, { type: 'collect', id: 1, evidence: id });
    expect(s).toEqual(before); expect(countGoals(s)).toBe(1);
  });

  it.each(rooms)('phòng $id: các căn cứ hợp lệ được chấp nhận, căn cứ lạc đề và lý do sai bị từ chối', r => {
    let s = through(r.id - 1);
    for (const t of r.steps.slice(0, 3)) s = solve(s, t);
    const t = r.steps[3]; s = prepare(s, t);
    for (const e of chapter(r.id).evidence.slice(0, 6)) s = collect(s, r.id, e.id);
    const i = t.interaction; expect(i.kind).toBe('council'); if (i.kind !== 'council') return;
    for (const proof of i.proofOptions) {
      for (const reason of i.reasons) {
        const a = { ...emptyAnswer(), decision: i.correctDecision, proof: proof.id, reason: reason.id, page: 2 };
        expect(judge(t, a, s).ok, `${t.id}/${proof.id}/${reason.id}`).toBe(proof.reasonIds.includes(reason.id));
      }
    }
    const a = answerFor(t, s);
    expect(judge(t, { ...a, decision: i.decisions.find(o => o.id !== i.correctDecision)!.id }, s).ok).toBe(false);
    expect(judge(t, { ...a, proof: '' }, s).page).toBe(1);
    expect(judge(t, { ...a, reason: '' }, s).page).toBe(2);
  });

  it('căn cứ chưa thu thập hoặc phát hiện chưa có không được dùng', () => {
    const t = room(1).steps[3], i = t.interaction;
    if (i.kind !== 'council') throw Error('Hội đồng sai dạng');
    for (const proof of i.proofOptions) if (proof.evidenceIds.length || proof.findingIds.length) expect(proofAvailable(fresh(), t, proof.id)).toBe(false);
  });

  it('bốn đoạn Phòng Lõi đều dùng tình huống mới và kiểm tra đúng từng cặp căn cứ/lý do', () => {
    let s = through(4); expect(coreOpen(s)).toBe(true);
    for (const r of rooms) {
      const t = r.finalCase; s = prepare(s, t);
      for (const e of chapter(r.id).evidence.slice(0, 6)) s = collect(s, r.id, e.id);
      expect(t.scenario).not.toBe(r.steps[3].scenario);
      const i = t.interaction; if (i.kind !== 'council') throw Error('Phòng Lõi sai dạng');
      for (const proof of i.proofOptions) for (const reason of i.reasons) {
        expect(judge(t, { ...emptyAnswer(), decision: i.correctDecision, proof: proof.id, reason: reason.id }, s).ok).toBe(proof.reasonIds.includes(reason.id));
      }
      s = solve(s, t); expect(s.rooms[r.id].finalDone).toBe(true);
    }
    expect(reducer(s, { type: 'finish' }).finalComplete).toBe(true);
  });
});

describe('Bản lưu và chuyển tiếp', () => {
  it('tải lại giữ đáp án chưa nộp, trang hội đồng, gợi ý, ghi chú và vai', () => {
    let s = through(1);
    for (const t of room(2).steps.slice(0, 3)) s = solve(s, t);
    const t = room(2).steps[3]; s = prepare(s, t);
    const draft = { ...answerFor(t, s), reason: '', page: 1 };
    s = reducer(s, { type: 'answer', id: t.id, answer: draft });
    s = reducer(s, { type: 'help', id: t.id });
    s = reducer(s, { type: 'notes', id: 2, text: 'Cần đối chiếu hai phương diện' });
    s = reducer(s, { type: 'role', role: 'vy' });
    expect(parse(JSON.stringify(s))).toEqual(s);
    expect(parse(JSON.stringify(s)).rooms[2].answers[t.id].page).toBe(1);
    expect(nextStep(s, 2)?.id).toBe(t.id);
    s = solve(s, t);
    expect(parse(JSON.stringify(s))).toEqual(s);
  });

  it.each(['currentRoom', 'revision'])('từ chối trường số %s bị lưu thành chuỗi', key => {
    const s = fresh() as unknown as Record<string, unknown>; s[key] = String(s[key]);
    expect(() => parse(JSON.stringify(s))).toThrow();
  });

  it('từ chối gợi ý sai kiểu, ID lạ, đáp án lạ và kết thúc chưa đủ điều kiện', () => {
    const cases: Save[] = [];
    const wrongHint = fresh(); wrongHint.rooms[1].help[room(1).steps[0].id] = '2' as unknown as number; cases.push(wrongHint);
    const unknown = fresh(); unknown.rooms[1].completed = ['unknown']; cases.push(unknown);
    const wrongAnswer = fresh(); wrongAnswer.rooms[1].answers[room(1).steps[0].id] = { ...emptyAnswer(), choice: 'alien-choice' }; cases.push(wrongAnswer);
    const earlyFinish = fresh(); earlyFinish.finalComplete = true; cases.push(earlyFinish);
    const lockedHelp = fresh(); lockedHelp.rooms[4].help[room(4).steps[0].id] = 1; cases.push(lockedHelp);
    for (const s of cases) expect(() => parse(JSON.stringify(s))).toThrow();
    expect(() => parse('{broken')).toThrow();
    expect(() => parse(JSON.stringify({ ...fresh(), revision: REVISION + 1 }))).toThrow();
  });

  it('tiếp tục V2 giữ phòng đã qua, mục tiêu, hồ sơ và ghi chú; bỏ dự thảo không tương thích', () => {
    let old = finishThrough(1); old = prepareChapter(old, 2);
    old.chapters[2].hypothesis = 'Ghi chú từ bản cũ';
    old.chapters[2].council = { conclusion: chapters[1].council.correctConclusion, evidence: ['c2-e1'], repair: '' };
    const raw = JSON.stringify(old), s = migrate(raw);
    expect(s.version).toBe(3); expect(s.rooms[1].completed).toHaveLength(4);
    expect(s.rooms[2].completed).toHaveLength(3);
    expect(s.rooms[2].notes).toBe('Ghi chú từ bản cũ');
    expect(s.rooms[2].evidence).toEqual(old.chapters[2].discovered);
    expect(s.rooms[2].answers).toEqual({});
    expect(nextStep(s, 2)?.id).toBe(room(2).steps[3].id);
    expect(findings(s).every(f => f.imported)).toBe(true);
    expect(parse(JSON.stringify(s))).toEqual(s);
    expect(JSON.stringify(old)).toBe(raw);
  });

  it('chuyển bản đã hoàn thành giữ kết quả, thư và các nhãn kế thừa', () => {
    const s = migrate(JSON.stringify(fullCouncilSave()));
    expect(countGoals(s)).toBe(16); expect(countLetters(s)).toBe(4);
    expect(s.finalComplete).toBe(true);
    expect(rooms.every(r => s.rooms[r.id].finalImported)).toBe(true);
    expect(parse(JSON.stringify(s))).toEqual(s);
  });

  it('bản cũ làm các bài không theo thứ tự vẫn tiếp từ bước đầu còn thiếu', () => {
    const old = prepareChapter(newCouncilGame(), 1, false);
    old.chapters[1].completed = ['c1-i3'];
    const s = migrate(JSON.stringify(old));
    expect(s.rooms[1].completed).toEqual(['r1-p3']);
    expect(nextStep(s, 1)?.id).toBe('r1-p1');
    expect(findings(s)).toEqual([expect.objectContaining({ stepId: 'r1-p3', imported: true })]);
    expect(parse(JSON.stringify(s))).toEqual(s);
  });

  it('bắt đầu bản mới không sửa bản cũ và chuyển bản lỗi không ghi dữ liệu nào', () => {
    const old = JSON.stringify(newCouncilGame());
    localStorage.setItem(SAVE_KEY_V2, old); localStorage.setItem(LEGACY_SAVE_KEY, 'old-v1');
    const s = fresh(); expect(countGoals(s)).toBe(0); expect(s.version).toBe(3);
    migrate(old); expect(() => migrate('{bad')).toThrow();
    expect(localStorage.getItem(SAVE_KEY_V2)).toBe(old);
    expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBe('old-v1');
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
  });

  it('hai biến thể kết thúc cùng hoàn thành 16 mục tiêu, khác nhau theo thư tùy chọn', () => {
    let s = complete(); expect(countGoals(s)).toBe(16); expect(countLetters(s)).toBe(0);
    expect(s.finalComplete).toBe(true); expect(parse(JSON.stringify(s))).toEqual(s);
    for (const r of rooms) s = collect(s, r.id, `c${r.id}-e7`);
    expect(countLetters(s)).toBe(4); expect(s.finalComplete).toBe(true);
    expect(countGoals(s)).toBe(16); expect(parse(JSON.stringify(s))).toEqual(s);
    const before = structuredClone(s); s = reducer(s, { type: 'finish' });
    expect(s.rooms).toEqual(before.rooms);
  });
});
