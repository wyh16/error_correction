<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'
import BaseSurface from '@/components/base/BaseSurface.vue'
import BaseTag from '@/components/base/BaseTag.vue'
import DemoBlock from '~/components/DemoBlock.vue'
</script>

<template>
  <DemoBlock title="基础用法" description="BaseCard 是带阴影、圆角和内边距的通用卡片容器。">
    <BaseCard padding="p-4">
      <p class="text-sm font-semibold text-slate-900 dark:text-[#f7f8f8]">卡片标题</p>
      <p class="mt-1 text-sm text-slate-500 dark:text-[#8a8f98]">卡片内容区域，可以放任意元素。</p>
    </BaseCard>
  </DemoBlock>

  <DemoBlock title="自定义内边距与圆角" description="padding / rounded 直接接受 Tailwind 类。">
    <div class="grid gap-3 sm:grid-cols-3">
      <BaseCard padding="p-2" rounded="rounded-md">
        <p class="text-xs text-slate-500 dark:text-[#8a8f98]">p-2 / rounded-md</p>
      </BaseCard>
      <BaseCard>
        <p class="text-xs text-slate-500 dark:text-[#8a8f98]">默认 p-4 / rounded-lg</p>
      </BaseCard>
      <BaseCard padding="p-6" rounded="rounded-2xl">
        <p class="text-xs text-slate-500 dark:text-[#8a8f98]">p-6 / rounded-2xl</p>
      </BaseCard>
    </div>
  </DemoBlock>

  <DemoBlock title="轻量表面" description="BaseSurface 是更轻的表面容器，as 可更换标签，hoverable 控制悬停变色。">
    <div class="grid gap-3 sm:grid-cols-2">
      <BaseSurface class="p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-slate-900 dark:text-[#f7f8f8]">可悬停（默认）</p>
          <BaseTag size="xs" tone="accent">hoverable</BaseTag>
        </div>
        <p class="mt-1 text-sm text-slate-500 dark:text-[#8a8f98]">背景更淡、层级更低的容器。</p>
      </BaseSurface>
      <BaseSurface class="p-4" :hoverable="false">
        <p class="text-sm font-semibold text-slate-900 dark:text-[#f7f8f8]">静态表面</p>
        <p class="mt-1 text-sm text-slate-500 dark:text-[#8a8f98]">hoverable 设为 false 后无悬停效果。</p>
      </BaseSurface>
    </div>
  </DemoBlock>
</template>
