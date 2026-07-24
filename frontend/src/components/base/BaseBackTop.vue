<script setup lang="ts">
/**
 * BaseBackTop.vue
 * 悬浮回到顶部按钮：监听滚动容器（或窗口），超过阈值后淡入显示。
 */
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  // 滚动容器的 CSS 选择器，为空时监听 window 滚动
  target: { type: String, default: '' },
  // 滚动距离超过该值（px）才显示按钮
  visibilityHeight: { type: Number, default: 200 },
  // 距视口右侧 / 底部的偏移（px）
  right: { type: Number, default: 24 },
  bottom: { type: Number, default: 24 },
})

const emit = defineEmits(['click'])

const visible = ref(false)
// 当前监听的滚动目标：HTMLElement 或 window
let scrollTarget = null

function getScrollTop() {
  if (!scrollTarget) return 0
  return scrollTarget === window ? window.scrollY : scrollTarget.scrollTop
}

function onScroll() {
  visible.value = getScrollTop() > props.visibilityHeight
}

function detach() {
  scrollTarget?.removeEventListener('scroll', onScroll)
  scrollTarget = null
}

/** 解析滚动容器并挂监听；target 选择器找不到元素时退回 window。 */
function attach() {
  detach()
  scrollTarget = props.target ? document.querySelector(props.target) || window : window
  scrollTarget.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

function scrollToTop() {
  scrollTarget?.scrollTo({ top: 0, behavior: 'smooth' })
  emit('click')
}

onMounted(async () => {
  // 等一帧再查询，确保同页面渲染出的容器已经挂载
  await nextTick()
  attach()
})

watch(() => props.target, async () => {
  await nextTick()
  attach()
})

onBeforeUnmount(detach)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 translate-y-2"
      leave-to-class="opacity-0 translate-y-2"
    >
      <button
        v-if="visible"
        type="button"
        aria-label="回到顶部"
        class="accent-bg fixed z-[90] flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg hover:brightness-110"
        :style="{ right: `${props.right}px`, bottom: `${props.bottom}px` }"
        @click="scrollToTop"
      >
        <i class="fa-solid fa-arrow-up text-sm"></i>
      </button>
    </Transition>
  </Teleport>
</template>
