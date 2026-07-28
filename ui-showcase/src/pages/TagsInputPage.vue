<script setup lang="ts">
import { ref } from 'vue'
import BaseTagsInput from '@/components/base/BaseTagsInput.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const basicTags = ref(['函数', '数列', '立体几何'])
const limitedTags = ref(['力学', '电磁学'])
const disabledTags = ref(['文言文', '古诗词鉴赏'])

const basicCode = `<BaseTagsInput
  v-model="tags"
  placeholder="输入知识点后按回车或逗号添加"
  @add="onAdd"
  @remove="onRemove"
/>`

const maxCode = `<!-- max 为 0 表示不限制；达到上限后输入框隐藏，仍可删除已有标签 -->
<BaseTagsInput v-model="tags" :max="3" placeholder="最多添加 3 个标签" />`
</script>

<template>
  <DemoBlock title="基础用法" description="v-model 绑定字符串数组；输入后按回车或逗号提交标签，输入框为空时按退格删除最后一个标签，点击标签上的关闭按钮可移除。" :code="basicCode">
    <div class="grid gap-3">
      <BaseTagsInput v-model="basicTags" placeholder="输入知识点后按回车或逗号添加" />
      <p class="text-xs text-slate-500 dark:text-[#8a8f98]">当前值：{{ JSON.stringify(basicTags) }}</p>
    </div>
  </DemoBlock>

  <DemoBlock title="数量上限" description="max 限制标签数量（0 表示不限制），达到上限后输入框自动隐藏，删除标签后恢复输入。" :code="maxCode">
    <div class="grid gap-3">
      <BaseTagsInput v-model="limitedTags" :max="3" placeholder="最多添加 3 个标签" />
      <p class="text-xs text-slate-500 dark:text-[#8a8f98]">已添加 {{ limitedTags.length }} / 3 个标签</p>
    </div>
  </DemoBlock>

  <DemoBlock title="禁用与去重" description="disabled 时整体降低透明度且不可交互；默认不允许重复标签（重复输入只清空输入框），传入 allow-duplicates 可关闭去重。">
    <div class="grid gap-3">
      <BaseTagsInput v-model="disabledTags" disabled placeholder="禁用状态" />
      <BaseTagsInput v-model="basicTags" placeholder="试试输入一个已存在的标签，会被自动忽略" />
    </div>
  </DemoBlock>
</template>
