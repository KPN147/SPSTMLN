import { describe, expect, it } from 'vitest';
import { allEvidence } from '../council/content';
import { puzzles } from '../data/puzzles';
import { allSteps, learningSteps, rooms } from '../restoration/curriculum';

const wordCount = (text: string) => text.trim().split(/\s+/).length;

describe('Chương trình điều tra V3', () => {
  it('giữ đúng 16 mục tiêu, cùng nguồn và trạng thái duyệt thực tế', () => {
    expect(learningSteps.map(s => s.objectiveId).sort()).toEqual(puzzles.map(p => p.id).sort());
    expect(rooms).toHaveLength(4);
    for (const s of allSteps) {
      const source = puzzles.find(p => p.id === s.sourceId)!;
      expect(source).toBeDefined();
      expect(source.source.printedPages.length).toBeGreaterThan(0);
      expect(source.source.sourceReviewStatus).toBe('needs-review');
      expect(wordCount(s.concept)).toBeGreaterThanOrEqual(25);
      expect(wordCount(s.concept)).toBeLessThanOrEqual(40);
    }
  });

  it('mọi phát hiện chính có nơi dùng tiếp; đồ thị không yêu cầu một kết quả chưa tồn tại', () => {
    const used = new Set(allSteps.flatMap(s => s.usesFindings.map(f => f.id)));
    const available = new Set<string>();
    for (const r of rooms) {
      for (const s of [...r.steps, r.finalCase]) {
        for (const ref of s.usesFindings) expect(available.has(ref.id), `${s.id} requires ${ref.id}`).toBe(true);
        for (const id of s.requiresEvidence) expect(allEvidence.some(e => e.id === id && e.chapterId === r.id)).toBe(true);
        available.add(s.finding.id);
      }
      for (const s of r.steps) expect(used.has(s.finding.id), `${s.id} orphan finding`).toBe(true);
      expect(r.finalCase.usesFindings.some(f => f.relation === 'supports')).toBe(true);
    }
  });

  it('mỗi hội đồng có căn cứ hợp lệ khác nhau và kiểm tra quan hệ với lý do', () => {
    for (const s of allSteps) {
      const task = s.interaction;
      if (task.kind !== 'council') continue;
      expect(task.decisions.some(o => o.id === task.correctDecision)).toBe(true);
      expect(task.proofOptions.filter(p => p.reasonIds.length).length).toBeGreaterThanOrEqual(2);
      expect(task.proofOptions.some(p => !p.reasonIds.length)).toBe(true);
      for (const proof of task.proofOptions) {
        for (const id of proof.reasonIds) expect(task.reasons.some(r => r.id === id)).toBe(true);
        for (const id of proof.evidenceIds) expect(allEvidence.some(e => e.id === id && e.chapterId === s.roomId)).toBe(true);
        for (const id of proof.findingIds) expect(learningSteps.some(q => q.finding.id === id)).toBe(true);
        if (proof.reasonIds.length) expect(proof.evidenceIds.length + proof.findingIds.length).toBeGreaterThan(0);
      }
    }
  });

  it('các phần hiển thị riêng nằm trong giới hạn chữ và phản hồi 35 từ', () => {
    for (const s of allSteps) {
      const t = s.interaction;
      const common = wordCount(`${s.concept} ${s.scenario} ${s.question}`);
      const groups = t.kind === 'council' ? [t.decisions.map(o => o.text), t.proofOptions.map(o => o.text), t.reasons.map(o => o.text)]
        : t.kind === 'decision' ? [t.options.map(o => o.text)] : [[...t.items, ...t.targets].map(o => o.label)];
      for (const group of groups) expect(common + group.reduce((n, text) => n + wordCount(text), 0), s.id).toBeLessThanOrEqual(150);
      const feedback = t.kind === 'council' ? [...t.decisions, ...t.reasons].map(o => o.feedback)
        : t.kind === 'decision' ? t.options.map(o => o.feedback) : t.items.map(o => o.feedback);
      for (const text of feedback) { expect(wordCount(text), s.id).toBeLessThanOrEqual(35); expect(text.length).toBeGreaterThan(20); }
    }
  });

  it('có nhiều dạng vận dụng và đáp án không luôn đứng cùng một vị trí', () => {
    expect(new Set(learningSteps.map(s => s.interaction.kind))).toEqual(new Set(['matching', 'timeline', 'decision', 'council']));
    const decisionPositions = new Set<number>(), reasonPositions = new Set<number>();
    for (const s of allSteps) {
      const t = s.interaction;
      if (t.kind !== 'council') continue;
      decisionPositions.add(t.decisions.findIndex(o => o.id === t.correctDecision));
      reasonPositions.add(t.reasons.findIndex(o => t.proofOptions.some(p => p.reasonIds.includes(o.id))));
    }
    expect(decisionPositions.size).toBe(3); expect(reasonPositions.size).toBe(3);
    for (const r of rooms) {
      expect(r.finalCase.scenario).not.toBe(r.steps[3].scenario);
      expect(r.finalCase.question).not.toBe(r.steps[3].question);
    }
  });
});
