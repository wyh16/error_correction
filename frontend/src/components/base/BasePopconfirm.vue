<script setup lang="ts">
/**
 * BasePopconfirm.vue
 * 轻量二次确认浮层，用于替代 window.confirm。
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'

interface Props {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  /** 浮层弹出方向：bottom 触发器下方（默认）/ top 上方 */
  placement?: 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
  title: '确认操作？',
  description: '',
  confirmText: '确认',
  cancelText: '取消',
  danger: false,
  placement: 'bottom',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const panelPlacementClass = computed(() =>
  props.placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
)

const confirm = () => {
  open.value = false
  emit('confirm')
}

const cancel = () => {
  open.value = false
  emit('cancel')
}

/** 点击组件外部时关闭浮层（不触发 cancel 事件，仅收起）。 */
function onDocumentMousedown(event: MouseEvent) {
  if (!rootRef.value) return
  if (event.target instanceof Node && rootRef.value.contains(event.target)) return
  open.value = false
}

// 仅在浮层打开时挂载 document 监听，卸载与关闭时清理
watch(open, (value) => {
  if (typeof document === 'undefined') return
  if (value) document.addEventListener('mousedown', onDocumentMousedown)
  else document.removeEventListener('mousedown', onDocumentMousedown)
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.removeEventListener('mousedown', onDocumentMousedown)
})
</script>

<template>
  <span ref="rootRef" class="relative inline-flex" @click.stop>
    <span @click="open = !open">
      <slot />
    </span>
    <Transition name="pop">
      <div
        v-if="open"
        class="absolute right-0 z-[80] w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl shadow-black/10 dark:border-white/[0.08] dark:bg-[#1d1e22] dark:shadow-black/40"
        :class="panelPlacementClass"
      >
        <p class="text-sm font-bold text-gray-900 dark:text-[#f7f8f8]">{{ title }}</p>
        <p v-if="description" class="mt-1 text-xs leading-5 text-gray-500 dark:text-[#8a8f98]">{{ description }}</p>
        <div class="mt-3 flex justify-end gap-2">
          <button class="h-8 rounded-lg px-3 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-100 dark:text-[#8a8f98] dark:hover:bg-white/[0.06]" @click="cancel">
            {{ cancelText }}
          </button>
          <button
            class="h-8 rounded-lg px-3 text-xs font-bold text-white transition-colors"
            :class="danger ? 'bg-rose-500 hover:bg-rose-400' : 'accent-bg hover:opacity-90'"
            @click="confirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </Transition>
  </span>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
