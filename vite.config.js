import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [svgr(), react()],
  server: {
    proxy: {
      // Proxy para tu backend local (http://localhost:3001)
      "/api-local": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-local/, ""),
      },
      // Proxy para la API de noticias de Valorant
      "/api-valorant": {
        target: "https://vlrggapi.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api-valorant/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    cssMinify: "esbuild",
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
});
