<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseFloatButton from '@/components/base/BaseFloatButton.vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

// FAB 通过 Teleport 真正悬浮在视口右下角，demo 用开关控制挂载/卸载
const showBasic = ref(false)
const showMenu = ref(false)
const showCustom = ref(false)

const menuItems = [
  { icon: 'fa-pen', label: '记一道错题', value: 'note' },
  { icon: 'fa-camera', label: '拍照录题', value: 'photo' },
  { icon: 'fa-file-import', label: '导入文档', value: 'import' },
]

const basicCode = `<BaseFloatButton
  tooltip="快速录入错题"
  :badge="5"
  @click="handleClick"
/>`

const menuCode = `const menuItems = [
  { icon: 'fa-pen', label: '记一道错题', value: 'note' },
  { icon: 'fa-camera', label: '拍照录题', value: 'photo' },
  { icon: 'fa-file-import', label: '导入文档', value: 'import' },
]

<BaseFloatButton
  :menu="menuItems"
  :position="{ right: 24, bottom: 96 }"
  @select="handleSelect"
/>`

const customCode = `<!-- tone 支持 accent / emerald / amber / rose / blue；position 自定义视口偏移 -->
<BaseFloatButton
  icon="fa-headset"
  tone="emerald"
  tooltip="联系答疑老师"
  :position="{ right: 24, bottom: 168 }"
  @click="handleClick"
/>`
</script>

<template>
  <DemoBlock title="基础用法" description="打开开关后，视口右下角出现悬浮按钮（Teleport 到 body，不受局部布局影响）；tooltip 在悬停时于左侧显示气泡，badge 在右上角显示数字徽标（超过 99 显示 99+）。" :code="basicCode">
    <div class="flex items-center gap-4">
      <BaseSwitch v-model="showBasic" label="挂载基础悬浮按钮" />
      <span class="text-xs text-slate-400 dark:text-[#62666d]">打开后看视口右下角，点击按钮触发通知</span>
    </div>
    <BaseFloatButton v-if="showBasic" tooltip="快速录入错题" :badge="5" @click="notify('info')" />
  </DemoBlock>

  <DemoBlock title="展开子菜单" description="menu 非空时点击主按钮切换展开：子按钮从下方渐入、主图标旋转 45° 变为关闭叉；悬停子按钮显示 label 气泡，点击触发 select 并收起，点击组件外也会收起。" :code="menuCode">
    <div class="flex items-center gap-4">
      <BaseSwitch v-model="showMenu" label="挂载带菜单的悬浮按钮" />
      <span class="text-xs text-slate-400 dark:text-[#62666d]">位于右下角略高处（bottom 96），点开菜单选一项试试</span>
    </div>
    <BaseFloatButton
      v-if="showMenu"
      :menu="menuItems"
      :badge="120"
      :position="{ right: 24, bottom: 96 }"
      @select="notify('success')"
    />
  </DemoBlock>

  <DemoBlock title="配色与位置" description="tone 支持 accent（默认，跟随主题色）/ emerald / amber / rose / blue 五种实心底色；position 传 { right, bottom } 自定义距视口的偏移，多个悬浮按钮可错开摆放。" :code="customCode">
    <div class="flex items-center gap-4">
      <BaseSwitch v-model="showCustom" label="挂载 emerald 配色按钮" />
      <span class="text-xs text-slate-400 dark:text-[#62666d]">位于右下角更高处（bottom 168）</span>
    </div>
    <BaseFloatButton
      v-if="showCustom"
      icon="fa-headset"
      tone="emerald"
      tooltip="联系答疑老师"
      :position="{ right: 24, bottom: 168 }"
      @click="notify('success')"
    />
  </DemoBlock>
</template>
