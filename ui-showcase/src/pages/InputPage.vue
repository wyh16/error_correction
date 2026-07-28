<script setup lang="ts">
import { ref } from 'vue'
import BaseFieldMessage from '@/components/base/BaseFieldMessage.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSearchInput from '@/components/base/BaseSearchInput.vue'
import BaseTag from '@/components/base/BaseTag.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import DemoBlock from '~/components/DemoBlock.vue'
import DocTip from '~/components/DocTip.vue'

const inputValue = ref('错题订正')
const password = ref('123456')
const search = ref('')
const textareaValue = ref('Keep the explanation concise and cite the key formula.')
const clearableValue = ref('悬停右侧出现清空按钮')
const iconValue = ref('')

const basicCode = `<BaseInput v-model="title" label="普通输入" placeholder="输入标题" />
<BaseInput v-model="password" label="密码输入" type="password" />
<BaseInput label="数字类型" type="number" />`

const decorateCode = `<BaseInput v-model="keyword" clearable placeholder="可清空" />
<BaseInput v-model="user" prefix-icon="fa-user" placeholder="前置图标" />
<BaseInput suffix-icon="fa-envelope" placeholder="后置图标" />
<BaseInput size="sm" placeholder="小尺寸 sm" />
<BaseInput disabled model-value="禁用状态" />`

const autosizeValue = ref('输入更多内容试试，\n高度会随内容自动增长。')
const autosizeCode = `<BaseTextarea v-model="content" autosize :rows="2" label="自动高度" />`

const edgeCode = `<!-- error 与 disabled 可叠加：警示边框保留，同时呈现灰底禁用态 -->
<BaseInput label="错误 + 禁用" error disabled model-value="历史校验失败的字段" />
<BaseInput label="错误 + 只读" error readonly model-value="只读但保留警示边框" />
<BaseInput label="仅错误" error placeholder="对照组：可编辑的错误态" />`
</script>

<template>
  <DocTip title="错误提示的正确姿势">
    <p>error 只是布尔开关，负责切换警示边框；具体文案交给 BaseFieldMessage 放在输入框下方，两者组合即可完成表单校验反馈。另外 clearable 的清空按钮在 disabled 时会自动隐藏，无需手动处理。</p>
  </DocTip>

  <DemoBlock title="基础用法" description="支持 label、placeholder 与 v-model 双向绑定。" :code="basicCode">
    <div class="grid max-w-md gap-4">
      <BaseInput v-model="inputValue" label="普通输入" placeholder="输入标题" />
      <BaseInput v-model="password" label="密码输入" type="password" />
      <BaseInput label="数字类型" type="number" placeholder="type 透传给原生 input" />
    </div>
  </DemoBlock>

  <DemoBlock title="状态" description="error 为布尔值，开启后显示警示边框；配合 BaseFieldMessage 显示提示文案。">
    <div class="grid max-w-md gap-4">
      <div>
        <BaseInput label="错误状态" placeholder="需要填写内容" error />
        <BaseFieldMessage type="error" message="该字段不能为空" />
      </div>
      <div>
        <BaseInput label="带提示" placeholder="任意输入" :maxlength="20" />
        <BaseFieldMessage message="最多 20 个字符。" />
      </div>
      <BaseInput label="必填标记" placeholder="required 透传给原生 input" required />
    </div>
  </DemoBlock>

  <DemoBlock title="图标、清空与禁用" description="prefixIcon / suffixIcon 渲染两侧图标，clearable 悬停显示一键清空，disabled 禁用输入，size 支持 sm / md。" :code="decorateCode">
    <div class="grid max-w-md gap-4">
      <BaseInput v-model="clearableValue" label="可清空" clearable placeholder="输入内容后悬停查看" />
      <BaseInput v-model="iconValue" label="前置图标" prefix-icon="fa-user" placeholder="输入用户名" />
      <BaseInput label="后置图标" suffix-icon="fa-envelope" placeholder="输入邮箱" />
      <BaseInput label="小尺寸" size="sm" prefix-icon="fa-magnifying-glass" clearable placeholder="sm 尺寸同样支持图标和清空" />
      <BaseInput label="禁用状态" disabled model-value="不可编辑的内容" />
    </div>
  </DemoBlock>

  <DemoBlock
    title="边界情况：错误与禁用组合"
    description="error 与 disabled / readonly 可叠加：警示边框保留，同时呈现灰底不可编辑态，适合展示历史校验失败但当前不可修改的字段。"
    :code="edgeCode"
  >
    <div class="grid max-w-md gap-4">
      <BaseInput label="错误 + 禁用" error disabled model-value="历史校验失败的字段" />
      <BaseInput label="错误 + 只读" error readonly model-value="只读但保留警示边框" />
      <BaseInput label="仅错误" error placeholder="对照组：可编辑的错误态" />
    </div>
  </DemoBlock>

  <DemoBlock title="后置插槽" description="append 插槽在输入框右侧放置任意内容。">
    <div class="max-w-md">
      <BaseInput v-model="inputValue" label="带后缀" placeholder="输入内容">
        <template #append>
          <BaseTag size="xs" tone="accent">后缀</BaseTag>
        </template>
      </BaseInput>
    </div>
  </DemoBlock>

  <DemoBlock title="搜索输入" description="BaseSearchInput 内置搜索图标和清空按钮，icon 可自定义。">
    <div class="grid max-w-md gap-4">
      <BaseSearchInput v-model="search" placeholder="搜索组件" />
      <BaseSearchInput v-model="search" label="带标签" icon="fa-solid fa-filter" placeholder="自定义图标" />
    </div>
  </DemoBlock>

  <DemoBlock title="多行文本" description="BaseTextarea 支持 rows、maxlength 字数统计、resize 与禁用。">
    <div class="grid max-w-md gap-4">
      <BaseTextarea v-model="textareaValue" label="字数统计" :maxlength="120" resize="none" />
      <BaseTextarea label="两行高度" :rows="2" placeholder="rows 控制默认高度" />
      <BaseTextarea label="错误状态" error="内容不合法" model-value="——" :rows="2" />
      <BaseTextarea label="禁用" model-value="不可编辑" disabled :rows="2" />
    </div>
  </DemoBlock>

  <DemoBlock title="自动高度" description="autosize 开启后高度随内容自动增长，rows 作为最小高度，同时禁用手动拖拽调整。" :code="autosizeCode">
    <div class="max-w-md">
      <BaseTextarea v-model="autosizeValue" label="自动高度" autosize :rows="2" placeholder="输入多行内容，高度自动增长" />
    </div>
  </DemoBlock>
</template>
