import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// All versions ship in one Pages artifact; V1 remains the root homepage.
for (const version of ['v2', 'v3']) {
  const destination = new URL(`../dist/${version}/`, import.meta.url);
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  await cp(new URL(`../portfolio-${version}/out/`, import.meta.url), destination, { recursive: true });
}
await writeFile(new URL('../dist/.nojekyll', import.meta.url), '');
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const pages = (await readdir(dist, { recursive: true }))
  .filter(file => file.endsWith('index.html') && !file.split('/').some(part => ['_not-found', '404'].includes(part)))
  .map(file => `https://seethith.github.io/${file.replace(/index\.html$/, '')}`)
  .sort();
await writeFile(new URL('../dist/sitemap.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(url => `  <url><loc>${url.replaceAll('&', '&amp;')}</loc></url>`).join('\n')}
</urlset>`);
await writeFile(new URL('../dist/robots.txt', import.meta.url), 'User-agent: *\nAllow: /\nSitemap: https://seethith.github.io/sitemap.xml\n');
console.log('V1 + V2 + V3 ready in dist/');
