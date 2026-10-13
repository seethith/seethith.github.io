'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { skills } from '@/lib/content';
import { Icon } from './Icons';

export default function Skills() {
  const [active, setActive] = useState(skills[0].id);
  const selected = skills.find(skill => skill.id === active)!;
  return <div className="skills-layout"><div className="skill-list" role="group" aria-label="选择技术方向">{skills.map((skill, index) => <button className="skill-tab" key={skill.id} type="button" aria-pressed={active === skill.id} aria-controls="skill-details" onClick={() => setActive(skill.id)}><span className="skill-index mono">0{index + 1}</span><Icon name={skill.icon} width="21" height="21" /><span className="skill-name">{skill.label}<small>{skill.cn}</small></span><Icon name="northeast" width="15" height="15" /></button>)}</div><div className="skill-details" id="skill-details" aria-live="polite" aria-atomic="true"><div className="skill-constellation" aria-hidden="true"><svg viewBox="0 0 420 230"><defs><radialGradient id="skill-glow"><stop stopColor="#a696db" stopOpacity=".22"/><stop offset="1" stopColor="#8c86ac" stopOpacity="0"/></radialGradient></defs><ellipse cx="210" cy="108" rx="180" ry="95" fill="url(#skill-glow)"/><g stroke="#aaa1ce" strokeWidth=".6" strokeOpacity=".26" fill="none"><ellipse cx="210" cy="108" rx="144" ry="56" transform="rotate(-18 210 108)"/><ellipse cx="210" cy="108" rx="112" ry="84" transform="rotate(24 210 108)"/><path d="m75 139 94-93 110 123 68-87-272 57Z"/></g><g fill="#c5bae4"><circle cx="75" cy="139" r="3"/><circle cx="169" cy="46" r="2.5"/><circle cx="279" cy="169" r="3"/><circle cx="347" cy="82" r="2"/></g></svg><div className="constellation-center"><Icon name={selected.icon} width="37" height="37" /></div></div><m.div key={active} className="skill-detail-copy" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}><p className="skill-status"><span />{selected.status}</p><h3>{selected.note}</h3><p>{selected.detail}</p><div className="tags">{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div></m.div></div></div>;
}
