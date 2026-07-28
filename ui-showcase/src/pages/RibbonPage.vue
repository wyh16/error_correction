<script setup lang="ts">
import BaseRibbon from '@/components/base/BaseRibbon.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const basicCode = `<BaseRibbon text="推荐">
  <div class="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
    …卡片内容…
  </div>
</BaseRibbon>`

const placementCode = `<BaseRibbon text="限时" tone="amber" placement="top-left">
  …卡片内容…
</BaseRibbon>`

const tones = [
  { tone: 'accent', text: '推荐', title: '函数专题精讲', description: '主题色 accent' },
  { tone: 'emerald', text: '已完成', title: '数列错题回顾', description: '完成 / 通过' },
  { tone: 'amber', text: '限时', title: '期中冲刺计划', description: '限时 / 提醒' },
  { tone: 'rose', text: '热门', title: '压轴题突破营', description: '热门 / 高优' },
  { tone: 'blue', text: '新课', title: '立体几何入门', description: '新增 / 信息' },
]
</script>

<template>
  <DemoBlock
    title="基础用法"
    description="包裹任意容器，text 显示在右上角的斜向丝带上；丝带层 pointer-events-none，不影响卡片交互。"
    :code="basicCode"
  >
    <div class="max-w-xs">
      <BaseRibbon text="推荐">
        <div class="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <h4 class="pr-10 text-sm font-bold text-slate-900 dark:text-[#f7f8f8]">高考数学函数专题</h4>
          <p class="mt-1.5 text-xs leading-5 text-slate-500 dark:text-[#8a8f98]">精选近五年高考真题 42 道，覆盖单调性、极值、零点三大考点。</p>
        </div>
      </BaseRibbon>
    </div>
  </DemoBlock>

  <DemoBlock title="左上位置" description="placement 设为 top-left 时丝带移到左上角，方向自动镜像。" :code="placementCode">
    <div class="max-w-xs">
      <BaseRibbon text="限时" tone="amber" placement="top-left">
        <div class="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <h4 class="pl-10 text-sm font-bold text-slate-900 dark:text-[#f7f8f8]">期中冲刺七天计划</h4>
          <p class="mt-1.5 text-xs leading-5 text-slate-500 dark:text-[#8a8f98]">每天 30 分钟错题回顾，考前把易错点再过一遍。</p>
        </div>
      </BaseRibbon>
    </div>
  </DemoBlock>

  <DemoBlock title="五种 tone" description="tone 支持 accent / emerald / amber / rose / blue，accent 跟随全局主题色。">
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <BaseRibbon v-for="item in tones" :key="item.tone" :text="item.text" :tone="item.tone">
        <div class="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <h4 class="pr-8 text-sm font-bold text-slate-900 dark:text-[#f7f8f8]">{{ item.title }}</h4>
          <p class="mt-1 text-xs text-slate-500 dark:text-[#8a8f98]">{{ item.description }}</p>
        </div>
      </BaseRibbon>
    </div>
  </DemoBlock>
</template>
