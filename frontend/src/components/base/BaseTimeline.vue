<script lang="ts">
export type TimelineTone = 'accent' | 'emerald' | 'amber' | 'rose' | 'blue'

export interface TimelineItem {
  label: string
  description?: string
  time?: string
  icon?: string
  tone?: TimelineTone
}
</script>

<script setup lang="ts">
/**
 * BaseTimeline.vue
 * 垂直时间轴组件，用于展示按时间排列的事件流（如学习记录、订单状态）。
 */
interface Props {
  items?: TimelineItem[]
  /** 末尾追加一个脉冲占位节点，表示时间轴还在继续 */
  pending?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  pending: false,
})

// 纯色圆点配色，与 BaseTag 的 tone 色板保持一致，默认 accent
const dotClass: Record<TimelineTone, string> = {
  accent: 'accent-bg',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  blue: 'bg-blue-500',
}

// 图标节点改用柔和底色圆 + 同色系图标，视觉重量略高于纯色圆点
const iconCircleClass: Record<TimelineTone, string> = {
  accent: 'accent-bg-soft accent-text',
  emerald: 'bg-emerald-500/10 text-emerald-500',
  amber: 'bg-amber-500/10 text-amber-500',
  rose: 'bg-rose-500/10 text-rose-500',
  blue: 'bg-blue-500/10 text-blue-500',
}
</script>

<template>
  <ol>
    <li v-for="(item, index) in props.items" :key="index" class="flex gap-3">
      <!-- 左侧标记列：圆点/图标 + 连接线。用 flex 撑满剩余高度，保证内容高度不同时连线依然连续 -->
      <div class="flex w-7 flex-col items-center">
        <span
          v-if="item.icon"
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          :class="iconCircleClass[item.tone ?? 'accent'] || iconCircleClass.accent"
        >
          <i class="fa-solid text-xs" :class="item.icon"></i>
        </span>
        <span v-else class="my-2 h-2.5 w-2.5 shrink-0 rounded-full" :class="dotClass[item.tone ?? 'accent'] || dotClass.accent"></span>
        <span
          v-if="index < props.items.length - 1 || props.pending"
          class="mt-1 w-px flex-1 bg-slate-200 dark:bg-white/[0.08]"
        ></span>
      </div>

      <!-- 右侧内容列：标签 + 可选时间（右对齐）+ 可选描述 -->
      <div class="min-w-0 flex-1" :class="index < props.items.length - 1 || props.pending ? 'pb-6' : ''">
        <div class="flex items-baseline justify-between gap-3">
          <p class="text-sm font-semibold text-slate-900 dark:text-[#f7f8f8]">{{ item.label }}</p>
          <span v-if="item.time" class="shrink-0 text-xs text-slate-400 dark:text-[#62666d]">{{ item.time }}</span>
        </div>
        <p v-if="item.description" class="mt-1 text-sm leading-relaxed text-slate-500 dark:text-[#8a8f98]">{{ item.description }}</p>
      </div>
    </li>

    <!-- pending 占位节点：灰色脉冲圆点，暗示后续还有事件 -->
    <li v-if="props.pending" class="flex gap-3">
      <div class="flex w-7 justify-center">
        <span class="my-2 h-2.5 w-2.5 animate-pulse rounded-full bg-slate-300 dark:bg-white/[0.15]"></span>
      </div>
    </li>
  </ol>
</template>
