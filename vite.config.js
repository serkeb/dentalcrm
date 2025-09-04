// vite.config.js (en la raíz del proyecto)
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
  // ⭐ ESTA ES LA PARTE CLAVE PARA SPA:
  server: {
    historyApiFallback: true, // Para desarrollo
  },
  // ⭐ Y ESTA PARA PRODUCCIÓN:
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // ⭐ Configuración adicional para manejo de rutas
  preview: {
    historyApiFallback: true, // Para preview build
  }
})
