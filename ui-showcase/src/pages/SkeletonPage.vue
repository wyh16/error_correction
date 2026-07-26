<script setup lang="ts">
import BaseSkeleton from '@/components/base/BaseSkeleton.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const roundedCode = `<BaseSkeleton rounded="rounded-none" />
<BaseSkeleton rounded="rounded-md" />
<BaseSkeleton variant="circle" rounded="rounded-lg" />`
</script>

<template>
  <DemoBlock title="三种形态" description="variant 支持 rect（默认）/ circle / text，text 模式可指定行数。">
    <div class="grid max-w-md gap-4">
      <div class="flex items-center gap-3">
        <BaseSkeleton variant="circle" />
        <div class="min-w-0 flex-1">
          <BaseSkeleton variant="text" :lines="2" />
        </div>
      </div>
      <BaseSkeleton />
      <BaseSkeleton variant="text" :lines="4" />
    </div>
  </DemoBlock>

  <DemoBlock title="关闭动画" description="animated 设为 false 时不闪烁，适合截图或降级场景。">
    <div class="max-w-md">
      <BaseSkeleton :animated="false" />
    </div>
  </DemoBlock>

  <DemoBlock title="自定义圆角" description="rounded 传入任意 Tailwind 圆角类覆盖默认圆角（rect 默认 rounded-xl、circle 默认 rounded-full、text 默认 rounded），留空保持默认。" :code="roundedCode">
    <div class="grid max-w-md gap-4">
      <BaseSkeleton rounded="rounded-none" />
      <BaseSkeleton rounded="rounded-md" />
      <div class="flex items-center gap-3">
        <BaseSkeleton variant="circle" rounded="rounded-lg" />
        <div class="min-w-0 flex-1">
          <BaseSkeleton variant="text" :lines="2" rounded="rounded-full" />
        </div>
      </div>
    </div>
  </DemoBlock>
</template>
