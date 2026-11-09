import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SAVE_KEY_V2, parseCouncilSave } from '../council/engine';
import { coreOpen, fresh, migrate, parse, reducer, SAVE_KEY } from './engine';
import type { Action, Save } from './engine';

type Loaded={save:Save;notice:string;legacy:string|null;damaged:boolean};
function load():Loaded {
  try { const raw=localStorage.getItem(SAVE_KEY);if(raw){try{return {save:parse(raw),notice:'',legacy:null,damaged:false};}catch{return {save:fresh(),notice:'Bản lưu mới không đọc được. Chưa có dữ liệu nào bị ghi đè.',legacy:null,damaged:true};}}
    const old=localStorage.getItem(SAVE_KEY_V2);if(old){try{parseCouncilSave(old);return {save:fresh(),notice:'',legacy:old,damaged:false};}catch{return {save:fresh(),notice:'Bản lưu cũ không đọc được và vẫn được giữ riêng.',legacy:null,damaged:false};}}
    return {save:fresh(),notice:'',legacy:null,damaged:false};
  }catch{return {save:fresh(),notice:'Thiết bị chặn lưu. Bạn vẫn có thể chơi trong tab đang mở.',legacy:null,damaged:false};}
}
const Context=createContext<{save:Save;dispatch:(a:Action)=>void;notice:string}|null>(null);
export function GameProvider({children}:{children:ReactNode}) {
  const {pathname}=useLocation(),enabled=pathname!=='/demo',navigate=useNavigate();
  const [loaded,setLoaded]=useState<Loaded|null>(()=>enabled?load():null);
  const current=useRef<Loaded|null>(loaded);
  useEffect(()=>{if(enabled&&!current.current){const value=load();current.current=value;setLoaded(value);}},[enabled]);
  function commit(save:Save) {let notice=current.current?.notice??'';try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));}catch{notice='Không thể lưu trên thiết bị. Hãy giữ tab này để tiếp tục.';}const value={save,notice,legacy:null,damaged:false};current.current=value;setLoaded(value);}
  function dispatch(a:Action){if(!current.current||current.current.legacy||current.current.damaged)return;const next=reducer(current.current.save,a);if(next!==current.current.save)commit(next);}
  if(!loaded)return enabled?<main id="main-content" className="page"><p>Đang mở hồ sơ…</p></main>:children;
  const blocked=enabled&&!['/guide','/about'].includes(pathname)&&(loaded.legacy||loaded.damaged);
  return <Context.Provider value={{save:loaded.save,dispatch,notice:loaded.notice}}>{blocked?<main id="main-content" className="page narrow v3-step"><h1>Chọn hành trình của bạn</h1><p>Bản mới giữ bốn phòng và 16 mục tiêu học. Dữ liệu cũ được giữ riêng.</p><section aria-label={loaded.legacy?'Tiếp tục hay bắt đầu lại?':'Khôi phục hành trình'}>
    {loaded.legacy?<><p>Các phòng đã qua, hồ sơ, ghi chú và mục tiêu đã hoàn thành sẽ được giữ. Câu chưa nộp cần chọn lại vì tình huống đã thay đổi.</p><div className="button-row"><button className="button" onClick={()=>{const save=migrate(loaded.legacy!);commit(save);navigate(save.finalComplete?'/result':coreOpen(save)?'/final':`/room/${Object.values(save.rooms).findIndex(p=>p.completed.length<4)+1}`);}}>Tiếp tục hành trình</button><button className="button secondary" onClick={()=>{commit(fresh());navigate('/room/1');}}>Bắt đầu hành trình mới</button></div></>:<><p>{loaded.notice}</p><button className="button" onClick={()=>{commit(fresh());navigate('/room/1');}}>Bắt đầu bản lưu mới</button></>}
    <p className="muted small">Lựa chọn này chỉ ghi bản lưu V3. Bản V1/V2 được giữ nguyên.</p>
  </section></main>:children}</Context.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useGame(){const value=useContext(Context);if(!value)throw Error('Thiếu hành trình');return value;}
