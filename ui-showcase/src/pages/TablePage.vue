<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDataTable from '@/components/base/BaseDataTable.vue'
import BaseStatusPill from '@/components/base/BaseStatusPill.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import BaseTag from '@/components/base/BaseTag.vue'
import DemoBlock from '~/components/DemoBlock.vue'
import DocTip from '~/components/DocTip.vue'

const notify = inject('notify') as (type?: string) => void

const tableColumns = [
  { key: 'name', label: '组件', sortable: true },
  { key: 'category', label: '分类', sortable: true },
  { key: 'status', label: '状态', sortable: true },
  { key: 'coverage', label: '覆盖率', align: 'right', sortable: true },
]
const tableRows = [
  { id: 1, name: 'BaseTable', category: '数据展示', status: '已完成', coverage: 90 },
  { id: 2, name: 'BasePopover', category: '浮层', status: '已完成', coverage: 82 },
  { id: 3, name: 'BaseAvatar', category: '展示', status: '已完成', coverage: 78 },
  { id: 4, name: 'BaseAccordion', category: '内容组织', status: '已完成', coverage: 84 },
  { id: 5, name: 'BaseCommandPalette', category: '导航', status: '进行中', coverage: 75 },
  { id: 6, name: 'BaseDataTable', category: '数据展示', status: '已完成', coverage: 88 },
  { id: 7, name: 'BaseTree', category: '数据展示', status: '进行中', coverage: 66 },
]

const sortKey = ref('')
const sortDirection = ref('')

const manyRows = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name: `组件 ${i + 1}`,
  category: i % 2 === 0 ? '数据展示' : '反馈',
  status: i % 3 === 0 ? '进行中' : '已完成',
}))

const stripedCode = `<BaseTable :columns="columns" :rows="rows" striped />`
const stickyCode = `<!-- stickyHeader 时组件内部提供 max-h-[360px] 的滚动容器 -->
<BaseTable :columns="columns" :rows="manyRows" sticky-header />`

const dataTableCode = `<BaseDataTable :columns="columns" :rows="rows" :page-size="4" @row-click="openDetail">
  <template #cell-status="{ value }">
    <BaseTag :tone="value === '已完成' ? 'emerald' : 'amber'">{{ value }}</BaseTag>
  </template>
</BaseDataTable>`

// BaseDataTable 空数据 + loading：模拟一次 1.2s 的远程刷新
const dtLoading = ref(false)
const dtRows = ref<typeof tableRows>([])
function reloadDataTable() {
  dtLoading.value = true
  dtRows.value = []
  window.setTimeout(() => {
    dtRows.value = tableRows.slice(0, 4)
    dtLoading.value = false
  }, 1200)
}

const dtEmptyCode = `<!-- loading 期间显示加载行；结束后 rows 仍为空则显示 emptyText -->
<BaseDataTable
  :columns="columns"
  :rows="rows"
  :loading="loading"
  empty-text="暂无组件数据，点击上方按钮加载"
  :page-size="4"
/>`

function onSort(column: { key: string }) {
  if (sortKey.value === column.key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = column.key
    sortDirection.value = 'asc'
  }
}
</script>

<template>
  <DocTip title="BaseTable 还是 BaseDataTable？">
    <p>BaseTable 是纯渲染层，搜索、排序、分页全部由外部受控，适合服务端驱动的列表；BaseDataTable 内置这三件套，几行代码就能跑通本地数据。数据量大或需要跨页选择时，配合 remote + total 切到远程模式，再监听 search-change / page-change 请求接口。</p>
  </DocTip>

  <DemoBlock title="数据表格" description="BaseDataTable 内置搜索、排序和分页，通过 cell-* 插槽自定义单元格，row-click 响应行点击。" :code="dataTableCode">
    <BaseDataTable :columns="tableColumns" :rows="tableRows" :page-size="4" @row-click="() => notify('info')">
      <template #cell-status="{ value }">
        <BaseTag :tone="value === '已完成' ? 'emerald' : 'amber'">{{ value }}</BaseTag>
      </template>
      <template #cell-coverage="{ value }">
        <span class="font-semibold">{{ value }}%</span>
      </template>
    </BaseDataTable>
  </DemoBlock>

  <DemoBlock title="关闭搜索" description="searchable 设为 false 时隐藏搜索框，只保留排序和分页。">
    <BaseDataTable :columns="tableColumns.slice(0, 3)" :rows="tableRows" :page-size="3" :searchable="false" />
  </DemoBlock>

  <DemoBlock title="基础表格（受控排序）" description="BaseTable 只负责渲染，排序状态由外部通过 sortKey / sortDirection 控制。">
    <BaseTable
      :columns="tableColumns.slice(0, 3)"
      :rows="tableRows.slice(0, 4)"
      :sort-key="sortKey"
      :sort-direction="sortDirection"
      compact
      @sort="onSort"
    >
      <template #cell-status="{ value }">
        <BaseStatusPill :label="value" :ok="value === '已完成'" :loading="value === '进行中'" />
      </template>
    </BaseTable>
  </DemoBlock>

  <DemoBlock title="加载与空状态" description="loading 显示加载行，rows 为空时显示 emptyText。">
    <div class="grid gap-4">
      <BaseTable :columns="tableColumns.slice(0, 3)" :rows="[]" loading compact />
      <BaseTable :columns="tableColumns.slice(0, 3)" :rows="[]" empty-text="没有符合条件的组件" compact />
    </div>
  </DemoBlock>

  <DemoBlock
    title="边界情况：BaseDataTable 空数据与加载"
    description="loading 期间显示加载行并保留表头结构；加载结束 rows 仍为空时回落到 emptyText。点击按钮体验完整的 空 → 加载 → 有数据 流转。"
    :code="dtEmptyCode"
  >
    <div class="grid gap-3">
      <div class="flex items-center gap-2">
        <BaseButton size="sm" variant="secondary" icon="fa-rotate" :loading="dtLoading" @click="reloadDataTable">
          {{ dtLoading ? '加载中…' : '模拟加载数据' }}
        </BaseButton>
        <BaseButton size="sm" variant="ghost" :disabled="dtLoading" @click="dtRows = []">清空回到空态</BaseButton>
      </div>
      <BaseDataTable
        :columns="tableColumns.slice(0, 3)"
        :rows="dtRows"
        :loading="dtLoading"
        empty-text="暂无组件数据，点击上方按钮加载"
        :page-size="4"
        :searchable="false"
      />
    </div>
  </DemoBlock>

  <DemoBlock title="斑马纹" description="striped 为偶数行添加浅色背景，行悬停高亮仍然有效。" :code="stripedCode">
    <BaseTable :columns="tableColumns.slice(0, 3)" :rows="tableRows" striped compact />
  </DemoBlock>

  <DemoBlock title="固定表头" description="stickyHeader 开启后，组件内部将滚动容器限制为 max-h-[360px] 并纵向滚动，表头固定在顶部。" :code="stickyCode">
    <BaseTable :columns="tableColumns.slice(0, 3)" :rows="manyRows" sticky-header compact />
  </DemoBlock>
</template>
