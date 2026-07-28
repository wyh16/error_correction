<script setup lang="ts">
import { ref } from 'vue'
import BaseAnchor from '@/components/base/BaseAnchor.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const activeHref = ref('')

const basicItems = [
  { href: '#anchor-demo-intro', title: '产品简介' },
  { href: '#anchor-demo-install', title: '安装配置' },
  { href: '#anchor-demo-theme', title: '主题定制' },
  { href: '#anchor-demo-faq', title: '常见问题' },
]

const basicSections = [
  { id: 'anchor-demo-intro', title: '产品简介', text: '这里是产品简介章节的正文内容，向下滚动左侧容器，右侧锚点会自动高亮当前阅读位置。' },
  { id: 'anchor-demo-install', title: '安装配置', text: '这里是安装配置章节的正文内容，点击右侧锚点可以平滑滚动到对应章节。' },
  { id: 'anchor-demo-theme', title: '主题定制', text: '这里是主题定制章节的正文内容，激活项左侧的墨条会跟随高亮项平滑移动。' },
  { id: 'anchor-demo-faq', title: '常见问题', text: '这里是常见问题章节的正文内容，滚动到底部时最后一项保持高亮。' },
]

const nestedItems = [
  {
    href: '#anchor-nested-component',
    title: '组件',
    children: [
      { href: '#anchor-nested-button', title: '按钮' },
      { href: '#anchor-nested-form', title: '表单' },
    ],
  },
  {
    href: '#anchor-nested-advanced',
    title: '进阶',
    children: [
      { href: '#anchor-nested-theme', title: '主题' },
    ],
  },
]

const nestedSections = [
  { id: 'anchor-nested-component', title: '组件', level: 1 },
  { id: 'anchor-nested-button', title: '按钮', level: 2 },
  { id: 'anchor-nested-form', title: '表单', level: 2 },
  { id: 'anchor-nested-advanced', title: '进阶', level: 1 },
  { id: 'anchor-nested-theme', title: '主题', level: 2 },
]

const basicCode = `<div class="flex gap-6">
  <div id="scroll-area" class="h-72 flex-1 overflow-y-auto">
    <section id="anchor-demo-intro">…</section>
    <section id="anchor-demo-install">…</section>
    <section id="anchor-demo-theme">…</section>
    <section id="anchor-demo-faq">…</section>
  </div>
  <BaseAnchor :items="items" target="#scroll-area" @change="onChange" />
</div>`

const nestedCode = `const items = [
  {
    href: '#anchor-nested-component',
    title: '组件',
    children: [
      { href: '#anchor-nested-button', title: '按钮' },
      { href: '#anchor-nested-form', title: '表单' },
    ],
  },
]

<BaseAnchor :items="items" :offset="8" target="#nested-scroll-area" />`

const windowCode = `<!-- target 为空时监听 window 滚动（适合整页滚动的应用） -->
<BaseAnchor :items="items" />

<!-- offset 让激活判定与点击滚动都预留出吸顶导航的高度 -->
<BaseAnchor :items="items" :offset="64" target="#doc-main" />`
</script>

<template>
  <DemoBlock title="基础用法" description="items 传 { href, title } 数组，target 指向滚动容器；滚动时自动高亮当前章节，点击锚点平滑滚动到目标位置并触发 change。" :code="basicCode">
    <div class="grid gap-3">
      <p class="text-xs text-slate-400 dark:text-[#62666d]">当前激活：<span class="accent-text font-medium">{{ activeHref || '（滚动或点击试试）' }}</span></p>
      <div class="flex gap-6">
        <div id="anchor-demo-scroll" class="h-72 flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.02]">
          <section
            v-for="section in basicSections"
            :key="section.id"
            :id="section.id"
            class="mb-4 flex h-56 flex-col gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]"
          >
            <h4 class="text-sm font-bold text-slate-900 dark:text-[#f7f8f8]">{{ section.title }}</h4>
            <p class="text-[13px] leading-6 text-slate-500 dark:text-[#8a8f98]">{{ section.text }}</p>
          </section>
          <!-- 底部留白：保证最后一个章节的顶部也能滚到容器顶，从而被激活 -->
          <div class="h-16" aria-hidden="true"></div>
        </div>
        <div class="w-32 shrink-0 pt-1">
          <BaseAnchor :items="basicItems" target="#anchor-demo-scroll" @change="activeHref = $event" />
        </div>
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="嵌套锚点" description="items 的 children 支持一层子锚点，子项缩进展示；offset 可为激活判定与滚动位置预留顶部间距。" :code="nestedCode">
    <div class="flex gap-6">
      <div id="anchor-nested-scroll" class="h-72 flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.02]">
        <section
          v-for="section in nestedSections"
          :key="section.id"
          :id="section.id"
          class="mb-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4 last:mb-0 dark:border-white/[0.08] dark:bg-white/[0.03]"
          :class="section.level === 1 ? 'h-32' : 'h-44'"
        >
          <h4 class="text-sm font-bold" :class="section.level === 1 ? 'text-slate-900 dark:text-[#f7f8f8]' : 'text-slate-600 dark:text-[#d0d6e0]'">
            {{ section.level === 2 ? '· ' : '' }}{{ section.title }}
          </h4>
          <p class="mt-2 text-[13px] leading-6 text-slate-500 dark:text-[#8a8f98]">「{{ section.title }}」章节的占位正文，用于演示嵌套锚点的滚动联动。</p>
        </section>
        <!-- 底部留白：保证最后一个子章节也能滚到容器顶被激活 -->
        <div class="h-28" aria-hidden="true"></div>
      </div>
      <div class="w-32 shrink-0 pt-1">
        <BaseAnchor :items="nestedItems" :offset="8" target="#anchor-nested-scroll" />
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="监听 window 与 offset" description="target 为空字符串时监听 window 滚动，适合整页滚动的业务应用；本文档站整页不滚动（实际滚动的是 #doc-main），因此站内演示都显式传了 target。offset 常用于抵消吸顶导航高度。" :code="windowCode">
    <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
      锚点目标元素通过 href 中的选择器（如 <code class="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700 dark:bg-white/[0.06] dark:text-[#d0d6e0]">#section-id</code>）查找，
      需保证 id 在页面内唯一；找不到目标的项不会参与激活判定，点击也不会滚动。
    </p>
  </DemoBlock>
</template>
