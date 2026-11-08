import { puzzles } from '../data/puzzles';
import { rooms } from '../data/rooms';
import type { Answer, GameSaveV1, Puzzle, RoomId } from './types';

export const SAVE_KEY = 'mln131-escape-save-v1';
export const emptySave = (): GameSaveV1 => ({version:1,completedPuzzleIds:[],collectedClueIds:[],collectedShardIds:[],viewedKnowledgeIds:[],revealedHints:{},finalCompleted:false,introSeen:false,updatedAt:new Date().toISOString()});
export const roomPuzzles = (id:RoomId) => puzzles.filter(p=>p.roomId===id).sort((a,b)=>a.order-b.order);
export const roomDone = (s:GameSaveV1,id:RoomId) => roomPuzzles(id).every(p=>s.completedPuzzleIds.includes(p.id));
export const roomUnlocked = (s:GameSaveV1,id:RoomId) => rooms.filter(r=>r.id<id).every(r=>roomDone(s,r.id));
export const finalUnlocked = (s:GameSaveV1) => puzzles.every(p=>s.completedPuzzleIds.includes(p.id));
export const puzzleUnlocked = (s:GameSaveV1,p:Puzzle) => roomUnlocked(s,p.roomId) && (p.order===1 || s.completedPuzzleIds.includes(`r${p.roomId}-p${p.order-1}`));
export const score = (s:GameSaveV1) => Math.min(100,new Set(s.completedPuzzleIds.filter(id=>puzzles.some(p=>p.id===id))).size*5+(s.finalCompleted&&finalUnlocked(s)?20:0));
export function shuffled<T>(items:T[]):T[] { return items.length<2?[...items]:[...items.slice(1).reverse(),items[0]]; }
export function initialAnswer(p:Puzzle):Answer { return p.type==='timeline'?shuffled(p.events).map(e=>e.id):p.type==='evidence-lock'?[]:{}; }
export function correctAnswer(p:Puzzle):Answer {
 if(p.type==='classification')return Object.fromEntries(p.cards.map(c=>[c.id,c.correctGroupId]));
 if(p.type==='matching')return Object.fromEntries(p.pairs.map(c=>[c.id,c.id]));
 if(p.type==='timeline')return [...p.events].sort((a,b)=>a.year-b.year).map(e=>e.id);
 return p.statements.filter(s=>s.supported).map(s=>s.id);
}
export function validatePuzzle(p:Puzzle,answer:Answer):boolean {
 const expected=correctAnswer(p);
 if(Array.isArray(expected)){
  if(!Array.isArray(answer)||answer.some(x=>typeof x!=='string')||answer.length!==expected.length||new Set(answer).size!==answer.length)return false;
  return p.type==='timeline'?answer.every((x,i)=>x===expected[i]):answer.every(x=>expected.includes(x));
 }
 if(!answer||Array.isArray(answer)||typeof answer!=='object')return false;
 return Object.keys(expected).length===Object.keys(answer).length&&Object.entries(expected).every(([k,v])=>answer[k]===v);
}
export type Action = {type:'solve';id:string;answer:Answer}|{type:'hint';id:string}|{type:'view';id:string}|{type:'intro'}|{type:'final';answer:Record<string,string>}|{type:'reset'};
export function gameReducer(s:GameSaveV1,a:Action):GameSaveV1 {
 if(a.type==='reset')return emptySave();
 let next=s;
 if(a.type==='intro')next={...s,introSeen:true};
 if(a.type==='solve'){
  const p=puzzles.find(p=>p.id===a.id);
  if(!p||!puzzleUnlocked(s,p)||s.completedPuzzleIds.includes(p.id)||!validatePuzzle(p,a.answer))return s;
  const completedPuzzleIds=[...new Set([...s.completedPuzzleIds,p.id])];
  const collectedClueIds=[...new Set([...s.collectedClueIds,...(p.clueReward?[p.clueReward.id]:[])])];
  const partial={...s,completedPuzzleIds,collectedClueIds};
  next={...partial,collectedShardIds:rooms.filter(r=>roomDone(partial,r.id)).map(r=>r.shard)};
 }
 if(a.type==='hint'){
  const p=puzzles.find(p=>p.id===a.id);if(!p||!puzzleUnlocked(s,p))return s;
  next={...s,revealedHints:{...s.revealedHints,[a.id]:Math.min(2,(s.revealedHints[a.id]??0)+1) as 1|2}};
 }
 if(a.type==='view'&&s.completedPuzzleIds.includes(a.id))next={...s,viewedKnowledgeIds:[...new Set([...s.viewedKnowledgeIds,a.id])]};
 if(a.type==='final'){
  if(!finalUnlocked(s)||Object.keys(a.answer).length!==4||!rooms.every(r=>a.answer[r.shard]===r.shard))return s;
  next={...s,finalCompleted:true};
 }
 return next===s?s:{...next,updatedAt:new Date().toISOString()};
}
export function parseSave(raw:string|null):GameSaveV1 {
 if(raw===null)return emptySave();
 const value:unknown=JSON.parse(raw);
 if(!value||typeof value!=='object')throw Error('Save không hợp lệ');
 const s=value as GameSaveV1;
 const ids=(v:unknown):v is string[]=>Array.isArray(v)&&v.every(x=>typeof x==='string');
 if(s.version!==1||!ids(s.completedPuzzleIds)||!ids(s.collectedClueIds)||!ids(s.collectedShardIds)||!ids(s.viewedKnowledgeIds)||typeof s.introSeen!=='boolean'||typeof s.finalCompleted!=='boolean'||typeof s.updatedAt!=='string'||!Number.isFinite(Date.parse(s.updatedAt))||!s.revealedHints||typeof s.revealedHints!=='object'||Array.isArray(s.revealedHints))throw Error('Save không hợp lệ');
 const known=new Set(puzzles.map(p=>p.id));
 if(s.completedPuzzleIds.some(id=>!known.has(id))||s.viewedKnowledgeIds.some(id=>!s.completedPuzzleIds.includes(id))||Object.entries(s.revealedHints).some(([id,n])=>!known.has(id)||![0,1,2].includes(n)))throw Error('ID không hợp lệ');
 const normalized={...s,completedPuzzleIds:[...new Set(s.completedPuzzleIds)],viewedKnowledgeIds:[...new Set(s.viewedKnowledgeIds)]};
 if(puzzles.some(p=>normalized.completedPuzzleIds.includes(p.id)&&!puzzleUnlocked(normalized,p)))throw Error('Thứ tự tiến độ không hợp lệ');
 const expectedClues=puzzles.filter(p=>normalized.completedPuzzleIds.includes(p.id)&&p.clueReward).map(p=>p.clueReward!.id);
 const expectedShards=rooms.filter(r=>roomDone(normalized,r.id)).map(r=>r.shard);
 const same=(a:string[],b:string[])=>new Set(a).size===b.length&&a.every(x=>b.includes(x));
 if(!same(s.collectedClueIds,expectedClues)||!same(s.collectedShardIds,expectedShards)||(s.finalCompleted&&!finalUnlocked(normalized)))throw Error('Phần thưởng không hợp lệ');
 return {...normalized,collectedClueIds:expectedClues,collectedShardIds:expectedShards};
}
export function loadGame(storage:Storage):{save:GameSaveV1;notice:string} {
 try{return {save:parseSave(storage.getItem(SAVE_KEY)),notice:''};}catch{return {save:emptySave(),notice:'Không đọc được tiến độ đã lưu. Trò chơi đã mở một hành trình mới an toàn.'};}
}
export function saveGame(storage:Storage,s:GameSaveV1):boolean {try{storage.setItem(SAVE_KEY,JSON.stringify(s));return true;}catch{return false;}}
