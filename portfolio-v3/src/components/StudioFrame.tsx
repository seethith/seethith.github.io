'use client';

import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { useAtmosphere } from './Atmosphere';

export default function StudioFrame() {
  const ref = useRef<HTMLDivElement>(null);
  const { still } = useAtmosphere();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-16, 16]);
  return <div className="studio-frame" ref={ref}><div className="studio-frame-photo"><m.div className="studio-frame-image" style={{ y: still ? 0 : y }}><picture><source srcSet="/v3/images/studio-dusk.avif" type="image/avif" /><img src="/v3/images/studio-dusk.webp" alt="原创品牌插画：窗边安静工作的年轻创作者，身边是一盏暖灯" width="1672" height="941" loading="lazy" decoding="async" /></picture></m.div><div className="photo-grain" /><span className="photo-corner mono">A QUIET PLACE TO CREATE</span></div><div className="studio-caption"><span>一盏灯，一点好奇心。</span><span className="mono">ORIGINAL ILLUSTRATION ↗</span></div><span className="frame-star" aria-hidden="true">✧</span></div>;
}
