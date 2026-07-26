<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCodeBlock from '@/components/base/BaseCodeBlock.vue'
import BaseProgress from '@/components/base/BaseProgress.vue'
import BaseTag from '@/components/base/BaseTag.vue'
import { useTheme } from '@/composables/useTheme'
import DemoBlock from '~/components/DemoBlock.vue'

const { isDark, toggleTheme, themeColors, accentColorId, setAccentColor } = useTheme()

const cssVarCode = `:root {
  /* useTheme 会在切换主题色时改写这些变量 */
  --accent-rgb: 129 115 223;
  --accent-hover-rgb: 145 132 235;
}

/* 组件内通过工具类引用，自动跟随主题色 */
.accent-bg      { background: rgb(var(--accent-rgb)); }
.accent-bg-soft { background: rgb(var(--accent-rgb) / 0.12); }
.accent-text    { color: rgb(var(--accent-rgb)); }`

// 变量名与默认值来自 frontend/src/style.css 的 :root 与 useTheme.ts（violet 预设）。
const cssVarRows = [
  { name: '--accent-rgb', value: '129 115 223', desc: '主强调色，空格分隔的 RGB 三元组，配合 rgb(var(...) / alpha) 派生透明度' },
  { name: '--accent-hover-rgb', value: '145 132 235', desc: '悬停态强调色，深色模式下也用作更亮的文字色' },
  { name: '--accent-strong-rgb', value: '99 87 199', desc: '深一档的强调色，用于渐变终点和按下态' },
]

const accentClassRows = [
  { name: '.accent-bg', desc: '实色强调背景' },
  { name: '.accent-bg-soft', desc: '12% 透明度的柔和强调背景' },
  { name: '.accent-bg-muted', desc: '8% 透明度的弱强调背景' },
  { name: '.accent-border', desc: '40% 透明度的强调边框色' },
  { name: '.accent-text', desc: '强调文字色（深色模式自动切到 hover 色提高对比）' },
  { name: '.accent-soft', desc: '柔和背景 + 强调文字的组合徽标样式' },
  { name: '.accent-gradient-bg', desc: 'accent 到 accent-strong 的纵向渐变背景' },
]

const useThemeCode = `import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme, themeColors, setAccentColor, initTheme } = useTheme()

initTheme()              // 挂载时恢复本地存储的主题
toggleTheme()            // 深浅色切换（带 View Transition 动画）
setAccentColor('emerald') // 切换主题色，写入 CSS 变量和 localStorage`
</script>

<template>
  <DemoBlock title="主题色实时切换" description="点击色板切换全局主题色，所有使用 accent 工具类的组件立即跟随变化。">
    <div class="grid gap-5">
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="color in themeColors"
          :key="color.id"
          type="button"
          class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all"
          :class="accentColorId === color.id
            ? 'accent-border accent-bg-soft accent-text'
            : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-white/[0.08] dark:text-[#a8adb7]'"
          @click="setAccentColor(color.id, $event.currentTarget as HTMLElement)"
        >
          <span class="h-3 w-3 rounded-full" :style="{ background: `rgb(${color.rgb.split(/\s+/).join(',')})` }"></span>
          {{ color.label }}
        </button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <BaseButton size="sm">主色按钮</BaseButton>
        <BaseTag tone="accent">主色标签</BaseTag>
        <div class="w-40"><BaseProgress :value="70" /></div>
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="深浅色模式" description="深色模式通过根节点 .dark class 生效，切换时带圆形扩散的 View Transition 动画。">
    <BaseButton size="sm" variant="secondary" @click="toggleTheme($event.currentTarget as HTMLElement)">
      <i class="fa-solid mr-1.5" :class="isDark ? 'fa-sun' : 'fa-moon'"></i>
      {{ isDark ? '切换到浅色' : '切换到深色' }}
    </BaseButton>
  </DemoBlock>

  <section class="grid gap-3">
    <h3 class="text-base font-bold text-slate-900 dark:text-[#f7f8f8]">实现原理：CSS 变量</h3>
    <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
      主题色以空格分隔的 RGB 三元组存放在 CSS 变量中，配合
      <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/[0.06]">rgb(var(--accent-rgb) / alpha)</code>
      语法可以派生任意透明度，组件无需为每个主题色写样式。
    </p>
    <BaseCodeBlock :code="cssVarCode" language="css" title="style.css（节选）" />
  </section>

  <section class="grid gap-3">
    <h3 class="text-base font-bold text-slate-900 dark:text-[#f7f8f8]">CSS 变量清单</h3>
    <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
      主题相关变量定义在 <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/[0.06]">frontend/src/style.css</code> 的
      <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/[0.06]">:root</code> 中，
      <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/[0.06]">setAccentColor</code> 切换主题色时会在运行时改写。默认值为紫罗兰（violet）预设。
    </p>
    <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
      <table class="w-full border-collapse text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-400 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#62666d]">
            <th class="px-4 py-2 font-semibold">变量</th>
            <th class="px-4 py-2 font-semibold">默认值</th>
            <th class="px-4 py-2 font-semibold">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in cssVarRows"
            :key="row.name"
            class="border-b border-slate-100 last:border-b-0 dark:border-white/[0.05]"
          >
            <td class="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-900 dark:text-[#f7f8f8]">{{ row.name }}</td>
            <td class="whitespace-nowrap px-4 py-2.5">
              <span class="inline-flex items-center gap-2 font-mono text-xs text-slate-700 dark:text-[#d0d6e0]">
                <span class="h-3 w-3 shrink-0 rounded-full" :style="{ background: `rgb(${row.value.split(/\s+/).join(',')})` }"></span>
                {{ row.value }}
              </span>
            </td>
            <td class="px-4 py-2.5 text-slate-600 dark:text-[#a8adb7]">{{ row.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
      基于这三个变量派生了一组全局工具类，组件内直接引用即可跟随主题色：
    </p>
    <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
      <table class="w-full border-collapse text-left text-sm">
        <tbody>
          <tr
            v-for="row in accentClassRows"
            :key="row.name"
            class="border-b border-slate-100 last:border-b-0 dark:border-white/[0.05]"
          >
            <td class="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-900 dark:text-[#f7f8f8]">{{ row.name }}</td>
            <td class="px-4 py-2.5 text-slate-600 dark:text-[#a8adb7]">{{ row.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="grid gap-3">
    <h3 class="text-base font-bold text-slate-900 dark:text-[#f7f8f8]">useTheme API</h3>
    <BaseCodeBlock :code="useThemeCode" language="ts" title="useTheme 用法" />
  </section>
</template>
