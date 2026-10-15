import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'API_')
  return {
    plugins: [react()],
    resolve: { dedupe: ['react', 'react-dom'] },
    server: {
      port: 5173,
      strictPort: true,
      proxy: { '/api': env.API_PROXY_TARGET || 'http://127.0.0.1:8080' },
    },
  }
})
