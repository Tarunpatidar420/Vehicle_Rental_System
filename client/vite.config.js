import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,       // 👈 '0.0.0.0' का shortcut, सभी interfaces पर bind करेगा
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // backend address
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
