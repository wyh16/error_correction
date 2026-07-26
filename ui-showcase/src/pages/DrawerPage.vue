<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import BaseForm from '@/components/base/BaseForm.vue'
import BaseFormItem from '@/components/base/BaseFormItem.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void
const drawerOpen = ref(false)
const leftOpen = ref(false)
const bottomOpen = ref(false)
const inputValue = ref('错题订正')
const textareaValue = ref('说明文本')

const basicCode = `<BaseButton @click="open = true">打开 Drawer</BaseButton>

<BaseDrawer :open="open" title="标题" description="辅助说明" @close="open = false">
  抽屉内容
  <template #footer>底部操作区</template>
</BaseDrawer>`

const persistentOpen = ref(false)
const persistentCode = `<BaseDrawer :open="open" title="不可轻易关闭" persistent :show-close="false" @close="open = false">
  只能通过底部按钮关闭。
  <template #footer>
    <BaseButton size="sm" @click="open = false">我知道了</BaseButton>
  </template>
</BaseDrawer>`
</script>

<template>
  <DemoBlock title="基础用法（右侧）" description="侧边抽屉，适合详情、表单、筛选条件等浮层场景。" :code="basicCode">
    <BaseButton size="sm" @click="drawerOpen = true">打开 Drawer</BaseButton>

    <BaseDrawer
      :open="drawerOpen"
      title="BaseDrawer"
      description="适合详情、表单、筛选条件等侧边浮层。"
      @close="drawerOpen = false"
    >
      <div class="space-y-4">
        <BaseAlert tone="info" title="抽屉内容" description="这里可以放任意表单、列表或操作区。" />
        <BaseForm @submit="notify('success'); drawerOpen = false">
          <BaseFormItem label="标题">
            <BaseInput v-model="inputValue" placeholder="输入标题" />
          </BaseFormItem>
          <BaseFormItem label="说明">
            <BaseTextarea v-model="textareaValue" resize="none" />
          </BaseFormItem>
          <div class="flex justify-end gap-2">
            <BaseButton type="button" variant="secondary" size="sm" @click="drawerOpen = false">取消</BaseButton>
            <BaseButton type="submit" size="sm">保存</BaseButton>
          </div>
        </BaseForm>
      </div>
    </BaseDrawer>
  </DemoBlock>

  <DemoBlock title="方向与宽度" description="placement 支持 right / left / bottom，widthClass 控制面板宽度。">
    <div class="flex flex-wrap gap-2">
      <BaseButton size="sm" variant="secondary" @click="leftOpen = true">左侧抽屉</BaseButton>
      <BaseButton size="sm" variant="secondary" @click="bottomOpen = true">底部抽屉</BaseButton>
    </div>

    <BaseDrawer :open="leftOpen" title="左侧抽屉" placement="left" width-class="w-full max-w-sm" @close="leftOpen = false">
      <p class="text-sm text-slate-500 dark:text-[#8a8f98]">placement="left"，宽度 max-w-sm。</p>
    </BaseDrawer>
    <BaseDrawer :open="bottomOpen" title="底部抽屉" placement="bottom" @close="bottomOpen = false">
      <p class="text-sm text-slate-500 dark:text-[#8a8f98]">placement="bottom"，从底部滑出，最大高度 85vh。</p>
    </BaseDrawer>
  </DemoBlock>

  <DemoBlock title="强制交互" description="persistent 开启后点击遮罩不会关闭，show-close 设为 false 隐藏右上角关闭按钮，适合必须完成操作的场景。" :code="persistentCode">
    <BaseButton size="sm" variant="secondary" @click="persistentOpen = true">打开 persistent 抽屉</BaseButton>

    <BaseDrawer
      :open="persistentOpen"
      title="不可轻易关闭"
      description="点击遮罩不会关闭，右上角关闭按钮已隐藏。"
      persistent
      :show-close="false"
      @close="persistentOpen = false"
    >
      <p class="text-sm text-slate-500 dark:text-[#8a8f98]">只能通过底部按钮关闭这个抽屉。</p>
      <template #footer>
        <div class="flex justify-end">
          <BaseButton size="sm" @click="persistentOpen = false">我知道了</BaseButton>
        </div>
      </template>
    </BaseDrawer>
  </DemoBlock>
</template>
