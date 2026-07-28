<script setup lang="ts">
/**
 * BaseResult.vue
 * 结果反馈块：操作完成后的成功 / 失败 / 警告 / 信息提示，居中大图标 + 标题 + 描述 + 操作区。
 */
import { computed } from 'vue'

type ResultStatus = 'success' | 'error' | 'warning' | 'info'

interface Props {
  status?: ResultStatus
  title: string
  description?: string
  /** 自定义图标，传 fa-* 类名时覆盖 status 的默认图标 */
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  status: 'info',
  description: '',
  icon: '',
})

const statusMap: Record<ResultStatus, { icon: string; circle: string }> = {
  success: { icon: 'fa-circle-check', circle: 'bg-emerald-500/10 text-emerald-500' },
  error: { icon: 'fa-circle-xmark', circle: 'bg-rose-500/10 text-rose-500' },
  warning: { icon: 'fa-triangle-exclamation', circle: 'bg-amber-500/10 text-amber-500' },
  info: { icon: 'fa-circle-info', circle: 'accent-bg-soft accent-text' },
}

const current = computed(() => statusMap[props.status] || statusMap.info)
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center py-8">
    <!-- 状态图标：大号彩色圆底 -->
    <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full" :class="current.circle">
      <i class="fa-solid text-3xl" :class="props.icon || current.icon"></i>
    </div>

    <h3 class="text-base font-medium text-slate-900 dark:text-[#f7f8f8]">{{ props.title }}</h3>

    <p v-if="props.description" class="mt-2 max-w-sm text-center text-sm leading-relaxed text-slate-500 dark:text-[#8a8f98]">{{ props.description }}</p>

    <!-- 操作按钮区：只在调用方提供插槽内容时渲染 -->
    <div v-if="$slots.default" class="mt-6 flex items-center gap-3">
      <slot></slot>
    </div>
  </div>
</template>
