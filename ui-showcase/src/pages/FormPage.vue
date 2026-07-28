<script setup lang="ts">
import { inject, reactive, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseFieldMessage from '@/components/base/BaseFieldMessage.vue'
import BaseForm from '@/components/base/BaseForm.vue'
import type { FormRule } from '@/components/base/BaseForm.vue'
import BaseFormItem from '@/components/base/BaseFormItem.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void
const inputValue = ref('错题订正')
const loading = ref(false)

const basicCode = `<BaseForm @submit="onSubmit">
  <BaseFormItem label="标题" hint="辅助说明" required>
    <BaseInput v-model="title" placeholder="输入标题" />
  </BaseFormItem>
  <BaseFormItem label="必填项" error="该字段不能为空">
    <BaseInput error />
  </BaseFormItem>
  <BaseButton type="submit">提交表单</BaseButton>
</BaseForm>`

function submitWithLoading() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
    notify('success')
  }, 1200)
}

// ── 基础校验：model + rules + validate() ──────────────────
const rulesFormRef = ref<InstanceType<typeof BaseForm> | null>(null)
const rulesModel = reactive({ title: '', subject: '' })
const rulesConfig: Record<string, FormRule[]> = {
  title: [{ required: true, message: '请输入错题标题' }],
  subject: [{ required: true, message: '请输入所属学科' }],
}

async function submitWithRules() {
  const ok = await rulesFormRef.value?.validate()
  notify(ok ? 'success' : 'error')
}

const rulesCode = `const model = reactive({ title: '', subject: '' })
const rules = {
  title: [{ required: true, message: '请输入错题标题' }],
  subject: [{ required: true, message: '请输入所属学科' }],
}

async function onSubmit() {
  const ok = await formRef.value.validate()
  notify(ok ? 'success' : 'error')
}

<BaseForm ref="formRef" :model="model" :rules="rules" @submit="onSubmit">
  <BaseFormItem label="标题" name="title" v-slot="{ invalid }">
    <BaseInput v-model="model.title" :error="invalid" />
  </BaseFormItem>
  <BaseFormItem label="学科" name="subject" v-slot="{ invalid }">
    <BaseInput v-model="model.subject" :error="invalid" />
  </BaseFormItem>
  <BaseButton type="submit">提交</BaseButton>
</BaseForm>`

// ── 触发方式：blur vs change ──────────────────────────────
const triggerModel = reactive({ onBlur: '', onChange: '' })
const triggerRules: Record<string, FormRule[]> = {
  onBlur: [{ required: true, message: '失去焦点时才校验', trigger: 'blur' }],
  onChange: [{ required: true, message: '值一变化就即时校验', trigger: 'change' }],
}

const triggerCode = `const rules = {
  onBlur: [{ required: true, message: '失去焦点时才校验', trigger: 'blur' }],
  onChange: [{ required: true, message: '值一变化就即时校验', trigger: 'change' }],
}

<BaseForm :model="model" :rules="rules">
  <BaseFormItem label="blur 触发" name="onBlur" v-slot="{ invalid }">
    <BaseInput v-model="model.onBlur" :error="invalid" />
  </BaseFormItem>
  <BaseFormItem label="change 触发" name="onChange" v-slot="{ invalid }">
    <BaseInput v-model="model.onChange" :error="invalid" />
  </BaseFormItem>
</BaseForm>`

// ── 自定义 validator：同步返回 string / 异步 Promise ──────
const validatorModel = reactive({ code: '', username: '' })
const checking = ref(false)
const validatorRules: Record<string, FormRule[]> = {
  code: [
    { required: true, message: '请输入邀请码', trigger: 'blur' },
    {
      trigger: 'blur',
      // 同步 validator：返回 string 即为错误消息，返回 true 表示通过
      validator: value => (/^[A-Z]{2}-\d{4}$/.test(String(value ?? '')) ? true : '格式应为「两位大写字母-4 位数字」，如 AB-1234'),
    },
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      trigger: 'blur',
      // 异步 validator：返回 Promise，resolve string 表示失败原因
      validator: value =>
        new Promise<boolean | string>(resolve => {
          checking.value = true
          window.setTimeout(() => {
            checking.value = false
            resolve(value === 'admin' ? '用户名 admin 已被占用' : true)
          }, 600)
        }),
    },
  ],
}

