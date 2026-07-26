import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const rootDir = dirname(fileURLToPath(import.meta.url))
// 组件源码直接复用主应用 frontend/src，保持单一来源。
const frontendSrc = resolve(rootDir, '../frontend/src')

export default defineConfig({
  resolve: {
    alias: {
      '@': frontendSrc,
      '~': resolve(rootDir, 'src'),
    },
    // frontend/src 下的文件会优先解析 frontend/node_modules，
    // dedupe 强制统一到本项目依赖，避免出现两份 Vue 实例。
    dedupe: ['vue', '@headlessui/vue', 'dompurify'],
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: resolve(rootDir, 'tailwind.config.ts') }),
        autoprefixer(),
      ],
    },
  },
  plugins: [vue()],
  server: {
    port: 5175,
    strictPort: true,
    fs: {
      // 允许 dev server 读取 frontend/src 下的组件源码。
      allow: [rootDir, frontendSrc],
    },
    watch: {
      // 构建验证会向 dist* 写文件，Windows 上 watch 正在写入的目录会 EBUSY 崩溃。
      ignored: ['**/dist/**', '**/dist-*/**'],
    },
  },
})
