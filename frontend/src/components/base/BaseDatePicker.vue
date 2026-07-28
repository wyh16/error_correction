<script setup lang="ts">
/**
 * BaseDatePicker.vue
 * 日期选择器：输入框样式触发器 + 自定义日历弹层（复用 BaseCalendar）
 * 不使用原生 input[type=date]，保证浅色/深色主题下弹出日历风格统一
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseCalendar from './BaseCalendar.vue'
import BaseFieldMessage from './BaseFieldMessage.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  name: { type: String, default: '' },
  min: { type: String, default: '' },
  max: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'change'])

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)

const showClear = computed(() => props.clearable && Boolean(props.modelValue) && !props.disabled)

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function select(value: string, date: Date) {
  emit('update:modelValue', value)
  emit('change', value, date)
  open.value = false
}

function clear() {
  emit('update:modelValue', '')
  emit('change', '', null)
}

// 点击组件外部时收起弹层（弹层与触发器都在 rootRef 内）
function onPointerDown(event: PointerEvent) {
  if (!open.value) return
  const target = event.target as Node | null
  if (rootRef.value && target && !rootRef.value.contains(target)) open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <div ref="rootRef" @keydown="onKeydown">
    <label v-if="label" class="mb-2 block text-sm font-medium text-gray-700 dark:text-white/60">
      {{ label }}<span v-if="required" class="ml-0.5 text-rose-500">*</span>
    </label>
    <div class="group relative">
      <button
        type="button"
        :disabled="disabled"
        aria-haspopup="dialog"
        :aria-expanded="open"
        :aria-invalid="Boolean(error) || undefined"
        class="flex h-10 w-full items-center rounded-lg border bg-white px-4 pr-10 text-left text-sm outline-none transition-all focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white/[0.03]"
        :class="error
          ? 'border-rose-500/50 focus:border-rose-500/50'
          : open
            ? 'border-[rgb(var(--accent-rgb)/0.4)]'
            : 'border-gray-200 focus:border-[rgb(var(--accent-rgb)/0.4)] dark:border-white/[0.08] dark:focus:border-[rgb(var(--accent-rgb)/0.4)]'"
        @click="toggle"
      >
        <span :class="modelValue ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-[#62666d]'">
          {{ modelValue || placeholder || '选择日期' }}
        </span>
      </button>

      <!-- 有值且可清除时，悬停将日历图标替换为清除按钮 -->
      <i
        class="fa-solid fa-calendar-days pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-[#62666d]"
        :class="{ 'group-hover:hidden': showClear }"
      ></i>
      <button
        v-if="showClear"
        type="button"
        aria-label="清除日期"
        class="absolute right-3 top-1/2 hidden -translate-y-1/2 text-xs text-slate-400 transition-colors hover:text-slate-600 group-hover:block dark:text-[#62666d] dark:hover:text-[#d0d6e0]"
        @click.stop="clear"
      >
        <i class="fa-solid fa-circle-xmark"></i>
      </button>

      <!-- 表单提交场景下携带字段值 -->
      <input v-if="name" type="hidden" :name="name" :value="modelValue" :required="required" />

      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <div
          v-if="open"
          role="dialog"
          class="absolute left-0 top-full z-[70] mt-2 w-72 rounded-xl bg-white shadow-xl shadow-black/10 dark:bg-[#1b1b1f] dark:shadow-black/40"
        >
          <BaseCalendar :model-value="modelValue" :min="min" :max="max" @change="select" />
        </div>
      </Transition>
    </div>
    <BaseFieldMessage v-if="error" :message="error" type="error" />
    <BaseFieldMessage v-else-if="hint" :message="hint" />
  </div>
</template>
