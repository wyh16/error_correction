<script setup lang="ts">
/**
 * BaseTransfer.vue
 * 穿梭框：双列表勾选后左右移动，modelValue 为目标侧 value 数组
 */
import { computed, ref, watch } from 'vue'
import BaseCheckbox from './BaseCheckbox.vue'

export interface TransferOption {
  label: string
  value: string | number
  disabled?: boolean
}

type TransferValue = Array<string | number>

interface Props {
  // 目标侧（右列）已持有的 value 数组
  modelValue?: TransferValue
  // 全量候选项 { label, value, disabled? }
  options?: TransferOption[]
  titles?: string[]
  // 是否在两列头部下方显示按 label 过滤的搜索框
  searchable?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  options: () => [],
  titles: () => ['源列表', '目标列表'],
  searchable: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: TransferValue): void
  (e: 'change', value: TransferValue, direction: 'toTarget' | 'toSource', moved: TransferValue): void
}>()

// 两侧各自的勾选值，移动或外部值变化后需要清理
const sourceChecked = ref<TransferValue>([])
const targetChecked = ref<TransferValue>([])
const sourceQuery = ref('')
const targetQuery = ref('')

const targetSet = computed(() => new Set(props.modelValue))
const sourceItems = computed(() => props.options.filter(item => !targetSet.value.has(item.value)))

// 目标侧按 modelValue 顺序展示，让新移入的项排在末尾；值在 options 中不存在时忽略
const targetItems = computed(() => {
  const byValue = new Map(props.options.map(item => [item.value, item]))
  return props.modelValue.map(value => byValue.get(value)).filter((item): item is TransferOption => Boolean(item))
})

function filterItems(items: TransferOption[], query: string) {
  const keyword = query.trim().toLowerCase()
  if (!keyword) return items
  return items.filter(item => String(item.label).toLowerCase().includes(keyword))
}

const filteredSource = computed(() => filterItems(sourceItems.value, sourceQuery.value))
const filteredTarget = computed(() => filterItems(targetItems.value, targetQuery.value))

// 全选框只统计「当前可见且未禁用」的项，搜索过滤后全选不会误勾隐藏项
function allState(items: TransferOption[], checked: TransferValue) {
  const enabled = items.filter(item => !item.disabled).map(item => item.value)
  const checkedCount = enabled.filter(value => checked.includes(value)).length
  return {
    all: enabled.length > 0 && checkedCount === enabled.length,
    some: checkedCount > 0 && checkedCount < enabled.length,
  }
}

const sourceAll = computed(() => allState(filteredSource.value, sourceChecked.value))
const targetAll = computed(() => allState(filteredTarget.value, targetChecked.value))

function toggleAll(side: 'source' | 'target') {
  if (props.disabled) return
  const items = side === 'source' ? filteredSource.value : filteredTarget.value
  const checkedRef = side === 'source' ? sourceChecked : targetChecked
  const currentAll = side === 'source' ? sourceAll.value.all : targetAll.value.all
  const enabled = items.filter(item => !item.disabled).map(item => item.value)
  if (currentAll) {
    checkedRef.value = checkedRef.value.filter(value => !enabled.includes(value))
  } else {
    checkedRef.value = [...new Set([...checkedRef.value, ...enabled])]
  }
}

// 外部直接改 modelValue（如重置）时，清理已跑到对侧的勾选残留
watch(() => props.modelValue, () => {
  sourceChecked.value = sourceChecked.value.filter(value => !targetSet.value.has(value))
  targetChecked.value = targetChecked.value.filter(value => targetSet.value.has(value))
})

function move(direction: 'toTarget' | 'toSource') {
  if (props.disabled) return
  const checkedRef = direction === 'toTarget' ? sourceChecked : targetChecked
  if (!checkedRef.value.length) return
  // 按 options 原始顺序移动，避免目标列表顺序随勾选顺序抖动
  const orderIndex = new Map(props.options.map((item, index) => [item.value, index]))
  const moved = [...checkedRef.value].sort((a, b) => (orderIndex.get(a) ?? 0) - (orderIndex.get(b) ?? 0))
  const next = direction === 'toTarget'
    ? [...props.modelValue, ...moved]
    : props.modelValue.filter(value => !moved.includes(value))
  checkedRef.value = []
  emit('update:modelValue', next)
  emit('change', next, direction, moved)
}
</script>

