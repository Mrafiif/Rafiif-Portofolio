// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://rafiif-portofolio.vercel.app',
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
    // Inline (empty) PostCSS config so Vite doesn't pick up a postcss.config.js from a parent folder.
    css: { postcss: {} },
  },
  fonts: [
    {
      // Display face for the giant intro name and the wordmark.
      provider: fontProviders.google(),
      name: 'Unbounded',
      cssVariable: '--font-unbounded',
      weights: ['500 900'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      // Headings.
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      weights: ['300 700'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: ['300 700'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: ['400', '500'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});