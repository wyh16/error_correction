<script setup lang="ts">
/**
 * BaseTour.vue
 * 新手引导：遮罩挖孔高亮目标元素，配合步骤卡片逐步讲解，支持上一步/下一步与完成。
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  // 步骤：{ target: CSS 选择器, title, description, placement? }，placement 默认 bottom
  steps: { type: Array, default: () => [] },
  // 点击遮罩是否关闭
  maskClosable: { type: Boolean, default: true },
})

const emit = defineEmits(['update:open', 'change', 'finish'])

// 挖孔相对目标元素的外扩距离与卡片距目标的间距（px）
const HOLE_PADDING = 6
const CARD_GAP = 12

const index = ref(0)
const rect = ref(null)
const cardRef = ref(null)
// 初始放到视口外，避免首次定位前在原点闪现；步骤间不重置以获得平滑移动
const cardStyle = ref({ top: '-9999px', left: '-9999px' })
// 首次定位不做位移动画（否则卡片会从视口外飞入），之后的切步才平滑移动
const cardPlaced = ref(false)

const total = computed(() => props.steps.length)
const step = computed(() => props.steps[index.value] || null)
const isLast = computed(() => index.value >= total.value - 1)

const holeStyle = computed(() => {
  if (!rect.value) return {}
  return {
    top: `${rect.value.top - HOLE_PADDING}px`,
    left: `${rect.value.left - HOLE_PADDING}px`,
    width: `${rect.value.width + HOLE_PADDING * 2}px`,
    height: `${rect.value.height + HOLE_PADDING * 2}px`,
  }
})

function close() {
  emit('update:open', false)
}

/** 从 from 开始沿 dir 方向找第一个能命中目标元素的步骤。 */
function findStep(from, dir) {
  let i = from
  while (i >= 0 && i < total.value) {
    // querySelector 不接受空字符串，target 缺失的步骤直接视为未命中
    const selector = props.steps[i]?.target
    const el = selector ? document.querySelector(selector) : null
    if (el) return { i, el }
    i += dir
  }
  return null
}

/** 定位某一步：目标缺失时沿方向跳过，全部缺失则直接关闭。 */
async function locate(from, dir = 1) {
  await nextTick()
  const found = findStep(from, dir)
  if (!found) {
    close()
    return false
  }
  index.value = found.i
  // 立即滚动（非 smooth）：滚动完成后马上量测才能拿到稳定位置
  found.el.scrollIntoView({ block: 'center' })
  await nextTick()
  requestAnimationFrame(() => {
    rect.value = found.el.getBoundingClientRect()
    placeCard()
  })
  return true
}

/** 卡片按 placement 放在挖孔旁，并 clamp 在视口内（四周至少留 12px）。 */
async function placeCard() {
  await nextTick()
  const card = cardRef.value
  const r = rect.value
  if (!card || !r) return
  const placement = step.value?.placement || 'bottom'
  const cw = card.offsetWidth
  const ch = card.offsetHeight
  let top
  let left
  if (placement === 'top') {
    top = r.top - CARD_GAP - ch
    left = r.left + r.width / 2 - cw / 2
  } else if (placement === 'left') {
    top = r.top + r.height / 2 - ch / 2
    left = r.left - CARD_GAP - cw
  } else if (placement === 'right') {
    top = r.top + r.height / 2 - ch / 2
    left = r.right + CARD_GAP
  } else {
    top = r.bottom + CARD_GAP
    left = r.left + r.width / 2 - cw / 2
  }
  left = Math.min(Math.max(left, 12), Math.max(window.innerWidth - cw - 12, 12))
  top = Math.min(Math.max(top, 12), Math.max(window.innerHeight - ch - 12, 12))
  cardStyle.value = { top: `${top}px`, left: `${left}px` }
  if (!cardPlaced.value) {
    // 等首次样式生效后再启用过渡
    requestAnimationFrame(() => {
      cardPlaced.value = true
    })
  }
}

async function next() {
  if (isLast.value) {
    emit('finish')
    close()
    return
  }
  if (await locate(index.value + 1, 1)) emit('change', index.value)
}

async function prev() {
  if (index.value <= 0) return
  if (await locate(index.value - 1, -1)) emit('change', index.value)
}

function onMaskClick() {
  if (props.maskClosable) close()
}

/** 视口滚动 / 缩放时重量当前目标，保持挖孔与卡片对齐（不重复 scrollIntoView）。 */
function remeasure() {
  if (!props.open || !step.value?.target) return
  const el = document.querySelector(step.value.target)
  if (!el) return
  rect.value = el.getBoundingClientRect()
  placeCard()
}

function onKeydown(event) {
  if (event.key === 'Escape') close()
}

function addListeners() {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', remeasure)
  // 捕获阶段监听全局滚动：任意滚动容器滚动都会让目标视口位置变化
  window.addEventListener('scroll', remeasure, true)
}

function removeListeners() {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', remeasure)
  window.removeEventListener('scroll', remeasure, true)
}

watch(() => props.open, value => {
  if (value) {
    // 每次打开都从第一步重新开始
    index.value = 0
    rect.value = null
    cardStyle.value = { top: '-9999px', left: '-9999px' }
    cardPlaced.value = false
    addListeners()
    locate(0, 1)
  } else {
    removeListeners()
    rect.value = null
  }
}, { immediate: true })

onBeforeUnmount(removeListeners)
</script>

<template>
  <Teleport to="body">
    <div v-if="props.open" class="fixed inset-0 z-[9999]">
      <!-- 透明点击层：maskClosable 时点击关闭；同时阻断引导期间对页面的误操作 -->
      <div class="absolute inset-0" @click="onMaskClick"></div>

      <!-- 挖孔：巨大 box-shadow 形成四周暗化，transition 让切步时孔平滑移动 -->
      <div
        v-if="rect"
        class="pointer-events-none fixed rounded-lg shadow-[0_0_0_100vmax_rgba(15,17,21,0.55)] ring-2 ring-[rgb(var(--accent-rgb)/0.8)] transition-all duration-300"
        :style="holeStyle"
      ></div>

      <!-- 步骤卡片 -->
      <div
        v-if="rect && step"
        ref="cardRef"
        class="fixed w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-white/[0.08] dark:bg-[#1f1f22]"
        :class="cardPlaced ? 'transition-all duration-300' : ''"
        :style="cardStyle"
      >
        <h4 class="text-sm font-bold text-slate-900 dark:text-[#f7f8f8]">{{ step.title }}</h4>
        <p class="mt-1 text-[13px] leading-5 text-slate-500 dark:text-[#8a8f98]">{{ step.description }}</p>
        <div class="mt-3 flex items-center justify-between">
          <span class="text-xs text-slate-400 dark:text-[#62666d]">{{ index + 1 }} / {{ total }}</span>
          <div class="flex items-center gap-2">
            <button
              v-if="index > 0"
              type="button"
              class="flex h-7 items-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/[0.08] dark:text-[#d0d6e0] dark:hover:bg-white/[0.06]"
              @click="prev"
            >
              上一步
            </button>
            <button
              type="button"
              class="accent-bg flex h-7 items-center rounded-lg px-3 text-xs font-semibold text-white transition-all hover:brightness-110"
              @click="next"
            >
              {{ isLast ? '完成' : '下一步' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
