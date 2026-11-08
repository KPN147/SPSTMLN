import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronDown, Fingerprint, Lightbulb, Link2, LockKeyhole, MessageCircle, Play, Plus, X } from 'lucide-react';
import { characters, character, chapters, dialogue, knowledge } from './content';
import { requirementsMet, unlocked, validInvestigation } from './engine';
import { useCouncil } from './GameStore';
import { useAudio } from './Audio';
import { EvidenceArt, Portrait, RoleIcon } from './Visuals';
import type { ChapterProgress, CouncilCase, CouncilDraft, Evidence, Investigation, Verdict } from './types';
import type { RoomId } from '../game/types';

export function AcademicSource({ id }: { id: string }) {
  const p = knowledge(id), pages = p.source.printedPages;
  const groups: string[] = [];
  for (let i = 0; i < pages.length; i++) { const first = pages[i]; let last = first; while (pages[i + 1] === last + 1) last = pages[++i]; groups.push(first === last ? `${first}` : `${first}–${last}`); }
  return <div className="academic-source"><BookOpen size={15}/><span>Giáo trình Chủ nghĩa xã hội khoa học (2021) · Chương {p.roomId} · tr. {groups.join(', ')}<small>{p.source.sourceReviewStatus === 'verified' ? 'Đã đối chiếu và xác nhận.' : 'Diễn giải đang chờ duyệt đối chiếu nguồn.'}</small></span></div>;
}
export function EvidenceBody({ evidence: e }: { evidence: Evidence }) {
  return <><span className={`type-tag ${e.fiction ? 'fiction' : ''}`}>{e.fiction ? 'TƯ LIỆU HƯ CẤU' : 'DIỄN GIẢI TỪ GIÁO TRÌNH'}{e.kind === 'story' ? ' · TRUYỆN PHỤ' : e.kind === 'support' ? ' · ĐỐI CHIẾU THÊM' : ''}</span><p className="document-text">{e.body}</p>{e.sourceId && <AcademicSource id={e.sourceId}/>} {e.relatedSources?.map(id => <AcademicSource key={id} id={id}/>)}{e.chapterId === 4 && !e.fiction && <small className="muted">Tình huống trong game do nhóm xây dựng để minh họa, không phải ví dụ nguyên văn của giáo trình.</small>}</>;
}
export function KnowledgeCard({ id }: { id: string }) {
  const p = knowledge(id);
  return <article className="knowledge-card"><span className="eyebrow">KIẾN THỨC ĐƯỢC NỐI LẠI</span><h3>{p.title}</h3><ul>{p.keyTakeaways.map(t => <li key={t}>{t}</li>)}</ul><details><summary>Đọc giải thích đầy đủ<ChevronDown size={14}/></summary><p>{p.explanation}</p></details><AcademicSource id={id}/></article>;
}
export function Inspector({ evidence: e, onClose, afterCollect }: { evidence: Evidence; onClose: () => void; afterCollect?: () => void }) {
  const { save, dispatch } = useCouncil(), { play } = useAudio();
  const p = save.chapters[e.chapterId], found = p.discovered.includes(e.id);
  const role = character(e.role);
  function collect() { dispatch({ type: 'role', role: e.role }); dispatch({ type: 'collect', chapter: e.chapterId, id: e.id }); play(e.kind === 'story' ? 'insight' : 'collect'); afterCollect?.(); }
  return <section className="inspector" aria-label={`Kiểm tra ${e.title}`}><header><span className="eyebrow">ĐIỂM KHÁM PHÁ / {String(e.index + 1).padStart(2, '0')}</span><button className="icon-button" aria-label="Đóng kiểm tra đồ vật" onClick={onClose}><X size={17}/></button></header><EvidenceArt evidence={e} className="inspector-art"/><h2>{e.title}</h2><EvidenceBody evidence={e}/>{found ? <><p className="found-message"><Check size={16}/>Đã đưa vào Sổ chung</p>{e.kind !== 'story' && <button className="button secondary" onClick={() => { dispatch({ type: 'talk', chapter: e.chapterId, id: `${e.id}-found` }); play('open'); }}><MessageCircle size={16}/>Trao đổi về chứng cứ</button>}</> : <button className="button" onClick={collect}><RoleIcon role={e.role}/>{role.name}: {e.role === 'an' ? 'Đối chiếu & lưu' : e.role === 'minh' ? 'Kiểm tra & trích xuất' : 'Điều tra & ghi nhận'}<Plus size={16}/></button>}<small className="ability-note">{role.ability} · Thao tác tự chuyển sang {role.name}.</small></section>;
}

