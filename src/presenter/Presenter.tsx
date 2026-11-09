import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clapperboard, LockKeyhole, Maximize, Minimize, Play, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../council/Audio';
import { rooms } from '../restoration/curriculum';
import { RoomRestorationCelebration } from '../restoration/RoomRestorationCelebration';
import { FinalRestorationCelebration } from '../restoration/FinalRestorationCelebration';
import { prefetchFinale } from '../restoration/finaleAssets';
import './presenter.css';

type Effect = 'room-1' | 'room-2' | 'room-3' | 'room-4' | 'finale';
type Session = { csrf: string; expiresAt: number };
class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
async function api(action: string, input?: object, csrf?: string) {
  const response = await fetch(`/api/presenter/${action}`, {
    method: action === 'session' ? 'GET' : 'POST', credentials: 'same-origin', cache: 'no-store',
    headers: { ...(input ? { 'Content-Type': 'application/json' } : {}), ...(csrf ? { 'X-Presenter-CSRF': csrf } : {}) },
    ...(input ? { body: JSON.stringify(input) } : {}),
  });
  if (response.status === 429) throw new ApiError(429, 'Bạn đã thử nhiều lần. Vui lòng chờ một phút rồi nhập lại.');
  let data; try { data = await response.json(); } catch { throw new ApiError(503, 'Máy chủ thuyết trình chưa sẵn sàng. Hãy kiểm tra cấu hình Vercel.'); }
  if (!response.ok) throw new ApiError(response.status, response.status === 429 ? 'Bạn đã thử nhiều lần. Vui lòng chờ một phút rồi nhập lại.' : data.message ?? 'Không thể mở chế độ thuyết trình.');
  return data;
}
function readSession(data: Session): Session {
  if (typeof data.csrf !== 'string' || data.csrf.length < 32 || !Number.isFinite(data.expiresAt) || data.expiresAt <= Date.now()) throw Error('Phiên không hợp lệ');
  return { csrf: data.csrf, expiresAt: data.expiresAt };
}

