<script setup lang="ts">
import BaseDivider from '@/components/base/BaseDivider.vue'
import BaseTag from '@/components/base/BaseTag.vue'
import DemoBlock from '~/components/DemoBlock.vue'
</script>

<template>
  <DemoBlock title="水平分隔" description="默认水平方向，label 在中间显示分组文字。">
    <div class="grid gap-4">
      <p class="text-sm text-slate-600 dark:text-[#a8adb7]">第一段内容</p>
      <BaseDivider />
      <p class="text-sm text-slate-600 dark:text-[#a8adb7]">第二段内容</p>
      <BaseDivider label="或者" />
      <p class="text-sm text-slate-600 dark:text-[#a8adb7]">第三段内容</p>
    </div>
  </DemoBlock>

  <DemoBlock title="垂直分隔" description="orientation 设为 vertical，用于行内元素之间。">
    <div class="flex h-8 items-center">
      <BaseTag>标签 A</BaseTag>
      <BaseDivider orientation="vertical" />
      <BaseTag tone="accent">标签 B</BaseTag>
      <BaseDivider orientation="vertical" />
      <BaseTag tone="emerald">标签 C</BaseTag>
    </div>
  </DemoBlock>
</template>
