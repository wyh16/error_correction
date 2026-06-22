import { computed, nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue'

let lockCount = 0
let zIndexSeed = 120

type UseOverlayOptions = {
  onClose?: () => void
  closeOnEscape?: boolean
  lockScroll?: boolean
  trapFocus?: boolean
}

function setBodyLocked(locked: boolean) {
  if (typeof document === 'undefined') return
  if (locked) {
    lockCount += 1
    document.body.style.overflow = 'hidden'
    return
  }
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

  const overlayStyle = computed(() => ({ zIndex: zIndex.value }))
  const backdropStyle = computed(() => ({ zIndex: zIndex.value - 1 }))

  function handleKeydown(event: KeyboardEvent) {
    if (!openRef.value) return
    if (event.key === 'Escape' && closeOnEscape) {
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

  watch(openRef, async (open) => {
    if (open) {
      zIndexSeed += 10
      zIndex.value = zIndexSeed
      previousActiveElement = typeof document !== 'undefined' && document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
      if (lockScroll) setBodyLocked(true)
      if (typeof document !== 'undefined') document.addEventListener('keydown', handleKeydown)
      await nextTick()
      if (trapFocus) {
        const [first] = getFocusable(overlayRef.value)
        ;(first || overlayRef.value)?.focus?.()
      }
      return
    }

    if (lockScroll) setBodyLocked(false)
    if (typeof document !== 'undefined') document.removeEventListener('keydown', handleKeydown)
    previousActiveElement?.focus?.()
    previousActiveElement = null
  }, { immediate: true })

  onBeforeUnmount(() => {
    if (openRef.value && lockScroll) setBodyLocked(false)
    if (typeof document !== 'undefined') document.removeEventListener('keydown', handleKeydown)
  })

  return {
    overlayRef,
    overlayStyle,
    backdropStyle,
  }
}

