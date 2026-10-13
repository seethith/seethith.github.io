'use client';

import { useEffect, useRef, useState } from 'react';
import { profile } from '@/lib/content';
import { Icon } from './Icons';

export default function Contact() {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.github); setState('copied');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setState('idle'), 2500);
    } catch { setState('failed'); }
  }
  return <div className="contact-actions"><a className="button button-warm" href={profile.github} target="_blank" rel="noopener noreferrer"><Icon name="github" width="18" height="18" />在 GitHub 找到我<Icon name="northeast" width="16" height="16" /></a><button type="button" className="copy-link" onClick={copy}><Icon name={state === 'copied' ? 'check' : 'copy'} width="15" height="15" /><span aria-live="polite">{state === 'copied' ? '链接已复制' : state === 'failed' ? 'github.com/seethith' : '复制链接'}</span></button></div>;
}
