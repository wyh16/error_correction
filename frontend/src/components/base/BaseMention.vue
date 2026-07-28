<script setup lang="ts">
/**
 * BaseMention.vue
 * @ 提及输入：textarea 中输入触发字符后弹出建议面板，支持键盘选择。
 */
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  // { value, label }
  options: { type: Array, default: () => [] },
  // 触发字符，如 '@' 或 '#'
  trigger: { type: String, default: '@' },
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 3 },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'select'])

const textareaRef = ref(null)
const itemRefs = ref([])
const panelOpen = ref(false)
const queryText = ref('')
// 当前提及片段中 trigger 字符的位置，选中时用于替换文本
const triggerStart = ref(0)
const activeIndex = ref(0)
// Escape 主动关闭后置位；避免紧随的 keyup 重新触发检测把面板弹回来
const dismissed = ref(false)
let blurTimer = null

const filteredOptions = computed(() => {
  const query = queryText.value.toLowerCase()
  if (!query) return props.options
  return props.options.filter(
    option => String(option.label).toLowerCase().includes(query) || String(option.value).toLowerCase().includes(query),
  )
})

// 无匹配时直接隐藏面板
const panelVisible = computed(() => panelOpen.value && filteredOptions.value.length > 0)

function setItemRef(el, index) {
  if (el) itemRefs.value[index] = el
}

function closePanel() {
  panelOpen.value = false
}

/**
 * 从光标位置向前扫描最近的 trigger 字符：
 * - trigger 必须位于文首或空白之后，避免把邮箱里的 @ 误判为提及；
 * - trigger 到光标之间不能有空白，出现空白说明这段提及已经结束。
 * 直接读 el.value 而不是 props.modelValue，规避 v-model 回流的时序差。
 */
function detectMention() {
  const el = textareaRef.value
  if (!el || props.disabled || dismissed.value) return
  const caret = el.selectionStart == null ? el.value.length : el.selectionStart
  const before = String(el.value).slice(0, caret)
  const triggerIndex = before.lastIndexOf(props.trigger)
  if (triggerIndex < 0) return closePanel()
  const prevChar = triggerIndex > 0 ? before[triggerIndex - 1] : ''
  if (prevChar && !/\s/.test(prevChar)) return closePanel()
  const query = before.slice(triggerIndex + props.trigger.length)
  if (/\s/.test(query)) return closePanel()
  // query 变化才重置高亮，避免方向键的 keyup 把选中项打回第一个
  if (!panelOpen.value || query !== queryText.value) activeIndex.value = 0
  queryText.value = query
  triggerStart.value = triggerIndex
  panelOpen.value = true
}

function onInput(event) {
  dismissed.value = false
  emit('update:modelValue', event.target.value)
  detectMention()
}

function onClick() {
  dismissed.value = false
  detectMention()
}

function moveActive(delta) {
  const total = filteredOptions.value.length
  if (!total) return
  activeIndex.value = (activeIndex.value + delta + total) % total
  nextTick(() => {
    const el = itemRefs.value[activeIndex.value]
    if (el) el.scrollIntoView({ block: 'nearest' })
  })
}

function onKeydown(event) {
  if (!panelVisible.value) return
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const option = filteredOptions.value[activeIndex.value]
    if (option) selectOption(option)
  } else if (event.key === 'Escape') {
    dismissed.value = true
    closePanel()
  }
}

// 把 trigger+query 替换为 trigger+label+空格，并把光标移到插入内容之后
function selectOption(option) {
  const el = textareaRef.value
  if (!el) return
  const caret = el.selectionStart == null ? el.value.length : el.selectionStart
  const insert = props.trigger + option.label + ' '
  const next = String(el.value).slice(0, triggerStart.value) + insert + String(el.value).slice(caret)
  emit('update:modelValue', next)
  emit('select', option)
  closePanel()
  // 等 v-model 回流渲染新文本后再设置光标，否则位置会被旧值刷掉
  nextTick(() => {
    const pos = triggerStart.value + insert.length
    el.focus()
    el.setSelectionRange(pos, pos)
  })
}

// blur 延迟关闭，给面板内点击留出落点时间（面板项 mousedown.prevent 是主保险）
function onBlur() {
  blurTimer = window.setTimeout(closePanel, 150)
}

function onFocus() {
  if (blurTimer) {
    clearTimeout(blurTimer)
    blurTimer = null
  }
}

onBeforeUnmount(() => {
  if (blurTimer) clearTimeout(blurTimer)
})
</script>

<template>
  <!--
    简化取舍：建议面板绝对定位在 textarea 正下方，不做光标像素级跟随。
    像素级跟随需要镜像元素测量文本宽度，复杂度高且收益有限。
  -->
  <div class="relative">
    <textarea
      ref="textareaRef"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[rgb(var(--accent-rgb)/0.4)] focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white dark:placeholder-white/25 dark:focus:border-[rgb(var(--accent-rgb)/0.4)]"
      @input="onInput"
      @click="onClick"
      @keydown="onKeydown"
      @keyup="detectMention"
      @blur="onBlur"
      @focus="onFocus"
    ></textarea>

    <div
      v-if="panelVisible"
      class="absolute left-0 top-full z-50 mt-1 min-w-48 rounded-lg border border-slate-200 bg-white/95 p-1.5 shadow-lg shadow-slate-200/60 dark:border-white/[0.08] dark:bg-[#1f1f22] dark:shadow-black/40"
    >
      <ul class="no-scrollbar max-h-56 space-y-0.5 overflow-y-auto">
        <li v-for="(option, index) in filteredOptions" :key="option.value">
          <button
            :ref="el => setItemRef(el, index)"
            type="button"
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
            :class="index === activeIndex ? 'accent-bg-soft accent-text' : 'text-slate-600 dark:text-[#d0d6e0]'"
            @mousedown.prevent
            @mouseenter="activeIndex = index"
            @click="selectOption(option)"
          >
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold accent-soft">
              {{ String(option.label).slice(0, 1) }}
            </span>
            <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
            <span class="shrink-0 text-xs text-slate-400 dark:text-[#62666d]">{{ option.value }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
