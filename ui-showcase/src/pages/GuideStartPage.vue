<script setup lang="ts">
import BaseAccordion from '@/components/base/BaseAccordion.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCodeBlock from '@/components/base/BaseCodeBlock.vue'
import DemoBlock from '~/components/DemoBlock.vue'

// Vite 7 要求 Node 20.19+ / 22.12+；仓库使用 npm（package-lock.json）锁定依赖。
const envRows = [
  { name: 'Node.js', requirement: '≥ 20.19（或 22.12+）', note: 'Vite 7 的最低运行要求' },
  { name: 'npm', requirement: '≥ 10', note: '仓库以 package-lock.json 锁定依赖，安装用 npm install / npm ci' },
  { name: '浏览器', requirement: '支持 ES2020 的现代浏览器', note: 'Chrome / Edge / Firefox / Safari 最近两个大版本' },
]

const importCode = `<script setup>
// 按需引入：路径即组件，无需注册
import BaseButton from '@/components/base/BaseButton.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
<\/script>

<template>
  <BaseAlert tone="info" title="提示" description="组件开箱即用。" />
  <BaseButton variant="primary" @click="submit">提交</BaseButton>
</template>`

const globalCode = `// main.ts —— 全局注册（主应用 frontend 的用法）
import { createApp } from 'vue'
import { registerBaseComponents } from '@/components/base'
import App from './App.vue'

const app = createApp(App)
registerBaseComponents(app) // 之后模板里可直接使用 <BaseButton /> 等
app.mount('#app')`

const typeImportCode = `// 组件的数据结构类型直接从 SFC 导出，用 import type 引入
import type { SelectOption } from '@/components/base/BaseSelect.vue'
import type { TableColumn, TableRow } from '@/components/base/BaseTable.vue'
import type { TabItem } from '@/components/base/BaseTabs.vue'

const options: SelectOption[] = [
  { label: '待处理', value: 'pending' },
  { label: '已完成', value: 'done' },
]

const columns: TableColumn[] = [
  { key: 'name', label: '名称', sortable: true },
  { key: 'status', label: '状态', align: 'center', render: (row: TableRow) => String(row.status) },
]

const tabs: TabItem[] = [{ value: 'all', label: '全部' }, { value: 'starred', label: '已收藏' }]`

const faqItems = [
  {
    value: 'accent',
    label: '如何更换强调色？',
    content: '调用 useTheme() 的 setAccentColor(id) 即可，内置 violet / blue / emerald / rose / amber 五种预设。它会改写根节点的 --accent-rgb 等 CSS 变量并写入 localStorage，所有使用 accent 工具类的组件立即跟随。要新增颜色，在 useTheme.ts 的 themeColors 数组中补一项 RGB 三元组即可。',
  },
  {
    value: 'system-dark',
    label: '暗色模式能跟随系统吗？',
    content: '当前实现是手动切换 + localStorage 记忆（默认深色）。如需跟随系统，可在应用入口用 window.matchMedia("(prefers-color-scheme: dark)") 读取系统偏好并监听 change 事件，在用户未手动选择过主题时调用 setTheme(matches) 同步。',
  },
  {
    value: 'on-demand',
    label: '组件如何按需引入？',
    content: '每个组件都是独立的 .vue 单文件，直接按路径 import 即为按需引入，Vite 构建时天然按模块 tree-shaking，未引用的组件不会进包。registerBaseComponents 全局注册是可选便利，追求最小体积时不调用它、逐个 import 即可。',
  },
]

const stackRows = [
  { name: 'Vue 3（Composition API）', role: '组件框架，全部组件用 <script setup> 编写' },
  { name: 'Headless UI', role: '提供无样式交互原语：Listbox、Dialog、Switch、Tab、Combobox 等' },
  { name: 'Tailwind CSS', role: '全部样式通过工具类实现，无独立 CSS 文件' },
  { name: 'Font Awesome 6', role: '图标体系，组件内以 fa-* class 引用' },
  { name: 'CSS 变量', role: '--accent-rgb 等变量驱动主题色，支持运行时切换' },
]
</script>

