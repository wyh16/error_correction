<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseUpload from '@/components/base/BaseUpload.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void
const uploadFiles = ref([])
const singleFile = ref([])
const countedFiles = ref([])
const countHint = ref('')

function onCountReject(rejected: Array<{ file: File, reason: string }>) {
  const overflow = rejected.filter(item => item.reason === 'count')
  if (overflow.length) countHint.value = `已达上限，${overflow.length} 个文件未加入。`
}

const maxCountCode = `<BaseUpload v-model="files" :max-count="2" @reject="onReject" />

function onReject(rejected) {
  const overflow = rejected.filter(item => item.reason === 'count')
  if (overflow.length) hint = \`已达上限，\${overflow.length} 个文件未加入。\`
}`
</script>

<template>
  <DemoBlock title="基础用法" description="拖拽或选择文件；accept 限制类型，maxSize 校验大小，超限触发 reject 事件。">
    <BaseUpload
      v-model="uploadFiles"
      label="BaseUpload"
      accept=".pdf,.png,.jpg,.jpeg"
      description="拖拽或选择文件；当前只是通用 UI，不绑定业务上传流程。"
      :max-size="10 * 1024 * 1024"
      @reject="notify('error')"
    />
  </DemoBlock>

  <DemoBlock title="单文件与禁用" description="multiple 设为 false 时只保留一个文件；disabled 禁用交互。">
    <div class="grid gap-4 lg:grid-cols-2">
      <BaseUpload v-model="singleFile" label="单文件模式" :multiple="false" description="只保留最后选择的一个文件。" />
      <BaseUpload label="禁用状态" disabled description="禁用后无法选择或拖拽。" />
    </div>
  </DemoBlock>

  <DemoBlock title="数量上限" description="maxCount 限制文件总数（0 表示不限制），超出部分以 reason 为 count 触发 reject 事件。" :code="maxCountCode">
    <BaseUpload
      v-model="countedFiles"
      label="最多 2 个文件"
      description="一次多选或分多次添加，超过 2 个的部分会被拒绝。"
      :max-count="2"
      @reject="onCountReject"
    />
    <p v-if="countHint" class="mt-2 text-xs text-amber-600 dark:text-amber-400">{{ countHint }}</p>
  </DemoBlock>
</template>
