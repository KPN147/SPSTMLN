import type { RoomId } from '../game/types';
import type { RoleId } from '../council/types';

export type Choice = { id: string; text: string; feedback: string };
export type ProofOption = { id: string; text: string; evidenceIds: string[]; findingIds: string[]; reasonIds: string[] };
export type CouncilInteraction = { kind: 'council'; decisions: Choice[]; correctDecision: string; proofOptions: ProofOption[]; reasons: Choice[] };
export type MatchingInteraction = { kind: 'matching'; items: { id: string; label: string; target: string; feedback: string }[]; targets: { id: string; label: string }[] };
export type TimelineInteraction = Omit<MatchingInteraction, 'kind'> & { kind: 'timeline' };
export type DecisionInteraction = { kind: 'decision'; options: Choice[]; correct: string };
export type LearningStep = {
  id: string; objectiveId: string; roomId: RoomId; title: string; role: RoleId;
  concept: string; scenario: string; question: string; sourceId: string;
  requiresEvidence: string[]; usesFindings: { id: string; relation: 'context' | 'supports' }[];
  finding: { id: string; text: string }; hints: [string, string]; success: string;
  interaction: MatchingInteraction | TimelineInteraction | DecisionInteraction | CouncilInteraction;
};
export type RestorationRoom = {
  id: RoomId; name: string; shortName: string; color: string; background: string; incident: string;
  steps: [LearningStep, LearningStep, LearningStep, LearningStep]; finalCase: LearningStep;
};
