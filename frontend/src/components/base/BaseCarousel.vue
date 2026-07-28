<script setup lang="ts">
/**
 * BaseCarousel.vue
 * 轮播图组件，支持图片/文字幻灯片、自动播放、循环、指示器与箭头模式。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  // 幻灯片数据 { image?, title?, description? }：有 image 渲染图片，否则渲染文字卡片
  items: { type: Array, default: () => [] },
  autoplay: { type: Boolean, default: false },
  interval: { type: Number, default: 4000 },
  // 指示器样式：dots 圆点 | line 线条 | none 不显示
  indicator: { type: String, default: 'dots' },
  // 箭头显示时机：hover 悬停出现 | always 常驻 | never 不显示
  arrow: { type: String, default: 'hover' },
  loop: { type: Boolean, default: true },
  // 容器高度交给调用方控制，方便适配横幅 / 卡片等不同场景
  heightClass: { type: String, default: 'h-56' },
})

const emit = defineEmits(['change'])

const current = ref(0)
const count = computed(() => props.items.length)

// 不循环时端点方向不可再翻页，对应箭头进入禁用态
const canPrev = computed(() => props.loop || current.value > 0)
const canNext = computed(() => props.loop || current.value < count.value - 1)

function goTo(index) {
  current.value = index
}

function prev() {
  if (!canPrev.value) return
  current.value = current.value > 0 ? current.value - 1 : count.value - 1
}

function next() {
  if (!canNext.value) return
  current.value = current.value < count.value - 1 ? current.value + 1 : 0
}

watch(current, value => emit('change', value))

// items 异步加载或删项后索引可能越界，归位到最后一张避免轨道滑出空白区
watch(count, value => {
  if (current.value >= value) current.value = Math.max(0, value - 1)
})

let timer = null
const hovering = ref(false)

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function startTimer() {
  stopTimer()
  if (!props.autoplay || hovering.value || count.value <= 1) return
  timer = setInterval(() => {
    // 不循环时滚到最后一张就停住，避免定时器空转
    if (!props.loop && current.value >= count.value - 1) {
      stopTimer()
      return
    }
    next()
  }, props.interval)
}

// 鼠标悬停暂停自动播放，避免用户正在看的内容被翻走；移出后恢复
function handleEnter() {
  hovering.value = true
  stopTimer()
}

function handleLeave() {
  hovering.value = false
  startTimer()
}

watch(() => [props.autoplay, props.interval], startTimer)

onMounted(startTimer)
onBeforeUnmount(stopTimer)

// hover 模式下箭头随容器悬停淡入；禁用箭头保留低透明度提示「到头了」
function arrowClass(enabled) {
  if (props.arrow === 'hover') {
    return enabled
      ? 'opacity-0 group-hover:opacity-100'
      : 'cursor-not-allowed opacity-0 group-hover:opacity-30'
  }
  return enabled ? '' : 'cursor-not-allowed opacity-30'
}
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-xl bg-slate-100 dark:bg-white/[0.04]"
    :class="heightClass"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <!-- 轨道：全部幻灯片横向排列，整体 translateX 切换 -->
    <div
      class="flex h-full transition-transform duration-500 ease-out"
      :style="{ transform: `translateX(-${current * 100}%)` }"
    >
      <div v-for="(item, index) in items" :key="index" class="relative h-full w-full shrink-0">
        <template v-if="item.image">
          <img
            :src="item.image"
            :alt="item.title || '轮播图 ' + (index + 1)"
            class="h-full w-full object-cover"
            draggable="false"
          />
          <!-- 底部渐变遮罩保证白色文字在任意图片上都可读 -->
          <div
            v-if="item.title || item.description"
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-10"
          >
            <p v-if="item.title" class="text-sm font-bold text-white">{{ item.title }}</p>
            <p v-if="item.description" class="mt-0.5 text-xs text-white/80">{{ item.description }}</p>
          </div>
        </template>
        <div v-else class="accent-soft flex h-full w-full flex-col items-center justify-center gap-1.5 px-8 text-center">
          <p v-if="item.title" class="text-base font-bold">{{ item.title }}</p>
          <p v-if="item.description" class="text-sm opacity-75">{{ item.description }}</p>
        </div>
      </div>
    </div>

    <!-- 空状态盖在轨道上方：轨道本身始终占满高度，跟在后面会被挤出容器 -->
    <div v-if="!count" class="absolute inset-0 flex items-center justify-center text-sm text-slate-400 dark:text-[#62666d]">
      暂无内容
    </div>

    <template v-if="arrow !== 'never' && count > 1">
      <button
        type="button"
        class="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur transition-opacity duration-200 hover:bg-black/40"
        :class="arrowClass(canPrev)"
        :disabled="!canPrev"
        aria-label="上一张"
        @click="prev"
      >
        <i class="fa-solid fa-chevron-left text-xs"></i>
      </button>
      <button
        type="button"
        class="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur transition-opacity duration-200 hover:bg-black/40"
        :class="arrowClass(canNext)"
        :disabled="!canNext"
        aria-label="下一张"
        @click="next"
      >
        <i class="fa-solid fa-chevron-right text-xs"></i>
      </button>
    </template>

    <div
      v-if="indicator !== 'none' && count > 1"
      class="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5"
    >
      <template v-if="indicator === 'line'">
        <button
          v-for="(_, index) in items"
          :key="index"
          type="button"
          class="h-1 w-6 rounded-full transition-colors duration-200"
          :class="index === current ? 'bg-white' : 'bg-white/40 hover:bg-white/60'"
          :aria-label="'跳转到第 ' + (index + 1) + ' 张'"
          @click="goTo(index)"
        ></button>
      </template>
      <template v-else>
        <button
          v-for="(_, index) in items"
          :key="index"
          type="button"
          class="h-1.5 rounded-full transition-all duration-200"
          :class="index === current ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'"
          :aria-label="'跳转到第 ' + (index + 1) + ' 张'"
          @click="goTo(index)"
        ></button>
      </template>
    </div>
  </div>
</template>
