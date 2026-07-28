<script setup lang="ts">
import { ref } from 'vue'
import BaseCalendar from '@/components/base/BaseCalendar.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const calendarValue = ref('2026-07-20')
const limitedValue = ref('')
</script>

<template>
  <DemoBlock title="基础用法" description="月视图日历面板，点击日期即选中，支持翻月。">
    <div class="max-w-sm">
      <BaseCalendar v-model="calendarValue" />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">当前选择：{{ calendarValue || '（未选择）' }}</p>
  </DemoBlock>

  <DemoBlock title="限定范围" description="min / max 限制可选日期，范围外的日期禁用。">
    <div class="max-w-sm">
      <BaseCalendar v-model="limitedValue" min="2026-07-10" max="2026-07-25" />
    </div>
  </DemoBlock>
</template>
