import { useEffect, useRef, useState } from 'react';

interface Props { expanded?: boolean }
type Ripple = { x: number; y: number; born: number };

export default function RippleField({ expanded = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -1000, y: -1000 });
  const ripples = useRef<Ripple[]>([]);
  const [paused, setPaused] = useState(false);
  const [intensity, setIntensity] = useState(65);
  const [counter, setCounter] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const settings = useRef({ paused: false, intensity: 65, reducedMotion: false });
  settings.current = { paused, intensity, reducedMotion };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReducedMotion(media.matches); setPaused(media.matches); };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = 0, height = 0, frame = 0, phase = 0, last = 0, visible = true;
    const resize = new ResizeObserver(([entry]) => {
      if (!entry) return;
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    resize.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; });
    visibility.observe(canvas);

    function draw(now: number) {
      frame = requestAnimationFrame(draw);
      if (now - last < 32 || !visible || document.hidden) return;
      const dt = last ? Math.min(now - last, 80) : 32;
      last = now;
      if (!settings.current.paused) phase += dt * 0.00048;
      ctx!.clearRect(0, 0, width, height);
      const spacing = expanded ? 13 : 11;
      const extent = Math.min(width * .43, height * .46);
      const cx = width / 2, cy = height / 2;
      const amp = settings.current.intensity / 65;
      ripples.current = ripples.current.filter(r => now - r.born < 1700);
      for (let x = (width % spacing) / 2 + spacing; x < width - spacing; x += spacing) {
        for (let y = (height % spacing) / 2 + spacing; y < height - spacing; y += spacing) {
          const dx = x - cx, dy = y - cy;
          const dist = Math.hypot(dx, dy);
          const envelope = Math.exp(-Math.pow(dist / extent, 4) * 1.5);
          const wave = Math.sin(dist * .054 - phase * 2.2) * envelope;
          const twist = .26 * Math.cos(dist * .015 - phase) * envelope;
          let px = cx + dx * Math.cos(twist) - dy * Math.sin(twist);
          let py = cy + dx * Math.sin(twist) + dy * Math.cos(twist);
          px += dx / (dist || 1) * wave * 11 * amp;
          py += dy / (dist || 1) * wave * 11 * amp;
          const pdx = px - pointer.current.x, pdy = py - pointer.current.y;
          const pd = Math.hypot(pdx, pdy);
          if (pd < 85 && pd > 0 && !settings.current.paused) {
            const force = Math.pow(1 - pd / 85, 2) * 25 * amp;
            px += pdx / pd * force; py += pdy / pd * force;
          }
          let pulse = 0;
          if (!settings.current.reducedMotion) {
            for (const ripple of ripples.current) {
              const rd = Math.hypot(x - ripple.x, y - ripple.y);
              const age = (now - ripple.born) / 1000;
              pulse += Math.exp(-Math.pow((rd - age * 180) / 22, 2)) * (1 - age / 1.7);
            }
          }
          const strength = Math.min(1, (wave + 1) * .36 * envelope + pulse);
          const radius = .65 + envelope * .5 + strength * 1.4 * amp;
          ctx!.fillStyle = dist < extent * .88 ? `rgba(42, 79, 221, ${.3 + strength * .65})` : `rgba(113, 120, 142, ${.12 + envelope * .25})`;
          ctx!.beginPath(); ctx!.arc(px, py, Math.max(.35, radius), 0, Math.PI * 2); ctx!.fill();
        }
      }
    }
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); visibility.disconnect(); };
  }, [expanded]);

  function ripple(x?: number, y?: number) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    ripples.current.push({ x: x ?? rect.width / 2, y: y ?? rect.height / 2, born: performance.now() });
    setCounter(n => n + 1);
  }

  return <div className={`ripple-widget ${expanded ? 'ripple-expanded' : ''}`}>
    <div className="ripple-top mono"><span>像素潮汐</span><span className="live-label">{paused ? '已暂停' : '可交互'}</span></div>
    <canvas ref={canvasRef} className="ripple-canvas" tabIndex={0} role="button" aria-label="像素潮汐互动区域，点击或按回车产生涟漪" onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top }; }} onPointerLeave={() => { pointer.current = { x: -1000, y: -1000 }; }} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); ripple(e.clientX - r.left, e.clientY - r.top); }} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ripple(); } }} />
    <div className="ripple-bottom"><span>点击或按回车产生涟漪</span><button className="icon-button" aria-label={paused ? '播放动画' : '暂停动画'} title={paused ? '播放动画' : '暂停动画'} onClick={() => setPaused(p => !p)}>{paused ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 9 6-9 6Z" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12" /></svg>}</button></div>
    {expanded && <div className="ripple-controls"><label htmlFor="intensity">波动幅度 <span className="mono">{intensity}%</span></label><input id="intensity" type="range" min="10" max="100" value={intensity} onChange={e => setIntensity(Number(e.target.value))} /><button className="text-button" onClick={() => ripple()}>产生涟漪</button><span className="ripple-count mono" aria-live="polite">{counter} 次涟漪</span></div>}
  </div>;
}
