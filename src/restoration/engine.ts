import { rooms, allSteps, room, step } from './curriculum';
import type { LearningStep } from './model';
import type { RoleId } from '../council/types';
import type { RoomId } from '../game/types';
import { chapter, characters } from '../council/content';
import { parseCouncilSave } from '../council/engine';

export const SAVE_KEY = 'mln131-restoration-save-v3';
export const REVISION = 1;
export type Answer = { placements: Record<string,string>; choice: string; decision: string; proof: string; reason: string; page: number };
export type Progress = { evidence: string[]; completed: string[]; imported: string[]; answers: Record<string,Answer>; help: Record<string,number>; notes: string; finalDone: boolean; finalImported: boolean };
export type Save = { version: 3; revision: number; role: RoleId; currentRoom: RoomId; rooms: Record<RoomId,Progress>; finalComplete: boolean; updatedAt: string };
export const emptyAnswer = (): Answer => ({ placements: {}, choice:'', decision:'', proof:'', reason:'', page:0 });
const blank = (): Progress => ({ evidence:[],completed:[],imported:[],answers:{},help:{},notes:'',finalDone:false,finalImported:false });
export const fresh = (): Save => ({ version:3,revision:REVISION,role:'an',currentRoom:1,rooms:{1:blank(),2:blank(),3:blank(),4:blank()},finalComplete:false,updatedAt:new Date().toISOString() });
export const openRoom = (s:Save,id:RoomId) => rooms.filter(r=>r.id<id).every(r=>s.rooms[r.id].completed.includes(r.steps[3].id));
export const coreOpen = (s:Save) => rooms.every(r=>s.rooms[r.id].completed.includes(r.steps[3].id));
export const findings = (s:Save) => rooms.flatMap(r=>r.steps.filter(t=>s.rooms[r.id].completed.includes(t.id)).map(t=>({...t.finding,stepId:t.id,roomId:r.id,imported:s.rooms[r.id].imported.includes(t.id)})));
export const nextStep = (s:Save,id:RoomId) => room(id).steps.find(t=>!s.rooms[id].completed.includes(t.id)) ?? null;
export const countGoals = (s:Save) => rooms.reduce((n,r)=>n+s.rooms[r.id].completed.length,0);
export const countLetters = (s:Save) => rooms.filter(r=>s.rooms[r.id].evidence.includes(`c${r.id}-e7`)).length;
export function canRead(s:Save,id:RoomId,eid:string) { const e=chapter(id).evidence.find(e=>e.id===eid);return !!e&&openRoom(s,id)&&e.requires.every(req=>s.rooms[id].evidence.includes(req)||s.rooms[id].completed.includes(req.replace(/^c(\d)-i(\d)$/, 'r$1-p$2'))); }
export function proofAvailable(s:Save,t:LearningStep,id:string) { if(t.interaction.kind!=='council')return false;const proof=t.interaction.proofOptions.find(p=>p.id===id);const known=findings(s).map(f=>f.id);return !!proof&&proof.evidenceIds.every(id=>s.rooms[t.roomId].evidence.includes(id))&&proof.findingIds.every(id=>known.includes(id)); }
export function ready(s:Save,t:LearningStep) { const r=room(t.roomId),index=r.steps.findIndex(v=>v.id===t.id);return openRoom(s,t.roomId)&&(index<0?coreOpen(s):r.steps.slice(0,index).every(v=>s.rooms[t.roomId].completed.includes(v.id)))&&t.requiresEvidence.every(id=>s.rooms[t.roomId].evidence.includes(id)); }
export type Feedback = { ok:boolean; message:string; page?:number };
export function judge(t:LearningStep,a:Answer,s:Save):Feedback {
  if(!ready(s,t))return {ok:false,message:'Cần hoàn thành bước trước và ghi nhận tài liệu của bước này.'};
  const i=t.interaction;
  if(i.kind==='matching'||i.kind==='timeline') {
    const missing=i.items.find(v=>!a.placements[v.id]);if(missing)return {ok:false,message:`Còn thiếu “${missing.label}”. Chọn thẻ rồi chọn vị trí.`};
    const wrong=i.items.find(v=>a.placements[v.id]!==v.target);return wrong?{ok:false,message:wrong.feedback}:{ok:true,message:t.success};
  }
  if(i.kind==='decision')return !a.choice?{ok:false,message:'Chọn một cách xử lý trước khi kiểm tra.'}:a.choice===i.correct?{ok:true,message:t.success}:{ok:false,message:i.options.find(o=>o.id===a.choice)?.feedback??'Lựa chọn không thuộc tình huống này.'};
  if(!a.decision)return {ok:false,message:'Chọn cách xử lý ở bước 1.',page:0};
  if(a.decision!==i.correctDecision)return {ok:false,message:i.decisions.find(o=>o.id===a.decision)?.feedback??'Cần chọn lại quyết định.',page:0};
  const proof=i.proofOptions.find(p=>p.id===a.proof);
  if(!proof||!proofAvailable(s,t,proof.id))return {ok:false,message:'Chọn căn cứ đã tìm được ở bước 2.',page:1};
  if(!proof.reasonIds.length)return {ok:false,message:'Dữ kiện này chưa giải thích quyết định. Đối chiếu lại câu hỏi và ý kiến thức.',page:1};
  if(!a.reason)return {ok:false,message:'Chọn lý do nối căn cứ với quyết định ở bước 3.',page:2};
  return proof.reasonIds.includes(a.reason)?{ok:true,message:t.success}:{ok:false,message:i.reasons.find(o=>o.id===a.reason)?.feedback??'Lý do chưa phù hợp với căn cứ.',page:2};
}
export type Action = {type:'role';role:RoleId}|{type:'enter';id:RoomId}|{type:'collect';id:RoomId;evidence:string}|{type:'answer';id:string;answer:Answer}|{type:'submit';id:string}|{type:'help';id:string}|{type:'notes';id:RoomId;text:string}|{type:'finish'}|{type:'reset'};
export function reducer(s:Save,a:Action):Save {
  if(a.type==='reset')return fresh();
  let n=s;
  if(a.type==='role'&&characters.some(c=>c.id===a.role))n={...s,role:a.role};
  if(a.type==='enter'&&openRoom(s,a.id))n={...s,currentRoom:a.id};
  if(a.type==='finish'&&rooms.every(r=>s.rooms[r.id].finalDone))n={...s,finalComplete:true};
  if(a.type==='collect'&&canRead(s,a.id,a.evidence)&&!s.rooms[a.id].evidence.includes(a.evidence))n={...s,role:chapter(a.id).evidence.find(e=>e.id===a.evidence)!.role,rooms:{...s.rooms,[a.id]:{...s.rooms[a.id],evidence:[...s.rooms[a.id].evidence,a.evidence]}}};
  if(a.type==='notes'&&openRoom(s,a.id))n={...s,rooms:{...s.rooms,[a.id]:{...s.rooms[a.id],notes:a.text.slice(0,1000)}}};
  if(a.type==='answer'||a.type==='submit'||a.type==='help') {
    const t=allSteps.find(t=>t.id===a.id);if(!t)return s;const p=s.rooms[t.roomId],isFinal=t.id.startsWith('final-'),done=isFinal?p.finalDone:p.completed.includes(t.id);
    if(done||!ready(s,t))return s;
    const updated={...p};
    if(a.type==='answer') { if(!validAnswer(t,a.answer))return s;updated.answers={...p.answers,[t.id]:a.answer}; }
    if(a.type==='help')updated.help={...p.help,[t.id]:Math.min(3,(p.help[t.id]??0)+1)};
    if(a.type==='submit') {if(!judge(t,p.answers[t.id]??emptyAnswer(),s).ok)return s;if(isFinal)updated.finalDone=true;else updated.completed=[...p.completed,t.id];}
    n={...s,role:t.role,rooms:{...s.rooms,[t.roomId]:updated}};
  }
  return n===s?s:{...n,updatedAt:new Date().toISOString()};
}
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const list=(v:unknown):v is string[]=>Array.isArray(v)&&v.every(x=>typeof x==='string')&&new Set(v).size===v.length;
function validAnswer(t:LearningStep,v:unknown):v is Answer {
  if(!record(v)||!record(v.placements)||!['choice','decision','proof','reason'].every(k=>typeof v[k]==='string')||!Number.isInteger(v.page)||Number(v.page)<0||Number(v.page)>2)return false;
  const a=v as unknown as Answer,i=t.interaction;
  if(i.kind==='matching'||i.kind==='timeline')return !a.choice&&!a.decision&&!a.proof&&!a.reason&&Object.entries(a.placements).every(([id,target])=>i.items.some(v=>v.id===id)&&i.targets.some(v=>v.id===target));
  if(Object.keys(a.placements).length)return false;
  if(i.kind==='decision')return (!a.choice||i.options.some(v=>v.id===a.choice))&&!a.decision&&!a.proof&&!a.reason;
  return !a.choice&&(!a.decision||i.decisions.some(v=>v.id===a.decision))&&(!a.proof||i.proofOptions.some(v=>v.id===a.proof))&&(!a.reason||i.reasons.some(v=>v.id===a.reason));
}
export function parse(raw:string):Save {
  const v:unknown=JSON.parse(raw);if(!record(v)||v.version!==3||v.revision!==REVISION||!record(v.rooms)||!characters.some(c=>c.id===v.role)||(typeof v.currentRoom!=='number'||![1,2,3,4].includes(v.currentRoom))||typeof v.finalComplete!=='boolean'||typeof v.updatedAt!=='string'||!Number.isFinite(Date.parse(v.updatedAt)))throw Error('Bản lưu không hợp lệ');
  const s=v as unknown as Save;
  for(const r of rooms) {
    const p=s.rooms[r.id];if(!record(p)||!list(p.evidence)||!list(p.completed)||!list(p.imported)||!record(p.answers)||!record(p.help)||typeof p.notes!=='string'||p.notes.length>1000||typeof p.finalDone!=='boolean'||typeof p.finalImported!=='boolean')throw Error('Thiếu tiến độ');
    if(!p.evidence.every(id=>chapter(r.id).evidence.some(e=>e.id===id))||!p.completed.every(id=>r.steps.some(t=>t.id===id))||!p.imported.every(id=>p.completed.includes(id)))throw Error('Phát hiện không hợp lệ');
    for(const [id,a]of Object.entries(p.answers)){const t=allSteps.find(t=>t.id===id&&t.roomId===r.id);if(!t||!validAnswer(t,a))throw Error('Lựa chọn không hợp lệ');}
    if(Object.entries(p.help).some(([id,n])=>!allSteps.some(t=>t.id===id&&t.roomId===r.id)||(typeof n!=='number'||![0,1,2,3].includes(n))))throw Error('Gợi ý không hợp lệ');
    if((p.evidence.length||p.completed.length||p.notes||Object.keys(p.answers).length||Object.keys(p.help).length)&&!openRoom(s,r.id))throw Error('Phòng chưa mở');
    for(const id of p.completed)if(!p.imported.includes(id)&&!judge(step(id)!,p.answers[id]??emptyAnswer(),s).ok)throw Error('Bước chưa đủ căn cứ');
    if(p.evidence.some(id=>!canRead(s,r.id,id))||(p.finalDone&&!p.finalImported&&!judge(r.finalCase,p.answers[r.finalCase.id]??emptyAnswer(),s).ok)||(p.finalDone&&!coreOpen(s)))throw Error('Tiến độ không hợp lệ');
  }
  if(!openRoom(s,s.currentRoom)||(s.finalComplete&&!rooms.every(r=>s.rooms[r.id].finalDone)))throw Error('Hành trình chưa hoàn thành');return s;
}
export function migrate(raw:string):Save {
  const old=parseCouncilSave(raw),s=fresh();s.role=old.activeRole;s.currentRoom=old.currentChapter;s.finalComplete=old.finalCompleted;
  for(const r of rooms) {const p=old.chapters[r.id],n=s.rooms[r.id];n.evidence=[...p.discovered];n.notes=p.hypothesis;n.completed=[...p.completed.map(id=>id.replace(/^c(\d)-i(\d)$/,'r$1-p$2')),...(p.restored?[r.steps[3].id]:[])];n.imported=[...n.completed];n.finalDone=p.finalResolved;n.finalImported=p.finalResolved;}
  return s;
}
