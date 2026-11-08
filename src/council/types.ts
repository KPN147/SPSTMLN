import type { RoomId } from '../game/types';

export type RoleId = 'an' | 'minh' | 'vy' | 'khoi';
export type Emotion = 'neutral' | 'thinking' | 'doubt' | 'agree' | 'surprise';
export type Character = { id: RoleId; name: string; role: string; ability: string; color: string; description: string };
export type Evidence = { id: string; chapterId: RoomId; index: number; title: string; body: string; kind: 'essential' | 'support' | 'story'; fiction: boolean; sourceId?: string; relatedSources?: string[]; role: RoleId; requires: string[]; discovery: string; detail: string };
export type Investigation = { id: string; chapterId: RoomId; objectiveId: string; role: RoleId; title: string; prompt: string; type: 'archive' | 'timeline' | 'circuit' | 'layers' | 'flow'; requires: string[]; items: { id: string; label: string; target: string }[]; targets: { id: string; label: string }[]; hints: [string, string]; success: string };
export type Option = { id: string; text: string };
export type CouncilCase = { id: string; chapterId: RoomId; title: string; report: string; conclusions: Option[]; correctConclusion: string; repairs: Option[]; correctRepair: string; evidenceSets: string[][]; rebuttals: { conclusion: string; evidence: string; repair: string }; success: string };
export type Chapter = { id: RoomId; name: string; shortName: string; subtitle: string; color: string; incident: string; question: string; background: string; hotspotNames: string[]; evidence: Evidence[]; investigations: Investigation[]; council: CouncilCase; finalCase: CouncilCase; reward: string; lore: string; intro: string };
export type DialogueChoice = { id: string; label: string; next: string; requires?: string[]; flag?: string };
export type DialogueNode = { id: string; chapterId: RoomId; speaker: RoleId; emotion: Emotion; text: string; choices: DialogueChoice[] };
export type CouncilDraft = { conclusion: string; evidence: string[]; repair: string };
export type ChapterProgress = { discovered: string[]; completed: string[]; answers: Record<string, Record<string, string>>; hints: Record<string, number>; flags: string[]; dialogue: string | null; dialogueHistory: string[]; council: CouncilDraft; restored: boolean; finalDraft: CouncilDraft; finalReviewed: boolean; finalResolved: boolean; hypothesis: string; inspected: string | null; councilOpen: boolean };
export type GameSaveV2 = { version: 2; activeRole: RoleId; currentChapter: RoomId; introSeen: boolean; chapters: Record<RoomId, ChapterProgress>; finalCompleted: boolean; updatedAt: string };
export type Settings = { muted: boolean; music: number; effects: number; reducedMotion: boolean };
export type Verdict = { ok: boolean; speaker: RoleId; message: string; kind: 'missing' | 'conclusion' | 'evidence' | 'repair' | 'success' };
