<script setup lang="ts">
import BaseAvatarGroup from '@/components/base/BaseAvatarGroup.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const team = [
  { name: '林小哲', tone: 'accent' },
  { name: '苏晓', tone: 'blue' },
  { name: '陈一鸣', tone: 'emerald' },
  { name: '周可', tone: 'rose' },
  { name: '王梓', tone: 'neutral' },
  { name: '李想', tone: 'blue' },
]

const mixed = [
  { src: 'https://picsum.photos/seed/avatar1/80', name: '张老师' },
  { src: 'https://picsum.photos/seed/avatar2/80', name: '刘老师' },
  { name: '课代表', tone: 'accent' },
  { icon: 'fa-robot', tone: 'emerald', name: 'AI 助教' },
]

const basicCode = `<BaseAvatarGroup :avatars="team" />

const team = [
  { name: '林小哲', tone: 'accent' },
  { name: '苏晓', tone: 'blue' },
  { src: 'https://picsum.photos/seed/avatar1/80', name: '张老师' },
]`

const maxCode = `<BaseAvatarGroup :avatars="team" :max="3" />`

const looseCode = `<BaseAvatarGroup :avatars="team" :overlap="false" :max="4" />`
</script>

<template>
  <DemoBlock
    title="基础重叠"
    description="avatars 的每一项透传给 BaseAvatar（src / name / icon / tone），默认负间距堆叠，描边把上层头像从下层分离出来。"
    :code="basicCode"
  >
    <div class="grid gap-4">
      <BaseAvatarGroup :avatars="team" />
      <BaseAvatarGroup :avatars="mixed" />
    </div>
  </DemoBlock>

  <DemoBlock
    title="溢出折叠"
    description="max 限制最多展示的头像数，其余折叠为 +N 徽章；悬停徽章可查看未展示成员的名单。"
    :code="maxCode"
  >
    <BaseAvatarGroup :avatars="team" :max="3" />
  </DemoBlock>

  <DemoBlock title="松散排列" description="overlap 关闭后改为 gap 间距平铺，不再重叠。" :code="looseCode">
    <BaseAvatarGroup :avatars="team" :overlap="false" :max="4" />
  </DemoBlock>

  <DemoBlock title="尺寸" description="size 透传给每个 BaseAvatar，负间距随尺寸联动，重叠比例保持一致。">
    <div class="grid gap-4">
      <BaseAvatarGroup :avatars="team" size="xs" :max="5" />
      <BaseAvatarGroup :avatars="team" size="sm" :max="5" />
      <BaseAvatarGroup :avatars="team" size="md" :max="5" />
      <BaseAvatarGroup :avatars="team" size="lg" :max="5" />
    </div>
  </DemoBlock>
</template>
