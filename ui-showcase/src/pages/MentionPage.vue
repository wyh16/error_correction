<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseMention from '@/components/base/BaseMention.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const basicCode = `<BaseMention
  v-model="comment"
  :options="members"
  placeholder="输入 @ 提及同事"
  @select="onSelect"
/>`

const topicCode = `<BaseMention v-model="post" trigger="#" :options="topics" :rows="2" />`

const members = [
  { value: 'zhangsan', label: '张三' },
  { value: 'lisi', label: '李四' },
  { value: 'wangwu', label: '王五' },
  { value: 'zhaoliu', label: '赵六' },
  { value: 'sunqi', label: '孙七' },
]

const topics = [
  { value: 'math', label: '数学错题' },
  { value: 'physics', label: '物理错题' },
  { value: 'review', label: '每周复盘' },
  { value: 'exam', label: '考前冲刺' },
]

const comment = ref('这道题请 ')
const post = ref('')
const disabledText = ref('已归档的讨论不支持继续 @ 提及。')

function onSelect() {
  notify('success')
}
</script>

<template>
  <DemoBlock
    title="基础用法"
    description="输入 @ 弹出建议面板，继续输入按 label 或 value 过滤；方向键移动高亮、Enter 或点击选中，Escape 关闭。"
    :code="basicCode"
  >
    <div class="grid gap-3">
      <BaseMention v-model="comment" :options="members" placeholder="输入 @ 提及同事" @select="onSelect" />
      <p class="text-xs text-slate-500 dark:text-[#8a8f98]">内容：{{ comment || '（空）' }}</p>
    </div>
  </DemoBlock>

  <DemoBlock
    title="话题模式"
    description="trigger 可替换为任意触发字符，例如用 # 插入话题标签。"
    :code="topicCode"
  >
    <BaseMention v-model="post" trigger="#" :options="topics" :rows="2" placeholder="输入 # 关联话题" />
  </DemoBlock>

  <DemoBlock title="禁用" description="disabled 禁止编辑，也不再弹出建议面板。">
    <BaseMention v-model="disabledText" :options="members" disabled />
  </DemoBlock>
</template>
