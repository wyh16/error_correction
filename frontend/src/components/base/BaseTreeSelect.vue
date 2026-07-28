<script setup lang="ts">
/**
 * BaseTreeSelect.vue
 * 树形选择器：输入框触发弹出 BaseTree，选中叶子节点后回显其 label。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { TransitionRoot } from '@headlessui/vue'
import BaseTree from './BaseTree.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  // BaseTree 形状：{ label, value, icon?, children? }
  items: { type: Array, default: () => [] },
  placeholder: { type: String, default: '请选择' },
  // 有选中值时悬停显示清空按钮，点击清空为 ''
  clearable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

const open = ref(false)
const rootRef = ref(null)

function hasChildren(item) {
  return Array.isArray(item.children) && item.children.length > 0
}

// 递归查找选中节点，用于回显 label
function findNode(items, value) {
  for (const item of items) {
    if (item.value === value) return item
    if (hasChildren(item)) {
      const found = findNode(item.children, value)
      if (found) return found
    }
  }
  return null
}

// 递归收集 value 的祖先 value 链，用于展开选中项所在的分支
function findAncestors(items, value, trail) {
  for (const item of items) {
    if (item.value === value) return trail
    if (hasChildren(item)) {
      const found = findAncestors(item.children, value, [...trail, item.value])
      if (found) return found
    }
  }
  return null
}

const selectedNode = computed(() => (props.modelValue === '' ? null : findNode(props.items, props.modelValue)))
const displayLabel = computed(() => (selectedNode.value ? selectedNode.value.label : ''))

// 弹层用 v-if 渲染，每次打开都重建 BaseTree，因此 defaultExpanded 总能取到最新值：
// 有选中值时展开其祖先链保证可见，无值（或找不到）时展开第一层分支
const defaultExpanded = computed(() => {
  if (props.modelValue !== '') {
    const trail = findAncestors(props.items, props.modelValue, [])
    if (trail && trail.length) return trail
  }
  return props.items.filter(hasChildren).map(item => item.value)
})

function toggleOpen() {
  if (props.disabled) return
  open.value = !open.value
}

// 选中策略：叶子节点才提交并关闭；分支节点点击不关闭（仅承担浏览/展开语义），
// 避免用户想展开分支时误提交一个"目录"值
function onSelect(item) {
  if (hasChildren(item)) return
  emit('update:modelValue', item.value)
  emit('change', item)
  open.value = false
}

/** 清空选中值。stop 修饰符已阻止事件冒泡，不会触发弹层展开。 */
function clearValue() {
  emit('update:modelValue', '')
}

// 点击组件外部或按下 Escape 关闭弹层
function onDocumentPointer(event) {
  if (!open.value) return
  const root = rootRef.value
  if (root && root.contains(event.target)) return
  open.value = false
}

function onDocumentKeydown(event) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentPointer)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentPointer)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="group flex h-9 w-full items-center justify-between rounded-md bg-white/80 px-3 text-left text-sm font-medium ring-1 ring-inset ring-transparent transition-colors hover:bg-white dark:bg-white/[0.045] dark:hover:bg-white/[0.07]"
      :class="[
        open ? 'bg-white ring-[rgb(var(--accent-rgb)/0.24)] dark:bg-white/[0.08] dark:ring-[rgb(var(--accent-rgb)/0.35)]' : '',
        displayLabel ? 'text-slate-800 dark:text-[#d0d6e0]' : 'text-slate-500 dark:text-[#62666d]',
        disabled ? 'cursor-not-allowed opacity-50 hover:bg-white/80 dark:hover:bg-white/[0.045]' : '',
      ]"
      :disabled="disabled"
      @click="toggleOpen"
    >
      <span class="flex min-w-0 items-center gap-2">
        <i v-if="selectedNode && selectedNode.icon" class="fa-solid shrink-0 text-xs" :class="selectedNode.icon"></i>
        <span class="truncate">{{ displayLabel || placeholder }}</span>
      </span>
      <!-- clearable 且有选中值时，悬停用清空按钮替换下拉箭头 -->
      <span
        v-if="clearable && displayLabel && !disabled"
        class="ml-2 hidden shrink-0 text-[11px] text-slate-400 transition-colors hover:text-slate-600 group-hover:inline dark:text-[#62666d] dark:hover:text-[#d0d6e0]"
        @click.stop.prevent="clearValue"
      >
        <i class="fa-solid fa-circle-xmark"></i>
      </span>
      <i
        class="fa-solid fa-chevron-down ml-2 shrink-0 text-[10px] text-slate-400 transition-transform duration-200 dark:text-[#62666d]"
        :class="[open ? 'rotate-180' : '', clearable && displayLabel && !disabled ? 'group-hover:hidden' : '']"
      ></i>
    </button>

    <TransitionRoot
      :show="open"
      enter="transition duration-150 ease-out"
      enter-from="opacity-0 -translate-y-1"
      enter-to="opacity-100 translate-y-0"
      leave="transition duration-100 ease-in"
      leave-from="opacity-100 translate-y-0"
      leave-to="opacity-0 -translate-y-1"
    >
      <div
        class="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-slate-200 bg-white/95 p-2 shadow-lg shadow-slate-200/60 dark:border-white/[0.08] dark:bg-[#1f1f22] dark:shadow-black/40"
      >
        <div class="no-scrollbar max-h-64 overflow-y-auto">
          <BaseTree
            :items="items"
            :model-value="modelValue"
            :default-expanded="defaultExpanded"
            @select="onSelect"
          />
          <p v-if="!items.length" class="px-2 py-4 text-center text-xs text-slate-400 dark:text-[#62666d]">暂无数据</p>
        </div>
      </div>
    </TransitionRoot>
  </div>
</template>
