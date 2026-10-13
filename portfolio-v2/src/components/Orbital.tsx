'use client';

import { useEffect, useRef, useState } from 'react';
import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { Icon } from './Icons';

export default function Orbital() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 55, damping: 24 });
  const springY = useSpring(y, { stiffness: 55, damping: 24 });
  const still = paused || !!reduceMotion || !inView;

  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (still) { x.set(0); y.set(0); }
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext('2d');
    if (!context) return;
    let width = 1, height = 1, frame = 0, last = 0;
    let visible = !document.hidden;
    const points = Array.from({ length: 46 }, (_, i) => ({ x: ((i * 127.13) % 997) / 997, y: ((i * 283.87) % 991) / 991, r: i % 8 === 0 ? 1.35 : 0.65 }));
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      for (const [i, point] of points.entries()) {
        const drift = still ? 0 : Math.sin(time / 11000 + i) * 8;
        context.fillStyle = `rgba(170,180,215,${0.22 + (Math.sin(time / 1900 + i) + 1) * 0.14})`;
        context.beginPath(); context.arc(point.x * width, point.y * height + drift, point.r, 0, Math.PI * 2); context.fill();
      }
    };
    const resize = () => {
      const box = element.getBoundingClientRect();
      width = box.width; height = box.height;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      element.width = width * scale; element.height = height * scale;
      context.setTransform(scale, 0, 0, scale, 0, 0); draw(0);
    };
    const tick = (time: number) => {
      if (still || !visible) return;
      if (time - last > 40) { draw(time); last = time; }
      frame = requestAnimationFrame(tick);
    };
    const visibility = () => {
      visible = !document.hidden;
      cancelAnimationFrame(frame);
      if (visible && !still) frame = requestAnimationFrame(tick);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element); resize();
    if (!still) frame = requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', visibility);
    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, [still, x, y]);

  return <div ref={root} className="orbital" data-paused={still} onPointerMove={event => {
    if (still || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.027);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.025);
  }} onPointerLeave={() => { x.set(0); y.set(0); }}>
    <canvas ref={canvas} className="star-field" aria-hidden="true" />
    <div className="orbital-halo" aria-hidden="true" />
    <m.div className="orbital-object" style={{ x: springX, y: springY }} aria-hidden="true">
      <svg className="planet" viewBox="0 0 800 700" fill="none">
        <defs>
          <radialGradient id="sphere" cx="0.28" cy="0.23" r="0.78"><stop stopColor="#9296da" /><stop offset=".14" stopColor="#4c527e" /><stop offset=".4" stopColor="#24283f" /><stop offset=".72" stopColor="#10121e" /><stop offset="1" stopColor="#080910" /></radialGradient>
          <linearGradient id="rim" x1="215" y1="160" x2="585" y2="490" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" /><stop offset=".23" stopColor="#aaa7f1" /><stop offset=".52" stopColor="#555998" /><stop offset="1" stopColor="#101224" stopOpacity="0" /></linearGradient>
          <linearGradient id="ring" x1="75" y1="455" x2="720" y2="235" gradientUnits="userSpaceOnUse"><stop stopColor="#7a72fa" stopOpacity="0" /><stop offset=".24" stopColor="#827bfa" /><stop offset=".45" stopColor="#e3dfff" /><stop offset=".64" stopColor="#9eabff" /><stop offset="1" stopColor="#7a72fa" stopOpacity="0" /></linearGradient>
          <linearGradient id="frontRing" x1="150" y1="460" x2="640" y2="335" gradientUnits="userSpaceOnUse"><stop stopColor="#5d62da" /><stop offset=".43" stopColor="#dedbff" /><stop offset=".69" stopColor="#aeb9ff" /><stop offset="1" stopColor="#6862db" /></linearGradient>
          <radialGradient id="atmosphere"><stop stopColor="#8580ff" stopOpacity=".38" /><stop offset="1" stopColor="#7670f4" stopOpacity="0" /></radialGradient>
          <filter id="ringGlow" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="5" /></filter>
          <filter id="softGlow"><feGaussianBlur stdDeviation="14" /></filter>
          <clipPath id="sphereClip"><circle cx="400" cy="322" r="178" /></clipPath>
        </defs>
        <ellipse cx="400" cy="353" rx="310" ry="275" fill="url(#atmosphere)" opacity=".6" />
        <g transform="rotate(-24 400 350)">
          <ellipse cx="400" cy="350" rx="332" ry="89" stroke="url(#ring)" strokeWidth="1" opacity=".28" />
          <ellipse cx="400" cy="350" rx="310" ry="76" stroke="url(#ring)" strokeWidth="14" opacity=".45" filter="url(#ringGlow)" />
          <ellipse cx="400" cy="350" rx="310" ry="76" stroke="url(#ring)" strokeWidth="2" />
          <ellipse cx="400" cy="350" rx="286" ry="69" stroke="url(#ring)" strokeWidth=".6" opacity=".6" />
        </g>
        <circle cx="398" cy="320" r="181" stroke="url(#rim)" strokeWidth="4" filter="url(#softGlow)" opacity=".6" />
        <circle cx="400" cy="322" r="178" fill="url(#sphere)" stroke="url(#rim)" strokeWidth="1.4" />
        <g clipPath="url(#sphereClip)" stroke="#9faae2" strokeWidth=".6" opacity=".1">
          {Array.from({ length: 13 }, (_, i) => <ellipse key={i} cx="400" cy="322" rx={25 + i * 13} ry="178" transform="rotate(-24 400 322)" />)}
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M210 ${170 + i * 35} Q400 ${225 + i * 25} 600 ${170 + i * 35}`} />)}
        </g>
        <g transform="rotate(-24 400 350)">
          <path d="M90 350a310 76 0 0 0 620 0" stroke="url(#frontRing)" strokeWidth="11" opacity=".4" filter="url(#ringGlow)" />
          <path d="M90 350a310 76 0 0 0 620 0" stroke="url(#frontRing)" strokeWidth="2.1" />
          <path d="M97 350a303 74 0 0 0 606 0" stroke="url(#frontRing)" strokeWidth=".7" opacity=".7" />
          <path d="M68 350a332 89 0 0 0 664 0" stroke="url(#ring)" strokeWidth=".6" opacity=".5" />
        </g>
        <circle cx="620" cy="245" r="3" fill="#e5e4ff" /><circle cx="620" cy="245" r="8" stroke="#c1bdff" strokeOpacity=".25" />
        <path d="M198 148h20m-10-10v20M626 518h14m-7-7v14" stroke="#a3a8be" strokeWidth=".7" opacity=".5" />
        <path d="M294 567h59m98 0h45" stroke="#9fa6bc" strokeWidth=".5" opacity=".3" />
        <text x="400" y="571" textAnchor="middle" fill="#9299af" fontFamily="monospace" fontSize="9" letterSpacing="3">∞ POSSIBILITIES</text>
      </svg>
    </m.div>
    <div className="orbital-caption"><span className="mono">FIG. 01 — CURIOSITY IN ORBIT</span><button type="button" className="icon-button" onClick={() => setPaused(!paused)} aria-label={paused ? '播放背景动效' : '暂停背景动效'} aria-pressed={paused} disabled={!!reduceMotion} title={reduceMotion ? '已跟随系统减少动态效果' : paused ? '播放背景动效' : '暂停背景动效'}><Icon name={paused || reduceMotion ? 'play' : 'pause'} width="13" height="13" /></button></div>
  </div>;
}
