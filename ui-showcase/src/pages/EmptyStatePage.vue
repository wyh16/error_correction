<script setup lang="ts">
import { inject } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseEmptyState from '@/components/base/BaseEmptyState.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void
</script>

<template>
  <DemoBlock title="基础用法" description="icon + title + description 组合的空数据占位。">
    <BaseEmptyState icon="fa-inbox" title="暂无错题" description="上传第一份试卷，开始积累你的错题本。" />
  </DemoBlock>

  <DemoBlock title="带操作区" description="默认插槽放置引导操作按钮。">
    <BaseEmptyState icon="fa-magnifying-glass" title="没有匹配结果" description="换个关键词，或清空筛选条件再试。">
      <BaseButton size="sm" variant="secondary" @click="notify('info')">清空筛选</BaseButton>
      <BaseButton size="sm" @click="notify('info')">上传试卷</BaseButton>
    </BaseEmptyState>
  </DemoBlock>
</template>
