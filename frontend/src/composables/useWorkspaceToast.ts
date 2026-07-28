import { ref, type Ref } from 'vue'

export interface ToastAction {
  label: string
  onClick?: () => void
  href?: string
}

export interface ToastOptions {
  description?: string
  action?: ToastAction | null
  /** 单条 toast 的自动关闭时长（ms），优先于 pushToast 的 timeout 参数 */
  duration?: number
}

export type ToastMessage =
  | string
  | {
    title?: string
    message?: string
    description?: string
    action?: ToastAction | null
    duration?: number
  }

export interface ToastItem {
  id: number
  type: string
  title?: string
  description?: string
  action?: ToastAction | null
}

/** 每条 toast 的定时器信息：支持悬停暂停时记录剩余时间 */
interface ToastTimer {
  timerId: number | null
  /** 到期时间戳（运行中有效） */
  expiresAt: number
  /** 暂停时的剩余毫秒数 */
  remaining: number
}

export interface UseWorkspaceToastReturn {
  toasts: Ref<ToastItem[]>
  pushToast: (type: string, message: ToastMessage, timeout?: number, options?: ToastOptions) => void
  dismissToast: (id: number) => void
  pauseToastTimers: () => void
  resumeToastTimers: () => void
}

/**
 * useWorkspaceToast.ts
 * 工作台全局 Toast 队列。
 *
 * `App.vue` 提供 `pushToast`，业务组件通过 `useToast` 注入后调用。
 */
export function useWorkspaceToast(): UseWorkspaceToastReturn {
  const toasts = ref<ToastItem[]>([])
  let toastId = 0
  // 每条 toast 的自动移除定时器，dismiss / 被挤出队列时需要清理，避免悬空触发
  const timers = new Map<number, ToastTimer>()
  // 悬停暂停状态：暂停期间新入队的 toast 也不启动倒计时
  let paused = false

  const removeToast = (id: number) => {
    timers.delete(id)
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const clearToastTimer = (id: number) => {
    const timer = timers.get(id)
    if (timer) {
      if (timer.timerId !== null) window.clearTimeout(timer.timerId)
      timers.delete(id)
    }
  }

  const startTimer = (id: number, duration: number) => {
    const timerId = window.setTimeout(() => removeToast(id), duration)
    timers.set(id, { timerId, expiresAt: Date.now() + duration, remaining: duration })
  }

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
   * 插入一条 Toast，并按时长自动移除；最多保留最近 5 条。
   * 每条 toast 的时长独立：options.duration / 对象消息的 duration 优先于 timeout 参数。
   */
  const pushToast = (type: string, message: ToastMessage, timeout = 2600, options: ToastOptions = {}) => {
    const id = ++toastId
    const messageDuration = message && typeof message === 'object' ? message.duration : undefined
    const duration = options.duration ?? messageDuration ?? timeout
    const next: ToastItem[] = [{ id, type, ...normalizeToastPayload(message, options) }, ...toasts.value]
    // 被 slice 挤出的旧 toast 也要清掉定时器
    next.slice(5).forEach(t => clearToastTimer(t.id))
    toasts.value = next.slice(0, 5)
    if (duration > 0) {
      if (paused) {
        // 悬停期间入队：不启动定时器，仅记录剩余时长等待 resume
        timers.set(id, { timerId: null, expiresAt: 0, remaining: duration })
      } else {
        startTimer(id, duration)
      }
    }
  }

  const dismissToast = (id: number) => {
    clearToastTimer(id)
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  /** 悬停 toast 堆时暂停所有自动关闭定时器，记录剩余时间。 */
  const pauseToastTimers = () => {
    if (paused) return
    paused = true
    const now = Date.now()
    timers.forEach((timer) => {
      if (timer.timerId === null) return
      window.clearTimeout(timer.timerId)
      timer.timerId = null
      timer.remaining = Math.max(0, timer.expiresAt - now)
    })
  }

  /** 离开 toast 堆后以剩余时长重启所有定时器。 */
  const resumeToastTimers = () => {
    if (!paused) return
    paused = false
    timers.forEach((timer, id) => {
      if (timer.timerId !== null) return
      startTimer(id, timer.remaining)
    })
  }

  return { toasts, pushToast, dismissToast, pauseToastTimers, resumeToastTimers }
}
