<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseCascader from '@/components/base/BaseCascader.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

// 学科 → 模块 → 知识点 三级数据
const subjectOptions = [
  {
    label: '数学', value: 'math',
    children: [
      {
        label: '代数', value: 'algebra',
        children: [
          { label: '一元二次方程', value: 'quadratic' },
          { label: '函数与图像', value: 'function' },
          { label: '数列', value: 'sequence' },
        ],
      },
      {
        label: '几何', value: 'geometry',
        children: [
          { label: '三角形全等', value: 'congruent' },
          { label: '圆的性质', value: 'circle' },
        ],
      },
      { label: '概率初步', value: 'probability' },
    ],
  },
  {
    label: '物理', value: 'physics',
    children: [
      {
        label: '力学', value: 'mechanics',
        children: [
          { label: '牛顿运动定律', value: 'newton' },
          { label: '功和能', value: 'energy' },
        ],
      },
      {
        label: '电学', value: 'electricity',
        children: [
          { label: '欧姆定律', value: 'ohm' },
          { label: '电功率', value: 'power' },
        ],
      },
    ],
  },
  {
    label: '化学', value: 'chemistry',
    children: [
      { label: '化学方程式', value: 'equation' },
      { label: '溶液与浓度', value: 'solution' },
    ],
  },
]

// 含禁用节点的数据：禁用的中间节点与叶子都不可点
const disabledOptions = [
  {
    label: '语文', value: 'chinese',
    children: [
      { label: '古诗文默写', value: 'poem' },
      { label: '阅读理解', value: 'reading', disabled: true },
      { label: '作文', value: 'writing' },
    ],
  },
  {
    label: '英语（暂未开放）', value: 'english', disabled: true,
    children: [
      { label: '完形填空', value: 'cloze' },
    ],
  },
]

const basicValue = ref<string[]>([])
const eventValue = ref<string[]>(['math', 'algebra', 'quadratic'])
const disabledDemoValue = ref<string[]>([])
const clearableValue = ref<string[]>(['physics', 'mechanics', 'newton'])
const lastPath = ref('（尚未选择）')

function handleChange(values: string[], nodes: Array<{ label: string }>) {
  lastPath.value = values.length ? nodes.map(node => node.label).join(' / ') : '（已清空）'
  notify(values.length ? 'success' : 'info')
}

const basicCode = `<BaseCascader
  v-model="value"
  :options="subjectOptions"
  placeholder="选择知识点"
/>`

const eventCode = `<BaseCascader
  v-model="value"
  :options="subjectOptions"
  @change="(values, nodes) => showPath(nodes)"
/>`

const clearableCode = `<BaseCascader v-model="value" :options="subjectOptions" clearable />`
</script>

<template>
  <DemoBlock title="基础用法" description="options 为 { label, value, children } 嵌套结构；点击有子级的节点展开下一列，点击叶子节点提交完整路径并关闭面板。" :code="basicCode">
    <div class="max-w-xs">
      <BaseCascader v-model="basicValue" :options="subjectOptions" placeholder="选择知识点" />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">当前值：{{ basicValue.length ? basicValue.join(' / ') : '（空）' }}</p>
  </DemoBlock>

  <DemoBlock title="change 事件" description="选中叶子或清空时触发 change，参数为值路径数组和节点对象数组；再次打开面板会按已选值还原激活链路。" :code="eventCode">
    <div class="max-w-xs">
      <BaseCascader v-model="eventValue" :options="subjectOptions" clearable @change="handleChange" />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">最近一次选择：{{ lastPath }}</p>
  </DemoBlock>

  <DemoBlock title="禁用选项与整体禁用" description="节点 disabled 后不可点击且不展开子级；组件 disabled 时无法打开面板。">
    <div class="flex flex-wrap gap-4">
      <div class="w-56">
        <BaseCascader v-model="disabledDemoValue" :options="disabledOptions" placeholder="含禁用节点" />
      </div>
      <div class="w-56">
        <BaseCascader :model-value="['math', 'algebra', 'quadratic']" :options="subjectOptions" disabled />
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="可清空" description="clearable 在有选中值时悬停触发器显示清空按钮，点击回抛空数组。" :code="clearableCode">
    <div class="max-w-xs">
      <BaseCascader v-model="clearableValue" :options="subjectOptions" clearable placeholder="选择知识点" />
    </div>
  </DemoBlock>
</template>
