<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseButtonGroup from '@/components/base/BaseButtonGroup.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

// 编辑器工具组的激活状态演示
const activeMarks = ref<string[]>(['bold'])
function toggleMark(mark: string) {
  activeMarks.value = activeMarks.value.includes(mark)
    ? activeMarks.value.filter(item => item !== mark)
    : [...activeMarks.value, mark]
}

const pagerCode = `<BaseButtonGroup>
  <BaseButton variant="secondary" icon="fa-chevron-left">上一页</BaseButton>
  <BaseButton variant="secondary">本周</BaseButton>
  <BaseButton variant="secondary">下一页</BaseButton>
</BaseButtonGroup>`

const toolbarCode = `<!-- 激活项切到 primary 变体，形成分段控件效果 -->
<BaseButtonGroup>
  <BaseButton size="sm" :variant="isActive('bold') ? 'primary' : 'secondary'" icon="fa-bold" @click="toggle('bold')" />
  <BaseButton size="sm" :variant="isActive('italic') ? 'primary' : 'secondary'" icon="fa-italic" @click="toggle('italic')" />
  <BaseButton size="sm" :variant="isActive('underline') ? 'primary' : 'secondary'" icon="fa-underline" @click="toggle('underline')" />
</BaseButtonGroup>`

const looseCode = `<!-- attached=false 时不拼接，仅按 gap-2 松散排列 -->
<BaseButtonGroup :attached="false">
  <BaseButton variant="secondary">保存草稿</BaseButton>
  <BaseButton variant="secondary">预览</BaseButton>
  <BaseButton>发布</BaseButton>
</BaseButtonGroup>`
</script>

<template>
  <DemoBlock title="基础用法" description="把若干 BaseButton 放进默认插槽即可拼接成一体外观：内侧圆角被去除、相邻边框叠为一条。组内按钮请保持相同的 size 与 variant。" :code="pagerCode">
    <BaseButtonGroup>
      <BaseButton variant="secondary" icon="fa-chevron-left" @click="notify('info')">上一页</BaseButton>
      <BaseButton variant="secondary" @click="notify('info')">本周</BaseButton>
      <BaseButton variant="secondary" @click="notify('info')">下一页</BaseButton>
    </BaseButtonGroup>
  </DemoBlock>

  <DemoBlock title="图标按钮组" description="纯图标按钮拼接成编辑器风格的工具组，点击切换激活态：激活项切换为 primary 变体，形成分段控件效果。" :code="toolbarCode">
    <BaseButtonGroup>
      <BaseButton
        size="sm"
        :variant="activeMarks.includes('bold') ? 'primary' : 'secondary'"
        icon="fa-bold"
        @click="toggleMark('bold')"
      />
      <BaseButton
        size="sm"
        :variant="activeMarks.includes('italic') ? 'primary' : 'secondary'"
        icon="fa-italic"
        @click="toggleMark('italic')"
      />
      <BaseButton
        size="sm"
        :variant="activeMarks.includes('underline') ? 'primary' : 'secondary'"
        icon="fa-underline"
        @click="toggleMark('underline')"
      />
    </BaseButtonGroup>
    <p class="mt-3 text-xs text-slate-400 dark:text-[#62666d]">当前激活：{{ activeMarks.length ? activeMarks.join(' / ') : '（无）' }}</p>
  </DemoBlock>

  <DemoBlock title="松散排列对比" description="attached 默认为 true；设为 false 时不做任何拼接处理，只按 gap-2 均匀排列，适合语义上相关但视觉独立的一组操作。" :code="looseCode">
    <div class="grid gap-4">
      <div class="flex items-center gap-4">
        <span class="w-24 text-xs text-slate-400 dark:text-[#62666d]">attached</span>
        <BaseButtonGroup>
          <BaseButton variant="secondary" @click="notify('info')">保存草稿</BaseButton>
          <BaseButton variant="secondary" @click="notify('info')">预览</BaseButton>
          <BaseButton variant="secondary" @click="notify('success')">发布</BaseButton>
        </BaseButtonGroup>
      </div>
      <div class="flex items-center gap-4">
        <span class="w-24 text-xs text-slate-400 dark:text-[#62666d]">attached=false</span>
        <BaseButtonGroup :attached="false">
          <BaseButton variant="secondary" @click="notify('info')">保存草稿</BaseButton>
          <BaseButton variant="secondary" @click="notify('info')">预览</BaseButton>
          <BaseButton @click="notify('success')">发布</BaseButton>
        </BaseButtonGroup>
      </div>
    </div>
  </DemoBlock>
</template>
