<script setup lang="ts">
/**
 * BaseEllipsis.vue
 * 多行文本省略：截断自动检测，支持展开收起与 Tooltip 展示完整内容。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import BaseTooltip from './BaseTooltip.vue'

interface Props {
  content?: string
  lineClamp?: number
  /** 截断时在文本后显示「展开 / 收起」按钮 */
  expandable?: boolean
  /** 截断时悬停显示完整内容（仅 content 文本模式支持） */
  tooltip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  lineClamp: 1,
  expandable: false,
  tooltip: false,
})

const slots = useSlots()
// 有默认 slot 时优先渲染 slot；此时拿不到可靠的纯文本，tooltip 自动失效
const hasSlot = computed(() => !!slots.default)

const textRef = ref<HTMLElement | null>(null)
const expanded = ref(false)
const truncated = ref(false)

const clampStyle = computed<Record<string, string> | null>(() => {
  if (expanded.value) return null
  return {
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': String(props.lineClamp),
    overflow: 'hidden',
  }
})

function measure() {
  // 展开状态下高度已完全撑开，测不出截断，收起时再重测
  if (expanded.value || !textRef.value) return
  // +1 容差：吸收行高取整带来的亚像素误差，避免误判
  truncated.value = textRef.value.scrollHeight > textRef.value.clientHeight + 1
}

let observer: ResizeObserver | null = null

onMounted(() => {
  measure()
  // 容器宽度变化会改变换行结果，必须重新检测截断
  observer = new ResizeObserver(measure)
  if (textRef.value) observer.observe(textRef.value)
})

// tooltip 分支切换会重建文本节点，跟随 ref 重新挂 observer
watch(textRef, (el, old) => {
  if (!observer) return
  if (old) observer.unobserve(old)
  if (el) {
    observer.observe(el)
    measure()
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

watch(
  () => [props.content, props.lineClamp],
  async () => {
    await nextTick()
    measure()
  },
)

function toggle() {
  expanded.value = !expanded.value
  // 收起后重测：展开期间容器宽度可能已变化
  if (!expanded.value) nextTick(measure)
}
</script>

<template>
  <div>
    <BaseTooltip
      v-if="tooltip && !hasSlot"
      :text="content"
      :disabled="!truncated || expanded"
      class="max-w-full"
    >
      <div ref="textRef" class="min-w-0" :style="clampStyle">{{ content }}</div>
    </BaseTooltip>
    <div v-else ref="textRef" :style="clampStyle">
      <slot>{{ content }}</slot>
    </div>
    <!-- 只有确实发生截断（或已展开待收起）才出现按钮，短文本不打扰 -->
    <button
      v-if="expandable && (truncated || expanded)"
      type="button"
      class="accent-text mt-1 text-xs font-medium hover:underline"
      @click="toggle"
    >
      {{ expanded ? '收起' : '展开' }}
    </button>
  </div>
</template>
