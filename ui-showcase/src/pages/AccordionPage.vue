<script setup lang="ts">
import { ref } from 'vue'
import BaseAccordion from '@/components/base/BaseAccordion.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const accordionValue = ref('table')
const multiValue = ref(['table'])

const accordionItems = [
  { value: 'table', label: '表格组件', content: 'BaseTable 负责稳定渲染，BaseDataTable 增加搜索、排序和分页。' },
  { value: 'overlay', label: '浮层组件', content: 'BasePopover 和 BaseCommandPalette 用于轻量浮层与全局命令。' },
  { value: 'identity', label: '身份组件', content: 'BaseAvatar 支持图片、姓名缩写和图标兜底。' },
]

const iconValue = ref('table')
const iconItems = [
  { value: 'table', label: '表格组件', icon: 'fa-table', content: 'BaseTable 负责稳定渲染，BaseDataTable 增加搜索、排序和分页。' },
  { value: 'overlay', label: '浮层组件', icon: 'fa-layer-group', content: 'BasePopover 和 BaseCommandPalette 用于轻量浮层与全局命令。' },
  { value: 'identity', label: '身份组件', icon: 'fa-user', content: 'BaseAvatar 支持图片、姓名缩写和图标兜底。' },
]

const ghostValue = ref('')
const iconGhostCode = `<!-- items 中可为每项设置 icon（Font Awesome 类名） -->
const items = [
  { value: 'table', label: '表格组件', icon: 'fa-table', content: '...' },
]

<BaseAccordion v-model="value" :items="items" />
<BaseAccordion v-model="value" :items="items" ghost />`
</script>

<template>
  <DemoBlock title="单开模式（默认）" description="modelValue 为字符串，同一时刻只展开一项。">
    <BaseAccordion v-model="accordionValue" :items="accordionItems" />
  </DemoBlock>

  <DemoBlock title="多开模式" description="multiple 开启后 modelValue 为数组，可同时展开多项。">
    <BaseAccordion v-model="multiValue" :items="accordionItems" multiple />
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">展开中：{{ multiValue }}</p>
  </DemoBlock>

  <DemoBlock title="标题图标" description="items 中为某一项设置 icon（Font Awesome 类名）后，会渲染在标题文字之前。" :code="iconGhostCode">
    <BaseAccordion v-model="iconValue" :items="iconItems" />
  </DemoBlock>

  <DemoBlock title="幽灵变体" description="ghost 去掉外层边框、背景和项之间的分隔线，只保留可展开的行，适合嵌入已有卡片或侧栏。">
    <BaseAccordion v-model="ghostValue" :items="iconItems" ghost />
  </DemoBlock>
</template>
