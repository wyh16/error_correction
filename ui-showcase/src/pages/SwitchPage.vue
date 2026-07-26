<script setup lang="ts">
import { ref } from 'vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const switchOn = ref(true)
</script>

<template>
  <DemoBlock
    title="基础用法"
    description="基于 Headless UI Switch 实现的开关组件，label 显示在右侧。开启态轨道与键盘聚焦环使用主题色，切换主题色时会同步更新。"
  >
    <div class="flex flex-wrap items-center gap-6">
      <BaseSwitch v-model="switchOn" label="自动保存" />
      <BaseSwitch :model-value="false" label="关闭状态" />
      <BaseSwitch v-model="switchOn" />
    </div>
  </DemoBlock>

  <DemoBlock title="尺寸" description="size 支持 sm（默认）与 md 两档。">
    <div class="flex flex-wrap items-center gap-6">
      <BaseSwitch v-model="switchOn" label="sm（默认）" />
      <BaseSwitch v-model="switchOn" size="md" label="md" />
    </div>
  </DemoBlock>

  <DemoBlock title="禁用状态" description="disabled 后不可交互并降低透明度。">
    <div class="flex flex-wrap items-center gap-6">
      <BaseSwitch :model-value="true" label="禁用（开）" disabled />
      <BaseSwitch :model-value="false" label="禁用（关）" disabled />
    </div>
  </DemoBlock>
</template>
