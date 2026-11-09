import { rooms } from '../restoration/curriculum';
import type { LearningStep } from '../restoration/model';
import { emptyAnswer, fresh, proofAvailable, reducer } from '../restoration/engine';
import type { Save } from '../restoration/engine';
export function winningAnswer(t:LearningStep,s:Save){const a=emptyAnswer(),i=t.interaction;if(i.kind==='matching'||i.kind==='timeline')a.placements=Object.fromEntries(i.items.map(v=>[v.id,v.target]));else if(i.kind==='decision')a.choice=i.correct;else{const p=i.proofOptions.find(v=>v.reasonIds.length&&proofAvailable(s,t,v.id))!;a.decision=i.correctDecision;a.proof=p.id;a.reason=p.reasonIds[0];a.page=2;}return a;}
export function completedRooms(n:number){let s=fresh();for(const r of rooms.slice(0,n))for(const t of r.steps){for(const id of t.requiresEvidence)s=reducer(s,{type:'collect',id:r.id,evidence:id});s=reducer(s,{type:'answer',id:t.id,answer:winningAnswer(t,s)});s=reducer(s,{type:'submit',id:t.id});}return s;}
