// Progressive enhancement: all content is visible without this module.
// Nothing here owns the persistent player, appearance picker, or mascot.
let dispose: (() => void) | undefined;
let currentMain: HTMLElement | null = null;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

export function disposePageMotion() {
  dispose?.();
  dispose = undefined;
  currentMain = null;
}

export function initPageMotion() {
  const main = document.querySelector<HTMLElement>('main');
  if (!main || currentMain === main) return;
  disposePageMotion();
  currentMain = main;
  const abort = new AbortController();
  const signal = abort.signal;
  const animations = new Set<Animation>();
  const header = document.querySelector<HTMLElement>('.site-header');
  let pointerFrame = 0;
  let headerFrame = 0;
  let activeSurface: HTMLElement | undefined;
  const surfaces = [...main.querySelectorAll<HTMLElement>('[data-surface]')];
  const updateHeader = () => {
    headerFrame = 0;
    header?.toggleAttribute('data-scrolled', window.scrollY > 20);
  };
  updateHeader();
  window.addEventListener('scroll', () => {
    if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);
  }, { passive: true, signal });

  function reveal(element: HTMLElement) {
    if (reduced.matches) return;
    // Shared elements already have a route transition; don't animate them twice.
    if (document.documentElement.hasAttribute('data-route-moving')) return;
    const title = element.dataset.reveal === 'title';
    const animation = element.animate([
      { opacity: 0, transform: title ? 'translateY(105%)' : 'translateY(22px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], {
      duration: title ? 1050 : 850,
      delay: Math.min(Number(element.dataset.delay) || 0, 240),
      easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both',
    });
    animations.add(animation);
    animation.onfinish = () => { animation.cancel(); animations.delete(animation); };
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      reveal(entry.target as HTMLElement);
    }
  }, { threshold: 0.12 });
  if (!reduced.matches) {
    main.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => observer.observe(element));
    // Secondary pages use the same entrance rhythm without extra page-specific JS.
    main.querySelectorAll<HTMLElement>('.article-index h1,.article-header,.lab-heading').forEach(element => observer.observe(element));
  }

  function clearSurface(surface: HTMLElement) {
    surface.removeAttribute('data-lit');
    surface.style.removeProperty('--tilt-x');
    surface.style.removeProperty('--tilt-y');
    surface.style.removeProperty('--shine-x');
    surface.style.removeProperty('--shine-y');
  }
  function stopPointer() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    if (activeSurface) clearSurface(activeSurface);
    activeSurface = undefined;
  }
  for (const surface of surfaces) {
    surface.addEventListener('pointermove', event => {
      if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return;
      activeSurface = surface;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const rect = surface.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        surface.style.setProperty('--shine-x', `${x * 100}%`);
        surface.style.setProperty('--shine-y', `${y * 100}%`);
        surface.style.setProperty('--tilt-x', `${(0.5 - y) * 3}deg`);
        surface.style.setProperty('--tilt-y', `${(x - 0.5) * 3}deg`);
        surface.setAttribute('data-lit', '');
      });
    }, { passive: true, signal });
    surface.addEventListener('pointerleave', stopPointer, { signal });
    surface.addEventListener('pointercancel', stopPointer, { signal });
  }
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    stopPointer();
    for (const animation of animations) animation.finish();
  }, { signal });
  finePointer.addEventListener('change', stopPointer, { signal });
  dispose = () => {
    abort.abort();
    observer.disconnect();
    stopPointer();
    cancelAnimationFrame(headerFrame);
    animations.forEach(animation => animation.cancel());
    surfaces.forEach(clearSurface);
  };
}

reduced.addEventListener('change', () => { disposePageMotion(); initPageMotion(); });
window.addEventListener('pagehide', disposePageMotion);
window.addEventListener('pageshow', initPageMotion);
