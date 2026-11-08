import { allEvidence, allInvestigations, chapter, chapters, characters, dialogue, dialogues, finalReviewers } from './content';
import type { RoomId } from '../game/types';
import { brand } from './brand';
import type { ChapterProgress, CouncilCase, CouncilDraft, GameSaveV2, RoleId, Verdict } from './types';

export const SAVE_KEY_V2 = 'mln131-council-save-v2';
export const LEGACY_SAVE_KEY = 'mln131-escape-save-v1';
export const blankDraft = (): CouncilDraft => ({ conclusion: '', evidence: [], repair: '' });
export const blankChapter = (): ChapterProgress => ({ discovered: [], completed: [], answers: {}, hints: {}, flags: [], dialogue: null, dialogueHistory: [], council: blankDraft(), restored: false, finalDraft: blankDraft(), finalReviewed: false, finalResolved: false, hypothesis: '', inspected: null, councilOpen: false });
export const newCouncilGame = (): GameSaveV2 => ({ version: 2, activeRole: 'khoi', currentChapter: 1, introSeen: false, chapters: { 1: blankChapter(), 2: blankChapter(), 3: blankChapter(), 4: blankChapter() }, finalCompleted: false, updatedAt: new Date().toISOString() });
export const unlocked = (s: GameSaveV2, id: RoomId) => chapters.filter(c => c.id < id).every(c => s.chapters[c.id].restored);
export const coreUnlocked = (s: GameSaveV2) => chapters.every(c => s.chapters[c.id].restored);
export const requirementsMet = (p: ChapterProgress, ids: string[]) => ids.every(id => p.discovered.includes(id) || p.completed.includes(id));
export const progressCount = (s: GameSaveV2) => chapters.reduce((n, c) => n + s.chapters[c.id].completed.length + Number(s.chapters[c.id].restored), 0);
export const loreCount = (s: GameSaveV2) => chapters.filter(c => s.chapters[c.id].discovered.includes(`c${c.id}-e7`)).length;
export function validInvestigation(id: string, answer: Record<string, string>): boolean {
  const task = allInvestigations.find(t => t.id === id);
  return !!task && Object.keys(answer).length === task.items.length && task.items.every(i => answer[i.id] === i.target);
}
export function judgeCase(c: CouncilCase, draft: CouncilDraft, available: string[]): Verdict {
  if (!draft.conclusion || !draft.repair) return { ok: false, speaker: 'khoi', message: 'Hãy chọn một kết luận và một phương án phục dựng trước khi đề xuất.', kind: 'missing' };
  if (draft.conclusion !== c.correctConclusion) return { ok: false, speaker: 'an', message: c.rebuttals.conclusion, kind: 'conclusion' };
  const ids = draft.evidence;
  const exact = c.evidenceSets.some(set => set.length === ids.length && new Set(ids).size === ids.length && set.every(id => ids.includes(id) && available.includes(id)));
  if (!exact) return { ok: false, speaker: 'vy', message: c.rebuttals.evidence, kind: 'evidence' };
  if (draft.repair !== c.correctRepair) return { ok: false, speaker: 'minh', message: c.rebuttals.repair, kind: 'repair' };
  return { ok: true, speaker: 'khoi', message: c.success, kind: 'success' };
}
export function judgeChapter(s: GameSaveV2, id: RoomId): Verdict {
  const c = chapter(id), p = s.chapters[id];
  const missing = c.evidence.filter(e => e.kind === 'essential' && !p.discovered.includes(e.id));
  if (missing.length) return { ok: false, speaker: 'vy', message: `Hồ sơ còn thiếu: ${missing.map(e => e.title).join(', ')}. Bạn có thể tiếp tục khám phá, không mất các lựa chọn đã làm.`, kind: 'missing' };
  const tasks = c.investigations.filter(t => !p.completed.includes(t.id));
  if (tasks.length) return { ok: false, speaker: 'minh', message: `Chưa kiểm chứng: ${tasks.map(t => t.title).join(', ')}. Hãy chạy thử các phần này trước khi xác nhận.`, kind: 'missing' };
  return judgeCase(c.council, p.council, p.discovered);
}

