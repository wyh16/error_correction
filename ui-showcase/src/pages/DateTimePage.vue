<script setup lang="ts">
import { ref } from 'vue'
import BaseDatePicker from '@/components/base/BaseDatePicker.vue'
import BaseTimePicker from '@/components/base/BaseTimePicker.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const dateValue = ref('2026-06-15')
const timeValue = ref('19:30')
const rangeDate = ref('')
</script>

<template>
  <DemoBlock title="日期选择" description="BaseDatePicker 点击后弹出自定义日历面板（复用 BaseCalendar），支持 label / hint / error / min / max，悬停可清除已选日期。">
    <div class="grid max-w-xs gap-4">
      <BaseDatePicker v-model="dateValue" label="复习日期" placeholder="请选择日期" />
      <BaseDatePicker v-model="rangeDate" label="限定范围" min="2026-06-01" max="2026-06-30" hint="仅可选 2026 年 6 月。" />
      <BaseDatePicker label="错误状态" error="日期不能为空" />
      <BaseDatePicker label="不可清除" model-value="2026-03-08" :clearable="false" hint="clearable 设为 false 时隐藏清除按钮。" />
      <BaseDatePicker label="禁用" model-value="2026-01-01" disabled />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">当前选择：{{ dateValue || '（空）' }}</p>
  </DemoBlock>

  <DemoBlock title="时间选择" description="BaseTimePicker 支持 min / max / step（秒）。">
    <div class="grid max-w-xs gap-4">
      <BaseTimePicker v-model="timeValue" label="提醒时间" />
      <BaseTimePicker label="半小时粒度" :step="1800" hint="step 为 1800 秒。" />
      <BaseTimePicker label="禁用" model-value="08:00" disabled />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">当前选择：{{ timeValue }}</p>
  </DemoBlock>
</template>
