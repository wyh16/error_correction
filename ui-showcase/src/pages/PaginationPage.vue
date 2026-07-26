<script setup lang="ts">
import { ref } from 'vue'
import BasePagination from '@/components/base/BasePagination.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const page = ref(1)
const bigPage = ref(7)
const totalPage = ref(3)
const siblingPage = ref(10)

const advancedCode = `<!-- showTotal 显示总条数，siblingCount 控制当前页两侧页码数量 -->
<BasePagination v-model:page="page" :total-pages="12" :show-total="118" />
<BasePagination v-model:page="page" :total-pages="20" :sibling-count="2" />`
</script>

<template>
  <DemoBlock title="基础用法" description="page + totalPages 双向绑定，切换时触发 change。">
    <BasePagination v-model:page="page" :total-pages="5" />
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">当前第 {{ page }} 页</p>
  </DemoBlock>

  <DemoBlock title="多页折叠" description="页数超过窗口容量时自动出现省略号，始终保留首尾页。">
    <BasePagination v-model:page="bigPage" :total-pages="20" />
  </DemoBlock>

  <DemoBlock title="总条数与页码窗口" description="showTotal 大于 0 时在左侧显示「共 N 条」；siblingCount 控制当前页两侧各保留几个相邻页码（默认 1）。" :code="advancedCode">
    <div class="grid gap-4">
      <BasePagination v-model:page="totalPage" :total-pages="12" :show-total="118" />
      <BasePagination v-model:page="siblingPage" :total-pages="20" :sibling-count="2" />
    </div>
  </DemoBlock>
</template>
