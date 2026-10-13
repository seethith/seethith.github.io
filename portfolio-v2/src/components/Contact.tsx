'use client';

import { useEffect, useRef, useState } from 'react';
import { profile } from '@/lib/content';
import { Icon } from './Icons';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.github);
      setCopied(true); setFailed(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2400);
    } catch { setFailed(true); }
  }
  return <div className="contact-actions">
    <a className="button button-primary" href={profile.github} target="_blank" rel="noopener noreferrer"><Icon name="github" width="18" height="18" />在 GitHub 找到我<Icon name="northeast" width="17" height="17" /></a>
    <button type="button" className="copy-contact" onClick={copy}><Icon name={copied ? 'check' : 'copy'} width="16" height="16" /><span aria-live="polite">{copied ? '已复制 GitHub 链接' : failed ? 'github.com/seethith' : '复制链接'}</span></button>
  </div>;
}
