import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { MusicTrack } from '../data/music';
import { createSleeveMotion } from '../scripts/panel-motion';

const volumeKey = 'buluku-music-volume';
const repeatKey = 'buluku-music-repeat';
const formatTime = (seconds: number) => {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
};

function Icon({ name }: { name: 'play' | 'pause' | 'list' | 'close' | 'previous' | 'next' | 'volume' | 'muted' | 'note' | 'repeat' | 'repeatOne' }) {
  const paths = {
    play: 'm9 5 11 7-11 7V5Z', pause: 'M8 5v14M16 5v14',
    list: 'M9 6h11M9 12h11M9 18h11M4 6h.1M4 12h.1M4 18h.1',
    close: 'm6 6 12 12M6 18 18 6', previous: 'M5 5v14M18 5 7 12l11 7V5Z',
    next: 'M19 5v14M6 5l11 7-11 7V5Z', volume: 'M11 5 6 9H3v6h3l5 4V5ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14',
    muted: 'M11 5 6 9H3v6h3l5 4V5Zm5 4 6 6m-6 0 6-6',
    note: 'M9 17V6l11-2v11M9 8l11-2M9 17c0 3-6 4-6 1s6-4 6-1Zm11-2c0 3-6 4-6 1s6-4 6-1Z',
    repeat: 'm17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3',
    repeatOne: 'm17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3m7-7 2-1v5',
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]} /></svg>;
}

function Cover({ track }: { track?: MusicTrack }) {
  return track?.cover
    ? <img src={track.cover} alt="" width="48" height="48" loading="lazy" />
    : <span className="music-cover-art" data-artwork={track?.artwork} aria-hidden="true"><span /><Icon name="note" /></span>;
}

