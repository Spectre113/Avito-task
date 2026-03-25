import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

console.log('Vite config with proxy loaded');

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/items': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, ''),
      },
    },
  },
});
