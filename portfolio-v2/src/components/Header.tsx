'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons';

const links = [{ href: '#about', name: '关于' }, { href: '#skills', name: '领域' }, { href: '#projects', name: '作品' }, { href: '#experience', name: '经历' }];
const accents = [{ value: 'violet', label: '星云紫' }, { value: 'blue', label: '冰川蓝' }, { value: 'mint', label: '极光绿' }];

export default function Header() {
  const [theme, setTheme] = useState('dark');
  const [accent, setAccent] = useState('violet');
  const [settings, setSettings] = useState(false);
  const [menu, setMenu] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || 'dark');
    setAccent(document.documentElement.dataset.accent || 'violet');
    const onOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) { setSettings(false); setMenu(false); }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (settings) root.current?.querySelector<HTMLButtonElement>('[aria-controls="appearance-panel"]')?.focus();
        else if (menu) root.current?.querySelector<HTMLButtonElement>('[aria-controls="mobile-navigation"]')?.focus();
        setSettings(false); setMenu(false);
      }
    };
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onOutside); document.removeEventListener('keydown', onKey); };
  }, [settings, menu]);

  function applyTheme(value: string) {
    setTheme(value);
    document.documentElement.dataset.theme = value;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#08090e' : '#f5f5f8');
    try { localStorage.setItem('buluku-v2-theme', value); } catch { /* Preferences still work in memory. */ }
  }
  function applyAccent(value: string) {
    setAccent(value); document.documentElement.dataset.accent = value;
    try { localStorage.setItem('buluku-v2-accent', value); } catch { /* Preferences still work in memory. */ }
  }

  return <header ref={root} className="site-header">
    <a className="wordmark" href="#home" aria-label="buluku，回到首页"><span className="brand-symbol" aria-hidden="true">b<span>✳</span></span>buluku<span className="brand-dot">.</span></a>
    <nav className="desktop-nav" aria-label="主要导航">{links.map(link => <a key={link.href} href={link.href}>{link.name}</a>)}</nav>
    <div className="header-actions">
      <a href="#contact" className="header-contact">打个招呼 <Icon name="northeast" width="14" height="14" /></a>
      <div className="appearance">
        <button className="icon-button" type="button" aria-label="外观设置" aria-expanded={settings} aria-controls="appearance-panel" onClick={() => { setSettings(!settings); setMenu(false); }}><Icon name={theme === 'dark' ? 'moon' : 'sun'} width="17" height="17" /></button>
        {settings && <div className="appearance-panel" id="appearance-panel">
          <span className="control-label">外观</span>
          <div className="mode-switch" role="group" aria-label="明暗模式">{['dark', 'light'].map(value => <button type="button" key={value} aria-pressed={theme === value} onClick={() => applyTheme(value)}><Icon name={value === 'dark' ? 'moon' : 'sun'} width="14" height="14" />{value === 'dark' ? '深色' : '浅色'}</button>)}</div>
          <span className="control-label">主题色</span>
          <div className="accent-options" role="group" aria-label="主题色">{accents.map(option => <button type="button" key={option.value} data-color={option.value} aria-label={option.label} title={option.label} aria-pressed={accent === option.value} onClick={() => applyAccent(option.value)}>{accent === option.value && <Icon name="check" width="13" height="13" />}</button>)}</div>
        </div>}
      </div>
      <button type="button" className="icon-button menu-button" aria-label={menu ? '关闭导航' : '打开导航'} aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => { setMenu(!menu); setSettings(false); }}><Icon name={menu ? 'close' : 'menu'} /></button>
    </div>
    {menu && <nav className="mobile-nav" id="mobile-navigation" aria-label="移动导航">{[...links, { href: '#contact', name: '联系' }].map(link => <a key={link.href} href={link.href} onClick={() => setMenu(false)}>{link.name}<Icon name="northeast" /></a>)}<a href="/">第一版主页 <span>V1 ↗</span></a></nav>}
  </header>;
}
