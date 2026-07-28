<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue?: string
  min?: string
  max?: string
  /** 自定义禁用逻辑：返回 true 的日期不可点选并置灰 */
  disabledDate?: ((date: Date) => boolean) | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  min: '',
  max: '',
  disabledDate: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string, date: Date]
}>()

interface CalendarDay {
  date: Date
  value: string
  label: number
  muted: boolean
  today: boolean
  selected: boolean
  disabled: boolean
}

// today 用 ref 保存并在切换月份时刷新，避免组件跨午夜后「今天」高亮过期
const today = ref(new Date())
const visibleDate = ref(props.modelValue ? new Date(`${props.modelValue}T00:00:00`) : new Date(today.value.getFullYear(), today.value.getMonth(), 1))
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

watch(() => props.modelValue, value => {
  if (value) visibleDate.value = new Date(`${value}T00:00:00`)
})

const monthLabel = computed(() =>
  `${visibleDate.value.getFullYear()} 年 ${visibleDate.value.getMonth() + 1} 月`,
)

const days = computed<CalendarDay[]>(() => {
  const year = visibleDate.value.getFullYear()
  const month = visibleDate.value.getMonth()
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const value = formatDate(date)
    return {
      date,
      value,
      label: date.getDate(),
      muted: date.getMonth() !== month,
      today: value === formatDate(today.value),
      selected: value === props.modelValue,
      disabled: Boolean(
        (props.min && value < props.min)
        || (props.max && value > props.max)
        || (props.disabledDate && props.disabledDate(date)),
      ),
    }
  })
})

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function moveMonth(delta: number) {
  today.value = new Date()
  visibleDate.value = new Date(visibleDate.value.getFullYear(), visibleDate.value.getMonth() + delta, 1)
}

function select(day: CalendarDay) {
  if (day.disabled) return
  emit('update:modelValue', day.value)
  emit('change', day.value, day.date)
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/[0.08] dark:bg-white/[0.03]">
    <div class="mb-3 flex items-center justify-between gap-3">
      <button type="button" class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-[#8a8f98] dark:hover:bg-white/[0.06]" @click="moveMonth(-1)">
        <i class="fa-solid fa-chevron-left text-xs"></i>
      </button>
      <p class="text-sm font-bold text-slate-900 dark:text-[#f7f8f8]">{{ monthLabel }}</p>
      <button type="button" class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-[#8a8f98] dark:hover:bg-white/[0.06]" @click="moveMonth(1)">
        <i class="fa-solid fa-chevron-right text-xs"></i>
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1 text-center">
      <div v-for="day in weekDays" :key="day" class="py-1 text-xs font-bold text-slate-400 dark:text-[#62666d]">{{ day }}</div>
      <button
        v-for="day in days"
        :key="day.value"
        type="button"
        class="flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30"
        :class="[
          day.selected
            ? 'accent-bg font-bold text-white shadow-sm'
            : day.today
              ? 'accent-bg-soft accent-text font-bold'
              : day.muted
                ? 'text-slate-300 hover:bg-slate-100 dark:text-[#4d535c] dark:hover:bg-white/[0.04]'
                : 'text-slate-700 hover:bg-slate-100 dark:text-[#d0d6e0] dark:hover:bg-white/[0.05]',
        ]"
        :disabled="day.disabled"
        @click="select(day)"
      >
        {{ day.label }}
      </button>
    </div>
  </div>
</template>
