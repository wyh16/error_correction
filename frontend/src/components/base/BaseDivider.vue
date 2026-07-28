<script setup lang="ts">
interface Props {
  label?: string
  orientation?: 'horizontal' | 'vertical'
  dashed?: boolean
  labelPlacement?: 'left' | 'center' | 'right'
}

withDefaults(defineProps<Props>(), {
  label: '',
  orientation: 'horizontal',
  dashed: false,
  labelPlacement: 'center',
})
</script>

<template>
  <div
    v-if="orientation === 'vertical'"
    class="mx-2 h-full min-h-6 w-px"
    :class="dashed
      ? 'border-l border-dashed border-slate-200 bg-transparent dark:border-white/[0.08]'
      : 'bg-slate-200 dark:bg-white/[0.08]'"
    role="separator"
    aria-orientation="vertical"
  ></div>
  <div v-else class="flex items-center gap-3" role="separator">
    <span
      class="h-px"
      :class="[
        label && labelPlacement === 'left' ? 'w-6 shrink-0' : 'flex-1',
        dashed ? 'border-t border-dashed border-slate-200 bg-transparent dark:border-white/[0.08]' : 'bg-slate-200 dark:bg-white/[0.08]',
      ]"
    ></span>
    <span v-if="label" class="text-xs font-semibold uppercase text-slate-400 dark:text-[#62666d]">{{ label }}</span>
    <span
      class="h-px"
      :class="[
        label && labelPlacement === 'right' ? 'w-6 shrink-0' : 'flex-1',
        dashed ? 'border-t border-dashed border-slate-200 bg-transparent dark:border-white/[0.08]' : 'bg-slate-200 dark:bg-white/[0.08]',
      ]"
    ></span>
  </div>
</template>
