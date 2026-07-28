<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseToastContainer from '@/components/base/BaseToastContainer.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

// 独立于全局 notify 的本地队列，演示 position 属性
const topToasts = ref<Array<{ id: number, type: string, title: string }>>([])
let topToastId = 0

function pushTopToast() {
  const id = ++topToastId
  topToasts.value = [...topToasts.value, { id, type: 'success', title: '来自右上角的通知' }].slice(-3)
  setTimeout(() => dismissTopToast(id), 3000)
}

function dismissTopToast(id: number) {
  topToasts.value = topToasts.value.filter(toast => toast.id !== id)
}

const positionCode = `<BaseToastContainer :toasts="toasts" position="top-right" @dismiss="dismiss" />`
</script>

<template>
  <DemoBlock title="全局通知" description="BaseToastContainer 挂载在应用根部，通过 toasts 数组驱动，支持 success / error / warning / info 四种类型和操作按钮。">
    <div class="flex flex-wrap gap-2">
      <BaseButton size="sm" @click="notify('success')">成功通知</BaseButton>
      <BaseButton size="sm" variant="secondary" @click="notify('error')">错误通知</BaseButton>
      <BaseButton size="sm" variant="secondary" @click="notify('info')">信息通知</BaseButton>
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">
      本站的容器渲染在右下角，最多保留 3 条；点击通知上的按钮或关闭图标触发 dismiss。
    </p>
  </DemoBlock>

  <DemoBlock title="自定义位置" description="position 支持 bottom-right（默认）/ top-right / bottom-left / top-left。此例使用一个独立队列的容器渲染在右上角。" :code="positionCode">
    <BaseButton size="sm" variant="secondary" @click="pushTopToast">在右上角弹出通知</BaseButton>
    <BaseToastContainer :toasts="topToasts" position="top-right" @dismiss="dismissTopToast" />
  </DemoBlock>
</template>
