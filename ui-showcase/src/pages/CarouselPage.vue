<script setup lang="ts">
import { ref } from 'vue'
import BaseCarousel from '@/components/base/BaseCarousel.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const photoItems = [
  { image: 'https://picsum.photos/seed/study/800/400', title: '拍照录题', description: '拍下错题，自动识别题目与作答区域' },
  { image: 'https://picsum.photos/seed/notebook/800/400', title: '智能整理', description: '按学科和知识点自动归档错题本' },
  { image: 'https://picsum.photos/seed/desk/800/400', title: '定期回顾', description: '按遗忘曲线推送待复习的错题' },
]

const textItems = [
  { title: '每日一句', description: '不积跬步，无以至千里；不积小流，无以成江海。' },
  { title: '学习提示', description: '订正错题时先回忆解题思路，再对照标准答案。' },
  { title: '阶段目标', description: '本周完成数学函数专题的 12 道错题订正。' },
]

const photoIndex = ref(0)

const photoCode = `<BaseCarousel :items="photoItems" autoplay :interval="3000" @change="index => (photoIndex = index)" />

const photoItems = [
  { image: 'https://picsum.photos/seed/study/800/400', title: '拍照录题', description: '拍下错题…' },
  { image: 'https://picsum.photos/seed/notebook/800/400', title: '智能整理', description: '按学科归档…' },
]`

const textCode = `<BaseCarousel :items="textItems" height-class="h-36" />

const textItems = [
  { title: '每日一句', description: '不积跬步，无以至千里…' },
  { title: '学习提示', description: '订正错题时先回忆解题思路…' },
]`

const modeCode = `<BaseCarousel :items="items" indicator="line" arrow="always" height-class="h-40" />
<BaseCarousel :items="items" :loop="false" height-class="h-40" />`
</script>

<template>
  <DemoBlock
    title="图片轮播"
    description="items 传 image 渲染图片幻灯片，title / description 显示在底部渐变遮罩上；autoplay 自动播放，悬停暂停、移出恢复，change 事件回传当前索引。"
    :code="photoCode"
  >
    <div class="grid gap-3">
      <BaseCarousel :items="photoItems" autoplay :interval="3000" @change="index => (photoIndex = index)" />
      <p class="text-xs text-slate-500 dark:text-[#8a8f98]">change 事件：当前第 {{ photoIndex + 1 }} 张</p>
    </div>
  </DemoBlock>

  <DemoBlock title="文字卡片" description="不传 image 时渲染主题色文字卡片，适合公告、金句、目标轮播。" :code="textCode">
    <BaseCarousel :items="textItems" height-class="h-36" />
  </DemoBlock>

  <DemoBlock
    title="指示器与箭头"
    description="indicator 支持 dots / line / none；arrow 支持 hover（悬停出现）/ always / never；loop 关闭后滑到端点即停住，对应方向箭头禁用。"
    :code="modeCode"
  >
    <div class="grid gap-4 md:grid-cols-2">
      <div class="grid gap-2">
        <p class="text-xs font-semibold text-slate-500 dark:text-[#8a8f98]">line 指示器 + 常驻箭头</p>
        <BaseCarousel :items="photoItems" indicator="line" arrow="always" height-class="h-40" />
      </div>
      <div class="grid gap-2">
        <p class="text-xs font-semibold text-slate-500 dark:text-[#8a8f98]">不循环（loop=false）+ 悬停箭头</p>
        <BaseCarousel :items="photoItems" :loop="false" height-class="h-40" />
      </div>
    </div>
  </DemoBlock>
</template>
