// Large turns use authored drawings. A settled pose never stays between two faces.
export function createMascotViews() {
  let selected = 2;
  let elapsed = 0.1;
  let weights = [0, 0, 1, 0, 0];
  let from = weights.slice();
  const step = 17.5;
  return {
    update(yaw: number, seconds: number): Record<string, number> {
      const dt = Number.isFinite(seconds) ? Math.max(0, Math.min(seconds, 0.05)) : 0;
      if (dt > 0) {
        const angle = Number.isFinite(yaw) ? Math.max(-35, Math.min(35, yaw)) : 0;
        const center = (selected - 2) * step;
        // Hysteresis prevents a small idle motion from alternating drawings at a boundary.
        if (Math.abs(angle - center) > step / 2 + 2) {
          const next = Math.max(0, Math.min(4, Math.round(angle / step) + 2));
          if (next !== selected) { selected = next; from = weights.slice(); elapsed = 0; }
        }
        elapsed = Math.min(0.09, elapsed + dt);
        const t = elapsed / 0.09;
        const mix = t * t * (3 - 2 * t);
        weights = from.map((w, i) => (1 - mix) * w + mix * Number(i === selected));
      }
      // Convert mixture weights to source-over alpha, keeping the face opaque while blending.
      const result: Record<string, number> = {};
      let above = 0;
      for (let i = 4; i >= 0; i--) {
        const w = weights[i]!;
        result[`ParamView${i}`] = w < 0.0001 ? 0 : Math.min(1, w / Math.max(0.0001, 1 - above));
        above += w;
      }
      return result;
    },
  };
}
