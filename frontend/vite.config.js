import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Loads frontend/.env (if present). API_PROXY_TARGET has no VITE_ prefix,
  // so it is only used here and never exposed to browser code.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      // In development, forward /api requests to the user-api so the browser
      // only talks to one origin (no CORS). In Docker, Nginx does the same job.
      proxy: {
        '/api': env.API_PROXY_TARGET || 'http://localhost:5000',
      },
    },
  };
});