export default function MusicPlayer({ tracks }: { tracks: MusicTrack[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelMotion = useRef<ReturnType<typeof createSleeveMotion> | null>(null);
  const selected = useRef(0);
  const request = useRef(0);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [volume, setVolume] = useState(0.35);
  const [muted, setMuted] = useState(false);
  const [repeatOne, setRepeatOne] = useState(false);
  const [error, setError] = useState('');
  const track = tracks[index];
  const displayDuration = duration || track?.duration || 0;
  const progress = displayDuration ? Math.min(100, time / displayDuration * 100) : 0;

  useEffect(() => {
    if (!panelRef.current) return;
    const motion = createSleeveMotion(panelRef.current);
    panelMotion.current = motion;
    return () => { motion.destroy(); panelMotion.current = null; };
  }, []);
  useEffect(() => { panelMotion.current?.setOpen(expanded); }, [expanded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let savedVolume = 0.35;
    try {
      const stored = localStorage.getItem(volumeKey);
      const parsed = stored === null ? NaN : Number(stored);
      if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) savedVolume = parsed;
      setRepeatOne(localStorage.getItem(repeatKey) === 'one');
    } catch { /* Volume remains usable without local storage. */ }
    audio.volume = savedVolume;
    setVolume(savedVolume);
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !playerRef.current?.contains(event.target)) setExpanded(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && playerRef.current?.contains(document.activeElement)) {
        setExpanded(false);
        expandRef.current?.focus();
      }
    };
    const closeOnNavigation = () => { panelMotion.current?.setOpen(false, true); setExpanded(false); };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', escape);
    document.addEventListener('astro:after-swap', closeOnNavigation);
    return () => {
      audio.pause();
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', escape);
      document.removeEventListener('astro:after-swap', closeOnNavigation);
    };
  }, []);

  async function play() {
    const audio = audioRef.current;
    const nextTrack = tracks[selected.current];
    if (!audio || !nextTrack) return;
    const currentRequest = ++request.current;
    setError('');
    setLoading(true);
    if (audio.dataset.track !== nextTrack.id || audio.error) {
      audio.src = nextTrack.src;
      audio.dataset.track = nextTrack.id;
      audio.load();
    }
    try {
      await audio.play();
    } catch (reason) {
      if (currentRequest !== request.current) return;
      if (reason instanceof DOMException && reason.name === 'AbortError') return;
      setPlaying(false);
      setError(reason instanceof DOMException && reason.name === 'NotAllowedError' ? '请再点击播放' : '这首歌暂时无法播放，可重试或换一首');
    } finally {
      if (currentRequest === request.current) setLoading(false);
    }
  }

  function pause() {
    request.current++;
    audioRef.current?.pause();
    setLoading(false);
    setPlaying(false);
  }

  function choose(nextIndex: number, startPlaying: boolean) {
    const audio = audioRef.current;
    if (!audio || !tracks.length) return;
    const next = (nextIndex + tracks.length) % tracks.length;
    if (next !== selected.current) {
      pause();
      selected.current = next;
      setIndex(next);
      setTime(0);
      setDuration(0);
      setError('');
      // Do not download a newly selected song while paused.
      audio.removeAttribute('src');
      delete audio.dataset.track;
      audio.load();
    } else if (audio.ended) {
      audio.currentTime = 0;
    }
    if (startPlaying) void play();
  }

  function changeVolume(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = value;
    audio.muted = false;
    setVolume(value);
    setMuted(false);
    try { localStorage.setItem(volumeKey, String(value)); } catch {}
  }

  function toggleRepeat() {
    const value = !repeatOne;
    setRepeatOne(value);
    try { localStorage.setItem(repeatKey, value ? 'one' : 'all'); } catch {}
  }

  return <aside className="music-player" ref={playerRef} aria-label="音乐播放器" data-playing={playing} data-expanded={expanded}>
    <audio ref={audioRef} preload="none" loop={repeatOne}
      onPlay={() => setPlaying(true)}
      onPlaying={() => { setPlaying(true); setLoading(false); }}
      onPause={() => setPlaying(false)}
      onWaiting={() => { if (audioRef.current && !audioRef.current.paused) setLoading(true); }}
      onLoadedMetadata={() => setDuration(Number.isFinite(audioRef.current?.duration) ? audioRef.current!.duration : 0)}
      onDurationChange={() => setDuration(Number.isFinite(audioRef.current?.duration) ? audioRef.current!.duration : 0)}
      onTimeUpdate={() => setTime(audioRef.current?.currentTime ?? 0)}
      onEnded={() => choose(selected.current + 1, true)}
      onError={() => { if (audioRef.current?.getAttribute('src')) { setError('这首歌暂时无法播放，可重试或换一首'); setLoading(false); setPlaying(false); } }}
    />
    <div className="music-sleeve">
    <div className="music-panel" id="music-playlist" ref={panelRef} hidden inert={!expanded} aria-hidden={!expanded}>
      <div className="music-panel-content">
      <div className="music-panel-heading"><span>我的歌单 <span className="music-count">{tracks.length.toString().padStart(2, '0')}</span></span><button type="button" className="music-icon-button" aria-label="收起歌单" onClick={() => { setExpanded(false); expandRef.current?.focus(); }}><Icon name="close" /></button></div>
      {track ? <>
        <ol className="music-track-list">
          {tracks.map((song, songIndex) => <li key={song.id}>
            <button type="button" className="music-track" aria-label={`${songIndex === index && (playing || loading) ? '暂停' : '播放'} ${song.title}`} aria-current={songIndex === index ? 'true' : undefined} onClick={() => songIndex === index && (playing || loading) ? pause() : choose(songIndex, true)}>
              <span className="music-track-number">{songIndex === index && playing ? <span className="music-equalizer" aria-hidden="true"><i /><i /><i /></span> : String(songIndex + 1).padStart(2, '0')}</span>
              <span className="music-track-copy"><strong>{song.title}</strong>{song.artist && <span>{song.artist}</span>}</span>
              {song.duration && <span className="music-track-duration">{formatTime(song.duration)}</span>}
              <Icon name={songIndex === index && playing ? 'pause' : 'play'} />
            </button>
          </li>)}
        </ol>
        <div className="music-seek"><input type="range" min="0" max={displayDuration || 1} step="0.1" value={Math.min(time, displayDuration || 1)} style={{ '--range-fill': `${progress}%` } as CSSProperties} disabled={!duration} aria-label="播放进度" aria-valuetext={`${formatTime(time)} / ${formatTime(displayDuration)}`} onChange={event => { const value = Number(event.target.value); if (audioRef.current) audioRef.current.currentTime = value; setTime(value); }} /><div className="music-time"><span>{formatTime(time)}</span><span>{formatTime(displayDuration)}</span></div></div>
        <div className="music-controls">
          <button type="button" className="music-icon-button" aria-label="上一首" onClick={() => choose(selected.current - 1, playing || loading)}><Icon name="previous" /></button>
          <button type="button" className="music-icon-button" aria-label="下一首" onClick={() => choose(selected.current + 1, playing || loading)}><Icon name="next" /></button>
          <div className="music-volume"><button type="button" className="music-icon-button" aria-label={muted ? '取消静音' : '静音'} onClick={() => { if (audioRef.current) audioRef.current.muted = !muted; setMuted(!muted); }}><Icon name={muted || volume === 0 ? 'muted' : 'volume'} /></button><input type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} style={{ '--range-fill': `${(muted ? 0 : volume) * 100}%` } as CSSProperties} onChange={event => changeVolume(Number(event.target.value))} aria-label="音量" aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)}%`} /></div>
        </div>
        <div className="music-panel-footer"><button type="button" className="music-repeat" aria-label={repeatOne ? '单曲循环，切换为列表循环' : '列表循环，切换为单曲循环'} onClick={toggleRepeat}><Icon name={repeatOne ? 'repeatOne' : 'repeat'} /><span>{repeatOne ? '单曲循环' : '列表循环'}</span></button><span>{String(index + 1).padStart(2, '0')} / {String(tracks.length).padStart(2, '0')}</span></div>
        {track.credit && <a className="music-credit" href={track.credit.href} target="_blank" rel="noopener noreferrer">{track.credit.label} ↗</a>}
      </> : <p className="music-empty">还没有添加歌曲</p>}
      {error && <p className="music-error" role="status">{error}</p>}
      </div>
    </div>
    <div className="music-mini">
      <button type="button" className="music-expand" ref={expandRef} aria-expanded={expanded} aria-controls="music-playlist" aria-label={expanded ? '收起歌单' : '展开歌单'} onClick={() => setExpanded(value => !value)}>
        <span className="music-mini-copy"><strong>{track?.title ?? '音乐'}</strong><span>{error ? '播放遇到问题' : loading ? '正在加载…' : track ? track.artist ?? `${formatTime(displayDuration)} · 我的歌单` : '暂无歌曲'}</span></span>
        <span className="music-list-icon"><Icon name="list" /></span>
      </button>
      <button type="button" className="music-play-button" aria-busy={loading} aria-label={playing || loading ? '暂停音乐' : '播放音乐'} disabled={!track} onClick={() => playing || loading ? pause() : void play()}><Icon name={playing || loading ? 'pause' : 'play'} /></button>
      <span className="music-mini-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></span>
    </div>
    </div>
    <button type="button" className="music-record" aria-label={expanded ? '收起唱片歌单' : '展开唱片歌单'} aria-controls="music-playlist" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>
      <span className="music-record-grooves" aria-hidden="true"><span className="music-cover"><Cover track={track} /></span></span>
    </button>
    <noscript>播放器需要启用 JavaScript。</noscript>
  </aside>;
}
