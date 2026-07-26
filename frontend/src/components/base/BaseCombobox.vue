<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import { useDropdownPosition } from '@/composables/useDropdownPosition'

export interface ComboboxOption {
  label?: string
  value?: string | number
  [key: string]: unknown
}

interface Props {
  modelValue?: string | number | Record<string, unknown>
  options?: Array<string | number | ComboboxOption>
  placeholder?: string
  searchPlaceholder?: string
  labelKey?: string
  valueKey?: string
  clearable?: boolean
  // 是否禁用整个选择器
  disabled?: boolean
  // 错误态：红色边框
  error?: boolean
  // 尺寸：sm | md（默认）| lg
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  placeholder: '请选择',
  searchPlaceholder: '搜索',
  labelKey: 'label',
  valueKey: 'value',
  clearable: true,
  disabled: false,
  error: false,
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number, option: ComboboxOption | null): void
}>()
const query = ref('')

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'h-8 px-2.5 text-xs'
  if (props.size === 'lg') return 'h-12 px-3.5 text-base'
  return 'h-10 px-3 text-sm'
})

const normalizedOptions = computed<ComboboxOption[]>(() =>
  props.options.map((option) =>
    (typeof option === 'object' && option !== null ? option : { label: String(option), value: option }) as ComboboxOption,
  ),
)

const selectedOption = computed(() =>
  normalizedOptions.value.find((option) => option[props.valueKey] === props.modelValue) ?? null,
)

const filteredOptions = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return normalizedOptions.value
  return normalizedOptions.value.filter((option) =>
    String(option[props.labelKey] || '').toLowerCase().includes(keyword),
  )
})

const selectedProxy = computed({
  get: () => selectedOption.value,
  set: (option: ComboboxOption | null) => {
    const value = (option?.[props.valueKey] ?? '') as string | number
    emit('update:modelValue', value)
    emit('change', value, option ?? null)
  },
})

function clear() {
  if (props.disabled) return
  selectedProxy.value = null
}

// 弹层 Teleport 到 body，避免被祖先 overflow 裁剪；open 状态经 TransitionRoot 钩子同步
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const panelOpen = ref(false)
const { panelStyle } = useDropdownPosition(panelOpen, triggerRef, panelRef, { matchWidth: 'exact' })
</script>

<template>
  <Combobox
    v-slot="{ open }"
    v-model="selectedProxy"
    nullable
    :disabled="disabled"
    as="div"
    class="relative"
  >
    <div ref="triggerRef" class="relative">
      <ComboboxButton
        class="flex w-full items-center justify-between gap-2 rounded-lg border bg-white text-left transition-colors dark:bg-white/[0.03]"
        :class="[
          sizeClass,
          error ? 'border-rose-500/50' : 'border-slate-200 dark:border-white/[0.08]',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-slate-50 dark:hover:bg-white/[0.06]',
        ]"
        :disabled="disabled"
        @click="query = ''"
      >
        <span class="min-w-0 flex-1 truncate" :class="selectedOption ? 'text-slate-800 dark:text-[#d0d6e0]' : 'text-slate-400 dark:text-[#62666d]'">
          {{ selectedOption?.[labelKey] || placeholder }}
        </span>
        <button
          v-if="clearable && selectedOption && !disabled"
          type="button"
          class="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-[#d0d6e0]"
          @click.stop="clear"
        >
          <i class="fa-solid fa-xmark text-[10px]"></i>
        </button>
        <i class="fa-solid fa-chevron-down shrink-0 text-[10px] text-slate-400 transition-transform" :class="open ? 'rotate-180' : ''"></i>
      </ComboboxButton>
    </div>

    <Teleport to="body">
      <TransitionRoot
        :show="open"
        enter="transition duration-150 ease-out"
        enter-from="opacity-0 -translate-y-1"
        enter-to="opacity-100 translate-y-0"
        leave="transition duration-100 ease-in"
        leave-from="opacity-100 translate-y-0"
        leave-to="opacity-0 -translate-y-1"
        @before-enter="panelOpen = true"
        @after-leave="panelOpen = false"
      >
        <div ref="panelRef" :style="panelStyle">
          <ComboboxOptions
            static
            class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-black/10 focus:outline-none dark:border-white/[0.08] dark:bg-[#1b1b1f] dark:shadow-black/40"
          >
        <div class="border-b border-slate-200 p-2 dark:border-white/[0.06]">
          <ComboboxInput
            :display-value="() => ''"
            class="h-9 w-full rounded-lg bg-slate-100 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:bg-white/[0.05] dark:text-[#f7f8f8] dark:placeholder:text-[#62666d]"
            :placeholder="searchPlaceholder"
            @change="query = String(($event.target as HTMLInputElement)?.value || '')"
          />
        </div>
        <div class="max-h-56 overflow-y-auto p-1.5 custom-scrollbar">
          <ComboboxOption
            v-for="option in filteredOptions"
            :key="option[valueKey]"
            v-slot="{ selected, active }"
            :value="option"
            as="template"
          >
            <li
              class="flex h-9 cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 text-left text-sm transition-colors"
              :class="active ? 'accent-bg-soft accent-text' : 'text-slate-700 dark:text-[#d0d6e0] dark:hover:bg-white/[0.05]'"
            >
              <span class="min-w-0 truncate">{{ option[labelKey] }}</span>
              <i v-if="selected" class="fa-solid fa-check text-[10px]"></i>
            </li>
          </ComboboxOption>
          <div v-if="!filteredOptions.length" class="px-3 py-6 text-center text-sm text-slate-500 dark:text-[#8a8f98]">
            没有匹配项
          </div>
        </div>
          </ComboboxOptions>
        </div>
      </TransitionRoot>
    </Teleport>
  </Combobox>
</template>
