<script setup lang="ts">
/**
 * BaseTagsInput.vue
 * 标签输入框：在类 BaseInput 的外框内展示已有标签，回车或逗号提交新标签。
 */
import { ref, computed } from 'vue'

interface Props {
  // 标签数组（字符串）
  modelValue?: string[]
  placeholder?: string
  disabled?: boolean
  // 最大标签数，0 表示不限制；达到上限后隐藏内部输入框
  max?: number
  // 是否允许重复标签，false 时重复输入只清空输入框
  allowDuplicates?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: '',
  disabled: false,
  max: 0,
  allowDuplicates: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'add', tag: string): void
  (e: 'remove', tag: string): void
}>()

const inputEl = ref<HTMLInputElement | null>(null)
const inputText = ref('')

/** 达到 max 上限后隐藏输入框，只保留已有标签的删除能力。 */
const reachedMax = computed(() => props.max > 0 && props.modelValue.length >= props.max)

function focusInput() {
  if (props.disabled) return
  inputEl.value?.focus()
}

/** 提交当前输入：去空格、忽略空串；重复且不允许时只清空输入框。 */
function commitInput() {
  const tag = inputText.value.trim()
  inputText.value = ''
  if (!tag || reachedMax.value) return
  if (!props.allowDuplicates && props.modelValue.includes(tag)) return
  emit('update:modelValue', [...props.modelValue, tag])
  emit('add', tag)
}

function removeTag(tag: string) {
  if (props.disabled) return
  const index = props.modelValue.indexOf(tag)
  if (index === -1) return
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
  emit('remove', tag)
}

/** 回车/逗号提交标签；输入框为空时按退格删除最后一个标签。 */
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    commitInput()
    return
  }
  if (event.key === 'Backspace' && inputText.value === '' && props.modelValue.length) {
    removeTag(props.modelValue[props.modelValue.length - 1])
  }
}
</script>

<template>
  <div
    class="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 transition-all dark:bg-white/[0.03]"
    :class="[
      'border-gray-200 dark:border-white/[0.08]',
      props.disabled
        ? 'cursor-not-allowed opacity-60'
        : 'cursor-text focus-within:border-[rgb(var(--accent-rgb)/0.4)] dark:focus-within:border-[rgb(var(--accent-rgb)/0.4)]',
    ]"
    @click="focusInput"
  >
    <span
      v-for="(tag, index) in props.modelValue"
      :key="`${tag}-${index}`"
      class="accent-bg-soft accent-text accent-border inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold leading-none"
    >
      <span class="truncate">{{ tag }}</span>
      <button
        v-if="!props.disabled"
        type="button"
        tabindex="-1"
        class="-mr-0.5 inline-flex shrink-0 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"
        @click.stop="removeTag(tag)"
      >
        <i class="fa-solid fa-xmark text-[10px]"></i>
      </button>
    </span>

    <!-- 达到 max 上限后隐藏输入框；无边框透明背景，视觉上融入外层字段 -->
    <input
      v-if="!reachedMax"
      ref="inputEl"
      v-model="inputText"
      type="text"
      :placeholder="props.modelValue.length ? '' : props.placeholder"
      :disabled="props.disabled"
      class="h-6 min-w-[80px] flex-1 border-none bg-transparent text-sm text-gray-900 outline-none placeholder-gray-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed dark:text-white dark:placeholder-white/25"
      @keydown="onKeydown"
    />
  </div>
</template>