const validatorCode = `const rules = {
  code: [
    { required: true, message: '请输入邀请码', trigger: 'blur' },
    {
      trigger: 'blur',
      // 同步：返回 string 即错误消息，返回 true 表示通过
      validator: value => (/^[A-Z]{2}-\\d{4}$/.test(String(value ?? '')) ? true : '格式应为 AB-1234'),
    },
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      trigger: 'blur',
      // 异步：返回 Promise，resolve string 表示失败原因
      validator: value =>
        new Promise(resolve => {
          setTimeout(() => resolve(value === 'admin' ? '用户名 admin 已被占用' : true), 600)
        }),
    },
  ],
}`

// ── 单字段校验与重置 ──────────────────────────────────────
const fieldFormRef = ref<InstanceType<typeof BaseForm> | null>(null)
const fieldModel = reactive({ email: '', nickname: '预填昵称' })
const fieldRules: Record<string, FormRule[]> = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { trigger: 'blur', validator: value => (/^\S+@\S+\.\S+$/.test(String(value ?? '')) ? true : '邮箱格式不正确') },
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
}

async function validateEmailOnly() {
  const ok = await fieldFormRef.value?.validateField('email')
  notify(ok ? 'success' : 'error')
}

const fieldCode = `// validateField 只校验指定字段（忽略 trigger，执行该字段全部规则）
const ok = await formRef.value.validateField('email')

// resetFields 将 model 还原为挂载时的初始值并清除全部错误
formRef.value.resetFields()

// clearValidate 只清除错误提示，不改动值；传字段名可只清单个字段
formRef.value.clearValidate()
formRef.value.clearValidate('email')`
</script>

