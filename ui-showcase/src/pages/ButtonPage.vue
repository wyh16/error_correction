<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseToolbarButton from '@/components/base/BaseToolbarButton.vue'
import BaseTooltip from '@/components/base/BaseTooltip.vue'
import DemoBlock from '~/components/DemoBlock.vue'
import DocTip from '~/components/DocTip.vue'

const notify = inject('notify') as (type?: string) => void

// 模拟一次 1.5s 的异步提交，演示 loading 态。
const submitting = ref(false)
function fakeSubmit() {
  submitting.value = true
  window.setTimeout(() => {
    submitting.value = false
  }, 1500)
}

const variantCode = `<BaseButton variant="primary">Primary</BaseButton>
<BaseButton variant="secondary">Secondary</BaseButton>
<BaseButton variant="cta">CTA</BaseButton>
<BaseButton variant="ghost">Ghost</BaseButton>
<BaseButton variant="danger">Danger</BaseButton>
<BaseButton variant="glass">Glass</BaseButton>
<BaseButton disabled>Disabled</BaseButton>`

const sizeCode = `<BaseButton size="sm">小尺寸 sm</BaseButton>
<BaseButton>默认尺寸 md</BaseButton>
<BaseButton size="lg">大尺寸 lg</BaseButton>`

const loadingCode = `<BaseButton :loading="submitting" @click="submit">保存</BaseButton>
<BaseButton icon="fa-plus" variant="secondary">新建</BaseButton>
<BaseButton icon="fa-paper-plane" variant="cta">发布</BaseButton>`

const blockCode = `<BaseButton block>占满整行</BaseButton>
<BaseButton block variant="secondary">次要整行按钮</BaseButton>`

const edgeCode = `<!-- loading 已内置 pointer-events-none，无需再叠加 disabled -->
<BaseButton loading disabled>加载 + 禁用</BaseButton>
<BaseButton loading disabled variant="secondary">次要 加载 + 禁用</BaseButton>

<!-- 超长文本：限制按钮宽度，slot 内用 truncate 截断 -->
<BaseButton class="max-w-[200px]">
  <span class="max-w-[150px] truncate">这是一段非常非常长的按钮文案会被截断</span>
</BaseButton>`

const ghostGlassCode = `<BaseButton variant="glass" icon="fa-arrow-left">返回</BaseButton>
<BaseButton variant="glass">
  <i class="fa-solid fa-circle-info"></i>
</BaseButton>
<BaseButton variant="ghost" icon="fa-xmark">取消</BaseButton>`
</script>

