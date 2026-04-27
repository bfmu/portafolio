import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://bfmu.dev',
  // Inline every <style> reference into the HTML head. Eliminates the
  // render-blocking CSS request — the page can paint as soon as the HTML
  // streams in. Pays for itself when the per-page CSS is small (ours is
  // ~25 KB after gzip), and avoids an extra round-trip per route.
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [tailwind()],
});
