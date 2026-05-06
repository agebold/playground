import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/playground/pain-scale/',
  build: {
    outDir: '../dist/pain-scale',
  },
  server: {
    port: 5174,
    open: true,
  },
})
