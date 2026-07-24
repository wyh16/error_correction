<script setup lang="ts">
/**
 * BaseLoadingBar.vue
 * 顶部加载进度条：start / finish / error 方法驱动，模拟真实请求的推进节奏。
 */
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  // 进度条高度（px）
  height: { type: Number, default: 3 },
  // accent | emerald | amber | rose | blue；error() 时固定切 rose
  tone: { type: String, default: 'accent' },
})

const toneClass = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  blue: 'bg-blue-500',
}

const barRef = ref(null)
const width = ref(0)
const visible = ref(false)
// 渐隐阶段：宽度保持 100%，透明度过渡到 0
const fading = ref(false)
const failed = ref(false)
// 重置宽度时临时关闭过渡，避免从上次残留值倒退动画
const noTransition = ref(false)

let tickTimer = null
let fadeTimer = null
let resetTimer = null

const barClass = computed(() => {
  if (failed.value) return 'bg-rose-500'
  return toneClass[props.tone] || ''
})

const barStyle = computed(() => ({
  width: `${width.value}%`,
  height: `${props.height}px`,
  opacity: fading.value ? 0 : 1,
  // accent 用主题色渐变，其余 tone 走静态映射的实心类
  background: !failed.value && !toneClass[props.tone]
    ? 'linear-gradient(to right, rgb(var(--accent-strong-rgb)), rgb(var(--accent-rgb)))'
    : undefined,
  transition: noTransition.value ? 'none' : 'width 0.2s ease, opacity 0.3s ease',
}))

function clearTimers() {
  clearInterval(tickTimer)
  clearTimeout(fadeTimer)
  clearTimeout(resetTimer)
  tickTimer = null
  fadeTimer = null
  resetTimer = null
}

/** 随机递增：距 90% 越近步子越小，最终停在 90% 等待 finish/error。 */
function tick() {
  const remain = 90 - width.value
  if (remain <= 0) return
  width.value = Math.min(90, width.value + Math.max(remain * 0.08, 0.4) * (0.5 + Math.random()))
}

/** 开始加载：重复调用安全，中途再 start 会先重置再重新推进。 */
async function start() {
  clearTimers()
  failed.value = false
  fading.value = false
  visible.value = true
  noTransition.value = true
  width.value = 0
  await nextTick()
  // 强制一次布局，确保 width:0 已渲染，快进到 12% 才有「从头开始」的动画
  void barRef.value?.offsetWidth
  noTransition.value = false
  width.value = 12
  tickTimer = setInterval(tick, 300)
}

/** 收尾流程：冲到 100% → 250ms 后渐隐 → 完全结束后隐藏并归零。 */
function complete() {
  clearTimers()
  visible.value = true
  noTransition.value = false
  fading.value = false
  width.value = 100
  fadeTimer = setTimeout(() => {
    fading.value = true
    resetTimer = setTimeout(() => {
      visible.value = false
      fading.value = false
      failed.value = false
      noTransition.value = true
      width.value = 0
    }, 320)
  }, 250)
}

function finish() {
  failed.value = false
  complete()
}

function error() {
  failed.value = true
  complete()
}

onBeforeUnmount(clearTimers)

defineExpose({ start, finish, error })
</script>

<template>
  <Teleport to="body">
    <div v-show="visible" class="pointer-events-none fixed left-0 right-0 top-0 z-[10000]">
      <div ref="barRef" class="rounded-r-full" :class="barClass" :style="barStyle"></div>
    </div>
  </Teleport>
</template>
