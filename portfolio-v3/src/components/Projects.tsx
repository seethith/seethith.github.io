'use client';

import Image from 'next/image';
import { useState } from 'react';
import { projects } from '@/lib/content';
import { Icon } from './Icons';

const filters = [{ value: 'all', label: '全部作品', count: 3 }, { value: 'tool', label: '小工具', count: 2 }, { value: 'experiment', label: '交互实验', count: 1 }];

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const visible = projects.filter(project => filter === 'all' || project.type === filter);
  return <>
    <div className="project-toolbar"><div className="project-filters" role="group" aria-label="筛选作品">{filters.map(item => <button key={item.value} type="button" aria-pressed={filter === item.value} aria-controls="project-results" onClick={() => setFilter(item.value)}>{item.label}<span className="mono">0{item.count}</span></button>)}</div><span className="eyebrow project-toolbar-note">SMALL IDEAS, REAL THINGS.</span></div>
    <span className="sr-only" role="status">显示 {visible.length} 个作品</span>
    <div className="project-grid" id="project-results">{visible.map(project => <article key={project.id} className={`project-card cover-${project.cover}`} onPointerMove={event => {
      if (event.pointerType !== 'mouse') return;
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    }}>
      <a className="project-visual" href={project.href} target={project.href.startsWith('https:') ? '_blank' : undefined} rel={project.href.startsWith('https:') ? 'noopener noreferrer' : undefined} aria-label={`打开${project.title}${project.href.startsWith('https:') ? '（新标签页）' : ''}`}><Image src={project.image} alt={project.alt} width={1200} height={760} sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" loading="lazy" /><span className="project-id mono">{project.id} / {project.category}</span><span className="project-arrow"><Icon name="northeast" width="18" height="18" /></span></a>
      <div className="project-info"><p className="eyebrow">{project.english}</p><h3><a href={project.href} target={project.href.startsWith('https:') ? '_blank' : undefined} rel={project.href.startsWith('https:') ? 'noopener noreferrer' : undefined}>{project.title}</a></h3><p className="project-description">{project.description}</p><p className="project-result">{project.result}</p><div className="project-meta"><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{project.source ? <a className="source-link" href={project.source} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} GitHub 源码`}><Icon name="github" width="15" height="15" /><Icon name="northeast" width="12" height="12" /></a> : <span className="source-pending">源码待补充</span>}</div></div>
    </article>)}</div>
    <div className="future-work"><span className="future-symbol">✧</span><p>下一个小玩意，<span>还在酝酿。</span></p><span className="mono">TO BE CONTINUED</span></div>
  </>;
}
