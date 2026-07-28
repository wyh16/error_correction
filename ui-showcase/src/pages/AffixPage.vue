<script setup lang="ts">
import { inject } from 'vue'
import BaseAffix from '@/components/base/BaseAffix.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

function onAffixChange(fixed: boolean) {
  notify(fixed ? 'info' : 'success')
}

const basicCode = `<div id="affix-scroll-area" class="h-72 overflow-y-auto">
  <p>容器顶部的介绍文字…</p>

  <BaseAffix target="#affix-scroll-area" :offset-top="8" @change="onChange">
    <div class="toolbar">工具条内容</div>
  </BaseAffix>

  <p>更多正文内容…</p>
</div>`

const offsetCode = `<!-- offsetTop 控制吸附后距容器顶部的间距 -->
<BaseAffix target="#affix-offset-area" :offset-top="0">
  <div>贴住容器顶（offsetTop 0）</div>
</BaseAffix>

<BaseAffix target="#affix-offset-area" :offset-top="44">
  <div>与上一条错开吸附（offsetTop 44）</div>
</BaseAffix>`
</script>

<template>
  <DemoBlock title="基础用法" description="把需要吸附的内容放进默认插槽，target 指向滚动容器；向下滚动，工具条到达容器顶部后吸附，回滚后恢复原位。状态切换时触发 change(fixed)。" :code="basicCode">
    <div id="affix-demo-a" class="h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.02]">
      <p class="mb-3 text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
        这是容器顶部的介绍文字。向下滚动这个容器，下面的工具条会在到达容器顶部时吸附住，继续滚动也保持可见。
      </p>
      <BaseAffix target="#affix-demo-a" :offset-top="8" @change="onAffixChange">
        <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-sm dark:border-white/[0.08] dark:bg-[#1f1f22]">
          <BaseButton size="sm" variant="secondary" icon="fa-plus" @click="notify('success')">新建</BaseButton>
          <BaseButton size="sm" variant="secondary" icon="fa-filter" @click="notify('info')">筛选</BaseButton>
          <span class="ml-auto text-xs text-slate-400 dark:text-[#62666d]">滚动后我会吸附在容器顶部</span>
        </div>
      </BaseAffix>
      <div class="mt-3 grid gap-3">
        <div
          v-for="row in 8"
          :key="row"
          class="flex h-20 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 text-sm text-slate-400 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#62666d]"
        >
          占位内容 {{ row }} / 8 —— 继续向下滚动
        </div>
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="offsetTop 间距" description="offsetTop 决定吸附后距容器顶部的像素间距；两个固钉设置不同的 offsetTop，可以像层叠工具条一样错开吸附。" :code="offsetCode">
    <div id="affix-demo-b" class="h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.02]">
      <p class="mb-3 text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">向下滚动，两条色条会以不同的 offsetTop 先后吸附在容器顶部。</p>
      <BaseAffix target="#affix-demo-b" :offset-top="0">
        <div class="accent-bg rounded-lg px-3 py-2 text-xs font-semibold text-white shadow-sm">offsetTop 0 —— 贴住容器顶</div>
      </BaseAffix>
      <div class="my-3 flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 text-sm text-slate-400 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#62666d]">
        两条固钉之间的占位内容
      </div>
      <BaseAffix target="#affix-demo-b" :offset-top="44">
        <div class="accent-bg-soft accent-text rounded-lg border border-[rgb(var(--accent-rgb)/0.4)] px-3 py-2 text-xs font-semibold">offsetTop 44 —— 与上一条错开吸附</div>
      </BaseAffix>
      <div class="mt-3 grid gap-3">
        <div
          v-for="row in 7"
          :key="row"
          class="flex h-20 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 text-sm text-slate-400 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#62666d]"
        >
          占位内容 {{ row }} / 7
        </div>
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="行为说明" description="target 为空字符串时监听 window 滚动（适合整页滚动的应用）；吸附时组件用等高占位符撑住原位置防止布局跳动，并锁定内容宽度防止 fixed 后塌陷。">
    <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
      注意：吸附采用 fixed 定位，内容会覆盖在容器可视区之上；若固钉随内容整体滚出容器可见区，组件不会额外裁剪，
      建议把固钉放在容器内容的前部（如工具条、筛选区）。
    </p>
  </DemoBlock>
</template>
