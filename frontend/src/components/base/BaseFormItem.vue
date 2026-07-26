<script setup lang="ts">
/**
 * BaseFormItem.vue
 * 表单项：label / hint / error 布局，配合 BaseForm 的 model + rules 时
 * 通过 name 关联字段规则，blur / change 触发校验并自动展示错误消息。
 */
import { computed, inject, watch } from 'vue'
import BaseFieldMessage from './BaseFieldMessage.vue'
import type { BaseFormContext } from './BaseForm.vue'

interface Props {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  forId?: string
  layout?: '' | 'vertical' | 'horizontal'
  // 关联 BaseForm rules 的字段名；配合 model 使用时自动校验
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  hint: '',
  error: '',
  required: false,
  forId: '',
  layout: '',
  name: '',
})

const form = inject<{ layout?: string } | null>('baseForm', null)
const formContext = inject<BaseFormContext | null>('baseFormContext', null)
const resolvedLayout = computed(() => props.layout || form?.layout || 'vertical')

const fieldRules = computed(() => (props.name && formContext ? formContext.getRules(props.name) : []))

/** 有 required 规则时自动显示星号，无需重复传 required prop。 */
const isRequired = computed(() => props.required || fieldRules.value.some(rule => rule.required))

/** 显式 error prop 优先，其次取 BaseForm 校验产生的错误。 */
const resolvedError = computed(() => {
  if (props.error) return props.error
  if (props.name && formContext) return formContext.errors[props.name] || ''
  return ''
})

function rulesFor(trigger: 'blur' | 'change') {
  // 未声明 trigger 的规则在 blur 与 change 时都参与校验
  return fieldRules.value.filter(rule => !rule.trigger || rule.trigger === trigger)
}

// change 触发：监听 model 中字段值变化
watch(
  () => (props.name && formContext ? formContext.getModel()?.[props.name] : undefined),
  () => {
    if (!props.name || !formContext) return
    if (rulesFor('change').length) formContext.validateField(props.name)
  },
)

// blur 触发：利用 focusout 冒泡，捕获插槽内任意控件的失焦
function onFocusOut() {
  if (!props.name || !formContext) return
  if (rulesFor('blur').length) formContext.validateField(props.name)
}
</script>

<template>
  <div
    class="min-w-0"
    :class="resolvedLayout === 'horizontal' ? 'grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-start' : ''"
  >
    <div v-if="label || hint" :class="resolvedLayout === 'horizontal' ? 'pt-2' : 'mb-2'">
      <label
        v-if="label"
        class="block text-sm font-medium text-gray-700 dark:text-white/60"
        :for="forId || undefined"
      >
        {{ label }}<span v-if="isRequired" class="ml-0.5 text-rose-500">*</span>
      </label>
      <p v-if="hint && resolvedLayout === 'horizontal'" class="mt-1 text-xs leading-5 text-slate-500 dark:text-[#8a8f98]">
        {{ hint }}
      </p>
    </div>

    <div class="min-w-0" @focusout="onFocusOut">
      <slot :invalid="Boolean(resolvedError)" />
      <BaseFieldMessage v-if="resolvedError" :message="resolvedError" type="error" />
      <BaseFieldMessage v-else-if="hint && resolvedLayout !== 'horizontal'" :message="hint" />
    </div>
  </div>
</template>
