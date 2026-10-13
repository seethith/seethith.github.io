# buluku · 个人主页

从零编写的个人主页原型，没有使用网站模板。技术栈为 Astro、React、TypeScript 和 Tailwind CSS。Astro 生成静态页面，React 只负责需要互动的小实验。

## 在线访问与自动发布

- 第一版：https://seethith.github.io/
- 第二版：https://seethith.github.io/v2/
- 第三版：https://seethith.github.io/v3/
- 源码：https://github.com/seethith/seethith.github.io
- 使用 GitHub Pages 和 `.github/workflows/deploy.yml` 自动发布。
- 向 `main` 分支推送修改后，GitHub 会先检查类型，再构建并发布。可在仓库 Actions 页面查看进度或手动重跑。
- 仓库 Settings → Pages → Build and deployment 的 Source 为 **GitHub Actions**。
- `astro.config.mjs` 中的 `site` 对应正式网址。这个仓库直接使用域名根路径，不需要设置 `base`。
- GitHub 构建使用 Node.js 24，本地可用 `nvm use` 切换。

## 本地运行

```sh
npm install
npm ci --prefix portfolio-v2
npm ci --prefix portfolio-v3
npm run dev
```

使用终端打印的本地地址打开网站。当前 Astro 版本会在后台运行开发服务，可用 `npx astro dev stop` 停止。

```sh
npm run check
npm run build
npm run preview
```

`dist/` 为可部署的静态输出。不需要数据库、账号系统或 AI API 密钥。

## 第二版 Portfolio

`portfolio-v2/` 是独立的 Next.js App Router 项目，使用 React、TypeScript、Tailwind CSS 和 Framer Motion。第一版保持 Astro，两个版本由同一个 GitHub Pages 工作流发布。

```sh
npm run dev:v2
```

打开终端打印地址下的 `/v2/`。完整构建会先生成第一版，再将 Next.js 的静态导出复制到 `dist/v2/`。Next.js 设置了 `basePath: '/v2'`、`output: 'export'` 和 `trailingSlash: true`，无需服务器。

- `portfolio-v2/src/lib/content.ts`：名字、项目、链接和技术兴趣。项目源码未提供时明确显示「源码待补充」。
- `portfolio-v2/src/app/page.tsx`：关于、作品、经历、文章和联系方式。研究、论文、竞赛、实习目前是明确的待补充位置；请用真实资料替换。
- `portfolio-v2/src/components/Orbital.tsx`：原创 SVG 光环、轻量 Canvas 星点与鼠标视差。离开视口或切换后台时停止 Canvas 循环，支持手动暂停及系统减少动态效果。
- `portfolio-v2/src/components/Skills.tsx`：可点击及键盘操作的领域卡片。
- `portfolio-v2/src/components/Header.tsx`：导航、深浅色和三种主题色；偏好单独保存，不影响第一版。
- `portfolio-v2/src/app/globals.css`：视觉与响应式布局。
- `portfolio-v2/public/images/`：原创 SVG 项目概念封面及分享图，项目图片延迟加载。

默认深色。主要链接和内容在静态 HTML 中可用；没有提供邮箱时，联系入口使用真实 GitHub 账号。文章入口复用第一版的 Markdown 文章系统。

## 第三版 · 黄昏研究室

`portfolio-v3/` 是独立的 Next.js + React + Tailwind CSS + Framer Motion 项目。`npm run dev:v3` 启动开发服务，在打印地址后打开 `/v3/`。完整 `npm run check` 检查三版，`npm run build` 将三版合并到 `dist/`，同一次 GitHub Pages 发布中分别保留 `/`、`/v2/` 和 `/v3/`。

这版使用原创日系动画风格插画，以黄昏 / 星夜两种氛围、轻微视差、缓慢光线与星点呈现。人物是虚构的品牌插画，不代表站长本人形象。生成提示词和资产说明见 `portfolio-v3/ART_DIRECTION.md`；原图保存在 `portfolio-v3/artwork/`，网站使用已压缩的 AVIF 和 WebP。夜景在切换时加载，项目图和关于区图片延迟加载。

