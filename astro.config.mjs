import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://seethith.github.io',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  output: 'static',
  devToolbar: { enabled: false },
});
