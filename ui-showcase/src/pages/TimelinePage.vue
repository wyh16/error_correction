<script setup lang="ts">
import BaseTimeline from '@/components/base/BaseTimeline.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const basicCode = `<BaseTimeline :items="items" />

const items = [
  { label: '创建学习计划', description: '制定本学期数学错题复习计划', time: '09:00' },
  { label: '完成函数专题', description: '共整理 12 道错题，正确率提升至 85%', time: '14:30' },
  { label: '生成阶段报告', time: '18:00' },
]`

const toneCode = `<BaseTimeline :items="orderItems" />

const orderItems = [
  { label: '订单已提交', icon: 'fa-file-circle-check', tone: 'blue', time: '10:02' },
  { label: '支付成功', icon: 'fa-credit-card', tone: 'emerald', time: '10:03' },
  { label: '等待发货', icon: 'fa-clock', tone: 'amber', time: '10:05' },
  { label: '物流异常', description: '包裹滞留中转站，已联系承运商处理', icon: 'fa-triangle-exclamation', tone: 'rose', time: '次日 08:40' },
]`

const pendingCode = `<BaseTimeline :items="progressItems" pending />`

const basicItems = [
  { label: '创建学习计划', description: '制定本学期数学错题复习计划', time: '09:00' },
  { label: '完成函数专题', description: '共整理 12 道错题，正确率提升至 85%', time: '14:30' },
  { label: '生成阶段报告', time: '18:00' },
]

const orderItems = [
  { label: '订单已提交', icon: 'fa-file-circle-check', tone: 'blue', time: '10:02' },
  { label: '支付成功', icon: 'fa-credit-card', tone: 'emerald', time: '10:03' },
  { label: '等待发货', icon: 'fa-clock', tone: 'amber', time: '10:05' },
  { label: '物流异常', description: '包裹滞留中转站，已联系承运商处理', icon: 'fa-triangle-exclamation', tone: 'rose', time: '次日 08:40' },
]

const progressItems = [
  { label: '上传错题照片', description: '已识别 8 道题目', tone: 'emerald', time: '20:11' },
  { label: 'OCR 解析完成', description: '题干与答案已拆分入库', tone: 'emerald', time: '20:12' },
  { label: 'AI 正在生成解析', description: '预计还需 1 分钟', time: '20:13' },
]
</script>

<template>
  <DemoBlock title="基础用法" description="items 传入 label / description / time，按时间顺序垂直排列。" :code="basicCode">
    <BaseTimeline :items="basicItems" class="max-w-md" />
  </DemoBlock>

  <DemoBlock title="配色与图标" description="tone 支持 accent / emerald / amber / rose / blue；传入 icon 时节点渲染为图标圆。" :code="toneCode">
    <BaseTimeline :items="orderItems" class="max-w-md" />
  </DemoBlock>

  <DemoBlock title="进行中状态" description="pending 在末尾追加一个脉冲占位节点，表示后续事件仍在产生。" :code="pendingCode">
    <BaseTimeline :items="progressItems" pending class="max-w-md" />
  </DemoBlock>
</template>
