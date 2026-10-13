import { useState } from 'react';

const palettes = [
  { name: '海蓝', colors: ['#253C59', '#799BA6', '#CBD5C8', '#F2DFC3', '#D88C6E'] },
  { name: '浅紫', colors: ['#423A51', '#9480A4', '#C2A6B5', '#E7D7D4', '#AAC0A7'] },
  { name: '咖啡', colors: ['#352C2A', '#8C6551', '#BC9275', '#D8C4AF', '#ECE4D9'] },
  { name: '蓝橙', colors: ['#233D6B', '#4878A9', '#8DB6D3', '#D1E2E8', '#F0BC82'] },
  { name: '橘绿', colors: ['#234D44', '#6C8A6B', '#CAD3A6', '#EFBD65', '#E67D47'] },
];

export default function PalettePlay() {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState('点击色块，复制颜色');
  const palette = palettes[index]!;
  async function copy(color: string) {
    try { await navigator.clipboard.writeText(color); setMessage(`已复制 ${color}`); }
    catch { setMessage(`颜色：${color}`); }
  }
  return <div className="palette-play">
    <div className="palette-swatches" aria-label="当前配色">{palette.colors.map(color => <button key={color} style={{ backgroundColor: color }} onClick={() => copy(color)} aria-label={`复制颜色 ${color}`} title={color}><span>{color}</span></button>)}</div>
    <div className="palette-caption"><span aria-live="polite">{palette.name}</span><button onClick={() => { setIndex(i => (i + 1) % palettes.length); setMessage('点击色块，复制颜色'); }} className="icon-button" aria-label="换一组配色" title="换一组配色"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 8a8 8 0 0 0-13-2L3 9m0-5v5h5m-3 7a8 8 0 0 0 13 2l3-3m0 5v-5h-5" /></svg></button></div>
    <p className="palette-feedback" aria-live="polite">{message}</p>
  </div>;
}