export function DialogueBox({ chapterId }: { chapterId: RoomId }) {
  const { save, dispatch } = useCouncil(), { play } = useAudio();
  const p = save.chapters[chapterId], node = p.dialogue ? dialogue(p.dialogue) : undefined;
  if (!node) return null;
  const speaker = character(node.speaker);
  const route = p.flags.includes(`c${chapterId}-system`) ? 'Kiểm tra hệ thống' : p.flags.includes(`c${chapterId}-documents`) ? 'Đối chiếu tài liệu' : '';
  return <section className="dialogue-box" aria-label="Đối thoại hội đồng"><Portrait role={node.speaker} emotion={node.emotion}/><div className="dialogue-content"><header><strong>{speaker.name}</strong><span>{speaker.role}</span>{route && <small className="approach-tag">{route}</small>}<button className="icon-button" aria-label="Tạm đóng hội thoại" onClick={() => dispatch({ type: 'talk', chapter: chapterId, id: null })}><X size={16}/></button></header><p aria-live="polite">{node.text.replace(/^(An|Minh|Vy|Khôi): /, '')}{node.id.endsWith('-approach') && p.flags.includes(`c${chapterId}-system`) ? ' Hướng kiểm tra: bắt đầu ở điểm 02; nhật ký sẽ mở kho đối chiếu trước.' : node.id.endsWith('-approach') && p.flags.includes(`c${chapterId}-documents`) ? ' Hướng tài liệu: bắt đầu ở điểm 01 và 03; hồ sơ xuất xứ sẽ mở một góc nhìn đối chiếu.' : ''}</p><div className="dialogue-choices">{node.choices.map(choice => <button key={choice.id} disabled={!requirementsMet(p, choice.requires ?? [])} onClick={() => { dispatch({ type: 'choose', chapter: chapterId, choice: choice.id }); play(choice.id === 'compare' ? 'connect' : 'select'); }}><span aria-hidden="true">↳</span>{choice.label}{!requirementsMet(p, choice.requires ?? []) && <small> Cần chứng cứ trước</small>}</button>)}<button className="text-button" onClick={() => dispatch({ type: 'talk', chapter: chapterId, id: null })}>{node.choices.length ? 'Tiếp tục điều tra' : 'Đã hiểu, tiếp tục'}<ArrowRight size={14}/></button></div></div></section>;
}

