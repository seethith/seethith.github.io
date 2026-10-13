'use client';

import { useRef, useState } from 'react';
import { m, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useAtmosphere } from './Atmosphere';
import { Icon } from './Icons';

function SceneImage({ scene, priority = false, onLoad }: { scene: 'dusk' | 'night'; priority?: boolean; onLoad?: () => void }) {
  return <picture>
    <source media="(max-width: 650px)" type="image/avif" srcSet={`/v3/images/studio-${scene}-mobile.avif`} />
    <source media="(max-width: 650px)" type="image/webp" srcSet={`/v3/images/studio-${scene}-mobile.webp`} />
    <source type="image/avif" srcSet={`/v3/images/studio-${scene}-small.avif 840w, /v3/images/studio-${scene}.avif 1672w`} sizes="100vw" />
    <img src={`/v3/images/studio-${scene}.webp`} width="1672" height="941" alt="" fetchPriority={priority ? 'high' : 'auto'} decoding="async" onLoad={onLoad} />
  </picture>;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { scene, setScene, paused, setPaused, still, reduced } = useAtmosphere();
  const [nightLoaded, setNightLoaded] = useState(false);
  const inView = useInView(root, { margin: '80px' });
  const resting = still || !inView;
  const pointerX = useMotionValue(0), pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 45, damping: 24 });
  const y = useSpring(pointerY, { stiffness: 45, damping: 24 });
  const lightX = useTransform(x, value => value * -1.8);
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 35]);
  const textOpacity = useTransform(scrollYProgress, [0, .7], [1, .15]);

  return <section id="home" className="hero" ref={root} data-paused={resting} aria-labelledby="hero-title" onPointerMove={event => {
    if (resting || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - box.left - box.width / 2) * -.012);
    pointerY.set((event.clientY - box.top - box.height / 2) * -.009);
  }} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
    <m.div className="scene-scroll" style={{ y: resting ? 0 : scrollY, scale: resting ? 1 : scrollScale }} aria-hidden="true">
      <m.div className="scene-pointer" style={{ x: resting ? 0 : x, y: resting ? 0 : y }}>
        <div className="scene-camera">
          <div className="scene-image scene-dusk"><SceneImage scene="dusk" priority /></div>
          {(scene === 'night' || nightLoaded) && <div className="scene-image scene-night" style={{ opacity: scene === 'night' && nightLoaded ? 1 : 0 }}><SceneImage scene="night" onLoad={() => setNightLoaded(true)} /></div>}
        </div>
      </m.div>
      <div className="moving-clouds"><svg viewBox="0 0 1000 300" fill="none"><defs><filter id="cloud-blur"><feGaussianBlur stdDeviation="19" /></filter><linearGradient id="cloud-light"><stop stopColor="#aba3d5" stopOpacity="0"/><stop offset=".5" stopColor="#eed1cb"/><stop offset="1" stopColor="#7d84b6" stopOpacity="0"/></linearGradient></defs><g filter="url(#cloud-blur)" fill="url(#cloud-light)"><ellipse cx="400" cy="135" rx="350" ry="25"/><ellipse cx="650" cy="210" rx="310" ry="18"/><ellipse cx="700" cy="83" rx="220" ry="17"/></g></svg></div>
    </m.div>
    <div className="scene-shade" aria-hidden="true" />
    <m.div className="window-light" style={{ x: resting ? 0 : lightX }} aria-hidden="true" />
    <div className="fireflies" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <span key={i} style={{ left: `${8 + (i * 43) % 88}%`, top: `${20 + (i * 17) % 60}%`, animationDelay: `${-i * 1.7}s`, animationDuration: `${14 + i % 5 * 3}s`, width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2 }} />)}</div>
    <div className="hero-main wrap">
      <m.div className="hero-copy" style={{ y: still ? 0 : textY, opacity: still ? 1 : textOpacity }}>
        <p className="eyebrow hero-kicker entry entry-1"><span className="tiny-star">✧</span>A SMALL CORNER OF THE INTERNET</p>
        <p className="hero-greeting entry entry-2">你好，我是</p>
        <h1 id="hero-title" className="entry entry-3">buluku<span>.</span></h1>
        <p className="hero-role mono entry entry-4">DEVELOPER <span>·</span> CREATOR <span>·</span> EXPLORER</p>
        <h2 className="hero-tagline entry entry-5">把好奇，写成作品。</h2>
        <p className="hero-description entry entry-5">喜欢 AI、代码，也喜欢动画里的光。<br />在这里，慢慢做一些有意思的东西。</p>
        <div className="hero-actions entry entry-6"><a className="button button-warm" href="#projects">探索作品<Icon name="northeast" width="17" height="17" /></a><a className="text-link" href="#about">认识我<Icon name="down" width="15" height="15" /></a></div>
      </m.div>
    </div>
    <div className="hero-bottom wrap"><a className="scroll-cue" href="#about"><span className="scroll-line" /><span>往下看看<small className="mono">SCROLL TO DISCOVER</small></span></a><div className="scene-caption"><span className="scene-indicator" /><span className="mono">{scene === 'dusk' ? 'SCENE 01 — THE BLUE HOUR' : 'SCENE 02 — AFTER DARK'}</span></div><div className="hero-controls"><div className="scene-options" role="group" aria-label="场景氛围"><button type="button" onClick={() => setScene('dusk')} aria-pressed={scene === 'dusk'}>黄昏</button><span>/</span><button type="button" onClick={() => setScene('night')} aria-pressed={scene === 'night'}>星夜</button></div><button type="button" className="icon-button motion-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? '播放氛围动效' : '暂停氛围动效'} aria-pressed={paused} disabled={reduced} title={reduced ? '已跟随系统减少动态效果' : paused ? '播放动效' : '暂停动效'}><Icon name={paused || reduced ? 'play' : 'pause'} width="14" height="14" /></button></div></div>
  </section>;
}
