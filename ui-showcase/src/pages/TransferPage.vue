<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseTransfer from '@/components/base/BaseTransfer.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const chapterOptions = [
  { label: '一元二次方程', value: 'quadratic' },
  { label: '函数与图像', value: 'function' },
  { label: '三角形全等', value: 'congruent' },
  { label: '圆的性质', value: 'circle' },
  { label: '概率初步', value: 'probability' },
  { label: '数列', value: 'sequence' },
]

const studentOptions = [
  { label: '陈晓明', value: 'chen' },
  { label: '林子涵', value: 'lin' },
  { label: '王雨桐', value: 'wang' },
  { label: '张一帆', value: 'zhang' },
  { label: '刘思远', value: 'liu' },
  { label: '赵可欣', value: 'zhao' },
  { label: '孙浩然', value: 'sun' },
  { label: '周雅静', value: 'zhou' },
]

const lockedOptions = [
  { label: '语文', value: 'chinese' },
  { label: '数学（必选）', value: 'math', disabled: true },
  { label: '英语', value: 'english' },
  { label: '物理', value: 'physics' },
  { label: '化学（未开放）', value: 'chemistry', disabled: true },
]

const basicValue = ref<string[]>(['function'])
const searchValue = ref<string[]>(['wang'])
const lockedValue = ref<string[]>([])
const lastMove = ref('（尚未移动）')

function handleChange(next: string[], direction: string, moved: string[]) {
  lastMove.value = `${direction === 'toTarget' ? '移入' : '移回'} ${moved.length} 项，目标共 ${next.length} 项`
  notify('success')
}

const basicCode = `<BaseTransfer
  v-model="checkedChapters"
  :options="chapterOptions"
  :titles="['全部章节', '本周复习']"
  @change="handleChange"
/>`

const searchCode = `<BaseTransfer
  v-model="groupMembers"
  :options="studentOptions"
  :titles="['全班学生', '加强辅导组']"
  searchable
/>`
</script>

<template>
  <DemoBlock title="基础用法" description="勾选后点击中间按钮在两列间移动；头部全选框支持半选态，右侧灰字为「已勾选/总数」。change 事件回传新目标数组、移动方向和移动的 value 列表。" :code="basicCode">
    <div class="overflow-x-auto pb-1">
      <BaseTransfer v-model="basicValue" :options="chapterOptions" :titles="['全部章节', '本周复习']" @change="handleChange" />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">最近一次移动：{{ lastMove }}</p>
  </DemoBlock>

  <DemoBlock title="可搜索" description="searchable 在两列头部下方显示搜索框，按 label 过滤；过滤状态下全选只作用于可见项。" :code="searchCode">
    <div class="overflow-x-auto pb-1">
      <BaseTransfer v-model="searchValue" :options="studentOptions" :titles="['全班学生', '加强辅导组']" searchable />
    </div>
  </DemoBlock>

  <DemoBlock title="禁用项与整体禁用" description="options 中 disabled 的项不可勾选也不会被全选命中；组件 disabled 时两列与按钮全部失效。">
    <div class="grid gap-6">
      <div class="overflow-x-auto pb-1">
        <BaseTransfer v-model="lockedValue" :options="lockedOptions" :titles="['可选学科', '已选学科']" />
      </div>
      <div class="overflow-x-auto pb-1">
        <BaseTransfer :model-value="['quadratic', 'circle']" :options="chapterOptions" :titles="['全部章节', '已锁定']" disabled />
      </div>
    </div>
  </DemoBlock>
</template>
