<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseLoading from '@/components/base/BaseLoading.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const loadingVisible = ref(false)

function showLoading() {
  loadingVisible.value = true
  window.setTimeout(() => {
    loadingVisible.value = false
  }, 1500)
}
</script>

<template>
  <DemoBlock title="全局加载遮罩" description="visible 控制显隐，全屏覆盖并展示品牌 Logo 呼吸动画，常用于页面切换。">
    <BaseButton size="sm" @click="showLoading">显示 1.5 秒</BaseButton>
    <BaseLoading :visible="loadingVisible" />
  </DemoBlock>
</template>
