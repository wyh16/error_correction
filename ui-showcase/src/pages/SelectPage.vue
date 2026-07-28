<script setup lang="ts">
import { ref } from 'vue'
import BaseCombobox from '@/components/base/BaseCombobox.vue'
import BaseSearchableSelect from '@/components/base/BaseSearchableSelect.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import DemoBlock from '~/components/DemoBlock.vue'
import DocTip from '~/components/DocTip.vue'

const selectValue = ref('数学')
const emptySelect = ref('')
const searchableSingle = ref('')
const searchableValue = ref(['函数', '几何'])
const comboboxValue = ref('geometry')

const subjects = ['语文', '数学', '英语', '物理', '化学']
const tags = ['函数', '几何', '方程', '力学', '电学', '阅读理解', '作文']
const basicCode = `<BaseSelect
  v-model="subject"
  :options="['语文', '数学', '英语']"
  label="学科"
  placeholder="全部学科"
  width-class="w-48"
/>`

const stateCode = `<BaseSelect v-model="subject" :options="subjects" clearable />
<BaseSelect model-value="数学" :options="subjects" disabled />`

const clearableValue = ref('数学')

const comboboxOptions = [
  { value: 'function', label: '函数' },
  { value: 'geometry', label: '几何' },
  { value: 'mechanics', label: '力学' },
  { value: 'reading', label: '阅读理解' },
]

// 边界：大量选项（下拉内部 max-h-56 滚动）与 clearable=false
const manyOptions = Array.from({ length: 50 }, (_, i) => `选项 ${String(i + 1).padStart(2, '0')}`)
const manyValue = ref('选项 25')
const lockedValue = ref('数学')

const edgeCode = `<!-- 50 个选项：下拉面板内部 max-h-56 滚动，展开时自动滚到选中项附近 -->
<BaseSelect v-model="value" :options="manyOptions" width-class="w-48" />

<!-- clearable 默认为 true，显式传 false 才能去掉悬停清空按钮 -->
<BaseSelect v-model="subject" :options="subjects" :clearable="false" width-class="w-48" />`
</script>

<template>
  <DocTip title="三个选择器怎么选？">
    <p>十来个以内的固定选项用 BaseSelect 即可；选项多到需要过滤时换 BaseSearchableSelect（支持多选）；需要「输入即搜」并适配对象数据结构时用 BaseCombobox。注意 BaseSelect 的 clearable 默认开启，作为必填筛选项时记得显式传 :clearable="false"。</p>
  </DocTip>

  <DemoBlock title="基础选择器" description="BaseSelect 基于 Headless UI Listbox，widthClass 控制宽度。" :code="basicCode">
    <div class="flex flex-wrap gap-4">
      <BaseSelect v-model="selectValue" :options="subjects" label="学科" placeholder="全部学科" width-class="w-48" />
      <BaseSelect v-model="emptySelect" :options="subjects" label="占位状态" placeholder="未选择时显示占位" width-class="w-48" />
    </div>
  </DemoBlock>

  <DemoBlock title="可清空与禁用" description="clearable 在有选中值时悬停显示清空按钮；disabled 禁用整个选择器。" :code="stateCode">
    <div class="flex flex-wrap gap-4">
      <BaseSelect v-model="clearableValue" :options="subjects" label="可清空" placeholder="选择学科" clearable width-class="w-48" />
      <BaseSelect model-value="数学" :options="subjects" label="禁用" disabled width-class="w-48" />
    </div>
  </DemoBlock>

  <DemoBlock
    title="边界情况：大量选项与不可清空"
    description="选项很多时下拉面板内部以 max-h-56 滚动，不会撑爆页面；clearable 默认为 true，显式传 false 后即使有选中值也不会出现清空按钮，适合必选筛选项。"
    :code="edgeCode"
  >
    <div class="flex flex-wrap gap-4">
      <BaseSelect v-model="manyValue" :options="manyOptions" label="50 个选项" placeholder="选择一项" width-class="w-48" />
      <BaseSelect v-model="lockedValue" :options="subjects" label="不可清空" :clearable="false" width-class="w-48" />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">左侧当前值：{{ manyValue || '（空）' }}；右侧悬停也不会出现清空按钮。</p>
  </DemoBlock>

  <DemoBlock title="可搜索选择" description="BaseSearchableSelect 支持搜索过滤；modelValue 为字符串时单选、数组时多选。">
    <div class="flex flex-wrap gap-4">
      <BaseSearchableSelect
        v-model="searchableSingle"
        :options="tags"
        placeholder="单选模式"
        search-placeholder="搜索知识点"
        width-class="w-48"
      />
      <BaseSearchableSelect
        v-model="searchableValue"
        :options="tags"
        placeholder="多选模式"
        search-placeholder="搜索知识点"
        multiple
        width-class="w-48"
      />
    </div>
  </DemoBlock>

  <DemoBlock title="Combobox" description="基于 Headless UI Combobox 的输入即搜，clearable 支持清空，labelKey / valueKey 适配任意对象结构。">
    <div class="max-w-xs">
      <BaseCombobox
        v-model="comboboxValue"
        :options="comboboxOptions"
        placeholder="选择知识点"
        search-placeholder="搜索知识点"
      />
    </div>
    <p class="mt-3 text-xs text-slate-500 dark:text-[#8a8f98]">当前值：{{ comboboxValue || '（空）' }}</p>
  </DemoBlock>
</template>
