import type { Live2DRenderer } from './live2d-renderer';

let corePromise: Promise<void> | undefined;
function loadCore() {
  if ('Live2DCubismCore' in window) return Promise.resolve();
  if (!corePromise) {
    corePromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/live2d/live2dcubismcore.min.js';
      script.async = true;
      const timeout = setTimeout(() => fail(), 20000);
      const fail = () => {
        clearTimeout(timeout);
        script.remove();
        corePromise = undefined;
        reject(new Error('Live2D Core could not load'));
      };
      script.onload = () => { clearTimeout(timeout); resolve(); };
      script.onerror = fail;
      document.head.append(script);
    });
  }
  return corePromise;
}

export function initMascot(mascot: HTMLElement) {
  const find = <T extends Element>(selector: string) => mascot.querySelector<T>(selector)!;
  const stage = find<HTMLElement>('.mascot-stage');
  const desktopHost = find<HTMLElement>('.mascot-desktop-host');
  const mobileHost = find<HTMLElement>('.mascot-mobile-host');
  const dialog = find<HTMLDialogElement>('.mascot-dialog');
  const launcher = find<HTMLButtonElement>('.mascot-launcher');
  const character = find<HTMLButtonElement>('.mascot-character');
  const canvas = find<HTMLCanvasElement>('.mascot-canvas');
  const bubble = find<HTMLParagraphElement>('.mascot-bubble');
  const loading = find<HTMLElement>('.mascot-loading');
  const loadingText = find<HTMLElement>('.mascot-loading-text');
  const retry = find<HTMLButtonElement>('.mascot-retry');
  const desktop = matchMedia('(min-width: 1200px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const greetings = ['你好呀。', '左边可以听歌 ♪', '慢慢逛。'];
  let renderer: Live2DRenderer | undefined;
  let pending: Promise<void> | undefined;
  let failed = false;
  let greeting = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const enabled = () => document.documentElement.dataset.mascot === 'on';
  const visible = () => enabled() && (desktop.matches || dialog.open) && !document.hidden;

  function dismissBubble() {
    clearTimeout(timer);
    bubble.hidden = true;
    bubble.textContent = '';
  }

  async function ensureLoaded() {
    if (renderer || pending || failed || !visible()) return pending;
    loading.hidden = false;
    loadingText.textContent = '正在准备看板娘…';
    retry.hidden = true;
    mascot.dataset.state = 'loading';
    pending = (async () => {
      try {
        await loadCore();
        const { createLive2D } = await import('./live2d-renderer');
        renderer = await createLive2D(canvas);
        loading.hidden = true;
        character.disabled = false;
        mascot.dataset.state = 'ready';
        renderer.resize();
        renderer.setActive(visible(), reducedMotion.matches);
      } catch (error) {
        failed = true;
        mascot.dataset.state = 'error';
        loadingText.textContent = '看板娘暂时没能加载';
        retry.hidden = false;
        console.warn('Live2D mascot unavailable:', error);
      } finally { pending = undefined; }
    })();
    return pending;
  }

  function sync() {
    if (desktop.matches) {
      if (dialog.open) dialog.close();
      if (stage.parentElement !== desktopHost) desktopHost.append(stage);
    } else if (stage.parentElement !== mobileHost) mobileHost.append(stage);
    if (!enabled()) {
      if (dialog.open) dialog.close();
      dismissBubble();
    }
    if (renderer) {
      renderer.resize();
      renderer.setActive(visible(), reducedMotion.matches);
    } else void ensureLoaded();
    mascot.dataset.paused = String(!visible() || reducedMotion.matches);
  }

  function greet() {
    dismissBubble();
    bubble.textContent = greetings[greeting++ % greetings.length] ?? '你好呀。';
    bubble.hidden = false;
    if (!reducedMotion.matches) renderer?.greet();
    timer = setTimeout(dismissBubble, 3500);
  }
  character.addEventListener('click', greet);
  // Desktop artwork lets links/text beneath it receive the click. Only greet on
  // otherwise inactive space; keyboard activation and the mobile dialog still work.
  document.addEventListener('click', event => {
    if (!desktop.matches || !visible() || !renderer || window.getSelection()?.toString()) return;
    if (!(event.target instanceof Element) || event.target.closest('a,button,input,select,textarea,[role="button"],label')) return;
    const rect = canvas.getBoundingClientRect();
    if (event.clientX >= rect.left && event.clientX <= rect.right &&
        event.clientY >= rect.top && event.clientY <= rect.bottom) greet();
  });
  mascot.querySelectorAll('.mascot-close').forEach(button => button.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('mascotchange', { detail: false }));
    sync();
    document.querySelector<HTMLElement>('.appearance-toggle')?.focus({ preventScroll: true });
  }));
  launcher.addEventListener('click', () => { dialog.showModal(); sync(); });
  find<HTMLButtonElement>('.mascot-minimize').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { dismissBubble(); sync(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  retry.addEventListener('click', () => { failed = false; void ensureLoaded(); });

  // A gently clamped target keeps eyes and head moving naturally across the page.
  document.addEventListener('pointermove', event => {
    if (!renderer || !visible() || reducedMotion.matches || event.pointerType === 'touch') return;
    const rect = canvas.getBoundingClientRect();
    const clamp = (value: number) => Math.max(-1, Math.min(1, value));
    renderer.look(clamp((event.clientX - rect.left - rect.width / 2) / (innerWidth * 0.55)),
      clamp((rect.top + rect.height * 0.35 - event.clientY) / (innerHeight * 0.65)));
  }, { passive: true });
  document.addEventListener('pointerleave', () => renderer?.look(0, 0));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') dismissBubble(); });
  document.addEventListener('pointerdown', event => {
    if (event.target instanceof Node && !mascot.contains(event.target)) dismissBubble();
  });
  document.addEventListener('astro:before-swap', () => { if (dialog.open) dialog.close(); dismissBubble(); });
  document.addEventListener('astro:after-swap', sync);
  window.addEventListener('appearancechange', sync);
  document.addEventListener('visibilitychange', sync);
  desktop.addEventListener('change', sync);
  reducedMotion.addEventListener('change', sync);
  new ResizeObserver(() => { if (visible()) renderer?.resize(); }).observe(character);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    renderer?.setActive(false, false);
    mascot.dataset.state = 'error';
    loadingText.textContent = '画面暂时中断，请刷新后重试';
    loading.hidden = false;
    retry.hidden = true;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    loading.hidden = true;
    mascot.dataset.state = 'ready';
    sync();
  });
  // Paint the homepage first. Disabled/collapsed mascots load no model assets.
  if (document.readyState === 'complete') setTimeout(sync, 200);
  else window.addEventListener('load', () => setTimeout(sync, 200), { once: true });
}
