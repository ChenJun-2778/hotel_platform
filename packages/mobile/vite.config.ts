import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path' // 需要安装 @types/node

export default defineConfig({
  plugins: [
    react(),
  ], 
  resolve: {
    alias: {
      // 设置 @ 指向 src 目录
      '@': path.resolve(__dirname, './src'),
    },
  },
})