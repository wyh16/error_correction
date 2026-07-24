<script setup lang="ts">
/**
 * BaseSpin.vue
 * 加载指示器：可独立使用、包裹内容形成局部加载遮罩，或全屏加载。
 */
import { computed } from 'vue'

const props = defineProps({
  spinning: { type: Boolean, default: true },
  // sm | md | lg
  size: { type: String, default: 'md' },
  tip: { type: String, default: '' },
  // 全屏模式：Teleport 到 body，覆盖整个视口
  fullscreen: { type: Boolean, default: false },
})

const sizeClass = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-9 w-9',
}

// 圆环 spinner：底环用低透明度 accent，顶部弧线全彩，旋转形成追逐效果
const spinnerClass = computed(() => [
  'animate-spin rounded-full border-2 border-[rgb(var(--accent-rgb)/0.2)] border-t-[rgb(var(--accent-rgb))]',
  sizeClass[props.size] || sizeClass.md,
])
</script>

<template>
  <Teleport v-if="fullscreen" to="body">
    <div
      v-if="spinning"
      class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-black/50"
    >
      <span :class="spinnerClass"></span>
      <span v-if="tip" class="mt-2 text-xs accent-text">{{ tip }}</span>
    </div>
  </Teleport>

  <!-- 包裹模式：内容降透明加轻微模糊并拦截交互，遮罩层居中展示 spinner -->
  <div v-else-if="$slots.default" class="relative">
    <div
      class="transition duration-200"
      :class="spinning ? 'pointer-events-none select-none opacity-50 blur-[1px]' : ''"
    >
      <slot />
    </div>
    <div v-if="spinning" class="absolute inset-0 z-10 flex flex-col items-center justify-center">
      <span :class="spinnerClass"></span>
      <span v-if="tip" class="mt-2 text-xs accent-text">{{ tip }}</span>
    </div>
  </div>

  <!-- 独立模式：行内 spinner + 灰字提示 -->
  <span v-else-if="spinning" class="inline-flex items-center gap-2">
    <span :class="spinnerClass"></span>
    <span v-if="tip" class="text-xs text-slate-500 dark:text-[#8a8f98]">{{ tip }}</span>
  </span>
</template>
