<script setup lang="ts">
/**
 * BaseDateRangePicker.vue
 * 日期范围选择器：双月并排面板，两次点击确定起止日期，支持 hover 预览区间
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useDropdownPosition } from '@/composables/useDropdownPosition'

interface DayCell {
  value: string
  label: number
  muted: boolean
  today: boolean
  disabled: boolean
}

interface Props {
  // ['YYYY-MM-DD', 'YYYY-MM-DD'] 或空数组
  modelValue?: string[]
  min?: string
  max?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  // 错误态：红色边框
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  min: '',
  max: '',
  placeholder: '开始日期 → 结束日期',
  disabled: false,
  clearable: false,
  error: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'change', value: string[]): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const open = ref(false)
const today = new Date()

// 弹层 Teleport 到 body，避免被祖先 overflow 裁剪
const { panelStyle, isOutside } = useDropdownPosition(open, rootRef, panelRef)

// 左面板锚点月（每月 1 号），右面板恒为锚点 +1 月
const anchor = ref(new Date(today.getFullYear(), today.getMonth(), 1))

// 选择中的起点与 hover 预览点：起点存在说明正处于「等待第二次点击」状态
const pickingStart = ref('')
const hovered = ref('')

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

function formatDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const hasValue = computed(() => props.modelValue.length === 2)
const displayText = computed(() => (hasValue.value ? `${props.modelValue[0]} → ${props.modelValue[1]}` : ''))
const showClear = computed(() => props.clearable && hasValue.value && !props.disabled)

// 当前应高亮的区间：选择中优先展示「起点 + hover 预览」，否则展示已提交的值
const displayRange = computed(() => {
  if (pickingStart.value) {
    if (hovered.value) {
      const pair = [pickingStart.value, hovered.value].sort()
      return { start: pair[0], end: pair[1] }
    }
    return { start: pickingStart.value, end: pickingStart.value }
  }
  if (hasValue.value) return { start: props.modelValue[0], end: props.modelValue[1] }
  return { start: '', end: '' }
})

// 以锚点月偏移 offset 个月生成 42 格（6 周补齐，跨月日期标记 muted）
function makeDays(offset: number): DayCell[] {
  const year = anchor.value.getFullYear()
  const month = anchor.value.getMonth() + offset
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const value = formatDate(date)
    return {
      value,
      label: date.getDate(),
      muted: date.getMonth() !== first.getMonth(),
      today: value === formatDate(today),
      disabled: Boolean((props.min && value < props.min) || (props.max && value > props.max)),
    }
  })
}

const panels = computed(() => [0, 1].map(offset => {
  const date = new Date(anchor.value.getFullYear(), anchor.value.getMonth() + offset, 1)
  return {
    title: `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`,
    days: makeDays(offset),
  }
}))

function moveMonth(delta: number) {
  anchor.value = new Date(anchor.value.getFullYear(), anchor.value.getMonth() + delta, 1)
}

function toggle() {
  if (props.disabled) return
  if (open.value) {
    close()
    return
  }
  // 打开时定位到已选起点所在月，保证选中区间可见
  const base = hasValue.value ? new Date(`${props.modelValue[0]}T00:00:00`) : today
  anchor.value = new Date(base.getFullYear(), base.getMonth(), 1)
  pickingStart.value = ''
  hovered.value = ''
  open.value = true
}

function close() {
  open.value = false
  pickingStart.value = ''
  hovered.value = ''
}

function handleDayClick(day: DayCell) {
  if (day.disabled) return
  // 第一次点击：进入选择态，旧区间从面板上消失（modelValue 在确认前保持不变）
  if (!pickingStart.value) {
    pickingStart.value = day.value
    hovered.value = ''
    return
  }
  // 第二次点击：终点早于起点时交换，提交并关闭
  const range = [pickingStart.value, day.value].sort()
  emit('update:modelValue', range)
  emit('change', range)
  close()
}

function handleDayHover(day: DayCell) {
  if (!pickingStart.value || day.disabled) return
  hovered.value = day.value
}

function dayClass(day: DayCell) {
  const { start, end } = displayRange.value
  // 跨月溢出格与相邻面板的当月格是同一天，muted 格不参与高亮，避免区间在两个面板重复出现
  const isEndpoint = !day.muted && (day.value === start || day.value === end)
  const inRange = !day.muted && Boolean(start) && day.value > start && day.value < end
  if (isEndpoint) return 'rounded-lg accent-bg font-bold text-white shadow-sm'
  // 区间中段不加圆角，让软色背景左右连成整条
  if (inRange) return 'accent-bg-soft accent-text'
  if (day.today) return 'rounded-lg accent-text font-bold hover:bg-slate-100 dark:hover:bg-white/[0.05]'
  if (day.muted) return 'rounded-lg text-slate-300 hover:bg-slate-100 dark:text-[#4d535c] dark:hover:bg-white/[0.04]'
  return 'rounded-lg text-slate-700 hover:bg-slate-100 dark:text-[#d0d6e0] dark:hover:bg-white/[0.05]'
}

function clearValue() {
  emit('update:modelValue', [])
  emit('change', [])
}

// 点击触发器与弹层之外时收起（弹层已 Teleport，需同时排除两者）
function onDocPointerDown(event: PointerEvent) {
  if (!open.value) return
  if (isOutside(event.target)) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointerDown)
})
</script>

<template>
  <div ref="rootRef" class="relative" @keydown="onKeydown">
    <div class="group relative">
      <button
        type="button"
        :disabled="disabled"
        aria-haspopup="dialog"
        :aria-expanded="open"
        class="flex h-9 w-full items-center rounded-md border bg-white pl-9 pr-8 text-left text-sm outline-none transition-colors dark:bg-white/[0.03]"
        :class="[
          error
            ? 'border-rose-500/50 hover:border-rose-500/50'
            : open
              ? 'border-[rgb(var(--accent-rgb)/0.4)]'
              : 'border-slate-200 hover:border-slate-300 dark:border-white/[0.08] dark:hover:border-white/[0.16]',
          disabled ? 'cursor-not-allowed opacity-50 hover:border-slate-200 dark:hover:border-white/[0.08]' : '',
        ]"
        @click="toggle"
      >
        <span class="truncate" :class="displayText ? 'text-slate-800 dark:text-[#d0d6e0]' : 'text-slate-400 dark:text-[#62666d]'">
          {{ displayText || placeholder }}
        </span>
      </button>
      <i class="fa-solid fa-calendar pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-[#62666d]"></i>
      <!-- clearable 且有值时悬停显示清空按钮 -->
      <button
        v-if="showClear"
        type="button"
        aria-label="清空日期范围"
        class="absolute right-2.5 top-1/2 hidden -translate-y-1/2 text-xs text-slate-400 transition-colors hover:text-slate-600 group-hover:block dark:text-[#62666d] dark:hover:text-[#d0d6e0]"
        @click.stop="clearValue"
      >
        <i class="fa-solid fa-circle-xmark"></i>
      </button>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-1 opacity-0"
      >
        <div
          v-if="open"
          ref="panelRef"
          role="dialog"
          :style="panelStyle"
          class="flex rounded-lg border border-slate-200 bg-white/95 p-3 shadow-lg shadow-slate-200/60 dark:border-white/[0.08] dark:bg-[#1f1f22] dark:shadow-black/40"
          @keydown="onKeydown"
          @mouseleave="hovered = ''"
        >
        <div
          v-for="(panel, panelIndex) in panels"
          :key="panel.title"
          class="w-56"
          :class="panelIndex === 1 ? 'ml-4 border-l border-slate-200 pl-4 dark:border-white/[0.08]' : ''"
        >
          <div class="mb-2 flex items-center">
            <!-- 月份切换按钮只放最左与最右，两个面板永远保持相邻月；无按钮的一侧用等宽占位保持标题居中 -->
            <button
              v-if="panelIndex === 0"
              type="button"
              aria-label="上一个月"
              class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:text-[#8a8f98] dark:hover:bg-white/[0.06]"
              @click="moveMonth(-1)"
            >
              <i class="fa-solid fa-chevron-left text-[10px]"></i>
            </button>
            <span v-else class="h-7 w-7 shrink-0"></span>
            <p class="flex-1 text-center text-sm font-bold text-slate-900 dark:text-[#f7f8f8]">{{ panel.title }}</p>
            <button
              v-if="panelIndex === 1"
              type="button"
              aria-label="下一个月"
              class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:text-[#8a8f98] dark:hover:bg-white/[0.06]"
              @click="moveMonth(1)"
            >
              <i class="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
            <span v-else class="h-7 w-7 shrink-0"></span>
          </div>

          <div class="grid grid-cols-7">
            <div v-for="day in weekDays" :key="day" class="flex h-8 items-center justify-center text-xs font-bold text-slate-400 dark:text-[#62666d]">{{ day }}</div>
            <button
              v-for="day in panel.days"
              :key="day.value"
              type="button"
              :disabled="day.disabled"
              class="flex h-8 items-center justify-center text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30"
              :class="dayClass(day)"
              @click="handleDayClick(day)"
              @mouseenter="handleDayHover(day)"
            >
              {{ day.label }}
            </button>
          </div>
        </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
