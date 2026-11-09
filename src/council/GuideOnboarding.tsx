import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowRight, HelpCircle, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export const GUIDE_INTRO_KEY = 'mln131-guide-intro-v1';
const Context = createContext({ showHint: false, dismissHint: () => {} });

export function GuideOnboardingProvider({ children }: { children: ReactNode }) {
  const [showHint, setShowHint] = useState(() => {
    try { return localStorage.getItem(GUIDE_INTRO_KEY) !== 'seen'; }
    catch { return true; }
  });
  const dismissHint = useCallback(() => {
    setShowHint(false);
    try { localStorage.setItem(GUIDE_INTRO_KEY, 'seen'); }
    catch { /* The hint can still be dismissed for this visit. */ }
  }, []);
  return <Context.Provider value={{ showHint, dismissHint }}>{children}</Context.Provider>;
}

export function GuideNavItem() {
  const { showHint, dismissHint } = useContext(Context);
  const { pathname } = useLocation();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const descriptionId = useId();
  const visible = showHint && pathname !== '/guide';
  const dismissAndFocus = useCallback(() => {
    dismissHint();
    linkRef.current?.focus({ preventScroll: true });
  }, [dismissHint]);

  useEffect(() => { if (pathname === '/guide' && showHint) dismissHint(); }, [pathname, showHint, dismissHint]);
  useEffect(() => {
    if (!visible) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) dismissAndFocus();
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [visible, dismissAndFocus]);

  return <div className="guide-nav-item">
    <NavLink ref={linkRef} to="/guide" state={{ guideFrom: pathname }} onClick={dismissHint}
      aria-label="Hướng dẫn" aria-describedby={visible ? descriptionId : undefined}
      className={({ isActive }) => `${isActive ? 'active ' : ''}${visible ? 'guide-highlight' : ''}`}>
      <HelpCircle size={17} aria-hidden="true"/><span>Hướng dẫn</span>
    </NavLink>
    {visible && <aside className="guide-intro" role="region" aria-label="Gợi ý cho người mới">
      <button className="icon-button guide-intro-close" onClick={dismissAndFocus} aria-label="Đóng gợi ý hướng dẫn"><X size={18}/></button>
      <p className="eyebrow">LẦN ĐẦU CHƠI?</p>
      <h2>Bắt đầu từ Hướng dẫn</h2>
      <p id={descriptionId}>Bấm tab <strong>Hướng dẫn</strong> để xem cách chơi. Bạn cũng có thể bắt đầu ngay.</p>
      <div className="guide-intro-actions"><Link className="button" to="/guide" state={{ guideFrom: pathname }} onClick={dismissHint}>Đọc hướng dẫn<ArrowRight size={16}/></Link><button className="text-button" onClick={dismissAndFocus}>Để sau</button></div>
    </aside>}
  </div>;
}
