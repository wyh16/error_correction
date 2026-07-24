<script setup lang="ts">
/**
 * BaseLink.vue
 * 文字链接：语义配色 + 下划线策略，支持前置图标、外链标识与禁用态。
 */
const props = defineProps({
  href: { type: String, default: '' },
  // default | accent | success | warning | danger
  type: { type: String, default: 'default' },
  // hover | always | never
  underline: { type: String, default: 'hover' },
  disabled: { type: Boolean, default: false },
  // 前置图标，如 'fa-link'
  icon: { type: String, default: '' },
  // 外链：新窗口打开并附加右上箭头标识
  external: { type: Boolean, default: false },
})

const typeClass = {
  default: 'text-slate-700 hover:text-slate-950 dark:text-[#d0d6e0] dark:hover:text-white',
  accent: 'accent-text hover:opacity-80',
  success: 'text-emerald-600 hover:text-emerald-500 dark:text-emerald-400',
  warning: 'text-amber-600 hover:text-amber-500 dark:text-amber-400',
  danger: 'text-rose-600 hover:text-rose-500 dark:text-rose-400',
}

const underlineClass = {
  always: 'underline underline-offset-4',
  hover: 'hover:underline underline-offset-4',
  never: '',
}

/** 禁用态拦截跳转；正常态交给浏览器默认行为与外部监听。 */
function handleClick(event) {
  if (props.disabled) event.preventDefault()
}
</script>

<template>
  <a
    :href="!props.disabled && props.href ? props.href : undefined"
    :target="!props.disabled && props.external ? '_blank' : undefined"
    :rel="!props.disabled && props.external ? 'noopener noreferrer' : undefined"
    :aria-disabled="props.disabled ? 'true' : undefined"
    :tabindex="props.disabled ? -1 : undefined"
    class="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
    :class="[
      typeClass[props.type] || typeClass.default,
      underlineClass[props.underline] ?? underlineClass.hover,
      props.disabled ? 'cursor-not-allowed opacity-50 hover:no-underline' : 'cursor-pointer',
    ]"
    @click="handleClick"
  >
    <i v-if="props.icon" class="fa-solid text-xs" :class="props.icon"></i>
    <slot />
    <i v-if="props.external" class="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"></i>
  </a>
</template>
