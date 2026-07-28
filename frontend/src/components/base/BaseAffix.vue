<script setup lang="ts">
/**
 * BaseAffix.vue
 * 固钉：内容滚动到距容器（或视口）顶部 offsetTop 以内时切换为 fixed 吸附。
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  // 吸附时距容器（或视口）顶部的偏移（px）
  offsetTop: { type: Number, default: 0 },
  // 滚动容器选择器，为空时监听 window
  target: { type: String, default: '' },
})

const emit = defineEmits(['change'])

const placeholderRef = ref(null)
const contentRef = ref(null)
const fixed = ref(false)
// fixed 时占位符撑住原高度防止布局跳动；left/width 取占位符实测值防止宽度塌陷
const placeholderStyle = ref({})
const contentStyle = ref({})

// 当前监听的滚动目标：HTMLElement 或 window
let scrollTarget = null

function update() {
  if (!placeholderRef.value || !contentRef.value) return
  const rect = placeholderRef.value.getBoundingClientRect()
  // window 模式容器顶就是视口顶（0）；容器模式取容器当前视口位置
  const containerTop = scrollTarget === window ? 0 : scrollTarget.getBoundingClientRect().top
  const shouldFix = rect.top <= containerTop + props.offsetTop

  if (shouldFix) {
    // 先量内容高度撑住占位，再让内容脱离文档流；占位符 rect 继续追踪文档流位置
    if (!fixed.value) placeholderStyle.value = { height: `${contentRef.value.offsetHeight}px` }
    // 每次滚动都重算 top/left/width：容器自身被外层页面滚动时吸附位置才能跟住。
    // 取舍：内容 fixed 后若整体滚出容器可见区不做裁剪，保持实现简单（业务上固钉区通常在容器顶部）。
    contentStyle.value = {
      position: 'fixed',
      top: `${containerTop + props.offsetTop}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 10,
    }
  } else {
    placeholderStyle.value = {}
    contentStyle.value = {}
  }

  if (fixed.value !== shouldFix) {
    fixed.value = shouldFix
    emit('change', shouldFix)
  }
}

function detach() {
  scrollTarget?.removeEventListener('scroll', update)
  scrollTarget = null
}

/** 解析滚动容器并挂监听；target 选择器找不到元素时退回 window。 */
function attach() {
  detach()
  scrollTarget = props.target ? document.querySelector(props.target) || window : window
  scrollTarget.addEventListener('scroll', update, { passive: true })
  update()
}

onMounted(async () => {
  // 等一帧再查询，确保同页面渲染出的容器已经挂载
  await nextTick()
  attach()
  window.addEventListener('resize', update)
  // 捕获阶段监听全局滚动：外层任意滚动容器（如文档站 #doc-main）滚动时同步吸附位置
  window.addEventListener('scroll', update, true)
})

watch(() => props.target, async () => {
  await nextTick()
  attach()
})

watch(() => props.offsetTop, update)

onBeforeUnmount(() => {
  detach()
  window.removeEventListener('resize', update)
  window.removeEventListener('scroll', update, true)
})
</script>

<template>
  <div ref="placeholderRef" :style="placeholderStyle">
    <div ref="contentRef" :style="contentStyle">
      <slot :fixed="fixed" />
    </div>
  </div>
</template>
