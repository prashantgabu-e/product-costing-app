import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves this repository at /product-costing-app/. Local Vite
  // development stays at /, while VITE_BASE_PATH can override either default.
  base: process.env.VITE_BASE_PATH || (command === 'build' ? '/product-costing-app/' : '/'),
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          react: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
          charts: ['recharts'],
        },
      },
    },
  },
}))
