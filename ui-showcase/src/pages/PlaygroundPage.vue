<script setup lang="ts">
import { computed, reactive, ref, type Component } from 'vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseAvatar from '@/components/base/BaseAvatar.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCheckbox from '@/components/base/BaseCheckbox.vue'
import BaseCodeBlock from '@/components/base/BaseCodeBlock.vue'
import BaseEmptyState from '@/components/base/BaseEmptyState.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseProgress from '@/components/base/BaseProgress.vue'
import BaseSegmented from '@/components/base/BaseSegmented.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseSkeleton from '@/components/base/BaseSkeleton.vue'
import BaseSlider from '@/components/base/BaseSlider.vue'
import BaseStat from '@/components/base/BaseStat.vue'
import BaseStatusPill from '@/components/base/BaseStatusPill.vue'
import BaseTag from '@/components/base/BaseTag.vue'

/**
 * 演练场：为常用组件定义 props 控制面板，实时预览并生成对应模板代码。
 * control 类型：select（枚举）、boolean、text、number（滑块）。
 */
type Control =
  | { prop: string; label: string; type: 'select'; options: string[] }
  | { prop: string; label: string; type: 'boolean' }
  | { prop: string; label: string; type: 'text' }
  | { prop: string; label: string; type: 'number'; min: number; max: number; step?: number }

type PlaygroundTarget = {
  id: string
  label: string
  component: Component
  /** 默认插槽内容（文本），空串表示无插槽。 */
  slotProp?: string
  controls: Control[]
  state: Record<string, unknown>
}

const targets: PlaygroundTarget[] = [
  {
    id: 'button',
    label: 'Button',
    component: BaseButton,
    slotProp: 'slot',
    controls: [
      { prop: 'variant', label: 'variant', type: 'select', options: ['primary', 'secondary', 'cta', 'ghost'] },
      { prop: 'size', label: 'size', type: 'select', options: ['sm', 'md'] },
      { prop: 'disabled', label: 'disabled', type: 'boolean' },
      { prop: 'slot', label: '按钮文字', type: 'text' },
    ],
    state: reactive({ variant: 'primary', size: 'md', disabled: false, slot: '提交答案' }),
  },
  {
    id: 'tag',
    label: 'Tag',
    component: BaseTag,
    slotProp: 'slot',
    controls: [
      { prop: 'tone', label: 'tone', type: 'select', options: ['neutral', 'accent', 'rose', 'amber', 'emerald', 'blue'] },
      { prop: 'size', label: 'size', type: 'select', options: ['xs', 'sm'] },
      { prop: 'active', label: 'active', type: 'boolean' },
      { prop: 'slot', label: '标签文字', type: 'text' },
    ],
    state: reactive({ tone: 'accent', size: 'sm', active: false, slot: '知识点' }),
  },
  {
    id: 'alert',
    label: 'Alert',
    component: BaseAlert,
    controls: [
      { prop: 'tone', label: 'tone', type: 'select', options: ['info', 'success', 'warning', 'danger'] },
      { prop: 'title', label: 'title', type: 'text' },
      { prop: 'description', label: 'description', type: 'text' },
      { prop: 'closable', label: 'closable', type: 'boolean' },
    ],
    state: reactive({ tone: 'info', title: '同步完成', description: '已导入 24 道错题。', closable: false }),
  },
  {
    id: 'progress',
    label: 'Progress',
    component: BaseProgress,
    controls: [
      { prop: 'value', label: 'value', type: 'number', min: 0, max: 100 },
      { prop: 'tone', label: 'tone', type: 'select', options: ['accent', 'blue', 'emerald', 'amber', 'rose'] },
      { prop: 'size', label: 'size', type: 'select', options: ['sm', 'md', 'lg'] },
      { prop: 'label', label: 'label', type: 'text' },
      { prop: 'showValue', label: 'showValue', type: 'boolean' },
    ],
    state: reactive({ value: 64, tone: 'accent', size: 'md', label: '掌握进度', showValue: true }),
  },
  {
    id: 'avatar',
    label: 'Avatar',
    component: BaseAvatar,
    controls: [
      { prop: 'name', label: 'name', type: 'text' },
      { prop: 'icon', label: 'icon（fa-*）', type: 'text' },
      { prop: 'size', label: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg'] },
      { prop: 'tone', label: 'tone', type: 'select', options: ['accent', 'blue', 'emerald', 'amber', 'rose'] },
    ],
    state: reactive({ name: '小哲', icon: '', size: 'md', tone: 'accent' }),
  },
  {
    id: 'badge',
    label: 'Badge',
    component: BaseBadge,
    slotProp: 'slot',
    controls: [
      { prop: 'value', label: 'value', type: 'number', min: 0, max: 200 },
      { prop: 'max', label: 'max', type: 'number', min: 1, max: 99 },
      { prop: 'tone', label: 'tone', type: 'select', options: ['accent', 'neutral', 'rose', 'amber', 'emerald', 'blue'] },
      { prop: 'dot', label: 'dot', type: 'boolean' },
      { prop: 'slot', label: '内部文字', type: 'text' },
    ],
    state: reactive({ value: 12, max: 99, tone: 'accent', dot: false, slot: '收件箱' }),
  },
  {
    id: 'status-pill',
    label: 'StatusPill',
    component: BaseStatusPill,
    controls: [
      { prop: 'label', label: 'label', type: 'text' },
      { prop: 'ok', label: 'ok', type: 'boolean' },
      { prop: 'loading', label: 'loading', type: 'boolean' },
      { prop: 'placeholder', label: 'placeholder', type: 'boolean' },
    ],
    state: reactive({ label: '服务在线', ok: true, loading: false, placeholder: false }),
  },
  {
    id: 'skeleton',
    label: 'Skeleton',
    component: BaseSkeleton,
    controls: [
      { prop: 'variant', label: 'variant', type: 'select', options: ['rect', 'circle', 'text'] },
      { prop: 'lines', label: 'lines（text 模式）', type: 'number', min: 1, max: 8 },
      { prop: 'animated', label: 'animated', type: 'boolean' },
    ],
    state: reactive({ variant: 'text', lines: 3, animated: true }),
  },
  {
    id: 'stat',
    label: 'Stat',
    component: BaseStat,
    controls: [
      { prop: 'label', label: 'label', type: 'text' },
      { prop: 'value', label: 'value', type: 'number', min: 0, max: 999 },
      { prop: 'suffix', label: 'suffix', type: 'text' },
      { prop: 'hint', label: 'hint', type: 'text' },
      { prop: 'icon', label: 'icon（fa-*）', type: 'text' },
      { prop: 'tone', label: 'tone', type: 'select', options: ['accent', 'blue', 'rose', 'amber', 'emerald', 'orange'] },
    ],
    state: reactive({ label: '连续打卡', value: 7, suffix: '天', hint: '', icon: 'fa-fire', tone: 'orange' }),
  },
  {
    id: 'empty-state',
    label: 'EmptyState',
    component: BaseEmptyState,
    controls: [
      { prop: 'icon', label: 'icon（fa-*）', type: 'text' },
      { prop: 'title', label: 'title', type: 'text' },
      { prop: 'description', label: 'description', type: 'text' },
    ],
    state: reactive({ icon: 'fa-inbox', title: '暂无数据', description: '换个筛选条件试试。' }),
  },
]

const activeTargetId = ref('button')
const activeTarget = computed(() => targets.find(target => target.id === activeTargetId.value) || targets[0])

const segmentedOptions = targets.map(target => ({ value: target.id, label: target.label }))

/** 传给预览组件的 props（去掉 slot 伪 prop）。 */
const previewProps = computed(() => {
  const { state, slotProp } = activeTarget.value
  const props: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(state)) {
    if (key === slotProp) continue
    props[key] = value
  }
  return props
})

