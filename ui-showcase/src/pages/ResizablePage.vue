<script setup lang="ts">
import { ref } from 'vue'
import BaseResizablePanels from '@/components/base/BaseResizablePanels.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const ratio = ref(40)
</script>

<template>
  <DemoBlock title="可拖拽分栏" description="拖动中缝调整左右比例，min / max 限制范围，modelValue 双向绑定百分比。">
    <BaseResizablePanels v-model="ratio" :min="25" :max="75" class="h-56 overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
      <template #left>
        <div class="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-500 dark:bg-white/[0.02] dark:text-[#8a8f98]">
          左栏 {{ ratio }}%
        </div>
      </template>
      <template #right>
        <div class="flex h-full items-center justify-center text-sm text-slate-500 dark:text-[#8a8f98]">
          右栏 {{ 100 - ratio }}%
        </div>
      </template>
    </BaseResizablePanels>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">当前比例：{{ ratio }}%（范围 25% - 75%）</p>
  </DemoBlock>
</template>
