<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSlider from '@/components/base/BaseSlider.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const sliderValue = ref(64)
const stepValue = ref(40)

// 动画演示：用 rAF 缓动补间驱动 v-model，滑块和填充条同步平滑移动。
const animValue = ref(20)
let raf: number | null = null

function animateTo(target: number) {
  if (raf) cancelAnimationFrame(raf)
  const from = animValue.value
  const start = performance.now()
  const duration = 450

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
    animValue.value = Math.round(from + (target - from) * eased)
    if (t < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

function animateRandom() {
  animateTo(Math.round(Math.random() * 100))
}

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
})

const animCode = `<BaseSlider v-model="value" label="动画滑块" />

// rAF 缓动补间，滑块和填充条同步平滑移动
function animateTo(target) {
  const from = value.value
  const start = performance.now()
  const tick = (now) => {
    const t = Math.min(1, (now - start) / 450)
    value.value = Math.round(from + (target - from) * (1 - (1 - t) ** 3))
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}`
</script>

<template>
  <DemoBlock title="基础用法" description="支持 min / max、标签与数值显示。悬停滑块有放大和主题色光晕，按住拖动时光晕进一步扩大。">
    <div class="max-w-md">
      <BaseSlider v-model="sliderValue" label="识别置信阈值" :min="0" :max="100" />
    </div>
  </DemoBlock>

  <DemoBlock
    title="动画"
    description="点击轨道、键盘或程序赋值时，指示点和填充条一起平滑移动（拖动时自动关闭过渡保持跟手）；配合缓动补间可以做出下面的效果。"
    :code="animCode"
  >
    <div class="grid max-w-md gap-4">
      <BaseSlider v-model="animValue" label="动画滑块" :min="0" :max="100" />
      <div class="flex flex-wrap gap-2">
        <BaseButton size="sm" variant="secondary" @click="animateTo(0)">0%</BaseButton>
        <BaseButton size="sm" variant="secondary" @click="animateTo(50)">50%</BaseButton>
        <BaseButton size="sm" variant="secondary" @click="animateTo(100)">100%</BaseButton>
        <BaseButton size="sm" @click="animateRandom">随机</BaseButton>
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="步长" description="step 控制拖动粒度，这里设为 10。">
    <div class="max-w-md">
      <BaseSlider v-model="stepValue" label="步长 10" :min="0" :max="100" :step="10" />
    </div>
  </DemoBlock>

  <DemoBlock title="隐藏数值与禁用" description="show-value 设为 false 时只显示滑轨；disabled 禁用拖动。">
    <div class="grid max-w-md gap-5">
      <BaseSlider :model-value="30" :show-value="false" />
      <BaseSlider :model-value="50" label="禁用" disabled />
    </div>
  </DemoBlock>
</template>
