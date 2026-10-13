export const profile = {
  name: 'buluku',
  github: 'https://github.com/seethith',
  repository: 'https://github.com/seethith/seethith.github.io',
  description: '写代码，做工具。也给奇怪的灵感留一点空间。',
};

export const projects = [
  {
    id: '01', name: '象棋 · 下一步', category: 'CHESS / INTERACTIVE TOOL',
    description: '把棋局摆出来，让下一步更清楚。一个用来探索局面、分析走法的象棋小工具。',
    result: '支持摆棋、局面保存与走法分析',
    tags: ['Web App', 'CloudBase'], image: '/v2/images/xiangqi.svg',
    alt: '深色棋盘上，一枚红色棋子与蓝色分析路径的概念封面',
    href: 'https://xiangqi-xiangqi-d9g6ly9hu93258e7d.webapps.tcloudbase.com/',
    source: null,
  },
  {
    id: '02', name: '配色实验室', category: 'COLOR / DESIGN UTILITY',
    description: '给下一个灵感，找一组刚刚好的颜色。',
    result: '5 组配色，点一下复制色值',
    tags: ['React', 'TypeScript'], image: '/v2/images/palette.svg',
    alt: '蓝、紫、杏、橙色的立体色卡排列',
    href: '/#palette',
    source: 'https://github.com/seethith/seethith.github.io/blob/main/src/components/PalettePlay.tsx',
  },
  {
    id: '03', name: '像素潮汐', category: 'CANVAS / GENERATIVE PLAY',
    description: '点一下，让一场微小的潮汐发生。',
    result: '可交互的涟漪与强度控制',
    tags: ['Canvas', 'React'], image: '/v2/images/tides.svg',
    alt: '深蓝背景中由发光像素组成的层层涟漪',
    href: '/lab/ripple/',
    source: 'https://github.com/seethith/seethith.github.io/blob/main/src/components/RippleField.tsx',
  },
];

// These describe areas of interest, not certifications or claimed proficiency.
export const skills = [
  { id: 'ai', name: 'Artificial Intelligence', short: 'AI', label: '人工智能', icon: 'spark',
    summary: '让想法更快变成可以使用的东西。', detail: '关注 AI 辅助创作、工具构建与人机交互，探索模型能力和真实需求之间的连接。', tags: ['AI-assisted building', 'Human × AI', 'Prototyping'] },
  { id: 'ml', name: 'Machine Learning', short: 'ML', label: '机器学习', icon: 'nodes',
    summary: '从数据里，寻找有意义的规律。', detail: '关注模型如何学习、如何评估，以及实验结果如何被清楚地解释。研究成果会在有内容后更新。', tags: ['Models', 'Evaluation', 'Experiments'] },
  { id: 'web', name: 'Web Development', short: 'Web', label: '网页开发', icon: 'window',
    summary: '在浏览器里，把体验认真做好。', detail: '从响应式界面到细小的交互反馈，用 React、Next.js 和 TypeScript 构建轻快、可访问的网站。', tags: ['React', 'Next.js', 'TypeScript'] },
  { id: 'security', name: 'Security', short: 'Security', label: '安全', icon: 'shield',
    summary: '对系统的边界，保持好奇。', detail: '关注 Web 安全、隐私与可靠性。让安全意识成为构建产品时的一部分。', tags: ['Web security', 'Privacy', 'Reliability'] },
  { id: 'code', name: 'Programming Languages', short: 'Code', label: '编程语言', icon: 'code',
    summary: '用代码表达想法，用细节完成作品。', detail: '这个主页和交互实验主要使用 TypeScript、JavaScript 与 CSS。工具随问题而选，代码为体验服务。', tags: ['TypeScript', 'JavaScript', 'CSS'] },
];
