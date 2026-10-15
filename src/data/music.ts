export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover?: string;
  credit?: { label: string; href: string };
}

// Add the owner's chosen music here. Files can live in public/music/.
export const musicTracks: MusicTrack[] = [];
