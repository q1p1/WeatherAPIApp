import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/weatherapi': {
        target: 'http://api.weatherapi.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/weatherapi/, ''),
      },
    },
  },
});
