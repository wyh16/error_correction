<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  src: { type: String, default: '' },
  name: { type: String, default: '' },
  icon: { type: String, default: '' },
  size: { type: String, default: 'md' },
  tone: { type: String, default: 'accent' },
  // 形状：circle（默认圆形）| square（圆角方形）
  shape: { type: String, default: 'circle' },
  // 状态点：online | offline | busy，空字符串不显示
  status: { type: String, default: '' },
})

const initials = computed(() => {
  const text = props.name.trim()
  if (!text) return ''
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length > 1) return words.slice(0, 2).map(word => word[0]).join('').toUpperCase()
  return text.slice(0, 2).toUpperCase()
})

const sizeClass = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

const toneClass = {
  accent: 'accent-bg-soft accent-text',
  neutral: 'bg-slate-100 text-slate-600 dark:bg-white/[0.08] dark:text-[#d0d6e0]',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
}

const statusClass = {
  online: 'bg-emerald-500',
  offline: 'bg-slate-400 dark:bg-slate-500',
  busy: 'bg-rose-500',
}

// 状态点需要溢出到头像边缘之外，因此有状态点时根节点不再裁剪，改由图片自行裁圆角。
const shapeClass = computed(() => (props.shape === 'square' ? 'rounded-lg' : 'rounded-full'))
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center font-bold ring-1 ring-black/[0.04] dark:ring-white/[0.08]"
    :class="[
      sizeClass[size] || sizeClass.md,
      toneClass[tone] || toneClass.accent,
      shapeClass,
      status ? 'relative' : 'overflow-hidden',
    ]"
    :title="name"
  >
    <img v-if="src" :src="src" :alt="name || 'avatar'" class="h-full w-full object-cover" :class="shapeClass" />
    <i v-else-if="icon" class="fa-solid" :class="icon"></i>
    <span v-else>{{ initials || '?' }}</span>
    <!-- 右下角状态点：白色描边把点从头像背景中分离出来 -->
    <span
      v-if="status && statusClass[status]"
      class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-[#1b1b1d]"
      :class="statusClass[status]"
    ></span>
  </span>
</template>
