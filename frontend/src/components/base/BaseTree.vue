<script lang="ts">
export interface TreeItem {
  value: string | number
  label: string
  icon?: string
  children?: TreeItem[]
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  items?: TreeItem[]
  modelValue?: string | number
  defaultExpanded?: Array<string | number>
  /** 受控展开集合：传入后展开状态完全由外部驱动（配合 v-model:expanded） */
  expanded?: Array<string | number>
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  modelValue: '',
  defaultExpanded: () => [],
  expanded: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'update:expanded': [values: Array<string | number>]
  select: [item: TreeItem]
}>()

// 传了 expanded 即受控模式，内部集合只在非受控时使用
const controlled = computed(() => props.expanded !== undefined)
const innerExpanded = ref(new Set<string | number>(props.defaultExpanded))

// defaultExpanded 变更时以新值重置展开集合（取舍：不保留用户手动展开项，实现简单且行为可预期）
watch(() => props.defaultExpanded, value => {
  innerExpanded.value = new Set(value)
}, { deep: true })

const expandedSet = computed(() =>
  controlled.value ? new Set(props.expanded) : innerExpanded.value,
)

function hasChildren(item: TreeItem): boolean {
  return Array.isArray(item.children) && item.children.length > 0
}

function toggle(item: TreeItem) {
  if (!hasChildren(item)) return
  const next = new Set(expandedSet.value)
  if (next.has(item.value)) next.delete(item.value)
  else next.add(item.value)
  if (controlled.value) emit('update:expanded', [...next])
  else innerExpanded.value = next
}

function select(item: TreeItem) {
  emit('update:modelValue', item.value)
  emit('select', item)
}

const isExpanded = computed(() => (item: TreeItem) => expandedSet.value.has(item.value))
</script>

<template>
  <ul class="space-y-1">
    <li v-for="item in items" :key="item.value">
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-[#d0d6e0]"
          :class="hasChildren(item) ? '' : 'invisible'"
          @click="toggle(item)"
        >
          <i class="fa-solid fa-chevron-right text-[10px] transition-transform" :class="isExpanded(item) ? 'rotate-90' : ''"></i>
        </button>
        <button
          type="button"
          class="flex min-h-8 min-w-0 flex-1 items-center gap-2 rounded-lg px-2 text-left text-sm transition-colors"
          :class="modelValue === item.value ? 'accent-bg-soft accent-text' : 'text-slate-700 hover:bg-slate-100 dark:text-[#d0d6e0] dark:hover:bg-white/[0.05]'"
          @click="select(item)"
        >
          <i v-if="item.icon" class="fa-solid shrink-0 text-xs" :class="item.icon"></i>
          <span class="min-w-0 truncate">{{ item.label }}</span>
        </button>
      </div>
      <BaseTree
        v-if="hasChildren(item) && isExpanded(item)"
        class="ml-7 mt-1"
        :model-value="modelValue"
        :items="item.children"
        :default-expanded="defaultExpanded"
        :expanded="expanded"
        @update:model-value="emit('update:modelValue', $event)"
        @update:expanded="emit('update:expanded', $event)"
        @select="emit('select', $event)"
      />
    </li>
  </ul>
</template>
