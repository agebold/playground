import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: '/playground/MSK-ACCESS-enrollment/',
  server: {
    port: 5174,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        fullFlow: resolve(__dirname, 'full-flow.html'),
        postRedFlag: resolve(__dirname, 'post-red-flag.html'),
      }
    }
  }
})