export type CouncilAction =
  | { type: 'role'; role: RoleId }
  | { type: 'intro' }
  | { type: 'reset' }
  | { type: 'finish' }
  | { type: 'enter'; chapter: RoomId }
  | { type: 'inspect'; chapter: RoomId; id: string | null }
  | { type: 'collect'; chapter: RoomId; id: string }
  | { type: 'answer'; chapter: RoomId; id: string; item: string; target: string }
  | { type: 'solve'; chapter: RoomId; id: string }
  | { type: 'hint'; chapter: RoomId; id: string }
  | { type: 'hypothesis'; chapter: RoomId; text: string }
  | { type: 'talk'; chapter: RoomId; id: string | null }
  | { type: 'choose'; chapter: RoomId; choice: string }
  | { type: 'councilOpen'; chapter: RoomId; open: boolean }
  | { type: 'draft'; chapter: RoomId; draft: CouncilDraft; final?: boolean }
  | { type: 'restore'; chapter: RoomId }
  | { type: 'reviewFinal'; chapter: RoomId }
  | { type: 'resolveFinal'; chapter: RoomId };

export function councilReducer(s: GameSaveV2, a: CouncilAction): GameSaveV2 {
  if (a.type === 'reset') return newCouncilGame();
  if (a.type === 'role') return characters.some(c => c.id === a.role) ? { ...s, activeRole: a.role, updatedAt: new Date().toISOString() } : s;
  if (a.type === 'intro') return { ...s, introSeen: true, updatedAt: new Date().toISOString() };
  if (a.type === 'finish') return coreUnlocked(s) && chapters.every(c => s.chapters[c.id].finalResolved) ? { ...s, finalCompleted: true, updatedAt: new Date().toISOString() } : s;
  if (!unlocked(s, a.chapter)) return s;
  const c = chapter(a.chapter), p = s.chapters[a.chapter];
  let n = p;
  let activeRole = s.activeRole;
  if (a.type === 'enter') return { ...s, currentChapter: a.chapter, updatedAt: new Date().toISOString() };
  if (a.type === 'inspect') {
    const e = c.evidence.find(e => e.id === a.id);
    if (a.id !== null && (!e || !requirementsMet(p, e.requires))) return s;
    n = { ...p, inspected: a.id };
  }
  if (a.type === 'collect') {
    const e = c.evidence.find(e => e.id === a.id);
    if (!e || p.discovered.includes(e.id) || e.role !== s.activeRole || !requirementsMet(p, e.requires)) return s;
    n = { ...p, discovered: [...p.discovered, e.id], dialogue: e.kind === 'story' ? null : `${e.id}-found`, dialogueHistory: [...new Set([...p.dialogueHistory, ...(e.kind === 'story' ? [] : [`${e.id}-found`])])] };
  }
  if (a.type === 'answer') {
    const t = c.investigations.find(t => t.id === a.id);
    if (!t || !requirementsMet(p, t.requires) || p.completed.includes(t.id) || s.activeRole !== t.role || !t.items.some(i => i.id === a.item) || !t.targets.some(t => t.id === a.target)) return s;
    n = { ...p, answers: { ...p.answers, [t.id]: { ...p.answers[t.id], [a.item]: a.target } } };
  }
  if (a.type === 'solve') {
    const t = c.investigations.find(t => t.id === a.id);
    if (!t || t.role !== s.activeRole || !requirementsMet(p, t.requires) || p.completed.includes(t.id) || !validInvestigation(t.id, p.answers[t.id] ?? {})) return s;
    n = { ...p, completed: [...p.completed, t.id] };
  }
  if (a.type === 'hint') {
    if (!c.investigations.some(t => t.id === a.id)) return s;
    n = { ...p, hints: { ...p.hints, [a.id]: Math.min(2, (p.hints[a.id] ?? 0) + 1) } };
  }
  if (a.type === 'hypothesis') n = { ...p, hypothesis: a.text.slice(0, 1000) };
  if (a.type === 'talk') {
    const node = a.id ? dialogue(a.id) : undefined;
    if (a.id && (!node || node.chapterId !== a.chapter)) return s;
    if (a.id && a.id.includes('-e') && !p.discovered.includes(a.id.replace(/-(found|detail)$/, ''))) return s;
    n = { ...p, dialogue: a.id, dialogueHistory: [...new Set([...p.dialogueHistory, ...(a.id ? [a.id] : [])])] };
  }
  if (a.type === 'choose') {
    const choice = p.dialogue && dialogue(p.dialogue)?.choices.find(choice => choice.id === a.choice);
    if (!choice || !requirementsMet(p, choice.requires ?? [])) return s;
    const flags = p.dialogue === `c${a.chapter}-intro` ? p.flags.filter(f => f !== `c${a.chapter}-documents` && f !== `c${a.chapter}-system`) : p.flags;
    const inspected = a.choice === 'compare' ? (choice.requires?.find(id => p.discovered.includes(id)) ?? p.inspected) : p.inspected;
    n = { ...p, inspected, dialogue: choice.next, flags: [...new Set([...flags, ...(choice.flag ? [choice.flag] : [])])], dialogueHistory: [...new Set([...p.dialogueHistory, choice.next])] };
  }
  if (a.type === 'councilOpen') { n = { ...p, councilOpen: a.open }; if (a.open) activeRole = 'khoi'; }
  if (a.type === 'draft') {
    if (a.final ? p.finalResolved || !coreUnlocked(s) : p.restored) return s;
    const definition = a.final ? c.finalCase : c.council;
    if (!validDraft(a.draft, definition, p.discovered)) return s;
    n = { ...p, [a.final ? 'finalDraft' : 'council']: a.draft };
  }
  if (a.type === 'restore') {
    if (p.restored || s.activeRole !== 'khoi' || !judgeChapter(s, a.chapter).ok) return s;
    n = { ...p, restored: true, councilOpen: false, dialogue: null };
  }
  if (a.type === 'reviewFinal') {
    if (!coreUnlocked(s) || s.activeRole !== finalReviewers[a.chapter] || p.finalReviewed) return s;
    n = { ...p, finalReviewed: true };
  }
  if (a.type === 'resolveFinal') {
    if (!coreUnlocked(s) || !p.finalReviewed || p.finalResolved || s.activeRole !== 'khoi' || !judgeCase(c.finalCase, p.finalDraft, p.discovered).ok) return s;
    n = { ...p, finalResolved: true };
  }
  return n === p ? s : { ...s, activeRole, chapters: { ...s.chapters, [a.chapter]: n }, updatedAt: new Date().toISOString() };
}