<template>
  <div class="inline-flex items-center gap-3" :class="disabled ? 'cursor-not-allowed opacity-60' : ''">
    <!-- 源列表面板 -->
    <div class="flex h-64 w-56 flex-col rounded-xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.03]">
      <div class="flex h-10 shrink-0 items-center gap-2 border-b border-slate-200 px-3 dark:border-white/[0.08]">
        <BaseCheckbox
          :model-value="sourceAll.all"
          :indeterminate="sourceAll.some"
          :disabled="disabled || !filteredSource.length"
          @update:model-value="toggleAll('source')"
        />
        <span class="truncate text-sm font-semibold text-slate-700 dark:text-[#d0d6e0]">{{ titles[0] || '源列表' }}</span>
        <span class="ml-auto shrink-0 text-xs text-slate-400 dark:text-[#62666d]">{{ sourceChecked.length }}/{{ sourceItems.length }}</span>
      </div>
      <div v-if="searchable" class="shrink-0 px-1.5 pt-1.5">
        <div class="relative">
          <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-[#62666d]"></i>
          <input
            v-model="sourceQuery"
            type="text"
            placeholder="搜索"
            :disabled="disabled"
            class="h-8 w-full rounded-md bg-slate-100/70 pl-7 pr-2 text-xs text-slate-700 placeholder-slate-400 outline-none transition-colors focus:ring-1 focus:ring-[rgb(var(--accent-rgb)/0.35)] disabled:cursor-not-allowed dark:bg-white/[0.05] dark:text-[#d0d6e0] dark:placeholder-[#62666d]"
          />
        </div>
      </div>
      <div class="no-scrollbar flex-1 overflow-y-auto p-1.5">
        <p v-if="!filteredSource.length" class="flex h-full items-center justify-center text-xs text-slate-400 dark:text-[#62666d]">暂无数据</p>
        <div
          v-for="item in filteredSource"
          :key="item.value"
          class="flex h-8 items-center rounded-md px-2 transition-colors"
          :class="item.disabled || disabled ? '' : 'hover:bg-slate-100 dark:hover:bg-white/[0.05]'"
        >
          <BaseCheckbox
            v-model="sourceChecked"
            :value="item.value"
            :label="item.label"
            :disabled="disabled || item.disabled"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- 中间方向按钮：有勾选才可点，点击后移动并清空该侧勾选 -->
    <div class="flex flex-col gap-2">
      <button
        type="button"
        aria-label="移入目标列表"
        :disabled="disabled || !sourceChecked.length"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors"
        :class="!disabled && sourceChecked.length
          ? 'accent-bg text-white shadow-sm hover:opacity-90'
          : 'cursor-not-allowed border border-slate-200 text-slate-300 dark:border-white/[0.08] dark:text-[#62666d]'"
        @click="move('toTarget')"
      >
        <i class="fa-solid fa-angle-right"></i>
      </button>
      <button
        type="button"
        aria-label="移回源列表"
        :disabled="disabled || !targetChecked.length"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors"
        :class="!disabled && targetChecked.length
          ? 'accent-bg text-white shadow-sm hover:opacity-90'
          : 'cursor-not-allowed border border-slate-200 text-slate-300 dark:border-white/[0.08] dark:text-[#62666d]'"
        @click="move('toSource')"
      >
        <i class="fa-solid fa-angle-left"></i>
      </button>
    </div>

    <!-- 目标列表面板 -->
    <div class="flex h-64 w-56 flex-col rounded-xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.03]">
      <div class="flex h-10 shrink-0 items-center gap-2 border-b border-slate-200 px-3 dark:border-white/[0.08]">
        <BaseCheckbox
          :model-value="targetAll.all"
          :indeterminate="targetAll.some"
          :disabled="disabled || !filteredTarget.length"
          @update:model-value="toggleAll('target')"
        />
        <span class="truncate text-sm font-semibold text-slate-700 dark:text-[#d0d6e0]">{{ titles[1] || '目标列表' }}</span>
        <span class="ml-auto shrink-0 text-xs text-slate-400 dark:text-[#62666d]">{{ targetChecked.length }}/{{ targetItems.length }}</span>
      </div>
      <div v-if="searchable" class="shrink-0 px-1.5 pt-1.5">
        <div class="relative">
          <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-[#62666d]"></i>
          <input
            v-model="targetQuery"
            type="text"
            placeholder="搜索"
            :disabled="disabled"
            class="h-8 w-full rounded-md bg-slate-100/70 pl-7 pr-2 text-xs text-slate-700 placeholder-slate-400 outline-none transition-colors focus:ring-1 focus:ring-[rgb(var(--accent-rgb)/0.35)] disabled:cursor-not-allowed dark:bg-white/[0.05] dark:text-[#d0d6e0] dark:placeholder-[#62666d]"
          />
        </div>
      </div>
      <div class="no-scrollbar flex-1 overflow-y-auto p-1.5">
        <p v-if="!filteredTarget.length" class="flex h-full items-center justify-center text-xs text-slate-400 dark:text-[#62666d]">暂无数据</p>
        <div
          v-for="item in filteredTarget"
          :key="item.value"
          class="flex h-8 items-center rounded-md px-2 transition-colors"
          :class="item.disabled || disabled ? '' : 'hover:bg-slate-100 dark:hover:bg-white/[0.05]'"
        >
          <BaseCheckbox
            v-model="targetChecked"
            :value="item.value"
            :label="item.label"
            :disabled="disabled || item.disabled"
            class="w-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
