<script setup lang="ts">
/**
 * BaseSelect.vue
 * 自定义下拉选择器
 */
import { computed, ref } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, TransitionRoot } from '@headlessui/vue'
import { useDropdownPosition } from '@/composables/useDropdownPosition'

export interface SelectOption {
  label: string
  value: string
}

interface Props {
  modelValue?: string
  options?: string[] | SelectOption[]
  label?: string
  placeholder?: string
  icon?: (() => unknown) | null
  widthClass?: string
  // 是否禁用整个选择器
  disabled?: boolean
  // 是否渲染内置"全部/空值"选项；有选中值时悬停也会显示清空按钮
  clearable?: boolean
  // 尺寸：sm | md（默认）| lg
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  label: '',
  placeholder: '全部',
  icon: null,
  widthClass: '',
  disabled: false,
  clearable: true,
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

/** options 归一化：string[] 与 SelectOption[] 统一为 { label, value } */
const normalizedOptions = computed<SelectOption[]>(() =>
  (props.options as Array<string | SelectOption>).map(opt =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt,
  ),
)

/** 触发器显示选中项 label 而非原始 value */
const selectedLabel = computed(() => {
  if (!props.modelValue) return ''
  const found = normalizedOptions.value.find(opt => opt.value === props.modelValue)
  return found ? found.label : props.modelValue
})

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'h-8 px-2.5 text-xs'
  if (props.size === 'lg') return 'h-11 px-3.5 text-base'
  return 'h-9 px-3 text-sm'
})

const select = (val: string) => {
  emit('update:modelValue', val)
}

// 弹层 Teleport 到 body，避免被祖先 overflow 裁剪。
// Headless UI 的 open 状态只在 slot 中可见，用 TransitionRoot 的进出场钩子同步到 ref 驱动定位。
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const panelOpen = ref(false)
const { panelStyle } = useDropdownPosition(panelOpen, triggerRef, panelRef, { matchWidth: 'min' })

/** 清空选中值。stop 修饰符已阻止事件冒泡，不会触发下拉展开。 */
const clearValue = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <Listbox v-slot="{ open }" :model-value="modelValue" :disabled="disabled" @update:model-value="select">
    <div ref="triggerRef" class="relative" :class="widthClass">
      <label v-if="label" class="mb-1.5 block text-xs font-medium text-slate-500 dark:text-[#62666d]">{{ label }}</label>
      <ListboxButton
        class="group flex w-full items-center justify-between rounded-md bg-white/80 text-left font-medium text-slate-500 ring-1 ring-inset ring-transparent transition-colors hover:bg-white dark:bg-white/[0.045] dark:hover:bg-white/[0.07]"
        :class="[
          sizeClass,
          open ? 'bg-white ring-[rgb(var(--accent-rgb)/0.24)] dark:bg-white/[0.08] dark:ring-[rgb(var(--accent-rgb)/0.35)]' : '',
          modelValue ? 'text-slate-800 dark:text-[#d0d6e0]' : 'text-slate-500 dark:text-[#62666d]',
          disabled ? 'cursor-not-allowed opacity-50 hover:bg-white/80 dark:hover:bg-white/[0.045]' : '',
        ]"
      >
        <span class="truncate">{{ selectedLabel || placeholder }}</span>
        <!-- clearable 且有选中值时，悬停用清空按钮替换下拉箭头 -->
        <span
          v-if="clearable && modelValue && !disabled"
          class="ml-2 hidden shrink-0 text-[11px] text-slate-400 transition-colors hover:text-slate-600 group-hover:inline dark:text-[#62666d] dark:hover:text-[#d0d6e0]"
          @click.stop.prevent="clearValue"
        >
          <i class="fa-solid fa-circle-xmark"></i>
        </span>
        <i
          class="fa-solid fa-chevron-down ml-2 shrink-0 text-[10px] text-slate-400 transition-transform duration-200 dark:text-[#62666d]"
          :class="[open ? 'rotate-180' : '', clearable && modelValue && !disabled ? 'group-hover:hidden' : '']"
        ></i>
      </ListboxButton>

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
            <ListboxOptions
              static
              class="overflow-hidden rounded-lg border border-gray-200 bg-white/95 p-1.5 shadow-lg shadow-slate-200/60 focus:outline-none dark:border-white/[0.08] dark:bg-[#1f1f22] dark:shadow-black/40"
            >
          <div class="no-scrollbar max-h-56 overflow-y-auto space-y-0.5">
            <ListboxOption v-if="clearable" v-slot="{ selected, active }" value="" as="template">
              <li
                class="flex h-8 cursor-pointer items-center gap-2 rounded-md border px-2.5 text-left text-sm transition-colors"
                :class="selected
                  ? 'accent-bg-soft accent-text accent-border'
                  : active
                    ? 'border-transparent bg-slate-100/80 text-slate-600 dark:bg-white/[0.07] dark:text-[#d0d6e0]'
                    : 'border-transparent text-slate-600 dark:text-[#d0d6e0]'"
              >
                <span class="min-w-0 flex-1 truncate">{{ placeholder }}</span>
                <i v-if="selected" class="fa-solid fa-check shrink-0 text-[10px] accent-text"></i>
              </li>
            </ListboxOption>

            <ListboxOption
              v-for="opt in normalizedOptions"
              :key="opt.value"
              v-slot="{ selected, active }"
              :value="opt.value"
              as="template"
            >
              <li
                class="flex h-8 cursor-pointer items-center gap-2 rounded-md border px-2.5 text-left text-sm transition-colors"
                :class="selected
                  ? 'accent-bg-soft accent-text accent-border'
                  : active
                    ? 'border-transparent bg-slate-100/80 text-slate-600 dark:bg-white/[0.07] dark:text-[#d0d6e0]'
                    : 'border-transparent text-slate-600 dark:text-[#d0d6e0]'"
              >
                <span class="min-w-0 flex-1 truncate">{{ opt.label }}</span>
                <i v-if="selected" class="fa-solid fa-check shrink-0 text-[10px] accent-text"></i>
              </li>
            </ListboxOption>
          </div>
            </ListboxOptions>
          </div>
        </TransitionRoot>
      </Teleport>
    </div>
  </Listbox>
</template>
