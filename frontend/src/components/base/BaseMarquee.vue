<script setup lang="ts">
/**
 * BaseMarquee.vue
 * 跑马灯公告：文本无缝横向滚动，支持速度、方向、悬停暂停与固定图标。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props {
  // 单条文本或多条消息数组
  text?: string | string[]
  // 滚动速度（px/s）：按内容宽度换算动画周期，内容长短不同速度保持一致
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  // 左侧固定图标（不参与滚动），传 fa-* 类名
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  speed: 50,
  direction: 'left',
  pauseOnHover: true,
  icon: '',
})

const items = computed(() => {
  const list = Array.isArray(props.text) ? props.text : [props.text]
  return list.map(item => String(item)).filter(Boolean)
})

const wrapRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
// 测量前的兜底周期，挂载后立即被真实值覆盖
const duration = ref(20)
// 内容比容器短时，把每份拷贝撑到容器宽，避免循环中出现大段空白
const copyMinWidth = ref(0)

function measure() {
  if (wrapRef.value) copyMinWidth.value = wrapRef.value.clientWidth
  if (!trackRef.value) return
  // 内容渲染两遍，动画一个周期只需要平移半个轨道宽
  const half = trackRef.value.scrollWidth / 2
  duration.value = half / Math.max(1, props.speed)
}

let observer: ResizeObserver | null = null

onMounted(() => {
  measure()
  // 字体加载、内容与容器尺寸变化都会改变轨道宽度，监听后重算周期
  observer = new ResizeObserver(measure)
  // 初始渲染的 ref 变化早于 observer 创建，这里补上首次 observe
  if (wrapRef.value) observer.observe(wrapRef.value)
  if (trackRef.value) observer.observe(trackRef.value)
})

// wrap/track 受 v-if 控制（text 为空时不渲染），元素出现/消失时同步 observe/unobserve，
// 避免初始为空时 ResizeObserver 从未观察到元素、后续失去 resize 跟踪
watch([wrapRef, trackRef], ([wrap, track], [oldWrap, oldTrack]) => {
  if (!observer) return
  if (oldWrap) observer.unobserve(oldWrap)
  if (oldTrack) observer.unobserve(oldTrack)
  if (wrap) observer.observe(wrap)
  if (track) observer.observe(track)
  if (wrap || track) measure()
}, { flush: 'post' })

onBeforeUnmount(() => {
  observer?.disconnect()
})

watch(
  () => [props.text, props.speed],
  async () => {
    await nextTick()
    measure()
  },
  { deep: true },
)

const trackStyle = computed(() => ({
  animationDuration: `${duration.value}s`,
  animationDirection: props.direction === 'right' ? 'reverse' : 'normal',
}))

// 两侧渐隐遮罩，文字滚入滚出更柔和
const maskStyle = {
  maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
  WebkitMaskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
}
</script>

<template>
  <div class="flex items-center gap-2.5">
    <i v-if="icon" class="fa-solid accent-text shrink-0 text-sm" :class="icon"></i>
    <div
      v-if="items.length"
      ref="wrapRef"
      class="relative flex-1 overflow-hidden"
      :class="pauseOnHover ? 'marquee-pausable' : ''"
      :style="maskStyle"
    >
      <!-- 内容渲染两遍拼成无缝循环，第二遍对读屏隐藏避免重复朗读 -->
      <div ref="trackRef" class="marquee-track flex w-max items-center whitespace-nowrap" :style="trackStyle">
        <div
          v-for="copy in 2"
          :key="copy"
          class="flex items-center"
          :style="{ minWidth: copyMinWidth + 'px' }"
          :aria-hidden="copy === 2 ? 'true' : undefined"
        >
          <template v-for="(item, index) in items" :key="index">
            <!-- 单条文本没有分隔点，用右内边距充当两份内容之间的循环间隙 -->
            <span class="text-sm text-slate-600 dark:text-[#a8adb7]" :class="items.length === 1 ? 'pr-16' : ''">{{ item }}</span>
            <span v-if="items.length > 1" class="mx-8 text-slate-300 dark:text-[#3f4147]" aria-hidden="true">•</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-track {
  animation: base-marquee linear infinite;
}

/* 平移半个轨道宽（正好一份内容），回到起点时画面完全重合，实现无缝循环 */
@keyframes base-marquee {
  to {
    transform: translateX(-50%);
  }
}

.marquee-pausable:hover .marquee-track {
  animation-play-state: paused;
}
</style>
