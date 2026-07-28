<script setup lang="ts">
/**
 * BaseCountdown.vue
 * 倒计时组件：支持剩余秒数 / 目标时间戳两种输入，可开始、暂停、重置。
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'

interface Props {
  /** > 1e12 视为目标时间戳（ms），否则视为剩余秒数 */
  value?: number
  /** 支持 DD / HH / mm / ss 占位符，如 'DD 天 HH:mm:ss' */
  format?: string
  autoStart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  format: 'HH:mm:ss',
  autoStart: true,
})

const emit = defineEmits<{
  change: [remainingMs: number]
  finish: []
}>()

function computeInitial(): number {
  if (props.value > 1e12) return Math.max(0, props.value - Date.now())
  return Math.max(0, props.value * 1000)
}

const remaining = ref(computeInitial())
const running = ref(false)

let deadline = 0
let timer: ReturnType<typeof setInterval> | null = null

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function tick() {
  const next = Math.max(0, deadline - Date.now())
  if (next !== remaining.value) {
    remaining.value = next
    emit('change', next)
  }
  if (next <= 0) {
    stopTimer()
    running.value = false
    emit('finish')
  }
}

function start() {
  if (running.value || remaining.value <= 0) return
  running.value = true
  // deadline 机制：每次 tick 都按绝对时间重算剩余量，interval 抖动不会累积误差
  deadline = Date.now() + remaining.value
  timer = setInterval(tick, 200)
}

function pause() {
  if (!running.value) return
  stopTimer()
  running.value = false
  remaining.value = Math.max(0, deadline - Date.now())
}

function reset() {
  stopTimer()
  running.value = false
  remaining.value = computeInitial()
  if (props.autoStart) start()
}

// value 变化视为换了一个新的倒计时目标，直接重置
watch(() => props.value, reset)

if (props.autoStart) start()

onBeforeUnmount(stopTimer)

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

const display = computed(() => {
  // 向上取整：90 秒从 01:30 开始展示，结束瞬间正好归零
  const totalSeconds = Math.ceil(remaining.value / 1000)
  const hasDay = props.format.includes('DD')
  // 无 DD 占位时把天数折算进小时，避免超过 24 小时的部分丢失
  const hours = hasDay
    ? Math.floor((totalSeconds % 86400) / 3600)
    : Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  let text = props.format
  if (hasDay) text = text.replace('DD', String(Math.floor(totalSeconds / 86400)))
  return text.replace('HH', pad(hours)).replace('mm', pad(minutes)).replace('ss', pad(seconds))
})

defineExpose({ start, pause, reset })
</script>

<template>
  <span class="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-[#f7f8f8]">{{ display }}</span>
</template>
