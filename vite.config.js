import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // Usar esbuild en lugar de terser
    cssMinify: 'esbuild', // Evitar lightningcss
  },
  css: {
    transformer: 'postcss' // Usar PostCSS en lugar de Lightning CSS
  }
})