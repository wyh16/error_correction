<script setup lang="ts">
interface Props {
  variant?: 'rect' | 'text' | 'circle'
  lines?: number
  animated?: boolean
  /** 传入 Tailwind 圆角类（如 rounded-md）覆盖各形态的默认圆角，空字符串保持默认 */
  rounded?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'rect',
  lines: 1,
  animated: true,
  rounded: '',
})
</script>

<template>
  <div v-if="variant === 'text'" class="space-y-2">
    <span
      v-for="line in lines"
      :key="line"
      class="block h-3 bg-slate-200 dark:bg-white/[0.08]"
      :class="[
        rounded || 'rounded',
        animated ? 'animate-pulse' : '',
        line === lines ? 'w-2/3' : 'w-full',
      ]"
    ></span>
  </div>
  <span
    v-else
    class="block bg-slate-200 dark:bg-white/[0.08]"
    :class="[
      animated ? 'animate-pulse' : '',
      variant === 'circle' ? 'h-10 w-10' : 'h-24 w-full',
      rounded || (variant === 'circle' ? 'rounded-full' : 'rounded-xl'),
    ]"
  ></span>
</template>
