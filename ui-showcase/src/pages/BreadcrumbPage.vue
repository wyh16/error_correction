<script setup lang="ts">
import { inject } from 'vue'
import BaseBreadcrumb from '@/components/base/BaseBreadcrumb.vue'
import BaseBreadcrumbItem from '@/components/base/BaseBreadcrumbItem.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const breadcrumbItems = [
  { label: '首页', icon: 'fa-house', onClick: () => notify('info') },
  { label: '错题库', onClick: () => notify('info') },
  { label: '函数与导数' },
]
</script>

<template>
  <DemoBlock title="数据驱动" description="BaseBreadcrumb 通过 items 渲染，带 onClick 的中间项可点击，末项为当前页。">
    <BaseBreadcrumb :items="breadcrumbItems" />
  </DemoBlock>

  <DemoBlock title="手动组合" description="BaseBreadcrumbItem 可单独使用，current 表示当前页，disabled 禁用点击。">
    <nav class="flex items-center gap-2 text-sm">
      <BaseBreadcrumbItem label="首页" icon="fa-house" @click="notify('info')" />
      <i class="fa-solid fa-chevron-right text-[10px] text-slate-300 dark:text-[#3f4147]"></i>
      <BaseBreadcrumbItem label="禁用层级" disabled />
      <i class="fa-solid fa-chevron-right text-[10px] text-slate-300 dark:text-[#3f4147]"></i>
      <BaseBreadcrumbItem label="当前页面" current />
    </nav>
  </DemoBlock>
</template>
