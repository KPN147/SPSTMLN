import { useEffect, useId, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
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
export function Dialog({title,onClose,children,wide=false,variant='default',returnFocusRef}:{title:string;onClose:()=>void;children:ReactNode;wide?:boolean;variant?:'default'|'celebration';returnFocusRef?:RefObject<HTMLElement|null>}){
 const ref=useRef<HTMLDialogElement>(null),id=useId();
 useEffect(()=>{
  const d=ref.current!,previous=document.activeElement as HTMLElement|null,returnTarget=returnFocusRef?.current;
  d.showModal();lockPageScroll();
  return ()=>{d.close();unlockPageScroll();const target=returnTarget??previous;if(target?.isConnected)target.focus();};
 },[returnFocusRef]);
 return <dialog ref={ref} className={`dialog ${wide?'wide':''} ${variant==='celebration'?'celebration-dialog':''}`} aria-labelledby={id} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
  <header className="dialog-head"><h2 id={id}>{title}</h2><button className="icon-button" aria-label="Đóng cửa sổ" title="Đóng" onClick={onClose}><X aria-hidden="true"/></button></header>
  <div className="dialog-body">{children}</div>
 </dialog>;
}
