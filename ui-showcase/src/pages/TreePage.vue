<script setup lang="ts">
import { ref } from 'vue'
import BaseTree from '@/components/base/BaseTree.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const treeValue = ref('algebra')

const treeItems = [
  {
    value: 'math',
    label: '数学',
    icon: 'fa-square-root-variable',
    children: [
      { value: 'algebra', label: '代数' },
      { value: 'geometry', label: '几何' },
      { value: 'probability', label: '概率统计' },
    ],
  },
  {
    value: 'physics',
    label: '物理',
    icon: 'fa-atom',
    children: [
      { value: 'mechanics', label: '力学' },
      { value: 'electricity', label: '电磁学' },
    ],
  },
  { value: 'english', label: '英语', icon: 'fa-language' },
]
</script>

<template>
  <DemoBlock title="基础用法" description="items 嵌套 children 表达层级，支持 icon；defaultExpanded 控制初始展开。">
    <div class="max-w-sm">
      <BaseTree v-model="treeValue" :items="treeItems" :default-expanded="['math']" />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">当前选中：{{ treeValue }}</p>
  </DemoBlock>
</template>
