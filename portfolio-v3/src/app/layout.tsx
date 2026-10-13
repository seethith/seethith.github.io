import type { Metadata, Viewport } from 'next';
import { MotionProvider } from '@/components/Motion';
import { AtmosphereProvider } from '@/components/Atmosphere';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://seethith.github.io'),
  title: 'buluku — 把好奇，写成作品',
  description: 'buluku 的个人主页。AI、Web、创意编程，以及一些好玩的小工具。欢迎来到黄昏里的研究室。',
  alternates: { canonical: '/v3/' },
  authors: [{ name: 'buluku', url: 'https://github.com/seethith' }],
  openGraph: { title: 'buluku — 把好奇，写成作品', description: '代码、晚霞，和一点点想象力。', url: '/v3/', siteName: 'buluku', locale: 'zh_CN', type: 'website', images: [{ url: '/v3/images/social.jpg', width: 1200, height: 675, alt: 'buluku 的黄昏研究室：原创日系动画风格个人主页' }] },
  twitter: { card: 'summary_large_image', title: 'buluku — 把好奇，写成作品', images: ['/v3/images/social.jpg'] },
  icons: { icon: '/v3/icon.svg' },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#101422' };
const preferences = `(()=>{try{document.documentElement.dataset.scene=localStorage.getItem('buluku-v3-scene')==='night'?'night':'dusk';document.documentElement.dataset.still=localStorage.getItem('buluku-v3-still')==='true'?'true':'false'}catch{}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" data-scene="dusk" data-still="false" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: preferences }} /><noscript><style>{`.reveal{opacity:1!important;transform:none!important}.scene-toggle,.hero-controls,.menu-toggle,.project-filters,.copy-link{display:none!important}`}</style></noscript></head><body><MotionProvider><AtmosphereProvider>{children}</AtmosphereProvider></MotionProvider></body></html>;
}
