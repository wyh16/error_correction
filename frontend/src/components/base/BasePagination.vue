<script setup lang="ts">
/**
 * BasePagination.vue
 * 通用分页组件，内部计算页码窗口和省略号。
 * 支持两种用法：直接传 totalPages，或传 total + pageSize 由内部计算总页数。
 */
import { computed } from 'vue'

interface Props {
  page?: number
  totalPages?: number
  /** 数据总条数：大于 0 时优先据此计算总页数（配合 pageSize） */
  total?: number
  /** 每页条数，配合 total 计算总页数；支持 v-model:pageSize */
  pageSize?: number
  /** 每页条数可选项，非空时渲染切换下拉 */
  pageSizeOptions?: number[]
  /** 显示跳页输入框 */
  showQuickJumper?: boolean
  disabled?: boolean
  /** 数据总条数，大于 0 时在左侧显示「共 N 条」（与 total 独立，保持向后兼容） */
  showTotal?: number
  /** 当前页两侧各显示多少个相邻页码 */
  siblingCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  totalPages: 0,
  total: 0,
  pageSize: 10,
  pageSizeOptions: () => [],
  showQuickJumper: false,
  disabled: false,
  showTotal: 0,
  siblingCount: 1,
})

const emit = defineEmits<{
  'update:page': [page: number]
  'update:pageSize': [size: number]
  change: [page: number]
}>()

// total > 0 时优先基于总量计算，否则退回 totalPages prop
const pageCount = computed(() => {
  if (props.total > 0) return Math.max(1, Math.ceil(props.total / Math.max(1, props.pageSize)))
  return props.totalPages
})

const pageButtons = computed<Array<number | '...'>>(() => {
  const total = pageCount.value
  const current = props.page
  const siblings = Math.max(0, props.siblingCount)
  // 页数不多于「首尾 + 相邻窗口 + 两个省略号占位」时直接全量展示。
  if (total <= siblings * 2 + 5) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: Array<number | '...'> = [1]
  const start = Math.max(2, current - siblings)
  const end = Math.min(total - 1, current + siblings)
  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')
  pages.push(total)
  return pages
})

const setPage = (value: number) => {
  if (props.disabled) return
  if (value < 1 || value > pageCount.value || value === props.page) return
  emit('update:page', value)
  emit('change', value)
}

function onPageSizeChange(event: Event) {
  if (props.disabled) return
  const size = Number((event.target as HTMLSelectElement).value)
  emit('update:pageSize', size)
  // 换页大小后当前页可能越界，归位到第一页
  if (props.page !== 1) {
    emit('update:page', 1)
    emit('change', 1)
  }
}

function onJump(event: Event) {
  const input = event.target as HTMLInputElement
  const raw = input.value.trim()
  input.value = ''
  if (!raw) return
  const value = Math.floor(Number(raw))
  if (!Number.isFinite(value)) return
  setPage(Math.min(pageCount.value, Math.max(1, value)))
}
</script>

<template>
  <nav v-if="pageCount > 1" class="flex flex-wrap items-center justify-center gap-2" :class="disabled ? 'pointer-events-none opacity-50' : ''">
    <span v-if="showTotal > 0" class="mr-1 text-sm text-gray-500 dark:text-[#8a8f98]">共 {{ showTotal }} 条</span>
    <button class="pager-btn" :disabled="disabled || page <= 1" @click="setPage(page - 1)">
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <template v-for="(p, i) in pageButtons" :key="i">
      <span v-if="p === '...'" class="px-1 text-gray-400">...</span>
      <button v-else class="pager-btn min-w-9" :disabled="disabled" :class="p === page ? 'accent-bg text-white border-transparent' : ''" @click="setPage(p)">
        {{ p }}
      </button>
    </template>
    <button class="pager-btn" :disabled="disabled || page >= pageCount" @click="setPage(page + 1)">
      <i class="fa-solid fa-chevron-right"></i>
    </button>
    <!-- 每页条数切换：原生 select 套用 pager 风格 -->
    <select
      v-if="pageSizeOptions.length"
      class="h-9 cursor-pointer rounded-lg border border-gray-200 bg-white px-2 text-sm font-bold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-[#8a8f98] dark:hover:bg-white/[0.06]"
      :value="pageSize"
      :disabled="disabled"
      aria-label="每页条数"
      @change="onPageSizeChange"
    >
      <option v-for="option in pageSizeOptions" :key="option" :value="option">{{ option }} 条/页</option>
    </select>
    <!-- 跳页输入：回车或失焦时跳转，越界值收敛到边界 -->
    <label v-if="showQuickJumper" class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-[#8a8f98]">
      跳至
      <input
        type="number"
        min="1"
        :max="pageCount"
        :disabled="disabled"
        class="h-9 w-14 rounded-lg border border-gray-200 bg-white px-2 text-center text-sm font-bold text-gray-700 outline-none transition-colors focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-[#d0d6e0] dark:focus:border-white/25"
        @keydown.enter="onJump"
        @blur="onJump"
      />
      页
    </label>
  </nav>
</template>

<style scoped>
.pager-btn {
  @apply inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-[#8a8f98] dark:hover:bg-white/[0.06] dark:hover:text-[#d0d6e0];
}
</style>
