<script setup lang="ts">
import { ref } from 'vue'
import BaseRadio from '@/components/base/BaseRadio.vue'
import BaseRadioGroup from '@/components/base/BaseRadioGroup.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const singleRadio = ref('a')
const radioValue = ref('compact')
const horizontalValue = ref('daily')

const radioOptions = [
  { value: 'compact', label: 'Compact', description: 'Dense controls for work surfaces.' },
  { value: 'comfortable', label: 'Comfortable', description: 'More breathing room for reading.' },
]
const horizontalOptions = [
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
]
</script>

<template>
  <DemoBlock title="单个单选框" description="BaseRadio 可独立使用，多个实例通过相同 name 组成一组；支持 description 和 disabled。">
    <div class="flex flex-wrap items-center gap-6">
      <BaseRadio v-model="singleRadio" value="a" label="选项 A" name="showcase-radio" />
      <BaseRadio v-model="singleRadio" value="b" label="选项 B" name="showcase-radio" description="带描述" />
      <BaseRadio v-model="singleRadio" value="c" label="禁用项" name="showcase-radio" disabled />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">当前选择：{{ singleRadio }}</p>
  </DemoBlock>

  <DemoBlock title="垂直单选组" description="BaseRadioGroup 通过 options 批量渲染，支持 label、description 和 error。">
    <BaseRadioGroup
      v-model="radioValue"
      :options="radioOptions"
      name="showcase-density"
      label="显示密度"
      description="影响列表与表格的行高。"
    />
  </DemoBlock>

  <DemoBlock title="水平方向与错误状态" description="direction 设为 horizontal 时选项横向排列。">
    <div class="grid gap-5">
      <BaseRadioGroup v-model="horizontalValue" :options="horizontalOptions" name="showcase-freq" direction="horizontal" />
      <BaseRadioGroup v-model="horizontalValue" :options="horizontalOptions" name="showcase-freq-err" direction="horizontal" error="请选择复习频率" />
    </div>
  </DemoBlock>
</template>
