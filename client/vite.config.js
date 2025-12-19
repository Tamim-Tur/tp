import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost+2-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost+2.pem')),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/images': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
