'use client';

import { useEffect, useRef, useState } from 'react';
import { useAtmosphere } from './Atmosphere';
import { Icon } from './Icons';

const links = [{ id: 'about', name: '关于' }, { id: 'projects', name: '作品' }, { id: 'research', name: '研究' }, { id: 'skills', name: '技能' }];

export default function Header() {
  const { scene, setScene } = useAtmosphere();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); root.current?.querySelector<HTMLButtonElement>('.menu-toggle')?.focus(); }
    };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <header ref={root} className="site-header" data-scrolled={scrolled}>
    <div className="header-inner wrap">
      <a href="#home" className="brand" aria-label="buluku，回到首页"><span className="brand-emblem" aria-hidden="true"><Icon name="spark" width="23" height="23" /></span><span>buluku<span className="brand-period">.</span></span></a>
      <nav className="desktop-nav" aria-label="主要导航">{links.map(link => <a href={`#${link.id}`} key={link.id} aria-current={active === link.id ? 'location' : undefined}>{link.name}<span /></a>)}</nav>
      <div className="header-right"><button className="scene-toggle" type="button" onClick={() => setScene(scene === 'dusk' ? 'night' : 'dusk')} aria-label={scene === 'dusk' ? '切换到星夜' : '切换到黄昏'}><Icon name={scene === 'dusk' ? 'sun' : 'moon'} width="16" height="16" /><span>{scene === 'dusk' ? '黄昏' : '星夜'}</span></button><a className="header-contact" href="#contact">打个招呼 <Icon name="northeast" width="14" height="14" /></a><button className="menu-toggle icon-button" type="button" aria-label={open ? '关闭导航' : '打开导航'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button></div>
      {open && <nav id="mobile-nav" className="mobile-nav" aria-label="移动导航">{[...links, { id: 'contact', name: '联系' }].map(link => <a key={link.id} href={`#${link.id}`} onClick={() => setOpen(false)}>{link.name}<Icon name="northeast" width="17" height="17" /></a>)}<div><a href="/">V1 简约</a><a href="/v2/">V2 星环</a></div></nav>}
    </div>
  </header>;
}
