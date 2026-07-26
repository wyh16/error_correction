<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BasePanel from '@/components/base/BasePanel.vue'
import BasePanelTitle from '@/components/base/BasePanelTitle.vue'
import BaseTag from '@/components/base/BaseTag.vue'
import DemoBlock from '~/components/DemoBlock.vue'
</script>

<template>
  <DemoBlock title="完整结构" description="header / default / footer 三个插槽，BasePanelTitle 提供带图标的标题。">
    <BasePanel class="h-64">
      <template #header>
        <div class="flex w-full items-center justify-between">
          <BasePanelTitle icon="fa-layer-group">面板标题</BasePanelTitle>
          <BaseTag size="xs" tone="accent">header 插槽</BaseTag>
        </div>
      </template>
      <p class="text-sm leading-6 text-slate-600 dark:text-[#a8adb7]">
        主体区域默认可滚动（scrollBody），适合列表和长内容。bodyClass 可覆盖内边距。
      </p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton size="sm" variant="secondary">取消</BaseButton>
          <BaseButton size="sm">确认</BaseButton>
        </div>
      </template>
    </BasePanel>
  </DemoBlock>

  <DemoBlock title="仅主体" description="不传 header / footer 插槽时只渲染主体。">
    <BasePanel body-class="p-6">
      <p class="text-sm text-slate-600 dark:text-[#a8adb7]">bodyClass 设为 p-6 的纯主体面板。</p>
    </BasePanel>
  </DemoBlock>
</template>
