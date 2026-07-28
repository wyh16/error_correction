<script setup lang="ts">
/**
 * ImageModal.vue
 * 图片预览弹窗（滚轮缩放）
 */
import { computed } from 'vue'
import { clampScale } from '@/utils/index'
import { useOverlay } from '@/composables/useOverlay'

interface Props {
  open?: boolean
  src?: string
  scale?: number
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  src: '',
  scale: 1,
})

const emit = defineEmits<{
  close: []
  'update:scale': [scale: number]
}>()

const MIN_SCALE = 0.25
const MAX_SCALE = 5

// 接入统一浮层管理：动态 z-index + ESC 关闭 + 滚动锁
const { overlayRef, overlayStyle } = useOverlay(
  computed(() => props.open),
  { onClose: () => emit('close'), trapFocus: false },
)

const onWheel = (e: WheelEvent) => {
  // 模板上的 @wheel.prevent 已阻止默认滚动，这里只负责计算缩放
  emit('update:scale', clampScale(props.scale, e.deltaY, MIN_SCALE, MAX_SCALE))
}
</script>

<template>
  <Teleport to="body">
    <div
      v-show="open"
      ref="overlayRef"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      class="img-modal fixed inset-0 flex items-center justify-center bg-black/80 p-4"
      :style="overlayStyle"
      @click="emit('close')"
      @wheel.prevent="onWheel"
    >
      <img
        class="max-h-[90vh] w-auto max-w-full rounded-xl shadow-2xl transition-transform duration-100"
        :style="{ transform: `scale(${scale})` }"
        :src="src"
        alt="预览"
        @click.stop
      />
    </div>
  </Teleport>
</template>
