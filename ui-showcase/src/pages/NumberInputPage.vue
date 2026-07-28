<script setup lang="ts">
import { ref } from 'vue'
import BaseNumberInput from '@/components/base/BaseNumberInput.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const numberValue = ref(30)
const stepped = ref(50)
</script>

<template>
  <DemoBlock title="基础用法" description="支持 min / max / step 和左右步进按钮。">
    <div class="max-w-xs">
      <BaseNumberInput v-model="numberValue" label="分数" :min="0" :max="100" :step="5" placeholder="输入分数" />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">当前值：{{ numberValue }}</p>
  </DemoBlock>

  <DemoBlock title="状态" description="hint 辅助说明、error 错误提示、disabled 禁用。">
    <div class="grid max-w-xs gap-4">
      <BaseNumberInput v-model="stepped" label="带提示" hint="步长为 10。" :step="10" />
      <BaseNumberInput label="错误状态" error="数值超出范围" :model-value="120" :max="100" />
      <BaseNumberInput label="禁用" :model-value="42" disabled />
    </div>
  </DemoBlock>
</template>
