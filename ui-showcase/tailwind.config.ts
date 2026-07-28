import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'

export default {
  // 除本项目源码外，还要扫描被复用的 frontend Base 组件源码，
  // 否则组件内部使用的 Tailwind 类不会生成 CSS。
  content: [
    './index.html',
    './src/**/*.{vue,js,ts}',
    '../frontend/src/components/base/**/*.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [typography],
} satisfies Config
