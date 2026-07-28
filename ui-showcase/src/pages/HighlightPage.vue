<script setup lang="ts">
import { ref } from 'vue'
import BaseHighlight from '@/components/base/BaseHighlight.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const query = ref('函数')

const sentences = [
  '一次函数与二次函数的图像与性质对比',
  '利用函数单调性求最值的常见思路',
  '三角函数诱导公式的记忆技巧',
  '数列与函数思想在压轴题中的综合应用',
]

const searchCode = `<BaseInput v-model="query" placeholder="输入关键词" clearable />

<BaseHighlight v-for="item in sentences" :text="item" :keywords="query" />`

const multiText = '本周计划：周一订正数学错题，周三整理物理笔记，周五复习化学方程式，周末做一套数学模拟卷。'

const multiCode = `<BaseHighlight :text="text" :keywords="['数学', '物理', '化学']" />`

const caseText = 'OCR 识别完成后，还会用 ocr 置信度过滤低质量结果。'

const caseCode = `<BaseHighlight :text="text" keywords="OCR" />
<BaseHighlight :text="text" keywords="OCR" case-sensitive />`

const customCode = `<BaseHighlight
  :text="text"
  keywords="重点"
  highlight-class="rounded px-0.5 bg-amber-200/70 text-amber-900 dark:bg-amber-400/20 dark:text-amber-300"
/>`
</script>

<template>
  <DemoBlock
    title="搜索实时高亮"
    description="keywords 传入搜索词后，文本中命中的片段用主题色标出；关键词为空时原样渲染。"
    :code="searchCode"
  >
    <div class="grid max-w-md gap-3">
      <BaseInput v-model="query" placeholder="输入关键词试试，如：函数 / 公式" clearable />
      <ul class="grid gap-2 text-sm text-slate-700 dark:text-[#d0d6e0]">
        <li v-for="item in sentences" :key="item">
          <BaseHighlight :text="item" :keywords="query" />
        </li>
      </ul>
    </div>
  </DemoBlock>

  <DemoBlock
    title="多关键词"
    description="keywords 传数组同时高亮多个词；内部按长度降序匹配，长词优先，不会被短词拆碎。"
    :code="multiCode"
  >
    <p class="text-sm leading-6 text-slate-700 dark:text-[#d0d6e0]">
      <BaseHighlight :text="multiText" :keywords="['数学', '物理', '化学']" />
    </p>
  </DemoBlock>

  <DemoBlock
    title="区分大小写"
    description="默认忽略大小写；caseSensitive 开启后只匹配大小写完全一致的片段。"
    :code="caseCode"
  >
    <div class="grid gap-2 text-sm leading-6 text-slate-700 dark:text-[#d0d6e0]">
      <p>
        <span class="mr-2 text-xs text-slate-400 dark:text-[#62666d]">默认</span>
        <BaseHighlight :text="caseText" keywords="OCR" />
      </p>
      <p>
        <span class="mr-2 text-xs text-slate-400 dark:text-[#62666d]">区分大小写</span>
        <BaseHighlight :text="caseText" keywords="OCR" case-sensitive />
      </p>
    </div>
  </DemoBlock>

  <DemoBlock
    title="自定义高亮样式"
    description="highlightClass 可整体替换高亮片段的类名，比如换成琥珀色荧光笔效果。"
    :code="customCode"
  >
    <p class="text-sm leading-6 text-slate-700 dark:text-[#d0d6e0]">
      <BaseHighlight
        text="订正时先标记本题的重点步骤，再把重点公式抄写到错题本页眉。"
        keywords="重点"
        highlight-class="rounded px-0.5 bg-amber-200/70 text-amber-900 dark:bg-amber-400/20 dark:text-amber-300"
      />
    </p>
  </DemoBlock>
</template>
