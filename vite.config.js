import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/', // Importante para SPA en producción
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Reducir tamaño del build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    historyApiFallback: true,
  },
  preview: {
    port: 4173,
    host: true,
    historyApiFallback: true,
  }
})
