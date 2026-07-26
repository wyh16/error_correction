<script setup lang="ts">
export interface StepItem {
  value: string | number
  label: string
  description?: string
  status?: 'done' | 'current' | 'pending' | 'error'
  disabled?: boolean
}

interface Props {
  modelValue?: string | number
  steps?: StepItem[]
  direction?: 'horizontal' | 'vertical'
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  steps: () => [],
  direction: 'horizontal',
  clickable: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number, step: StepItem): void
}>()

function statusOf(step: StepItem, index: number, steps: StepItem[], modelValue: string | number) {
  if (step.status) return step.status
  const currentIndex = steps.findIndex(item => item.value === modelValue)
  if (index < currentIndex) return 'done'
  if (index === currentIndex) return 'current'
  return 'pending'
}

/** 步骤间连接线：前一步已完成时高亮。 */
function connectorDone(index: number, steps: StepItem[], modelValue: string | number) {
  const prev = steps[index - 1]
  if (!prev) return false
  return statusOf(prev, index - 1, steps, modelValue) === 'done'
}

function select(step: StepItem) {
  if (!props.clickable || step.disabled) return
  emit('update:modelValue', step.value)
  emit('change', step.value, step)
}
</script>

<template>
  <ol
    class="grid gap-3"
    :class="direction === 'vertical' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-[repeat(var(--step-count),minmax(0,1fr))]'"
    :style="{ '--step-count': steps.length }"
  >
    <li
      v-for="(step, index) in steps"
      :key="step.value"
      class="relative"
    >
      <!-- 水平连接线：从上一步圆点右缘延伸到当前圆点左缘（sm 及以上生效）。
           圆点中心距 li 左缘 1.5rem（p-2 + 半径），gap-3 = 0.75rem -->
      <span
        v-if="index > 0 && direction !== 'vertical'"
        class="absolute left-[calc(-100%-0.75rem+2.5rem)] right-[calc(100%-0.5rem)] top-6 hidden h-0.5 -translate-y-1/2 rounded-full transition-colors sm:block"
        :class="connectorDone(index, steps, modelValue) ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/[0.08]'"
        aria-hidden="true"
      ></span>
      <!-- 垂直连接线：从当前圆点底部向下延伸到下一步圆点顶部 -->
      <span
        v-if="index < steps.length - 1 && direction === 'vertical'"
        class="absolute -bottom-5 left-6 top-10 w-0.5 -translate-x-1/2 rounded-full transition-colors"
        :class="connectorDone(index + 1, steps, modelValue) ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/[0.08]'"
        aria-hidden="true"
      ></span>
      <button
        type="button"
        class="group flex w-full items-start gap-3 rounded-xl p-2 text-left transition-colors"
        :class="step.disabled ? 'cursor-not-allowed opacity-50' : clickable ? 'hover:bg-slate-100 dark:hover:bg-white/[0.05]' : 'cursor-default'"
        @click="select(step)"
      >
        <span
          class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors"
          :class="[
            statusOf(step, index, steps, modelValue) === 'error'
              ? 'border-transparent bg-rose-500 text-white'
              : statusOf(step, index, steps, modelValue) === 'done'
                ? 'border-transparent bg-emerald-500 text-white'
                : statusOf(step, index, steps, modelValue) === 'current'
                  ? 'accent-bg border-transparent text-white'
                  : 'border-slate-200 bg-white text-slate-400 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-[#8a8f98]',
          ]"
        >
          <i v-if="statusOf(step, index, steps, modelValue) === 'error'" class="fa-solid fa-xmark text-[10px]"></i>
          <i v-else-if="statusOf(step, index, steps, modelValue) === 'done'" class="fa-solid fa-check text-[10px]"></i>
          <span v-else>{{ index + 1 }}</span>
        </span>
        <span class="min-w-0">
          <span
            class="block truncate text-sm font-semibold"
            :class="statusOf(step, index, steps, modelValue) === 'error'
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-slate-900 dark:text-[#f7f8f8]'"
          >{{ step.label }}</span>
          <span
            v-if="step.description"
            class="mt-0.5 block text-xs leading-5"
            :class="statusOf(step, index, steps, modelValue) === 'error'
              ? 'text-rose-500/80 dark:text-rose-400/70'
              : 'text-slate-500 dark:text-[#8a8f98]'"
          >
            {{ step.description }}
          </span>
        </span>
      </button>
    </li>
  </ol>
</template>
