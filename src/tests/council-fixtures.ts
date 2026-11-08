import { chapters, finalReviewers } from '../council/content';
import { councilReducer, newCouncilGame } from '../council/engine';
import type { CouncilCase, CouncilDraft, GameSaveV2 } from '../council/types';
import type { RoomId } from '../game/types';

export const winningDraft = (c: CouncilCase, set = 0): CouncilDraft => ({ conclusion: c.correctConclusion, repair: c.correctRepair, evidence: c.evidenceSets[set] });
export function prepareChapter(s: GameSaveV2, id: RoomId, extras = true): GameSaveV2 {
  const c = chapters.find(c => c.id === id)!;
  for (const e of c.evidence.slice(0, extras ? 6 : 4)) {
    s = councilReducer(s, { type: 'role', role: e.role });
    s = councilReducer(s, { type: 'collect', chapter: id, id: e.id });
  }
  for (const t of c.investigations) {
    s = councilReducer(s, { type: 'role', role: t.role });
    for (const item of t.items) s = councilReducer(s, { type: 'answer', chapter: id, id: t.id, item: item.id, target: item.target });
    s = councilReducer(s, { type: 'solve', chapter: id, id: t.id });
  }
  if (extras) { s = councilReducer(s, { type: 'role', role: 'vy' }); s = councilReducer(s, { type: 'collect', chapter: id, id: c.evidence[6].id }); }
  return s;
}
export function finishThrough(last: number, extras = true): GameSaveV2 {
  let s = newCouncilGame();
  for (const c of chapters.filter(c => c.id <= last)) {
    s = prepareChapter(s, c.id, extras);
    s = councilReducer(s, { type: 'role', role: 'khoi' });
    s = councilReducer(s, { type: 'draft', chapter: c.id, draft: winningDraft(c.council) });
    s = councilReducer(s, { type: 'restore', chapter: c.id });
  }
  return s;
}
export function fullCouncilSave(extras = true): GameSaveV2 {
  let s = finishThrough(4, extras);
  for (const c of chapters) {
    s = councilReducer(s, { type: 'role', role: finalReviewers[c.id] });
    s = councilReducer(s, { type: 'reviewFinal', chapter: c.id });
    s = councilReducer(s, { type: 'role', role: 'khoi' });
    s = councilReducer(s, { type: 'draft', chapter: c.id, draft: winningDraft(c.finalCase), final: true });
    s = councilReducer(s, { type: 'resolveFinal', chapter: c.id });
  }
  return councilReducer(s, { type: 'finish' });
}
