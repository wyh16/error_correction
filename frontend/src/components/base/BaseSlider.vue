<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  label: { type: String, default: '' },
  showValue: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

const percent = computed(() => {
  if (props.max === props.min) return 0
  return Math.min(100, Math.max(0, ((props.modelValue - props.min) / (props.max - props.min)) * 100))
})

/**
 * 指示点位置：在 percent 基础上做 ±8px（半个指示点宽度）的线性修正，
 * 让指示点在 0% / 100% 时不超出轨道两端，与原生滑块的表现一致。
 */
const thumbLeft = computed(() => `calc(${percent.value}% + ${((50 - percent.value) * 0.16).toFixed(2)}px)`)

// 原生 input 的滑块无法用 CSS 过渡位置，因此视觉层（轨道 / 填充 / 指示点）
// 由自定义元素按 percent 定位，原生 input 保持隐形，只负责交互和无障碍（键盘、表单语义）。
//
// 拖动检测：pointerdown 后一旦发生 pointermove 即视为拖动，期间关闭位置过渡保证跟手；
// 单击轨道和键盘、程序赋值不会触发 pointermove，位置仍然平滑过渡。
const pressing = ref(false)
const dragging = ref(false)

function onPointerMove() {
  if (pressing.value) dragging.value = true
}

function onPointerUp() {
  pressing.value = false
  dragging.value = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

function onPointerDown() {
  if (props.disabled) return
  pressing.value = true
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})

function update(event) {
  const value = Number(event.target.value)
  emit('update:modelValue', value)
  emit('change', value, event)
}
</script>

<template>
  <div>
    <div v-if="label || showValue" class="mb-2 flex items-center justify-between gap-3">
      <label v-if="label" class="text-sm font-medium text-slate-700 dark:text-[#d0d6e0]">{{ label }}</label>
      <span v-if="showValue" class="text-xs font-semibold text-slate-500 dark:text-[#8a8f98]">{{ modelValue }}</span>
    </div>

    <div
      class="base-slider relative h-2"
      :class="[dragging ? 'base-slider--dragging' : '', disabled ? 'opacity-60' : '']"
    >
      <!-- 轨道 -->
      <div class="pointer-events-none absolute inset-0 rounded-full bg-slate-200 dark:bg-white/[0.08]"></div>
      <!-- 填充条 -->
      <div class="base-slider__fill pointer-events-none absolute inset-y-0 left-0 rounded-full" :style="{ width: `${percent}%` }"></div>

      <!-- 隐形原生 input：负责指针 / 键盘交互与无障碍语义 -->
      <input
        type="range"
        class="base-slider__input absolute left-0 top-1/2 h-6 w-full -translate-y-1/2 cursor-pointer appearance-none opacity-0 outline-none disabled:cursor-not-allowed"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :aria-label="label || undefined"
        @input="update"
        @pointerdown="onPointerDown"
      />

      <!-- 指示点：必须位于 input 之后，供 :hover / :active / :focus-visible ~ 兄弟选择器驱动状态样式 -->
      <div class="base-slider__thumb pointer-events-none absolute top-1/2" :style="{ left: thumbLeft }"></div>
    </div>
  </div>
</template>

<style scoped>
.base-slider__fill {
  background: rgb(var(--accent-rgb));
  transition: width 0.18s ease;
}

.base-slider__thumb {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: white;
  border: 3px solid rgb(var(--accent-rgb));
  box-shadow: 0 1px 4px rgb(15 23 42 / 0.25);
  transform: translate(-50%, -50%);
  transition: left 0.18s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

/* 拖动过程中关闭位置过渡，让填充条和指示点实时跟手；点击轨道、键盘和程序赋值仍然平滑。 */
.base-slider--dragging .base-slider__fill {
  transition: none;
}
.base-slider--dragging .base-slider__thumb {
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

/* 悬停 / 键盘聚焦：指示点放大并出现主题色光晕 */
.base-slider__input:not(:disabled):hover ~ .base-slider__thumb,
.base-slider__input:not(:disabled):focus-visible ~ .base-slider__thumb {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 1px 4px rgb(15 23 42 / 0.25), 0 0 0 6px rgb(var(--accent-rgb) / 0.15);
}

/* 按住 / 拖动：光晕进一步扩大，给出明确的按压反馈 */
.base-slider__input:not(:disabled):active ~ .base-slider__thumb {
  transform: translate(-50%, -50%) scale(1.3);
  box-shadow: 0 1px 4px rgb(15 23 42 / 0.25), 0 0 0 9px rgb(var(--accent-rgb) / 0.22);
}
</style>
