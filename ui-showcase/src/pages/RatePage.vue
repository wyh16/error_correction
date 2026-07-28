<script setup lang="ts">
import { ref } from 'vue'
import BaseRate from '@/components/base/BaseRate.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const basicCode = `<BaseRate v-model="difficulty" show-value />`

const halfCode = `<BaseRate v-model="satisfaction" allow-half show-value />`

const customCode = `<BaseRate v-model="favorite" icon="fa-heart" tone="rose" show-value />
<BaseRate v-model="quality" tone="accent" show-value />`

const difficulty = ref(3)
const satisfaction = ref(3.5)
const favorite = ref(4)
const quality = ref(2)
</script>

<template>
  <DemoBlock title="基础用法" description="点击星星设置分值，再次点击当前分值可清零；showValue 在右侧展示当前数值。" :code="basicCode">
    <div class="flex items-center gap-3">
      <span class="text-sm text-slate-500 dark:text-[#8a8f98]">题目难度</span>
      <BaseRate v-model="difficulty" show-value />
    </div>
  </DemoBlock>

  <DemoBlock title="半星评分" description="allowHalf 根据鼠标在星星左右半区的位置，支持 0.5 步进打分。" :code="halfCode">
    <div class="flex items-center gap-3">
      <span class="text-sm text-slate-500 dark:text-[#8a8f98]">课程满意度</span>
      <BaseRate v-model="satisfaction" allow-half show-value />
    </div>
  </DemoBlock>

  <DemoBlock title="只读与禁用" description="readonly 仅用于展示分值；disabled 额外降低透明度并禁止交互。">
    <div class="grid gap-3">
      <div class="flex items-center gap-3">
        <span class="w-16 text-sm text-slate-500 dark:text-[#8a8f98]">只读</span>
        <BaseRate :model-value="4" readonly show-value />
      </div>
      <div class="flex items-center gap-3">
        <span class="w-16 text-sm text-slate-500 dark:text-[#8a8f98]">禁用</span>
        <BaseRate :model-value="2" disabled show-value />
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="自定义图标与配色" description="icon 传 fa-* 类名，tone 支持 amber / accent / rose / emerald / blue。" :code="customCode">
    <div class="grid gap-3">
      <div class="flex items-center gap-3">
        <span class="w-16 text-sm text-slate-500 dark:text-[#8a8f98]">喜爱程度</span>
        <BaseRate v-model="favorite" icon="fa-heart" tone="rose" show-value />
      </div>
      <div class="flex items-center gap-3">
        <span class="w-16 text-sm text-slate-500 dark:text-[#8a8f98]">讲解质量</span>
        <BaseRate v-model="quality" tone="accent" show-value />
      </div>
    </div>
  </DemoBlock>
</template>
