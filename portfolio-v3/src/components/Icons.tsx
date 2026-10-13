import type { SVGProps } from 'react';

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    northeast: <><path d="M6 18 18 6M6 6h12v12" /></>,
    down: <><path d="M12 4v16m-6-6 6 6 6-6" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    moon: <path d="M20 14a8.5 8.5 0 0 1-10-10A8.5 8.5 0 1 0 20 14Z" />,
    spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" /></>,
    nodes: <><circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="M7 6h10M6 8l5 8m7-8-5 8" /></>,
    window: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18M7 6.5h.01m3 0h.01M9 13l-2 2 2 2m6-4 2 2-2 2" /></>,
    shield: <><path d="m12 3 8 3v6c0 4-8 9-8 9s-8-5-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    code: <><path d="m7 6-5 6 5 6m10-12 5 6-5 6m-4-14-2 16" /></>,
    github: <><path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7m12 5v-3.5c0-1 .1-1.4-.5-2 3-.3 6-1.5 6-6.5a5 5 0 0 0-1.3-3.5 4.6 4.6 0 0 0-.1-3.5s-1.1-.4-3.6 1.3a12.5 12.5 0 0 0-6.5 0C6.5 2 5.4 2.3 5.4 2.3a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 4 9.3c0 5 3 6.2 6 6.5-.5.5-.7 1.2-.7 2v3.5" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="3" /><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    menu: <path d="M4 7h16M4 17h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    pause: <path d="M9 5v14M15 5v14" />,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    book: <><path d="M12 5c-4-3-9-1-9-1v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Zm0 0v15" /></>,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.spark}</svg>;
}
