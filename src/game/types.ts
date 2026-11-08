export type RoomId = 1 | 2 | 3 | 4;
export type ShardId = 'origin' | 'mission' | 'transition' | 'democracy';
export type PuzzleType = 'classification' | 'matching' | 'timeline' | 'evidence-lock';
export type TextbookSource = { book: 'Giáo trình Chủ nghĩa xã hội khoa học (2021)'; chapter: RoomId; printedPages: number[]; pdfPages: number[]; sourceReviewStatus: 'needs-review' | 'verified' };
type PuzzleBase = { id: string; roomId: RoomId; order: 1 | 2 | 3 | 4; title: string; hotspotName: string; learningObjective: string; instruction: string; readingNote: string; hints: [string, string]; explanation: string; keyTakeaways: string[]; source: TextbookSource; illustration?: boolean; clueReward?: { id: string; name: string; description: string } };
export type Puzzle = PuzzleBase & (
  { type: 'classification'; groups: {id:string;label:string}[]; cards: {id:string;label:string;correctGroupId:string}[] } |
  { type: 'matching'; pairs: {id:string;left:string;right:string}[] } |
  { type: 'timeline'; events: {id:string;year:number;label:string}[] } |
  { type: 'evidence-lock'; statements: {id:string;text:string;supported:boolean}[] }
);
export type Answer = Record<string,string> | string[];
export type GameSaveV1 = { version: 1; completedPuzzleIds: string[]; collectedClueIds: string[]; collectedShardIds: ShardId[]; viewedKnowledgeIds: string[]; revealedHints: Record<string,0|1|2>; finalCompleted: boolean; introSeen: boolean; updatedAt: string };
export type Room = {id:RoomId; name:string; shortName:string; english:string; color:string; shard:ShardId; description:string; takeaways:string[]; finalLabel:string};
