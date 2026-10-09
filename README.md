# buluku · 个人主页与小玩具实验室

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

- `src/pages/index.astro`：主页、作品区和关于我。
- `src/pages/lab/ripple.astro`：独立的像素潮汐实验。
- `src/data/site.ts`：暂用昵称、简介、未来项目卡片、社交入口和收藏链接。
- `src/components/Elsewhere.astro`：分层卡片链接区，没有网址的卡片显示为待收录，不会产生无效跳转。
- `src/components/RippleField.tsx`：Canvas 点阵、指针交互、涟漪、暂停和幅度调节。
- `src/components/PalettePlay.tsx`：五组配色和色号复制。
- `src/styles/global.css`：整体视觉、字体、间距和响应式规则。

昵称和介绍沿用首版文案。GitHub 入口已关联账号 `seethith`，其余联系方式和收藏网址可后续补充。

添加链接时，在 `src/data/site.ts` 的 `socialLinks` 或 `collectedLinks` 中填写名称和真实网址；收藏卡片还可以填写一句话介绍和分类。删除预留项即可隐藏对应卡片。

## 增加一个小玩意

1. 在 `src/components/` 创建 React 组件，把交互状态放在组件内部。
2. 在 `src/pages/lab/` 创建 `.astro` 页面，复用 `Layout.astro`。
3. 使用 `client:load` 启用页面里的交互组件，或对屏幕下方的组件使用 `client:visible`。
4. 在主页作品区添加带链接的卡片，或替换 `futureProjects` 的预留卡片，并更新作品数量。
5. 执行类型检查和构建，检查桌面、手机和键盘交互。

所有演示在浏览器里运行。配色复制在浏览器拒绝剪贴板访问时会显示色号；减少动态效果的系统设置会让点阵默认暂停。
