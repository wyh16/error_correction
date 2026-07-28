<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

interface Props {
  modelValue?: number
  min?: number
  max?: number
  direction?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 45,
  min: 20,
  max: 80,
  direction: 'horizontal',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const dragging = ref(false)

const isVertical = computed(() => props.direction === 'vertical')
const firstStyle = computed(() => ({ flexBasis: `${props.modelValue}%` }))

function startDrag(event: PointerEvent) {
  dragging.value = true
  window.addEventListener('pointermove', onDrag)
  window.addEventListener('pointerup', stopDrag)
  // 触摸拖拽可能被浏览器取消（如系统手势打断），同样要结束拖拽
  window.addEventListener('pointercancel', stopDrag)
  event.preventDefault()
}

function onDrag(event: PointerEvent) {
  if (!rootRef.value) return
  const rect = rootRef.value.getBoundingClientRect()
  const raw = isVertical.value
    ? ((event.clientY - rect.top) / rect.height) * 100
    : ((event.clientX - rect.left) / rect.width) * 100
  const value = Math.min(props.max, Math.max(props.min, raw))
  emit('update:modelValue', Math.round(value))
  emit('change', Math.round(value))
}

function stopDrag() {
  dragging.value = false
  window.removeEventListener('pointermove', onDrag)
  window.removeEventListener('pointerup', stopDrag)
  window.removeEventListener('pointercancel', stopDrag)
}

// 拖拽中组件被卸载时清理全局监听，避免泄漏
onBeforeUnmount(stopDrag)
</script>

<template>
  <div
    ref="rootRef"
    class="flex min-h-56 overflow-hidden rounded-xl border border-slate-200 bg-white/70 dark:border-white/[0.08] dark:bg-white/[0.025]"
    :class="isVertical ? 'flex-col' : ''"
  >
    <section class="min-w-0 shrink-0 grow-0 overflow-auto p-4 custom-scrollbar" :class="isVertical ? 'min-h-0' : ''" :style="firstStyle">
      <slot name="left" />
    </section>
    <button
      type="button"
      class="shrink-0 touch-none bg-slate-200/70 transition-colors hover:bg-[rgb(var(--accent-rgb)/0.45)] dark:bg-white/[0.08] dark:hover:bg-[rgb(var(--accent-rgb)/0.45)]"
      :class="[
        isVertical ? 'h-2 w-full cursor-row-resize' : 'w-2 cursor-col-resize',
        dragging ? 'bg-[rgb(var(--accent-rgb)/0.55)]' : '',
      ]"
      @pointerdown="startDrag"
    ></button>
    <section class="min-w-0 flex-1 overflow-auto p-4 custom-scrollbar" :class="isVertical ? 'min-h-0' : ''">
      <slot name="right" />
    </section>
  </div>
</template>
