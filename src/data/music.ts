export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  src: string;
  duration?: number;
  artwork?: 'violet' | 'blue' | 'rose' | 'amber';
  cover?: string;
  credit?: { label: string; href: string };
}

// Audio supplied by the owner, remuxed to M4A without re-encoding.
export const musicTracks: MusicTrack[] = [
  { id: 'zhong-jian-ren', title: '中间人', src: '/music/zhong-jian-ren.m4a', duration: 201.10, artwork: 'violet' },
  { id: 'just-two-of-us', title: 'just two of us', src: '/music/just-two-of-us.m4a', duration: 213.25, artwork: 'blue' },
  { id: 'yan-wu-xie', title: '燕无歇', src: '/music/yan-wu-xie.m4a', duration: 175.66, artwork: 'rose' },
  { id: 'yan-fu', title: '眼福', src: '/music/yan-fu.m4a', duration: 262.57, artwork: 'amber' },
];
