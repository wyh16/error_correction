<script setup lang="ts">
/**
 * BaseTabs.vue
 * 通用标签页切换组件，只负责 tab header 和 modelValue 同步。
 */
import { computed } from 'vue'
import { Tab, TabGroup, TabList } from '@headlessui/vue'

export interface TabItem {
  value: string
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean
}

interface Props {
  modelValue: string
  items?: TabItem[]
  size?: 'sm' | 'md'
  type?: 'line' | 'card'
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  size: 'md',
  type: 'line',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectedIndex = computed(() => {
  const index = props.items.findIndex((item) => item.value === props.modelValue)
  return index >= 0 ? index : 0
})

const selectTab = (index: number) => {
  const item = props.items[index]
  if (!item || item.disabled) return
  emit('update:modelValue', item.value)
}

const sizeClass = computed(() =>
  props.size === 'sm' ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm',
)

function buttonClass(selected: boolean, disabled: boolean | undefined) {
  if (props.type === 'card') {
    if (disabled) return 'rounded-lg border border-transparent text-gray-300 dark:text-[#62666d]'
    return selected
      ? 'rounded-lg border border-gray-200 bg-white shadow-sm accent-text dark:border-white/[0.08] dark:bg-white/[0.06]'
      : 'rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-[#8a8f98] dark:hover:bg-white/[0.04] dark:hover:text-[#d0d6e0]'
  }
  if (disabled) return 'border-b-2 border-transparent text-gray-300 dark:text-[#62666d]'
  return selected
    ? 'border-b-2 border-[rgb(var(--accent-rgb))] accent-text'
    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800 dark:text-[#8a8f98] dark:hover:text-[#d0d6e0]'
}
</script>

<template>
  <TabGroup :selected-index="selectedIndex" @change="selectTab">
    <TabList
      class="flex"
      :class="type === 'card'
        ? 'gap-1 rounded-xl bg-gray-50/80 p-1 dark:bg-white/[0.03]'
        : 'border-b border-gray-200 px-4 dark:border-white/[0.06]'"
    >
      <Tab
        v-for="item in items"
        :key="item.value"
        v-slot="{ selected }"
        :disabled="item.disabled"
        as="template"
      >
        <button
          type="button"
          class="inline-flex items-center gap-2 font-bold transition-colors outline-none"
          :class="[
            sizeClass,
            buttonClass(selected, item.disabled),
            item.disabled ? 'cursor-not-allowed' : '',
          ]"
        >
          <i v-if="item.icon" class="fa-solid text-xs" :class="item.icon"></i>
          {{ item.label }}
          <span v-if="item.badge" class="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-white/[0.06] dark:text-[#8a8f98]">
            {{ item.badge }}
          </span>
        </button>
      </Tab>
    </TabList>
  </TabGroup>
</template>