- `portfolio-v3/src/lib/content.ts`：项目、技能方向、GitHub 链接和研究条目。论文与科研列表默认留空，只在有真实资料后填写。
- `portfolio-v3/src/app/page.tsx`：页面内容与结构，文章链接复用原来的 Markdown 文章区。
- `portfolio-v3/src/components/Hero.tsx`：首屏动画、滚动视差、氛围切换与暂停。
- `portfolio-v3/src/components/Atmosphere.tsx`：黄昏 / 星夜与暂停偏好，独立于前两版。
- `portfolio-v3/src/components/Projects.tsx`：项目分类筛选与卡片光影。
- `portfolio-v3/src/components/Skills.tsx`：可用键盘选择的技能方向。
- `portfolio-v3/src/app/globals.css`：视觉系统和响应式布局。

支持系统减少动态效果；首屏离开视口或页面进入后台时，氛围动画会暂停。无 JavaScript 时仍可阅读正文、查看全部作品并打开链接。

## 第一版页面和内容

- `src/pages/index.astro`：主页、小工具和文章区。
- `src/pages/lab/ripple.astro`：独立的像素潮汐实验。
- `src/data/site.ts`：昵称、简介、象棋工具网址和收藏链接。
- `src/components/Elsewhere.astro`：分层卡片链接区。
- `src/components/RippleField.tsx`：Canvas 点阵、指针交互、涟漪、暂停和幅度调节。
- `src/components/PalettePlay.tsx`：五组配色和色号复制。
- `src/components/Appearance.astro`：浅色、深色、跟随系统，以及蓝、青绿、紫、樱粉四种主题色。
- `src/styles/global.css`：整体视觉、字体、间距和响应式规则。

GitHub 入口已关联账号 `seethith`。象棋工具使用腾讯云外部链接，在新标签页打开。

添加链接时，在 `src/data/site.ts` 的 `collectedLinks` 中填写名称、网址和简短说明。

## 增加一个小玩意

1. 在 `src/components/` 创建 React 组件，把交互状态放在组件内部。
2. 在 `src/pages/lab/` 创建 `.astro` 页面，复用 `Layout.astro`。
3. 使用 `client:load` 启用页面里的交互组件，或对屏幕下方的组件使用 `client:visible`。
4. 在主页小工具区添加卡片，并更新作品数量。
5. 执行类型检查和构建，检查桌面、手机和键盘交互。

所有演示在浏览器里运行。配色复制在浏览器拒绝剪贴板访问时会显示色号；减少动态效果的系统设置会让点阵默认暂停。

右上角外观设置保存在访客浏览器中，刷新、跨页面访问后保留，默认跟随系统。主题色同步作用于链接、卡片装饰和像素潮汐。浏览器禁用本地存储时仍可切换，重新打开页面会恢复默认。颜色统一在 `global.css` 开头定义，页面加载前恢复外观以减少闪烁。

## 发布文章

1. 在 `src/content/articles/` 新建 Markdown 文件，或复制 `first-post.md` 草稿。文件名就是网址的一部分，如 `my-first-post.md` 对应 `/articles/my-first-post/`。
2. 填写顶部的 `title`、`date` 和可选的 `description`，在下方写正文。
3. 准备发布时设为 `draft: false`；草稿默认隐藏，不出现在主页、文章列表或生成的文章页面中。
4. 推送到 `main` 后自动发布。首页展示最近三篇文章，`/articles/` 展示全部文章，按日期倒序排列。

文章样例：

```markdown
---
title: "文章标题"
description: "一句话摘要（可选）"
date: 2026-10-13
draft: false
---

正文从这里开始。
```

仓库中的草稿文件仍属于公开源码；`draft` 只控制网站是否展示。现有 `first-post.md` 是使用示例，没有正式发布。
