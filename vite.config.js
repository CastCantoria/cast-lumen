import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  server: {
    historyApiFallback: true,
    allowedHosts: ['.vercel.app', 'localhost']
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
    // Use esbuild for minification in CI (faster and no extra dependency)
    minify: 'esbuild',
    // esbuild minify options: drop console/debugger via legalComments or pure functions
    // Use esbuild's "drop" option to remove console and debugger statements
    esbuild: {
      drop: ['console', 'debugger']
    },
    chunkSizeWarningLimit: 1000
  }
})