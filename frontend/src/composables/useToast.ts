import { inject } from 'vue'
import type { ToastMessage, ToastOptions } from '@/composables/useWorkspaceToast'

export type PushToastFn = (type: string, message: ToastMessage, timeout?: number, options?: ToastOptions) => void

const TOAST_KEY = 'pushToast'
const noopToast: PushToastFn = (type, msg) => { console.warn(`[Toast:${type}] ${typeof msg === 'string' ? msg : msg.title || msg.message || ''}`) }

/**
 * useToast — 注入 pushToast，带安全 fallback
 * 用于子组件中，替代手写 inject('pushToast', fallback)
 */
export function useToast(): { pushToast: PushToastFn } {
  const pushToast = inject<PushToastFn>(TOAST_KEY, noopToast)
  return { pushToast }
}

/** provide 时使用的 key，保持一致 */
export const TOAST_INJECTION_KEY = TOAST_KEY
