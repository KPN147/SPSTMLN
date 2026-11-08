import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { emptySave, gameReducer, loadGame, SAVE_KEY, saveGame } from '../game/engine';
import type { Action } from '../game/engine';
import type { GameSaveV1 } from '../game/types';
const Context=createContext<{save:GameSaveV1;dispatch:Dispatch<Action>;notice:string;dismissNotice:()=>void}|null>(null);
export function GameProvider({children}:{children:ReactNode}){
 const [loaded]=useState(()=>{try{return loadGame(window.localStorage);}catch{return {save:emptySave(),notice:'Trình duyệt chưa cho phép lưu tiến độ. Bạn vẫn có thể chơi trong tab này.'};}});
 const [save,dispatch]=useReducer(gameReducer,loaded.save);
 const [notice,setNotice]=useState(loaded.notice);
 useEffect(()=>{
  try{
   const fresh=!save.introSeen&&!save.completedPuzzleIds.length&&!Object.keys(save.revealedHints).length;
   if(fresh){localStorage.removeItem(SAVE_KEY);return;}
   if(!saveGame(localStorage,save))setNotice('Không thể lưu trên thiết bị này. Hãy giữ tab đang mở để tiếp tục chơi.');
  }catch{setNotice('Không thể lưu trên thiết bị này. Hãy giữ tab đang mở để tiếp tục chơi.');}
 },[save]);
 return <Context.Provider value={{save,dispatch,notice,dismissNotice:()=>setNotice('')}}>{children}</Context.Provider>;
}
// The isolated demo deliberately never mounts this provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useGame(){const c=useContext(Context);if(!c)throw Error('Thiếu ngữ cảnh trò chơi');return c;}
