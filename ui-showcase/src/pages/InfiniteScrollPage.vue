<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseInfiniteScroll from '@/components/base/BaseInfiniteScroll.vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const TOTAL = 40
const BATCH = 8

// 基础 demo：模拟分页请求，加载到 40 条后 noMore。
// 初始 10 条让哨兵一开始就在触发线以下，避免页面一打开就自动加载。
const items = ref<number[]>(Array.from({ length: 10 }, (_, i) => i + 1))
const loading = ref(false)
const noMore = ref(false)

function handleLoad() {
  loading.value = true
  window.setTimeout(() => {
    const start = items.value.length
    const count = Math.min(BATCH, TOTAL - start)
    items.value = [...items.value, ...Array.from({ length: count }, (_, i) => start + i + 1)]
    loading.value = false
    if (items.value.length >= TOTAL) noMore.value = true
    notify('success')
  }, 700)
}

// disabled demo：独立的一份状态，24 条后结束以展示自定义 no-more 插槽
const pausedItems = ref<number[]>(Array.from({ length: BATCH }, (_, i) => i + 1))
const pausedLoading = ref(false)
const pausedNoMore = ref(false)
const paused = ref(true)

function handlePausedLoad() {
  pausedLoading.value = true
  window.setTimeout(() => {
    const start = pausedItems.value.length
    pausedItems.value = [...pausedItems.value, ...Array.from({ length: BATCH }, (_, i) => start + i + 1)]
    pausedLoading.value = false
    if (pausedItems.value.length >= 24) pausedNoMore.value = true
  }, 700)
}

const basicCode = `<BaseInfiniteScroll
  :max-height="280"
  :loading="loading"
  :no-more="noMore"
  @load="handleLoad"
>
  <ul>
    <li v-for="item in items" :key="item">第 {{ item }} 条记录</li>
  </ul>
</BaseInfiniteScroll>

function handleLoad() {
  loading.value = true
  setTimeout(() => {
    items.value = [...items.value, ...nextBatch()]
    loading.value = false
    if (items.value.length >= total) noMore.value = true
  }, 700)
}`

const disabledCode = `<!-- disabled 为 true 时滚动到底也不触发 load，常用于请求出错后暂停 -->
<BaseInfiniteScroll :max-height="220" :disabled="paused" :loading="loading" @load="onLoad">
  …
</BaseInfiniteScroll>`
</script>

<template>
  <DemoBlock title="基础用法" description="滚动接近底部（distance 默认提前 50px）时触发 load；父组件负责置 loading、追加数据，全部加载完后置 noMore。本例每批 700ms 追加 8 条，共 40 条。" :code="basicCode">
    <div class="grid gap-2">
      <p class="text-xs text-slate-400 dark:text-[#62666d]">已加载 <span class="accent-text font-semibold">{{ items.length }}</span> / {{ TOTAL }} 条</p>
      <BaseInfiniteScroll
        :max-height="280"
        :loading="loading"
        :no-more="noMore"
        class="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.02]"
        @load="handleLoad"
      >
        <ul class="divide-y divide-slate-100 dark:divide-white/[0.05]">
          <li v-for="item in items" :key="item" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-[#d0d6e0]">
            <span class="accent-bg-soft accent-text flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold">{{ item }}</span>
            第 {{ item }} 条错题记录
          </li>
        </ul>
      </BaseInfiniteScroll>
    </div>
  </DemoBlock>

  <DemoBlock title="暂停加载" description="disabled 为 true 时即使滚动到底部也不会触发 load，适合请求失败后暂停自动加载；关闭开关恢复后，若底部哨兵仍在视口内会立即补触发一次。" :code="disabledCode">
    <div class="grid gap-3">
      <BaseSwitch v-model="paused" label="暂停自动加载" />
      <BaseInfiniteScroll
        :max-height="220"
        :disabled="paused"
        :loading="pausedLoading"
        :no-more="pausedNoMore"
        class="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.02]"
        @load="handlePausedLoad"
      >
        <ul class="divide-y divide-slate-100 dark:divide-white/[0.05]">
          <li v-for="item in pausedItems" :key="item" class="px-4 py-2.5 text-sm text-slate-600 dark:text-[#d0d6e0]">
            第 {{ item }} 条同步日志
          </li>
        </ul>
        <template #no-more>没有更多日志了</template>
      </BaseInfiniteScroll>
    </div>
  </DemoBlock>

  <DemoBlock title="行为说明" description="target 传外部滚动容器的选择器时，组件自身不再滚动（此时 maxHeight 不生效），适合列表和滚动容器分离的布局；loading / no-more 两个插槽可自定义底部状态文案。">
    <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
      触发机制基于 IntersectionObserver 监听列表底部的哨兵元素，无滚动事件开销；
      一批数据渲染后若哨兵仍在视口内（内容不够高），组件会自动再次触发 load，直到内容撑满容器或 noMore 为 true。
      因此请务必在数据全部加载完后置 noMore，避免死循环请求。
    </p>
  </DemoBlock>
</template>