const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const stringList = (v: unknown): v is string[] => Array.isArray(v) && v.every(x => typeof x === 'string') && new Set(v).size === v.length;
function validDraft(value: unknown, c: CouncilCase, available: string[]): value is CouncilDraft {
  if (!record(value) || typeof value.conclusion !== 'string' || typeof value.repair !== 'string' || !stringList(value.evidence)) return false;
  return (!value.conclusion || c.conclusions.some(o => o.id === value.conclusion)) && (!value.repair || c.repairs.some(o => o.id === value.repair)) && value.evidence.every(id => available.includes(id));
}
export function parseCouncilSave(raw: string | null): GameSaveV2 {
  if (!raw) return newCouncilGame();
  const v: unknown = JSON.parse(raw);
  if (!record(v) || v.version !== 2 || !characters.some(c => c.id === v.activeRole) || !chapters.some(c => c.id === v.currentChapter) || typeof v.introSeen !== 'boolean' || typeof v.finalCompleted !== 'boolean' || typeof v.updatedAt !== 'string' || !Number.isFinite(Date.parse(v.updatedAt)) || !record(v.chapters)) throw Error('Bản lưu không hợp lệ');
  const s = v as unknown as GameSaveV2;
  for (const c of chapters) {
    const p = s.chapters[c.id];
    if (!record(p) || !stringList(p.discovered) || !stringList(p.completed) || !stringList(p.flags) || !stringList(p.dialogueHistory) || !record(p.answers) || !record(p.hints) || typeof p.restored !== 'boolean' || typeof p.finalReviewed !== 'boolean' || typeof p.finalResolved !== 'boolean' || typeof p.councilOpen !== 'boolean' || typeof p.hypothesis !== 'string' || p.hypothesis.length > 1000 || (p.dialogue !== null && typeof p.dialogue !== 'string') || (p.inspected !== null && typeof p.inspected !== 'string')) throw Error('Thiếu trường tiến độ');
    if (!p.discovered.every(id => c.evidence.some(e => e.id === id)) || !p.completed.every(id => c.investigations.some(t => t.id === id)) || !p.dialogueHistory.every(id => dialogue(id)?.chapterId === c.id) || (p.dialogue && (!p.dialogueHistory.includes(p.dialogue) || dialogue(p.dialogue)?.chapterId !== c.id)) || (p.inspected && !c.evidence.some(e => e.id === p.inspected))) throw Error('ID tiến độ không hợp lệ');
    const flags = dialogues.filter(d => d.chapterId === c.id).flatMap(d => d.choices.flatMap(ch => ch.flag ? [ch.flag] : []));
    if (!p.flags.every(id => flags.includes(id)) || Object.entries(p.hints).some(([id, n]) => !c.investigations.some(t => t.id === id) || ![0, 1, 2].includes(n))) throw Error('Gợi ý hoặc hội thoại lỗi');
    for (const [id, answer] of Object.entries(p.answers)) {
      const t = c.investigations.find(t => t.id === id);
      if (!t || !record(answer) || !requirementsMet(p, t.requires) || Object.entries(answer).some(([item, target]) => !t.items.some(i => i.id === item) || !t.targets.some(t => t.id === target))) throw Error('Lựa chọn lỗi');
    }
    if (p.discovered.some(id => !requirementsMet(p, allEvidence.find(e => e.id === id)!.requires)) || p.completed.some(id => !validInvestigation(id, p.answers[id] ?? {}) || !requirementsMet(p, allInvestigations.find(t => t.id === id)!.requires))) throw Error('Điều kiện phát hiện lỗi');
    if (!validDraft(p.council, c.council, p.discovered) || !validDraft(p.finalDraft, c.finalCase, p.discovered)) throw Error('Lập luận lỗi');
    if ((p.discovered.length || p.completed.length || p.dialogueHistory.length || p.flags.length || p.inspected || p.hypothesis || p.councilOpen || p.council.conclusion || p.council.repair) && !unlocked(s, c.id)) throw Error('Thứ tự chương lỗi');
    if (p.restored && !judgeChapter(s, c.id).ok) throw Error('Chương chưa đủ căn cứ');
    if (p.finalReviewed && !coreUnlocked(s)) throw Error('Báo cáo chưa mở');
    if (p.finalResolved && (!p.finalReviewed || !coreUnlocked(s) || !judgeCase(c.finalCase, p.finalDraft, p.discovered).ok)) throw Error('Báo cáo chưa đủ căn cứ');
  }
  if (!unlocked(s, s.currentChapter) || (s.finalCompleted && !chapters.every(c => s.chapters[c.id].finalResolved))) throw Error('Hành trình lỗi');
  return s;
}
export function loadCouncilGame(storage: Storage): { save: GameSaveV2; notice: string; recovered: boolean } {
  try {
    const save = parseCouncilSave(storage.getItem(SAVE_KEY_V2));
    return { save, recovered: false, notice: !storage.getItem(SAVE_KEY_V2) && storage.getItem(LEGACY_SAVE_KEY) ? `Hành trình ${brand.title} bắt đầu riêng. Tiến độ escape room cũ vẫn được giữ trên thiết bị.` : '' };
  } catch {
    return { save: newCouncilGame(), recovered: true, notice: 'Không đọc được bản lưu. Bạn có thể bắt đầu hành trình mới; bản lưu cũ chưa bị xóa. Tiến độ mới sẽ được ghi khi bạn thực hiện thao tác.' };
  }
}
