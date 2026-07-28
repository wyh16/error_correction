<script setup lang="ts">
/**
 * BaseForm.vue
 * 表单容器：布局 / 禁用 / 加载遮罩 + 精简校验体系。
 * 通过 model + rules 描述校验规则，BaseFormItem 以 name 关联字段，
 * 校验状态经 provide/inject 下发，失败时由 BaseFormItem 自动展示错误消息。
 */
import { provide, reactive } from 'vue'

export interface FormRule {
  required?: boolean
  message?: string
  trigger?: 'blur' | 'change'
  validator?: (value: unknown) => boolean | string | Promise<boolean | string>
}

export interface BaseFormContext {
  getModel: () => Record<string, unknown> | null
  getRules: (name: string) => FormRule[]
  errors: Record<string, string>
  validateField: (name: string) => Promise<boolean>
  clearValidate: (name?: string) => void
}

interface Props {
  disabled?: boolean
  loading?: boolean
  layout?: 'vertical' | 'horizontal'
  gap?: string
  // 校验的数据对象，字段名与 BaseFormItem 的 name 对应
  model?: Record<string, unknown> | null
  // 每个字段的校验规则列表
  rules?: Record<string, FormRule[]>
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  layout: 'vertical',
  gap: 'gap-4',
  model: null,
  rules: () => ({}),
})

const emit = defineEmits<{
  (e: 'submit', event: Event): void
}>()

// 保持既有注入协议：BaseFormItem 等通过 'baseForm' 读取 layout / disabled
provide('baseForm', props)

// ── 校验体系 ──────────────────────────────────────────────
const errors = reactive<Record<string, string>>({})

// setup 时对 model 做一次快照，resetFields 用于还原初始值
function snapshot(source: Record<string, unknown> | null): Record<string, unknown> {
  if (!source) return {}
  try {
    return JSON.parse(JSON.stringify(source))
  } catch {
    return { ...source }
  }
}
const initialModel = snapshot(props.model)

function isEmpty(value: unknown) {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  return false
}

/** 校验单个字段：按规则顺序执行，遇到第一条失败即记录错误并返回 false。 */
async function validateField(name: string): Promise<boolean> {
  const fieldRules = props.rules?.[name] || []
  const value = props.model ? props.model[name] : undefined
  for (const rule of fieldRules) {
    if (rule.required && isEmpty(value)) {
      errors[name] = rule.message || '该字段为必填项'
      return false
    }
    if (rule.validator) {
      let result: boolean | string
      try {
        result = await rule.validator(value)
      } catch (err) {
        result = err instanceof Error ? err.message : false
      }
      if (result === false) {
        errors[name] = rule.message || '校验未通过'
        return false
      }
      if (typeof result === 'string' && result) {
        errors[name] = result
        return false
      }
    }
  }
  delete errors[name]
  return true
}

/** 校验 rules 中声明的全部字段，全部通过才返回 true。 */
async function validate(): Promise<boolean> {
  const names = Object.keys(props.rules || {})
  const results = await Promise.all(names.map(name => validateField(name)))
  return results.every(Boolean)
}

/** 清除校验状态：传 name 只清除单个字段，不传清除全部。 */
function clearValidate(name?: string) {
  if (name) {
    delete errors[name]
    return
  }
  Object.keys(errors).forEach(key => delete errors[key])
}

/** 将 model 还原为挂载时的初始值并清除全部校验状态。 */
function resetFields() {
  if (props.model) {
    Object.keys(props.model).forEach(key => {
      props.model![key] = key in initialModel ? initialModel[key] : undefined
    })
  }
  clearValidate()
}

provide<BaseFormContext>('baseFormContext', {
  getModel: () => props.model,
  getRules: (name: string) => props.rules?.[name] || [],
  errors,
  validateField,
  clearValidate,
})

defineExpose({ validate, validateField, resetFields, clearValidate })

function submit(event: Event) {
  if (props.disabled || props.loading) return
  emit('submit', event)
}
</script>

<template>
  <form
    class="relative grid"
    :class="[gap, 'grid-cols-1']"
    @submit.prevent="submit"
  >
    <fieldset class="contents" :disabled="disabled || loading">
      <slot />
    </fieldset>
    <div v-if="loading" class="pointer-events-none absolute inset-0 rounded-xl bg-white/30 backdrop-blur-[1px] dark:bg-black/10"></div>
  </form>
</template>
