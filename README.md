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

外观设置提供暮色天空、黑白插画、柔光渐变、关闭壁纸四种背景，以及独立的樱花开关。新访客默认使用暮色天空并开启少量樱花，老访客保留已保存的背景；系统要求减少动态效果时停用樱花。关闭壁纸会恢复原先的纯色布局。背景和樱花设置同样在本机保存，并在站内页面间保持一致。樱花由原创 Canvas 路径绘制，桌面 5 片、手机 3 片，限制在首屏两侧，离开首屏和进入其他页面后停止；无额外动画依赖，装饰层不会拦截点击。

## 视觉与动效

当前首页采用片头舞台构图，主要样式位于 `src/styles/stage.css`：超大名字、首屏人物位置和章节导航组成一个空间。沿用现有背景、字体及模型资源；工具采用一大两小的陈列，文章空状态与外部链接改为轻量排版。此前的视觉样式保留在 `refinement.css` 与 `art-direction.css`。`src/scripts/page-motion.ts` 使用原生 Web Animations 和 IntersectionObserver 实现文字揭幕、分组滚动入场、鼠标高光和点阵卡片的轻微视差，不增加动画依赖或劫持滚动。

内容默认可见，只有脚本正常加载后才增强动画；系统减少动态效果时停用揭幕与鼠标动态。触屏不启用鼠标视差，页面切换时取消动画、观察器和事件监听，避免累积；音乐、外观和看板娘沿用原有的跨页持久化。

像素潮汐仅通过小工具卡片进入独立实验页，首页不加载波浪画布。实验页保留指针拨动、涟漪、暂停、幅度调节和键盘交互；离屏、后台和暂停时停止动画循环，手机减少网格密度，系统减少动态效果时保持静止。

`src/scripts/route-continuity.ts` 与 `src/styles/continuity.css` 管理连续转场：从小工具卡片展开画布、返回收回、文章列表与正文标题衔接。使用浏览器原生 View Transitions 和已有 Astro 路由，不新增动画库；不支持的浏览器直接切页。只为当前一对元素命名，避免多个入口冲突；跨页前保留外观属性，音乐独立持久化且不自动播放。文章正文转场在发布真实文章后生效。

下半页使用半透明阅读遮罩，壁纸一直延续至页脚。`src/styles/glass.css` 统一设置面板和播放器的透色、背景模糊、边缘高光与内部控件；不支持背景模糊时自动使用更实的底色。`src/scripts/panel-motion.ts` 提供可中断的展开／收起过渡，收起时立即退出键盘焦点范围，减少动态效果时直接切换。

播放器采用唱片卡套结构：切角玻璃底板、探出的唱片和向上展开的歌单共用一个外形，播放按钮始终停留在底部；仅播放时唱片缓慢转动。外观面板使用“主题／背景／氛围”侧边索引，支持方向键、Home、End 和 Esc，切换时轻微淡入。两者保留透色玻璃，手机窄屏会重新排列音量控制；系统减少动态效果时取消展开、切页与唱片动画。

主题色与深浅色使用有类型的 CSS 颜色变量同步过渡；壁纸采用独立叠层淡入淡出，支持暮色天空、黑白插画、柔光渐变和关闭。首次打开立即恢复偏好，后续操作才过渡，减少动态效果时取消过渡。

新增的 `src/styles/art-direction.css` 统一暖白／墨蓝色彩、Manrope 字标、玻璃画布和项目插画卡片。暮色天空为原创生成的背景画，桌面约 127 KB、手机约 49 KB；拉丁字体子集约 18 KB，自托管且附 OFL 许可。参考来源、生成提示词和资产记录见 [视觉说明](docs/art-direction.md)。

## 看板娘

看板娘使用 Live2D 官方公开模型 Hiyori Momose（百瀬ひより），通过 Cubism Web Core、PixiJS 6 和 pixi-live2d-display 0.4 渲染。模型保存在 `public/live2d/Hiyori/`，使用原有的转头、眨眼和头发物理；点击角色播放模型自带动作。自制墨色／灵梦模型及其专用参数驱动已从网站移除。

键盘聚焦角色后可用方向键转头，Home 回正，回车打招呼；不会触发音乐播放。

人物使用明确尺寸的首屏槽位参与构图，不改变名字、介绍和按钮的布局。滚出首屏或进入文章／实验页后收成右下角入口，点击可展开；小于 360 px 的屏幕默认只显示入口。音乐和人物入口分居底部两侧。关闭状态保存在 `buluku-mascot`，右上角外观设置可以重新开启。页面切换前将同一个模型画布移回持久化根节点，切换后再放进新首屏，避免丢失画布或重复加载模型。

画布随 Astro 页面切换持久化；关闭、隐藏标签页或收起手机面板时停止渲染，系统减少动态效果时显示静态模型。24 FPS、最高 2 倍像素密度，模型及引擎按需加载，首次正文绘制不等待它们。网络或 WebGL 加载失败会出现重试入口。模型纹理和运行时全部托管在本站，无第三方 CDN 运行时依赖。

- UI 与交互：`src/components/Mascot.astro`、`src/scripts/mascot.ts`
- 渲染：`src/scripts/live2d-renderer.ts`
- 样式：`src/styles/global.css` 的 Live2D 段
- 模型、运行时、来源与授权：`public/live2d/`，见 `NOTICE.txt`
- Hiyori 资产来源固定为 CubismWebSamples `4-r.7` 对应提交，出处及许可链接见 `public/live2d/NOTICE.txt`。
- `pixi-live2d-display` 意外携带其发布工具 `gh-pages` 作为运行依赖，使用 override 固定为修复原型污染且不引入新版 globby 问题的 6.1.1；本站部署仍使用原来的 GitHub Actions。

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

## 舞台版回退点

本次调整前的完整版本保存在 Git 标签 `checkpoint/pre-stage-2026-10-20`，对应提交 `7ed4731`。回退时恢复该版本的受影响文件并新建提交，推送后沿用 GitHub Pages 发布流程，无需重建仓库或改动素材。
