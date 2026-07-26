<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseStepper from '@/components/base/BaseStepper.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const stepValue = ref('recognize')

const steps = [
  { value: 'upload', label: '上传试卷', description: '拖入图片或 PDF' },
  { value: 'recognize', label: '智能识别', description: 'OCR 与切题' },
  { value: 'review', label: '核对结果', description: '确认题目与答案' },
  { value: 'done', label: '完成入库', description: '同步到错题本' },
]
const stepOrder = steps.map(step => step.value)

function move(offset: number) {
  const index = stepOrder.indexOf(stepValue.value) + offset
  if (index >= 0 && index < stepOrder.length) stepValue.value = stepOrder[index]
}
</script>

<template>
  <DemoBlock title="水平步骤条" description="steps 支持 label / description，当前项之前自动标记为完成。">
    <BaseStepper v-model="stepValue" :steps="steps" />
    <div class="mt-5 flex gap-2">
      <BaseButton size="sm" variant="secondary" @click="move(-1)">上一步</BaseButton>
      <BaseButton size="sm" @click="move(1)">下一步</BaseButton>
    </div>
  </DemoBlock>

  <DemoBlock title="垂直方向" description="direction 设为 vertical 时纵向排列，适合侧边流程导航。">
    <div class="max-w-xs">
      <BaseStepper v-model="stepValue" :steps="steps" direction="vertical" />
    </div>
  </DemoBlock>

  <DemoBlock title="仅展示模式" description="clickable 设为 false 后步骤不可点击、无悬停效果，只作为流程进度展示，由外部按钮驱动。">
    <BaseStepper v-model="stepValue" :steps="steps" :clickable="false" />
    <div class="mt-5 flex gap-2">
      <BaseButton size="sm" variant="secondary" @click="move(-1)">上一步</BaseButton>
      <BaseButton size="sm" @click="move(1)">下一步</BaseButton>
    </div>
  </DemoBlock>
</template>
