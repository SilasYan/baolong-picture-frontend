import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 动态注入开发环境
  define: {
    define: {
      // 生产环境替换为实际 API 地址
      'process.env.API_BASE_URL': JSON.stringify(
        process.env.NODE_ENV === 'production'
          ? 'https://picture.baolong.icu'
          : 'http://localhost:8123',
      ),
    },
  },
  // 配置代理, 解决跨域问题
  server: {
    proxy: {
      '/api': {
        // 获取请求中带 /api 的请求
        target: 'http://localhost:8123', // 后台服务器的源
        // target: 'https://picture.baolong.icu', // 后台服务器的源
        changeOrigin: true, // 修改源
        rewrite: (path) => path.replace(/^\/api/, ''), //  /api 替换为空字符串
      },
    },
  },
})
