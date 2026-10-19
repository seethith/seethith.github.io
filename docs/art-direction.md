# 暮色天空 / 视觉细化

保留第一版的布局与交互，以统一的字形、留白、细边框和项目插画形成一致的视觉。浅色为暖白与雾蓝，深色为墨蓝；二次元氛围来自天空绘画和光色，不增加人物或文案。

## 参考

- [Pentagram / Isomorphic Labs](https://www.pentagram.com/work/isomorphic-labs)：参考网格、克制配色，以及字体、图形与动效的一致性。
- [《铃芽之旅》官网](https://suzume-tojimari-movie.jp/)：参考背景插画承担氛围、信息层保持简洁的处理。没有使用其图片、角色或页面源码。
- [Google Fonts / Manrope](https://github.com/google/fonts/tree/main/ofl/manrope)：自托管拉丁字符可变字体，用于名字和字标；许可证位于 `public/fonts/Manrope-OFL.txt`。

## 实现

- `src/styles/art-direction.css`：色彩、字形、背景遮罩、玻璃材质及项目画面。
- 新访客默认使用暮色天空，已有访客继续保留原有选择；可以切换至黑白插画、柔光渐变或关闭壁纸。
- 插画分为桌面、手机与设置缩略图三个 WebP 文件；没有增加 JavaScript 动画依赖。
- 所有装饰层不拦截点击。沿用跨页音乐、原有布局、共享画布转场和减少动态效果设置。

## 插画来源与文件

使用 Codex 内置 imagegen 生成，未使用 CLI。生成后仅通过 Sharp 缩放和编码为 WebP，没有再次修改画面。

- 原始生成文件：`/Users/buluku/.codex/generated_images/01a11e51-7674-71f1-929a-61b5b68bb262/exec-3979d35a-1b46-44cd-8f4c-695239f480b4.png`
- 桌面：`public/images/wallpapers/dusk.webp`
- 手机：`public/images/wallpapers/dusk-small.webp`
- 缩略图：`public/images/wallpapers/dusk-thumb.webp`

### 生成提示词

```text
Use case: stylized-concept / illustration-story.
Asset type: original cinematic anime background illustration for a refined personal developer portfolio website, landscape 16:9.
Create a beautiful, understated Japanese animation background painting of the blue hour over a quiet coastal town. A broad atmospheric sky occupies the upper 75% of the image. Hand-painted delicate clouds form a soft diagonal composition, blending muted periwinkle, dusty mauve, silver-blue and a thin warm apricot horizon. At the lower right, a distant layered Japanese seaside neighborhood and tiny warm illuminated windows. A quiet sea horizon and distant hazy mountains, detailed but calm. A small silhouetted utility pole near the extreme right is acceptable; no foreground heavy objects. Fine painted detail, luminous cloud edges, nuanced air perspective, sophisticated film background color grading. The left 40% should stay visually quiet and low contrast with soft haze, leaving space for website text. Compose the most beautiful illuminated cloud formations and town on the right half. Peaceful, tender, atmospheric, contemporary. A fully finished beautiful background artwork, not a website mockup. Restrained saturation and realistic luminous sky, no hard neon.
Constraints: no characters, no people, no text, no logos, no watermarks, no borders, no UI, no stars pattern, no oversized moon or sun, no recognizable existing film composition. Full bleed. Preserve a clean airy horizon and subtle rich painting texture.
```
