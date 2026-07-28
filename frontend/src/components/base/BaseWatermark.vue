<script setup lang="ts">
/**
 * BaseWatermark.vue
 * 水印容器：用离屏 canvas 生成平铺水印图，覆盖在内容之上且不拦截交互。
 */
import { ref, watch } from 'vue'

const props = defineProps({
  // 水印文案，传数组时渲染多行
  content: { type: [String, Array], default: '' },
  rotate: { type: Number, default: -22 },
  // [水平间距, 垂直间距]，单位 px
  gap: { type: Array, default: () => [100, 100] },
  fontSize: { type: Number, default: 14 },
  opacity: { type: Number, default: 0.15 },
})

const dataUrl = ref('')

function render() {
  const lines = (Array.isArray(props.content) ? props.content : [props.content])
    .map(line => String(line).trim())
    .filter(Boolean)
  if (!lines.length) {
    dataUrl.value = ''
    return
  }
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  // 先用目标字体测量文本包围盒，画布尺寸 = 包围盒 + 间距，平铺后自然形成 gap
  const font = `${props.fontSize}px -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif`
  ctx.font = font
  const lineHeight = Math.ceil(props.fontSize * 1.5)
  const textWidth = Math.max(...lines.map(line => ctx.measureText(line).width))
  const gapX = Number(props.gap[0] ?? 100)
  const gapY = Number(props.gap[1] ?? 100)
  const width = Math.ceil(textWidth + gapX)
  const height = Math.ceil(lineHeight * lines.length + gapY)
  // 按设备像素比放大物理尺寸，避免高分屏下水印文字发虚
  const ratio = window.devicePixelRatio || 1
  canvas.width = width * ratio
  canvas.height = height * ratio
  ctx.scale(ratio, ratio)
  // 修改画布尺寸会重置绘图状态，字体需要重设一次
  ctx.font = font
  // 中性灰 + 低透明度：亮暗两种背景下都可见，又不会盖住正文
  ctx.fillStyle = `rgba(120, 125, 135, ${props.opacity})`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.translate(width / 2, height / 2)
  ctx.rotate((props.rotate * Math.PI) / 180)
  lines.forEach((line, index) => {
    // 多行文本围绕旋转中心垂直均匀分布
    ctx.fillText(line, 0, (index - (lines.length - 1) / 2) * lineHeight)
  })
  dataUrl.value = canvas.toDataURL()
}

watch(
  () => [props.content, props.rotate, props.gap, props.fontSize, props.opacity],
  render,
  { deep: true, immediate: true },
)
</script>

<template>
  <div class="relative">
    <slot />
    <!-- 水印层盖在内容上方但 pointer-events-none，不影响选中和点击 -->
    <div
      v-if="dataUrl"
      class="pointer-events-none absolute inset-0 z-10"
      :style="{ backgroundImage: `url(${dataUrl})`, backgroundRepeat: 'repeat' }"
      aria-hidden="true"
    ></div>
  </div>
</template>
