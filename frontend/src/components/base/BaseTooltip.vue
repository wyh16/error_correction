<script setup lang="ts">
/**
 * 通用 Tooltip 组件。
 *
 * 使用 Teleport 固定到 body，避免被父级 overflow 裁剪，并在移动端禁用 hover 残留。
 * 定位支持翻转：目标侧空间不足时自动翻到对侧，翻转后仍双向 clamp 进视口。
 */
import { computed, inject, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Z_TOOLTIP } from '@/composables/useOverlay'

type Placement = 'top' | 'bottom' | 'left' | 'right'
type Align = 'left' | 'center' | 'right'
type Trigger = 'hover' | 'click' | 'manual'

interface Props {
  text: string
  placement?: Placement
  align?: Align
  offset?: number
  disabled?: boolean
  /** 悬停多少毫秒后再显示；默认 null 表示跟随 Provider 配置（无 Provider 时立即显示） */
  delay?: number | null
  /** 触发方式：hover 悬停 / click 点击切换 / manual 完全由 visible prop 控制 */
  trigger?: Trigger
  /** 隐藏前的延迟毫秒数（hover 触发时离开后延迟隐藏） */
  hideDelay?: number
  /** manual 模式下的受控显示状态（支持 v-model:visible） */
  visible?: boolean
}

interface TooltipProviderContext {
  delay?: number
  offset?: number
  zIndex?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom',
  align: 'center',
  offset: 8,
  disabled: false,
  delay: null,
  trigger: 'hover',
  hideDelay: 0,
  visible: false,
})

const emit = defineEmits<{ 'update:visible': [visible: boolean] }>()

const provider = inject<TooltipProviderContext | null>('baseTooltipProvider', null)

const innerVisible = ref(false)
const isVisible = computed(() => (props.trigger === 'manual' ? props.visible : innerVisible.value))
const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const position = ref({ left: 0, top: 0 })
// 实际使用的 placement（空间不足时翻转到对侧）
const actualPlacement = ref<Placement>(props.placement)

const tooltipStyle = computed(() => ({
  left: `${position.value.left}px`,
  top: `${position.value.top}px`,
  zIndex: provider?.zIndex ?? Z_TOOLTIP,
}))

const OPPOSITE: Record<Placement, Placement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

/** 判断某一侧是否放得下 Tooltip（含 offset 与视口留白）。 */
function fits(placement: Placement, triggerRect: DOMRect, tooltipRect: DOMRect, offset: number, padding: number) {
  if (placement === 'top') return triggerRect.top - offset - tooltipRect.height >= padding
  if (placement === 'bottom') return triggerRect.bottom + offset + tooltipRect.height <= window.innerHeight - padding
  if (placement === 'left') return triggerRect.left - offset - tooltipRect.width >= padding
  return triggerRect.right + offset + tooltipRect.width <= window.innerWidth - padding
}

/** 根据触发元素和浮层尺寸计算 Tooltip 位置：目标侧放不下则翻转，翻转后仍双向 clamp 进视口。 */
const updatePosition = async () => {
  await nextTick()
  if (!triggerRef.value || !tooltipRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()
  const tooltipOffset = provider?.offset ?? props.offset
  const viewportPadding = 8

  // 翻转：目标侧空间不足且对侧放得下时翻到对侧
  let placement = props.placement
  if (
    !fits(placement, triggerRect, tooltipRect, tooltipOffset, viewportPadding)
    && fits(OPPOSITE[placement], triggerRect, tooltipRect, tooltipOffset, viewportPadding)
  ) {
    placement = OPPOSITE[placement]
  }
  actualPlacement.value = placement

  let left: number
  let top: number

  if (placement === 'top' || placement === 'bottom') {
    top = placement === 'top'
      ? triggerRect.top - tooltipOffset
      : triggerRect.bottom + tooltipOffset
    // 垂直 clamp：锚点随 placement 变换（top 时 top 是浮层底边），限制浮层整体在视口内
    top = placement === 'top'
      ? Math.min(Math.max(top, viewportPadding + tooltipRect.height), window.innerHeight - viewportPadding)
      : Math.min(Math.max(top, viewportPadding), window.innerHeight - viewportPadding - tooltipRect.height)

    if (props.align === 'center') {
      left = triggerRect.left + triggerRect.width / 2
      const halfWidth = tooltipRect.width / 2
      left = Math.min(
        Math.max(left, viewportPadding + halfWidth),
        window.innerWidth - viewportPadding - halfWidth,
      )
    } else if (props.align === 'right') {
      left = triggerRect.right
      left = Math.min(
        Math.max(left, viewportPadding + tooltipRect.width),
        window.innerWidth - viewportPadding,
      )
    } else {
      left = triggerRect.left
      left = Math.min(
        Math.max(left, viewportPadding),
        window.innerWidth - viewportPadding - tooltipRect.width,
      )
    }
  } else {
    // 左右布局时以触发元素垂直中心为基准，再限制到视口内。
    top = triggerRect.top + triggerRect.height / 2
    left = placement === 'left'
      ? triggerRect.left - tooltipOffset
      : triggerRect.right + tooltipOffset

    // 水平 clamp：left 时 left 是浮层右边，right 时是浮层左边
    left = placement === 'left'
      ? Math.min(Math.max(left, viewportPadding + tooltipRect.width), window.innerWidth - viewportPadding)
      : Math.min(Math.max(left, viewportPadding), window.innerWidth - viewportPadding - tooltipRect.width)

    // 防止 Tooltip 超出上下视口边界。
    const halfHeight = tooltipRect.height / 2
    top = Math.min(
      Math.max(top, viewportPadding + halfHeight),
      window.innerHeight - viewportPadding - halfHeight,
    )
  }

  position.value = { left, top }
}

const isTouch = ref(false)

// 组件级 delay 优先于 Provider 的全局 delay。
const effectiveDelay = computed(() => props.delay ?? provider?.delay ?? 0)
let showTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined

const reveal = async () => {
  innerVisible.value = true
  await updatePosition()
}

/** 显示 Tooltip：按 delay 延迟触发，并在 DOM 更新后重新计算位置。 */
const show = () => {
  if (props.disabled || isTouch.value) return
  if (provider?.disabled) return
  // 如果设备不支持 hover（如移动端），则不显示 tooltip，防止点击后残留
  if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) return
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  if (effectiveDelay.value > 0) {
    showTimer = setTimeout(reveal, effectiveDelay.value)
  } else {
    reveal()
  }
}

