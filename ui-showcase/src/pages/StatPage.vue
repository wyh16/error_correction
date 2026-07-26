<script setup lang="ts">
import BaseStat from '@/components/base/BaseStat.vue'
import DemoBlock from '~/components/DemoBlock.vue'
</script>

<template>
  <DemoBlock title="基础用法" description="支持 label、value、图标和 tone 配色（accent / blue / rose / amber / emerald / orange）。">
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <BaseStat label="基础组件" :value="65" icon="fa-cubes" tone="accent" />
      <BaseStat label="组件分组" :value="5" icon="fa-table-cells-large" tone="blue" />
      <BaseStat label="API 条目" :value="65" icon="fa-book-open" tone="amber" />
      <BaseStat label="掌握率" :value="86" suffix="%" icon="fa-chart-line" tone="emerald" />
      <BaseStat label="待复习" :value="12" suffix="题" icon="fa-fire" tone="orange" />
      <BaseStat label="连续打卡" :value="7" suffix="天" hint="hint 显示辅助说明" icon="fa-calendar-check" tone="rose" />
    </div>
  </DemoBlock>
</template>
