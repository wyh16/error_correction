<script lang="ts">
/** 列表项：对象时可带 id / label，也允许原始值（字符串等）直接渲染 */
export type VirtualListItem = { id?: string | number; label?: string; [key: string]: unknown } | string | number
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  items?: VirtualListItem[]
  itemHeight?: number
  height?: number
  overscan?: number
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  itemHeight: 44,
  height: 280,
  overscan: 4,
})

const scrollTop = ref(0)

const visibleRange = computed(() => {
  const start = Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.overscan)
  const count = Math.ceil(props.height / props.itemHeight) + props.overscan * 2
  const end = Math.min(props.items.length, start + count)
  return { start, end }
})

const visibleItems = computed(() =>
  props.items.slice(visibleRange.value.start, visibleRange.value.end).map((item, index) => ({
    item,
    index: visibleRange.value.start + index,
  })),
)

function itemKey(item: VirtualListItem, index: number): string | number {
  if (typeof item === 'object' && item !== null && item.id !== undefined) return item.id
  return index
}

function itemLabel(item: VirtualListItem): unknown {
  if (typeof item === 'object' && item !== null) return item.label ?? item
  return item
}

function onScroll(event: Event) {
  scrollTop.value = (event.target as HTMLElement).scrollTop
}
</script>

<template>
  <div class="overflow-auto rounded-xl border border-slate-200 bg-white/70 custom-scrollbar dark:border-white/[0.08] dark:bg-white/[0.025]" :style="{ height: `${height}px` }" @scroll="onScroll">
    <div class="relative" :style="{ height: `${items.length * itemHeight}px` }">
      <div
        v-for="{ item, index } in visibleItems"
        :key="itemKey(item, index)"
        class="absolute left-0 right-0"
        :style="{ height: `${itemHeight}px`, transform: `translateY(${index * itemHeight}px)` }"
      >
        <slot :item="item" :index="index">
          <div class="flex h-full items-center border-b border-slate-100 px-4 text-sm text-slate-700 dark:border-white/[0.05] dark:text-[#d0d6e0]">
            {{ itemLabel(item) }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