/** 隐藏 Tooltip：按 hideDelay 延迟触发，并取消尚未触发的延迟显示。 */
const hide = () => {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  if (props.hideDelay > 0) {
    hideTimer = setTimeout(() => {
      innerVisible.value = false
    }, props.hideDelay)
  } else {
    innerVisible.value = false
  }
}

const onMouseEnter = () => {
  if (props.trigger === 'hover') show()
}

const onMouseLeave = () => {
  if (props.trigger === 'hover') hide()
}

const onFocusIn = () => {
  if (props.trigger === 'hover') show()
}

const onFocusOut = () => {
  if (props.trigger === 'hover') hide()
}

const onClick = () => {
  if (props.trigger !== 'click') return
  if (innerVisible.value) {
    clearTimeout(showTimer)
    clearTimeout(hideTimer)
    innerVisible.value = false
  } else {
    clearTimeout(hideTimer)
    reveal()
  }
}

/** 记录触屏交互，避免移动端点击后出现无法自然关闭的 hover 浮层。 */
const handleTouchStart = () => {
  isTouch.value = true
}

/** 视口尺寸或滚动变化时，保持已显示 Tooltip 跟随触发元素。 */
const onViewportChange = () => {
  if (isVisible.value) updatePosition()
}

// 视口监听仅在 Tooltip 可见时挂载，避免大量实例常驻 window 监听
let viewportListenersActive = false

function addViewportListeners() {
  if (viewportListenersActive || typeof window === 'undefined') return
  viewportListenersActive = true
  window.addEventListener('resize', onViewportChange)
  window.addEventListener('scroll', onViewportChange, true)
}

function removeViewportListeners() {
  if (!viewportListenersActive || typeof window === 'undefined') return
  viewportListenersActive = false
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
}

watch(isVisible, (visible) => {
  if (visible) addViewportListeners()
  else removeViewportListeners()
}, { immediate: true })

// manual 模式下受控显示需要重算定位；同时向外同步内部状态供 v-model:visible 使用
watch(() => props.visible, (visible) => {
  if (props.trigger === 'manual' && visible) updatePosition()
})

watch(innerVisible, (visible) => {
  if (props.trigger !== 'manual') emit('update:visible', visible)
})

if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
}

onBeforeUnmount(() => {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  removeViewportListeners()
  if (typeof window !== 'undefined') {
    window.removeEventListener('touchstart', handleTouchStart)
  }
})
</script>

<template>
  <span
    ref="triggerRef"
    class="inline-flex"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @click="onClick"
  >
    <slot></slot>
  </span>

  <Teleport to="body">
    <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="isVisible" ref="tooltipRef" class="pointer-events-none fixed" :style="tooltipStyle">
        <div
          class="relative rounded-md border border-white/[0.08] bg-[#191a1b] px-3 py-1.5 text-xs text-[#d0d6e0] shadow-lg"
          :class="[
            (actualPlacement === 'top' || actualPlacement === 'bottom') && align === 'center' ? '-translate-x-1/2' : '',
            (actualPlacement === 'top' || actualPlacement === 'bottom') && align === 'right' ? '-translate-x-full' : '',
            actualPlacement === 'top' ? '-translate-y-full' : '',
            actualPlacement === 'left' ? '-translate-x-full -translate-y-1/2' : '',
            actualPlacement === 'right' ? '-translate-y-1/2' : '',
          ]">
          <slot name="content">{{ text }}</slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
