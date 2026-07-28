<script setup lang="ts">
import { ref } from 'vue'
import BaseCircleProgress from '@/components/base/BaseCircleProgress.vue'
import BaseSlider from '@/components/base/BaseSlider.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const progress = ref(65)

const basicCode = `<BaseCircleProgress :value="progress" />
<BaseSlider v-model="progress" :min="0" :max="100" />`

const toneCode = `<BaseCircleProgress :value="72" tone="accent" />
<BaseCircleProgress :value="72" tone="emerald" />
<BaseCircleProgress :value="72" tone="amber" />`

const slotCode = `<BaseCircleProgress :value="82" :size="120" :stroke-width="10">
  <div class="text-center">
    <p class="text-lg font-bold">8.2</p>
    <p class="text-[10px]">综合评分</p>
  </div>
</BaseCircleProgress>`

const indeterminateCode = `<BaseCircleProgress indeterminate :size="48" :stroke-width="5" />`
</script>

<template>
  <DemoBlock
    title="基础用法"
    description="value 取 0-100，超出自动收敛；dashoffset 带 0.4s 过渡，进度变化时圆弧平滑生长。"
    :code="basicCode"
  >
    <div class="flex flex-wrap items-center gap-8">
      <BaseCircleProgress :value="progress" />
      <div class="w-56">
        <BaseSlider v-model="progress" label="拖动联动" :min="0" :max="100" />
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="五种 tone" description="tone 支持 accent / emerald / amber / rose / blue，accent 跟随全局主题色。" :code="toneCode">
    <div class="flex flex-wrap items-center gap-6">
      <BaseCircleProgress :value="40" :size="72" :stroke-width="6" />
      <BaseCircleProgress :value="55" :size="72" :stroke-width="6" tone="emerald" />
      <BaseCircleProgress :value="70" :size="72" :stroke-width="6" tone="amber" />
      <BaseCircleProgress :value="85" :size="72" :stroke-width="6" tone="rose" />
      <BaseCircleProgress :value="60" :size="72" :stroke-width="6" tone="blue" />
    </div>
  </DemoBlock>

  <DemoBlock
    title="自定义中心内容"
    description="默认 slot 替换中心的百分比数字，可以放评分、图标等任意内容。"
    :code="slotCode"
  >
    <div class="flex flex-wrap items-center gap-8">
      <BaseCircleProgress :value="82" :size="120" :stroke-width="10">
        <div class="text-center">
          <p class="text-lg font-bold text-slate-900 dark:text-[#f7f8f8]">8.2</p>
          <p class="text-[10px] text-slate-400 dark:text-[#62666d]">综合评分</p>
        </div>
      </BaseCircleProgress>
      <BaseCircleProgress :value="100" tone="emerald" :size="72" :stroke-width="6">
        <i class="fa-solid fa-check text-lg text-emerald-500"></i>
      </BaseCircleProgress>
    </div>
  </DemoBlock>

  <DemoBlock
    title="不确定态"
    description="indeterminate 用固定弧长 + 旋转动画表示进度未知的加载，此时隐藏百分比数字。"
    :code="indeterminateCode"
  >
    <div class="flex flex-wrap items-center gap-6">
      <BaseCircleProgress indeterminate :size="48" :stroke-width="5" />
      <BaseCircleProgress indeterminate :size="48" :stroke-width="5" tone="emerald" />
      <BaseCircleProgress indeterminate :size="48" :stroke-width="5" tone="blue" />
      <span class="text-sm text-slate-500 dark:text-[#8a8f98]">正在识别题目…</span>
    </div>
  </DemoBlock>
</template>
