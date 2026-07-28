<script setup lang="ts">
import { computed } from 'vue'
import { useOverlay } from '@/composables/useOverlay'

interface Props {
  open?: boolean
  title?: string
  description?: string
  placement?: 'left' | 'right' | 'top' | 'bottom'
  widthClass?: string
  /** 数值型宽/高（如 '480px'）：left/right 作用于宽度并覆盖 widthClass，top/bottom 作用于高度 */
  size?: string
  closeOnBackdrop?: boolean
  persistent?: boolean
  showClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: '',
  description: '',
  placement: 'right',
  widthClass: 'w-full max-w-md',
  size: '',
  closeOnBackdrop: true,
  persistent: false,
  showClose: true,
})

const emit = defineEmits<{ close: [] }>()
const close = () => emit('close')
const { overlayRef, overlayStyle, backdropStyle } = useOverlay(
  computed(() => props.open),
  { onClose: close },
)

const isVertical = computed(() => props.placement === 'top' || props.placement === 'bottom')

const panelClass = computed(() => {
  if (props.placement === 'left') return `left-0 top-0 h-full ${props.size ? 'w-full' : props.widthClass}`
  if (props.placement === 'top') return 'top-0 left-0 w-full max-h-[85vh]'
  if (props.placement === 'bottom') return 'bottom-0 left-0 w-full max-h-[85vh]'
  return `right-0 top-0 h-full ${props.size ? 'w-full' : props.widthClass}`
})

// size 数值型尺寸：水平方向覆盖 widthClass 限宽，垂直方向直接指定高度
const panelSizeStyle = computed(() => {
  if (!props.size) return {}
  return isVertical.value ? { height: props.size } : { maxWidth: props.size }
})

const borderClass = computed(() => {
  if (props.placement === 'top') return 'rounded-b-2xl border-b'
  if (props.placement === 'bottom') return 'rounded-t-2xl border-t'
  if (props.placement === 'left') return 'border-r'
  return 'border-l'
})

const enterFrom = computed(() => {
  if (props.placement === 'left') return '-translate-x-full'
  if (props.placement === 'top') return '-translate-y-full'
  if (props.placement === 'bottom') return 'translate-y-full'
  return 'translate-x-full'
})

function closeFromBackdrop() {
  if (props.closeOnBackdrop && !props.persistent) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-150" leave-to-class="opacity-0">
      <div v-if="open" class="fixed inset-0 bg-black/40 backdrop-blur-sm" :style="backdropStyle" @click="closeFromBackdrop"></div>
    </Transition>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-to-class="translate-x-0 translate-y-0"
      :enter-from-class="enterFrom"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-x-0 translate-y-0"
      :leave-to-class="enterFrom"
    >
      <aside
        v-if="open"
        ref="overlayRef"
        tabindex="-1"
        class="fixed flex flex-col overflow-hidden border-slate-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#17171a]"
        :class="[panelClass, borderClass]"
        :style="[overlayStyle, panelSizeStyle]"
      >
        <header class="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-4 dark:border-white/[0.06]">
          <div class="min-w-0">
            <h2 v-if="title" class="text-base font-bold text-slate-900 dark:text-[#f7f8f8]">{{ title }}</h2>
            <p v-if="description" class="mt-1 text-sm leading-5 text-slate-500 dark:text-[#8a8f98]">{{ description }}</p>
          </div>
          <button v-if="showClose" type="button" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-[#d0d6e0]" @click="emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto custom-scrollbar p-5">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="shrink-0 border-t border-slate-200/70 px-5 py-3 dark:border-white/[0.06]">
          <slot name="footer" />
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>
