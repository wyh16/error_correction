<script setup lang="ts">
/**
 * BaseCircleProgress.vue
 * 环形进度条：SVG 描边实现，支持多色调、自定义中心内容与不确定态。
 */
import { computed } from 'vue'

type CircleProgressTone = 'accent' | 'emerald' | 'amber' | 'rose' | 'blue'

interface Props {
  /** 0-100，超出范围自动收敛 */
  value?: number
  /** 直径（px） */
  size?: number
  strokeWidth?: number
  tone?: CircleProgressTone
  showValue?: boolean
  /** 不确定态：固定弧长 + 整体旋转，用于进度未知的加载 */
  indeterminate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  size: 96,
  strokeWidth: 8,
  tone: 'accent',
  showValue: true,
  indeterminate: false,
})

const clamped = computed(() => Math.min(100, Math.max(0, props.value)))
const center = computed(() => props.size / 2)
// 半径内缩半个描边宽，避免圆环描边被 viewBox 裁切
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const dashOffset = computed(() => {
  // 不确定态固定露出 1/4 弧，进行感靠旋转动画表达
  if (props.indeterminate) return circumference.value * 0.75
  return circumference.value * (1 - clamped.value / 100)
})

// accent 需要跟随主题色 CSS 变量，只能走 style；其余固定色用静态类
const strokeClass: Partial<Record<CircleProgressTone, string>> = {
  emerald: 'stroke-emerald-500',
  amber: 'stroke-amber-500',
  rose: 'stroke-rose-500',
  blue: 'stroke-blue-500',
}

const progressStyle = computed(() => {
  if (strokeClass[props.tone]) return { transition: 'stroke-dashoffset 0.4s ease' }
  return { transition: 'stroke-dashoffset 0.4s ease', stroke: 'rgb(var(--accent-rgb))' }
})
</script>

<template>
  <div
    class="relative inline-flex items-center justify-center"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : Math.round(clamped)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      :class="indeterminate ? 'animate-spin' : ''"
    >
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        class="stroke-slate-200 dark:stroke-white/10"
        :stroke-width="strokeWidth"
      />
      <!-- 进度环：旋转 -90 度让起点落在 12 点方向，dashoffset 过渡产生进度动画 -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke-linecap="round"
        :class="strokeClass[tone] || ''"
        :style="progressStyle"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        :transform="`rotate(-90 ${center} ${center})`"
      />
    </svg>
    <!-- 中心内容：slot 优先；不确定态下进度数字没有意义，隐藏默认数值 -->
    <div class="absolute inset-0 flex items-center justify-center">
      <slot>
        <span
          v-if="showValue && !indeterminate"
          class="text-sm font-bold text-slate-900 dark:text-[#f7f8f8]"
        >{{ Math.round(clamped) }}%</span>
      </slot>
    </div>
  </div>
</template>
