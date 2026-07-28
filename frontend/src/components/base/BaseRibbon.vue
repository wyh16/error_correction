<script setup lang="ts">
/**
 * BaseRibbon.vue
 * 缎带角标：包裹任意容器，在角上叠加一条斜向丝带，用于「推荐」「热门」等强调标记。
 */
defineProps({
  text: { type: String, default: '' },
  tone: { type: String, default: 'accent' },
  // top-right | top-left
  placement: { type: String, default: 'top-right' },
})

const toneClass = {
  accent: 'accent-bg',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  blue: 'bg-blue-500',
}

const cornerClass = {
  'top-right': 'right-0 top-0',
  'top-left': 'left-0 top-0',
}

// 丝带宽 w-28，通过负偏移 + 45 度旋转斜穿角落，超出部分由外层 overflow-hidden 裁掉
const bandClass = {
  'top-right': 'right-[-28px] top-[14px] rotate-45',
  'top-left': 'left-[-28px] top-[14px] -rotate-45',
}
</script>

<template>
  <div class="relative">
    <slot />
    <!-- 角标容器只负责裁剪丝带两端，pointer-events-none 避免挡住卡片交互 -->
    <div
      v-if="text"
      class="pointer-events-none absolute z-10 h-[4.5rem] w-[4.5rem] overflow-hidden"
      :class="cornerClass[placement] || cornerClass['top-right']"
    >
      <span
        class="absolute w-28 py-0.5 text-center text-[10px] font-semibold text-white shadow-sm"
        :class="[toneClass[tone] || toneClass.accent, bandClass[placement] || bandClass['top-right']]"
      >{{ text }}</span>
    </div>
  </div>
</template>
