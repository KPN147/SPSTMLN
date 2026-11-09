import { useEffect, useRef, useState } from 'react';
import { useAudio } from '../council/Audio';

export function useRestorationSequence(duration: number, finale = false) {
  const { settings, play } = useAudio();
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const reduced = settings.reducedMotion || systemReduced;
  const [settled, setSettled] = useState(() => reduced || document.hidden);
  const playRef = useRef(play), played = useRef(new Set<string>());
  useEffect(() => { playRef.current = play; }, [play]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setSystemReduced(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (settled) return;
    if (reduced || document.hidden) { setSettled(true); return; }
    const hidden = () => { if (document.hidden) setSettled(true); };
    const sound = (name: 'connect' | 'final') => { if (!played.current.has(name) && !document.hidden) { played.current.add(name); playRef.current(name); } };
    const timers = [window.setTimeout(() => setSettled(true), duration)];
    if (finale) timers.push(window.setTimeout(() => sound('connect'), 3000), window.setTimeout(() => sound('final'), 5500));
    document.addEventListener('visibilitychange', hidden);
    return () => { timers.forEach(window.clearTimeout); document.removeEventListener('visibilitychange', hidden); };
  }, [duration, finale, reduced, settled]);
  return { ready: settled || reduced, reduced, settle: () => setSettled(true) };
}
