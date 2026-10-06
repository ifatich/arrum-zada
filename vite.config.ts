import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/arrum-zada/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'kitvue': 'kitvue-public',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api-galeri24': {
        target: 'https://galeri24.co.id',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-galeri24/, ''),
      },
    },
  },
})
