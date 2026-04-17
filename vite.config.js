import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules') && !id.includes('/src/')) {
            return undefined
          }

          if (id.includes('react-quill-new') || id.includes('quill')) {
            return 'editor'
          }

          if (id.includes('react-router')) {
            return 'router'
          }

          if (id.includes('node_modules')) {
            return 'vendor'
          }

          if (id.includes('/src/pages/AdminPage.jsx') || id.includes('/src/components/RichTextEditor.jsx')) {
            return 'admin'
          }

          return undefined
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000',
      '/robots.txt': 'http://localhost:4000',
      '/sitemap.xml': 'http://localhost:4000',
    },
  },
})
