'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

type Scene = 'dusk' | 'night';
type AtmosphereState = { scene: Scene; setScene: (scene: Scene) => void; paused: boolean; setPaused: (paused: boolean) => void; still: boolean; reduced: boolean; };
const AtmosphereContext = createContext<AtmosphereState | null>(null);

export function AtmosphereProvider({ children }: { children: ReactNode }) {
  const [scene, updateScene] = useState<Scene>('dusk');
  const [paused, updatePaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = !!useReducedMotion();
  useEffect(() => {
    updateScene(document.documentElement.dataset.scene === 'night' ? 'night' : 'dusk');
    updatePaused(document.documentElement.dataset.still === 'true');
    const visibility = () => setHidden(document.hidden);
    visibility(); document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, []);
  function setScene(next: Scene) {
    updateScene(next); document.documentElement.dataset.scene = next;
    try { localStorage.setItem('buluku-v3-scene', next); } catch { /* In-memory control still works. */ }
  }
  function setPaused(next: boolean) {
    updatePaused(next); document.documentElement.dataset.still = String(next);
    try { localStorage.setItem('buluku-v3-still', String(next)); } catch { /* In-memory control still works. */ }
  }
  return <AtmosphereContext.Provider value={{ scene, setScene, paused, setPaused, still: paused || reduced || hidden, reduced }}>{children}</AtmosphereContext.Provider>;
}

export function useAtmosphere() {
  const value = useContext(AtmosphereContext);
  if (!value) throw new Error('AtmosphereProvider is required');
  return value;
}
