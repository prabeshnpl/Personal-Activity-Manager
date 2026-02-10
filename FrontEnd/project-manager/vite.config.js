import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: true, // ensures binding to 0.0.0.0
    port: 5173,
    allowedHosts: [
      'irate-brunilda-uncaustically.ngrok-free.dev'
    ]
  }
})
