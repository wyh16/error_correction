<script setup lang="ts">
/**
 * BaseCheckboxGroup.vue
 * 复选框组：用数组 v-model 管理一组 BaseCheckbox，支持 min/max 数量约束。
 */
import BaseCheckbox from './BaseCheckbox.vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  // { label, value, description?, disabled? }
  options: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  direction: { type: String, default: 'vertical' },
  // 最少保留的勾选数，0 表示不限制
  min: { type: Number, default: 0 },
  // 最多可勾选数，0 表示不限制
  max: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

function isOptionDisabled(option) {
  if (props.disabled || option.disabled) return true
  const checked = props.modelValue.includes(option.value)
  // 达到 max 后未勾选项不可再勾；降到 min 后已勾选项不可再取消
  if (!checked && props.max > 0 && props.modelValue.length >= props.max) return true
  if (checked && props.min > 0 && props.modelValue.length <= props.min) return true
  return false
}

function toggleOption(option, checked) {
  let next
  if (checked) {
    // 按 options 声明顺序重建数组，而不是按点击顺序追加，回显更稳定
    next = props.options
      .map(opt => opt.value)
      .filter(value => props.modelValue.includes(value) || value === option.value)
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
