<script setup lang="ts">
import { inject, onBeforeUnmount, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSpin from '@/components/base/BaseSpin.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const wrapCode = `<BaseSpin :spinning="loading" tip="正在识别错题...">
  <div class="rounded-xl border p-4">卡片内容</div>
</BaseSpin>`

const sizeCode = `<BaseSpin size="sm" tip="加载中" />
<BaseSpin size="md" tip="加载中" />
<BaseSpin size="lg" tip="加载中" />`

const fullscreenCode = `<BaseSpin fullscreen :spinning="fullLoading" tip="正在生成报告..." />`

const loading = ref(true)
const fullLoading = ref(false)
let fullTimer: ReturnType<typeof setTimeout> | null = null

function openFullscreen() {
  fullLoading.value = true
  // 全屏遮罩没有关闭按钮，演示里 2 秒后自动结束并给出提示
  fullTimer = setTimeout(() => {
    fullLoading.value = false
    fullTimer = null
    notify('success')
  }, 2000)
}

onBeforeUnmount(() => {
  if (fullTimer) clearTimeout(fullTimer)
})
</script>

<template>
  <DemoBlock
    title="包裹内容"
    description="默认插槽有内容时，spinning 为 true 会把内容降透明、轻微模糊并拦截交互，居中展示 spinner 与 tip。"
    :code="wrapCode"
  >
    <div class="grid gap-3">
      <BaseSpin :spinning="loading" tip="正在识别错题...">
        <div class="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <p class="text-sm font-semibold text-slate-900 dark:text-[#f7f8f8]">第 12 题 · 二次函数</p>
          <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
            已知抛物线经过点 (1, 0) 与 (3, 0)，且顶点纵坐标为 -2，求该抛物线的解析式。
          </p>
        </div>
      </BaseSpin>
      <div>
        <BaseButton variant="secondary" size="sm" @click="loading = !loading">
          {{ loading ? '停止加载' : '开始加载' }}
        </BaseButton>
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="尺寸与提示文案" description="size 提供 sm / md / lg 三档；无插槽时以行内形式展示 spinner 与灰色 tip。" :code="sizeCode">
    <div class="flex flex-wrap items-center gap-8">
      <BaseSpin size="sm" tip="加载中" />
      <BaseSpin size="md" tip="加载中" />
      <BaseSpin size="lg" tip="加载中" />
    </div>
  </DemoBlock>

  <DemoBlock
    title="全屏加载"
    description="fullscreen 通过 Teleport 覆盖整个视口并模糊背景，适合页面级异步流程；演示会在 2 秒后自动关闭。"
    :code="fullscreenCode"
  >
    <BaseButton icon="fa-wand-magic-sparkles" @click="openFullscreen">生成学情报告</BaseButton>
    <BaseSpin fullscreen :spinning="fullLoading" tip="正在生成报告..." />
  </DemoBlock>
</template>
