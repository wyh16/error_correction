<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  icon?: string
  iconClass?: string
  to?: RouteLocationRaw
  href?: string
  onClick?: (item: BreadcrumbItem) => void
}

interface Props {
  items?: BreadcrumbItem[]
  separator?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  separator: '',
})

function isCurrent(index: number, items: BreadcrumbItem[]) {
  return index === items.length - 1
}

/** 渲染标签优先级：to > href > onClick > 纯文本；末项始终为纯文本。 */
function tagOf(item: BreadcrumbItem, index: number, items: BreadcrumbItem[]) {
  if (isCurrent(index, items)) return 'span'
  if (item.to !== undefined) return 'RouterLink'
  if (item.href) return 'a'
  if (typeof item.onClick === 'function') return 'button'
  return 'span'
}

function isInteractive(item: BreadcrumbItem, index: number, items: BreadcrumbItem[]) {
  return tagOf(item, index, items) !== 'span'
}

function activateItem(item: BreadcrumbItem, index: number, items: BreadcrumbItem[]) {
  // to/href 交给 RouterLink / a 默认跳转；仅 button 情况调用 onClick
  if (tagOf(item, index, items) === 'button' && typeof item.onClick === 'function') item.onClick(item)
}
</script>

<template>
  <nav class="flex min-w-0 items-center gap-2 text-sm" aria-label="Breadcrumb">
    <template v-for="(item, index) in props.items" :key="`${item.label}-${index}`">
      <component
        :is="tagOf(item, index, props.items) === 'RouterLink' ? RouterLink : tagOf(item, index, props.items)"
        :type="tagOf(item, index, props.items) === 'button' ? 'button' : undefined"
        :to="tagOf(item, index, props.items) === 'RouterLink' ? item.to : undefined"
        :href="tagOf(item, index, props.items) === 'a' ? item.href : undefined"
        class="inline-flex min-w-0 items-center gap-2 rounded-md outline-none transition-colors"
        :class="[
          isCurrent(index, props.items)
            ? 'text-gray-900 dark:text-[#f7f8f8]'
            : 'text-gray-500 dark:text-[#8a8f98]',
          isInteractive(item, index, props.items)
            ? 'cursor-pointer hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.45)] dark:hover:text-[#f7f8f8]'
            : ''
        ]"
        @click="activateItem(item, index, props.items)"
      >
        <i v-if="item.icon" class="fa-solid shrink-0 text-xs" :class="[item.icon, item.iconClass]"></i>
        <span
          class="min-w-0 truncate"
          :class="isCurrent(index, props.items) ? 'font-semibold' : 'font-medium'"
        >
          {{ item.label }}
        </span>
      </component>
      <span
        v-if="index < props.items.length - 1 && props.separator"
        class="shrink-0 text-xs text-gray-400 dark:text-[#62666d]"
        aria-hidden="true"
      >{{ props.separator }}</span>
      <i
        v-else-if="index < props.items.length - 1"
        class="fa-solid fa-chevron-right shrink-0 text-[9px] text-gray-400 dark:text-[#62666d]"
      ></i>
    </template>
  </nav>
</template>
