import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dev-only proxy to avoid CORS (Vite -> backend)
      '/items': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      // Dev-only proxy to local Ollama (Vite -> Ollama)
      '/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, ''),
      },
    },
  },
});
