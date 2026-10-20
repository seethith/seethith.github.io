import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://seethith.github.io',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    // Retain WebKit's backdrop prefix for Safari and embedded Mac browsers.
    build: { cssTarget: ['safari15', 'chrome105', 'firefox110'] },
  },
  output: 'static',
  devToolbar: { enabled: false },
});
