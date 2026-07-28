<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import DemoBlock from '~/components/DemoBlock.vue'
import DocTip from '~/components/DocTip.vue'

const modalOpen = ref(false)
const wideOpen = ref(false)
const dangerOpen = ref(false)
const persistentOpen = ref(false)
const maskLockedOpen = ref(false)
const escLockedOpen = ref(false)

const compareCode = `<!-- persistent = maskClosable:false + closeOnEsc:false 的合并开关 -->
<!-- 单项开关优先于 persistent，可以只锁遮罩、保留 ESC -->
<BaseModal :open="a" title="锁遮罩，ESC 可关" :mask-closable="false" @close="a = false" />
<BaseModal :open="b" title="锁 ESC，点遮罩可关" :close-on-esc="false" @close="b = false" />`

const persistentCode = `<!-- persistent 时点击遮罩不关闭，只轻微晃动提示 -->
<BaseModal :open="open" title="必须显式操作" persistent :show-close="false" @close="open = false">
  <p>点击遮罩不会关闭，请使用底部按钮。</p>
  <template #footer>
    <BaseButton @click="open = false">我知道了</BaseButton>
  </template>
</BaseModal>`

const basicCode = `<BaseButton @click="open = true">打开 Modal</BaseButton>

<BaseModal :open="open" title="组件弹窗" icon="fa-cube" @close="open = false">
  <p>弹窗内容</p>
  <template #footer>
    <BaseButton variant="secondary" @click="open = false">取消</BaseButton>
    <BaseButton @click="open = false">确认</BaseButton>
  </template>
</BaseModal>`
</script>

<template>
  <DocTip title="嵌套弹层的层级与 ESC">
    <p>Modal / Drawer 的 z-index 由 useOverlay 动态分配：嵌套打开时后开的自动压在上层，无需手动指定层级；按 ESC 只会关闭最顶层的弹层，逐层退出。表单类弹窗建议开启 persistent，防止误触遮罩丢失已填内容。</p>
  </DocTip>

  <DemoBlock title="基础用法" description="居中弹窗，支持标题图标、footer 插槽和焦点管理。" :code="basicCode">
    <BaseButton size="sm" @click="modalOpen = true">打开 Modal</BaseButton>

    <BaseModal
      :open="modalOpen"
      title="组件弹窗"
      icon="fa-cube"
      icon-bg="accent-bg-soft"
      icon-class="accent-text"
      max-width="max-w-lg"
      @close="modalOpen = false"
    >
      <p class="text-sm leading-6 text-slate-600 dark:text-[#a8adb7]">
        这是 BaseModal 的预览状态，支持标题图标、footer 插槽和焦点管理。
      </p>
      <template #footer>
        <BaseButton variant="secondary" size="sm" @click="modalOpen = false">取消</BaseButton>
        <BaseButton size="sm" @click="modalOpen = false">确认</BaseButton>
      </template>
    </BaseModal>
  </DemoBlock>

  <DemoBlock title="宽度与内容表单" description="maxWidth 接受 Tailwind 类控制弹窗宽度，主体可放任意表单。">
    <BaseButton size="sm" variant="secondary" @click="wideOpen = true">打开宽弹窗</BaseButton>

    <BaseModal :open="wideOpen" title="宽弹窗 max-w-2xl" max-width="max-w-2xl" @close="wideOpen = false">
      <div class="grid gap-4 sm:grid-cols-2">
        <BaseInput label="标题" placeholder="输入标题" />
        <BaseInput label="标签" placeholder="输入标签" />
      </div>
      <template #footer>
        <BaseButton variant="secondary" size="sm" @click="wideOpen = false">关闭</BaseButton>
      </template>
    </BaseModal>
  </DemoBlock>

  <DemoBlock title="持久弹窗" description="persistent 时点击遮罩不关闭而是轻微晃动提示；showClose 为 false 时隐藏右上角关闭按钮，强制用户走底部操作。" :code="persistentCode">
    <BaseButton size="sm" variant="secondary" @click="persistentOpen = true">打开持久弹窗</BaseButton>

    <BaseModal
      :open="persistentOpen"
      title="必须显式操作"
      icon="fa-lock"
      persistent
      :show-close="false"
      @close="persistentOpen = false"
    >
      <p class="text-sm leading-6 text-slate-600 dark:text-[#a8adb7]">
        点击遮罩或按 Esc 都不会关闭这个弹窗，只会轻微晃动提示。请使用底部按钮关闭。
      </p>
      <template #footer>
        <BaseButton size="sm" @click="persistentOpen = false">我知道了</BaseButton>
      </template>
    </BaseModal>
  </DemoBlock>

  <DemoBlock
    title="边界情况：persistent 与单项开关对比"
    description="persistent 是 maskClosable:false + closeOnEsc:false 的合并开关；显式传入的单项开关优先级更高，可以只锁遮罩保留 ESC，或反过来。"
    :code="compareCode"
  >
    <div class="flex flex-wrap gap-2">
      <BaseButton size="sm" variant="secondary" @click="maskLockedOpen = true">锁遮罩，ESC 可关</BaseButton>
      <BaseButton size="sm" variant="secondary" @click="escLockedOpen = true">锁 ESC，点遮罩可关</BaseButton>
    </div>

    <BaseModal
      :open="maskLockedOpen"
      title="maskClosable: false"
      icon="fa-hand"
      :mask-closable="false"
      @close="maskLockedOpen = false"
    >
      <p class="text-sm leading-6 text-slate-600 dark:text-[#a8adb7]">
        点击遮罩只会晃动提示，但按 Esc 或右上角关闭按钮仍然可以关闭。
      </p>
      <template #footer>
        <BaseButton size="sm" @click="maskLockedOpen = false">关闭</BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      :open="escLockedOpen"
      title="closeOnEsc: false"
      icon="fa-keyboard"
      :close-on-esc="false"
      @close="escLockedOpen = false"
    >
      <p class="text-sm leading-6 text-slate-600 dark:text-[#a8adb7]">
        按 Esc 无效，但点击遮罩或右上角关闭按钮可以正常关闭。
      </p>
      <template #footer>
        <BaseButton size="sm" @click="escLockedOpen = false">关闭</BaseButton>
      </template>
    </BaseModal>
  </DemoBlock>

  <DemoBlock title="危险确认" description="通过 icon / iconBg / iconClass 定制警示样式的确认弹窗。">
    <BaseButton size="sm" variant="ghost" @click="dangerOpen = true">删除确认</BaseButton>

    <BaseModal
      :open="dangerOpen"
      title="确认删除？"
      icon="fa-triangle-exclamation"
      icon-bg="bg-rose-50 dark:bg-rose-500/10"
      icon-class="text-rose-600 dark:text-rose-400"
      @close="dangerOpen = false"
    >
      <p class="text-sm leading-6 text-slate-600 dark:text-[#a8adb7]">删除后不可恢复，请确认操作。</p>
      <template #footer>
        <BaseButton variant="secondary" size="sm" @click="dangerOpen = false">取消</BaseButton>
        <BaseButton size="sm" @click="dangerOpen = false">删除</BaseButton>
      </template>
    </BaseModal>
  </DemoBlock>
</template>
