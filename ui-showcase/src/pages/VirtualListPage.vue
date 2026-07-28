<script setup lang="ts">
import BaseTag from '@/components/base/BaseTag.vue'
import BaseVirtualList from '@/components/base/BaseVirtualList.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const bigList = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  title: `错题 #${i + 1}`,
  subject: ['数学', '物理', '英语'][i % 3],
}))
</script>

<template>
  <DemoBlock title="虚拟渲染 5000 条" description="只渲染可视区域内的行；itemHeight 与 height 决定可见数量，overscan 控制预渲染行数。作用域插槽拿到 item 和 index。">
    <BaseVirtualList :items="bigList" :item-height="44" :height="320">
      <template #default="{ item }">
        <div class="flex h-11 items-center justify-between border-b border-slate-100 px-4 dark:border-white/[0.05]">
          <span class="text-sm text-slate-700 dark:text-[#d0d6e0]">{{ item.title }}</span>
          <BaseTag size="xs">{{ item.subject }}</BaseTag>
        </div>
      </template>
    </BaseVirtualList>
  </DemoBlock>
</template>
