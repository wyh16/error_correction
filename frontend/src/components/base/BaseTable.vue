<script lang="ts">
/** 表格行：任意键值对象，具体字段由调用方决定 */
export type TableRow = Record<string, unknown>

/** 列定义：key 取行字段，render 优先于字段取值 */
export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  /** 自定义单元格内容，返回值直接渲染（优先于 row[key]） */
  render?: (row: TableRow) => unknown
  /** 列宽，写进 col 的 style.width，如 '120px' / '20%' */
  width?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  columns?: TableColumn[]
  rows?: TableRow[]
  rowKey?: string
  emptyText?: string
  loading?: boolean
  compact?: boolean
  sortKey?: string
  sortDirection?: 'asc' | 'desc' | ''
  striped?: boolean
  stickyHeader?: boolean
  /** stickyHeader 时滚动容器的最大高度 */
  maxHeight?: string
  /** 首列渲染 checkbox，依赖 rowKey 取行标识 */
  selectable?: boolean
  /** 已选行 key 集合，配合 v-model:selectedKeys 使用 */
  selectedKeys?: Array<string | number>
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  rows: () => [],
  rowKey: 'id',
  emptyText: '暂无数据',
  loading: false,
  compact: false,
  sortKey: '',
  sortDirection: '',
  striped: false,
  stickyHeader: false,
  maxHeight: '360px',
  selectable: false,
  selectedKeys: () => [],
})

const emit = defineEmits<{
  sort: [key: string]
  'row-click': [row: TableRow]
  'update:selectedKeys': [keys: Array<string | number>]
}>()

const colCount = computed(() => props.columns.length + (props.selectable ? 1 : 0))

function keyOf(row: TableRow, index: number): string | number {
  const value = row[props.rowKey]
  return (typeof value === 'string' || typeof value === 'number') ? value : index
}

function cellValue(row: TableRow, column: TableColumn): unknown {
  if (typeof column.render === 'function') return column.render(row)
  return row[column.key]
}

function sortIcon(column: TableColumn, sortKey: string, sortDirection: string): string {
  if (!column.sortable) return ''
  if (sortKey !== column.key) return 'fa-sort'
  return sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
}

// —— 行选择 ——
const selectedSet = computed(() => new Set(props.selectedKeys))
const allKeys = computed(() => props.rows.map((row, index) => keyOf(row, index)))
const allSelected = computed(
  () => allKeys.value.length > 0 && allKeys.value.every(key => selectedSet.value.has(key)),
)
const someSelected = computed(
  () => !allSelected.value && allKeys.value.some(key => selectedSet.value.has(key)),
)

function toggleRow(row: TableRow, index: number) {
  const key = keyOf(row, index)
  const next = new Set(selectedSet.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  emit('update:selectedKeys', [...next])
}

function toggleAll() {
  if (allSelected.value) {
    // 只清掉当前行集内的 key，保留外部可能存在的其他 key
    const current = new Set(allKeys.value)
    emit('update:selectedKeys', props.selectedKeys.filter(key => !current.has(key)))
  } else {
    const next = new Set(props.selectedKeys)
    allKeys.value.forEach(key => next.add(key))
    emit('update:selectedKeys', [...next])
  }
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.03]">
    <!-- stickyHeader 需要一个有限高度的滚动容器才能生效 -->
    <div
      class="overflow-x-auto custom-scrollbar"
      :class="stickyHeader ? 'overflow-y-auto' : ''"
      :style="stickyHeader ? { maxHeight } : undefined"
    >
      <table class="min-w-full divide-y divide-slate-200 dark:divide-white/[0.06]">
        <colgroup v-if="selectable || columns.some(column => column.width)">
          <col v-if="selectable" style="width: 44px" />
          <col v-for="column in columns" :key="column.key" :style="column.width ? { width: column.width } : undefined" />
        </colgroup>
        <thead class="bg-slate-50/80 dark:bg-white/[0.025]">
          <tr>
            <th
              v-if="selectable"
              scope="col"
              class="w-11 px-4"
              :class="[compact ? 'py-2' : 'py-3', stickyHeader ? 'sticky top-0 z-10 bg-slate-50 dark:bg-[#1b1b1e]' : '']"
            >
              <input
                type="checkbox"
                class="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[rgb(var(--accent-rgb))] dark:border-white/20"
                :checked="allSelected"
                :indeterminate.prop="someSelected"
                aria-label="全选"
                @change="toggleAll"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="whitespace-nowrap px-4 text-xs font-bold uppercase text-slate-500 dark:text-[#8a8f98]"
              :class="[
                compact ? 'py-2' : 'py-3',
                column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left',
                stickyHeader ? 'sticky top-0 z-10 bg-slate-50 dark:bg-[#1b1b1e]' : '',
              ]"
            >
              <button
                v-if="column.sortable"
                type="button"
                class="inline-flex items-center gap-1.5 transition-colors hover:text-slate-900 dark:hover:text-[#f7f8f8]"
                @click="emit('sort', column.key)"
              >
                {{ column.label }}
                <i class="fa-solid text-[10px]" :class="sortIcon(column, sortKey, sortDirection)"></i>
              </button>
              <span v-else>{{ column.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-white/[0.05]">
          <tr v-if="loading">
            <td :colspan="colCount" class="px-4 py-8 text-center text-sm text-slate-500 dark:text-[#8a8f98]">
              <i class="fa-solid fa-spinner mr-2 animate-spin"></i>加载中
            </td>
          </tr>
          <tr v-else-if="!rows.length">
            <td :colspan="colCount" class="px-4 py-8 text-center text-sm text-slate-500 dark:text-[#8a8f98]">
              {{ emptyText }}
            </td>
          </tr>
          <tr
            v-for="(row, index) in rows"
            v-else
            :key="keyOf(row, index)"
            class="transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.035]"
            :class="striped ? 'odd:bg-transparent even:bg-slate-50/60 dark:even:bg-white/[0.02]' : ''"
            @click="emit('row-click', row)"
          >
            <td v-if="selectable" class="w-11 px-4" :class="compact ? 'py-2' : 'py-3'">
              <input
                type="checkbox"
                class="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[rgb(var(--accent-rgb))] dark:border-white/20"
                :checked="selectedSet.has(keyOf(row, index))"
                :aria-label="`选择第 ${index + 1} 行`"
                @click.stop
                @change="toggleRow(row, index)"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 text-sm text-slate-700 dark:text-[#d0d6e0]"
              :class="[compact ? 'py-2' : 'py-3', column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left']"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="cellValue(row, column)">
                {{ cellValue(row, column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
