<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseStatusPill from '@/components/base/BaseStatusPill.vue'
import BaseTag from '@/components/base/BaseTag.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const toneCode = `<BaseTag>Neutral</BaseTag>
<BaseTag tone="accent">Accent</BaseTag>
<BaseTag tone="emerald">Done</BaseTag>
<BaseTag tone="amber">Pending</BaseTag>
<BaseTag tone="rose">Risk</BaseTag>
<BaseTag tone="blue">Info</BaseTag>`

const closableCode = `<BaseTag
  v-for="tag in tags"
  :key="tag"
  tone="accent"
  closable
  @close="removeTag(tag)"
>{{ tag }}</BaseTag>`

// 可关闭标签演示：close 事件由父组件决定移除逻辑。
const closableTags = ref(['函数', '几何', '力学', '阅读理解'])
function removeTag(tag: string) {
  closableTags.value = closableTags.value.filter(item => item !== tag)
}
function resetTags() {
  closableTags.value = ['函数', '几何', '力学', '阅读理解']
}
</script>

<template>
  <DemoBlock title="配色" description="tone 支持 neutral / accent / rose / amber / emerald / blue。" :code="toneCode">
    <div class="flex flex-wrap gap-2">
      <BaseTag>Neutral</BaseTag>
      <BaseTag tone="accent">Accent</BaseTag>
      <BaseTag tone="emerald">Done</BaseTag>
      <BaseTag tone="amber">Pending</BaseTag>
      <BaseTag tone="rose">Risk</BaseTag>
      <BaseTag tone="blue">Info</BaseTag>
    </div>
  </DemoBlock>

  <DemoBlock title="尺寸与激活态" description="size 支持 xs / sm，active 增加高亮描边。">
    <div class="flex flex-wrap items-center gap-2">
      <BaseTag size="xs" tone="accent">xs 尺寸</BaseTag>
      <BaseTag tone="accent">sm 尺寸</BaseTag>
      <BaseTag tone="accent" active>激活态</BaseTag>
      <BaseTag active>中性激活</BaseTag>
    </div>
  </DemoBlock>

  <DemoBlock title="带图标" description="icon 传入 fa-* 类名渲染前置图标，默认插槽也可自由组合图标和文字。">
    <div class="flex flex-wrap gap-2">
      <BaseTag tone="emerald" icon="fa-check">已完成</BaseTag>
      <BaseTag tone="amber" icon="fa-clock">等待中</BaseTag>
      <BaseTag tone="rose" icon="fa-xmark">失败</BaseTag>
      <BaseTag tone="blue" icon="fa-tag" size="xs">xs 图标</BaseTag>
    </div>
  </DemoBlock>

  <DemoBlock title="可关闭" description="closable 显示右侧关闭按钮，点击时触发 close 事件，是否移除由调用方决定。" :code="closableCode">
    <div class="flex flex-wrap items-center gap-2">
      <BaseTag v-for="tag in closableTags" :key="tag" tone="accent" closable @close="removeTag(tag)">{{ tag }}</BaseTag>
      <BaseButton v-if="closableTags.length === 0" size="sm" variant="secondary" @click="resetTags">重置标签</BaseButton>
    </div>
  </DemoBlock>

  <DemoBlock title="状态徽标" description="BaseStatusPill 通过 ok / loading / placeholder 表达状态，不传时为失败样式。">
    <div class="flex flex-wrap gap-2">
      <BaseStatusPill label="在线" ok />
      <BaseStatusPill label="处理中" loading />
      <BaseStatusPill label="待配置" placeholder />
      <BaseStatusPill label="失败" />
    </div>
  </DemoBlock>
</template>
