import type { Metadata, Viewport } from 'next';
import { MotionProvider } from '@/components/Motion';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://seethith.github.io'),
  title: 'buluku — 探索、构建、创造',
  description: 'buluku 的个人空间。探索 AI、Web 与创意编程，分享象棋工具、配色实验和像素潮汐。',
  alternates: { canonical: '/v2/' },
  authors: [{ name: 'buluku', url: 'https://github.com/seethith' }],
  openGraph: { title: 'buluku — 探索、构建、创造', description: '代码、好奇心，以及一些不一样的作品。', url: '/v2/', siteName: 'buluku', locale: 'zh_CN', type: 'website', images: [{ url: '/v2/images/social.png', width: 1200, height: 630, alt: 'buluku 个人主页第二版' }] },
  twitter: { card: 'summary_large_image', title: 'buluku — 探索、构建、创造', images: ['/v2/images/social.png'] },
  icons: { icon: '/v2/icon.svg' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#08090e' };

const appearanceScript = `(()=>{try{const t=localStorage.getItem('buluku-v2-theme');const a=localStorage.getItem('buluku-v2-accent');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;if(['violet','blue','mint'].includes(a))document.documentElement.dataset.accent=a;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',t==='light'?'#f5f5f8':'#08090e')}catch{}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" data-theme="dark" data-accent="violet" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: appearanceScript }} /><noscript><style>{`.reveal{opacity:1!important;transform:none!important}.appearance,.menu-button,.orbital-caption button,.copy-contact{display:none!important}.mobile-nav-fallback{display:flex!important}`}</style></noscript></head>
    <body><MotionProvider>{children}</MotionProvider></body>
  </html>;
}
