<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseTreeSelect from '@/components/base/BaseTreeSelect.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const basicCode = `<BaseTreeSelect v-model="chapter" :items="chapterTree" @change="onChange" />`

const clearableCode = `<BaseTreeSelect v-model="archive" :items="folderTree" clearable />
<BaseTreeSelect model-value="algebra-quadratic" :items="chapterTree" disabled />`

const chapterTree = [
  {
    label: '代数',
    value: 'algebra',
    children: [
      { label: '一元二次方程', value: 'algebra-quadratic' },
      { label: '不等式', value: 'algebra-inequality' },
      {
        label: '函数',
        value: 'algebra-function',
        children: [
          { label: '二次函数', value: 'func-quadratic' },
          { label: '指数与对数', value: 'func-exp-log' },
        ],
      },
    ],
  },
  {
    label: '几何',
    value: 'geometry',
    children: [
      { label: '三角形', value: 'geo-triangle' },
      { label: '圆', value: 'geo-circle' },
    ],
  },
  { label: '统计与概率', value: 'statistics' },
]

const folderTree = [
  {
    label: '错题本',
    value: 'notebook',
    icon: 'fa-book',
    children: [
      { label: '本周新增', value: 'notebook-week', icon: 'fa-calendar-week' },
      { label: '高频错题', value: 'notebook-hot', icon: 'fa-fire' },
    ],
  },
  {
    label: '试卷归档',
    value: 'papers',
    icon: 'fa-folder',
    children: [
      { label: '期中考试', value: 'papers-mid', icon: 'fa-file-lines' },
      { label: '期末考试', value: 'papers-final', icon: 'fa-file-lines' },
    ],
  },
  { label: '回收站', value: 'trash', icon: 'fa-trash-can' },
]

const chapter = ref('func-quadratic')
const folder = ref('')
const archive = ref('notebook-hot')

function onChange() {
  notify('success')
}
</script>

<template>
  <DemoBlock
    title="基础用法"
    description="点击触发器弹出目录树，仅叶子节点可选中并关闭弹层，分支节点点击不关闭；打开时自动展开选中项所在分支。"
    :code="basicCode"
  >
    <div class="grid gap-3">
      <div class="w-72">
        <BaseTreeSelect v-model="chapter" :items="chapterTree" placeholder="选择章节" @change="onChange" />
      </div>
      <p class="text-xs text-slate-500 dark:text-[#8a8f98]">当前值：{{ chapter || '（空）' }}</p>
    </div>
  </DemoBlock>

  <DemoBlock title="带图标的树" description="items 节点支持 icon 传 fa-* 类名，选中后触发器同步回显图标。">
    <div class="w-72">
      <BaseTreeSelect v-model="folder" :items="folderTree" placeholder="选择归档位置" />
    </div>
  </DemoBlock>

  <DemoBlock
    title="可清空与禁用"
    description="clearable 在有值悬停时显示清空按钮；disabled 禁止展开弹层。"
    :code="clearableCode"
  >
    <div class="grid gap-3 sm:grid-cols-2">
      <BaseTreeSelect v-model="archive" :items="folderTree" placeholder="可清空" clearable />
      <BaseTreeSelect model-value="algebra-quadratic" :items="chapterTree" disabled />
    </div>
  </DemoBlock>
</template>
