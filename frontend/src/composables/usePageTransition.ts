import { ref } from 'vue'

const loading = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null
let resolveEnter: (() => void) | null = null

/**
 * 全局页面过渡控制。
 * 使用 Promise + 事件监听机制，确保路由跳转在遮罩完全覆盖后再开始。
 */
export function usePageTransition() {
  /**
   * 显示遮罩。
   * 返回一个 Promise，在 `BaseLoading` 触发 `after-enter` 后 resolve。
   */
  const show = () => {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }

    // 如果已经处于 loading 中，则复用当前进入流程的 Promise。
    if (loading.value && resolveEnter) {
      return new Promise<void>((r) => {
        const oldResolve = resolveEnter
        resolveEnter = () => {
          oldResolve()
          r()
        }
      })
    }

    loading.value = true

    return new Promise<void>((resolve) => {
      resolveEnter = resolve
    })
  }

  /**
   * 遮罩淡入动画完成后的回调，由 `App.vue` 监听 `BaseLoading` 事件后调用。
   */
  const notifyEnterCompleted = () => {
    if (resolveEnter) {
      resolveEnter()
      resolveEnter = null
    }
  }

  /**
   * 隐藏遮罩。
   * `delay` 用于确保新组件渲染完成后再淡出。
   */
  const hide = (delay = 400) => {
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      loading.value = false
      hideTimer = null
    }, delay)
  }

  return {
    loading,
    show,
    hide,
    notifyEnterCompleted,
  }
}

