<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseNumberAnimation from '@/components/base/BaseNumberAnimation.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const dashboardCode = `<BaseNumberAnimation :to="1284" />
<BaseNumberAnimation :to="326" />
<BaseNumberAnimation :to="96.5" :precision="1" suffix="%" />`

const affixCode = `<BaseNumberAnimation :to="52340.5" :precision="2" prefix="¥" />
<BaseNumberAnimation :to="98.25" :precision="2" suffix="%" />
<BaseNumberAnimation :to="20260721" separator="" />`

const replayRef = ref()

const replayCode = `<BaseNumberAnimation ref="numberRef" :from="0" :to="8848" :duration="2000" />

<BaseButton @click="numberRef.play()">重播</BaseButton>`

const target = ref(1200)

function randomTarget() {
  target.value = Math.round(Math.random() * 5000)
}

const targetCode = `<BaseNumberAnimation :to="target" />

// to 变化时从当前显示值平滑过渡到新值，不会跳回 from 重播
target.value = Math.round(Math.random() * 5000)`
</script>

<template>
  <DemoBlock
    title="数据看板"
    description="默认 autoplay，进入页面后从 from 滚动到 to；组件本身不带字号，由外层容器控制大小。"
    :code="dashboardCode"
  >
    <div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <p class="text-xs text-slate-500 dark:text-[#8a8f98]">累计录入错题</p>
        <p class="mt-1 text-3xl font-bold text-slate-900 dark:text-[#f7f8f8]">
          <BaseNumberAnimation :to="1284" />
        </p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <p class="text-xs text-slate-500 dark:text-[#8a8f98]">本月完成订正</p>
        <p class="mt-1 text-3xl font-bold text-slate-900 dark:text-[#f7f8f8]">
          <BaseNumberAnimation :to="326" />
        </p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <p class="text-xs text-slate-500 dark:text-[#8a8f98]">回顾正确率</p>
        <p class="mt-1 text-3xl font-bold text-slate-900 dark:text-[#f7f8f8]">
          <BaseNumberAnimation :to="96.5" :precision="1" suffix="%" />
        </p>
      </div>
    </div>
  </DemoBlock>

  <DemoBlock
    title="小数、前后缀与分隔符"
    description="precision 控制小数位，prefix / suffix 拼接在数字两侧；separator 默认千分位逗号，传空串关闭分组。"
    :code="affixCode"
  >
    <div class="grid gap-2 text-xl font-semibold text-slate-700 dark:text-[#d0d6e0]">
      <p><BaseNumberAnimation :to="52340.5" :precision="2" prefix="¥" /></p>
      <p><BaseNumberAnimation :to="98.25" :precision="2" suffix="%" /></p>
      <p><BaseNumberAnimation :to="20260721" separator="" /></p>
    </div>
  </DemoBlock>

  <DemoBlock title="手动重播" description="通过模板 ref 调用暴露的 play 方法，从 from 重新播放一遍完整动画。" :code="replayCode">
    <div class="flex items-center gap-4">
      <span class="text-2xl font-bold text-slate-900 dark:text-[#f7f8f8]">
        <BaseNumberAnimation ref="replayRef" :from="0" :to="8848" :duration="2000" />
      </span>
      <BaseButton size="sm" variant="secondary" icon="fa-rotate-right" @click="replayRef?.play()">重播</BaseButton>
    </div>
  </DemoBlock>

  <DemoBlock
    title="目标值变化自动过渡"
    description="to 变化时从当前显示值平滑过渡到新值，适合轮询刷新的实时指标。"
    :code="targetCode"
  >
    <div class="flex flex-wrap items-center gap-4">
      <span class="text-2xl font-bold text-slate-900 dark:text-[#f7f8f8]">
        <BaseNumberAnimation :to="target" />
      </span>
      <div class="flex gap-2">
        <BaseButton size="sm" variant="secondary" @click="target += 500">+500</BaseButton>
        <BaseButton size="sm" @click="randomTarget">随机目标值</BaseButton>
      </div>
    </div>
  </DemoBlock>
</template>
