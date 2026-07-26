<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BasePagination from './BasePagination.vue'
import BaseSearchInput from './BaseSearchInput.vue'
import BaseTable from './BaseTable.vue'
import type { TableColumn, TableRow } from './BaseTable.vue'

type SortDirection = 'asc' | 'desc' | ''

interface Props {
  columns?: TableColumn[]
  rows?: TableRow[]
  rowKey?: string
  searchable?: boolean
  pageSize?: number
  loading?: boolean
  /** 远程模式：不做客户端搜索/排序/分页，只上抛事件由外部驱动 rows */
  remote?: boolean
  /** 远程模式下的数据总条数，用于计算分页 */
  total?: number
  // 以下 props 透传给内层 BaseTable，默认值保持一致
  striped?: boolean
  compact?: boolean
  stickyHeader?: boolean
  emptyText?: string
  selectable?: boolean
  selectedKeys?: Array<string | number>
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  rows: () => [],
  rowKey: 'id',
  searchable: true,
  pageSize: 5,
  loading: false,
  remote: false,
  total: 0,
  striped: false,
  compact: false,
  stickyHeader: false,
  emptyText: '暂无数据',
  selectable: false,
  selectedKeys: () => [],
})

const emit = defineEmits<{
  'row-click': [row: TableRow]
  'update:selectedKeys': [keys: Array<string | number>]
  'search-change': [keyword: string]
  'sort-change': [key: string, direction: SortDirection]
  'page-change': [page: number]
}>()

const query = ref('')
const page = ref(1)
const sortKey = ref('')
const sortDirection = ref<SortDirection>('')

const filteredRows = computed(() => {
  if (props.remote) return props.rows
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return props.rows
  return props.rows.filter(row =>
    props.columns.some(column => String(row[column.key] ?? '').toLowerCase().includes(keyword)),
  )
})

const sortedRows = computed(() => {
  if (props.remote) return filteredRows.value
  if (!sortKey.value || !sortDirection.value) return filteredRows.value
  return [...filteredRows.value].sort((a, b) => {
    const av = a[sortKey.value]
    const bv = b[sortKey.value]
    if (av === bv) return 0
    // null/undefined 统一排最后，保证排序稳定
    const aEmpty = av === null || av === undefined
    const bEmpty = bv === null || bv === undefined
    if (aEmpty || bEmpty) return aEmpty && bEmpty ? 0 : aEmpty ? 1 : -1
    const result =
      typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv))
    return sortDirection.value === 'asc' ? result : -result
  })
})

const totalCount = computed(() => (props.remote ? props.total : filteredRows.value.length))
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalCount.value / Math.max(1, props.pageSize))),
)
const visibleRows = computed(() => {
  // 远程模式下 rows 即当前页数据，直接展示
  if (props.remote) return sortedRows.value
  const start = (page.value - 1) * props.pageSize
  return sortedRows.value.slice(start, start + props.pageSize)
})

watch(query, value => {
  page.value = 1
  if (props.remote) emit('search-change', value.trim())
})

watch(() => props.rows.length, () => {
  if (!props.remote) page.value = 1
})

// pageSize 运行时变化会改变总页数，重置到第一页避免落在空页
watch(() => props.pageSize, () => {
  page.value = 1
})

watch(page, value => {
  if (props.remote) emit('page-change', value)
})

function sort(columnKey: string) {
  if (sortKey.value !== columnKey) {
    sortKey.value = columnKey
    sortDirection.value = 'asc'
  } else if (sortDirection.value === 'asc') {
    sortDirection.value = 'desc'
  } else if (sortDirection.value === 'desc') {
    sortKey.value = ''
    sortDirection.value = ''
  } else {
    sortDirection.value = 'asc'
  }
  if (props.remote) emit('sort-change', sortKey.value, sortDirection.value)
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="searchable || $slots.toolbar" class="flex flex-wrap items-center justify-between gap-3">
      <BaseSearchInput v-if="searchable" v-model="query" class="w-64 max-w-full" placeholder="搜索表格" />
      <slot name="toolbar" />
    </div>
    <BaseTable
      :columns="columns"
      :rows="visibleRows"
      :row-key="rowKey"
      :loading="loading"
      :striped="striped"
      :compact="compact"
      :sticky-header="stickyHeader"
      :empty-text="emptyText"
      :sort-key="sortKey"
      :sort-direction="sortDirection"
      :selectable="selectable"
      :selected-keys="selectedKeys"
      @sort="sort"
      @row-click="row => emit('row-click', row)"
      @update:selected-keys="keys => emit('update:selectedKeys', keys)"
    >
      <template v-for="column in columns" #[`cell-${column.key}`]="slotProps">
        <slot :name="`cell-${column.key}`" v-bind="slotProps">
          {{ slotProps.value }}
        </slot>
      </template>
    </BaseTable>
    <div class="flex items-center justify-between gap-3">
      <p class="text-xs text-slate-500 dark:text-[#8a8f98]">
        共 {{ totalCount }} 条
      </p>
      <BasePagination v-if="totalPages > 1" v-model:page="page" :total-pages="totalPages" />
    </div>
  </div>
</template>
