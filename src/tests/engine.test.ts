import { describe, it, expect, beforeEach } from 'vitest';
import { puzzles } from '../data/puzzles';
import { rooms } from '../data/rooms';
import { correctAnswer, emptySave, finalUnlocked, gameReducer, initialAnswer, loadGame, parseSave, puzzleUnlocked, roomDone, roomUnlocked, SAVE_KEY, saveGame, score, validatePuzzle } from '../game/engine';
import type { Answer, GameSaveV1, Puzzle } from '../game/types';
const finish=()=>puzzles.reduce((s,p)=>gameReducer(s,{type:'solve',id:p.id,answer:correctAnswer(p)}),emptySave());
describe('Bộ nội dung theo giáo trình',()=>{
 it('có đúng 4 phòng và 16 câu với phân bố cơ chế chuẩn',()=>{
  expect(rooms).toHaveLength(4);expect(puzzles).toHaveLength(16);expect(new Set(puzzles.map(p=>p.id)).size).toBe(16);
  for(const r of rooms)expect(puzzles.filter(p=>p.roomId===r.id).map(p=>p.order)).toEqual([1,2,3,4]);
  expect(['classification','matching','timeline','evidence-lock'].map(t=>puzzles.filter(p=>p.type===t).length)).toEqual([5,6,1,4]);
 });
 it.each(puzzles)('$id đủ manh mối, nguồn và lời giải 80–160 từ',p=>{
  expect(p.hints).toHaveLength(2);expect(p.hints.every(h=>h.length>20)).toBe(true);expect(p.learningObjective.length).toBeGreaterThan(10);expect(p.instruction.length).toBeGreaterThan(10);expect(p.readingNote.length).toBeGreaterThan(50);
  const words=p.explanation.split(/\s+/).length;expect(words).toBeGreaterThanOrEqual(80);expect(words).toBeLessThanOrEqual(160);
  expect(p.source.printedPages.length).toBeGreaterThan(0);expect(p.source.pdfPages).toEqual(p.source.printedPages.map(n=>n-3));expect(p.source.printedPages.every(n=>n>=11&&n<=153)).toBe(true);
  expect(p.source.sourceReviewStatus).toBe('needs-review');expect(p.keyTakeaways.length).toBeGreaterThanOrEqual(2);
  expect(p.order===4? !p.clueReward:!!p.clueReward).toBe(true);
 });
});
describe('Kiểm tra đáp án',()=>{
 it.each(puzzles)('$id chấp nhận đúng, từ chối thiếu, thừa, sai',p=>{
  const correct=correctAnswer(p);expect(validatePuzzle(p,correct)).toBe(true);expect(validatePuzzle(p,initialAnswer(p))).toBe(false);
  if(Array.isArray(correct)){
   expect(validatePuzzle(p,correct.slice(1))).toBe(false);expect(validatePuzzle(p,[...correct,'fake'])).toBe(false);expect(validatePuzzle(p,correct.map((id,i)=>i===0?'fake':id))).toBe(false);expect(validatePuzzle(p,[...correct,correct[0]])).toBe(false);
   expect(validatePuzzle(p,[...correct].reverse())).toBe(p.type==='evidence-lock');
  }else{
   const partial={...correct};delete partial[Object.keys(partial)[0]];expect(validatePuzzle(p,partial)).toBe(false);expect(validatePuzzle(p,{...correct,fake:'A'})).toBe(false);expect(validatePuzzle(p,{...correct,[Object.keys(correct)[0]]:'fake'})).toBe(false);
  }
  expect(validatePuzzle(p,null as unknown as Answer)).toBe(false);
 });
});
describe('Tiến độ và phần thưởng',()=>{
 it('không vượt khóa, sai không hoàn thành, đúng chỉ thưởng một lần',()=>{
  const s=emptySave(),p=puzzles[0],locked=puzzles[1];expect(roomUnlocked(s,1)).toBe(true);expect(roomUnlocked(s,2)).toBe(false);expect(finalUnlocked(s)).toBe(false);
  expect(gameReducer(s,{type:'solve',id:locked.id,answer:correctAnswer(locked)})).toBe(s);
  expect(gameReducer(s,{type:'solve',id:p.id,answer:{}})).toBe(s);
  const next=gameReducer(s,{type:'solve',id:p.id,answer:correctAnswer(p)});expect(score(next)).toBe(5);expect(next.collectedClueIds).toHaveLength(1);expect(puzzleUnlocked(next,locked)).toBe(true);expect(gameReducer(next,{type:'solve',id:p.id,answer:correctAnswer(p)})).toBe(next);
 });
 it('đi từ 0 đến 80 rồi 100, chỉ mở Final khi đủ 16 câu',()=>{
  let s=emptySave();expect(score(s)).toBe(0);
  for(const p of puzzles){s=gameReducer(s,{type:'solve',id:p.id,answer:correctAnswer(p)});if(p.order===4){expect(roomDone(s,p.roomId)).toBe(true);expect(s.collectedShardIds.length).toBe(p.roomId);}if(s.completedPuzzleIds.length<16)expect(finalUnlocked(s)).toBe(false);}
  expect(score(s)).toBe(80);expect(s.collectedClueIds).toHaveLength(12);expect(finalUnlocked(s)).toBe(true);
  expect(gameReducer(s,{type:'final',answer:{}})).toBe(s);
  s=gameReducer(s,{type:'final',answer:Object.fromEntries(rooms.map(r=>[r.shard,r.shard]))});expect(score(s)).toBe(100);expect(s.finalCompleted).toBe(true);
  expect(score({...s,completedPuzzleIds:[...s.completedPuzzleIds,'fake',puzzles[0].id]})).toBe(100);
 });
 it('gợi ý tối đa hai cấp, không trừ điểm và không mở câu khóa',()=>{
  let s=emptySave();expect(gameReducer(s,{type:'hint',id:'r4-p4'})).toBe(s);
  for(let i=0;i<4;i++)s=gameReducer(s,{type:'hint',id:'r1-p1'});expect(s.revealedHints['r1-p1']).toBe(2);expect(score(s)).toBe(0);
  expect(gameReducer(s,{type:'final',answer:Object.fromEntries(rooms.map(r=>[r.shard,r.shard]))}).finalCompleted).toBe(false);
 });
});
describe('Lưu và khôi phục',()=>{
 beforeEach(()=>localStorage.clear());
 it('round trip một hành trình và reset',()=>{
  const s=finish();expect(saveGame(localStorage,s)).toBe(true);expect(loadGame(localStorage).save).toEqual(s);expect(gameReducer(s,{type:'reset'}).completedPuzzleIds).toEqual([]);expect(parseSave(null).completedPuzzleIds).toEqual([]);
 });
 it.each(['{broken','null','{}',JSON.stringify({...emptySave(),version:2}),JSON.stringify({...emptySave(),completedPuzzleIds:['fake']}),JSON.stringify({...emptySave(),completedPuzzleIds:['r1-p2']}),JSON.stringify({...emptySave(),finalCompleted:true}),JSON.stringify({...emptySave(),collectedShardIds:['origin']})])('phục hồi an toàn dữ liệu hỏng: %s',raw=>{
  localStorage.setItem(SAVE_KEY,raw);const loaded=loadGame(localStorage);expect(loaded.save.completedPuzzleIds).toEqual([]);expect(loaded.notice).not.toBe('');
 });
 it('từ chối field thiếu, hint giả, mốc thời gian sai và clue không khớp',()=>{
  const s=finish();for(const patch of [{introSeen:undefined},{revealedHints:{fake:1}},{revealedHints:{'r1-p1':3}},{updatedAt:'bad'},{collectedClueIds:[]},{viewedKnowledgeIds:['fake']}])expect(()=>parseSave(JSON.stringify({...s,...patch}))).toThrow();
 });
 it('không crash khi localStorage không cho phép truy cập',()=>{
  const storage={getItem:()=>{throw Error('denied');},setItem:()=>{throw Error('denied');}} as unknown as Storage;
  expect(loadGame(storage).notice).not.toBe('');expect(saveGame(storage,emptySave())).toBe(false);
 });
 it('chuẩn hóa tập ID trùng',()=>{const s=finish();expect(parseSave(JSON.stringify({...s,completedPuzzleIds:[...s.completedPuzzleIds,'r1-p1']})).completedPuzzleIds).toHaveLength(16);});
});
// Export fixtures for the integration walkthrough without bypassing reducer rules.
export const fullSave:()=>GameSaveV1=finish;
export const getPuzzle=(id:string):Puzzle=>puzzles.find(p=>p.id===id)!;
