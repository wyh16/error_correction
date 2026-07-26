<script lang="ts">
export interface DescriptionItem {
  label: string
  value?: unknown
}
</script>

<script setup lang="ts">
/**
 * BaseDescriptions.vue
 * 描述列表组件，用于展示「标签-内容」形式的只读信息（如用户信息、订单详情）。
 */
import { computed } from 'vue'

interface Props {
  /** 数据项数组，每项为 { label, value } */
  items?: DescriptionItem[]
  /** sm 及以上屏幕的列数（1-4），小屏固定单列 */
  columns?: 1 | 2 | 3 | 4
  /** 列表上方的标题，为空时不渲染 */
  title?: string
  /** 带边框的表格风格：每个单元格有边框，标签列使用浅色背景 */
  bordered?: boolean
  /** 尺寸：sm 更紧凑的内边距和字号，md（默认） */
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  columns: 2,
  title: '',
  bordered: false,
  size: 'md',
})

/** 列数只支持 1-4 的静态映射，避免动态类名被 Tailwind 摇树掉。 */
const colsClass = computed(() => {
  const map: Record<number, string> = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
  }
  return map[props.columns] || map[2]
})

const labelPad = computed(() => (props.size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2.5'))
const valuePad = computed(() => (props.size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2.5'))
const labelText = computed(() => (props.size === 'sm' ? 'text-xs' : 'text-sm'))
const valueText = computed(() => (props.size === 'sm' ? 'text-xs' : 'text-sm'))
</script>

<template>
  <div>
    <h4
      v-if="props.title"
      class="mb-3 font-bold text-slate-900 dark:text-[#f7f8f8]"
      :class="props.size === 'sm' ? 'text-sm' : 'text-base'"
    >{{ props.title }}</h4>

    <!-- 有边框变体：单元格用 border-t/border-l 画格线，容器负 margin 让首行首列与外框重合 -->
    <div
      v-if="props.bordered"
      class="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.02]"
    >
      <div class="grid grid-cols-1 -ml-px -mt-px" :class="colsClass">
        <div
          v-for="(item, index) in props.items"
          :key="index"
          class="flex border-l border-t border-slate-200 dark:border-white/[0.08]"
        >
          <div
            class="w-28 shrink-0 border-r border-slate-200 bg-slate-50/80 font-medium text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.025] dark:text-[#8a8f98]"
            :class="[labelPad, labelText]"
          >{{ item.label }}</div>
          <div
            class="min-w-0 flex-1 break-words text-slate-900 dark:text-[#f7f8f8]"
            :class="[valuePad, valueText]"
          >{{ item.value }}</div>
        </div>
      </div>
    </div>

    <!-- 无边框变体：标签在上、内容在下的纵向排布 -->
    <div
      v-else
      class="grid grid-cols-1 gap-x-6"
      :class="[colsClass, props.size === 'sm' ? 'gap-y-3' : 'gap-y-4']"
    >
      <div v-for="(item, index) in props.items" :key="index" class="min-w-0">
        <div
          class="mb-0.5 font-medium text-slate-500 dark:text-[#8a8f98]"
          :class="props.size === 'sm' ? 'text-xs' : 'text-xs sm:text-sm'"
        >{{ item.label }}</div>
        <div class="break-words text-slate-900 dark:text-[#f7f8f8]" :class="valueText">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>
