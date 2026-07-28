<script setup lang="ts">
/**
 * BaseCascader.vue
 * 级联选择器：多列平铺面板逐级展开，点击叶子节点回传完整值路径
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useDropdownPosition } from '@/composables/useDropdownPosition'

export interface CascaderNode {
  label: string
  value: string | number
  children?: CascaderNode[]
  disabled?: boolean
}

interface Props {
  // 选中值的完整路径，如 ['zhejiang', 'hangzhou', 'xihu']
  modelValue?: Array<string | number>
  options?: CascaderNode[]
  placeholder?: string
  disabled?: boolean
  // 有选中值时悬停显示清空按钮，点击清空为 []
  clearable?: boolean
  // 错误态：红色边框
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  options: () => [],
  placeholder: '请选择',
  disabled: false,
  clearable: false,
  error: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Array<string | number>): void
  (e: 'change', value: Array<string | number>, nodes: CascaderNode[]): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const open = ref(false)

// 弹层 Teleport 到 body，避免被祖先 overflow 裁剪
const { panelStyle, isOutside } = useDropdownPosition(open, rootRef, panelRef)

// 面板中逐列点开的节点链。区别于 modelValue：点开非叶子只改激活路径，不提交选中
const activePath = ref<Array<string | number>>([])

// 第 0 列固定是根 options，之后每列取上一列激活项的 children
const columns = computed<CascaderNode[][]>(() => {
  const cols = [props.options]
  let current = props.options
  for (const value of activePath.value) {
    const node = current.find(item => item.value === value)
    if (!node || !node.children || !node.children.length) break
    cols.push(node.children)
    current = node.children
  }
  return cols
})

// 由值路径逐层反查节点对象；路径断裂（数据变化）时返回空，触发器回退为占位符
function resolvePath(values: Array<string | number>): CascaderNode[] {
  const nodes: CascaderNode[] = []
  let current = props.options
  for (const value of values) {
    const node = current.find(item => item.value === value)
    if (!node) return []
    nodes.push(node)
    current = node.children || []
  }
  return nodes
}

const selectedNodes = computed(() => resolvePath(props.modelValue))
const displayLabel = computed(() => selectedNodes.value.map(node => node.label).join(' / '))
const showClear = computed(() => props.clearable && props.modelValue.length > 0 && !props.disabled)

function toggle() {
  if (props.disabled) return
  open.value = !open.value
  // 打开时按已选值还原激活路径，让选中链路每一列都可见
  if (open.value) activePath.value = selectedNodes.value.length ? [...props.modelValue] : []
}

function hasChildren(node: CascaderNode) {
  return Boolean(node.children && node.children.length)
}

function isActive(depth: number, node: CascaderNode) {
  return activePath.value[depth] === node.value
}

// 叶子行的选中对勾：所在列的前缀路径与 modelValue 完全一致时才显示，
// 避免不同分支下恰好同名的 value 被误标记
function isSelected(depth: number, node: CascaderNode) {
  if (props.modelValue.length !== depth + 1 || props.modelValue[depth] !== node.value) return false
  return activePath.value.slice(0, depth).every((value, index) => value === props.modelValue[index])
}

function handleClick(depth: number, node: CascaderNode) {
  if (node.disabled) return
  const path = [...activePath.value.slice(0, depth), node.value]
  activePath.value = path
  if (hasChildren(node)) return
  // 叶子节点：提交完整路径并关闭
  emit('update:modelValue', path)
  emit('change', path, resolvePath(path))
  open.value = false
}

/** 清空选中值。stop 修饰符已阻止事件冒泡，不会触发面板展开。 */
function clearValue() {
  emit('update:modelValue', [])
  emit('change', [], [])
}

// 点击触发器与弹层之外时收起（弹层已 Teleport，需同时排除两者）
function onPointerDown(event: PointerEvent) {
  if (!open.value) return
  if (isOutside(event.target)) open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <div ref="rootRef" class="relative" @keydown="onKeydown">
    <button
      type="button"
      :disabled="disabled"
      aria-haspopup="listbox"
      :aria-expanded="open"
      class="group flex h-9 w-full items-center justify-between rounded-md bg-white/80 px-3 text-left text-sm font-medium ring-1 ring-inset transition-colors hover:bg-white dark:bg-white/[0.045] dark:hover:bg-white/[0.07]"
      :class="[
        error ? 'ring-rose-500/50' : 'ring-transparent',
        open ? 'bg-white ring-[rgb(var(--accent-rgb)/0.24)] dark:bg-white/[0.08] dark:ring-[rgb(var(--accent-rgb)/0.35)]' : '',
        displayLabel ? 'text-slate-800 dark:text-[#d0d6e0]' : 'text-slate-500 dark:text-[#62666d]',
        disabled ? 'cursor-not-allowed opacity-50 hover:bg-white/80 dark:hover:bg-white/[0.045]' : '',
      ]"
      @click="toggle"
    >
      <span class="truncate">{{ displayLabel || placeholder }}</span>
      <!-- clearable 且有选中值时，悬停用清空按钮替换下拉箭头 -->
      <span
        v-if="showClear"
        aria-label="清空已选"
        class="ml-2 hidden shrink-0 text-[11px] text-slate-400 transition-colors hover:text-slate-600 group-hover:inline dark:text-[#62666d] dark:hover:text-[#d0d6e0]"
        @click.stop.prevent="clearValue"
      >
        <i class="fa-solid fa-circle-xmark"></i>
      </span>
      <i
        class="fa-solid fa-chevron-down ml-2 shrink-0 text-[10px] text-slate-400 transition-transform duration-200 dark:text-[#62666d]"
        :class="[open ? 'rotate-180' : '', showClear ? 'group-hover:hidden' : '']"
      ></i>
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-1 opacity-0"
      >
        <div
          v-if="open"
          ref="panelRef"
          :style="panelStyle"
          class="flex overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-lg shadow-slate-200/60 dark:border-white/[0.08] dark:bg-[#1f1f22] dark:shadow-black/40"
          @keydown="onKeydown"
        >
        <div
          v-for="(column, depth) in columns"
          :key="depth"
          class="no-scrollbar max-h-56 w-40 overflow-y-auto px-1 py-1"
          :class="depth > 0 ? 'border-l border-slate-200 dark:border-white/[0.08]' : ''"
        >
          <p v-if="!column.length" class="flex h-20 items-center justify-center text-xs text-slate-400 dark:text-[#62666d]">暂无数据</p>
          <button
            v-for="node in column"
            :key="node.value"
            type="button"
            :disabled="node.disabled"
            class="flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            :class="node.disabled
              ? 'text-slate-400 dark:text-[#62666d]'
              : isActive(depth, node)
                ? 'accent-bg-soft accent-text'
                : 'text-slate-600 hover:bg-slate-100/80 dark:text-[#d0d6e0] dark:hover:bg-white/[0.07]'"
            @click="handleClick(depth, node)"
          >
            <span class="min-w-0 flex-1 truncate">{{ node.label }}</span>
            <i
              v-if="hasChildren(node)"
              class="fa-solid fa-chevron-right shrink-0 text-[9px]"
              :class="isActive(depth, node) ? 'accent-text' : 'text-slate-400 dark:text-[#62666d]'"
            ></i>
            <i v-else-if="isSelected(depth, node)" class="fa-solid fa-check shrink-0 text-[10px] accent-text"></i>
          </button>
        </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
