<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDropdown from '@/components/base/BaseDropdown.vue'
import BaseMenu from '@/components/base/BaseMenu.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void
const menuValue = ref('dashboard')
const dropdownOpen = ref(false)

const menuItems = [
  { value: 'dashboard', label: '学习看板', icon: 'fa-chart-pie' },
  { value: 'error-bank', label: '错题库', icon: 'fa-book', badge: 12 },
  { value: 'notes', label: '笔记', icon: 'fa-pen-nib' },
  { value: 'archived', label: '已归档', icon: 'fa-box-archive', disabled: true },
]

const menuCode = `<BaseMenu
  v-model="active"
  :items="[
    { value: 'dashboard', label: '学习看板', icon: 'fa-chart-pie' },
    { value: 'error-bank', label: '错题库', icon: 'fa-book', badge: 12 },
    { value: 'archived', label: '已归档', disabled: true },
  ]"
/>`
</script>

<template>
  <DemoBlock title="导航菜单" description="items 支持 icon / badge / disabled，选中项高亮。" :code="menuCode">
    <div class="max-w-xs">
      <BaseMenu v-model="menuValue" :items="menuItems" />
    </div>
  </DemoBlock>

  <DemoBlock title="下拉菜单" description="BaseDropdown 通过 trigger 插槽放触发器，position / align / width 控制弹出位置。">
    <BaseDropdown v-model="dropdownOpen" align="left" width="w-52">
      <template #trigger>
        <BaseButton size="sm" variant="secondary" @click="dropdownOpen = !dropdownOpen">
          更多操作 <i class="fa-solid fa-chevron-down ml-1 text-[10px]"></i>
        </BaseButton>
      </template>
      <div class="grid gap-0.5 p-1.5">
        <button
          v-for="action in ['重命名', '移动到分组', '导出为 PDF']"
          :key="action"
          type="button"
          class="rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-[#d0d6e0] dark:hover:bg-white/[0.06]"
          @click="dropdownOpen = false; notify('info')"
        >
          {{ action }}
        </button>
      </div>
    </BaseDropdown>
  </DemoBlock>
</template>
