<script setup lang="ts">
import { ref } from 'vue'
import BaseSegmented from '@/components/base/BaseSegmented.vue'
import BaseTabs from '@/components/base/BaseTabs.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const tabValue = ref('doc')
const segmentedValue = ref('list')
const fullWidthValue = ref('week')

const tabItems = [
  { value: 'doc', label: '文档', icon: 'fa-book' },
  { value: 'api', label: 'API', icon: 'fa-code' },
  { value: 'examples', label: '示例', icon: 'fa-flask', badge: 3 },
]
const segmentedOptions = [
  { value: 'list', label: '列表', icon: 'fa-list' },
  { value: 'grid', label: '网格', icon: 'fa-table-cells' },
  { value: 'board', label: '看板', icon: 'fa-columns' },
]
const rangeOptions = [
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
]

const tabsCode = `<BaseTabs
  v-model="tab"
  :items="[
    { value: 'doc', label: '文档', icon: 'fa-book' },
    { value: 'api', label: 'API', icon: 'fa-code' },
    { value: 'examples', label: '示例', badge: 3 },
  ]"
/>`
</script>

<template>
  <DemoBlock title="页签" description="BaseTabs 基于 Headless UI TabGroup，items 支持 icon 和 badge。" :code="tabsCode">
    <BaseTabs v-model="tabValue" :items="tabItems" />
    <p class="mt-4 text-sm text-slate-500 dark:text-[#8a8f98]">当前页签：{{ tabValue }}</p>
  </DemoBlock>

  <DemoBlock title="分段控制" description="BaseSegmented 带滑动指示器，options 支持图标。">
    <BaseSegmented v-model="segmentedValue" :options="segmentedOptions" />
  </DemoBlock>

  <DemoBlock title="等宽与尺寸" description="fullWidth 让选项平分宽度；size 支持 sm（默认）等。">
    <div class="max-w-sm">
      <BaseSegmented v-model="fullWidthValue" :options="rangeOptions" full-width />
    </div>
  </DemoBlock>
</template>