export function InvestigationPanel({ task: t }: { task: Investigation }) {
  const { save, dispatch } = useCouncil(), { play } = useAudio();
  const p = save.chapters[t.chapterId], done = p.completed.includes(t.id), available = requirementsMet(p, t.requires);
  const answer = p.answers[t.id] ?? {};
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const hint = p.hints[t.id] ?? 0;
  function assign(target: string) {
    if (!selected) return;
    dispatch({ type: 'role', role: t.role }); dispatch({ type: 'answer', chapter: t.chapterId, id: t.id, item: selected, target }); setSelected(null); setFeedback(''); play('connect');
  }
  function submit() {
    if (validInvestigation(t.id, answer)) { dispatch({ type: 'role', role: t.role }); dispatch({ type: 'solve', chapter: t.chapterId, id: t.id }); play('insight'); setFeedback(''); }
    else { setFeedback('Bản phục dựng còn mâu thuẫn với hồ sơ. Đối chiếu lại các thẻ đã gắn; bạn có thể sửa từng vị trí mà không mất chứng cứ.'); play('reject'); }
  }
  return <section className={`investigation-panel task-${t.type}`} aria-label={t.title}><header className="section-heading"><span className="step-medallion">{done ? <Check size={19}/> : <RoleIcon role={t.role} size={20}/>}</span><div><p className="eyebrow">KIỂM CHỨNG / {character(t.role).name.toUpperCase()}</p><h3>{t.title}</h3></div>{done && <span className="type-tag">ĐÃ KIỂM CHỨNG</span>}</header>
    {!available ? <p className="locked-note"><LockKeyhole size={17}/>Cần tìm: {t.requires.map(id => chapters.find(c => c.id === t.chapterId)!.evidence.find(e => e.id === id)!.title).join(' · ')}</p> : done ? <><p className="task-success"><Check size={18}/>{t.success}</p><details><summary>Kiến thức & nguồn đã mở<ChevronDown size={15}/></summary><KnowledgeCard id={t.objectiveId}/></details></> : <><p>{t.prompt}</p><p className="interaction-tip">Chọn một dữ kiện, sau đó chọn {t.type === 'timeline' ? 'mốc thời gian' : t.type === 'circuit' ? 'đầu nối' : t.type === 'flow' ? 'tuyến' : 'vị trí'} để gắn. Chọn lại dữ kiện để sửa.</p>
    <div className="repair-workbench"><div className="repair-items" role="group" aria-label="Dữ kiện cần phục dựng">{t.items.map(i => <button className={`repair-item ${selected === i.id ? 'selected' : ''} ${answer[i.id] ? 'placed' : ''}`} key={i.id} aria-pressed={selected === i.id} onClick={() => { setSelected(i.id); play('select'); }}><span className="item-pin" aria-hidden="true">{answer[i.id] ? <Link2 size={14}/> : <Fingerprint size={15}/>}</span><span>{i.label}{answer[i.id] && <small>↳ {t.targets.find(target => target.id === answer[i.id])?.label}</small>}</span></button>)}</div>
    <div className="repair-targets" role="group" aria-label="Vị trí phục dựng">{t.targets.map((target, i) => <button key={target.id} disabled={!selected} className="repair-target" onClick={() => assign(target.id)}><span className="target-marker">{t.type === 'timeline' ? target.label : String(i + 1).padStart(2, '0')}</span><span>{t.type !== 'timeline' && target.label}<small>{t.items.filter(item => answer[item.id] === target.id).length} dữ kiện đã gắn</small></span><Plus size={16}/></button>)}</div></div>
    {feedback && <p className="feedback error" role="alert">{feedback}</p>}<div className="button-row"><button className="button" onClick={submit}><Play size={16}/>{t.type === 'circuit' ? 'Chạy thử hệ thống' : t.type === 'timeline' ? 'Khởi động đồng hồ' : 'Kiểm tra bản phục dựng'}</button><button className="text-button" disabled={hint === 2} onClick={() => dispatch({ type: 'hint', chapter: t.chapterId, id: t.id })}><Lightbulb size={16}/>Gợi ý {Math.min(2, hint + 1)}/2</button></div>{hint > 0 && <aside className="hints">{t.hints.slice(0, hint).map((h, i) => <p key={h}><strong>Gợi ý {i + 1}.</strong> {h}</p>)}<small>Gợi ý không làm mất tiến độ.</small></aside>}</>}
  </section>;
}

