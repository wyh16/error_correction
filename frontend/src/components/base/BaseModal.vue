<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { useOverlay } from '@/composables/useOverlay'

interface Props {
  open?: boolean
  title: string
  icon?: string
  iconClass?: string
  iconBg?: string
  maxWidth?: string
  /** 数值型宽度（如 '640px'），传入后覆盖 maxWidth 类 */
  width?: string
  bodyClass?: string
  blurBackdrop?: boolean
  sidebarOffset?: number | null
  /** 持久模式：点击遮罩 / ESC 不关闭，只轻微晃动面板提示用户需要显式操作 */
  persistent?: boolean
  /** 点击遮罩是否关闭；显式传入时优先级高于 persistent */
  maskClosable?: boolean
  /** 按 ESC 是否关闭；显式传入时优先级高于 persistent */
  closeOnEsc?: boolean
  /** 是否显示默认头部右上角的关闭按钮 */
  showClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  icon: '',
  iconClass: 'text-blue-600 dark:text-blue-400',
  iconBg: 'bg-blue-50 dark:bg-blue-500/10',
  maxWidth: 'max-w-md',
  width: '',
  bodyClass: 'px-6 py-5',
  blurBackdrop: true,
  sidebarOffset: null,
  persistent: false,
  maskClosable: undefined,
  closeOnEsc: undefined,
  showClose: true,
})

const emit = defineEmits<{ close: [] }>()

const close = () => emit('close')

// 显式传入的单项开关优先于 persistent；两者都缺省时默认允许关闭
const maskClosableEffective = computed(() => props.maskClosable ?? !props.persistent)
const closeOnEscEffective = computed(() => props.closeOnEsc ?? !props.persistent)

// persistent 时的晃动反馈：短暂加上 shake 类再移除，让动画可以重复触发。
const shaking = ref(false)
let shakeTimer: ReturnType<typeof setTimeout> | undefined
const shake = () => {
  shaking.value = true
  clearTimeout(shakeTimer)
  shakeTimer = setTimeout(() => {
    shaking.value = false
  }, 350)
}

// Headless UI Dialog 的 @close 无法区分「点击遮罩」和「按下 ESC」，
// 这里用 document 捕获阶段的 keydown 监听先行标记 ESC，requestClose 内按来源分别判定开关。
let closingViaEsc = false
const markEsc = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  closingViaEsc = true
  // @close 在同一轮事件派发中同步触发，微任务后复位即可
  setTimeout(() => {
    closingViaEsc = false
  }, 0)
}

watch(() => props.open, (open) => {
  if (typeof document === 'undefined') return
  if (open) document.addEventListener('keydown', markEsc, true)
  else document.removeEventListener('keydown', markEsc, true)
}, { immediate: true })

// 卸载时清理晃动定时器与 ESC 标记监听，避免悬空回调
onBeforeUnmount(() => {
  clearTimeout(shakeTimer)
  if (typeof document !== 'undefined') document.removeEventListener('keydown', markEsc, true)
})

/** Headless UI 的 Dialog 在点击遮罩/按下 Esc 时触发，按对应开关决定关闭或晃动提示。 */
const requestClose = () => {
  const allowed = closingViaEsc ? closeOnEscEffective.value : maskClosableEffective.value
  if (!allowed) {
    shake()
    return
  }
  close()
}

const { overlayRef, overlayStyle, backdropStyle: overlayBackdropStyle } = useOverlay(
  computed(() => props.open),
  { onClose: close, closeOnEscape: false, trapFocus: false },
)

const backdropStyle = computed(() => ({
  '--dialog-backdrop-blur': props.blurBackdrop ? '8px' : '0px',
  ...overlayBackdropStyle.value,
}))

const panelStyle = computed(() => ({
  ...overlayStyle.value,
}))

// 数值型宽度：覆盖 maxWidth 类，直接以内联样式限定面板宽度
const panelWidthStyle = computed(() => (props.width ? { maxWidth: props.width } : {}))

// Dialog 根节点自身形成层叠上下文，z-index 必须动态取自 useOverlay，
// 否则先开 Drawer（动态层级更高）再开 Modal 时 Modal 会被盖住。
const dialogRootStyle = computed(() => ({
  position: 'relative' as const,
  ...overlayStyle.value,
}))
</script>

<template>
  <TransitionRoot appear as="template" :show="open">
    <Dialog as="div" :style="dialogRootStyle" @close="requestClose">
      <TransitionChild
        as="template"
        enter="transition duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="dialog-backdrop fixed inset-0 bg-black/40"
          :style="backdropStyle"
        ></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto" :style="panelStyle">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            enter-from="opacity-0 translate-y-2 scale-[0.96]"
            enter-to="opacity-100 translate-y-0 scale-100"
            leave="transition duration-200 ease-in"
            leave-from="opacity-100 translate-y-0 scale-100"
            leave-to="opacity-0 translate-y-2 scale-[0.96]"
          >
            <DialogPanel
              ref="overlayRef"
              class="relative w-full rounded-xl border border-slate-200/60 bg-white shadow-2xl dark:border-[#2f3336] dark:bg-[#1b1b1d]"
              :class="[width ? '' : maxWidth, shaking ? 'modal-shake' : '']"
              :style="panelWidthStyle"
            >
              <DialogTitle v-if="$slots.header" class="sr-only">
                {{ title }}
              </DialogTitle>

              <slot name="header" :close="close">
                <div class="flex items-center justify-between border-b border-slate-200/60 px-6 pt-5 pb-4 dark:border-[#2f3336]">
                  <div class="flex items-center gap-3">
                    <div v-if="$slots.icon || icon" class="flex h-9 w-9 items-center justify-center rounded-lg" :class="iconBg">
                      <slot name="icon">
                        <i class="fa-solid text-base" :class="[icon, iconClass]"></i>
                      </slot>
                    </div>
                    <DialogTitle class="text-lg font-bold text-slate-900 dark:text-[#f7f8f8]">
                      {{ title }}
                    </DialogTitle>
                  </div>
                  <button
                    v-if="showClose"
                    type="button"
                    @click="close"
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-[#8a8f98] dark:hover:bg-white/[0.04] dark:hover:text-[#d0d6e0]"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </slot>

              <div :class="bodyClass">
                <slot />
              </div>

              <div v-if="$slots.footer" class="flex min-h-16 items-center justify-end gap-2 rounded-b-xl border-t border-slate-200/60 px-6 py-3 dark:border-[#2f3336]">
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.dialog-backdrop {
  backdrop-filter: blur(var(--dialog-backdrop-blur, 8px));
  -webkit-backdrop-filter: blur(var(--dialog-backdrop-blur, 8px));
}

/* persistent 模式下点击遮罩的晃动提示。 */
.modal-shake {
  animation: modal-shake 0.35s ease-in-out;
}

@keyframes modal-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-8px);
  }
  40% {
    transform: translateX(8px);
  }
  60% {
    transform: translateX(-5px);
  }
  80% {
    transform: translateX(5px);
  }
}

</style>
