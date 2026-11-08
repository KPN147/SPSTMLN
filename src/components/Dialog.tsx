import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
let openDialogCount=0;
let previousOverflow='';
function lockPageScroll(){
 if(openDialogCount===0){previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}
 openDialogCount++;
}
function unlockPageScroll(){
 openDialogCount=Math.max(0,openDialogCount-1);
 if(openDialogCount===0)document.body.style.overflow=previousOverflow;
}
export function Dialog({title,onClose,children,wide=false}:{title:string;onClose:()=>void;children:ReactNode;wide?:boolean}){
 const ref=useRef<HTMLDialogElement>(null),id=useId();
 useEffect(()=>{
  const d=ref.current!,previous=document.activeElement as HTMLElement|null;
  d.showModal();lockPageScroll();
  return ()=>{d.close();unlockPageScroll();previous?.focus();};
 },[]);
 return <dialog ref={ref} className={`dialog ${wide?'wide':''}`} aria-labelledby={id} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
  <header className="dialog-head"><h2 id={id}>{title}</h2><button className="icon-button" aria-label="Đóng cửa sổ" title="Đóng" onClick={onClose}><X aria-hidden="true"/></button></header>
  <div className="dialog-body">{children}</div>
 </dialog>;
}
