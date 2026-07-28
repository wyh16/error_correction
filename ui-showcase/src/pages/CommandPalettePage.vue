<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCommandPalette from '@/components/base/BaseCommandPalette.vue'
import BaseKbd from '@/components/base/BaseKbd.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void
const paletteOpen = ref(false)

const commandItems = [
  { value: 'new', label: '新建错题', description: '上传图片并自动识别', icon: 'fa-plus', group: '常用', shortcut: 'N' },
  { value: 'search', label: '搜索题目', description: '按题干或知识点搜索', icon: 'fa-magnifying-glass', group: '常用', shortcut: '/' },
  { value: 'review', label: '开始复习', description: '进入今日复习队列', icon: 'fa-book-open', group: '常用' },
  { value: 'export', label: '导出错题本', description: '导出为 PDF', icon: 'fa-file-export', group: '数据' },
  { value: 'theme', label: '切换主题', description: '深浅色切换', icon: 'fa-moon', group: '设置' },
]

</script>

<template>
  <DemoBlock title="命令面板" description="items 支持分组、图标、描述和快捷键，选中后触发 select 事件；支持键盘上下移动与回车确认。">
    <div class="flex flex-wrap items-center gap-3">
      <BaseButton size="sm" @click="paletteOpen = true">打开命令面板</BaseButton>
      <span class="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8a8f98]">
        本站顶栏的 <BaseKbd keys="Ctrl+K" /> 快速跳转就是用它实现的
      </span>
    </div>

    <BaseCommandPalette
      v-model:open="paletteOpen"
      :items="commandItems"
      placeholder="搜索命令，例如：复习"
      @select="() => notify('info')"
    />
  </DemoBlock>
</template>
