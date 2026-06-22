<script setup lang="ts">
/**
 * BaseTabs.vue
 * 通用标签页切换组件，只负责 tab header 和 modelValue 同步。
 */
import { computed } from 'vue'
import { Tab, TabGroup, TabList } from '@headlessui/vue'

const props = defineProps({
  modelValue: { type: String, required: true },
  items: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue'])

const selectedIndex = computed(() => {
  const index = props.items.findIndex((item) => item.value === props.modelValue)
  return index >= 0 ? index : 0
})

const selectTab = (index: number) => {
  const item = props.items[index]
  if (!item) return
  emit('update:modelValue', item.value)
}
</script>

<template>
  <TabGroup :selected-index="selectedIndex" @change="selectTab">
    <TabList class="flex border-b border-gray-200 px-4 dark:border-white/[0.06]">
      <Tab
        v-for="item in items"
        :key="item.value"
        v-slot="{ selected }"
        as="template"
      >
        <button
          type="button"
          class="inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors outline-none"
          :class="selected
            ? 'border-[rgb(var(--accent-rgb))] accent-text'
            : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-[#8a8f98] dark:hover:text-[#d0d6e0]'"
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
