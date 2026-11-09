import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import { ArrowRight, BookOpen, Compass, Cpu, Landmark, Sparkles } from 'lucide-react';
import { Dialog } from '../components/Dialog';
import { useRestorationSequence } from './useRestorationSequence';
import { finaleAssets as assets } from './finaleAssets';
import './celebration.css';
import './finale.css';

const memories = [
  { title: 'Khởi nguyên', color: '#D9B56E', icon: BookOpen, x: 23, y: 27 },
  { title: 'Sứ mệnh', color: '#8EBBD9', icon: Cpu, x: 77, y: 27 },
  { title: 'Chuyển mình', color: '#65D5C9', icon: Compass, x: 23, y: 65 },
  { title: 'Quyền làm chủ', color: '#B6A1E0', icon: Landmark, x: 77, y: 65 },
];

export function FinalRestorationCelebration({ onContinue, onClose, returnFocusRef, presentation = false, continueLabel = 'Xem kết quả' }: {
  onContinue: () => void; onClose: () => void; returnFocusRef: RefObject<HTMLElement | null>; presentation?: boolean; continueLabel?: string;
}) {
  const { ready, reduced, settle } = useRestorationSequence(9000, true);
  const [loaded, setLoaded] = useState<string[]>([]), [fallback, setFallback] = useState(false), [failed, setFailed] = useState(false);
  const actionRef = useRef<HTMLButtonElement>(null);
  const allLoaded = loaded.length === assets.length;
  useEffect(() => { if (ready && !document.hidden) actionRef.current?.focus({ preventScroll: true }); }, [ready]);
  useEffect(() => { if (allLoaded || fallback) return; const timer = window.setTimeout(() => setFallback(true), 1000); return () => window.clearTimeout(timer); }, [allLoaded, fallback]);
  return <Dialog title="Bạn đã hoàn thành hành trình" onClose={onClose} variant="celebration" returnFocusRef={returnFocusRef}>
    <div className={`finale ${ready ? 'is-ready' : 'is-awakening'} ${reduced ? 'is-reduced' : ''}`} data-state={ready ? 'ready' : 'awakening'}>
      <div className="celebration-controls"><span>{presentation ? 'THUYẾT TRÌNH / CẢNH KẾT' : 'HỒ SƠ 2126 / HOÀN THÀNH'}</span>{!ready && <button className="text-button" onClick={settle}>Bỏ qua hiệu ứng</button>}</div>
      <div className={`finale-stage ${fallback ? 'uses-fallback' : ''} ${failed ? 'image-failed' : ''}`}>
        <div className="finale-camera">
          <img className="finale-hall" src={assets[0]} alt="Đại sảnh thư viện được phục dựng" onLoad={() => setLoaded(v => v.includes(assets[0]) ? v : [...v, assets[0]])} onError={() => setFallback(true)}/>
          <img className="finale-core" src={assets[1]} alt="" aria-hidden="true" onLoad={() => setLoaded(v => v.includes(assets[1]) ? v : [...v, assets[1]])} onError={() => setFallback(true)}/>
          <img className="finale-team" src={assets[2]} alt="An, Minh, Vy và Khôi bên thư viện đã hồi sinh" onLoad={() => setLoaded(v => v.includes(assets[2]) ? v : [...v, assets[2]])} onError={() => setFallback(true)}/>
          {fallback && !failed && <img className="finale-fallback" src="/art/core.webp" alt="Thư viện đã sáng lại" onError={() => setFailed(true)}/>}
        </div>
        {failed && <Sparkles className="finale-error-icon" size={72} aria-hidden="true"/>}
        <div className="finale-magic" aria-hidden="true">
          <svg className="finale-connections" viewBox="0 0 1000 562" preserveAspectRatio="none">{memories.map((m, n) => <path key={m.title} pathLength="1" d={`M ${m.x * 10} ${m.y * 5.62} Q 500 ${n < 2 ? 70 : 530} 500 275`} style={{ '--memory-color': m.color, '--order': n } as CSSProperties}/>)}</svg>
          {memories.map((m, n) => <div key={m.title} className="finale-memory" style={{ '--memory-color': m.color, '--memory-x': `${m.x}%`, '--memory-y': `${m.y}%`, '--order': n } as CSSProperties}><m.icon size={25}/><span>{m.title}</span></div>)}
          <div className="finale-orbit"/><div className="finale-orbit second"/><div className="finale-bloom"/><div className="finale-wave"/>
          <div className="finale-particles">{Array.from({ length: 60 }, (_, n) => <i key={n} style={{ '--x': `${4 + n * 31 % 93}%`, '--y': `${25 + n * 17 % 70}%`, '--delay': `${4.7 + n % 12 * .15}s`, '--drift': `${(n % 2 ? 1 : -1) * (10 + n % 8 * 6)}px`, '--size': `${2 + n % 3}px` } as CSSProperties}/>)}</div>
        </div>
        <div className="finale-vignette"/>
      </div>
      <div className="finale-message"><p className="eyebrow">BỐN GÓC NHÌN · MỘT KÝ ỨC TRỌN VẸN</p><h3>Thư viện <em>đã thức tỉnh.</em></h3><p>Bạn đã hoàn thành hành trình.</p><div className="finale-stats"><span><strong>4/4</strong> khu vực</span><span><strong>4/4</strong> phần Phòng Lõi</span><span><strong>16/16</strong> mục tiêu</span></div></div>
      <div className="celebration-actions">{ready && <><button ref={actionRef} className="button" onClick={onContinue}>{continueLabel}<ArrowRight size={18}/></button>{presentation && <button className="button secondary" onClick={onClose}>Về bảng thuyết trình</button>}</>}</div>
    </div>
  </Dialog>;
}
