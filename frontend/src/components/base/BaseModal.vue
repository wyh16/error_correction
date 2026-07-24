<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { useOverlay } from '@/composables/useOverlay'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  icon: { type: String, default: '' },
  iconClass: { type: String, default: 'text-blue-600 dark:text-blue-400' },
  iconBg: { type: String, default: 'bg-blue-50 dark:bg-blue-500/10' },
  maxWidth: { type: String, default: 'max-w-md' },
  bodyClass: { type: String, default: 'px-6 py-5' },
  blurBackdrop: { type: Boolean, default: true },
  sidebarOffset: { type: Number, default: null },
  // 持久模式：点击遮罩不关闭，只轻微晃动面板提示用户需要显式操作
  persistent: { type: Boolean, default: false },
  // 是否显示默认头部右上角的关闭按钮
  showClose: { type: Boolean, default: true },
})

const emit = defineEmits(['close'])

const close = () => emit('close')

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

/** Headless UI 的 Dialog 在点击遮罩/按下 Esc 时触发，persistent 模式下拦截为晃动提示。 */
const requestClose = () => {
  if (props.persistent) {
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
</script>

<template>
  <TransitionRoot appear as="template" :show="open">
    <Dialog as="div" class="relative z-[100]" @close="requestClose">
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
              :class="[maxWidth, shaking ? 'modal-shake' : '']"
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
