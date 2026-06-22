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

const props = defineProps({
  modelValue: { type: [String, Number, Object], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '请选择' },
  searchPlaceholder: { type: String, default: '搜索' },
  labelKey: { type: String, default: 'label' },
  valueKey: { type: String, default: 'value' },
  clearable: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'change'])
const query = ref('')

const normalizedOptions = computed(() =>
  props.options.map((option) => (typeof option === 'object' ? option : { label: String(option), value: option })),
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
  set: (option) => {
    const value = option?.[props.valueKey] ?? ''
    emit('update:modelValue', value)
    emit('change', value, option ?? null)
  },
})

function clear() {
  selectedProxy.value = null
}
</script>

<template>
  <Combobox
    v-slot="{ open }"
    v-model="selectedProxy"
    nullable
    as="div"
    class="relative"
  >
    <div class="relative">
      <ComboboxButton
        class="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-left text-sm transition-colors hover:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
        @click="query = ''"
      >
        <span class="min-w-0 flex-1 truncate" :class="selectedOption ? 'text-slate-800 dark:text-[#d0d6e0]' : 'text-slate-400 dark:text-[#62666d]'">
          {{ selectedOption?.[labelKey] || placeholder }}
        </span>
        <button
          v-if="clearable && selectedOption"
          type="button"
          class="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-[#d0d6e0]"
          @click.stop="clear"
        >
          <i class="fa-solid fa-xmark text-[10px]"></i>
        </button>
        <i class="fa-solid fa-chevron-down shrink-0 text-[10px] text-slate-400 transition-transform" :class="open ? 'rotate-180' : ''"></i>
      </ComboboxButton>
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
        class="absolute left-0 top-full z-[70] mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-black/10 focus:outline-none dark:border-white/[0.08] dark:bg-[#1b1b1f] dark:shadow-black/40"
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
    </TransitionRoot>
  </Combobox>
</template>
