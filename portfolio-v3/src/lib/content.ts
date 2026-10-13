export const profile = {
  name: 'buluku',
  github: 'https://github.com/seethith',
  repository: 'https://github.com/seethith/seethith.github.io',
};

export const projects = [
  { id: '01', title: '象棋 · 下一步', english: 'A LITTLE STRATEGY', type: 'tool', category: '实用工具',
    description: '摆出棋局，分析走法。给每一个下一步，多一点思路。',
    result: '摆棋 · 保存局面 · 走法分析', tags: ['Web App', 'CloudBase'],
    href: 'https://xiangqi-xiangqi-d9g6ly9hu93258e7d.webapps.tcloudbase.com/',
    source: null, cover: 'chess', image: '/v3/images/chess.svg', alt: '薰衣草色光影下的象棋棋盘概念插画' },
  { id: '02', title: '配色实验室', english: 'COLORS, COLLECTED', type: 'tool', category: '实用工具',
    description: '把喜欢的颜色收在一起，为下一个作品找一点灵感。',
    result: '5 组配色 · 点击复制色值', tags: ['React', 'TypeScript'], href: '/#palette',
    source: 'https://github.com/seethith/seethith.github.io/blob/main/src/components/PalettePlay.tsx', cover: 'palette', image: '/v3/images/palette.svg', alt: '柔和晚霞色系的五张浮动色卡' },
  { id: '03', title: '像素潮汐', english: 'A QUIET RIPPLE', type: 'experiment', category: '交互实验',
    description: '轻轻点一下，看像素慢慢散开。一个可以玩的微小世界。',
    result: '点击涟漪 · 强度调节 · 可暂停', tags: ['Canvas', 'React'], href: '/lab/ripple/',
    source: 'https://github.com/seethith/seethith.github.io/blob/main/src/components/RippleField.tsx', cover: 'tides', image: '/v3/images/tides.svg', alt: '深蓝色水面上由细小光点构成的涟漪' },
];

// Areas of practice and interest, never fabricated proficiency scores or credentials.
export const skills = [
  { id: 'web', label: 'Web Development', cn: '网页开发', icon: 'window', note: '让想法在浏览器里发生。',
    detail: '用组件构建界面，用细节打磨体验。这个主页就是一个持续更新的实践。', tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'], status: '正在使用' },
  { id: 'ai', label: 'Artificial Intelligence', cn: '人工智能', icon: 'spark', note: '和 AI 一起，把灵感做出来。',
    detail: '关注 AI 辅助开发、创作与人机交互，探索新的工具和表达方式。', tags: ['AI-assisted coding', 'Creative tools', 'Human × AI'], status: '兴趣方向' },
  { id: 'ml', label: 'Machine Learning', cn: '机器学习', icon: 'nodes', note: '好奇数据背后的规律。',
    detail: '关注模型、评估与实验方法。后续的学习和研究记录会放在这里。', tags: ['Models', 'Evaluation', 'Experiments'], status: '兴趣方向' },
  { id: 'security', label: 'Security', cn: '安全', icon: 'shield', note: '构建之外，也关心边界。',
    detail: '关注 Web 安全、隐私与可靠性，让工具在方便使用的同时保持稳妥。', tags: ['Web security', 'Privacy', 'Reliability'], status: '兴趣方向' },
  { id: 'code', label: 'Creative Coding', cn: '编程与视觉', icon: 'code', note: '代码也可以有一点温度。',
    detail: '用 JavaScript、Canvas 和动画，把平常的小交互变成值得停留的瞬间。', tags: ['JavaScript', 'Canvas', 'Framer Motion'], status: '正在实践' },
];

export const researchEntries: { title: string; kind: string; year: string; description: string; href?: string }[] = [];
