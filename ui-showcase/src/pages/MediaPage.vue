<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseLogo from '@/components/base/BaseLogo.vue'
import ImageModal from '@/components/base/ImageModal.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const imageOpen = ref(false)
const imageScale = ref(1)

function openImage() {
  imageScale.value = 1
  imageOpen.value = true
}
</script>

<template>
  <DemoBlock title="品牌 Logo" description="size 支持 sm / md / lg，breathe 开启呼吸动画（加载场景使用）。">
    <div class="flex flex-wrap items-end gap-4">
      <BaseLogo size="sm" />
      <BaseLogo />
      <BaseLogo size="lg" />
      <BaseLogo size="lg" breathe />
    </div>
  </DemoBlock>

  <DemoBlock title="图片预览" description="ImageModal 全屏预览图片，滚轮缩放（0.25x - 5x），点击遮罩关闭。">
    <BaseButton size="sm" variant="secondary" @click="openImage">预览 logo.svg</BaseButton>
    <ImageModal :open="imageOpen" src="/logo.svg" :scale="imageScale" @close="imageOpen = false" @update:scale="imageScale = $event" />
  </DemoBlock>
</template>
