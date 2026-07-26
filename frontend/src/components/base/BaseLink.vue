<script setup lang="ts">
/**
 * BaseLink.vue
 * 文字链接：语义配色 + 下划线策略，支持前置图标、外链标识与禁用态。
 * 传入 to 时渲染为 RouterLink（优先级 to > href）。
 */
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

interface Props {
  href?: string
  // 站内路由：传入后渲染 RouterLink，优先级高于 href
  to?: RouteLocationRaw
  type?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
  underline?: 'hover' | 'always' | 'never'
  disabled?: boolean
  // 前置图标，如 'fa-link'
  icon?: string
  // 外链：新窗口打开并附加右上箭头标识
  external?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  href: '',
  to: undefined,
  type: 'default',
  underline: 'hover',
  disabled: false,
  icon: '',
  external: false,
})

const typeClass: Record<NonNullable<Props['type']>, string> = {
  default: 'text-slate-700 hover:text-slate-950 dark:text-[#d0d6e0] dark:hover:text-white',
  accent: 'accent-text hover:opacity-80',
  success: 'text-emerald-600 hover:text-emerald-500 dark:text-emerald-400',
  warning: 'text-amber-600 hover:text-amber-500 dark:text-amber-400',
  danger: 'text-rose-600 hover:text-rose-500 dark:text-rose-400',
}

const underlineClass: Record<NonNullable<Props['underline']>, string> = {
  always: 'underline underline-offset-4',
  hover: 'hover:underline underline-offset-4',
  never: '',
}

const isRouterLink = computed(() => !props.disabled && props.to !== undefined)

/** 禁用态拦截跳转；正常态交给浏览器默认行为与外部监听。 */
function handleClick(event: MouseEvent) {
  if (props.disabled) event.preventDefault()
}
</script>

<template>
  <component
    :is="isRouterLink ? RouterLink : 'a'"
    :to="isRouterLink ? props.to : undefined"
    :href="!isRouterLink && !props.disabled && props.href ? props.href : undefined"
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
  </component>
</template>
