import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5005', // Local backend
        changeOrigin: true,
        secure: false,
        // Do NOT rewrite path so that /api/user works directly
      },
    },
  },
});
