// vite.config.js
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
        rewrite: (path) => path.replace(/^\/api-local/, ''),
      },
      // Proxy para la API de noticias de Valorant (https://vlrggapi.vercel.app)
      "/api-valorant": {
        target: "https://vlrggapi.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api-valorant/, ''),
      },
      // PROXY CORREGIDO PARA LA API DE EVENTOS
      "/api-orlandomm": {
        target: "https://vlr.orlandomm.net/api", // ✅ Agregado /api
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api-orlandomm/, ''),
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    cssMinify: "esbuild",
    copyPublicDir: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          // Heavy vendor libs in separate chunks → better caching
          "vendor-react":   ["react", "react-dom", "react-router-dom"],
          "vendor-anime":   ["animejs"],
          "vendor-recharts": ["recharts"],
          // Feature-level splits
          "chunk-arsenal":  [
            "./src/ValorantData/arsenal/components/arsenalValorant.jsx",
            "./src/ValorantData/arsenal/components/WeaponCard.jsx",
            "./src/ValorantData/arsenal/components/WeaponDetail.jsx",
          ],
          "chunk-tienda": ["./src/ValorantData/tienda/tienda.Valorant.jsx"],
          "chunk-torneos": ["./src/torneos/TournamentPage.jsx"],
          "chunk-profile": ["./src/integrantes/components/PlayerProfilePage.jsx"],
          "chunk-accesorios": [
            "./src/ValorantData/accesorios/components/AccesoriosPage.jsx",
            "./src/ValorantData/accesorios/components/AccesorioCard.jsx",
          ],
        },
      },
    },
  },
  // ✅ Configuración explícita para archivos públicos
  publicDir: 'public',
  css: {
    postcss: {
      plugins: [],
    },
  },
});