<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseDateRangePicker from '@/components/base/BaseDateRangePicker.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

function offsetDate(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

const basicRange = ref<string[]>([])
const limitedRange = ref<string[]>([])
const clearableRange = ref<string[]>([offsetDate(-7), offsetDate(0)])
const lastChange = ref('（尚未选择）')

// 只能选今天前后 30 天
const minDate = offsetDate(-30)
const maxDate = offsetDate(30)

function handleChange(range: string[]) {
  lastChange.value = range.length ? range.join(' → ') : '（已清空）'
  notify(range.length ? 'success' : 'info')
}

const basicCode = `<BaseDateRangePicker v-model="range" @change="handleChange" />`

const limitCode = `<BaseDateRangePicker
  v-model="range"
  :min="minDate"
  :max="maxDate"
  placeholder="仅可选前后 30 天"
/>`

const clearCode = `<BaseDateRangePicker v-model="range" clearable />
<BaseDateRangePicker :model-value="range" disabled />`
</script>

<template>
  <DemoBlock title="基础用法" description="第一次点击设定起点，第二次点击设定终点（早于起点时自动交换）后提交并关闭；只选了起点时移动鼠标可实时预览区间。" :code="basicCode">
    <div class="max-w-xs">
      <BaseDateRangePicker v-model="basicRange" @change="handleChange" />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">最近一次 change：{{ lastChange }}</p>
  </DemoBlock>

  <DemoBlock title="min / max 限制" description="超出 min / max 的日期禁用且不可作为起止点，本例只允许选择今天前后 30 天。" :code="limitCode">
    <div class="max-w-xs">
      <BaseDateRangePicker v-model="limitedRange" :min="minDate" :max="maxDate" placeholder="仅可选前后 30 天" />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">可选范围：{{ minDate }} → {{ maxDate }}</p>
  </DemoBlock>

  <DemoBlock title="禁用与清空" description="clearable 在有值时悬停显示清空按钮，点击回抛空数组；disabled 时无法打开面板。" :code="clearCode">
    <div class="grid max-w-xs gap-4">
      <BaseDateRangePicker v-model="clearableRange" clearable />
      <BaseDateRangePicker :model-value="[offsetDate(-3), offsetDate(3)]" disabled />
    </div>
  </DemoBlock>
</template>
