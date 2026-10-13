'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { skills } from '@/lib/content';
import { Icon } from './Icons';

export default function Skills() {
  const [active, setActive] = useState('web');
  const selected = skills.find(skill => skill.id === active)!;
  return <div className="skills-workbench">
    <div className="skills-grid" role="group" aria-label="选择兴趣与技术领域">{skills.map((skill, index) => <button type="button" className="skill-card" key={skill.id} aria-pressed={active === skill.id} aria-controls="skill-detail" onClick={() => setActive(skill.id)}>
      <span className="skill-card-top"><Icon name={skill.icon} width="25" height="25" /><span className="mono">0{index + 1}</span></span>
      <strong>{skill.short}</strong><span className="skill-label">{skill.label}</span><span className="skill-indicator" aria-hidden="true">↗</span>
    </button>)}</div>
    <div id="skill-detail" className="skill-detail" aria-live="polite" aria-atomic="true">
      <m.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="skill-detail-inner">
        <div><p className="eyebrow">{selected.name}</p><h3>{selected.summary}</h3><p className="skill-description">{selected.detail}</p></div>
        <div className="skill-tags">{selected.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>
      </m.div>
    </div>
  </div>;
}
