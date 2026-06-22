<script setup lang="ts">
/**
 * BaseSearchableSelect.vue
 * Search-first selector for large option sets such as subjects and knowledge tags.
 */
import { computed, ref } from 'vue'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'

const props = defineProps({
  modelValue: { type: [String, Array], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '全部' },
  searchPlaceholder: { type: String, default: '搜索...' },
  widthClass: { type: String, default: '' },
  emptyText: { type: String, default: '没有匹配项' },
  multiple: { type: Boolean, default: false },
  dropdownAlign: { type: String, default: 'left' },
})

const emit = defineEmits(['update:modelValue'])
const keyword = ref('')

const normalizedOptions = computed(() =>
  props.options
    .map((option) => String(option || '').trim())
    .filter(Boolean),
)

const filteredOptions = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return normalizedOptions.value
  return normalizedOptions.value.filter((option) => option.toLowerCase().includes(q))
})

const selectedValues = computed(() =>
  Array.isArray(props.modelValue)
    ? props.modelValue.filter(Boolean)
    : (props.modelValue ? [props.modelValue] : []),
)

const displayValue = computed(() => {
  if (!selectedValues.value.length) return props.placeholder
  if (!props.multiple) return selectedValues.value[0]
  if (selectedValues.value.length === 1) return selectedValues.value[0]
  return `已选 ${selectedValues.value.length} 项`
})

function isSelected(value: string) {
  return selectedValues.value.includes(value)
}

function handleSelect(value: string | string[] | null) {
  if (props.multiple) {
    const next = Array.isArray(value) ? value.filter(Boolean) : []
    emit('update:modelValue', next)
    return
  }
  emit('update:modelValue', typeof value === 'string' ? value : '')
}

function clear() {
  emit('update:modelValue', props.multiple ? [] : '')
}
</script>

<template>
  <Combobox
    v-slot="{ open }"
    as="div"
    class="relative"
    :class="widthClass"
    :model-value="multiple ? selectedValues : (selectedValues[0] || '')"
    :multiple="multiple"
    nullable
    @update:model-value="handleSelect"
  >
    <div class="relative">
      <ComboboxButton
        class="flex h-9 w-full items-center justify-between gap-2 rounded-md bg-white/80 px-3 text-left text-sm font-medium ring-1 ring-inset ring-transparent transition-colors hover:bg-white dark:bg-white/[0.045] dark:hover:bg-white/[0.07]"
        :class="[
          open ? 'bg-white ring-[rgb(var(--accent-rgb)/0.24)] dark:bg-white/[0.08] dark:ring-[rgb(var(--accent-rgb)/0.35)]' : '',
          selectedValues.length ? 'text-slate-800 dark:text-[#d0d6e0]' : 'text-slate-500 dark:text-[#62666d]',
        ]"
        @click="keyword = ''"
      >
        <span class="min-w-0 flex-1 truncate" :class="selectedValues.length ? 'pr-5' : ''">{{ displayValue }}</span>
        <i
          class="fa-solid fa-chevron-down shrink-0 text-[10px] text-slate-400 transition-transform duration-200 dark:text-[#62666d]"
          :class="open ? 'rotate-180' : ''"
        ></i>
      </ComboboxButton>

      <button
        v-if="selectedValues.length"
        type="button"
        class="absolute right-7 top-2 flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.06] dark:hover:text-[#d0d6e0]"
        title="清空"
        @click.stop="clear"
      >
        <i class="fa-solid fa-xmark text-[10px]"></i>
      </button>
    </div>

    <TransitionRoot
      :show="open"
      enter="transition duration-150 ease-out"
      enter-from="opacity-0 -translate-y-1"
      enter-to="opacity-100 translate-y-0"
      leave="transition duration-100 ease-in"
      leave-from="opacity-100 translate-y-0"
      leave-to="opacity-0 -translate-y-1"
    >
      <ComboboxOptions
        static
        class="absolute top-full z-50 mt-1 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-md bg-white/95 shadow-lg shadow-slate-200/60 ring-1 ring-inset ring-black/[0.04] focus:outline-none dark:bg-[#1c1c20] dark:shadow-black/40 dark:ring-white/[0.06]"
        :class="dropdownAlign === 'right' ? 'right-0' : 'left-0'"
      >
        <div class="border-b border-gray-200 p-2 dark:border-white/[0.06]">
          <div class="flex h-8 items-center gap-2 rounded-md bg-gray-100 px-2 text-sm dark:bg-white/[0.045]">
            <i class="fa-solid fa-magnifying-glass shrink-0 text-xs text-gray-400 dark:text-[#62666d]"></i>
            <ComboboxInput
              :display-value="() => ''"
              class="h-full min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-[#f7f8f8] dark:placeholder:text-[#62666d]"
              :placeholder="searchPlaceholder"
              @change="keyword = String(($event.target as HTMLInputElement)?.value || '')"
            />
          </div>
        </div>

        <div class="no-scrollbar max-h-72 overflow-y-auto p-2">
          <div class="flex flex-wrap gap-1.5">
            <button
              type="button"
              class="inline-flex h-7 max-w-full items-center whitespace-nowrap rounded-md border px-2.5 text-xs font-medium transition-colors"
              :class="!selectedValues.length
                ? 'accent-bg-soft accent-text accent-border'
                : 'border-gray-200 bg-white/60 text-slate-600 hover:border-gray-300 hover:bg-gray-100/80 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-[#8a8f98] dark:hover:border-white/[0.12] dark:hover:bg-white/[0.05]'"
              @click.stop="clear"
            >
              <span class="whitespace-nowrap">{{ placeholder }}</span>
            </button>

            <ComboboxOption
              v-for="option in filteredOptions"
              :key="option"
              v-slot="{ selected, active }"
              :value="option"
              as="template"
            >
              <li
                class="inline-flex h-7 max-w-full cursor-pointer items-center rounded-md border px-2.5 text-xs font-medium transition-colors"
                :class="selected || isSelected(option)
                  ? 'accent-bg-soft accent-text accent-border'
                  : active
                    ? 'border-gray-300 bg-gray-100/80 text-slate-600 dark:border-white/[0.12] dark:bg-white/[0.05] dark:text-[#8a8f98]'
                    : 'border-gray-200 bg-white/60 text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-[#8a8f98]'"
              >
                <span class="max-w-[10rem] truncate">{{ option }}</span>
                <i v-if="selected || isSelected(option)" class="fa-solid fa-check ml-1 text-[10px]"></i>
              </li>
            </ComboboxOption>
          </div>

          <div v-if="!filteredOptions.length" class="px-3 py-6 text-center text-xs text-gray-500 dark:text-[#8a8f98]">
            {{ emptyText }}
          </div>
        </div>

        <div class="border-t border-gray-200 px-3 py-2 text-xs text-gray-400 dark:border-white/[0.06] dark:text-[#62666d]">
          {{ filteredOptions.length }} / {{ normalizedOptions.length }} 项
        </div>
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>
