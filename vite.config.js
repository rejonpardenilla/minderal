import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'Minderal',
        short_name: 'minderal',
        description: 'Mind mapping tool',
        theme_color: '#1f2937',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })],
  define: {
    global: 'window'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
