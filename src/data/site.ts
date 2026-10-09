// Start here when personalizing the site. The copy is provisional.
export const profile = {
  name: 'buluku',
  label: '一个持续生长的个人空间',
  intro: '喜欢探索，也喜欢动手。这里收着我的小实验、偶然的灵感，以及一些暂时没什么用的东西。',
};

export const futureProjects = [
  { number: '03', title: '下一个奇怪的点子', description: '也许是一个小游戏，也许是一件完全没用的东西。', label: '留给下一次突发奇想' },
];

export const socialLinks = [
  { title: 'GitHub', url: 'https://github.com/seethith' },
];

// Add a real URL to turn a reserved card into a link.
export const collectedLinks: {
  title: string;
  description: string;
  category: string;
  url?: string;
}[] = [
  { title: '这间好奇心事务所', description: '打开这个小小主页的源代码，看看它是怎么长出来的。', category: '自己的作品', url: 'https://github.com/seethith/seethith.github.io' },
  { title: '灵感收集站', description: '留给那些让人忍不住多看一眼的地方。', category: '灵感收藏' },
  { title: '顺手的小工具', description: '慢慢收集简单好用、值得分享的小东西。', category: '常用工具' },
  { title: '朋友的数字角落', description: '给未来遇见的有趣的人，留一个位置。', category: '友情链接' },
];
