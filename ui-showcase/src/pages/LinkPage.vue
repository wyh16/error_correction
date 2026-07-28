<script setup lang="ts">
import { inject } from 'vue'
import BaseLink from '@/components/base/BaseLink.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const typeCode = `<BaseLink>默认链接</BaseLink>
<BaseLink type="accent">主题色链接</BaseLink>
<BaseLink type="success">成功链接</BaseLink>
<BaseLink type="warning">警告链接</BaseLink>
<BaseLink type="danger">危险链接</BaseLink>`

const underlineCode = `<BaseLink underline="hover">hover 时下划线（默认）</BaseLink>
<BaseLink underline="always">始终下划线</BaseLink>
<BaseLink underline="never">从不下划线</BaseLink>`

const iconCode = `<BaseLink icon="fa-book" type="accent">使用文档</BaseLink>
<BaseLink href="https://github.com" external>GitHub 仓库</BaseLink>
<BaseLink icon="fa-trash-can" type="danger" disabled>禁用的危险操作</BaseLink>`
</script>

<template>
  <DemoBlock title="链接类型" description="type 支持 default / accent / success / warning / danger 五种语义配色，accent 跟随主题色。" :code="typeCode">
    <div class="flex flex-wrap items-center gap-5">
      <BaseLink @click.prevent="notify('info')">默认链接</BaseLink>
      <BaseLink type="accent" @click.prevent="notify('info')">主题色链接</BaseLink>
      <BaseLink type="success" @click.prevent="notify('success')">成功链接</BaseLink>
      <BaseLink type="warning" @click.prevent="notify('info')">警告链接</BaseLink>
      <BaseLink type="danger" @click.prevent="notify('error')">危险链接</BaseLink>
    </div>
  </DemoBlock>

  <DemoBlock title="下划线策略" description="underline 支持 hover（悬停出现，默认）/ always（始终显示）/ never（从不显示），下划线带 4px 偏移更透气。" :code="underlineCode">
    <div class="flex flex-wrap items-center gap-5">
      <BaseLink underline="hover" @click.prevent>hover 时下划线（默认）</BaseLink>
      <BaseLink underline="always" @click.prevent>始终下划线</BaseLink>
      <BaseLink underline="never" @click.prevent>从不下划线</BaseLink>
    </div>
  </DemoBlock>

  <DemoBlock title="图标、外链与禁用" description="icon 在文字前渲染 fa-* 图标；external 以新窗口打开并自动附加右上箭头标识；disabled 移除 href、拦截点击并降低透明度。" :code="iconCode">
    <div class="flex flex-wrap items-center gap-5">
      <BaseLink icon="fa-book" type="accent" @click.prevent="notify('info')">使用文档</BaseLink>
      <BaseLink icon="fa-circle-question" @click.prevent="notify('info')">帮助中心</BaseLink>
      <BaseLink href="https://github.com" external>GitHub 仓库</BaseLink>
      <BaseLink icon="fa-trash-can" type="danger" disabled>禁用的危险操作</BaseLink>
      <BaseLink disabled>禁用的默认链接</BaseLink>
    </div>
  </DemoBlock>

  <DemoBlock title="正文内联使用" description="链接是 inline-flex 元素，可以直接嵌在段落里，与正文基线对齐。">
    <p class="max-w-xl text-sm leading-7 text-slate-600 dark:text-[#d0d6e0]">
      错题整理完成后，可以在
      <BaseLink type="accent" underline="always" @click.prevent="notify('info')">复习计划</BaseLink>
      中查看系统生成的巩固练习；如果对识别结果有疑问，请先阅读
      <BaseLink icon="fa-book" @click.prevent="notify('info')">校对指南</BaseLink>
      ，仍无法解决时再
      <BaseLink type="danger" @click.prevent="notify('error')">提交反馈</BaseLink>
      。
    </p>
  </DemoBlock>
</template>
