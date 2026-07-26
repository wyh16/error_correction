<script setup lang="ts">
import { inject } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BasePopconfirm from '@/components/base/BasePopconfirm.vue'
import BasePopover from '@/components/base/BasePopover.vue'
import BaseSlider from '@/components/base/BaseSlider.vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const basicCode = `<BasePopover placement="bottom" width-class="w-80">
  <template #trigger>
    <BaseButton size="sm" variant="secondary">视图设置</BaseButton>
  </template>
  浮层内容（点击外部自动关闭）
</BasePopover>`
</script>

<template>
  <DemoBlock title="基础气泡" description="trigger 插槽放触发器，默认插槽放浮层内容，点击外部自动关闭。" :code="basicCode">
    <div class="flex flex-wrap gap-3">
      <BasePopover>
        <template #trigger>
          <BaseButton size="sm" variant="secondary">视图设置</BaseButton>
        </template>
        <div class="grid gap-4">
          <p class="text-sm font-bold text-slate-900 dark:text-[#f7f8f8]">显示设置</p>
          <BaseSwitch :model-value="true" label="显示知识点" />
          <BaseSlider :model-value="64" label="缩放" :show-value="true" />
        </div>
      </BasePopover>

      <BasePopover placement="top" align="center" width-class="w-56">
        <template #trigger>
          <BaseButton size="sm" variant="ghost">向上弹出</BaseButton>
        </template>
        <p class="text-sm text-slate-600 dark:text-[#a8adb7]">placement="top"、align="center"、宽度 w-56。</p>
      </BasePopover>
    </div>
  </DemoBlock>

  <DemoBlock title="二次确认" description="BasePopconfirm 内置确认 / 取消按钮，danger 显示警示配色。">
    <div class="flex flex-wrap gap-3">
      <BasePopconfirm title="确认归档？" description="归档后可以在回收站找回。" @confirm="notify('success')">
        <BaseButton size="sm" variant="secondary">归档</BaseButton>
      </BasePopconfirm>
      <BasePopconfirm title="确认删除？" description="删除后不可恢复。" confirm-text="删除" danger @confirm="notify('error')">
        <BaseButton size="sm" variant="ghost">删除</BaseButton>
      </BasePopconfirm>
    </div>
  </DemoBlock>
</template>
