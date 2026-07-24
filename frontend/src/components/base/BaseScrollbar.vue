<script setup lang="ts">
/**
 * BaseScrollbar.vue
 * 自定义滚动条容器：隐藏原生滚动条，右侧覆盖式细 thumb，支持拖拽与自动显隐。
 *
 * 取舍：只实现垂直方向；水平滚动场景少且交互复杂度翻倍，需要时直接用原生滚动。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  // 容器最大高度，数字按 px 处理
  maxHeight: { type: [String, Number], default: '' },
  // true 常显 thumb；false 仅 hover 或滚动时显示
  always: { type: Boolean, default: false },
})

const wrapRef = ref(null)
const contentRef = ref(null)
const thumbHeight = ref(0)
const thumbTop = ref(0)
const hasOverflow = ref(false)
// 滚动中强制显示 thumb，停止 400ms 后允许淡出
const scrolling = ref(false)
const dragging = ref(false)

let hideTimer = null
let resizeObserver = null
// 拖拽起点：按下时的指针 Y 与 scrollTop
let dragStartY = 0
let dragStartScrollTop = 0

const wrapStyle = computed(() => {
  if (props.maxHeight === '' || props.maxHeight === null) return {}
  return { maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight }
})

// 用互斥的 class 组合避免 opacity-0 / opacity-100 同时存在时依赖样式表顺序
const thumbOpacityClass = computed(() => {
  if (props.always || scrolling.value || dragging.value) return 'opacity-100'
  return 'opacity-0 group-hover:opacity-100'
})

/** 按「视口 : 内容」比例计算 thumb 高度与位置；无溢出时不渲染。 */
function updateThumb() {
  const el = wrapRef.value
  if (!el) return
  const { clientHeight, scrollHeight, scrollTop } = el
  hasOverflow.value = scrollHeight > clientHeight + 1
  if (!hasOverflow.value) return
  thumbHeight.value = Math.max((clientHeight / scrollHeight) * clientHeight, 24)
  // thumb 有 24px 最小高度，直接按比例算 top 会越界，改按滚动进度在可移动范围内插值
  const maxTop = clientHeight - thumbHeight.value
  thumbTop.value = maxTop * (scrollTop / (scrollHeight - clientHeight))
}

function onScroll() {
  updateThumb()
  scrolling.value = true
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    scrolling.value = false
  }, 400)
}

function onThumbPointerDown(event) {
  const el = wrapRef.value
  if (!el) return
  dragging.value = true
  dragStartY = event.clientY
  dragStartScrollTop = el.scrollTop
  // 捕获指针：拖拽移出 thumb 甚至组件区域时仍持续接收 move 事件
  event.currentTarget.setPointerCapture(event.pointerId)
}

function onThumbPointerMove(event) {
  if (!dragging.value) return
  const el = wrapRef.value
  if (!el) return
  const maxTop = el.clientHeight - thumbHeight.value
  if (maxTop <= 0) return
  // 指针位移按「内容可滚距离 : thumb 可移动距离」的比例换算成 scrollTop
  const ratio = (el.scrollHeight - el.clientHeight) / maxTop
  el.scrollTop = dragStartScrollTop + (event.clientY - dragStartY) * ratio
}

function onThumbPointerUp() {
  dragging.value = false
}

onMounted(() => {
  updateThumb()
  // 容器尺寸与内容高度变化（列表增删、图片加载）都要重算 thumb
  resizeObserver = new ResizeObserver(updateThumb)
  if (wrapRef.value) resizeObserver.observe(wrapRef.value)
  if (contentRef.value) resizeObserver.observe(contentRef.value)
})

onBeforeUnmount(() => {
  clearTimeout(hideTimer)
  resizeObserver?.disconnect()
  resizeObserver = null
})
</script>

<template>
  <div class="group relative">
    <div
      ref="wrapRef"
      class="base-scrollbar__view no-scrollbar overflow-y-auto"
      :style="wrapStyle"
      @scroll="onScroll"
    >
      <div ref="contentRef">
        <slot />
      </div>
    </div>
    <!-- 覆盖式 thumb：绝对定位在容器右缘，不占布局宽度 -->
    <div
      v-if="hasOverflow"
      class="absolute right-[3px] w-1.5 cursor-pointer rounded-full bg-slate-400/40 transition-opacity duration-200 hover:bg-slate-400/70 dark:bg-white/20 dark:hover:bg-white/35"
      :class="[thumbOpacityClass, dragging ? 'select-none' : '']"
      :style="{ height: `${thumbHeight}px`, top: `${thumbTop}px` }"
      @pointerdown.prevent="onThumbPointerDown"
      @pointermove="onThumbPointerMove"
      @pointerup="onThumbPointerUp"
      @pointercancel="onThumbPointerUp"
    ></div>
  </div>
</template>

<style scoped>
/* 自带隐藏原生滚动条的兜底样式，不依赖全局工具类 */
.base-scrollbar__view {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.base-scrollbar__view::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
</style>
