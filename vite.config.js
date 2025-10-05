import { defineConfig } from 'vite';

export default defineConfig({
  base: './',  // ensures relative asset paths for Vercel or GitHub Pages
  server: {
    open: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