<template>
  <DocTip title="变体选择建议">
    <p>一个视图里只保留一个 primary / cta 主操作，其余动作用 secondary 或 ghost 承接；异步提交用 loading 而不是手动 disabled——loading 会自动拦截点击并显示 spinner，两者无需同时设置。</p>
  </DocTip>

  <DemoBlock title="按钮变体" description="variant 支持 primary / secondary / cta / ghost / danger / glass，disabled 控制禁用。" :code="variantCode">
    <div class="flex flex-wrap gap-2">
      <BaseButton variant="primary">Primary</BaseButton>
      <BaseButton variant="secondary">Secondary</BaseButton>
      <BaseButton variant="cta">CTA</BaseButton>
      <BaseButton variant="ghost">Ghost</BaseButton>
      <BaseButton variant="danger">Danger</BaseButton>
      <BaseButton variant="glass">Glass</BaseButton>
      <BaseButton disabled>Disabled</BaseButton>
      <BaseButton variant="secondary" disabled>Disabled</BaseButton>
    </div>
  </DemoBlock>

  <DemoBlock title="尺寸" description="size 支持 sm / md（默认）/ lg。" :code="sizeCode">
    <div class="flex flex-wrap items-center gap-2">
      <BaseButton size="sm" @click="notify('info')">小尺寸 sm</BaseButton>
      <BaseButton @click="notify('info')">默认尺寸 md</BaseButton>
      <BaseButton size="lg" @click="notify('info')">大尺寸 lg</BaseButton>
      <BaseButton size="sm" variant="secondary">次要 sm</BaseButton>
      <BaseButton variant="secondary">次要 md</BaseButton>
    </div>
  </DemoBlock>

  <DemoBlock title="加载与图标" description="loading 显示旋转图标并禁止点击；icon 在文本前渲染 fa-* 图标，加载中时被 spinner 替换。" :code="loadingCode">
    <div class="flex flex-wrap items-center gap-2">
      <BaseButton :loading="submitting" @click="fakeSubmit">{{ submitting ? '保存中…' : '点击保存' }}</BaseButton>
      <BaseButton loading variant="secondary">加载中</BaseButton>
      <BaseButton icon="fa-plus" variant="secondary">新建</BaseButton>
      <BaseButton icon="fa-paper-plane" variant="cta">发布</BaseButton>
      <BaseButton icon="fa-arrow-left" size="sm" variant="ghost">返回</BaseButton>
    </div>
  </DemoBlock>

  <DemoBlock title="整行按钮" description="block 让按钮占满父容器宽度，常用于表单提交和移动端布局。" :code="blockCode">
    <div class="grid max-w-sm gap-2">
      <BaseButton block>占满整行</BaseButton>
      <BaseButton block variant="secondary">次要整行按钮</BaseButton>
    </div>
  </DemoBlock>

  <DemoBlock
    title="边界情况：加载禁用组合与超长文本"
    description="loading 与 disabled 同时设置时表现与单独 loading 一致（不可点击 + spinner）；文案超长时给按钮限宽并在 slot 内用 truncate 截断，避免撑破布局。"
    :code="edgeCode"
  >
    <div class="flex flex-wrap items-center gap-2">
      <BaseButton loading disabled>加载 + 禁用</BaseButton>
      <BaseButton loading disabled variant="secondary">次要 加载 + 禁用</BaseButton>
      <BaseButton class="max-w-[200px]">
        <span class="max-w-[150px] truncate">这是一段非常非常长的按钮文案会被截断</span>
      </BaseButton>
      <BaseButton size="sm" variant="secondary" class="max-w-[160px]">
        <span class="max-w-[110px] truncate">小尺寸下的超长文案同样截断</span>
      </BaseButton>
    </div>
  </DemoBlock>

  <DemoBlock title="链接按钮" description="传入 href 时渲染为 a 标签（传入 to 时渲染为 RouterLink）。">
    <div class="flex flex-wrap items-center gap-2">
      <BaseButton size="sm" variant="secondary" href="https://tailwindcss.com" target="_blank">外部链接</BaseButton>
      <BaseButton size="sm" variant="ghost" href="#/button">锚点链接</BaseButton>
    </div>
  </DemoBlock>

  <DemoBlock title="工具栏按钮" description="BaseToolbarButton 用于工具栏图标操作，variant 支持 neutral / primary / danger，active 表示选中态。">
    <div class="flex flex-wrap items-center gap-2">
      <BaseToolbarButton icon="fa-pen" title="编辑">编辑</BaseToolbarButton>
      <BaseToolbarButton icon="fa-bold" variant="primary" title="主要" />
      <BaseToolbarButton icon="fa-trash-can" variant="danger" title="删除" />
      <BaseToolbarButton icon="fa-italic" active title="选中态" />
      <BaseToolbarButton icon="fa-lock" disabled title="禁用" />
    </div>
  </DemoBlock>

  <DemoBlock
    title="幽灵与玻璃按钮"
    description="原 BaseGhostButton 已合并为 BaseButton 的 glass 变体：glass 是毛玻璃拟态样式，适合置于图片或渐变背景之上的弱操作；ghost 则是更轻量的描边幽灵按钮，适合取消等辅助动作。"
    :code="ghostGlassCode"
  >
    <div class="flex flex-wrap items-center gap-2">
      <BaseButton variant="glass" icon="fa-arrow-left">返回</BaseButton>
      <BaseTooltip text="用于弱操作或图标按钮说明" placement="bottom">
        <BaseButton variant="glass">
          <i class="fa-solid fa-circle-info"></i>
        </BaseButton>
      </BaseTooltip>
      <BaseButton variant="ghost" icon="fa-xmark">取消</BaseButton>
    </div>
  </DemoBlock>
</template>