export function CouncilPanel({ definition: c, draft, cards, onChange, onSubmit, feedback, resolved = false }: { definition: CouncilCase; draft: CouncilDraft; cards: Evidence[]; onChange: (draft: CouncilDraft) => void; onSubmit: () => void; feedback: Verdict | null; resolved?: boolean }) {
  const { play } = useAudio();
  const [peek, setPeek] = useState<string | null>(null);
  function toggle(id: string) { onChange({ ...draft, evidence: draft.evidence.includes(id) ? draft.evidence.filter(e => e !== id) : [...draft.evidence, id] }); play('connect'); }
  return <section className="council-panel" aria-label={c.title}><div className="council-art"><img src="/art/council.webp" alt="Bàn họp của bốn thành viên hội đồng" loading="lazy"/><div className="council-members">{characters.map(person => <span className={feedback?.speaker === person.id ? 'speaking' : ''} key={person.id}><Portrait role={person.id} emotion={resolved ? 'agree' : feedback?.speaker === person.id ? 'doubt' : 'thinking'}/><strong>{person.name}</strong></span>)}</div></div><div className="council-content"><span className="eyebrow">PHIÊN HỘI ĐỒNG / HỒ SƠ {c.chapterId}</span><h2>{c.title}</h2><blockquote className="broken-report"><small>BẢN GHI CẦN KIỂM CHỨNG · CÓ NHẬN ĐỊNH SAI</small>{c.report}</blockquote>
    <fieldset disabled={resolved}><legend><span>01</span>Kết luận của hội đồng</legend>{c.conclusions.map(o => <label key={o.id} className={`council-option ${draft.conclusion === o.id ? 'chosen' : ''}`}><input type="radio" name={`${c.id}-conclusion`} checked={draft.conclusion === o.id} onChange={() => onChange({ ...draft, conclusion: o.id })}/><span>{o.text}</span></label>)}</fieldset>
    <fieldset disabled={resolved}><legend><span>02</span>Chứng cứ hỗ trợ</legend><p className="muted">Gắn những thẻ cần thiết và liên quan. Thẻ được tìm thấy chưa chắc đã chứng minh kết luận này.</p><div className="council-evidence">{cards.map(e => <article key={e.id} className={draft.evidence.includes(e.id) ? 'attached' : ''}><label><input type="checkbox" checked={draft.evidence.includes(e.id)} onChange={() => toggle(e.id)}/><EvidenceArt evidence={e}/><span>{e.title}<small>{e.fiction ? 'Nhật ký hư cấu' : 'Có nguồn giáo trình'}</small></span></label><button type="button" className="text-button" aria-expanded={peek === e.id} onClick={() => setPeek(peek === e.id ? null : e.id)}>Đọc chứng cứ<ChevronDown size={13}/></button>{peek === e.id && <div className="peek-evidence"><EvidenceBody evidence={e}/></div>}</article>)}</div>{cards.length === 0 && <p className="locked-note">Chưa có chứng cứ. Hãy quay lại cảnh để khám phá.</p>}</fieldset>
    <fieldset disabled={resolved}><legend><span>03</span>Phương án phục dựng</legend>{c.repairs.map(o => <label key={o.id} className={`council-option ${draft.repair === o.id ? 'chosen' : ''}`}><input type="radio" name={`${c.id}-repair`} checked={draft.repair === o.id} onChange={() => onChange({ ...draft, repair: o.id })}/><span>{o.text}</span></label>)}</fieldset>
    {feedback && <div className={`council-rebuttal ${feedback.ok ? 'success' : ''}`} role={feedback.ok ? 'status' : 'alert'}><Portrait role={feedback.speaker} emotion={feedback.ok ? 'agree' : 'doubt'}/><p><strong>{character(feedback.speaker).name}</strong>{feedback.message}</p></div>}<button className="button" disabled={resolved} onClick={onSubmit}>{resolved ? <Check size={17}/> : <MessageCircle size={17}/>} {resolved ? 'Đã xác nhận phục dựng' : 'Đề xuất với hội đồng'}<ArrowRight size={16}/></button><p className="muted small">Lựa chọn tự lưu. Bạn có thể quay lại điều tra và sửa lập luận.</p></div></section>;
}

