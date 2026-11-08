import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { councilReducer, loadCouncilGame, newCouncilGame, SAVE_KEY_V2 } from './engine';
import type { CouncilAction } from './engine';
import type { GameSaveV2 } from './types';

const Context = createContext<{ save: GameSaveV2; dispatch: Dispatch<CouncilAction>; notice: string; dismissNotice: () => void } | null>(null);
export function CouncilProvider({ children }: { children: ReactNode }) {
  const [loaded] = useState(() => { try { return loadCouncilGame(localStorage); } catch { return { save: newCouncilGame(), recovered: true, notice: 'Thiết bị chưa cho phép lưu. Bạn vẫn có thể chơi trong tab này.' }; } });
  const [save, rawDispatch] = useReducer(councilReducer, loaded.save);
  const allowPersist = useRef(!loaded.recovered);
  const dispatch = useCallback((action: CouncilAction) => {
    // Route entry and the opening conversation are automatic, not consent to replace a damaged save.
    if (action.type !== 'enter' && action.type !== 'talk') allowPersist.current = true;
    rawDispatch(action);
  }, []);
  const [notice, setNotice] = useState(loaded.notice);
  useEffect(() => {
    if (save === loaded.save || !allowPersist.current) return;
    try { localStorage.setItem(SAVE_KEY_V2, JSON.stringify(save)); }
    catch { setNotice('Không thể lưu trên thiết bị này. Hãy giữ tab đang mở để tiếp tục.'); }
  }, [save, loaded.save]);
  return <Context.Provider value={{ save, dispatch, notice, dismissNotice: () => setNotice('') }}>{children}</Context.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useCouncil() { const context = useContext(Context); if (!context) throw Error('Thiếu Hội đồng phục dựng'); return context; }
