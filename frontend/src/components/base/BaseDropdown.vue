<script setup lang="ts">
/**
 * BaseDropdown.vue
 * 基础下拉菜单组件（支持自定义触发器和菜单内容）
 */
import { defineComponent, ref, watch, type PropType } from 'vue'
import { Menu, MenuButton, MenuItems, TransitionRoot } from '@headlessui/vue'

interface Props {
  modelValue?: boolean
  position?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'left' | 'right' | 'center' | 'start' | 'end'
  width?: string
  /** 控制外边距的类，如 'mt-1' */
  offset?: string
  panelClass?: string
  wrapperClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  position: 'bottom',
  align: 'right',
  width: 'w-48',
  offset: 'mt-1',
  panelClass: 'rounded-lg border bg-white shadow-lg dark:bg-[#15151e] dark:border-white/[0.08] py-1',
  wrapperClass: 'inline-block',
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

type CloseFn = (() => void) | null

const hiddenButtonId = `base-dropdown-button-${Math.random().toString(36).slice(2)}`
const internalOpen = ref(false)
const latestClose = ref<CloseFn>(null)

const OpenStateSync = defineComponent({
  name: 'BaseDropdownOpenStateSync',
  props: {
    open: { type: Boolean, required: true },
    closeFn: { type: Function as PropType<NonNullable<CloseFn>>, default: null },
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

const setOpen = (value: boolean) => {
  const button = typeof document !== 'undefined'
    ? document.getElementById(hiddenButtonId)
    : null
  if (!button) return
  button.click()
}

const toggle = () => setOpen(!internalOpen.value)

const close = () => {
  latestClose.value?.()
}

const syncOpenState = (open: boolean, closeFn: CloseFn) => {
  latestClose.value = closeFn
  if (internalOpen.value === open) return
  internalOpen.value = open
  emit('update:modelValue', open)
}

watch(
  () => props.modelValue,
  (value) => {
    if (value === internalOpen.value) return
    if (!value && internalOpen.value) {
      close()
      return
    }
    if (value && !internalOpen.value) {
      setOpen(true)
    }
  },
)
</script>

<template>
  <Menu as="div" class="relative" :class="wrapperClass">
    <template #default="{ open, close: menuClose }">
      <OpenStateSync :open="open" :close-fn="menuClose" @sync="syncOpenState" />

      <MenuButton :id="hiddenButtonId" class="sr-only">
        打开菜单
      </MenuButton>

      <div @click="toggle" class="cursor-pointer h-full">
        <slot name="trigger" :isOpen="open" :toggle="toggle"></slot>
      </div>

      <TransitionRoot
        :show="open"
        enter="transition duration-150 ease-out"
        enter-from="opacity-0 translate-y-2"
        enter-to="opacity-100 translate-y-0"
        leave="transition duration-100 ease-in"
        leave-from="opacity-100 translate-y-0"
        leave-to="opacity-0 translate-y-2"
      >
        <MenuItems
          static
          class="absolute z-50 overflow-hidden transition-colors duration-200 focus:outline-none"
          :class="[
            width,
            offset,
            panelClass,
            {
              'bottom-full mb-1': position === 'top',
              'top-full mt-1': position === 'bottom',
              'right-full mr-1': position === 'left',
              'left-full ml-1': position === 'right',
              'right-0': (position === 'top' || position === 'bottom') && (align === 'right' || align === 'end'),
              'left-0': (position === 'top' || position === 'bottom') && (align === 'left' || align === 'start'),
              'left-1/2 -translate-x-1/2': (position === 'top' || position === 'bottom') && align === 'center',
              'top-0': (position === 'left' || position === 'right') && (align === 'left' || align === 'start'),
              'bottom-0': (position === 'left' || position === 'right') && (align === 'right' || align === 'end'),
              'top-1/2 -translate-y-1/2': (position === 'left' || position === 'right') && align === 'center',
            }
          ]"
        >
          <slot name="background"></slot>
          <div class="relative z-10">
            <slot :close="close"></slot>
          </div>
        </MenuItems>
      </TransitionRoot>
    </template>
  </Menu>
</template>
