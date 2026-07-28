<script setup lang="ts">
import { inject, ref } from 'vue'
import BasePinInput from '@/components/base/BasePinInput.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void

const basicCode = `<BasePinInput v-model="code" @complete="onComplete" />`

const maskedCode = `<BasePinInput v-model="password" masked @complete="onComplete" />`

const letterCode = `<BasePinInput v-model="inviteCode" type="text" :length="4" />`

const code = ref('')
const password = ref('')
const inviteCode = ref('')
const errorCode = ref('1234')

function onComplete() {
  notify('success')
}
</script>

<template>
  <DemoBlock
    title="基础用法"
    description="默认 6 位数字验证码：输入自动跳格，Backspace 回删，方向键移动焦点，支持整段粘贴；填满时触发 complete 事件。"
    :code="basicCode"
  >
    <div class="grid gap-3">
      <BasePinInput v-model="code" @complete="onComplete" />
      <p class="text-xs text-slate-500 dark:text-[#8a8f98]">当前值：{{ code || '（空）' }}</p>
    </div>
  </DemoBlock>

  <DemoBlock
    title="掩码显示"
    description="masked 用密码样式隐藏每格字符，适合支付密码、安全码等敏感输入。"
    :code="maskedCode"
  >
    <BasePinInput v-model="password" masked @complete="onComplete" />
  </DemoBlock>

  <DemoBlock
    title="字母模式与自定义长度"
    description="type 设为 text 后接受任意字符，配合 length 可用于邀请码等场景。"
    :code="letterCode"
  >
    <BasePinInput v-model="inviteCode" type="text" :length="4" />
  </DemoBlock>

  <DemoBlock title="错误与禁用" description="error 用玫红边框提示校验失败；disabled 降低透明度并禁止输入。">
    <div class="grid gap-4">
      <div class="flex items-center gap-3">
        <span class="w-12 text-sm text-slate-500 dark:text-[#8a8f98]">错误</span>
        <BasePinInput v-model="errorCode" error />
      </div>
      <div class="flex items-center gap-3">
        <span class="w-12 text-sm text-slate-500 dark:text-[#8a8f98]">禁用</span>
        <BasePinInput model-value="88" disabled />
      </div>
    </div>
  </DemoBlock>
</template>
