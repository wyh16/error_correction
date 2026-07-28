<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseCheckboxGroup from '@/components/base/BaseCheckboxGroup.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const basicCode = `<BaseCheckboxGroup
  v-model="subjects"
  label="错题涉及学科"
  :options="subjectOptions"
/>`

const maxCode = `<BaseCheckboxGroup
  v-model="focus"
  direction="horizontal"
  :max="2"
  :options="tagOptions"
  @change="onFocusChange"
/>`

const minCode = `<BaseCheckboxGroup v-model="channels" :min="1" :options="channelOptions" />`

const subjectOptions = [
  { label: '数学', value: 'math', description: '代数、几何与函数' },
  { label: '物理', value: 'physics', description: '力学与电磁学' },
  { label: '化学', value: 'chemistry', description: '方程式与实验题' },
  { label: '英语', value: 'english', description: '完形填空与作文', disabled: true },
]

const tagOptions = [
  { label: '计算失误', value: 'calc' },
  { label: '概念不清', value: 'concept' },
  { label: '审题偏差', value: 'reading' },
  { label: '时间不够', value: 'time' },
]

const channelOptions = [
  { label: '站内通知', value: 'inbox' },
  { label: '邮件提醒', value: 'email' },
  { label: '每周报告', value: 'weekly' },
]

const subjects = ref(['math'])
const focus = ref(['calc'])
const channels = ref(['inbox'])
const disabledGroup = ref(['math', 'physics'])

function onFocusChange(value: string[]) {
  // 达到 max 上限时提示用户其余选项已被锁定
  if (value.length >= 2) notify('info')
}
</script>

<template>
  <DemoBlock
    title="基础用法"
    description="v-model 绑定选中值数组，options 支持 description 副文案与单项 disabled；选中值始终按 options 声明顺序排列。"
    :code="basicCode"
  >
    <div class="grid gap-3">
      <BaseCheckboxGroup v-model="subjects" label="错题涉及学科" :options="subjectOptions" />
      <p class="text-xs text-slate-500 dark:text-[#8a8f98]">已选：{{ subjects.length ? subjects.join('、') : '（空）' }}</p>
    </div>
  </DemoBlock>

  <DemoBlock
    title="横向排列与 max 上限"
    description="direction 设为 horizontal 横向换行排列；max=2 时选满两项后其余选项自动禁用，取消勾选即可解锁。"
    :code="maxCode"
  >
    <BaseCheckboxGroup
      v-model="focus"
      label="最多选择 2 个薄弱点"
      direction="horizontal"
      :max="2"
      :options="tagOptions"
      @change="onFocusChange"
    />
  </DemoBlock>

  <DemoBlock
    title="min 保底"
    description="min=1 时仅剩一项勾选的那一项会被禁用，保证至少保留一个通知渠道。"
    :code="minCode"
  >
    <BaseCheckboxGroup v-model="channels" label="通知渠道" :min="1" :options="channelOptions" />
  </DemoBlock>

  <DemoBlock title="整组禁用" description="disabled 禁用全部选项，仅作只读展示。">
    <BaseCheckboxGroup v-model="disabledGroup" label="已归档的筛选条件" disabled :options="subjectOptions" />
  </DemoBlock>
</template>
