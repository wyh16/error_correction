<script setup lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { Popover, PopoverButton, PopoverPanel, TransitionRoot } from '@headlessui/vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  placement: { type: String, default: 'bottom' },
  align: { type: String, default: 'left' },
  widthClass: { type: String, default: 'w-80' },
  panelClass: {
    type: String,
    default: 'rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-black/10 dark:border-white/[0.08] dark:bg-[#1b1b1f] dark:shadow-black/40',
  },
})

const emit = defineEmits(['update:modelValue', 'open', 'close'])

type CloseFn = ((focusableElement?: HTMLElement | null) => void) | null

const hiddenButtonId = `base-popover-button-${Math.random().toString(36).slice(2)}`
const internalOpen = ref(false)
const latestClose = ref<CloseFn>(null)

const OpenStateSync = defineComponent({
  name: 'BasePopoverOpenStateSync',
  props: {
    open: { type: Boolean, required: true },
    closeFn: { type: Function, default: null },
  },
  emits: ['sync'],
  setup(syncProps, { emit: syncEmit }) {
    watch(
      () => syncProps.open,
      (open) => {
        syncEmit('sync', open, syncProps.closeFn ?? null)
      },
      { immediate: true },
    )
    return () => null
  },
})

function setOpen(value: boolean) {
  if (value === internalOpen.value) return
  const button = typeof document !== 'undefined'
    ? document.getElementById(hiddenButtonId)
    : null
  if (!button) return
  button.click()
}

function syncOpenState(value: boolean, closeFn: CloseFn) {
  latestClose.value = closeFn
  if (value === internalOpen.value) return
  internalOpen.value = value
  emit('update:modelValue', value)
  emit(value ? 'open' : 'close')
}

watch(
  () => props.modelValue,
  (value) => {
    if (value === internalOpen.value) return
    if (!value && internalOpen.value) {
      latestClose.value?.()
      return
    }
    if (value && !internalOpen.value) {
      setOpen(true)
    }
  },
)
</script>

<template>
  <Popover as="div" class="relative inline-block">
    <template #default="{ open, close }">
      <OpenStateSync :open="open" :close-fn="close" @sync="syncOpenState" />

      <PopoverButton :id="hiddenButtonId" class="sr-only">
        打开弹出层
      </PopoverButton>

      <div @click.stop="setOpen(!open)">
        <slot name="trigger" :open="open" />
      </div>

      <TransitionRoot
        :show="open"
        enter="transition duration-150 ease-out"
        enter-from="translate-y-1 opacity-0"
        enter-to="translate-y-0 opacity-100"
        leave="transition duration-100 ease-in"
        leave-from="translate-y-0 opacity-100"
        leave-to="translate-y-1 opacity-0"
      >
        <PopoverPanel
          static
          class="absolute z-[70] mt-2 focus:outline-none"
          :class="[
            widthClass,
            panelClass,
            placement === 'top' ? 'bottom-full mb-2 mt-0' : 'top-full',
            align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0',
          ]"
          @click.stop
        >
          <slot :close="() => close()" />
        </PopoverPanel>
      </TransitionRoot>
    </template>
  </Popover>
</template>
