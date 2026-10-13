import Image from 'next/image';
import Header from '@/components/Header';
import Orbital from '@/components/Orbital';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import { Icon } from '@/components/Icons';
import { Reveal } from '@/components/Motion';
import { profile, projects } from '@/lib/content';

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="section-label mono"><span>{number}</span><span className="label-line" />{children}</p>;
}

export default function Home() {
  return <>
    <a className="skip-link" href="#main">跳到主要内容</a>
    <Header />
    <main id="main">
      <section id="home" className="hero container" aria-labelledby="hero-title">
        <div className="hero-topline mono"><span><i className="status-dot" />A PERSONAL UNIVERSE</span><span>PORTFOLIO / VOL. 02</span></div>
        <div className="hero-content">
          <p className="hero-eyebrow entry entry-one">你好，我是</p>
          <h1 id="hero-title" className="entry entry-two">{profile.name}<span>.</span></h1>
          <p className="hero-position entry entry-three">保持好奇。<br />把想法，<span>做成现实。</span></p>
          <p className="hero-description entry entry-four">{profile.description}</p>
          <div className="hero-actions entry entry-five"><a href="#projects" className="button button-primary">探索我的作品<Icon name="arrow" width="18" height="18" /></a><a href="#about" className="text-link">关于我<Icon name="northeast" width="16" height="16" /></a></div>
          <div className="hero-tags entry entry-five mono"><span>AI</span><i /><span>WEB DEVELOPMENT</span><i /><span>CREATIVE CODING</span></div>
        </div>
        <Orbital />
        <div className="hero-bottom mono"><a href="#about"><span className="scroll-mark"><Icon name="down" width="13" height="13" /></span>SCROLL TO EXPLORE</a><span>IDEAS → CODE → REALITY</span></div>
      </section>

      <section id="about" className="section about-section container" aria-labelledby="about-title">
        <Reveal><SectionLabel number="01">ABOUT ME</SectionLabel></Reveal>
        <div className="about-layout">
          <Reveal><h2 id="about-title">认真做点东西。<br /><span className="muted">也留一点好奇心。</span></h2><p className="about-description">我是 buluku，喜欢折腾网页、小工具和新技术。<br className="desktop-break" />从一个「能不能」开始，把想法慢慢做出来。</p><p className="about-description">这里放作品、实验，以及以后想写的文章。<br className="desktop-break" />技术之外，也喜欢二次元里的想象力。</p><a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">我的 GitHub <Icon name="northeast" width="15" height="15" /></a></Reveal>
          <Reveal delay={0.1} className="about-note">
            <span className="note-corner" aria-hidden="true">✳</span><p className="eyebrow mono">A FEW THINGS ABOUT ME</p>
            <div className="about-line"><span>在做</span><strong>把小想法做成小工具</strong></div><div className="about-line"><span>关注</span><strong>AI · Web · 交互设计</strong></div><div className="about-line"><span>喜欢</span><strong>代码、设计、二次元</strong></div>
            <div className="note-footer"><span className="status-dot" /><span>持续探索中</span><span className="mono">ALWAYS CURIOUS.</span></div>
          </Reveal>
        </div>
      </section>

      <section id="skills" className="section skills-section container" aria-labelledby="skills-title">
        <Reveal><SectionLabel number="02">SKILLS & INTERESTS</SectionLabel><div className="section-heading"><h2 id="skills-title">工具随想法而变。</h2><p>正在使用的技术，和想继续探索的领域。</p></div><Skills /></Reveal>
      </section>

      <section id="projects" className="section projects-section container" aria-labelledby="projects-title">
        <Reveal><SectionLabel number="03">SELECTED WORK</SectionLabel><div className="section-heading"><h2 id="projects-title">一些想法，<span className="muted">已经发生。</span></h2><span className="work-count mono">2026 — ONGOING</span></div></Reveal>
        <div className="project-grid">{projects.map((project, index) => <Reveal key={project.id} className={`project-wrap ${index === 0 ? 'featured' : ''}`} delay={index === 2 ? 0.08 : 0}>
          <article className="project-card">
            <a href={project.href} className="project-visual" target={project.href.startsWith('https:') ? '_blank' : undefined} rel={project.href.startsWith('https:') ? 'noopener noreferrer' : undefined} aria-label={`打开${project.name}${project.href.startsWith('https:') ? '（新标签页）' : ''}`}>
              <Image src={project.image} alt={project.alt} width={1200} height={760} loading="lazy" sizes={index === 0 ? '(max-width: 760px) 100vw, 70vw' : '(max-width: 760px) 100vw, 45vw'} />
              <span className="project-number mono">PROJECT / {project.id}</span><span className="project-open"><Icon name="northeast" /></span>
            </a>
            <div className="project-content"><p className="project-category mono">{project.category}</p><h3><a href={project.href} target={project.href.startsWith('https:') ? '_blank' : undefined} rel={project.href.startsWith('https:') ? 'noopener noreferrer' : undefined}>{project.name}</a></h3><p className="project-description">{project.description}</p><p className="project-result"><span />{project.result}</p><div className="project-meta"><div className="project-tags">{project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>{project.source ? <a className="source-link" href={project.source} target="_blank" rel="noopener noreferrer" aria-label={`${project.name}的 GitHub 源码`}><Icon name="github" width="15" height="15" />源码<Icon name="northeast" width="12" height="12" /></a> : <span className="source-pending">源码待补充</span>}</div></div>
          </article>
        </Reveal>)}</div>
        <Reveal><div className="next-project"><span className="next-project-icon">+</span><p>下一个小玩意，<span>还在酝酿。</span></p><span className="mono">ROOM FOR WHAT’S NEXT</span></div></Reveal>
      </section>

      <section id="experience" className="section experience-section container" aria-labelledby="experience-title">
        <Reveal><SectionLabel number="04">RESEARCH & EXPERIENCE</SectionLabel></Reveal>
        <div className="experience-layout"><Reveal><h2 id="experience-title">留下探索的轨迹。</h2><p className="section-description">把做过的事，一件件记录下来。</p><div className="experience-mark" aria-hidden="true"><span /><span /><span /><span /><i>↗</i></div></Reveal>
          <Reveal delay={0.08} className="timeline">
            <div className="timeline-item"><div className="timeline-date mono"><span className="status-dot" />2026 — NOW</div><h3>个人主页与交互实验</h3><p>搭建自己的线上空间，整理工具和作品，持续打磨网页体验。</p><a href="/" className="text-link">查看第一版主页 <Icon name="northeast" width="14" height="14" /></a></div>
            <div className="timeline-item future"><div className="timeline-date mono">TO BE ADDED</div><h3>研究与更多经历</h3><p>这部分等待补充真实资料。</p><div className="experience-categories"><span>论文</span><span>科研</span><span>竞赛</span><span>实习</span></div></div>
          </Reveal>
        </div>
      </section>

      <section className="writing-section container" aria-labelledby="writing-title"><Reveal><a className="writing-card" href="/articles/"><div className="writing-icon"><Icon name="book" width="25" height="25" /></div><div><p className="eyebrow mono">NOTES & THOUGHTS</p><h2 id="writing-title">不止代码，也写一点想法。</h2><p>文章区已准备好，第一篇还在路上。</p></div><span className="writing-arrow"><Icon name="northeast" width="25" height="25" /></span></a></Reveal></section>

      <section id="contact" className="contact-section container" aria-labelledby="contact-title"><Reveal><SectionLabel number="05">LET’S CONNECT</SectionLabel><p className="contact-prelude">好的想法，常常始于一句</p><h2 id="contact-title">你好<span>。</span><span className="hello-star" aria-hidden="true">✳</span></h2><p className="contact-description">聊聊技术，交换灵感，或者只是打个招呼。</p><Contact /></Reveal><div className="contact-glow" aria-hidden="true" /></section>
    </main>
    <footer className="site-footer container"><a className="footer-brand" href="#home">buluku<span>.</span></a><p className="mono">© 2026 BULUKU · BUILT WITH CURIOSITY</p><div><a href="/">第一版 <span className="mono">V1 ↗</span></a><a href={profile.repository} target="_blank" rel="noopener noreferrer">源码 <Icon name="northeast" width="13" height="13" /></a><a href="#home" aria-label="回到顶部">↑</a></div></footer>
  </>;
}