const slotText = computed(() => {
  const { state, slotProp } = activeTarget.value
  return slotProp ? String(state[slotProp] ?? '') : ''
})

/** 根据当前 state 生成模板代码，省略等于默认值的常见项以保持简洁。 */
const generatedCode = computed(() => {
  const target = activeTarget.value
  const name = `Base${target.label}`
  const attrs: string[] = []
  for (const control of target.controls) {
    if (control.prop === target.slotProp) continue
    const value = target.state[control.prop]
    if (control.type === 'boolean') {
      if (value) attrs.push(control.prop)
    } else if (control.type === 'number') {
      attrs.push(`:${control.prop}="${value}"`)
    } else if (value !== '' && value != null) {
      attrs.push(`${control.prop}="${value}"`)
    }
  }
  const attrText = attrs.length ? ` ${attrs.join(' ')}` : ''
  if (target.slotProp) return `<${name}${attrText}>${slotText.value}</${name}>`
  return `<${name}${attrText} />`
})
</script>

<template>
  <div class="grid gap-6">
    <div class="overflow-x-auto pb-1">
      <BaseSegmented v-model="activeTargetId" :options="segmentedOptions" />
    </div>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <!-- 预览区 -->
      <div class="flex min-h-56 items-center justify-center rounded-xl border border-slate-200 bg-white/80 p-8 dark:border-white/[0.08] dark:bg-white/[0.02]">
        <div class="w-full max-w-sm" :class="['button', 'tag', 'avatar', 'badge', 'status-pill'].includes(activeTarget.id) ? 'flex justify-center' : ''">
          <component :is="activeTarget.component" v-bind="previewProps" :key="activeTarget.id">
            <template v-if="activeTarget.slotProp" #default>{{ slotText }}</template>
          </component>
        </div>
      </div>

      <!-- 控制面板 -->
      <aside class="grid content-start gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-white/[0.08] dark:bg-white/[0.02]">
        <p class="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-[#62666d]">Props</p>
        <template v-for="control in activeTarget.controls" :key="`${activeTarget.id}-${control.prop}`">
          <BaseSelect
            v-if="control.type === 'select'"
            :model-value="String(activeTarget.state[control.prop])"
            :options="control.options"
            :label="control.label"
            @update:model-value="activeTarget.state[control.prop] = $event"
          />
          <BaseCheckbox
            v-else-if="control.type === 'boolean'"
            :model-value="Boolean(activeTarget.state[control.prop])"
            :label="control.label"
            @update:model-value="activeTarget.state[control.prop] = $event"
          />
          <BaseSlider
            v-else-if="control.type === 'number'"
            :model-value="Number(activeTarget.state[control.prop])"
            :label="control.label"
            :min="control.min"
            :max="control.max"
            :step="control.step || 1"
            @update:model-value="activeTarget.state[control.prop] = $event"
          />
          <div v-else>
            <label class="mb-1.5 block text-xs font-medium text-slate-500 dark:text-[#62666d]">{{ control.label }}</label>
            <BaseInput
              :model-value="String(activeTarget.state[control.prop] ?? '')"
              @update:model-value="activeTarget.state[control.prop] = $event"
            />
          </div>
        </template>
      </aside>
    </div>

    <BaseCodeBlock :code="generatedCode" language="vue" title="生成的代码" />
  </div>
</template>
