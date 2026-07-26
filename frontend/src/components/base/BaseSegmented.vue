<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type SegmentedValue = string | number | boolean

export interface SegmentedOption {
  label: string
  value: SegmentedValue
  icon?: string
  disabled?: boolean
}

interface Props {
  modelValue?: SegmentedValue
  options?: SegmentedOption[]
  size?: 'sm' | 'md'
  fullWidth?: boolean
  // 整体禁用：所有选项不可点且整体降透明度
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  size: 'sm',
  fullWidth: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: SegmentedValue): void
  (e: 'change', value: SegmentedValue, event: Event): void
}>()
const rootRef = ref<HTMLElement | null>(null)
const optionRefs = ref<HTMLElement[]>([])
const indicatorStyle = ref<Record<string, string | number>>({ opacity: 0, width: '0px', transform: 'translateX(0px)' })
let resizeObserver: ResizeObserver | null = null

const activeIndex = computed(() => props.options.findIndex(option => option.value === props.modelValue))

const setOptionRef = (el: unknown, index: number) => {
  if (el) optionRefs.value[index] = el as HTMLElement
}

function isOptionDisabled(option: SegmentedOption) {
  return props.disabled || Boolean(option.disabled)
}

const updateIndicator = async () => {
  await nextTick()
  const el = optionRefs.value[activeIndex.value]
  if (!el) {
    indicatorStyle.value = { opacity: 0, width: '0px', transform: 'translateX(0px)' }
    return
  }

  indicatorStyle.value = {
    opacity: 1,
    width: `${el.offsetWidth}px`,
    transform: `translateX(${el.offsetLeft}px)`,
  }
}

const selectOption = (option: SegmentedOption, event: Event) => {
  if (isOptionDisabled(option)) return
  emit('update:modelValue', option.value)
  emit('change', option.value, event)
}

watch(() => [props.modelValue, props.options.length, props.size], updateIndicator, { immediate: true })

onMounted(() => {
  updateIndicator()
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    resizeObserver = new ResizeObserver(updateIndicator)
    resizeObserver.observe(rootRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div ref="rootRef" class="relative items-center overflow-hidden rounded-md brand-btn !border-none p-0.5 transition-colors"
    :class="[fullWidth ? 'flex w-full' : 'inline-flex', disabled ? 'cursor-not-allowed opacity-50' : '']">
    <span
      class="pointer-events-none absolute inset-y-0.5 left-0 rounded brand-gradient-bg shadow-sm transition-[transform,width,opacity] duration-200 ease-out"
      :style="indicatorStyle"
      aria-hidden="true"
    ></span>
    <button
      v-for="(option, index) in options"
      :key="String(option.value)"
      :ref="el => setOptionRef(el, index)"
      type="button"
      :disabled="isOptionDisabled(option)"
      class="relative z-10 items-center justify-center whitespace-nowrap rounded font-medium transition-colors duration-150"
      :class="[
        fullWidth ? 'flex flex-1' : 'inline-flex shrink-0',
        size === 'sm' ? 'h-7 px-3 text-xs' : 'h-8 px-3.5 text-sm',
        modelValue === option.value
          ? 'text-white'
          : isOptionDisabled(option)
            ? 'cursor-not-allowed text-gray-300 dark:text-[#3f434a]'
            : 'text-gray-500 hover:text-gray-700 dark:text-[#62666d] dark:hover:text-[#8a8f98]',
      ]"
      @click="selectOption(option, $event)"
    >
      <i v-if="option.icon" class="fa-solid mr-1.5" :class="option.icon"></i>
      <span class="whitespace-nowrap">{{ option.label }}</span>
    </button>
  </div>
</template>
