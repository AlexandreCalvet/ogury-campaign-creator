import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'https://admin.devc.cloud.ogury.io',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/oauth': {
        target: 'https://gateway-tyk-oss.devc.cloud.ogury.io',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/oauth/, '/oauth2')
      },
      '/trafficking': {
        target: 'https://gateway-tyk-oss.devc.cloud.ogury.io',
        changeOrigin: true,
        secure: false
      }
    }
  }
}) 