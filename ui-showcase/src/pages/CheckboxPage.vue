<script setup lang="ts">
import { ref } from 'vue'
import BaseCheckbox from '@/components/base/BaseCheckbox.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const checkboxValue = ref(['wrongbook'])
const boolChecked = ref(true)
const customValue = ref('yes')

const basicCode = `<!-- 数组模式：多选 -->
<BaseCheckbox v-model="list" value="wrongbook" label="加入错题库" />
<BaseCheckbox v-model="list" value="notes" label="加入笔记" />

<!-- 布尔模式：单开关 -->
<BaseCheckbox v-model="checked" label="布尔选中" />`
</script>

<template>
  <DemoBlock title="基础用法" description="v-model 绑定数组时为多选模式，绑定布尔值时为单开关模式。" :code="basicCode">
    <div class="flex flex-wrap items-center gap-6">
      <BaseCheckbox v-model="checkboxValue" value="wrongbook" label="加入错题库" description="数组模式，适合多选项。" />
      <BaseCheckbox v-model="checkboxValue" value="notes" label="加入笔记" description="同一数组的第二个选项。" />
      <BaseCheckbox v-model="boolChecked" label="布尔选中" description="布尔模式，适合单个开关。" />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">数组值：{{ checkboxValue }}</p>
  </DemoBlock>

  <DemoBlock title="自定义 true / false 值" description="trueValue / falseValue 支持非布尔的选中值。">
    <BaseCheckbox v-model="customValue" true-value="yes" false-value="no" label="自定义值" :description="`当前值：${customValue}`" />
  </DemoBlock>

  <DemoBlock title="状态" description="indeterminate 中间态、disabled 禁用、error 错误边框。">
    <div class="flex flex-wrap items-center gap-6">
      <BaseCheckbox label="中间态" indeterminate description="可用于父级半选状态。" />
      <BaseCheckbox label="禁用" disabled description="禁用后不可交互。" />
      <BaseCheckbox label="错误状态" error description="边框显示警示色。" />
    </div>
  </DemoBlock>
</template>
