import { computed, nextTick, ref, watch, type CSSProperties, type Ref } from 'vue'

/**
 * useDropdownPosition.ts
 * 下拉弹层的 Teleport + fixed 定位方案。
 *
 * 弹层 Teleport 到 body 后不再受祖先 overflow 裁剪；本 composable 负责：
 * - 打开时按触发器位置计算 fixed 坐标（默认下方，空间不足且上方放得下时翻转到上方）
 * - 水平方向 clamp 进视口
 * - 打开期间监听 window scroll(捕获)/resize 跟随重算，关闭时移除监听
 * - matchWidth: 'min' 弹层最小宽度对齐触发器（可更宽）；'exact' 严格等宽；false 用弹层自身宽度
 */

/**
 * 下拉层基准 z-index：高于动态弹窗层（Modal/Drawer 从 1000 起每次 +10），
 * 低于 Tour/Toast 等全局提示层（1900+）。每次打开 +1 保证后开的在先开的之上，
 * 超过上限后回绕，避免长会话逼近提示层。
 */
const Z_DROPDOWN_BASE = 1500
const Z_DROPDOWN_MAX = 1800
let dropdownZIndexSeed = Z_DROPDOWN_BASE

interface DropdownPositionOptions {
  /** 弹层与触发器的间距，默认 4px（对应原 mt-1） */
  offset?: number
  /** 弹层宽度与触发器的关系，默认 false（弹层自身宽度） */
  matchWidth?: 'min' | 'exact' | false
  /** 对齐方向：start 左对齐触发器（默认），end 右对齐 */
  align?: 'start' | 'end'
}

export function useDropdownPosition(
  openRef: Ref<boolean>,
  triggerRef: Ref<HTMLElement | null>,
  panelRef: Ref<HTMLElement | null>,
  options: DropdownPositionOptions = {},
) {
  const { offset = 4, matchWidth = false, align = 'start' } = options

  const left = ref(0)
  const top = ref(0)
  const triggerWidth = ref(0)
  const zIndex = ref(dropdownZIndexSeed)

  const panelStyle = computed<CSSProperties>(() => ({
    position: 'fixed',
    left: `${left.value}px`,
    top: `${top.value}px`,
    zIndex: zIndex.value,
    ...(matchWidth === 'min' ? { minWidth: `${triggerWidth.value}px` } : {}),
    ...(matchWidth === 'exact' ? { width: `${triggerWidth.value}px` } : {}),
  }))

  async function updatePosition() {
    await nextTick()
    const trigger = triggerRef.value
    const panel = panelRef.value
    if (!trigger || !panel) return

    const triggerRect = trigger.getBoundingClientRect()
    const panelRect = panel.getBoundingClientRect()
    const padding = 8
    triggerWidth.value = triggerRect.width

    // 垂直：默认下方；下方放不下且上方放得下时翻转到上方
    const fitsBelow = triggerRect.bottom + offset + panelRect.height <= window.innerHeight - padding
    const fitsAbove = triggerRect.top - offset - panelRect.height >= padding
    top.value = !fitsBelow && fitsAbove
      ? triggerRect.top - offset - panelRect.height
      : triggerRect.bottom + offset

    // 水平：按 align 对齐后 clamp 进视口
    let x = align === 'end' ? triggerRect.right - panelRect.width : triggerRect.left
    x = Math.min(Math.max(x, padding), Math.max(padding, window.innerWidth - padding - panelRect.width))
    left.value = x
  }

  function onViewportChange() {
    if (openRef.value) updatePosition()
  }

  let listenersActive = false

  function addListeners() {
    if (listenersActive || typeof window === 'undefined') return
    listenersActive = true
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('scroll', onViewportChange, true)
  }

  function removeListeners() {
    if (!listenersActive || typeof window === 'undefined') return
    listenersActive = false
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
  }

  watch(openRef, (open) => {
    if (open) {
      dropdownZIndexSeed = dropdownZIndexSeed >= Z_DROPDOWN_MAX ? Z_DROPDOWN_BASE : dropdownZIndexSeed + 1
      zIndex.value = dropdownZIndexSeed
      updatePosition()
      addListeners()
    } else {
      removeListeners()
    }
  }, { immediate: true })

  /**
   * Teleport 后弹层脱离触发器 DOM 树，点击外部关闭的判定必须同时排除两者。
   * 组件在 document pointerdown/mousedown 监听里调用。
   */
  function isOutside(target: EventTarget | null) {
    const node = target as Node | null
    if (!node) return true
    if (triggerRef.value?.contains(node)) return false
    if (panelRef.value?.contains(node)) return false
    return true
  }

  return { panelStyle, updatePosition, isOutside }
}
