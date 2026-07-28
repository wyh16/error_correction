<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseSlider from '@/components/base/BaseSlider.vue'
import BaseWatermark from '@/components/base/BaseWatermark.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const basicCode = `<BaseWatermark content="内部资料 · 请勿外传">
  <div class="rounded-xl border border-slate-200 bg-white/80 p-5 dark:border-white/[0.08] dark:bg-white/[0.03]">
    …文档内容…
  </div>
</BaseWatermark>`

const customCode = `<BaseWatermark
  :content="['错题订正系统', 'student@example.com']"
  :rotate="rotate"
  :gap="[gap, gap]"
  :font-size="fontSize"
  :opacity="opacity"
>
  …内容…
</BaseWatermark>`

const rotate = ref(-22)
const gap = ref(100)
const fontSize = ref(14)
const opacityPercent = ref(15)
const opacity = computed(() => opacityPercent.value / 100)
</script>

<template>
  <DemoBlock
    title="基础用法"
    description="content 为水印文案，水印层由 canvas 生成后平铺覆盖在内容上方，pointer-events-none 不影响文本选中与交互。"
    :code="basicCode"
  >
    <BaseWatermark content="内部资料 · 请勿外传">
      <div class="rounded-xl border border-slate-200 bg-white/80 p-5 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <h4 class="text-sm font-bold text-slate-900 dark:text-[#f7f8f8]">2026 春季期中数学试卷分析</h4>
        <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-[#d0d6e0]">
          本次考试共 22 题，班级平均分 108.5，最高分 145。失分集中在函数与导数（32%）、解析几何（27%）两个板块，选择题正确率整体高于填空题。
        </p>
        <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-[#d0d6e0]">
          建议接下来两周重点复习函数单调性与极值判定，并完成配套错题回顾 18 道，巩固易错知识点。
        </p>
      </div>
    </BaseWatermark>
  </DemoBlock>

  <DemoBlock
    title="多行内容与自定义参数"
    description="content 传数组渲染多行；rotate / gap / fontSize / opacity 全部响应式生效，拖动滑杆即可实时预览。"
    :code="customCode"
  >
    <div class="grid gap-5 lg:grid-cols-[16rem_1fr]">
      <div class="grid content-start gap-4">
        <BaseSlider v-model="rotate" label="旋转角度" :min="-90" :max="90" />
        <BaseSlider v-model="gap" label="间距" :min="20" :max="240" :step="10" />
        <BaseSlider v-model="fontSize" label="字号" :min="10" :max="32" />
        <BaseSlider v-model="opacityPercent" label="透明度 %" :min="5" :max="60" :step="5" />
      </div>
      <BaseWatermark
        :content="['错题订正系统', 'student@example.com']"
        :rotate="rotate"
        :gap="[gap, gap]"
        :font-size="fontSize"
        :opacity="opacity"
      >
        <div class="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <p class="text-sm text-slate-400 dark:text-[#62666d]">受保护的内容区域</p>
        </div>
      </BaseWatermark>
    </div>
  </DemoBlock>
</template>
