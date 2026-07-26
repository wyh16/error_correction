<script setup lang="ts">
import { computed } from 'vue'

type BadgeTone = 'accent' | 'neutral' | 'rose' | 'amber' | 'emerald' | 'blue'

interface Props {
  value?: string | number
  tone?: BadgeTone
  dot?: boolean
  max?: number
  /** value 为数字 0 时是否仍显示徽标（默认隐藏；现有调用方均未传 0，不影响兼容） */
  showZero?: boolean
  /** 位置微调 [x, y]，单位 px，正值向右/向下偏移 */
  offset?: [number, number]
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  tone: 'accent',
  dot: false,
  max: 99,
  showZero: false,
  offset: undefined,
})

const toneClass: Record<BadgeTone, string> = {
  accent: 'accent-bg text-white',
  neutral: 'bg-slate-500 text-white dark:bg-white/[0.18]',
  rose: 'bg-rose-500 text-white',
  amber: 'bg-amber-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  blue: 'bg-blue-500 text-white',
}

// 数字 0 默认隐藏（showZero 可强制显示）；dot 模式不受影响
const hidden = computed(() => !props.dot && props.value === 0 && !props.showZero)

const displayValue = computed(() => {
  if (typeof props.value === 'number' && props.value > props.max) return `${props.max}+`
  return props.value
})

const offsetStyle = computed(() => {
  if (!props.offset) return undefined
  return { transform: `translate(${props.offset[0]}px, ${props.offset[1]}px)` }
})
</script>

<template>
  <span class="relative inline-flex">
    <slot />
    <span
      v-if="!hidden"
      class="absolute -right-1.5 -top-1.5 inline-flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold leading-none shadow-sm ring-2 ring-white dark:ring-[#0c0c0e]"
      :class="[
        toneClass[tone] || toneClass.accent,
        dot ? 'h-2.5 w-2.5' : 'min-w-5 h-5 px-1',
      ]"
      :style="offsetStyle"
    >
      <span v-if="!dot">{{ displayValue }}</span>
    </span>
  </span>
</template>
