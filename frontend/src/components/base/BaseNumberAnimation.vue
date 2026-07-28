<script setup lang="ts">
/**
 * BaseNumberAnimation.vue
 * 数字滚动动画：rAF 缓动补间，从 from 平滑滚动到 to，支持千分位与前后缀。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props {
  from?: number
  to: number
  duration?: number
  /** 保留的小数位数 */
  precision?: number
  /** 千分位分隔符，空串表示不分组 */
  separator?: string
  prefix?: string
  suffix?: string
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  from: 0,
  duration: 1500,
  precision: 0,
  separator: ',',
  prefix: '',
  suffix: '',
  autoplay: true,
})

const display = ref(props.from)
let raf: number | null = null

function animate(start: number, end: number) {
  if (raf) cancelAnimationFrame(raf)
  const startedAt = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - startedAt) / Math.max(1, props.duration))
    // easeOutCubic：先快后慢，数字滚动更有「冲上去再稳住」的质感
    const eased = 1 - Math.pow(1 - t, 3)
    display.value = start + (end - start) * eased
    if (t < 1) {
      raf = requestAnimationFrame(step)
    } else {
      // 补间存在浮点误差，结束时强制精确落在目标值
      display.value = end
      raf = null
    }
  }
  raf = requestAnimationFrame(step)
}

// 从 from 重新播放一遍完整动画
function play() {
  animate(props.from, props.to)
}

// to 变化时从当前显示值继续过渡而不是跳回 from 重播，数值连续变化更平滑
watch(
  () => props.to,
  value => {
    animate(display.value, value)
  },
)

onMounted(() => {
  if (props.autoplay) play()
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
})

const formatted = computed(() => {
  // 负数先取绝对值格式化，最后补回符号，避免分隔符插进负号后面
  const sign = display.value < 0 ? '-' : ''
  const fixed = Math.abs(display.value).toFixed(props.precision)
  const [integer, decimal] = fixed.split('.')
  const grouped = props.separator
    ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, props.separator)
    : integer
  return sign + grouped + (decimal ? '.' + decimal : '')
})

defineExpose({ play })
</script>

<template>
  <span class="tabular-nums">{{ prefix }}{{ formatted }}{{ suffix }}</span>
</template>
