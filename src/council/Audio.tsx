import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Settings } from './types';
import { musicTracks } from './music';

type Sound = 'select' | 'open' | 'collect' | 'connect' | 'reject' | 'insight' | 'chapter' | 'final';
const KEY = 'mln131-council-settings-v1';
const defaultSettings = (): Settings => ({ muted: true, music: 0.12, effects: 0.4, reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches });
const Context = createContext<{ settings: Settings; update: (v: Partial<Settings>) => void; play: (name: Sound) => void; setMood: (mood: 'explore' | 'council') => void; audioNotice: string } | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const fallback = defaultSettings();
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) ?? 'null');
      return parsed && typeof parsed.muted === 'boolean' && typeof parsed.reducedMotion === 'boolean' && Number.isFinite(parsed.music) && parsed.music >= 0 && parsed.music <= 1 && Number.isFinite(parsed.effects) && parsed.effects >= 0 && parsed.effects <= 1 ? parsed : fallback;
    } catch { return fallback; }
  });
  const [mood, setMood] = useState<'explore' | 'council'>('explore');
  const [audioNotice, setAudioNotice] = useState('');
  const music = useRef<HTMLAudioElement | null>(null);
  const musicVolume = useRef(settings.music);
  const effects = useRef<Set<HTMLAudioElement>>(new Set());
  const interaction = useRef(false);
  const play = useCallback((name: Sound) => {
    if (settings.muted || document.hidden || typeof Audio === 'undefined') return;
    const sound = new Audio(`/audio/${name}.ogg`);
    sound.volume = settings.effects;
    effects.current.add(sound);
    sound.onended = () => effects.current.delete(sound);
    sound.onerror = () => effects.current.delete(sound);
    void sound.play().catch(() => effects.current.delete(sound));
  }, [settings.muted, settings.effects]);
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(settings.reducedMotion);
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* Settings are still usable for this visit. */ }
  }, [settings]);
  useEffect(() => {
    musicVolume.current = settings.music;
    if (music.current) music.current.volume = settings.music;
  }, [settings.music]);
  useEffect(() => {
    if (typeof Audio === 'undefined') return;
    const element = new Audio();
    element.preload = 'none';
    element.loop = true;
    element.volume = musicVolume.current;
    music.current = element;
    const attempt = () => {
      if (document.hidden) effects.current.forEach(effect => effect.pause());
      if (!settings.muted && !document.hidden && interaction.current) {
        if (!element.hasAttribute('src')) element.src = musicTracks[mood].src;
        void element.play().catch(() => setAudioNotice('Chạm nút âm thanh để bắt đầu phát nhạc.'));
      }
      else element.pause();
    };
    const activate = () => { interaction.current = true; attempt(); };
    document.addEventListener('pointerdown', activate);
    document.addEventListener('keydown', activate);
    document.addEventListener('visibilitychange', attempt);
    attempt();
    const playingEffects = effects.current;
    if (settings.muted) playingEffects.forEach(e => e.pause());
    return () => { element.pause(); element.removeAttribute('src'); playingEffects.forEach(e => e.pause()); playingEffects.clear(); document.removeEventListener('pointerdown', activate); document.removeEventListener('keydown', activate); document.removeEventListener('visibilitychange', attempt); };
  }, [mood, settings.muted]);
  const update = (v: Partial<Settings>) => { interaction.current = true; setAudioNotice(''); setSettings(s => ({ ...s, ...v })); };
  return <Context.Provider value={{ settings, update, play, setMood, audioNotice }}>{children}</Context.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAudio() { const value = useContext(Context); if (!value) throw Error('Thiếu cài đặt âm thanh'); return value; }
