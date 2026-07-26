import { computed, nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue'

/**
 * 全局浮层层级约定：
 * - 动态弹窗层（Modal / Drawer / CommandPalette / ImageModal）从 Z_OVERLAY_BASE 起，
 *   每次打开 +10，后开的永远在先开的之上；
 * - 全局提示层（Tour / Toast / Tooltip / LoadingBar）使用固定常量，永远高于动态弹窗层。
 *   动态 seed 每次 +10，正常使用不会追上提示层常量（需要连开约 90 层弹窗），可接受。
 */
export const Z_OVERLAY_BASE = 1000
export const Z_TOUR = 1900
export const Z_PAGE_LOADING = 1950
export const Z_TOAST = 2000
export const Z_TOOLTIP = 2100
export const Z_LOADING_BAR = 2200

let lockCount = 0
let zIndexSeed = Z_OVERLAY_BASE

/** 开启中的浮层栈（按打开顺序），ESC / Tab 只由栈顶浮层响应。 */
type OverlayHandle = { closeOnEscape: boolean }
const overlayStack: OverlayHandle[] = []

function stackTop() {
  return overlayStack.length ? overlayStack[overlayStack.length - 1] : null
}

function removeFromStack(handle: OverlayHandle) {
  const index = overlayStack.lastIndexOf(handle)
  if (index >= 0) overlayStack.splice(index, 1)
}

type UseOverlayOptions = {
  onClose?: () => void
  closeOnEscape?: boolean
  lockScroll?: boolean
  trapFocus?: boolean
}

/** 引用计数式滚动锁：只有真正持有锁的实例才允许释放。 */
function acquireBodyLock() {
  if (typeof document === 'undefined') return
  lockCount += 1
  document.body.style.overflow = 'hidden'
}

function releaseBodyLock() {
  if (typeof document === 'undefined') return
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) document.body.style.overflow = ''
}

function getFocusable(container: HTMLElement | null) {
  if (!container) return []
  return Array.from(container.querySelectorAll([
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(','))).filter((el) => !el.hasAttribute('disabled') && el instanceof HTMLElement && el.offsetParent !== null) as HTMLElement[]
}

export function useOverlay(openRef: Ref<boolean>, options: UseOverlayOptions = {}) {
  const {
    onClose,
    closeOnEscape = true,
    lockScroll = true,
    trapFocus = true,
  } = options

  const overlayRef = ref<HTMLElement | null>(null)
  const zIndex = ref(zIndexSeed)
  let previousActiveElement: HTMLElement | null = null
  // 当前实例是否真正持有滚动锁（避免初始关闭挂载 / 重复关闭导致计数错乱）
  let holdsLock = false
  // 栈中代表当前实例的句柄
  const handle: OverlayHandle = { closeOnEscape }

  const overlayStyle = computed(() => ({ zIndex: zIndex.value }))
  const backdropStyle = computed(() => ({ zIndex: zIndex.value - 1 }))

  function handleKeydown(event: KeyboardEvent) {
    if (!openRef.value) return
    // 多浮层同开时只有栈顶实例响应键盘，ESC 一次只关最上层
    if (stackTop() !== handle) return
    if (event.key === 'Escape' && closeOnEscape) {
      // preventDefault 同时避免 Headless UI Dialog 等下层浮层重复响应同一次 ESC
      event.preventDefault()
      onClose?.()
      return
    }
    if (event.key !== 'Tab' || !trapFocus) return

    const focusable = getFocusable(overlayRef.value)
    if (!focusable.length) {
      event.preventDefault()
      overlayRef.value?.focus?.()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  function releaseIfHeld() {
    if (holdsLock) {
      releaseBodyLock()
      holdsLock = false
    }
    removeFromStack(handle)
    if (typeof document !== 'undefined') document.removeEventListener('keydown', handleKeydown)
  }

  watch(openRef, async (open) => {
    if (open) {
      zIndexSeed += 10
      zIndex.value = zIndexSeed
      overlayStack.push(handle)
      previousActiveElement = typeof document !== 'undefined' && document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
      if (lockScroll && !holdsLock) {
        acquireBodyLock()
        holdsLock = true
      }
      if (typeof document !== 'undefined') document.addEventListener('keydown', handleKeydown)
      await nextTick()
      if (trapFocus) {
        const [first] = getFocusable(overlayRef.value)
        ;(first || overlayRef.value)?.focus?.()
      }
      return
    }

    // immediate 首次即为 false（组件以关闭状态挂载）时不持有任何资源，这里全部是安全的 no-op
    releaseIfHeld()
    previousActiveElement?.focus?.()
    previousActiveElement = null
  }, { immediate: true })

  onBeforeUnmount(() => {
    // 打开状态下直接卸载也要归还滚动锁并出栈
    releaseIfHeld()
  })

  return {
    overlayRef,
    overlayStyle,
    backdropStyle,
  }
}
