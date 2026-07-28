<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseAvatar from '@/components/base/BaseAvatar.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCheckbox from '@/components/base/BaseCheckbox.vue'
import BaseDivider from '@/components/base/BaseDivider.vue'
import BaseForm from '@/components/base/BaseForm.vue'
import BaseFormItem from '@/components/base/BaseFormItem.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseListGroup from '@/components/base/BaseListGroup.vue'
import BaseListItem from '@/components/base/BaseListItem.vue'
import BasePanel from '@/components/base/BasePanel.vue'
import BasePanelTitle from '@/components/base/BasePanelTitle.vue'
import BaseProgress from '@/components/base/BaseProgress.vue'
import BaseSearchInput from '@/components/base/BaseSearchInput.vue'
import BaseSegmented from '@/components/base/BaseSegmented.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseStat from '@/components/base/BaseStat.vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import BaseTag from '@/components/base/BaseTag.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

// 登录表单
const email = ref('')
const password = ref('')
const remember = ref(true)

// 数据看板
const rangeValue = ref('week')
const rangeOptions = [
  { value: 'day', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
]
const boardColumns = [
  { key: 'topic', label: '知识点' },
  { key: 'total', label: '错题数', align: 'right' },
  { key: 'mastery', label: '掌握度' },
]
const boardRows = [
  { id: 1, topic: '导数与单调性', total: 14, mastery: 82 },
  { id: 2, topic: '立体几何证明', total: 9, mastery: 64 },
  { id: 3, topic: '完形填空', total: 7, mastery: 91 },
]

// 列表工具栏
const listSearch = ref('')
const subjectFilter = ref('')
const autoSync = ref(true)
</script>

<template>
  <DemoBlock title="登录表单" description="BaseForm + BaseInput + BaseCheckbox + BaseDivider 组合成完整的认证表单。">
    <div class="mx-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
      <div class="mb-5 grid gap-1 text-center">
        <p class="text-lg font-bold text-slate-900 dark:text-[#f7f8f8]">欢迎回来</p>
        <p class="text-xs text-slate-500 dark:text-[#8a8f98]">登录以同步你的错题本</p>
      </div>
      <BaseForm @submit="notify('success')">
        <BaseFormItem label="邮箱">
          <BaseInput v-model="email" type="email" placeholder="you@example.com" autocomplete="email" />
        </BaseFormItem>
        <BaseFormItem label="密码">
          <BaseInput v-model="password" type="password" placeholder="至少 8 位" autocomplete="current-password" />
        </BaseFormItem>
        <div class="flex items-center justify-between">
          <BaseCheckbox v-model="remember" label="记住我" />
          <button type="button" class="text-xs font-semibold accent-text" @click="notify('info')">忘记密码？</button>
        </div>
        <BaseButton type="submit" class="w-full justify-center">登 录</BaseButton>
        <BaseDivider label="或" />
        <BaseButton variant="glass" icon="fa-user-plus" block @click="notify('info')">注册新账号</BaseButton>
      </BaseForm>
    </div>
  </DemoBlock>

  <DemoBlock title="数据看板" description="BaseStat + BaseSegmented + BaseProgress + BaseTable 组合的仪表盘区块。">
    <div class="grid gap-4">
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm font-bold text-slate-900 dark:text-[#f7f8f8]">学习概览</p>
        <BaseSegmented v-model="rangeValue" :options="rangeOptions" />
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <BaseStat label="新增错题" :value="30" icon="fa-plus" tone="accent" />
        <BaseStat label="已复习" :value="22" icon="fa-book-open" tone="emerald" />
        <BaseStat label="平均掌握度" :value="79" suffix="%" icon="fa-chart-line" tone="blue" />
      </div>
      <BaseTable :columns="boardColumns" :rows="boardRows" compact>
        <template #cell-mastery="{ value }">
          <div class="flex items-center gap-2">
            <div class="w-24"><BaseProgress :value="value" size="sm" :tone="value >= 80 ? 'emerald' : value >= 70 ? 'accent' : 'amber'" /></div>
            <span class="text-xs text-slate-500 dark:text-[#8a8f98]">{{ value }}%</span>
          </div>
        </template>
      </BaseTable>
    </div>
  </DemoBlock>

  <DemoBlock title="列表工具栏" description="BasePanel + BaseSearchInput + BaseSelect 组合的列表页头部与内容。">
    <BasePanel class="h-80" header-class="flex items-center gap-3 px-4 py-3">
      <template #header>
        <BasePanelTitle icon="fa-book">错题列表</BasePanelTitle>
        <div class="ml-auto flex items-center gap-2">
          <BaseSearchInput v-model="listSearch" placeholder="搜索题目" />
          <BaseSelect v-model="subjectFilter" :options="['数学', '物理', '英语']" placeholder="全部学科" width-class="w-32" />
        </div>
      </template>
      <div class="grid gap-2">
        <BaseListItem
          v-for="item in [
            { id: 1, title: '已知函数 f(x) 在区间上的单调性…', subject: '数学', tone: 'accent' },
            { id: 2, title: '如图，在正方体中求二面角…', subject: '数学', tone: 'accent' },
            { id: 3, title: 'Cloze: The scientist ___ the results…', subject: '英语', tone: 'blue' },
          ]"
          :key="item.id"
          :label="item.title"
          description="点击查看详情"
          interactive
          show-arrow
          card
          @click="notify('info')"
        >
          <BaseTag size="xs" :tone="item.tone">{{ item.subject }}</BaseTag>
        </BaseListItem>
      </div>
    </BasePanel>
  </DemoBlock>

  <DemoBlock title="设置分组" description="BaseListGroup + BaseListItem + BaseSwitch + BaseAvatar 组合的设置页片段。">
    <div class="max-w-xl">
      <BaseListGroup title="账号">
        <BaseListItem label="登录账号" description="用于同步与找回">
          <div class="flex items-center gap-2">
            <BaseAvatar name="小哲" size="sm" />
            <span class="text-sm text-slate-600 dark:text-[#a8adb7]">xiaozhe@example.com</span>
          </div>
        </BaseListItem>
        <BaseListItem label="自动同步" description="保存时自动同步到云端">
          <BaseSwitch v-model="autoSync" />
        </BaseListItem>
        <BaseListItem label="导出数据" description="导出全部错题为 PDF" interactive show-arrow @click="notify('info')" />
      </BaseListGroup>
    </div>
  </DemoBlock>
</template>
