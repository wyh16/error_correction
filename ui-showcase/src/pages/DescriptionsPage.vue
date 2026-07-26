<script setup lang="ts">
import BaseDescriptions from '@/components/base/BaseDescriptions.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const userItems = [
  { label: '姓名', value: '李佳琪' },
  { label: '年级', value: '高二（3）班' },
  { label: '手机号', value: '138****6672' },
  { label: '邮箱', value: 'jiaqi.li@example.com' },
  { label: '注册时间', value: '2025-09-12 10:24' },
  { label: '账号状态', value: '正常' },
]

const orderItems = [
  { label: '订单编号', value: 'ORD-20260718-0042' },
  { label: '商品名称', value: '错题本会员（年卡）' },
  { label: '支付方式', value: '微信支付' },
  { label: '实付金额', value: '¥ 128.00' },
  { label: '下单时间', value: '2026-07-18 21:05' },
  { label: '订单状态', value: '已完成' },
]

const compactItems = [
  { label: '学科', value: '数学' },
  { label: '章节', value: '第三章 函数' },
  { label: '知识点', value: '二次函数图像与性质' },
  { label: '题型', value: '选择题' },
  { label: '难度', value: '中等' },
  { label: '错误次数', value: '3 次' },
]

const basicCode = `<BaseDescriptions
  title="用户信息"
  :columns="2"
  :items="[
    { label: '姓名', value: '李佳琪' },
    { label: '年级', value: '高二（3）班' },
    { label: '手机号', value: '138****6672' },
    { label: '邮箱', value: 'jiaqi.li@example.com' },
  ]"
/>`

const borderedCode = `<BaseDescriptions title="订单详情" bordered :columns="2" :items="orderItems" />`

const compactCode = `<BaseDescriptions bordered :columns="3" size="sm" :items="compactItems" />`
</script>

<template>
  <DemoBlock title="基础用法" description="传入 items（{ label, value } 数组）渲染描述列表，columns 控制 sm 及以上屏幕的列数，小屏自动降为单列，title 在列表上方渲染标题。" :code="basicCode">
    <BaseDescriptions title="用户信息" :columns="2" :items="userItems" />
  </DemoBlock>

  <DemoBlock title="带边框" description="bordered 切换为表格风格：每个单元格有边框，标签列使用浅色背景，适合订单详情等正式信息展示。" :code="borderedCode">
    <BaseDescriptions title="订单详情" bordered :columns="2" :items="orderItems" />
  </DemoBlock>

  <DemoBlock title="多列与紧凑尺寸" description="columns 支持 1-4 列；size 设为 sm 时使用更小的字号和内边距，适合信息密度较高的场景。" :code="compactCode">
    <BaseDescriptions bordered :columns="3" size="sm" :items="compactItems" />
  </DemoBlock>
</template>
