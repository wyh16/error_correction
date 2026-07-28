<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseProgress from '@/components/base/BaseProgress.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const animated = ref(20)
let timer: number | null = null

const toneCode = `<BaseProgress label="accent" :value="68" show-value />
<BaseProgress label="blue" :value="55" tone="blue" show-value />
<BaseProgress label="emerald" :value="42" tone="emerald" show-value />`

const dynamicCode = `<BaseProgress label="不确定进度" indeterminate />
<BaseProgress label="条纹动画" :value="65" striped />`

function play() {
  if (timer) window.clearInterval(timer)
  animated.value = 0
  timer = window.setInterval(() => {
    animated.value = Math.min(100, animated.value + 8)
    if (animated.value >= 100 && timer) window.clearInterval(timer)
  }, 200)
}

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <DemoBlock title="配色" description="tone 支持 accent / blue / emerald / amber / rose。" :code="toneCode">
    <div class="grid max-w-md gap-3">
      <BaseProgress label="accent" :value="68" show-value />
      <BaseProgress label="blue" :value="55" tone="blue" show-value />
      <BaseProgress label="emerald" :value="42" tone="emerald" show-value />
      <BaseProgress label="amber" :value="30" tone="amber" show-value />
      <BaseProgress label="rose" :value="18" tone="rose" show-value />
    </div>
  </DemoBlock>

  <DemoBlock title="尺寸" description="size 支持 sm / md / lg。">
    <div class="grid max-w-md gap-3">
      <BaseProgress label="sm" :value="60" size="sm" show-value />
      <BaseProgress label="md" :value="60" show-value />
      <BaseProgress label="lg" :value="60" size="lg" show-value />
    </div>
  </DemoBlock>

  <DemoBlock title="不确定进度与条纹" description="indeterminate 播放循环扫掠动画（忽略 value），适合耗时未知的任务；striped 叠加流动的斜向条纹。" :code="dynamicCode">
    <div class="grid max-w-md gap-3">
      <BaseProgress label="不确定进度" indeterminate />
      <BaseProgress label="不确定 + blue" indeterminate tone="blue" size="lg" />
      <BaseProgress label="条纹动画" :value="65" striped show-value />
      <BaseProgress label="条纹 + emerald" :value="80" tone="emerald" striped size="lg" show-value />
    </div>
  </DemoBlock>

  <DemoBlock title="动态进度与自定义 max" description="value / max 计算百分比，点击按钮模拟进度推进。">
    <div class="grid max-w-md gap-3">
      <BaseProgress label="动态进度" :value="animated" show-value />
      <BaseProgress label="256 分制" :value="192" :max="256" show-value />
      <div>
        <BaseButton size="sm" variant="secondary" @click="play">重新播放</BaseButton>
      </div>
    </div>
  </DemoBlock>
</template>
