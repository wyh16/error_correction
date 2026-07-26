<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTour from '@/components/base/BaseTour.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const tourOpen = ref(false)
const strictOpen = ref(false)

const steps = [
  {
    target: '#tour-demo-search',
    title: '搜索错题',
    description: '在这里按知识点、科目或关键词检索已录入的错题，支持模糊匹配。',
    placement: 'bottom',
  },
  {
    target: '#tour-demo-table',
    title: '错题列表',
    description: '识别完成的错题会出现在列表中，点击任意一行可以查看解析与订正记录。',
    placement: 'top',
  },
  {
    target: '#tour-demo-settings',
    title: '偏好设置',
    description: '在设置里可以调整主题色、暗色模式与 OCR 识别偏好。',
    placement: 'left',
  },
]

function onFinish() {
  notify('success')
}

const basicCode = `const steps = [
  { target: '#tour-demo-search', title: '搜索错题', description: '…', placement: 'bottom' },
  { target: '#tour-demo-table', title: '错题列表', description: '…', placement: 'top' },
  { target: '#tour-demo-settings', title: '偏好设置', description: '…', placement: 'left' },
]

<BaseButton @click="tourOpen = true">开始导览</BaseButton>
<BaseTour v-model:open="tourOpen" :steps="steps" @change="onChange" @finish="onFinish" />`

const maskCode = `<!-- maskClosable=false 时点击遮罩不关闭，只能走完流程或按 Escape 退出 -->
<BaseTour v-model:open="strictOpen" :steps="steps" :mask-closable="false" />`
</script>

<template>
  <DemoBlock title="基础用法" description="steps 传目标选择器与讲解文案，v-model:open 控制启动；遮罩在目标元素处挖孔高亮并自动滚动到目标，切换步骤时触发 change(index)，最后一步点完成触发 finish。" :code="basicCode">
    <div class="grid gap-4">
      <BaseButton icon="fa-wand-magic-sparkles" @click="tourOpen = true">开始导览</BaseButton>

      <!-- 下面三个功能块是导览的目标元素 -->
      <div class="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div id="tour-demo-search" class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <i class="fa-solid fa-magnifying-glass text-sm text-slate-400 dark:text-[#62666d]"></i>
          <span class="text-sm text-slate-400 dark:text-[#62666d]">搜索知识点、科目或关键词…</span>
        </div>
        <div id="tour-demo-settings" class="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#d0d6e0]">
          <i class="fa-solid fa-gear text-sm"></i>
          偏好设置
        </div>
      </div>
      <div id="tour-demo-table" class="overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
        <div class="grid grid-cols-[1fr_5rem_5rem] gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-2 text-xs font-semibold text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-[#8a8f98]">
          <span>题目</span><span>科目</span><span>状态</span>
        </div>
        <div
          v-for="row in ['二次函数图像平移', '全等三角形判定', '一元二次方程求根']"
          :key="row"
          class="grid grid-cols-[1fr_5rem_5rem] gap-2 border-b border-slate-100 bg-white/80 px-4 py-2.5 text-sm text-slate-600 last:border-b-0 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-[#d0d6e0]"
        >
          <span class="truncate">{{ row }}</span>
          <span class="text-slate-400 dark:text-[#62666d]">数学</span>
          <span class="text-emerald-600 dark:text-emerald-400">已订正</span>
        </div>
      </div>

      <BaseTour v-model:open="tourOpen" :steps="steps" @change="notify('info')" @finish="onFinish" />
    </div>
  </DemoBlock>

  <DemoBlock title="强制走完流程" description="maskClosable 为 false 时点击遮罩不会关闭引导（仍可按 Escape 退出），适合关键功能的强引导。本例复用上方三个功能块作为目标。" :code="maskCode">
    <BaseButton variant="secondary" icon="fa-lock" @click="strictOpen = true">开始强引导</BaseButton>
    <BaseTour v-model:open="strictOpen" :steps="steps" :mask-closable="false" @finish="notify('success')" />
  </DemoBlock>

  <DemoBlock title="行为说明" description="每次打开都会从第一步开始；步骤目标查找不到时自动跳到下一个可用步骤，全部找不到则直接关闭。切换步骤时挖孔与卡片平滑移动，窗口缩放或滚动时位置自动跟随。">
    <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
      placement 支持 bottom（默认）/ top / left / right，卡片会自动钳制在视口内；
      目标元素定位前会先 scrollIntoView 到视口中部，因此跨屏引导也能正常工作。
    </p>
  </DemoBlock>
</template>
