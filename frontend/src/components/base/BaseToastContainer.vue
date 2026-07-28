<script setup lang="ts">
/**
 * BaseToastContainer.vue
 * Linear-like global toast stack.
 */
import { computed } from 'vue'
import { Z_TOAST } from '@/composables/useOverlay'
import type { ToastItem } from '@/composables/useWorkspaceToast'

type ToastPosition = 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left'

interface Props {
  toasts?: ToastItem[]
  sidebarOffset?: number
  position?: ToastPosition
  /** 悬停 toast 堆时暂停自动关闭（派发 pause/resume 事件，由持有定时器的一方处理） */
  pauseOnHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  toasts: () => [],
  sidebarOffset: 0,
  position: 'bottom-right',
  pauseOnHover: false,
})

const emit = defineEmits<{
  dismiss: [id: number]
  pause: []
  resume: []
}>()

const iconClassMap: Record<string, string> = {
  success: 'fa-circle-check text-emerald-400',
  error: 'fa-circle-xmark text-rose-400',
  warning: 'fa-triangle-exclamation text-amber-400',
  info: 'fa-circle-info accent-text',
}

const fallbackTitleMap: Record<string, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Information',
}

const titleOf = (toast: ToastItem) => toast.title || fallbackTitleMap[toast.type] || 'Notice'

// 水平定位交由 containerStyle 计算（左侧需要避开侧边栏），这里只保留垂直方向的类
const positionClassMap: Record<ToastPosition, string> = {
  'bottom-right': 'bottom-5',
  'top-right': 'top-5',
  'bottom-left': 'bottom-5',
  'top-left': 'top-5',
}

const containerStyle = computed(() => {
  const isLeft = props.position === 'bottom-left' || props.position === 'top-left'
  return {
    zIndex: Z_TOAST,
    // 侧边栏在页面左侧：左侧的 toast 堆需要加上 sidebarOffset 避免被侧边栏遮挡
    ...(isLeft
      ? { left: `calc(1.25rem + ${props.sidebarOffset}px)` }
      : { right: '1.25rem' }),
  }
})

const onMouseEnter = () => {
  if (props.pauseOnHover) emit('pause')
}

const onMouseLeave = () => {
  if (props.pauseOnHover) emit('resume')
}

const onLeave = (element: Element) => {
  const el = element as HTMLElement
  // 离场时改为 absolute 定位以便剩余 toast 平滑补位。
  // 定位祖先是本 fixed 容器，因此必须用 offsetLeft/offsetTop（相对 offsetParent），
  // 不能用 getBoundingClientRect() 的视口坐标，否则离场 toast 会瞬移。
  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = el
  el.style.left = `${offsetLeft}px`
  el.style.top = `${offsetTop}px`
  el.style.width = `${offsetWidth}px`
  el.style.height = `${offsetHeight}px`
  el.style.position = 'absolute'
}
</script>

<template>
  <div
    class="pointer-events-none fixed flex w-[calc(100vw-2.5rem)] max-w-[26.5rem] flex-col items-stretch gap-2"
    :class="positionClassMap[position] || positionClassMap['bottom-right']"
    :style="containerStyle"
  >
    <TransitionGroup
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-3 scale-[0.98] opacity-0"
      enter-to-class="translate-y-0 scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 scale-100 opacity-100"
      leave-to-class="translate-y-2 scale-[0.98] opacity-0"
      move-class="transition duration-200 ease-out"
      @leave="onLeave"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        role="status"
        class="pointer-events-auto flex gap-3 rounded-xl border border-white/[0.09] bg-[#202022]/95 px-3.5 py-3 text-[#f7f8f8] shadow-[0_18px_50px_rgba(0,0,0,0.38)] ring-1 ring-black/20 backdrop-blur-xl"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <div class="flex h-5 w-5 shrink-0 items-center justify-center pt-0.5">
          <i
            class="fa-solid text-[15px]"
            :class="iconClassMap[toast.type] || iconClassMap.info"
          ></i>
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-1.5">
          <div class="flex min-w-0 items-start justify-between gap-3">
            <p class="line-clamp-2 min-w-0 text-sm font-semibold leading-5 text-[#f7f8f8]">
              {{ titleOf(toast) }}
            </p>
            <button
              type="button"
              class="-mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#8a8f98] transition-colors hover:bg-white/[0.06] hover:text-[#f7f8f8]"
              title="关闭"
              @click="emit('dismiss', toast.id)"
            >
              <i class="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>

          <p
            v-if="toast.description"
            class="line-clamp-2 text-[13px] leading-5 text-[#a8adb7]"
          >
            {{ toast.description }}
          </p>

          <a
            v-if="toast.action?.href"
            :href="toast.action.href"
            class="mt-1 inline-flex w-fit text-sm font-medium accent-text transition-colors hover:text-[rgb(var(--accent-hover-rgb))]"
          >
            {{ toast.action.label || '查看' }}
          </a>
          <button
            v-else-if="toast.action?.label"
            type="button"
            class="mt-1 inline-flex w-fit text-sm font-medium accent-text transition-colors hover:text-[rgb(var(--accent-hover-rgb))]"
            @click="toast.action.onClick?.(); emit('dismiss', toast.id)"
          >
            {{ toast.action.label }}
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
