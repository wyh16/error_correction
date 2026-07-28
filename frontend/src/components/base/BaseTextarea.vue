<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import BaseFieldMessage from './BaseFieldMessage.vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  name?: string
  rows?: number | string
  maxlength?: number | string | null
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  resize?: 'vertical' | 'horizontal' | 'none'
  autosize?: boolean
  textareaClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  hint: '',
  error: '',
  name: '',
  rows: 4,
  maxlength: null,
  required: false,
  disabled: false,
  readonly: false,
  resize: 'vertical',
  autosize: false,
  textareaClass: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const countText = computed(() => {
  if (!props.maxlength) return ''
  return `${String(props.modelValue || '').length}/${props.maxlength}`
})

const textareaRef = ref<HTMLTextAreaElement | null>(null)

// autosize：先重置为 auto 再取 scrollHeight，rows 决定的初始高度即最小高度
function resizeToContent() {
  const el = textareaRef.value
  if (!el || !props.autosize) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  resizeToContent()
}

onMounted(resizeToContent)
watch(() => props.modelValue, () => nextTick(resizeToContent))
watch(() => props.autosize, (value) => {
  if (value) nextTick(resizeToContent)
  else if (textareaRef.value) textareaRef.value.style.height = ''
})
</script>

<template>
  <div>
    <div v-if="label || countText" class="mb-2 flex items-center justify-between gap-3">
      <label v-if="label" class="text-sm font-medium text-gray-700 dark:text-white/60">
        {{ label }}<span v-if="required" class="ml-0.5 text-rose-500">*</span>
      </label>
      <span v-if="countText" class="text-xs text-slate-400 dark:text-[#62666d]">{{ countText }}</span>
    </div>
    <textarea
      ref="textareaRef"
      :value="modelValue"
      :name="name"
      :rows="rows"
      :placeholder="placeholder"
      :maxlength="maxlength ?? undefined"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="Boolean(error) || undefined"
      class="w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white/[0.03] dark:text-white dark:placeholder-white/25"
      :class="[
        error ? 'border-rose-500/50 focus:border-rose-500/50' : 'border-gray-200 focus:border-[rgb(var(--accent-rgb)/0.4)] dark:border-white/[0.08] dark:focus:border-[rgb(var(--accent-rgb)/0.4)]',
        autosize ? 'resize-none overflow-hidden' : resize === 'none' ? 'resize-none' : resize === 'horizontal' ? 'resize-x' : 'resize-y',
        textareaClass,
      ]"
      @input="onInput"
    ></textarea>
    <BaseFieldMessage v-if="error" :message="error" type="error" />
    <BaseFieldMessage v-else-if="hint" :message="hint" />
  </div>
</template>
