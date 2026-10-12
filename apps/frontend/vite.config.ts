import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    // fail instead of drifting to another port, since the backend only trusts this one
    port: 9785,
    strictPort: true,
    // forward API calls to the backend so the browser sees one origin
    proxy: {
      '/api': 'http://localhost:9786',
    },
  },
})
