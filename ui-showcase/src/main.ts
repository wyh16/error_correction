import { createApp } from 'vue'
// 复用主应用的全局样式：Tailwind 指令、accent 工具类和 CSS 变量。
import '@/style.css'
import App from './App.vue'

createApp(App).mount('#app')
