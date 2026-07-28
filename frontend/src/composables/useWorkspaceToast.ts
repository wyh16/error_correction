import { ref } from 'vue'

type ToastAction = {
  label: string
  onClick?: () => void
  href?: string
}

type ToastOptions = {
  description?: string
  action?: ToastAction | null
}

type ToastMessage =
  | string
  | {
    title?: string
    message?: string
    description?: string
    action?: ToastAction | null
  }

type ToastItem = {
  id: number
  type: string
  title: string
  description: string
  action: ToastAction | null
}

/**
 * useWorkspaceToast.ts
 * 工作台全局 Toast 队列。
 *
 * `App.vue` 提供 `pushToast`，业务组件通过 `useToast` 注入后调用。
 */
export function useWorkspaceToast() {
  const toasts = ref<ToastItem[]>([])
  let toastId = 0

  const normalizeToastPayload = (message: ToastMessage, options: ToastOptions = {}) => {
    if (message && typeof message === 'object') {
      return {
        title: message.title || message.message || '',
        description: message.description || '',
        action: message.action || null,
      }
    }
    return {
      title: String(message || ''),
      description: options.description || '',
      action: options.action || null,
    }
  }

  /**
   * 插入一条 Toast，并按 `timeout` 自动移除；最多保留最近 5 条。
   */
  const pushToast = (type: string, message: ToastMessage, timeout = 2600, options: ToastOptions = {}) => {
    const id = ++toastId
    toasts.value = [{ id, type, ...normalizeToastPayload(message, options) }, ...toasts.value].slice(0, 5)
    if (timeout > 0) {
      window.setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, timeout)
    }
  }

  const dismissToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, pushToast, dismissToast }
}
