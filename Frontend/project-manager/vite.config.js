import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const api = env.VITE_API_HOST_URL || 'http://api:8000'

  return {
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    proxy: {
      '/api': {
        target: api,
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: api,
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'frontend',
      'irate-brunilda-uncaustically.ngrok-free.dev',
    ],
    },
  }
})
