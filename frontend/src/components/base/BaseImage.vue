<script setup lang="ts">
/**
 * BaseImage.vue
 * 增强图片：加载骨架、失败兜底、懒加载与点击放大预览。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ImageModal from './ImageModal.vue'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  // cover | contain | fill | none | scale-down
  fit: { type: String, default: 'cover' },
  // 数字或纯数字字符串按 px 写进 inline style，其余字符串当 Tailwind 类拼进 class
  width: { type: [String, Number], default: '' },
  height: { type: [String, Number], default: '' },
  // 首次进入视口才加载真实图片
  lazy: { type: Boolean, default: false },
  // 悬停显示放大镜遮罩，点击打开全屏预览
  previewable: { type: Boolean, default: false },
})

const emit = defineEmits(['load', 'error'])

const fitClass = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
}

function isPixelValue(value) {
  return typeof value === 'number' || /^\d+(\.\d+)?$/.test(String(value))
}

const containerStyle = computed(() => {
  const style = {}
  if (props.width !== '' && isPixelValue(props.width)) style.width = `${props.width}px`
  if (props.height !== '' && isPixelValue(props.height)) style.height = `${props.height}px`
  return style
})

const containerClass = computed(() => {
  const classes = []
  if (props.width !== '' && !isPixelValue(props.width)) classes.push(String(props.width))
  if (props.height !== '' && !isPixelValue(props.height)) classes.push(String(props.height))
  return classes
})

// loading -> loaded / error 三态；src 变化时重置重新走一遍流程
const status = ref('loading')
watch(() => props.src, () => {
  status.value = 'loading'
})

// 懒加载：进入视口前不给 img 绑真实 src，保持骨架
const revealed = ref(!props.lazy)
const containerRef = ref(null)
let observer = null

const shownSrc = computed(() => (revealed.value ? props.src : ''))

onMounted(() => {
  if (!props.lazy || revealed.value) return
  observer = new IntersectionObserver(
    entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        revealed.value = true
        if (observer) observer.disconnect()
        observer = null
      }
    },
    // 提前 100px 触发，滚动到附近就开始加载，减少可见等待
    { rootMargin: '100px' },
  )
  observer.observe(containerRef.value)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

function onLoad(event) {
  status.value = 'loaded'
  emit('load', event)
}

function onError(event) {
  status.value = 'error'
  emit('error', event)
}

// 预览弹窗内部管理 open 与缩放；关闭时重置 scale，下次打开回到原始大小
const previewOpen = ref(false)
const previewScale = ref(1)

function openPreview() {
  previewOpen.value = true
}

function closePreview() {
  previewOpen.value = false
  previewScale.value = 1
}
</script>

<template>
  <div
    ref="containerRef"
    class="relative inline-block overflow-hidden rounded-lg bg-slate-100 align-top dark:bg-white/[0.04]"
    :class="containerClass"
    :style="containerStyle"
  >
    <img
      v-if="shownSrc && status !== 'error'"
      :src="shownSrc"
      :alt="alt"
      class="block h-full w-full transition-opacity duration-300"
      :class="[fitClass[fit] || fitClass.cover, status === 'loaded' ? 'opacity-100' : 'opacity-0']"
      @load="onLoad"
      @error="onError"
    />

    <!-- 失败兜底：默认图标 + 文案，可用 fallback 插槽自定义 -->
    <div
      v-if="status === 'error'"
      class="flex h-full w-full flex-col items-center justify-center gap-1.5 px-4 py-6 text-slate-400 dark:text-[#62666d]"
    >
      <slot name="fallback">
        <i class="fa-solid fa-image text-lg"></i>
        <span class="text-xs">加载失败</span>
      </slot>
    </div>

    <!-- 加载骨架：盖在 img 上方，@load 后移除 -->
    <div v-if="status === 'loading'" class="absolute inset-0 animate-pulse bg-slate-200/70 dark:bg-white/[0.06]"></div>

    <button
      v-if="previewable && status === 'loaded'"
      type="button"
      class="absolute inset-0 flex cursor-zoom-in items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 hover:opacity-100"
      aria-label="预览图片"
      @click="openPreview"
    >
      <i class="fa-solid fa-magnifying-glass-plus text-lg text-white"></i>
    </button>

    <ImageModal
      :open="previewOpen"
      :src="src"
      :scale="previewScale"
      @update:scale="previewScale = $event"
      @close="closePreview"
    />
  </div>
</template>
