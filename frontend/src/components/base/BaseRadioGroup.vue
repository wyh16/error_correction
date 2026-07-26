<script setup lang="ts">
import { computed } from 'vue'
import BaseRadio from './BaseRadio.vue'
import BaseFieldMessage from './BaseFieldMessage.vue'

type RadioValue = string | number | boolean

export interface RadioGroupOption {
  label: string
  value: RadioValue
  description?: string
  disabled?: boolean
}

// 模块级计数器：未传 name 时自动生成唯一 name，保证同组 radio 成组、方向键可用
let groupSeed = 0

interface Props {
  modelValue?: RadioValue
  options?: RadioGroupOption[]
  label?: string
  description?: string
  name?: string
  required?: boolean
  disabled?: boolean
  error?: string
  direction?: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  label: '',
  description: '',
  name: '',
  required: false,
  disabled: false,
  error: '',
  direction: 'vertical',
})

const generatedName = `base-radio-group-${++groupSeed}`
const groupName = computed(() => props.name || generatedName)

const emit = defineEmits<{
  (e: 'update:modelValue', value: RadioValue): void
  (e: 'change', value: RadioValue, event?: Event): void
}>()

function select(value: RadioValue, event?: Event) {
  emit('update:modelValue', value)
  emit('change', value, event)
}
</script>

<template>
  <fieldset>
    <legend v-if="label" class="text-sm font-medium text-slate-800 dark:text-[#f7f8f8]">
      {{ label }}<span v-if="required" class="ml-0.5 text-rose-500">*</span>
    </legend>
    <p v-if="description" class="mt-1 text-xs leading-5 text-slate-500 dark:text-[#8a8f98]">
      {{ description }}
    </p>

    <div class="mt-3 flex gap-4" :class="direction === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'">
      <BaseRadio
        v-for="option in options"
        :key="option.value"
        :model-value="modelValue"
        :value="option.value"
        :label="option.label"
        :description="option.description"
        :name="groupName"
        :disabled="disabled || option.disabled"
        :required="required"
        :error="Boolean(error)"
        @update:model-value="value => select(value)"
      />
      <slot />
    </div>

    <BaseFieldMessage v-if="error" :message="error" type="error" />
  </fieldset>
</template>
