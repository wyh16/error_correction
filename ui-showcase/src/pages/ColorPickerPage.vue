<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseColorPicker from '@/components/base/BaseColorPicker.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const basicColor = ref('#8173df')
const brandColor = ref('#10b981')
const eventColor = ref('')
const lastChange = ref('（尚未确认）')

// 主题色候选：只给品牌相关的少量预设
const brandPresets = ['#8173df', '#5e6ad2', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

function handleChange(hex: string) {
  lastChange.value = hex
  notify('success')
}

const basicCode = `<BaseColorPicker v-model="color" />
<p>当前颜色：{{ color }}</p>`

const presetCode = `<BaseColorPicker
  v-model="brandColor"
  :presets="['#8173df', '#5e6ad2', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']"
/>`

const eventCode = `<BaseColorPicker v-model="color" @change="hex => save(hex)" />`
</script>

<template>
  <DemoBlock title="基础用法" description="拖动面板与色相条实时更新 v-model；hex 输入框在回车或失焦时校验六位 hex，非法输入会回退为当前值。" :code="basicCode">
    <div class="flex flex-wrap items-center gap-4">
      <div class="w-44">
        <BaseColorPicker v-model="basicColor" />
      </div>
      <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-[#8a8f98]">
        <span class="h-6 w-6 rounded-md border border-black/10 dark:border-white/20" :style="{ backgroundColor: basicColor || 'transparent' }"></span>
        当前颜色：{{ basicColor || '（空）' }}
      </div>
    </div>
  </DemoBlock>

  <DemoBlock title="预设色板" description="presets 自定义弹层底部的快捷色块，点击直接选中；与当前值相同的色块会以 accent 描边高亮。" :code="presetCode">
    <div class="w-44">
      <BaseColorPicker v-model="brandColor" :presets="brandPresets" />
    </div>
  </DemoBlock>

  <DemoBlock title="change 事件" description="拖动过程只更新 update:modelValue；松开手柄、点击预设或 hex 输入确认时才触发 change，适合做保存类副作用。" :code="eventCode">
    <div class="w-44">
      <BaseColorPicker v-model="eventColor" @change="handleChange" />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">最近一次 change：{{ lastChange }}</p>
  </DemoBlock>

  <DemoBlock title="禁用与空值" description="disabled 时无法打开弹层；modelValue 为空字符串时色块显示斜线占位并展示「选择颜色」提示。">
    <div class="flex flex-wrap gap-4">
      <div class="w-44">
        <BaseColorPicker model-value="#f59e0b" disabled />
      </div>
      <div class="w-44">
        <BaseColorPicker model-value="" disabled />
      </div>
    </div>
  </DemoBlock>
</template>