type NotebookState = { tab: 'evidence' | 'hypotheses' | 'knowledge'; chapter: RoomId; scroll: number };
function readNotebook(): NotebookState { try { const s = JSON.parse(sessionStorage.getItem('council-notebook-ui') ?? 'null'); if (s && ['evidence', 'hypotheses', 'knowledge'].includes(s.tab) && [1, 2, 3, 4].includes(s.chapter) && Number.isFinite(s.scroll)) return s; } catch { /* Optional preference. */ } return { tab: 'evidence', chapter: 1, scroll: 0 }; }
export function Notebook() {
  const { save, dispatch } = useCouncil();
  const [ui, setUI] = useState(readNotebook);
  const ref = useRef<HTMLDivElement>(null);
  const p = save.chapters[ui.chapter], c = chapters.find(c => c.id === ui.chapter)!;
  useEffect(() => { if (ref.current) ref.current.scrollTop = ui.scroll; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { try { sessionStorage.setItem('council-notebook-ui', JSON.stringify(ui)); } catch { /* Optional preference. */ } }, [ui]);
  return <div className="notebook"><p className="muted">Chứng cứ được chia sẻ giữa bốn thành viên. Phần giải thích mở sau khi đã kiểm chứng.</p><div className="notebook-tabs" role="group" aria-label="Phần Sổ chung">{([['evidence', 'Chứng cứ'], ['hypotheses', 'Giả thuyết'], ['knowledge', 'Kiến thức']] as const).map(([tab, label]) => <button key={tab} aria-pressed={ui.tab === tab} onClick={() => setUI(s => ({ ...s, tab, scroll: 0 }))}>{label}</button>)}</div><div className="chapter-tabs" role="group" aria-label="Chọn chương Sổ chung">{chapters.map(c => <button key={c.id} aria-pressed={ui.chapter === c.id} onClick={() => { setUI(s => ({ ...s, chapter: c.id, scroll: 0 })); if (ref.current) ref.current.scrollTop = 0; }}>{String(c.id).padStart(2, '0')}<span>{c.shortName}</span></button>)}</div><div className="notebook-pages" ref={ref} onScroll={e => { const scroll = e.currentTarget.scrollTop; setUI(s => ({ ...s, scroll })); }}>
    {ui.tab === 'evidence' && <div className="notebook-evidence">{c.evidence.map(e => p.discovered.includes(e.id) ? <details key={e.id}><summary><EvidenceArt evidence={e}/><span>{e.title}<small>{e.kind === 'story' ? 'Ký ức nhóm lưu trữ' : e.fiction ? 'Nhật ký hư cấu' : 'Tài liệu đối chiếu'}</small></span><ChevronDown size={15}/></summary><div><EvidenceBody evidence={e}/></div></details> : <article className="unfound-evidence" key={e.id}><LockKeyhole size={17}/><span>{e.kind === 'story' ? 'Một ký ức chưa tìm thấy' : 'Hồ sơ chưa khám phá'}</span></article>)}</div>}
    {ui.tab === 'hypotheses' && <><h3>{c.question}</h3><label className="note-label" htmlFor="hypothesis">Ghi chú của hội đồng · không chấm điểm</label><textarea id="hypothesis" disabled={!unlocked(save, c.id)} value={p.hypothesis} maxLength={1000} placeholder="Điều đã biết… Điều cần kiểm chứng…" onChange={e => dispatch({ type: 'hypothesis', chapter: c.id, text: e.target.value })}/><h4>Những hồ sơ đã đặt cạnh nhau</h4>{p.flags.filter(f => f.endsWith('-compared')).map(flag => { const e = c.evidence.find(e => e.id === flag.replace('-compared', ''))!; const other = c.evidence[e.index === 0 ? 1 : 0]; return <div key={flag} className="evidence-connection"><EvidenceArt evidence={e}/><span>{e.title}</span><Link2 size={17}/><EvidenceArt evidence={other}/><span>{other.title}</span></div>; })}<h4>Những điều đã kiểm chứng</h4>{c.investigations.map(t => <p key={t.id} className="hypothesis-step">{p.completed.includes(t.id) ? <Check size={16}/> : <Fingerprint size={16}/>} {t.title}</p>)}{p.restored && <p className="task-success">{c.council.success}</p>}<details><summary>Xem lại những trao đổi đã mở<ChevronDown size={14}/></summary>{p.dialogueHistory.map(id => { const d = dialogue(id); return d ? <p key={id}><strong>{character(d.speaker).name}:</strong> {d.text}</p> : null; })}</details></>}
    {ui.tab === 'knowledge' && <>{c.investigations.map(t => p.completed.includes(t.id) ? <KnowledgeCard id={t.objectiveId} key={t.id}/> : <article className="unfound-evidence" key={t.id}><LockKeyhole size={16}/><span>{knowledge(t.objectiveId).title}<small>Hoàn thành bước kiểm chứng để mở giải thích.</small></span></article>)}{p.restored ? <KnowledgeCard id={`r${c.id}-p4`}/> : <article className="unfound-evidence"><LockKeyhole size={16}/><span>Kết luận tổng hợp mở sau phiên hội đồng.</span></article>}</>}
  </div></div>;
}

export function DiscoveryToast({ evidence }: { evidence: Evidence }) { return <span className="discovery-toast"><EvidenceArt evidence={evidence}/><span><small>ĐÃ NỐI VÀO SỔ CHUNG</small><strong>{evidence.title}</strong></span><Check size={19}/></span>; }

export function TaskList({ progress, tasks, active, onSelect }: { progress: ChapterProgress; tasks: Investigation[]; active: string | null; onSelect: (id: string) => void }) {
  return <div className="task-tabs" role="group" aria-label="Các bước kiểm chứng">{tasks.map((t, i) => <button className={active === t.id ? 'selected' : ''} aria-pressed={active === t.id} key={t.id} onClick={() => onSelect(t.id)}><span>{progress.completed.includes(t.id) ? <Check size={15}/> : String(i + 1).padStart(2, '0')}</span><strong>{t.title}</strong><RoleIcon role={t.role} size={15}/></button>)}</div>;
}
