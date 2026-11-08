import type { CSSProperties } from 'react';
import { BookOpen, Check, Fingerprint, Lightbulb, MessageCircle, Settings2, Users } from 'lucide-react';
import { characters, character } from './content';
import { requirementsMet } from './engine';
import type { Chapter, ChapterProgress, Emotion, Evidence, RoleId } from './types';

export function Portrait({ role, emotion = 'neutral', className = '' }: { role: RoleId; emotion?: Emotion; className?: string }) {
  const index = ['neutral', 'thinking', 'doubt', 'agree', 'surprise'].indexOf(emotion);
  return <span role="img" aria-label={`${character(role).name} — ${({ neutral: 'bình tĩnh', thinking: 'suy nghĩ', doubt: 'nghi ngờ', agree: 'đồng tình', surprise: 'bất ngờ' })[emotion]}`} className={`portrait ${className}`} style={{ '--portrait': `url("/art/portrait-${role}.webp")`, '--px': `${(index % 3) * 50}%`, '--py': index > 2 ? '100%' : '0%', '--role': character(role).color } as CSSProperties} />;
}
export function RoleIcon({ role, size = 18 }: { role: RoleId; size?: number }) {
  const Icon = ({ an: BookOpen, minh: Settings2, vy: Fingerprint, khoi: Users })[role];
  return <Icon size={size} aria-hidden="true" />;
}
export function RoleBar({ active, onSelect, compact = false }: { active: RoleId; onSelect: (role: RoleId) => void; compact?: boolean }) {
  return <div className={`role-bar ${compact ? 'compact' : ''}`} role="group" aria-label="Chuyển nhân vật">{characters.map(c => <button key={c.id} className={`role-choice ${c.id === active ? 'active' : ''}`} style={{ '--role': c.color } as CSSProperties} aria-pressed={c.id === active} onClick={() => onSelect(c.id)}><Portrait role={c.id}/><span><strong>{c.name}</strong><small><RoleIcon role={c.id} size={12}/>{c.role}</small></span><span className="role-ability">{c.ability}</span></button>)}</div>;
}
export function EvidenceArt({ evidence, className = '' }: { evidence: Evidence; className?: string }) {
  const i = evidence.index;
  return <span aria-hidden="true" className={`evidence-art ${className}`} style={{ '--evidence-y': `${i > 3 ? 100 : 0}%`, backgroundImage: `url('/art/evidence-${evidence.chapterId}.webp')`, backgroundPosition: `${(i % 4) * 100 / 3}% ${i > 3 ? 100 : 0}%` } as CSSProperties} />;
}
const coordinates: [number, number][] = [[18, 49], [35, 68], [66, 48], [84, 31], [15, 78], [85, 73]];
export function Scene({ chapter: c, progress: p, selected, onInspect, onCouncil }: { chapter: Chapter; progress: ChapterProgress; selected: string | null; onInspect: (id: string) => void; onCouncil: () => void }) {
  return <div className={`investigation-scene ${p.restored ? 'restored' : ''}`} style={{ '--accent': c.color, '--restoration': `${p.completed.length / 3}` } as CSSProperties}>
    <img className="scene-painting" src={c.background} alt={`Minh họa ${c.name}: kiến trúc thư viện cổ kết hợp thiết bị tương lai`} fetchPriority="high"/>
    <div className="scene-shade"/>
    <span className="scene-location"><span className="live-dot"/>{p.restored ? 'LIÊN KẾT ĐÃ PHỤC HỒI' : p.flags.includes(`c${c.id}-tested`) ? 'BẢN THỬ ĐÃ KIỂM TRA · CHỜ HỘI ĐỒNG' : 'TÍN HIỆU NGỮ CẢNH · GIÁN ĐOẠN'}</span>
    <svg className="scene-projection" viewBox="0 0 1000 560" aria-hidden="true"><g className={`projection-ring ${p.completed.length ? 'powered' : ''}`}><ellipse cx="500" cy="310" rx="100" ry="34"/><ellipse cx="500" cy="310" rx="85" ry="28"/><path d="M415 310v-60m170 60v-60M440 310v-80m120 80v-80M470 310v-110m60 110v-110"/></g><g className="scene-gears"><circle cx="790" cy="240" r="30"/><circle cx="790" cy="240" r="20" strokeDasharray="4 7"/><path d="M790 204v72m-36-36h72"/></g>{p.completed.length > 0 && <path className="powered-path" d="M180 270Q320 150 500 310T840 170"/>}</svg>
    {c.evidence.slice(0, 6).map((e, i) => {
      const available = requirementsMet(p, e.requires), found = p.discovered.includes(e.id);
      return <button key={e.id} className={`scene-hotspot ${available ? 'available' : 'locked'} ${found ? 'found' : ''} ${selected === e.id ? 'selected' : ''}`} style={{ left: `${coordinates[i][0]}%`, top: `${coordinates[i][1]}%` }} aria-label={`${i + 1}. ${c.hotspotNames[i]}${found ? ' — đã tìm' : available ? '' : ' — chưa mở'}`} aria-disabled={!available} onClick={() => onInspect(e.id)}><span className="hotspot-number">{found ? <Check size={16}/> : available ? String(i + 1).padStart(2, '0') : <span aria-hidden="true">◇</span>}</span><span className="hotspot-name">{c.hotspotNames[i]}</span></button>;
    })}
    <button className="scene-council" onClick={onCouncil}><Users size={16}/><span>Bàn hội đồng</span><span aria-hidden="true">↗</span></button>
    <span className="scene-mark">THƯ VIỆN 2126 / KHU VỰC 0{c.id}</span>
    {p.restored && <div className="restoration-rays" aria-hidden="true"/>}
  </div>;
}
export function SceneList({ chapter: c, progress: p, onInspect }: { chapter: Chapter; progress: ChapterProgress; onInspect: (id: string) => void }) {
  return <details className="scene-list"><summary><Lightbulb size={15}/>Các điểm khám phá · dùng chuột, chạm hoặc bàn phím</summary><div>{c.evidence.slice(0, 6).map((e, i) => <button key={e.id} onClick={() => onInspect(e.id)} aria-disabled={!requirementsMet(p, e.requires)}><span>{String(i + 1).padStart(2, '0')}</span>{c.hotspotNames[i]}<small>{p.discovered.includes(e.id) ? 'Đã tìm' : requirementsMet(p, e.requires) ? character(e.role).name : 'Cần phát hiện trước'}</small></button>)}</div></details>;
}
export function EmptyInspector() { return <div className="empty-inspector"><Fingerprint size={34}/><h3>Mỗi dấu vết,<br/>một góc nhìn.</h3><p>Chọn một đồ vật trong cảnh để kiểm tra. Các thành viên có thể khám phá những phần khác nhau của cùng hồ sơ.</p><span><MessageCircle size={14}/>Chứng cứ được chia sẻ trong Sổ chung.</span></div>; }
