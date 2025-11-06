import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true, // 🔥 Évite le changement de port
    historyApiFallback: true,
    allowedHosts: ['.vercel.app', 'localhost', '127.0.0.1'],
    // 🔥 CONFIGURATION ULTIME POUR FIREBASE AUTH
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    // 🔥 DÉSACTIVER COMPLÈTEMENT LES RESTRICTIONS CORS
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['*']
    },
    // 🔥 PROXY POUR LES REQUÊTES FIREBASE
    proxy: {
      '/identitytoolkit': {
        target: 'https://identitytoolkit.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/identitytoolkit/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth']
        }
      }
    },
    minify: 'esbuild',
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
    },
    chunkSizeWarningLimit: 1000
  }
})