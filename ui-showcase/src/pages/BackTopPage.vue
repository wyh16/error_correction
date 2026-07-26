<script setup lang="ts">
import BaseBackTop from '@/components/base/BaseBackTop.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const liveCode = `<!-- 文档站的滚动容器是 #doc-main，因此 target 指向它 -->
<BaseBackTop target="#doc-main" :visibility-height="300" />`

const windowCode = `<!-- target 为空时监听 window 滚动（适合整页滚动的应用） -->
<BaseBackTop />

<!-- 自定义显示阈值与位置偏移 -->
<BaseBackTop
  target="#doc-main"
  :visibility-height="400"
  :right="32"
  :bottom="48"
/>`
</script>

<template>
  <DemoBlock title="实时演示" description="本页已挂载 target 指向 #doc-main 的回到顶部按钮（文档站内容区的滚动容器就是 #doc-main）。向下滚动本页超过 300px，右下角会淡入显示按钮，点击后平滑回到顶部。" :code="liveCode">
    <BaseBackTop target="#doc-main" :visibility-height="300" />
    <div class="grid gap-4">
      <p class="text-sm text-slate-500 dark:text-[#8a8f98]">下面是用于撑高页面的占位内容，请向下滚动查看效果。</p>
      <div
        class="flex h-[1500px] flex-col items-center justify-between rounded-xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50/80 to-slate-100/60 py-10 dark:border-white/[0.08] dark:from-white/[0.03] dark:to-white/[0.01]"
      >
        <p class="text-sm text-slate-400 dark:text-[#62666d]">占位内容顶部 —— 继续向下滚动</p>
        <p class="text-sm text-slate-400 dark:text-[#62666d]">滚动超过 300px 后右下角会出现回到顶部按钮</p>
        <p class="text-sm text-slate-400 dark:text-[#62666d]">占位内容底部 —— 点击右下角按钮回到顶部</p>
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="属性说明" description="target 传滚动容器的 CSS 选择器，为空时监听 window 滚动；visibilityHeight 控制滚动多少像素后显示按钮；right / bottom 为按钮距视口右侧、底部的像素偏移。按钮通过 Teleport 渲染到 body 上，固定定位不受局部布局影响。" :code="windowCode">
    <p class="text-sm text-slate-500 dark:text-[#8a8f98]">
      注意：本文档站整页不滚动，实际滚动的是内容区 <code class="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700 dark:bg-white/[0.06] dark:text-[#d0d6e0]">&lt;main id="doc-main"&gt;</code>，
      因此站内演示必须指定 <code class="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700 dark:bg-white/[0.06] dark:text-[#d0d6e0]">target="#doc-main"</code>；
      在整页滚动的业务应用中不传 target 即可。
    </p>
  </DemoBlock>
</template>
