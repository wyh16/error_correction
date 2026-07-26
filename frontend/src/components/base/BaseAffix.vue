<script setup lang="ts">
/**
 * BaseAffix.vue
 * 固钉：内容滚动到距容器（或视口）顶部 offsetTop 以内时切换为 fixed 吸附。
 * 传入 offsetBottom 时改为吸底（与 offsetTop 互斥，offsetBottom 优先）。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props {
  // 吸附时距容器（或视口）顶部的偏移（px）
  offsetTop?: number
  // 吸附时距容器（或视口）底部的偏移（px）；传入后按吸底模式工作
  offsetBottom?: number
  // 滚动容器选择器，为空时监听 window
  target?: string
}

const props = withDefaults(defineProps<Props>(), {
  offsetTop: 0,
  offsetBottom: undefined,
  target: '',
})

const emit = defineEmits<{
  (e: 'change', fixed: boolean): void
}>()

const placeholderRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const fixed = ref(false)
// fixed 时占位符撑住原高度防止布局跳动；left/width 取占位符实测值防止宽度塌陷
const placeholderStyle = ref<Record<string, string | number>>({})
const contentStyle = ref<Record<string, string | number>>({})

// 当前监听的滚动目标：HTMLElement 或 window
let scrollTarget: HTMLElement | Window | null = null

const isBottomMode = computed(() => props.offsetBottom !== undefined)

function update() {
  if (!placeholderRef.value || !contentRef.value || !scrollTarget) return
  const rect = placeholderRef.value.getBoundingClientRect()

  let shouldFix: boolean
  let fixedStyle: Record<string, string | number>

  if (isBottomMode.value) {
    // 吸底：占位符底边低于「容器底 - offsetBottom」时吸附
    const containerBottom = scrollTarget === window
      ? window.innerHeight
      : (scrollTarget as HTMLElement).getBoundingClientRect().bottom
    const bottomOffset = props.offsetBottom ?? 0
    shouldFix = rect.bottom >= containerBottom - bottomOffset
    fixedStyle = {
      position: 'fixed',
      top: `${containerBottom - bottomOffset - contentRef.value.offsetHeight}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 10,
    }
  } else {
    // window 模式容器顶就是视口顶（0）；容器模式取容器当前视口位置
    const containerTop = scrollTarget === window ? 0 : (scrollTarget as HTMLElement).getBoundingClientRect().top
    shouldFix = rect.top <= containerTop + props.offsetTop
    fixedStyle = {
      position: 'fixed',
      top: `${containerTop + props.offsetTop}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 10,
    }
  }

  if (shouldFix) {
    // 先量内容高度撑住占位，再让内容脱离文档流；占位符 rect 继续追踪文档流位置
    if (!fixed.value) placeholderStyle.value = { height: `${contentRef.value.offsetHeight}px` }
    // 每次滚动都重算 top/left/width：容器自身被外层页面滚动时吸附位置才能跟住。
    // 取舍：内容 fixed 后若整体滚出容器可见区不做裁剪，保持实现简单（业务上固钉区通常在容器顶部）。
    contentStyle.value = fixedStyle
  } else {
    placeholderStyle.value = {}
    contentStyle.value = {}
  }

  if (fixed.value !== shouldFix) {
    fixed.value = shouldFix
    emit('change', shouldFix)
  }
}

// rAF 节流：滚动事件只置脏标记，下一帧统一执行 update，避免高频强制布局
let rafId = 0
function scheduleUpdate() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    update()
  })
}

function detach() {
  scrollTarget?.removeEventListener('scroll', scheduleUpdate)
  scrollTarget = null
}

/** 解析滚动容器并挂监听；target 选择器找不到元素时退回 window。 */
function attach() {
  detach()
  scrollTarget = props.target ? (document.querySelector<HTMLElement>(props.target) || window) : window
  scrollTarget.addEventListener('scroll', scheduleUpdate, { passive: true })
  update()
}

onMounted(async () => {
  // 等一帧再查询，确保同页面渲染出的容器已经挂载
  await nextTick()
  attach()
  window.addEventListener('resize', scheduleUpdate)
  // 捕获阶段监听全局滚动：外层任意滚动容器（如文档站 #doc-main）滚动时同步吸附位置
  window.addEventListener('scroll', scheduleUpdate, true)
})

watch(() => props.target, async () => {
  await nextTick()
  attach()
})

watch(() => [props.offsetTop, props.offsetBottom], update)

onBeforeUnmount(() => {
  detach()
  window.removeEventListener('resize', scheduleUpdate)
  window.removeEventListener('scroll', scheduleUpdate, true)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div ref="placeholderRef" :style="placeholderStyle">
    <div ref="contentRef" :style="contentStyle">
      <slot :fixed="fixed" />
    </div>
  </div>
</template>
