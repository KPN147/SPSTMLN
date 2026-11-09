import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Dialog } from '../components/Dialog';
import { useAudio } from '../council/Audio';
import type { RestorationRoom } from './model';
import './celebration.css';

export function RoomRestorationCelebration({room,onContinue,onStay,returnFocusRef,presentation=false}:{
  room:RestorationRoom;onContinue:()=>void;onStay:()=>void;returnFocusRef:RefObject<HTMLElement|null>;presentation?:boolean;
}) {
  const {settings}=useAudio();
  const [systemReduced,setSystemReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [settled,setSettled]=useState(()=>settings.reducedMotion||systemReduced||document.hidden);
  const [imageFailed,setImageFailed]=useState(false);
  const nextActionRef=useRef<HTMLButtonElement>(null);
  const reduced=settings.reducedMotion||systemReduced,ready=settled||reduced||imageFailed;
  useEffect(()=>{if(ready&&!document.hidden)nextActionRef.current?.focus({preventScroll:true});},[ready]);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>setSystemReduced(media.matches);
    media.addEventListener('change',change);
    return ()=>media.removeEventListener('change',change);
  },[]);
  useEffect(()=>{
    if(settled)return;
    if(reduced||imageFailed||document.hidden){setSettled(true);return;}
    const finish=()=>setSettled(true);
    const hidden=()=>{if(document.hidden)finish();};
    const timer=window.setTimeout(finish,3000);
    document.addEventListener('visibilitychange',hidden);
    return ()=>{window.clearTimeout(timer);document.removeEventListener('visibilitychange',hidden);};
  },[settled,reduced,imageFailed]);
  return <Dialog title={`${room.shortName} đã sáng lại.`} variant="celebration" onClose={onStay} returnFocusRef={returnFocusRef}>
    <div className={`restoration-celebration ${ready?'is-ready':'is-awakening'} ${reduced?'is-reduced':''}`} style={{'--celebration-accent':room.color} as CSSProperties} data-state={ready?'ready':'awakening'}>
      <div className="celebration-controls"><span>{presentation?'THUYẾT TRÌNH':'PHỤC DỰNG'} / KHU VỰC 0{room.id}</span>{!ready&&<button className="text-button" onClick={()=>setSettled(true)}>Bỏ qua hiệu ứng</button>}</div>
      <div className={`celebration-frame ${imageFailed?'image-failed':''}`}>
        {!imageFailed&&<><img className="celebration-image-dim" src={room.background} alt="" aria-hidden="true" onError={()=>setImageFailed(true)}/><img className="celebration-image-lit" src={room.background} alt={`${room.name} được phục dựng`} onError={()=>setImageFailed(true)}/></>}
        {imageFailed?<Sparkles className="celebration-fallback" size={64} aria-hidden="true"/>:<div className="celebration-magic" aria-hidden="true"><div className="celebration-glow"/><div className="celebration-ring"/><div className="celebration-ring second"/><div className="celebration-rays">{[-32,8,46].map(angle=><i key={angle} style={{'--ray-angle':`${angle}deg`} as CSSProperties}/>)}</div><div className="celebration-particles">{Array.from({length:24},(_,n)=><i key={n} style={{'--particle-x':`${8+(n*37)%85}%`,'--particle-y':`${45+(n*13)%48}%`,'--particle-drift':`${(n%2?1:-1)*(10+n%7*5)}px`,'--particle-delay':`${1+(n%6)*.12}s`,'--particle-size':`${2+n%3}px`} as CSSProperties}/>)}</div></div>}
      </div>
      <div className="celebration-message" aria-hidden="true"><span className="eyebrow">LIÊN KẾT ĐÃ PHỤC HỒI</span><h3>{room.shortName}<br/><em>đã sáng lại.</em></h3></div>
      <div className="celebration-actions">{ready&&<><button ref={nextActionRef} className="button" onClick={onContinue}>{presentation?'Phát lại':room.id===4?'Đến Phòng Lõi':`Sang phòng ${room.id+1}`}<ArrowRight size={18}/></button><button className="button secondary" onClick={onStay}>{presentation?'Về bảng thuyết trình':'Ở lại khám phá'}</button></>}</div>
    </div>
  </Dialog>;
}