export default function Presenter() {
  const { settings, update, play, setMood } = useAudio();
  const [session, setSession] = useState<Session | null>(null), [checking, setChecking] = useState(true);
  const [code, setCode] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  const [active, setActive] = useState<{ effect: Effect; run: number } | null>(null), [fullscreen, setFullscreen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null), inputRef = useRef<HTMLInputElement>(null), pending = useRef(false), operation = useRef(0), run = useRef(0);
  const cards = [...rooms.map(r => ({ id: `room-${r.id}` as Effect, title: r.shortName, image: r.background, duration: '3 giây', color: r.color, label: `PHÒNG 0${r.id}` })), { id: 'finale' as const, title: 'Toàn thư viện', image: '/art/core.webp', duration: '9 giây', color: '#D9B56E', label: 'BỐN PHÒNG + PHÒNG LÕI' }];
  useEffect(() => {
    let live = true;
    void api('session').then(data => { if (live) setSession(readSession(data)); }).catch(error => { if (live && !(error instanceof ApiError && error.status === 401)) setMessage(error instanceof Error ? error.message : 'Không kết nối được máy chủ.'); }).finally(() => { if (live) setChecking(false); });
    // Invalidate pending actions on unmount; this ref is an operation counter, not a DOM ref.
    return () => { live = false; operation.current++; }; // eslint-disable-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (!checking && !session) inputRef.current?.focus(); }, [checking, session]);
  useEffect(() => { setMood('council'); return () => setMood('explore'); }, [setMood]);
  useEffect(() => {
    if (!session) return;
    const expire = () => { if (Date.now() >= session.expiresAt) { operation.current++; pending.current = false; setBusy(false); setActive(null); setSession(null); setMessage('Phiên thuyết trình đã hết hạn. Hãy nhập lại mã.'); } };
    const timer = window.setTimeout(expire, Math.max(0, session.expiresAt - Date.now()));
    document.addEventListener('visibilitychange', expire);
    prefetchFinale();
    return () => { window.clearTimeout(timer); document.removeEventListener('visibilitychange', expire); };
  }, [session]);
  useEffect(() => { const changed = () => setFullscreen(Boolean(document.fullscreenElement)); document.addEventListener('fullscreenchange', changed); return () => document.removeEventListener('fullscreenchange', changed); }, []);

  function fail(error: unknown) {
    setMessage(error instanceof ApiError ? error.message : 'Không kết nối được máy chủ. Hãy kiểm tra Internet rồi thử lại.');
    if (error instanceof ApiError && [401, 403, 503].includes(error.status)) setSession(null);
  }
  async function login(event: FormEvent) {
    event.preventDefault(); if (pending.current) return;
    pending.current = true; const id = ++operation.current, submitted = code;
    setCode(''); setBusy(true); setMessage('');
    try { const data = await api('login', { code: submitted }); if (id === operation.current) setSession(readSession(data)); }
    catch (error) { if (id === operation.current) fail(error); }
    finally { if (id === operation.current) { pending.current = false; setBusy(false); } }
  }
  async function show(effect: Effect) {
    if (!session || pending.current) return;
    pending.current = true; const id = ++operation.current;
    setActive(null); setBusy(true); setMessage('');
    try {
      const data = await api('play', { effect }, session.csrf);
      if (id !== operation.current) return;
      if (data.effect !== effect || data.expiresAt <= Date.now()) throw new ApiError(401, 'Phiên đã hết hạn. Hãy nhập lại mã.');
      setActive({ effect, run: ++run.current });
      if (effect !== 'finale') play('chapter');
    } catch (error) { if (id === operation.current) fail(error); }
    finally { if (id === operation.current) { pending.current = false; setBusy(false); } }
  }
  async function lock() {
    if (!session) return;
    const previous = session, id = ++operation.current;
    setSession(null); setActive(null); setCode(''); setBusy(true); pending.current = true; setMessage('Đang khóa phiên trên máy chủ…');
    try { await api('logout', {}, previous.csrf); if (id === operation.current) setMessage('Đã khóa bảng điều khiển.'); }
    catch { if (id === operation.current) setMessage('Bảng điều khiển đã đóng, nhưng chưa xác nhận đăng xuất do mất kết nối. Kết nối lại và khóa phiên trước khi rời máy.'); }
    finally { if (id === operation.current) { pending.current = false; setBusy(false); } }
  }
  async function toggleFullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); else setMessage('Trình duyệt này chưa hỗ trợ toàn màn hình.'); }
    catch { setMessage('Không thể mở toàn màn hình. Bạn có thể dùng phím F11 trên máy tính.'); }
  }
  return <div className="presenter-shell">
    <header className="presenter-header"><Link to="/" className="back-link"><ArrowLeft size={17}/>Mật mã ký ức</Link><span className="presenter-badge"><Clapperboard size={17}/>THUYẾT TRÌNH</span>{session && <div className="presenter-tools"><button className="icon-button" aria-label={settings.muted ? 'Bật âm thanh' : 'Tắt âm thanh'} onClick={() => update({ muted: !settings.muted })}>{settings.muted ? <VolumeX/> : <Volume2/>}</button><button className="icon-button" aria-label={fullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'} onClick={toggleFullscreen}>{fullscreen ? <Minimize/> : <Maximize/>}</button><button className="button secondary" onClick={lock}><LockKeyhole size={17}/>Khóa</button></div>}</header>
    <main id="main-content" className="presenter-main">
      {!session ? <section className="presenter-login" aria-label="Đăng nhập thuyết trình"><div className="presenter-login-emblem"><LockKeyhole size={30}/></div><p className="eyebrow">DÀNH CHO NGƯỜI THUYẾT TRÌNH</p><h1>Mở bàn<br/><em>trình diễn.</em></h1><p>Nhập mã riêng để chọn và phát lại những khoảnh khắc thư viện hồi sinh.</p>{checking ? <p role="status">Đang kiểm tra phiên…</p> : <form onSubmit={login}><label htmlFor="presenter-code">Mã truy cập</label><input ref={inputRef} id="presenter-code" type="password" value={code} onChange={e => setCode(e.target.value)} maxLength={64} autoComplete="off" autoCapitalize="characters" spellCheck={false} required disabled={busy} aria-describedby={message ? 'presenter-message' : undefined}/><button className="button" disabled={busy || !code.trim()}>{busy ? 'Đang xử lý…' : 'Mở bảng thuyết trình'}<ArrowRight size={17}/></button></form>}</section> : <>
        <div className="presenter-intro"><p className="eyebrow">CHIẾU CHO LỚP / MẬT MÃ KÝ ỨC</p><h1>Đánh thức<br/><em>những ký ức.</em></h1><p>Chọn một khoảnh khắc để trình diễn trên máy đang chiếu.</p><span className="presenter-session">Phiên mở đến {new Date(session.expiresAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span></div>
        <div className="presenter-cards">{cards.map(card => <article key={card.id} className={card.id === 'finale' ? 'presenter-card finale-card' : 'presenter-card'} style={{ '--card-accent': card.color } as CSSProperties}><img src={card.image} alt="" loading="lazy"/><div className="presenter-card-copy"><p className="eyebrow">{card.label}</p><h2>{card.title}</h2><p>{card.id === 'finale' ? 'Bốn mảnh ký ức hội tụ.' : 'Căn phòng thức tỉnh.'}<span>{card.duration}</span></p><button className="button secondary" disabled={busy} onClick={e => { triggerRef.current = e.currentTarget; void show(card.id); }} aria-label={`Trình diễn ${card.title}`}><Play size={16}/>{busy ? 'Đang mở…' : 'Trình diễn'}</button></div></article>)}</div>
        <details className="presenter-options"><summary>Âm lượng và chuyển động</summary><label>Nhạc nền<input aria-label="Âm lượng nhạc nền" type="range" min="0" max="1" step="0.05" value={settings.music} onChange={e => update({ music: Number(e.target.value) })}/></label><label>Hiệu ứng<input aria-label="Âm lượng hiệu ứng" type="range" min="0" max="1" step="0.05" value={settings.effects} onChange={e => update({ effects: Number(e.target.value) })}/></label><label><input type="checkbox" checked={settings.reducedMotion} onChange={e => update({ reducedMotion: e.target.checked })}/>Giảm chuyển động</label></details>
      </>}
      {message && <p className="presenter-message" id="presenter-message" role="status">{message}</p>}
    </main>
    {active && (active.effect === 'finale' ? <FinalRestorationCelebration key={active.run} presentation continueLabel="Phát lại" returnFocusRef={triggerRef} onContinue={() => void show('finale')} onClose={() => setActive(null)}/> : <RoomRestorationCelebration key={active.run} room={rooms[Number(active.effect.slice(-1)) - 1]} presentation returnFocusRef={triggerRef} onStay={() => setActive(null)} onContinue={() => void show(active.effect)}/>)}
  </div>;
}
