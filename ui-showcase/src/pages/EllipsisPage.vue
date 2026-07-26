<script setup lang="ts">
import BaseEllipsis from '@/components/base/BaseEllipsis.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const longText =
  '在错题订正系统中，拍照识别是整个流程的第一步：系统会先对上传的图片做透视校正和去噪，再通过 OCR 模型提取题目文本与手写作答区域，最后由大语言模型对题目进行结构化解析，识别出题干、选项、学生作答与批改标记，为后续的错因分析和同类题推荐提供数据基础。'

const shortText = '这段文本很短，不会触发截断。'

const tooltipCode = `<BaseEllipsis :content="longText" :line-clamp="1" tooltip />`

const expandCode = `<BaseEllipsis :content="longText" :line-clamp="3" expandable />`
</script>

<template>
  <DemoBlock
    title="单行省略与 Tooltip"
    description="lineClamp 控制显示行数；tooltip 开启后，仅在确实发生截断时悬停显示完整内容（仅 content 文本模式支持）。"
    :code="tooltipCode"
  >
    <div class="max-w-sm rounded-xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#d0d6e0]">
      <BaseEllipsis :content="longText" :line-clamp="1" tooltip />
    </div>
  </DemoBlock>

  <DemoBlock
    title="多行截断与展开收起"
    description="expandable 开启后，截断的文本下方出现「展开」按钮，展开后可再收起；收起时会重新检测截断状态。"
    :code="expandCode"
  >
    <div class="max-w-md text-sm leading-6 text-slate-700 dark:text-[#d0d6e0]">
      <BaseEllipsis :content="longText" :line-clamp="3" expandable />
    </div>
  </DemoBlock>

  <DemoBlock
    title="短文本边界"
    description="未发生截断时不显示展开按钮、也不弹 Tooltip，短内容不会被多余的交互打扰。"
  >
    <div class="max-w-md text-sm text-slate-700 dark:text-[#d0d6e0]">
      <BaseEllipsis :content="shortText" :line-clamp="2" expandable tooltip />
    </div>
  </DemoBlock>
</template>
