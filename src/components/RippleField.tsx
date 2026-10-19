import { useEffect, useRef, useState } from 'react';

interface Props { expanded?: boolean }
type Ripple = { x: number; y: number; age: number };
type Vertex = { u: number; v: number; lift: number; velocity: number; x: number; y: number; depth: number };

export default function RippleField({ expanded = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -1000, y: -1000, active: false });
  const ripples = useRef<Ripple[]>([]);
  const wake = useRef<() => void>(() => {});
  const [paused, setPaused] = useState(false);
  const [intensity, setIntensity] = useState(65);
  const [counter, setCounter] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const settings = useRef({ paused, intensity, reducedMotion });
  settings.current = { paused, intensity, reducedMotion };

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReducedMotion(media.matches); setPaused(media.matches); };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => { wake.current(); }, [paused, intensity, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let width = 0, height = 0, frame = 0, phase = 0, last = 0, visible = true;
    let columns = 48, rows = 30, vertices: Vertex[] = [];
    let accent = '#2455f5', ink = '#242620', colorUntil = 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const canMove = () => !settings.current.paused && !reduced.matches;
    const colors = () => {
      const style = getComputedStyle(document.documentElement);
      accent = style.getPropertyValue('--accent').trim();
      ink = style.getPropertyValue('--ink').trim();
    };
    colors();
    const schedule = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };
    wake.current = schedule;
    const resize = new ResizeObserver(([entry]) => {
      if (!entry) return;
      width = entry.contentRect.width; height = entry.contentRect.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Keep the same mesh through route expansion. Phones use fewer vertices.
      const count = width < 390 ? 34 : 48;
      if (!vertices.length || count !== columns) {
        columns = count; rows = count === 34 ? 24 : 30;
        vertices = Array.from({ length: (columns + 1) * (rows + 1) }, (_, i) => ({
          u: (i % (columns + 1)) / columns * 2 - 1,
          v: Math.floor(i / (columns + 1)) / rows * 2 - 1,
          lift: 0, velocity: 0, x: 0, y: 0, depth: 0,
        }));
      }
      schedule();
    });
    resize.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) { last = 0; colors(); schedule(); }
      else { cancelAnimationFrame(frame); frame = 0; }
    });
    visibility.observe(canvas);
    function appearance() { colorUntil = performance.now() + 750; schedule(); }
    function pageVisibility() {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      if (!document.hidden) { colors(); schedule(); }
    }
    window.addEventListener('appearancechange', appearance);
    document.addEventListener('visibilitychange', pageVisibility);

    function draw(now: number) {
      frame = 0;
      if (!visible || document.hidden || !width || !height) return;
      const moving = canMove();
      const interval = width < 390 ? 1000 / 30 : 1000 / 45;
      if (last && now - last < interval && moving) { schedule(); return; }
      const dt = Math.min(last ? (now - last) / 1000 : 1 / 45, .05);
      last = now;
      if (now < colorUntil) colors();
      if (moving) {
        phase += dt * .5;
        ripples.current.forEach(r => { r.age += dt; });
        ripples.current = ripples.current.filter(r => r.age < 2.6);
      }
      ctx!.clearRect(0, 0, width, height);
      const scale = Math.min(width * .36, height * .8);
      const cx = width * .5, cy = height * .53;
      const amplitude = settings.current.intensity / 65;
      const yaw = -.28 + (reduced.matches ? 0 : Math.sin(phase * .22) * .035);
      const cos = Math.cos(yaw), sin = Math.sin(yaw);
      const step = dt * 60;
      for (const p of vertices) {
        const x = p.u * cos - p.v * sin, z = p.u * sin + p.v * cos;
        const perspective = 1 / (1.5 - z * .2);
        const envelope = Math.pow(Math.max(0, 1 - p.u * p.u), .55) * Math.pow(Math.max(0, 1 - p.v * p.v), .55);
        const base = (Math.sin(p.u * 3.4 + phase) * .23 + Math.cos(p.v * 4.1 - phase * .7) * .16) * envelope * amplitude;
        const flatX = cx + x * scale * perspective * 1.45;
        const flatY = cy + (z * .58 - base) * scale * perspective;
        if (moving) {
          const distance = Math.hypot(flatX - pointer.current.x, flatY - pointer.current.y);
          let target = pointer.current.active ? Math.exp(-Math.pow(distance / (scale * .33), 2)) * .42 * amplitude : 0;
          for (const r of ripples.current) {
            const d = Math.hypot(flatX / width - r.x, (flatY / height - r.y) * height / width);
            const ring = (d - r.age * .28) / .045;
            target += Math.cos(ring * 1.5) * Math.exp(-ring * ring * .5) * Math.exp(-r.age * 1.5) * .34 * amplitude;
          }
          p.velocity = (p.velocity + (target - p.lift) * .055 * step) * Math.pow(.78, step);
          p.lift += p.velocity * step;
        }
        p.x = flatX;
        p.y = flatY - (reduced.matches ? 0 : p.lift) * envelope * scale * perspective;
        p.depth = (z + 1.3) / 2.6;
      }
      // One ordered sheet, not free-floating particles: topology stays coherent.
      ctx!.lineWidth = .65;
      for (let row = 0; row <= rows; row++) {
        const edge = Math.sin(row / rows * Math.PI);
        ctx!.strokeStyle = row % 5 === 0 ? accent : ink;
        ctx!.globalAlpha = (.10 + edge * .18) * (row % 5 === 0 ? 1.5 : 1);
        ctx!.beginPath();
        for (let col = 0; col <= columns; col++) {
          const p = vertices[row * (columns + 1) + col]!;
          if (!col) ctx!.moveTo(p.x, p.y); else ctx!.lineTo(p.x, p.y);
        }
        ctx!.stroke();
      }
      ctx!.strokeStyle = accent;
      for (let col = 0; col <= columns; col += 2) {
        ctx!.globalAlpha = .07 + Math.sin(col / columns * Math.PI) * .09;
        ctx!.beginPath();
        for (let row = 0; row <= rows; row++) {
          const p = vertices[row * (columns + 1) + col]!;
          if (!row) ctx!.moveTo(p.x, p.y); else ctx!.lineTo(p.x, p.y);
        }
        ctx!.stroke();
      }
      ctx!.fillStyle = accent;
      for (const p of vertices) {
        const edge = Math.pow(Math.max(0, (1 - p.u * p.u) * (1 - p.v * p.v)), .3);
        ctx!.globalAlpha = edge * (.22 + p.depth * .42);
        const radius = .5 + p.depth * .65 + Math.min(.5, Math.abs(p.lift));
        ctx!.beginPath(); ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      if (moving || now < colorUntil) schedule();
    }
    schedule();
    return () => {
      wake.current = () => {};
      cancelAnimationFrame(frame); resize.disconnect(); visibility.disconnect();
      window.removeEventListener('appearancechange', appearance);
      document.removeEventListener('visibilitychange', pageVisibility);
    };
  }, []);

  function ripple(x = .5, y = .5) {
    if (paused || reducedMotion) return;
    ripples.current = [...ripples.current.slice(-7), { x, y, age: 0 }];
    setCounter(n => n + 1); wake.current();
  }
  return <div className={`ripple-widget ${expanded ? 'ripple-expanded' : ''}`}>
    <div className="ripple-top mono"><span className="ripple-name">像素潮汐</span><span className="live-label">{paused || reducedMotion ? '静止' : '可交互'}</span></div>
    <canvas ref={canvasRef} className="ripple-canvas" tabIndex={0} role="button" aria-label="像素潮汐互动区域，移动鼠标拨动波面，点击或按回车产生涟漪" onPointerMove={e => {
      if (e.pointerType === 'touch') return;
      const r = e.currentTarget.getBoundingClientRect();
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
    }} onPointerLeave={() => { pointer.current.active = false; }} onPointerCancel={() => { pointer.current.active = false; }} onClick={e => {
      const r = e.currentTarget.getBoundingClientRect(); ripple((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    }} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ripple(); } }} />
    <div className="ripple-bottom"><span>{reducedMotion ? '已跟随系统减少动态效果' : '移动鼠标拨动 · 点击泛起涟漪'}</span><button className="icon-button" disabled={reducedMotion} aria-label={paused ? '播放动画' : '暂停动画'} title={paused ? '播放动画' : '暂停动画'} onClick={() => setPaused(p => !p)}>{paused ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 9 6-9 6Z" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12" /></svg>}</button></div>
    {expanded && <div className="ripple-controls"><label htmlFor="intensity">波动幅度 <span className="mono">{intensity}%</span></label><input id="intensity" type="range" min="10" max="100" value={intensity} onChange={e => setIntensity(Number(e.target.value))} /><button className="text-button" disabled={paused || reducedMotion} onClick={() => ripple()}>产生涟漪</button><span className="ripple-count mono" aria-live="polite">{counter} 次涟漪</span></div>}
  </div>;
}
