<script setup lang="ts">
/**
 * BaseCheckboxGroup.vue
 * 复选框组：用数组 v-model 管理一组 BaseCheckbox，支持 min/max 数量约束。
 */
import BaseCheckbox from './BaseCheckbox.vue'

export interface CheckboxGroupOption {
  label: string
  value: string | number
  description?: string
  disabled?: boolean
}

interface Props {
  modelValue?: Array<string | number>
  options?: CheckboxGroupOption[]
  label?: string
  direction?: 'vertical' | 'horizontal'
  // 最少保留的勾选数，0 表示不限制
  min?: number
  // 最多可勾选数，0 表示不限制
  max?: number
  disabled?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  options: () => [],
  label: '',
  direction: 'vertical',
  min: 0,
  max: 0,
  disabled: false,
  error: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Array<string | number>): void
  (e: 'change', value: Array<string | number>): void
}>()

function isOptionDisabled(option: CheckboxGroupOption) {
  if (props.disabled || option.disabled) return true
  const checked = props.modelValue.includes(option.value)
  // 达到 max 后未勾选项不可再勾；降到 min 后已勾选项不可再取消
  if (!checked && props.max > 0 && props.modelValue.length >= props.max) return true
  if (checked && props.min > 0 && props.modelValue.length <= props.min) return true
  return false
}

function toggleOption(option: CheckboxGroupOption, checked: boolean) {
  let next: Array<string | number>
  if (checked) {
    // 在原值基础上追加，保留 modelValue 中不在 options 里的值
    next = props.modelValue.includes(option.value)
      ? [...props.modelValue]
      : [...props.modelValue, option.value]
  } else {
    next = props.modelValue.filter(value => value !== option.value)
  }
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <fieldset>
    <legend v-if="label" class="mb-3 text-sm font-medium text-slate-800 dark:text-[#f7f8f8]">
      {{ label }}
    </legend>
    <div :class="direction === 'horizontal' ? 'flex flex-row flex-wrap gap-x-6 gap-y-2' : 'flex flex-col gap-2.5'">
      <BaseCheckbox
        v-for="option in options"
        :key="option.value"
        :model-value="modelValue.includes(option.value)"
        :label="option.label"
        :description="option.description"
        :disabled="isOptionDisabled(option)"
        :error="error"
        @update:model-value="checked => toggleOption(option, checked)"
      />
      <slot />
    </div>
  </fieldset>
</template>
