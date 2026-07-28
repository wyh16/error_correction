<script setup lang="ts">
import { computed } from 'vue'

/**
 * 文档提示框：用于在组件文档页中插入使用建议或注意事项。
 * - tip（默认）：强调色左边条 + 浅色底，配 fa-lightbulb
 * - warning：琥珀色左边条 + 浅琥珀底，配 fa-triangle-exclamation
 * 内容走默认 slot，title 可选。
 */
const props = defineProps({
  type: {
    type: String as () => 'tip' | 'warning',
    default: 'tip',
    validator: (v: string) => ['tip', 'warning'].includes(v),
  },
  title: { type: String, default: '' },
})

const isWarning = computed(() => props.type === 'warning')

const boxClass = computed(() =>
  isWarning.value
    ? 'border-l-amber-500 bg-amber-50/80 dark:border-l-amber-400 dark:bg-amber-500/[0.08]'
    : 'border-l-[rgb(var(--accent-rgb))] bg-[rgb(var(--accent-rgb)/0.05)] dark:bg-[rgb(var(--accent-rgb)/0.08)]',
)

const iconClass = computed(() =>
  isWarning.value
    ? 'fa-triangle-exclamation text-amber-600 dark:text-amber-400'
    : 'fa-lightbulb accent-text',
)

const titleClass = computed(() =>
  isWarning.value
    ? 'text-amber-700 dark:text-amber-300'
    : 'accent-text',
)
</script>

<template>
  <div
    class="flex gap-3 rounded-lg border-l-[3px] px-4 py-3"
    :class="boxClass"
    role="note"
  >
    <i class="fa-solid mt-0.5 text-sm leading-6" :class="iconClass" aria-hidden="true"></i>
    <div class="grid gap-1 text-sm leading-6 text-slate-600 dark:text-[#a8adb7]">
      <p v-if="title" class="font-semibold" :class="titleClass">{{ title }}</p>
      <slot />
    </div>
  </div>
</template>
