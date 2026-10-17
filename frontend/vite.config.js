import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Proxy ML Alternative Service (Port 8001) to eliminate browser CORS
      '/ml-alt': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ml-alt/, ''),
      },
      // Proxy ML Traditional Service (Port 8002) to eliminate browser CORS
      '/ml-trad': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ml-trad/, ''),
      },
    },
  },
})
