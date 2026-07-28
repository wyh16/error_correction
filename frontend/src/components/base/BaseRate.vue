<script setup lang="ts">
/**
 * BaseRate.vue
 * 星级评分组件，支持半星、只读/禁用、自定义图标与配色。
 */
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
  // 允许半星：根据鼠标位于图标左半 / 右半区域取 x.5 或整数
  allowHalf: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  // 图标传 fa-* 类名，如 'fa-heart'
  icon: { type: String, default: 'fa-star' },
  tone: { type: String, default: 'amber' },
  // 是否在星星后展示当前数字分值
  showValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

const toneClass = {
  amber: 'text-amber-400',
  accent: 'accent-text',
  rose: 'text-rose-500',
  emerald: 'text-emerald-500',
  blue: 'text-blue-500',
}

// hover 预览值：0 表示没有预览，此时展示真实的 modelValue
const hoverValue = ref(0)

const interactive = computed(() => !props.readonly && !props.disabled)
const displayValue = computed(() => hoverValue.value || props.modelValue)

// 根据鼠标在图标内的横向位置计算分值；不启用半星时始终取整星
function valueFromEvent(index: number, event: MouseEvent) {
  if (!props.allowHalf) return index
  const target = event.currentTarget as HTMLElement | null
  if (!target) return index
  const rect = target.getBoundingClientRect()
  return event.clientX - rect.left < rect.width / 2 ? index - 0.5 : index
}

function handleMove(index: number, event: MouseEvent) {
  if (!interactive.value) return
  hoverValue.value = valueFromEvent(index, event)
}

function handleLeave() {
  hoverValue.value = 0
}

function handleClick(index: number, event: MouseEvent) {
  if (!interactive.value) return
  // 键盘触发的 click 没有坐标（detail 为 0），直接取整星
  const next = event.detail === 0 ? index : valueFromEvent(index, event)
  // 再次点击当前分值时清零，方便取消评分
  const value = next === props.modelValue ? 0 : next
  emit('update:modelValue', value)
  emit('change', value)
}

// 每颗星的填充比例：1 全亮 / 0.5 半亮 / 0 熄灭
function fillOf(index: number) {
  if (displayValue.value >= index) return 1
  if (props.allowHalf && displayValue.value >= index - 0.5) return 0.5
  return 0
}
</script>

<template>
  <div class="inline-flex items-center gap-2" :class="props.disabled ? 'cursor-not-allowed opacity-60' : ''">
    <div class="inline-flex items-center gap-1" @mouseleave="handleLeave">
      <button
        v-for="index in props.max"
        :key="index"
        type="button"
        class="relative text-lg leading-none"
        :class="interactive ? 'cursor-pointer transition-transform hover:scale-110' : props.disabled ? 'cursor-not-allowed' : 'cursor-default'"
        :disabled="props.disabled"
        :tabindex="interactive ? 0 : -1"
        :aria-label="`${index} 分`"
        @mousemove="handleMove(index, $event)"
        @click="handleClick(index, $event)"
      >
        <!-- 底层：未选中的灰色图标 -->
        <i class="fa-solid text-slate-300 dark:text-white/[0.15]" :class="props.icon"></i>
        <!-- 上层：按填充比例横向裁切的高亮图标，任意 fa 图标都能显示半星 -->
        <span
          v-if="fillOf(index) > 0"
          class="absolute inset-0 overflow-hidden"
          :style="{ width: fillOf(index) === 1 ? '100%' : '50%' }"
        >
          <i class="fa-solid" :class="[props.icon, toneClass[props.tone] || toneClass.amber]"></i>
        </span>
      </button>
    </div>
    <span v-if="props.showValue" class="text-sm font-semibold text-slate-500 dark:text-[#8a8f98]">{{ displayValue }}</span>
  </div>
</template>
