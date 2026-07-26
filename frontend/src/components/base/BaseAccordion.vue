<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { TransitionRoot } from '@headlessui/vue'

export interface AccordionItem {
  value: string | number
  label: string
  icon?: string
  content?: string
  disabled?: boolean
}

type AccordionValue = string | number | Array<string | number>

interface Props {
  modelValue?: AccordionValue
  items?: AccordionItem[]
  multiple?: boolean
  ghost?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  items: () => [],
  multiple: false,
  ghost: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: AccordionValue): void
  (e: 'change', value: AccordionValue): void
}>()

const internalValue = ref<AccordionValue>(props.modelValue)

watch(() => props.modelValue, value => {
  internalValue.value = value
})

const openValues = computed<Array<string | number>>(() => {
  if (props.multiple) return Array.isArray(internalValue.value) ? internalValue.value : []
  // 单选模式空串是"全部关闭"的哨兵值，显式排除 null/undefined，避免 0 等合法值被判假
  const value = internalValue.value
  return value === '' || value === null || value === undefined ? [] : [value as string | number]
})

function toggle(item: AccordionItem) {
  if (item.disabled) return
  const value = item.value
  let next: AccordionValue
  if (props.multiple) {
    const set = new Set(openValues.value)
    if (set.has(value)) set.delete(value)
    else set.add(value)
    next = [...set]
  } else {
    next = openValues.value.includes(value) ? '' : value
  }
  internalValue.value = next
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div :class="ghost ? '' : 'overflow-hidden rounded-xl border border-slate-200 bg-white/70 dark:border-white/[0.08] dark:bg-white/[0.025]'">
    <!-- 展开状态完全受控于 openValues：Disclosure 无受控模式，此前靠拼接 open 状态进 key 强制重建来同步，导致过渡动画失效；改用普通元素 + TransitionRoot 受控渲染 -->
    <div
      v-for="item in items"
      :key="item.value"
      :class="ghost ? '' : 'border-b border-slate-200/70 last:border-b-0 dark:border-white/[0.06]'"
    >
      <button
        type="button"
        class="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold transition-colors"
        :class="[
          ghost ? 'rounded-lg' : '',
          item.disabled
            ? 'cursor-not-allowed text-slate-400 opacity-60 dark:text-[#62666d]'
            : 'text-slate-800 hover:bg-slate-50 dark:text-[#f7f8f8] dark:hover:bg-white/[0.04]',
        ]"
        :aria-expanded="openValues.includes(item.value)"
        :disabled="item.disabled"
        @click="toggle(item)"
      >
        <span class="flex min-w-0 items-center gap-2.5">
          <i v-if="item.icon" class="fa-solid shrink-0 text-xs text-slate-400 dark:text-[#8a8f98]" :class="item.icon"></i>
          <span class="min-w-0 truncate">{{ item.label }}</span>
        </span>
        <i class="fa-solid fa-chevron-down shrink-0 text-[10px] text-slate-400 transition-transform" :class="openValues.includes(item.value) ? 'rotate-180' : ''"></i>
      </button>

      <TransitionRoot
        :show="openValues.includes(item.value)"
        enter="transition duration-150 ease-out"
        enter-from="-translate-y-1 opacity-0"
        enter-to="translate-y-0 opacity-100"
        leave="transition duration-100 ease-in"
        leave-from="translate-y-0 opacity-100"
        leave-to="-translate-y-1 opacity-0"
      >
        <div class="px-4 pb-4 text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
          <slot name="item" :item="item">
            {{ item.content }}
          </slot>
        </div>
      </TransitionRoot>
    </div>
  </div>
</template>
