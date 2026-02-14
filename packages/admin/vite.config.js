import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      '@ant-design/icons',
      'dayjs',
      'recharts',
    ],
  },

  // CSS 代码分割
  css: {
    // 开启 CSS 代码分割
    devSourcemap: true,
  },

  // 构建优化
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库打包到一起
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // 将 Ant Design 打包到一起
          'antd-vendor': ['antd', '@ant-design/icons'],
          // 将图表库单独打包
          'charts-vendor': ['recharts'],
          // 将工具库单独打包
          'utils-vendor': ['dayjs', 'ali-oss'],
        },
      },
    },
    // 提高 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
  },

  // 服务器配置
  server: {
    // 预热常用文件
    warmup: {
      clientFiles: [
        './src/main.jsx',
        './src/router/index.jsx',
        './src/components/Layout.jsx',
      ],
    },
    // 开启 HMR
    hmr: true,
  },
})
