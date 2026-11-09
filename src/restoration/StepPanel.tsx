import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Lightbulb, BookOpen } from 'lucide-react';
import { puzzles } from '../data/puzzles';
import { useAudio } from '../council/Audio';
import { emptyAnswer, findings, judge, proofAvailable } from './engine';
import type { Answer, Feedback, Save } from './engine';
import type { LearningStep } from './model';

export function Source({id}:{id:string}) {const p=puzzles.find(p=>p.id===id)!;return <details className="v3-source"><summary><BookOpen size={15}/>Diễn giải đầy đủ và nguồn</summary><p>{p.readingNote}</p><p>{p.explanation}</p><small>{p.source.book} · Chương {p.source.chapter} · Trang in {p.source.printedPages.join(', ')}. Diễn giải đang chờ duyệt đối chiếu nguồn.</small></details>;}
export function StepPanel({task:t,save,answer:stored,help,done,onAnswer,onHelp,onSubmit,onContinue}:{task:LearningStep;save:Save;answer?:Answer;help:number;done:boolean;onAnswer:(a:Answer)=>void;onHelp:()=>void;onSubmit:()=>void;onContinue:()=>void}) {
  const a=stored??emptyAnswer(),i=t.interaction,{play}=useAudio(),[selected,setSelected]=useState<string|null>(null),[feedback,setFeedback]=useState<Feedback|null>(null),ref=useRef<HTMLElement>(null);
  function change(next:Answer){onAnswer(next);setFeedback(null);play('select');}
  function page(n:number){change({...a,page:n});setTimeout(()=>{ref.current?.scrollIntoView({block:'start',behavior:'auto'});ref.current?.focus({preventScroll:true});},0);}
  function submit(){const result=judge(t,a,save);setFeedback(result);play(result.ok?'insight':'reject');if(result.ok)onSubmit();}
  const known=findings(save),links=t.usesFindings.map(link=>({link,found:known.find(f=>f.id===link.id)})).filter(v=>v.found);
  const sample=i.kind==='council'?i.proofOptions.find(p=>p.reasonIds.length&&proofAvailable(save,t,p.id)):null;
  return <section className="v3-step" ref={ref} tabIndex={-1} aria-label={t.title}>
    <header><p className="eyebrow">{t.id.startsWith('final')?'HỒ SƠ MỞ LẠI THƯ VIỆN':'HỒ SƠ ĐANG PHỤC DỰNG'}</p><h2>{t.title}</h2></header>
    {done?<div className="v3-success" role="status"><Check size={23}/><div><h3>Đã nối một mảnh tri thức</h3><p>{t.finding.text}</p></div><button className="button" onClick={onContinue}>Tiếp tục<ArrowRight size={17}/></button></div>:<>
      <p className="v3-scenario">{t.scenario}</p><div className="v3-concept"><span>KIẾN THỨC CẦN DÙNG</span><p>{t.concept}</p></div>
      <h3 className="v3-question">{t.question}</h3>
      {i.kind==='matching'||i.kind==='timeline'?<><p className="v3-operation">Chọn một thẻ → chọn vị trí.</p><div className="v3-match"><div role="group" aria-label="Thẻ cần xử lý">{i.items.map(item=><button key={item.id} className={`v3-card ${selected===item.id?'selected':''}`} aria-pressed={selected===item.id} onClick={()=>setSelected(item.id)}><span>{item.label}</span>{a.placements[item.id]&&<small>→ {i.targets.find(v=>v.id===a.placements[item.id])?.label}</small>}</button>)}</div><div role="group" aria-label="Vị trí phục dựng">{i.targets.map(target=><button className="v3-target" key={target.id} disabled={!selected} onClick={()=>{change({...a,placements:{...a.placements,[selected!]:target.id}});setSelected(null);}}>{target.label}</button>)}</div></div></>:i.kind==='decision'?<fieldset className="v3-options"><legend className="sr-only">Chọn quyết định</legend>{i.options.map(o=><label key={o.id}><input type="radio" name={t.id} checked={a.choice===o.id} onChange={()=>change({...a,choice:o.id})}/><span>{o.text}</span></label>)}</fieldset>:<>
        <div className="v3-council-tabs" role="group" aria-label="Ba phần lập luận">{['Quyết định','Căn cứ','Lý do'].map((text,n)=><button key={text} aria-pressed={a.page===n} onClick={()=>page(n)}><span>0{n+1}</span>{text}</button>)}</div>
        <fieldset className="v3-options"><legend>{['Bạn xử lý thế nào?','Dữ kiện nào làm căn cứ?','Vì sao căn cứ phù hợp?'][a.page]}</legend>
          {a.page===0?i.decisions.map(o=><label key={o.id}><input type="radio" name={`${t.id}-decision`} checked={a.decision===o.id} onChange={()=>change({...a,decision:o.id})}/><span>{o.text}</span></label>):a.page===1?i.proofOptions.filter(o=>proofAvailable(save,t,o.id)).map(o=><label key={o.id}><input type="radio" name={`${t.id}-proof`} checked={a.proof===o.id} onChange={()=>change({...a,proof:o.id})}/><span>{o.text}</span></label>):i.reasons.map(o=><label key={o.id}><input type="radio" name={`${t.id}-reason`} checked={a.reason===o.id} onChange={()=>change({...a,reason:o.id})}/><span>{o.text}</span></label>)}
        </fieldset>
        <div className="button-row">{a.page>0&&<button className="text-button" onClick={()=>page(a.page-1)}><ArrowLeft size={15}/>Quay lại</button>}{a.page<2&&<button className="button" disabled={a.page===0?!a.decision:!a.proof} onClick={()=>page(a.page+1)}>Tiếp theo<ArrowRight size={16}/></button>}</div>
      </>}
      {feedback&&!feedback.ok&&<div className="v3-feedback" role="alert"><p>{feedback.message}</p>{feedback.page!==undefined&&<button className="text-button" onClick={()=>page(feedback.page!)}>Sửa bước {feedback.page+1}</button>}</div>}
      <div className="button-row v3-submit">{(i.kind!=='council'||a.page===2)&&<button className="button" onClick={submit}>{i.kind==='council'?'Xác nhận phục dựng':'Kiểm tra quyết định'}<Check size={16}/></button>}<button className="text-button" onClick={onHelp} disabled={help===3}><Lightbulb size={16}/>Cần gợi ý?{help>0?` (${help}/3)`:''}</button></div>
      {help>0&&<aside className="v3-hints"><p>{t.hints[0]}</p>{help>1&&<p>{t.hints[1]}</p>}{help===3&&<details><summary>Xem lời giải và lý do</summary>{i.kind==='matching'||i.kind==='timeline'?<ul>{i.items.map(item=><li key={item.id}>{item.label} → {i.targets.find(v=>v.id===item.target)?.label}. {item.feedback}</li>)}</ul>:i.kind==='decision'?<p>{i.options.find(v=>v.id===i.correct)?.text}. {t.success}</p>:sample?<><p><strong>Quyết định:</strong> {i.decisions.find(v=>v.id===i.correctDecision)?.text}</p><p><strong>Căn cứ:</strong> {sample.text}</p><p><strong>Lý do:</strong> {i.reasons.find(v=>v.id===sample.reasonIds[0])?.text}</p></>:<p>Ghi nhận tài liệu của bước này để đối chiếu lời giải.</p>}<p>Mở lời giải không tự chọn hoặc nộp câu trả lời.</p></details>}</aside>}
    </>}
    {links.length>0&&<details className="v3-context"><summary>Phát hiện được dùng ở bước này ({links.length})</summary>{links.map(({link,found})=><p key={link.id}><strong>{link.relation==='supports'?'Căn cứ':'Bối cảnh'}:</strong> {found!.text}{found!.imported&&<small> · Kế thừa bản trước</small>}</p>)}</details>}
    <Source id={t.sourceId}/>
  </section>;
}