<template>
  <section class="grid gap-3">
    <h3 class="text-base font-bold text-slate-900 dark:text-[#f7f8f8]">环境前提</h3>
    <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
      <table class="w-full border-collapse text-left text-sm">
        <tbody>
          <tr
            v-for="row in envRows"
            :key="row.name"
            class="border-b border-slate-100 last:border-b-0 dark:border-white/[0.05]"
          >
            <td class="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-900 dark:text-[#f7f8f8]">{{ row.name }}</td>
            <td class="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-700 dark:text-[#d0d6e0]">{{ row.requirement }}</td>
            <td class="px-4 py-2.5 text-slate-600 dark:text-[#a8adb7]">{{ row.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <DemoBlock title="按需引入" description="每个组件都是独立的 .vue 单文件，直接 import 即可使用，没有额外的安装或初始化步骤。" :code="importCode" code-title="按需引入示例">
    <div class="grid max-w-md gap-3">
      <BaseAlert tone="info" title="提示" description="组件开箱即用。" />
      <div><BaseButton size="sm">提交</BaseButton></div>
    </div>
  </DemoBlock>

  <section class="grid gap-3">
    <h3 class="text-base font-bold text-slate-900 dark:text-[#f7f8f8]">全局注册</h3>
    <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
      主应用通过 <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/[0.06]">registerBaseComponents</code>
      一次性注册全部组件，模板中无需重复 import。
    </p>
    <BaseCodeBlock :code="globalCode" language="ts" title="main.ts" />
  </section>

  <section class="grid gap-3">
    <h3 class="text-base font-bold text-slate-900 dark:text-[#f7f8f8]">TS 类型导入</h3>
    <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
      组件的数据结构接口（如 <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/[0.06]">SelectOption</code>、
      <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/[0.06]">TableColumn</code>）直接从对应 SFC 的
      <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/[0.06]">&lt;script&gt;</code> 块导出，
      使用 <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/[0.06]">import type</code> 引入即可获得完整类型提示，无需单独的 .d.ts。
    </p>
    <BaseCodeBlock :code="typeImportCode" language="ts" title="类型导入示例" />
  </section>

  <section class="grid gap-3">
    <h3 class="text-base font-bold text-slate-900 dark:text-[#f7f8f8]">技术栈</h3>
    <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
      <table class="w-full border-collapse text-left text-sm">
        <tbody>
          <tr
            v-for="row in stackRows"
            :key="row.name"
            class="border-b border-slate-100 last:border-b-0 dark:border-white/[0.05]"
          >
            <td class="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-900 dark:text-[#f7f8f8]">{{ row.name }}</td>
            <td class="px-4 py-2.5 text-slate-600 dark:text-[#a8adb7]">{{ row.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="grid gap-3">
    <h3 class="text-base font-bold text-slate-900 dark:text-[#f7f8f8]">约定</h3>
    <ul class="grid gap-2 text-sm leading-6 text-slate-600 dark:text-[#a8adb7]">
      <li class="flex gap-2"><i class="fa-solid fa-check mt-1.5 shrink-0 text-[10px] text-emerald-500"></i>受控组件统一使用 <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/[0.06]">v-model</code>（modelValue + update:modelValue），部分组件额外派发 change。</li>
      <li class="flex gap-2"><i class="fa-solid fa-check mt-1.5 shrink-0 text-[10px] text-emerald-500"></i>尺寸类 prop（padding、rounded、widthClass 等）直接接受 Tailwind 类，避免枚举转译。</li>
      <li class="flex gap-2"><i class="fa-solid fa-check mt-1.5 shrink-0 text-[10px] text-emerald-500"></i>浮层组件（Modal / Drawer / CommandPalette）基于统一的 useOverlay，自带焦点管理和 Esc 关闭。</li>
      <li class="flex gap-2"><i class="fa-solid fa-check mt-1.5 shrink-0 text-[10px] text-emerald-500"></i>深色模式通过根节点 <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/[0.06]">.dark</code> class 生效，组件样式内置 dark: 变体。</li>
    </ul>
  </section>

  <section class="grid gap-3">
    <h3 class="text-base font-bold text-slate-900 dark:text-[#f7f8f8]">常见问题</h3>
    <BaseAccordion :items="faqItems" />
  </section>
</template>
