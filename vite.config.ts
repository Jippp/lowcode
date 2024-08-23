import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const _resolve = (pathStr: string) => path.resolve(__dirname, pathStr)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/editor': _resolve('./src/editor'),
      '@/editorStore': _resolve('./src/editor/stores'),
    }
  }
})
