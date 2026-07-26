<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

type CheckboxValue = string | number | boolean

interface Props {
  modelValue?: boolean | CheckboxValue[] | string | number
  value?: CheckboxValue
  trueValue?: CheckboxValue
  falseValue?: CheckboxValue
  label?: string
  description?: string
  name?: string
  disabled?: boolean
  required?: boolean
  indeterminate?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  value: true,
  trueValue: true,
  falseValue: false,
  label: '',
  description: '',
  name: '',
  disabled: false,
  required: false,
  indeterminate: false,
  error: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | CheckboxValue | CheckboxValue[]): void
  (e: 'change', value: boolean | CheckboxValue | CheckboxValue[], event: Event): void
}>()

const inputEl = ref<HTMLInputElement | null>(null)

// 同步原生 indeterminate 属性，保证辅助技术与表单语义正确
watchEffect(() => {
  if (inputEl.value) inputEl.value.indeterminate = props.indeterminate
})

const checked = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue.includes(props.value)
  return props.modelValue === props.trueValue
})

function toggle(event: Event) {
  if (props.disabled) return

  let nextValue: boolean | CheckboxValue | CheckboxValue[]
  const isChecked = (event.target as HTMLInputElement).checked
  if (Array.isArray(props.modelValue)) {
    const next = new Set(props.modelValue)
    if (isChecked) next.add(props.value)
    else next.delete(props.value)
    nextValue = [...next]
  } else {
    nextValue = isChecked ? props.trueValue : props.falseValue
  }

  emit('update:modelValue', nextValue)
  emit('change', nextValue, event)
}
</script>

<template>
  <label
    class="group inline-flex items-start gap-3"
    :class="disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
  >
    <span class="relative mt-0.5 inline-flex h-4 w-4 shrink-0">
      <input
        ref="inputEl"
        class="peer sr-only"
        type="checkbox"
        :name="name"
        :checked="checked"
        :disabled="disabled"
        :required="required"
        :aria-invalid="error || undefined"
        @change="toggle"
      />
      <span
        class="flex h-4 w-4 items-center justify-center rounded border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[rgb(var(--accent-rgb)/0.35)]"
        :class="[
          checked || indeterminate
            ? 'accent-bg border-transparent text-white'
            : 'border-gray-300 bg-white text-transparent dark:border-white/[0.12] dark:bg-white/[0.04]',
          error ? 'border-rose-500/60' : '',
        ]"
      >
        <i v-if="indeterminate" class="fa-solid fa-minus text-[9px]"></i>
        <i v-else class="fa-solid fa-check text-[9px]"></i>
      </span>
    </span>

    <span v-if="label || description || $slots.default" class="min-w-0">
      <span class="block text-sm font-medium text-slate-800 dark:text-[#f7f8f8]">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="description" class="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-[#8a8f98]">
        {{ description }}
      </span>
    </span>
  </label>
</template>
