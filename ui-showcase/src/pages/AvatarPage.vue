<script setup lang="ts">
import BaseAvatar from '@/components/base/BaseAvatar.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const shapeCode = `<BaseAvatar name="圆形" />
<BaseAvatar name="方形" shape="square" />
<BaseAvatar name="在线" status="online" />
<BaseAvatar name="离线" status="offline" />
<BaseAvatar name="忙碌" status="busy" />`
</script>

<template>
  <DemoBlock title="内容类型" description="优先显示 src 图片，其次 name 缩写，最后 icon 兜底。">
    <div class="flex flex-wrap items-center gap-3">
      <BaseAvatar src="/logo.svg" name="Logo" />
      <BaseAvatar name="小哲" />
      <BaseAvatar name="Math Tutor" tone="blue" />
      <BaseAvatar icon="fa-user-graduate" tone="emerald" />
    </div>
  </DemoBlock>

  <DemoBlock title="尺寸" description="size 支持 xs / sm / md / lg。">
    <div class="flex flex-wrap items-end gap-3">
      <BaseAvatar name="XS" size="xs" />
      <BaseAvatar name="SM" size="sm" />
      <BaseAvatar name="MD" />
      <BaseAvatar name="LG" size="lg" />
    </div>
  </DemoBlock>

  <DemoBlock title="形状与状态点" description="shape 支持 circle（默认）/ square；status 在右下角显示 online / offline / busy 状态点。" :code="shapeCode">
    <div class="flex flex-wrap items-center gap-3">
      <BaseAvatar name="圆形" />
      <BaseAvatar name="方形" shape="square" tone="blue" />
      <BaseAvatar icon="fa-robot" shape="square" tone="emerald" />
      <BaseAvatar name="在线" status="online" />
      <BaseAvatar name="离线" status="offline" tone="neutral" />
      <BaseAvatar name="忙碌" status="busy" tone="rose" />
      <BaseAvatar name="方形在线" shape="square" status="online" tone="blue" />
    </div>
  </DemoBlock>

  <DemoBlock title="角标" description="BaseBadge 支持数字（超过 max 显示 99+）、多种 tone 和红点模式。">
    <div class="flex flex-wrap items-center gap-4">
      <BaseBadge :value="12"><BaseAvatar icon="fa-bell" tone="blue" /></BaseBadge>
      <BaseBadge :value="120" :max="99"><BaseAvatar icon="fa-envelope" /></BaseBadge>
      <BaseBadge :value="8" tone="rose">
        <BaseButton size="sm" variant="secondary">rose</BaseButton>
      </BaseBadge>
      <BaseBadge dot tone="emerald">
        <BaseButton size="sm" variant="ghost">红点模式</BaseButton>
      </BaseBadge>
    </div>
  </DemoBlock>
</template>
