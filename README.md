# buluku · 个人主页

从零编写的个人主页原型，没有使用网站模板。技术栈为 Astro、React、TypeScript 和 Tailwind CSS。Astro 生成静态页面，React 只负责需要互动的小实验。

## 在线访问与自动发布

- 网站：https://seethith.github.io/
- 源码：https://github.com/seethith/seethith.github.io
- 使用 GitHub Pages 和 `.github/workflows/deploy.yml` 自动发布。
- 向 `main` 分支推送修改后，GitHub 会先检查类型，再构建并发布。可在仓库 Actions 页面查看进度或手动重跑。
- 仓库 Settings → Pages → Build and deployment 的 Source 为 **GitHub Actions**。
- `astro.config.mjs` 中的 `site` 对应正式网址。这个仓库直接使用域名根路径，不需要设置 `base`。
- GitHub 构建使用 Node.js 24，本地可用 `nvm use` 切换。

## 本地运行

```sh
npm install
npm run dev
```

使用终端打印的本地地址打开网站。当前 Astro 版本会在后台运行开发服务，可用 `npx astro dev stop` 停止。

```sh
npm run check
npm run build
npm run preview
```

`dist/` 为可部署的静态输出。不需要数据库、账号系统或 AI API 密钥。

## 页面和内容

- `src/pages/index.astro`：主页、小工具和文章区。
- `src/pages/lab/ripple.astro`：独立的像素潮汐实验。
- `src/data/site.ts`：昵称、简介、象棋工具网址和收藏链接。
- `src/components/Elsewhere.astro`：分层卡片链接区。
- `src/components/RippleField.tsx`：Canvas 点阵、指针交互、涟漪、暂停和幅度调节。
- `src/components/PalettePlay.tsx`：五组配色和色号复制。
- `src/components/Appearance.astro`：浅色、深色、跟随系统，以及蓝、青绿、紫、樱粉四种主题色。
- `src/components/Atmosphere.astro`：固定全屏背景与轻量 Canvas 樱花。后台和系统减少动态效果时暂停。
- `src/components/MusicPlayer.tsx`：左下角音乐卡片，展开歌单、播放暂停、切歌、进度、音量与列表／单曲循环。
- `src/data/music.ts`：站长选择的歌曲、音源、封面及可选来源说明。
- `public/images/wallpapers/`：用户提供的黑白插画，压缩为桌面、手机和设置缩略图三个 WebP 文件。
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

外观设置还提供黑白插画、柔光渐变、关闭壁纸三种背景，以及独立的樱花开关。默认使用黑白插画并开启少量樱花；系统要求减少动态效果时停用樱花。关闭壁纸会恢复原先的纯色布局。背景和樱花设置同样在本机保存，并在站内页面间保持一致。樱花由原创 Canvas 路径绘制，无额外动画依赖；装饰层不会拦截点击。

## 音乐播放器

播放器使用原生 `<audio>`，只在点击播放或歌单曲目时加载音源，不自动播放；刷新页面也保持暂停。通过 Astro `ClientRouter` 与持久化 React 组件，站内进入文章、实验页和返回时保留同一个播放器及播放进度。完整刷新、打开新标签页和离开本站不属于连续播放范围。

当前歌单按站长提供的顺序收录《中间人》《just two of us》《燕无歇》《眼福》。原文件只有 AAC 音轨，已无损封装为支持渐进播放的 M4A，保存在 `public/music/`，没有重新压缩。歌手信息未提供时不显示，封面使用内置的四色音符图案。

在 `src/data/music.ts` 中添加或调整歌曲：

```ts
{ id: 'song-id', title: '歌曲名', artist: '歌手', src: '/music/song.m4a', duration: 200, cover: '/music/cover.webp' }
```

音频放在 `public/music/`，也可以填写支持浏览器播放的 HTTPS 音频直链。`artist`、`cover`、`duration` 可省略；`duration` 单位为秒，用于未加载音频时展示时长；`credit: { label, href }` 可添加来源说明。音量和循环模式保存在本机，播放状态不在刷新时恢复。未配置曲目时显示空歌单。本站的外观控件与樱花画布也跨页保留，避免切页后失效或重复启动。

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
