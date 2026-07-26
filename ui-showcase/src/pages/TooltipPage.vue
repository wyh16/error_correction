<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTooltip from '@/components/base/BaseTooltip.vue'
import BaseTooltipProvider from '@/components/base/BaseTooltipProvider.vue'
import DemoBlock from '~/components/DemoBlock.vue'
</script>

<template>
  <DemoBlock title="方向" description="placement 支持 top / bottom / left / right。">
    <div class="flex flex-wrap gap-3">
      <BaseTooltip text="上方提示" placement="top">
        <BaseButton size="sm" variant="secondary">Top</BaseButton>
      </BaseTooltip>
      <BaseTooltip text="下方提示" placement="bottom">
        <BaseButton size="sm" variant="secondary">Bottom</BaseButton>
      </BaseTooltip>
      <BaseTooltip text="左侧提示" placement="left">
        <BaseButton size="sm" variant="secondary">Left</BaseButton>
      </BaseTooltip>
      <BaseTooltip text="右侧提示" placement="right">
        <BaseButton size="sm" variant="secondary">Right</BaseButton>
      </BaseTooltip>
    </div>
  </DemoBlock>

  <DemoBlock title="禁用" description="disabled 后悬停不再显示提示。">
    <BaseTooltip text="你看不到我" disabled>
      <BaseButton size="sm" variant="ghost">禁用 Tooltip</BaseButton>
    </BaseTooltip>
  </DemoBlock>

  <DemoBlock title="延迟显示" description="delay 控制悬停多少毫秒后显示，可避免快速划过时的闪烁；组件级 delay 优先于 Provider 配置。">
    <div class="flex flex-wrap gap-3">
      <BaseTooltip text="立即显示（默认）">
        <BaseButton size="sm" variant="secondary">无延迟</BaseButton>
      </BaseTooltip>
      <BaseTooltip text="悬停 500ms 后出现" :delay="500">
        <BaseButton size="sm" variant="secondary">延迟 500ms</BaseButton>
      </BaseTooltip>
      <BaseTooltip text="悬停 1s 后出现" :delay="1000">
        <BaseButton size="sm" variant="secondary">延迟 1s</BaseButton>
      </BaseTooltip>
    </div>
  </DemoBlock>

  <DemoBlock title="Provider 统一配置" description="BaseTooltipProvider 统一控制 delay、offset、z-index 和禁用状态，内部所有 Tooltip 生效。">
    <BaseTooltipProvider :offset="14" :delay="300">
      <div class="flex flex-wrap gap-3">
        <BaseTooltip text="offset 14，延迟 300ms">
          <BaseButton size="sm" variant="secondary">悬停查看</BaseButton>
        </BaseTooltip>
        <BaseTooltip text="同一 Provider 下的第二个">
          <BaseButton size="sm" variant="secondary">再试一个</BaseButton>
        </BaseTooltip>
      </div>
    </BaseTooltipProvider>
  </DemoBlock>
</template>
