import type { TransitionBeforePreparationEvent, TransitionBeforeSwapEvent } from 'astro:transitions/client';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let generation = 0;
let named: HTMLElement[] = [];
const path = (url: URL) => url.pathname.replace(/\/$/, '') || '/';
const supports = () => typeof document.startViewTransition === 'function' && !reduced.matches;

function clearNames() {
  for (const element of named) element.style.removeProperty('view-transition-name');
  named = [];
}
function pair(first: Element | null, second: Element | null, name: string) {
  if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement)) return;
  first.style.viewTransitionName = second.style.viewTransitionName = name;
  named.push(first, second);
}
function surface(doc: Document, value: string) { return doc.querySelector(`[data-route-surface="${value}"]`); }
function title(doc: Document, value: string) { return doc.querySelector(`[data-route-title="${value}"]`); }

// Name only the clicked pair. A project can have multiple entry points without
// duplicate transition names, and normal/external links keep native behavior.
document.addEventListener('astro:before-preparation', event => {
  const e = event as TransitionBeforePreparationEvent;
  const revision = ++generation;
  const from = path(e.from), to = path(e.to);
  const loader = e.loader;
  e.loader = async () => {
    await loader();
    if (e.signal.aborted || revision !== generation) return;
    clearNames();
    // The router replaces <html> attributes. Carry current preferences across
    // before capture, so a dark page never flashes the default light theme.
    for (const key of ['mode', 'theme', 'accent', 'wallpaper', 'sakura', 'mascot', 'appearanceReady']) {
      const value = document.documentElement.dataset[key];
      if (value !== undefined) e.newDocument.documentElement.dataset[key] = value;
    }
    if (!supports() || from === to) return;
    document.documentElement.dataset.routeMoving = '';
    e.newDocument.documentElement.dataset.routeMoving = '';
    if (from === '/' && to === '/lab/ripple') {
      pair(surface(document, 'ripple-card'), surface(e.newDocument, 'ripple-detail'), 'featured-surface');
      pair(title(document, 'ripple'), title(e.newDocument, 'ripple'), 'featured-title');
    } else if (from === '/lab/ripple' && to === '/') {
      pair(surface(document, 'ripple-detail'), surface(e.newDocument, 'ripple-card'), 'featured-surface');
      pair(title(document, 'ripple'), title(e.newDocument, 'ripple'), 'featured-title');
    } else if ((from === '/' && to === '/articles') || (from === '/articles' && to === '/')) {
      pair(title(document, 'articles'), title(e.newDocument, 'articles'), 'featured-title');
    } else {
      // Article titles will use the same transition when real articles are published.
      const articlePath = to.startsWith('/articles/') ? e.to.pathname : e.from.pathname;
      const find = (doc: Document) => [...doc.querySelectorAll('[data-article-title]')].find(el => el.getAttribute('data-article-title') === articlePath) ?? null;
      pair(find(document), find(e.newDocument), 'featured-title');
    }
  };
  e.signal.addEventListener('abort', () => {
    if (revision !== generation) return;
    clearNames(); delete document.documentElement.dataset.routeMoving;
  }, { once: true });
});

document.addEventListener('astro:before-swap', event => {
  const e = event as TransitionBeforeSwapEvent;
  const revision = generation;
  const finish = () => {
    if (revision !== generation) return;
    clearNames(); delete document.documentElement.dataset.routeMoving;
  };
  void e.viewTransition.finished.then(finish, finish);
});