<template>
  <section class="grid gap-2">
    <h3 class="text-base font-bold text-slate-900 dark:text-[#f7f8f8]">组件简介</h3>
    <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
      BaseForm 提供表单布局（vertical / horizontal）、禁用与加载遮罩，并内置精简校验体系：通过
      model + rules 描述数据与规则，BaseFormItem 以 name 关联字段后自动展示错误消息；规则支持
      required、自定义 validator（同步 / 异步）与 blur / change 触发，实例上暴露
      validate、validateField、resetFields、clearValidate 四个方法。
    </p>
  </section>

  <DemoBlock title="垂直布局（默认）" description="BaseForm 处理提交事件与布局间距，BaseFormItem 提供 label / hint / error / required。" :code="basicCode">
    <BaseForm @submit="notify('success')">
      <div class="grid max-w-2xl gap-4 md:grid-cols-2">
        <BaseFormItem label="标题" hint="FormItem 支持 label、hint 和 error。" required>
          <BaseInput v-model="inputValue" placeholder="输入标题" />
        </BaseFormItem>
        <BaseFormItem label="必填项" error="该字段不能为空">
          <BaseInput placeholder="请输入" error />
        </BaseFormItem>
      </div>
      <div class="flex max-w-2xl justify-end">
        <BaseButton size="sm" type="submit">提交表单</BaseButton>
      </div>
    </BaseForm>
  </DemoBlock>

  <DemoBlock title="水平布局" description="layout 设为 horizontal 时 label 在左、控件在右，FormItem 自动继承。">
    <BaseForm layout="horizontal" class="max-w-xl" @submit="notify('success')">
      <BaseFormItem label="项目名称">
        <BaseInput placeholder="输入项目名称" />
      </BaseFormItem>
      <BaseFormItem label="自动同步" hint="开启后每次保存自动同步。">
        <BaseSwitch :model-value="true" />
      </BaseFormItem>
      <div class="flex justify-end">
        <BaseButton size="sm" type="submit">保存</BaseButton>
      </div>
    </BaseForm>
  </DemoBlock>

  <DemoBlock title="基础校验" description="BaseForm 传入 model 与 rules，BaseFormItem 用 name 关联字段；直接点击提交触发 validate()，未通过的字段自动展示错误消息，有 required 规则的字段自动带星号。" :code="rulesCode">
    <BaseForm ref="rulesFormRef" :model="rulesModel" :rules="rulesConfig" class="max-w-xl" @submit="submitWithRules">
      <BaseFormItem label="错题标题" name="title" v-slot="{ invalid }">
        <BaseInput v-model="rulesModel.title" placeholder="留空直接提交试试" :error="invalid" />
      </BaseFormItem>
      <BaseFormItem label="所属学科" name="subject" v-slot="{ invalid }">
        <BaseInput v-model="rulesModel.subject" placeholder="如：数学" :error="invalid" />
      </BaseFormItem>
      <div class="flex justify-end">
        <BaseButton size="sm" type="submit">提交并校验</BaseButton>
      </div>
    </BaseForm>
  </DemoBlock>

  <DemoBlock title="校验触发方式" description="trigger 为 blur 时聚焦后失焦才校验；为 change 时值一变化立刻校验（先输入再清空试试）；未声明 trigger 的规则两种时机都会触发。" :code="triggerCode">
    <BaseForm :model="triggerModel" :rules="triggerRules" class="max-w-xl">
      <BaseFormItem label="blur 触发" name="onBlur" hint="聚焦后不输入，直接点击空白处失焦。" v-slot="{ invalid }">
        <BaseInput v-model="triggerModel.onBlur" placeholder="失焦时才校验" :error="invalid" />
      </BaseFormItem>
      <BaseFormItem label="change 触发" name="onChange" hint="输入一个字符再删除，错误即时出现。" v-slot="{ invalid }">
        <BaseInput v-model="triggerModel.onChange" placeholder="边输入边校验" :error="invalid" />
      </BaseFormItem>
    </BaseForm>
  </DemoBlock>

  <DemoBlock title="自定义 validator" description="validator 返回 true 表示通过，返回 string 作为错误消息；也可以返回 Promise 做异步校验（如请求接口查重）。" :code="validatorCode">
    <BaseForm :model="validatorModel" :rules="validatorRules" class="max-w-xl">
      <BaseFormItem label="邀请码（同步）" name="code" hint="正确格式如 AB-1234，失焦时校验。" v-slot="{ invalid }">
        <BaseInput v-model="validatorModel.code" placeholder="输入 abc 再失焦试试" :error="invalid" />
      </BaseFormItem>
      <BaseFormItem
        label="用户名（异步）"
        name="username"
        :hint="checking ? '校验中，模拟请求约 600ms…' : '输入 admin 再失焦，体验异步占用检查。'"
        v-slot="{ invalid }"
      >
        <BaseInput v-model="validatorModel.username" placeholder="输入 admin 触发占用提示" :error="invalid" />
      </BaseFormItem>
    </BaseForm>
  </DemoBlock>

  <DemoBlock title="单字段校验与重置" description="validateField 只校验指定字段；resetFields 把 model 还原为初始值并清除错误；clearValidate 仅清除错误提示、保留当前输入。" :code="fieldCode">
    <BaseForm ref="fieldFormRef" :model="fieldModel" :rules="fieldRules" class="max-w-xl">
      <BaseFormItem label="邮箱" name="email" v-slot="{ invalid }">
        <BaseInput v-model="fieldModel.email" placeholder="试试留空或输入 abc" :error="invalid" />
      </BaseFormItem>
      <BaseFormItem label="昵称" name="nickname" hint="resetFields 会还原为初始值「预填昵称」。" v-slot="{ invalid }">
        <BaseInput v-model="fieldModel.nickname" placeholder="请输入昵称" :error="invalid" />
      </BaseFormItem>
      <div class="flex flex-wrap justify-end gap-2">
        <BaseButton size="sm" variant="secondary" @click="fieldFormRef?.clearValidate()">清除校验</BaseButton>
        <BaseButton size="sm" variant="secondary" @click="fieldFormRef?.resetFields()">重置表单</BaseButton>
        <BaseButton size="sm" @click="validateEmailOnly">只校验邮箱</BaseButton>
      </div>
    </BaseForm>
  </DemoBlock>

  <DemoBlock title="加载与禁用" description="loading 或 disabled 时整个表单的控件都会被禁用。">
    <BaseForm :loading="loading" class="max-w-xl" @submit="submitWithLoading">
      <BaseFormItem label="标题">
        <BaseInput v-model="inputValue" placeholder="提交后短暂禁用" />
      </BaseFormItem>
      <div class="flex justify-end">
        <BaseButton size="sm" type="submit" :disabled="loading">{{ loading ? '提交中…' : '带加载提交' }}</BaseButton>
      </div>
    </BaseForm>
  </DemoBlock>

  <DemoBlock title="字段信息" description="BaseFieldMessage 支持 hint / error / success / warning 四种类型。">
    <div class="grid gap-1">
      <BaseFieldMessage type="hint" message="这是提示信息样式" />
      <BaseFieldMessage type="error" message="这是错误信息样式" />
      <BaseFieldMessage type="success" message="这是成功信息样式" />
      <BaseFieldMessage type="warning" message="这是警告信息样式" />
    </div>
  </DemoBlock>
</template>
