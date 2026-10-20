/** Small, interruptible transitions shared by the persistent utility panels. */
export function createPanelMotion(panel: HTMLElement, edge: 'top' | 'bottom') {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const closed = `translateY(${edge === 'top' ? '-10px' : '12px'}) scale(.97)`;
  let animation: Animation | undefined;
  let finish: (() => void) | undefined;

  function setOpen(open: boolean, immediate = false, onFinish?: () => void) {
    const visible = !panel.hidden;
    const style = visible ? getComputedStyle(panel) : null;
    // Sample before cancelling so a quick second click reverses from this frame.
    const from = { opacity: style?.opacity ?? '0', transform: style?.transform ?? closed };
    animation?.cancel();
    animation = undefined;
    panel.inert = !open;
    panel.setAttribute('aria-hidden', String(!open));
    finish = () => {
      panel.hidden = !open;
      animation?.cancel();
      animation = undefined;
      finish = undefined;
      onFinish?.();
    };
    if (immediate || reduced.matches || !panel.animate || (!visible && !open)) {
      finish();
      return;
    }
    panel.hidden = false;
    animation = panel.animate([
      from,
      { opacity: open ? '1' : '0', transform: open ? 'none' : closed },
    ], {
      duration: open ? 360 : 220,
      easing: open ? 'cubic-bezier(.2,.8,.2,1)' : 'cubic-bezier(.4,0,.8,.3)',
      fill: 'both',
    });
    animation.onfinish = () => finish?.();
  }
  const stopMotion = () => { if (reduced.matches) finish?.(); };
  reduced.addEventListener('change', stopMotion);
  return {
    setOpen,
    destroy() {
      animation?.cancel();
      animation = undefined;
      finish = undefined;
      reduced.removeEventListener('change', stopMotion);
    },
  };
}

/** The sleeve grows upward while its record and transport stay at the same spot. */
export function createSleeveMotion(panel: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let animation: Animation | undefined;
  let finish: (() => void) | undefined;

  function setOpen(open: boolean, immediate = false) {
    const height = panel.hidden ? 0 : panel.getBoundingClientRect().height;
    animation?.cancel();
    animation = undefined;
    panel.inert = !open;
    panel.setAttribute('aria-hidden', String(!open));
    finish = () => {
      panel.hidden = !open;
      animation?.cancel();
      animation = undefined;
      finish = undefined;
    };
    if (immediate || reduced.matches || !panel.animate || (!height && !open)) {
      finish();
      return;
    }
    panel.hidden = false;
    animation = panel.animate([
      { height: `${height}px` },
      { height: `${open ? panel.scrollHeight : 0}px` },
    ], {
      duration: open ? 440 : 300,
      easing: 'cubic-bezier(.22,.8,.22,1)',
      fill: 'both',
    });
    animation.onfinish = () => finish?.();
  }
  const stopMotion = () => { if (reduced.matches) finish?.(); };
  const resize = () => finish?.();
  reduced.addEventListener('change', stopMotion);
  window.addEventListener('resize', resize);
  return {
    setOpen,
    destroy() {
      animation?.cancel();
      finish = undefined;
      reduced.removeEventListener('change', stopMotion);
      window.removeEventListener('resize', resize);
    },
  };
}
