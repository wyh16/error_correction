<script setup lang="ts">
import { computed } from 'vue'
import BaseFieldMessage from './BaseFieldMessage.vue'

interface Props {
  modelValue?: number | string | null
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  min?: number | null
  max?: number | null
  step?: number
  name?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  // 小数位数：clamp / commit 时应用，null 表示不处理精度
  precision?: number | null
  // 尺寸：sm | md（默认）| lg
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: '',
  placeholder: '',
  hint: '',
  error: '',
  min: null,
  max: null,
  step: 1,
  name: '',
  required: false,
  disabled: false,
  readonly: false,
  precision: null,
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
  (e: 'change', value: number | null, event?: Event): void
}>()

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'h-8 px-3 text-xs'
  if (props.size === 'lg') return 'h-12 px-5 text-base'
  return 'h-10 px-4 text-sm'
})

const stepperSizeClass = computed(() => (props.size === 'sm' ? 'h-6' : props.size === 'lg' ? 'h-10' : 'h-8'))

const numericValue = computed(() => {
  if (props.modelValue === '' || props.modelValue === null || props.modelValue === undefined) return null
  const parsed = Number(props.modelValue)
  return Number.isFinite(parsed) ? parsed : null
})

/** 应用 precision：四舍五入到指定小数位。 */
function applyPrecision(value: number | null): number | null {
  if (value === null || props.precision === null || props.precision < 0) return value
  const factor = 10 ** props.precision
  return Math.round(value * factor) / factor
}

function clamp(value: number | null): number | null {
  if (value === null) return null
  if (props.min !== null && value < props.min) return applyPrecision(props.min)
  if (props.max !== null && value > props.max) return applyPrecision(props.max)
  return applyPrecision(value)
}

function commit(value: number | null, event?: Event) {
  const next = clamp(value)
  emit('update:modelValue', next)
  emit('change', next, event)
}

function onInput(event: Event) {
  // 输入过程中不 clamp，允许暂时超出范围的中间值（如 min=10 时键入 "1"），失焦时再收敛
  const raw = (event.target as HTMLInputElement).value
  const parsed = raw === '' ? null : Number(raw)
  const next = parsed === null || Number.isFinite(parsed) ? parsed : null
  emit('update:modelValue', next)
  emit('change', next, event)
}

function onBlur(event: Event) {
  const clamped = clamp(numericValue.value)
  if (clamped !== numericValue.value) commit(clamped, event)
}

function stepBy(delta: number, event?: Event) {
  if (props.disabled || props.readonly) return
  commit((numericValue.value ?? 0) + delta * props.step, event)
}
</script>

<template>
  <div>
    <label v-if="label" class="mb-2 block text-sm font-medium text-gray-700 dark:text-white/60">
      {{ label }}<span v-if="required" class="ml-0.5 text-rose-500">*</span>
    </label>
    <div class="relative">
      <input
        :value="modelValue ?? ''"
        type="number"
        :name="name"
        :min="min ?? undefined"
        :max="max ?? undefined"
        :step="step"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="Boolean(error) || undefined"
        class="w-full rounded-lg border bg-white pr-20 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white/[0.03] dark:text-white dark:placeholder-white/25"
        :class="[
          sizeClass,
          error ? 'border-rose-500/50 focus:border-rose-500/50' : 'border-gray-200 focus:border-[rgb(var(--accent-rgb)/0.4)] dark:border-white/[0.08] dark:focus:border-[rgb(var(--accent-rgb)/0.4)]',
        ]"
        @input="onInput"
        @blur="onBlur"
      />
      <div class="absolute right-1 top-1 flex overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-white/[0.08] dark:bg-white/[0.04]" :class="stepperSizeClass">
        <button type="button" class="flex w-8 items-center justify-center text-xs text-slate-500 hover:bg-white dark:text-[#8a8f98] dark:hover:bg-white/[0.06]" :disabled="disabled || readonly" @click="stepBy(-1, $event)">
          <i class="fa-solid fa-minus"></i>
        </button>
        <button type="button" class="flex w-8 items-center justify-center border-l border-gray-200 text-xs text-slate-500 hover:bg-white dark:border-white/[0.08] dark:text-[#8a8f98] dark:hover:bg-white/[0.06]" :disabled="disabled || readonly" @click="stepBy(1, $event)">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
    <BaseFieldMessage v-if="error" :message="error" type="error" />
    <BaseFieldMessage v-else-if="hint" :message="hint" />
  </div>
</template>
