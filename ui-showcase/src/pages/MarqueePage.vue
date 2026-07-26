<script setup lang="ts">
import BaseMarquee from '@/components/base/BaseMarquee.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notice =
  '系统将于本周六 02:00 - 04:00 进行升级维护，期间拍照识别服务暂不可用，请提前安排学习计划。'

const messages = [
  '张三 刚刚完成了「函数与导数」错题回顾',
  '本周全班共订正错题 128 道',
  '新增「立体几何」专题课，欢迎报名',
  '期中模拟考将于下周三开考',
]

const noticeCode = `<BaseMarquee icon="fa-bullhorn" :text="notice" :speed="60" />`

const listCode = `<BaseMarquee :text="messages" :speed="50" />

const messages = [
  '张三 刚刚完成了「函数与导数」错题回顾',
  '本周全班共订正错题 128 道',
]`

const speedCode = `<BaseMarquee :text="notice" direction="right" :pause-on-hover="false" :speed="120" />
<BaseMarquee :text="notice" direction="right" :pause-on-hover="false" :speed="30" />`
</script>

<template>
  <DemoBlock
    title="公告栏"
    description="icon 固定在左侧不滚动；文本无缝循环滚动，两侧渐隐遮罩；默认悬停暂停，方便阅读。"
    :code="noticeCode"
  >
    <div class="accent-bg-soft rounded-lg px-4 py-2.5">
      <BaseMarquee icon="fa-bullhorn" :text="notice" :speed="60" />
    </div>
  </DemoBlock>

  <DemoBlock
    title="多条消息"
    description="text 传数组时按顺序滚动播出，项与项之间用分隔点隔开。"
    :code="listCode"
  >
    <div class="rounded-lg border border-slate-200 bg-white/80 px-4 py-2.5 dark:border-white/[0.08] dark:bg-white/[0.03]">
      <BaseMarquee icon="fa-tower-broadcast" :text="messages" :speed="50" />
    </div>
  </DemoBlock>

  <DemoBlock
    title="方向与速度"
    description="direction='right' 反向滚动；speed 为像素每秒，内容越长自动换算出越长的周期；pauseOnHover 关闭后悬停不暂停。"
    :code="speedCode"
  >
    <div class="grid gap-3">
      <div class="rounded-lg border border-slate-200 bg-white/80 px-4 py-2.5 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <BaseMarquee :text="notice" direction="right" :pause-on-hover="false" :speed="120" />
      </div>
      <div class="rounded-lg border border-slate-200 bg-white/80 px-4 py-2.5 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <BaseMarquee :text="notice" direction="right" :pause-on-hover="false" :speed="30" />
      </div>
    </div>
  </DemoBlock>
</template>
