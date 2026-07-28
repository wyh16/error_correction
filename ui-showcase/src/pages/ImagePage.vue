<script setup lang="ts">
import { inject } from 'vue'
import BaseImage from '@/components/base/BaseImage.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const fitCode = `<BaseImage src="..." :width="160" :height="160" fit="cover" />
<BaseImage src="..." :width="160" :height="160" fit="contain" />
<BaseImage src="..." :width="160" :height="160" fit="fill" />`

const lazyCode = `<div class="h-64 overflow-y-auto">
  <!-- 长内容... -->
  <BaseImage src="..." lazy :height="160" width="w-full" />
</div>`

const previewCode = `<BaseImage src="..." previewable :width="240" :height="160" />`

const fitModes = ['cover', 'contain', 'fill'] as const

const lazyImages = [
  'https://picsum.photos/seed/notebook/600/400',
  'https://picsum.photos/seed/classroom/600/400',
  'https://picsum.photos/seed/library/600/400',
]

function onLazyError() {
  // 占位图服务偶发不可用时给出反馈，避免 demo 静默失败
  notify('error')
}
</script>

<template>
  <DemoBlock
    title="填充模式"
    description="fit 对应 CSS object-fit：cover 裁切铺满、contain 完整显示留白、fill 拉伸变形；width / height 传数字按 px 生效。"
    :code="fitCode"
  >
    <!-- 3:2 的原图放进 1:1 的盒子，三种 fit 的差异才看得出来 -->
    <div class="flex flex-wrap gap-4">
      <div v-for="mode in fitModes" :key="mode" class="grid justify-items-center gap-2">
        <BaseImage src="https://picsum.photos/seed/formula/600/400" :width="160" :height="160" :fit="mode" alt="示例图片" />
        <span class="text-xs text-slate-500 dark:text-[#8a8f98]">{{ mode }}</span>
      </div>
    </div>
  </DemoBlock>

  <DemoBlock
    title="懒加载"
    description="lazy 通过 IntersectionObserver 在图片临近视口 100px 时才发起加载；向下滚动容器可以看到骨架先出现、图片随后载入。"
    :code="lazyCode"
  >
    <div class="h-64 space-y-4 overflow-y-auto rounded-lg border border-slate-200 p-4 dark:border-white/[0.08]">
      <p v-for="line in 8" :key="line" class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
        这是第 {{ line }} 段占位文字，用来把下方的图片推出可视区域，滚动时才会触发懒加载。
      </p>
      <BaseImage
        v-for="(src, index) in lazyImages"
        :key="src"
        :src="src"
        lazy
        width="w-full"
        :height="160"
        :alt="'懒加载示例 ' + (index + 1)"
        @error="onLazyError"
      />
    </div>
  </DemoBlock>

  <DemoBlock title="加载失败" description="src 无法访问时展示默认兜底（图标 + 文案），也可以用 fallback 插槽自定义。">
    <div class="flex flex-wrap items-start gap-4">
      <BaseImage src="https://example.invalid/broken.png" :width="180" :height="120" />
      <BaseImage src="https://example.invalid/broken.png" :width="180" :height="120">
        <template #fallback>
          <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
          <span class="text-xs text-amber-600 dark:text-amber-300">图片已失效，请重新上传</span>
        </template>
      </BaseImage>
    </div>
  </DemoBlock>

  <DemoBlock
    title="点击预览"
    description="previewable 悬停时显示放大镜遮罩，点击打开全屏预览，滚轮缩放、点击空白关闭（关闭后缩放会重置）。"
    :code="previewCode"
  >
    <BaseImage src="https://picsum.photos/seed/blackboard/600/400" previewable :width="240" :height="160" alt="点击预览" />
  </DemoBlock>
</template>
