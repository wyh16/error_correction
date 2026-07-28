<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  label: { type: String, default: '' },
  showValue: { type: Boolean, default: false },
  tone: { type: String, default: 'accent' },
  size: { type: String, default: 'md' },
  // 不确定进度：忽略 value，循环播放扫掠动画，用于耗时未知的任务
  indeterminate: { type: Boolean, default: false },
  // 斜向条纹动画，强调「任务进行中」的动态感
  striped: { type: Boolean, default: false },
})

const percent = computed(() => {
  if (!props.max) return 0
  return Math.min(100, Math.max(0, Math.round((props.value / props.max) * 100)))
})

const barClass = {
  accent: 'accent-gradient-bg',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
}
</script>

<template>
  <div>
    <div v-if="label || showValue" class="mb-2 flex items-center justify-between gap-3">
      <span v-if="label" class="text-sm font-medium text-slate-700 dark:text-[#d0d6e0]">{{ label }}</span>
      <span v-if="showValue" class="text-xs font-semibold text-slate-500 dark:text-[#8a8f98]">{{ percent }}%</span>
    </div>
    <div
      class="relative overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/[0.08]"
      :class="size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'"
      role="progressbar"
      :aria-valuenow="indeterminate ? undefined : percent"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <!-- 不确定进度：一段固定宽度的色条来回扫掠，不体现具体百分比 -->
      <div
        v-if="indeterminate"
        class="progress-indeterminate absolute inset-y-0 w-1/3 rounded-full"
        :class="barClass[tone] || barClass.accent"
      ></div>
      <div
        v-else
        class="h-full rounded-full transition-[width] duration-300"
        :class="[barClass[tone] || barClass.accent, striped ? 'progress-striped' : '']"
        :style="{ width: `${percent}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
/* 不确定进度的循环扫掠：从容器左外侧滑入、右外侧滑出。 */
.progress-indeterminate {
  animation: progress-sweep 1.4s ease-in-out infinite;
}

@keyframes progress-sweep {
  0% {
    left: -33%;
  }
  100% {
    left: 100%;
  }
}

/* 斜向条纹用 ::after 叠加在色条之上，避免覆盖 tone 自身的背景（如 accent 渐变）。 */
.progress-striped {
  position: relative;
  overflow: hidden;
}

.progress-striped::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.18) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.18) 50%,
    rgba(255, 255, 255, 0.18) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
  animation: progress-stripes 1s linear infinite;
}

@keyframes progress-stripes {
  0% {
    background-position: 1rem 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
