<script setup lang="ts">
/**
 * BasePinInput.vue
 * 分段验证码输入框：逐格输入自动跳格，支持粘贴分配与掩码显示。
 */
import { nextTick, ref, watch } from 'vue'

interface Props {
  modelValue?: string
  length?: number
  // number 模式过滤非数字并唤起数字键盘，text 模式接受任意字符
  type?: 'number' | 'text'
  // 掩码显示（input type=password），用于安全码场景
  masked?: boolean
  disabled?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  length: 6,
  type: 'number',
  masked: false,
  disabled: false,
  error: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'complete', value: string): void
}>()

// 每格一个字符作为内部状态，modelValue 由各格拼接而来
const chars = ref(Array.from({ length: props.length }, () => ''))
const inputRefs = ref<HTMLInputElement[]>([])

function setInputRef(el: unknown, index: number) {
  if (el) inputRefs.value[index] = el as HTMLInputElement
}

function sanitize(text: unknown) {
  const raw = String(text || '')
  return props.type === 'number' ? raw.replace(/\D/g, '') : raw
}

// 外部 modelValue 变化（含清空）或 length 变化时同步回格子，保证受控用法可用
watch(
  () => [props.modelValue, props.length],
  () => {
    if (chars.value.join('') === props.modelValue && chars.value.length === props.length) return
    const next = sanitize(props.modelValue).slice(0, props.length).split('')
    chars.value = Array.from({ length: props.length }, (_, i) => next[i] || '')
  },
  { immediate: true },
)

function commit() {
  const value = chars.value.join('')
  emit('update:modelValue', value)
  // 所有格子都有字符才视为输入完成
  if (chars.value.every(char => char !== '')) emit('complete', value)
}

function focusAt(index: number) {
  const el = inputRefs.value[Math.min(Math.max(index, 0), props.length - 1)]
  if (!el) return
  el.focus()
  // 聚焦后全选已有字符，直接输入即可覆盖
  nextTick(() => el.select())
}

function onInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const raw = target.value
  const clean = sanitize(raw)
  if (raw && !clean) {
    // 输入的全是非法字符（number 模式下的字母等）：还原当前格，不改动状态
    target.value = chars.value[index]
    return
  }
  // 优先取 event.data（本次敲入的字符）：光标落在旧字符前输入时，
  // 单看 DOM 值的末位会误取旧字符；没有 data（删除等）再回退到末位
  const data = (event as InputEvent).data
  const typed = data ? sanitize(data) : ''
  const char = typed ? typed.slice(-1) : clean.slice(-1)
  chars.value[index] = char
  target.value = char
  if (char && index < props.length - 1) focusAt(index + 1)
  commit()
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    event.preventDefault()
    if (chars.value[index]) {
      chars.value[index] = ''
    } else if (index > 0) {
      // 空格子按退格：回跳上一格并清掉它，符合验证码输入习惯
      chars.value[index - 1] = ''
      focusAt(index - 1)
    }
    commit()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusAt(index - 1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusAt(index + 1)
  }
}

function onPaste(index: number, event: ClipboardEvent) {
  event.preventDefault()
  const text = sanitize(event.clipboardData ? event.clipboardData.getData('text') : '')
  if (!text) return
  // 从当前格开始逐格分配，超出的字符直接丢弃
  const source = text.split('')
  for (let i = index; i < props.length && source.length; i += 1) {
    chars.value[i] = source.shift()!
  }
  focusAt(index + text.length)
  commit()
}
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <!-- maxlength=2 允许"已有字符时再敲一个键"产生瞬时两字符，input 事件里取末位实现覆盖输入 -->
    <input
      v-for="(char, index) in chars"
      :key="index"
      :ref="el => setInputRef(el, index)"
      :value="char"
      :type="masked ? 'password' : 'text'"
      :inputmode="type === 'number' ? 'numeric' : 'text'"
      autocomplete="one-time-code"
      maxlength="2"
      :disabled="disabled"
      :aria-label="'第 ' + (index + 1) + ' 位'"
      :aria-invalid="error || undefined"
      class="h-10 w-10 rounded-lg border bg-white/80 text-center text-base font-bold text-slate-900 outline-none transition-colors focus:border-[rgb(var(--accent-rgb)/0.5)] focus:ring-2 focus:ring-[rgb(var(--accent-rgb)/0.25)] dark:bg-white/[0.045] dark:text-[#f7f8f8]"
      :class="[
        error ? 'border-rose-500/60' : 'border-slate-200 dark:border-white/[0.08]',
        disabled ? 'cursor-not-allowed opacity-50' : '',
      ]"
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
      @paste="onPaste(index, $event)"
      @focus="$event.target.select()"
    />
  </div>
</template>
