<script setup lang="ts">
import { ref } from 'vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const alertVisible = ref(true)

const toneCode = `<BaseAlert tone="info" title="提示" description="信息状态样式。" />
<BaseAlert tone="success" title="成功" description="成功状态样式。" />
<BaseAlert tone="warning" title="注意" description="警告状态样式。" />
<BaseAlert tone="danger" title="出错了" description="危险状态样式。" />`
</script>

<template>
  <DemoBlock title="四种状态" description="tone 支持 info、success、warning、danger，图标自动匹配。" :code="toneCode">
    <div class="grid gap-3">
      <BaseAlert tone="info" title="提示" description="信息状态样式。" />
      <BaseAlert tone="success" title="成功" description="成功状态样式。" />
      <BaseAlert tone="warning" title="注意" description="警告状态样式。" />
      <BaseAlert tone="danger" title="出错了" description="危险状态样式。" />
    </div>
  </DemoBlock>

  <DemoBlock title="自定义图标与纯标题" description="icon 覆盖默认图标；description 可省略。">
    <div class="grid gap-3">
      <BaseAlert tone="info" icon="fa-lightbulb" title="自定义图标" description="传入 icon 覆盖默认图标。" />
      <BaseAlert tone="success" title="只有标题的提示" />
    </div>
  </DemoBlock>

  <DemoBlock title="可关闭与操作区" description="closable 显示关闭按钮并触发 close 事件，默认插槽可以放操作按钮。">
    <div class="grid gap-3">
      <BaseAlert
        v-if="alertVisible"
        tone="success"
        title="操作成功"
        description="点击右上角可以关闭这条提示。"
        closable
        @close="alertVisible = false"
      />
      <BaseAlert v-else tone="info" title="Alert 已关闭" description="点击按钮重新显示。">
        <BaseButton size="sm" variant="ghost" @click="alertVisible = true">重新显示</BaseButton>
      </BaseAlert>
    </div>
  </DemoBlock>
</template>
