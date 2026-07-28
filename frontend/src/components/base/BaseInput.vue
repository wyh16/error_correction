<script setup lang="ts">
/**
 * BaseInput.vue
 * 基础输入框组件（支持密码显隐、错误高亮、禁用、前后置图标、一键清空、右侧附加元素）
 */
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string | number
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  autocomplete?: string
  maxlength?: string | number | null
  inputmode?: 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  inputClass?: string
  error?: boolean
  // 是否禁用输入
  disabled?: boolean
  // 是否只读
  readonly?: boolean
  // 有内容时悬停显示清空按钮，点击后清空并回抛空字符串
  clearable?: boolean
  // 前置 / 后置图标，传 fa-* 类名，如 'fa-user'
  prefixIcon?: string
  suffixIcon?: string
  // 是否启用浏览器拼写检查
  spellcheck?: boolean
  // 尺寸：sm | md（默认）| lg
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  type: 'text',
  placeholder: '',
  required: false,
  autocomplete: 'off',
  maxlength: null,
  inputmode: 'text',
  inputClass: '',
  error: false,
  disabled: false,
  readonly: false,
  clearable: false,
  prefixIcon: '',
  suffixIcon: '',
  spellcheck: true,
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'clear'): void
}>()

const showPwd = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPwd.value ? 'text' : 'password'
  }
  return props.type
})

/** 清空按钮：仅在开启 clearable、未禁用且有内容时出现。 */
const showClear = computed(() => {
  return props.clearable && !props.disabled && props.modelValue !== '' && props.modelValue !== null
})

/** 尺寸层只控制几何信息，颜色和状态样式保持共用。 */
const sizeClass = computed(() => {
  if (props.size === 'sm') return 'h-8 px-3 rounded-md text-xs'
  if (props.size === 'lg') return 'h-12 px-5 rounded-lg text-base'
  return 'h-10 px-4 rounded-lg text-sm'
})

/**
 * 根据两侧附加元素计算输入框内边距：
 * - 前置图标占据左侧空间
 * - 密码眼睛 / 清空按钮 / 后置图标占据右侧空间（可能同时存在两个）
 */
const paddingClass = computed(() => {
  const classes = []
  if (props.prefixIcon) classes.push(props.size === 'sm' ? 'pl-8' : 'pl-10')
  const rightCount = (props.type === 'password' ? 1 : 0) + (props.clearable ? 1 : 0) + (props.suffixIcon ? 1 : 0)
  if (rightCount >= 2) classes.push('pr-14')
  else if (rightCount === 1) classes.push(props.type === 'password' ? 'pr-11' : 'pr-9')
  return classes.join(' ')
})

const clearValue = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2 transition-colors">{{ label }}</label>
    <div :class="['relative', { 'flex gap-2': $slots.append }]">
      <div class="group relative flex-1 min-w-0">
        <!-- 前置图标 -->
        <i
          v-if="prefixIcon"
          class="fa-solid pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25"
          :class="[prefixIcon, size === 'sm' ? 'left-3 text-[11px]' : 'left-3.5 text-xs']"
        ></i>
        <input
          :value="modelValue"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          :type="inputType"
          :required="required"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :maxlength="maxlength ?? undefined"
          :inputmode="inputmode"
          :disabled="disabled"
          :readonly="readonly"
          :spellcheck="spellcheck"
          data-gramm="false"
          :class="[
            'w-full border bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:ring-0 focus:ring-offset-0 transition-all outline-none [&::-ms-reveal]:hidden [&::-ms-clear]:hidden',
            sizeClass,
            error ? 'border-rose-500/50 focus:border-rose-500/50' : 'border-gray-200 dark:border-white/[0.08] focus:border-[rgb(var(--accent-rgb)/0.4)] dark:focus:border-[rgb(var(--accent-rgb)/0.4)]',
            disabled ? 'cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-white/[0.02] dark:text-white/30' : '',
            paddingClass,
            inputClass
          ]"
        />
        <!-- 右侧附加区：清空按钮（悬停出现）、后置图标、密码显隐按钮 -->
        <div class="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
          <button
            v-if="showClear"
            type="button"
            tabindex="-1"
            @click="clearValue"
            class="text-gray-400 opacity-0 transition-all hover:text-gray-600 group-hover:opacity-100 group-focus-within:opacity-100 dark:text-white/25 dark:hover:text-white/50"
          >
            <i class="fa-solid fa-circle-xmark text-xs"></i>
          </button>
          <i
            v-if="suffixIcon"
            class="fa-solid pointer-events-none text-gray-400 dark:text-white/25"
            :class="[suffixIcon, size === 'sm' ? 'text-[11px]' : 'text-xs']"
          ></i>
          <button
            v-if="type === 'password'"
            type="button"
            @click="showPwd = !showPwd"
            class="text-gray-400 hover:text-gray-600 dark:text-white/25 dark:hover:text-white/50 transition-colors"
          >
            <i :class="showPwd ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-xs"></i>
          </button>
        </div>
      </div>
      <slot name="append" />
    </div>
  </div>
</template>
