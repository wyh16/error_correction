<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseLoadingBar from '@/components/base/BaseLoadingBar.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const bar = ref<InstanceType<typeof BaseLoadingBar> | null>(null)
const emeraldBar = ref<InstanceType<typeof BaseLoadingBar> | null>(null)

// 模拟一次 1.2s 的请求：start 后自动 finish
function simulateRequest() {
  bar.value?.start()
  window.setTimeout(() => {
    bar.value?.finish()
    notify('success')
  }, 1200)
}

const basicCode = `<BaseLoadingBar ref="bar" />

<BaseButton @click="bar?.start()">start</BaseButton>
<BaseButton @click="bar?.finish()">finish</BaseButton>
<BaseButton @click="bar?.error()">error</BaseButton>

// 模拟请求：start 后 1.2s 自动 finish
function simulateRequest() {
  bar.value?.start()
  setTimeout(() => bar.value?.finish(), 1200)
}`

const toneCode = `<!-- tone 静态映射实心色（accent 为主题色渐变），height 控制条高 -->
<BaseLoadingBar ref="emeraldBar" tone="emerald" :height="5" />`
</script>

<template>
  <DemoBlock title="基础用法" description="进度条通过模板 ref 的方法驱动：start() 快进到 12% 后随机推进并停在 90%，finish() 冲满后渐隐，error() 以玫红色收尾。重复调用安全，条渲染在视口最顶部。" :code="basicCode">
    <BaseLoadingBar ref="bar" />
    <div class="flex flex-wrap items-center gap-2">
      <BaseButton size="sm" variant="secondary" icon="fa-play" @click="bar?.start()">start</BaseButton>
      <BaseButton size="sm" variant="secondary" icon="fa-check" @click="bar?.finish()">finish</BaseButton>
      <BaseButton size="sm" variant="secondary" icon="fa-xmark" @click="bar?.error()">error</BaseButton>
      <BaseButton size="sm" icon="fa-paper-plane" @click="simulateRequest">模拟请求（1.2s）</BaseButton>
    </div>
    <p class="mt-3 text-xs text-slate-400 dark:text-[#62666d]">点击后请留意浏览器视口最顶部的细进度条。</p>
  </DemoBlock>

  <DemoBlock title="配色与高度" description="tone 支持 accent（默认，主题色渐变）/ emerald / amber / rose / blue；height 控制条高（px）。error() 无论 tone 是什么都会切为玫红色。" :code="toneCode">
    <BaseLoadingBar ref="emeraldBar" tone="emerald" :height="5" />
    <div class="flex flex-wrap items-center gap-2">
      <BaseButton size="sm" variant="secondary" icon="fa-play" @click="emeraldBar?.start()">start（emerald，5px）</BaseButton>
      <BaseButton size="sm" variant="secondary" icon="fa-check" @click="emeraldBar?.finish()">finish</BaseButton>
      <BaseButton size="sm" variant="secondary" icon="fa-xmark" @click="emeraldBar?.error()">error（切 rose）</BaseButton>
    </div>
  </DemoBlock>

  <DemoBlock title="使用建议" description="实际项目中通常只挂一个实例在 App 根部，通过 provide/inject 或全局状态把 start / finish / error 暴露给路由钩子与请求拦截器。">
    <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
      典型接入方式：router.beforeEach 里调用 start()，afterEach 里调用 finish()，
      请求拦截器捕获到异常时调用 error()；进度条通过 Teleport 渲染到 body，不受页面布局影响。
    </p>
  </DemoBlock>
</template>
