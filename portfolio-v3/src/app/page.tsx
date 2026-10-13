import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import StudioFrame from '@/components/StudioFrame';
import Contact from '@/components/Contact';
import { Reveal } from '@/components/Motion';
import { Icon } from '@/components/Icons';
import { profile, researchEntries } from '@/lib/content';

function Chapter({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="chapter eyebrow"><span className="chapter-number mono">{number}</span><span className="chapter-line" />{children}</p>;
}

export default function Home() {
  return <><a className="skip-link" href="#about">跳到主要内容</a><Header /><main>
    <Hero />
    <section id="about" className="about-section section wrap" aria-labelledby="about-title">
      <div className="about-layout"><Reveal className="about-copy"><Chapter number="01">A LITTLE ABOUT ME</Chapter><h2 id="about-title">做点实用的。<br /><span>也做点好玩的。</span></h2><p className="about-intro">我是 buluku。喜欢用 AI 和代码，把一点点好奇变成能用的小工具。</p><p className="body-copy">技术之外，也喜欢二次元里的想象力、细腻的光影，以及那些让人想多停留一会儿的画面。</p><p className="body-copy">这个小空间，放作品、实验，还有以后想写的文章。</p><div className="about-interests"><span><i className="interest-code" />代码</span><span><i className="interest-art" />设计</span><span><i className="interest-anime" />二次元</span></div><a className="text-link accent-link" href={profile.github} target="_blank" rel="noopener noreferrer">更多关于我<Icon name="northeast" width="15" height="15" /></a></Reveal><Reveal delay={.12} className="about-art"><StudioFrame /></Reveal></div>
      <Reveal><div className="about-footnote"><span className="mono">LOGIC & IMAGINATION</span><span className="thin-line" /><span>认真构建，也自由探索。</span><span aria-hidden="true">✧</span></div></Reveal>
    </section>

    <section id="projects" className="projects-section section wrap" aria-labelledby="projects-title"><Reveal><Chapter number="02">SELECTED WORKS</Chapter><div className="section-heading"><div><h2 id="projects-title">一点灵感，<span>一点实践。</span></h2><p>从「要不试试」开始，慢慢做出来的东西。</p></div><a href={profile.repository} target="_blank" rel="noopener noreferrer" className="text-link">去 GitHub 看看<Icon name="northeast" width="15" height="15" /></a></div><Projects /></Reveal></section>

    <section id="research" className="research-section section wrap" aria-labelledby="research-title"><Reveal><Chapter number="03">RESEARCH & EXPLORATION</Chapter></Reveal><div className="research-layout"><Reveal><h2 id="research-title">好问题，<br /><span>值得慢慢研究。</span></h2><p className="body-copy">记录学习、实验，以及那些还想弄明白的问题。</p><a className="research-notes-link text-link" href="/articles/">文章与笔记<Icon name="northeast" width="15" height="15" /></a></Reveal><Reveal className="research-notebook" delay={.08}><div className="notebook-top"><Icon name="book" width="20" height="20" /><span className="eyebrow">THE RESEARCH NOTEBOOK</span><span className="notebook-status">待更新</span></div>{researchEntries.length ? researchEntries.map(entry => <article className="research-entry" key={`${entry.year}-${entry.title}`}><p className="eyebrow">{entry.year} / {entry.kind}</p><h3>{entry.href ? <a href={entry.href} target="_blank" rel="noopener noreferrer">{entry.title} ↗</a> : entry.title}</h3><p>{entry.description}</p></article>) : <div className="research-empty"><span className="notebook-drawing" aria-hidden="true"><i /><i /><i /><Icon name="spark" width="30" height="30" /></span><h3>给新的发现，留一页空白。</h3><p>论文和科研经历，将在有真实内容后更新。</p><div className="research-categories"><span>论文</span><span>科研项目</span><span>实验记录</span></div></div>}<a className="notebook-footer" href="/articles/"><span>文章区已开放，第一篇还在路上。</span><Icon name="arrow" width="16" height="16" /></a></Reveal></div></section>

    <section id="skills" className="skills-section section wrap" aria-labelledby="skills-title"><Reveal><Chapter number="04">TOOLS & CURIOSITIES</Chapter><div className="section-heading"><div><h2 id="skills-title">构建的工具。<span>探索的方向。</span></h2><p>正在使用的技术，以及保持关注的领域。</p></div><span className="skill-hint"><Icon name="spark" width="14" height="14" />点选一个，展开看看</span></div><Skills /></Reveal></section>

    <section id="contact" className="contact-section section" aria-labelledby="contact-title"><div className="contact-atmosphere" aria-hidden="true"><span /><span /><span /></div><Reveal className="contact-inner wrap"><Chapter number="05">A CONVERSATION STARTS HERE</Chapter><div className="contact-star" aria-hidden="true">✧</div><p className="contact-kicker">很高兴，你来到了这里。</p><h2 id="contact-title">让灵感，<span>碰个面。</span></h2><p className="contact-description">聊聊技术、交换想法，或者只是打个招呼。</p><Contact /><p className="contact-signature serif">See you somewhere in the stars.</p></Reveal></section>
  </main><footer className="site-footer wrap"><div className="footer-top"><a className="footer-brand serif" href="#home">buluku<span>.</span></a><p>一个放代码，也放想象力的地方。</p><a className="back-top" href="#home">回到顶部<Icon name="down" width="15" height="15" /></a></div><div className="footer-bottom"><p className="mono">© 2026 BULUKU · MADE WITH CURIOSITY</p><nav aria-label="版本与源码"><a href="/">V1 简约</a><a href="/v2/">V2 星环</a><span aria-current="page">V3 黄昏</span><a href={profile.repository} target="_blank" rel="noopener noreferrer">源码<Icon name="northeast" width="12" height="12" /></a></nav><span className="footer-end mono">END OF THIS CHAPTER <span>✧</span></span></div></footer></>;
}
