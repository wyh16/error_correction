<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCountdown from '@/components/base/BaseCountdown.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const controlRef = ref()
const remainingMs = ref(90000)

const controlCode = `<BaseCountdown ref="countdown" :value="90" :auto-start="false" @change="ms => (remainingMs = ms)" />

<BaseButton @click="countdown.start()">开始</BaseButton>
<BaseButton @click="countdown.pause()">暂停</BaseButton>
<BaseButton @click="countdown.reset()">重置</BaseButton>`

// 目标时间戳模式：value > 1e12 时按绝对时间倒计时
const deadline = Date.now() + 30 * 60 * 1000

const deadlineCode = `const deadline = Date.now() + 30 * 60 * 1000

<BaseCountdown :value="deadline" />`

const finishRef = ref()

function startFinishDemo() {
  // 结束后 remaining 归零，重播前必须先 reset 恢复初始值
  finishRef.value?.reset()
  finishRef.value?.start()
}

const finishCode = `<BaseCountdown ref="countdown" :value="5" :auto-start="false" @finish="notify('success')" />

function replay() {
  countdown.value.reset()
  countdown.value.start()
}`

const dayCode = `<BaseCountdown :value="3 * 86400 + 5 * 3600 + 600" format="DD 天 HH:mm:ss" />`
</script>

<template>
  <DemoBlock
    title="基础用法与手动控制"
    description="value 传剩余秒数；autoStart 关闭后通过模板 ref 调用暴露的 start / pause / reset 方法，change 事件回传剩余毫秒数。"
    :code="controlCode"
  >
    <div class="grid gap-4">
      <BaseCountdown ref="controlRef" :value="90" :auto-start="false" @change="ms => (remainingMs = ms)" />
      <div class="flex flex-wrap gap-2">
        <BaseButton size="sm" @click="controlRef?.start()">开始</BaseButton>
        <BaseButton size="sm" variant="secondary" @click="controlRef?.pause()">暂停</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="controlRef?.reset()">重置</BaseButton>
      </div>
      <p class="text-xs text-slate-500 dark:text-[#8a8f98]">change 事件：剩余 {{ (remainingMs / 1000).toFixed(1) }} 秒</p>
    </div>
  </DemoBlock>

  <DemoBlock
    title="目标时间戳模式"
    description="value 大于 1e12 时视为目标时间戳（毫秒），组件按绝对时间计算剩余量；默认 autoStart 自动开始。"
    :code="deadlineCode"
  >
    <div class="flex items-center gap-3">
      <span class="text-sm text-slate-500 dark:text-[#8a8f98]">距离模拟考试开始还有</span>
      <BaseCountdown :value="deadline" />
    </div>
  </DemoBlock>

  <DemoBlock
    title="结束回调"
    description="倒计时归零时触发 finish 事件，适合考试收卷、验证码重发等场景。"
    :code="finishCode"
  >
    <div class="flex flex-wrap items-center gap-4">
      <BaseCountdown ref="finishRef" :value="5" :auto-start="false" @finish="notify('success')" />
      <BaseButton size="sm" @click="startFinishDemo">开始 5 秒倒计时</BaseButton>
    </div>
  </DemoBlock>

  <DemoBlock
    title="天数格式"
    description="format 支持 DD / HH / mm / ss 占位符；含 DD 时天数单独展示，否则超过 24 小时的部分折算进 HH。"
    :code="dayCode"
  >
    <div class="flex items-center gap-3">
      <span class="text-sm text-slate-500 dark:text-[#8a8f98]">距离高考还有</span>
      <BaseCountdown :value="3 * 86400 + 5 * 3600 + 600" format="DD 天 HH:mm:ss" />
    </div>
  </DemoBlock>
</template>
