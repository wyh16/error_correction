<script setup lang="ts">
/**
 * BaseInfiniteScroll.vue
 * 无限滚动容器：底部 sentinel 进入视口时触发 load，支持自身滚动或外部滚动容器。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  // 提前触发距离（px）：sentinel 距视口底部小于该值即触发
  distance: { type: Number, default: 50 },
  // 外部滚动容器选择器；为空时组件自身作为滚动容器
  target: { type: String, default: '' },
  // 自身滚动模式下的最大高度，数字按 px
  maxHeight: { type: [String, Number], default: '' },
  loading: { type: Boolean, default: false },
  noMore: { type: Boolean, default: false },
})

const emit = defineEmits(['load'])

const rootRef = ref(null)
const sentinelRef = ref(null)

let observer = null

const rootStyle = computed(() => {
  if (props.target || props.maxHeight === '' || props.maxHeight === null) return {}
  return { maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight }
})

function disconnect() {
  observer?.disconnect()
  observer = null
}

/** 重建 observer：root 为自身或外部容器，rootMargin 向下外扩 distance 实现提前触发。 */
function connect() {
  disconnect()
  if (!sentinelRef.value) return
  const root = props.target ? document.querySelector(props.target) : rootRef.value
  observer = new IntersectionObserver(
    entries => {
      if (entries[0]?.isIntersecting && !props.disabled && !props.loading && !props.noMore) {
        emit('load')
      }
    },
    { root: root || null, rootMargin: `0px 0px ${props.distance}px 0px` },
  )
  observer.observe(sentinelRef.value)
}

onMounted(async () => {
  // 等一帧再连接：target 模式下确保外部容器已挂载
  await nextTick()
  connect()
})

// IntersectionObserver 只在交叉状态变化时回调：一批数据加载完后 sentinel 可能仍在视口内，
// 状态解除（loading/noMore/disabled 变 false）时断开重连，强制重新评估一次是否继续加载。
watch(
  [() => props.loading, () => props.noMore, () => props.disabled, () => props.target, () => props.distance],
  async () => {
    await nextTick()
    connect()
  },
)

onBeforeUnmount(disconnect)
</script>

<template>
  <div ref="rootRef" :class="props.target ? '' : 'overflow-y-auto'" :style="rootStyle">
    <slot />
    <!-- sentinel：它进入视口即代表滚动接近底部 -->
    <div ref="sentinelRef" class="h-px" aria-hidden="true"></div>
    <div v-if="props.loading" class="flex items-center justify-center gap-2 py-3 text-xs text-slate-400 dark:text-[#62666d]">
      <slot name="loading">
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-[rgb(var(--accent-rgb)/0.2)] border-t-[rgb(var(--accent-rgb))]" aria-hidden="true"></span>
        <span>加载中…</span>
      </slot>
    </div>
    <div v-else-if="props.noMore" class="py-3 text-center text-xs text-slate-400 dark:text-[#62666d]">
      <slot name="no-more">没有更多了</slot>
    </div>
  </div>
</template>
