<script setup lang="ts">
import BaseScrollbar from '@/components/base/BaseScrollbar.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const students = [
  '错题本整理：二次函数图像平移',
  '错题本整理：全等三角形判定',
  '错题本整理：一元二次方程求根',
  '错题本整理：概率初步与树状图',
  '错题本整理：相似三角形的性质',
  '错题本整理：圆与切线的位置关系',
  '错题本整理：分式方程的增根',
  '错题本整理：反比例函数综合题',
  '错题本整理：勾股定理的应用',
  '错题本整理：一次函数与不等式',
  '错题本整理：平行四边形的判定',
  '错题本整理：数据的离散程度',
  '错题本整理：锐角三角函数',
  '错题本整理：二次根式化简',
  '错题本整理：因式分解常见错误',
  '错题本整理：整式乘法与幂运算',
]

const basicCode = `<BaseScrollbar :max-height="240">
  <ul>
    <li v-for="item in list" :key="item">{{ item }}</li>
  </ul>
</BaseScrollbar>`

const alwaysCode = `<!-- always 让 thumb 常显，默认只在 hover 或滚动时出现 -->
<BaseScrollbar :max-height="200" always>…</BaseScrollbar>
<BaseScrollbar :max-height="200">…</BaseScrollbar>`
</script>

<template>
  <DemoBlock title="基础用法" description="maxHeight 限制容器高度（数字按 px），内容溢出时右侧出现覆盖式细滚动条；默认仅在悬停或滚动时显示，thumb 支持点击拖拽。" :code="basicCode">
    <BaseScrollbar :max-height="240" class="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.02]">
      <ul class="divide-y divide-slate-100 dark:divide-white/[0.05]">
        <li
          v-for="(item, index) in students"
          :key="item"
          class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-[#d0d6e0]"
        >
          <span class="accent-bg-soft accent-text flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold">{{ index + 1 }}</span>
          {{ item }}
        </li>
      </ul>
    </BaseScrollbar>
  </DemoBlock>

  <DemoBlock title="常显滚动条" description="always 为 true 时 thumb 始终可见，适合需要明确提示「此处可滚动」的区域；左侧为 always，右侧为默认的自动显隐。" :code="alwaysCode">
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="grid gap-2">
        <span class="text-xs font-semibold text-slate-400 dark:text-[#62666d]">always</span>
        <BaseScrollbar :max-height="200" always class="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.02]">
          <div class="grid gap-2 p-3">
            <div
              v-for="row in 10"
              :key="row"
              class="flex h-12 items-center rounded-lg border border-dashed border-slate-200 px-3 text-xs text-slate-400 dark:border-white/[0.08] dark:text-[#62666d]"
            >
              常显滚动条的列表项 {{ row }}
            </div>
          </div>
        </BaseScrollbar>
      </div>
      <div class="grid gap-2">
        <span class="text-xs font-semibold text-slate-400 dark:text-[#62666d]">默认（hover / 滚动时显示）</span>
        <BaseScrollbar :max-height="200" class="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.02]">
          <div class="grid gap-2 p-3">
            <div
              v-for="row in 10"
              :key="row"
              class="flex h-12 items-center rounded-lg border border-dashed border-slate-200 px-3 text-xs text-slate-400 dark:border-white/[0.08] dark:text-[#62666d]"
            >
              自动显隐的列表项 {{ row }}
            </div>
          </div>
        </BaseScrollbar>
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="长文本内容" description="内容不足以溢出时不渲染 thumb；内容高度变化（如列表增删）由 ResizeObserver 自动重算 thumb 尺寸与位置。">
    <BaseScrollbar :max-height="200" class="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.02]">
      <article class="grid gap-3 p-4 text-sm leading-7 text-slate-600 dark:text-[#d0d6e0]">
        <p>整理错题时，先把题目按知识点归档，再记录当时的错误思路，最后写下正确解法与关键突破口。这样复习时能快速定位薄弱环节，而不是漫无目的地重刷。</p>
        <p>对于反复出错的题型，建议隔天、隔周、隔月各复做一次：第一次检验是否真正理解，第二次检验记忆是否稳固，第三次检验能否迁移到变式题。</p>
        <p>拍照录题后务必校对识别结果，尤其是数学公式中的上下标与根号；一个符号的偏差就可能让整道题的解法南辕北辙。</p>
        <p>每周花十分钟浏览一遍本周错题的「错误原因」标签统计：如果「审题不清」占比最高，说明要放慢读题速度；如果「概念混淆」偏多，则应回到教材重新梳理定义。</p>
      </article>
    </BaseScrollbar>
  </DemoBlock>
</template>
