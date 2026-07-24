<script setup lang="ts">
/**
 * BaseSwitch.vue
 * 通用开关控件，用于表达开启/关闭类设置。
 * 开启态轨道与键盘聚焦环均使用主题色（--accent-rgb），随主题切换生效。
 */
import { computed } from 'vue'
import { Switch } from '@headlessui/vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  // sm 为原有默认尺寸，md 提供更大的可点击区域
  size: { type: String, default: 'sm' },
})

const emit = defineEmits(['update:modelValue', 'change'])

// 轨道 / 滑块 / 开启位移按尺寸成组定义，避免类名拼接出错
const sizeClass = {
  sm: { track: 'h-4 w-7', thumb: 'h-3 w-3', on: 'translate-x-3' },
  md: { track: 'h-5 w-9', thumb: 'h-4 w-4', on: 'translate-x-4' },
}

const sizes = computed(() => sizeClass[props.size] || sizeClass.sm)

/**
 * 点击开关时切换布尔值；禁用状态下不响应交互。
 */
const toggle = (value, disabled) => {
  if (disabled) return
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div
    class="inline-flex items-center gap-2 transition-opacity"
    :class="disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
  >
    <Switch
      :model-value="modelValue"
      :disabled="disabled"
      class="group inline-flex items-center gap-2 focus:outline-none"
      @update:model-value="toggle($event, disabled)"
    >
      <span
        class="relative rounded-full transition-colors group-focus-visible:ring-2 group-focus-visible:ring-[rgb(var(--accent-rgb)/0.35)] group-focus-visible:ring-offset-1 dark:group-focus-visible:ring-offset-transparent"
        :class="[sizes.track, modelValue ? 'accent-bg' : 'bg-gray-300 dark:bg-white/[0.08]']"
      >
        <span
          class="absolute left-0.5 top-0.5 rounded-full bg-white transition-transform"
          :class="[sizes.thumb, modelValue ? sizes.on : 'translate-x-0']"
        ></span>
      </span>
      <span v-if="label" class="text-xs text-gray-500 transition-colors dark:text-[#8a8f98]">
        {{ label }}
      </span>
      <slot />
    </Switch>
  </div>
</template>
