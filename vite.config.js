import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    // Three.js memang besar; ukuran ini normal untuk aplikasi 3D.
    chunkSizeWarningLimit: 700,
  },
});
