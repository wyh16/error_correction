<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseEmptyState from '@/components/base/BaseEmptyState.vue'
import BaseSearchInput from '@/components/base/BaseSearchInput.vue'
import BaseStat from '@/components/base/BaseStat.vue'
import BaseTag from '@/components/base/BaseTag.vue'
import { BASE_COMPONENT_COUNT, BASE_COMPONENT_GROUP_SUMMARY } from '@/components/base/registry'
import { CATALOG } from '~/catalog'

const groupMeta: Record<string, { icon: string; subtitle: string }> = {
  layout: { icon: 'fa-layer-group', subtitle: '页面框架、容器和分隔结构' },
  form: { icon: 'fa-keyboard', subtitle: '输入、选择、上传和表单状态' },
  feedback: { icon: 'fa-window-restore', subtitle: '弹窗、通知、浮层和进度反馈' },
  display: { icon: 'fa-shapes', subtitle: '信息展示、数据呈现和空状态' },
  navigation: { icon: 'fa-compass', subtitle: '导航、菜单、分页和快捷操作' },
}

// 只收录组件分组（排除"指南"），指南入口由上方快捷卡片承担。
const componentGroups = CATALOG.filter(group => group.id in groupMeta)
const totalEntryCount = componentGroups.reduce((total, group) => total + group.entries.length, 0)

// ── 即时过滤：按标题 / 组件名 / 描述匹配目录卡片 ──
const searchQuery = ref('')
const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())

const filteredGroups = computed(() => {
  const query = normalizedQuery.value
  if (!query) return componentGroups
  return componentGroups
    .map(group => ({
      ...group,
      entries: group.entries.filter(
        entry =>
          entry.title.toLowerCase().includes(query) ||
          entry.description.toLowerCase().includes(query) ||
          entry.components.some(name => name.toLowerCase().includes(query)),
      ),
    }))
    .filter(group => group.entries.length > 0)
})

const matchedEntryCount = computed(() =>
  filteredGroups.value.reduce((total, group) => total + group.entries.length, 0),
)

// 分组标题锚点：平滑滚动到分组处，并复制 "#/overview#group-xxx" 形式的深链。
// 与 DemoBlock / ApiTable 的锚点行为一致：不直接改写 location.hash，避免触发路由切换。
function onGroupAnchorClick(groupId: string) {
  const anchorId = `group-${groupId}`
  const el = document.getElementById(anchorId)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const [base, route = ''] = window.location.href.split('#')
  const url = route ? `${base}#${route}#${anchorId}` : `${base}#${anchorId}`
  navigator.clipboard?.writeText(url).catch(() => {})
}
</script>

<template>
  <div class="grid gap-6">
    <p class="max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#a8adb7]">
      这是主应用 <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-white/[0.06]">frontend/src/components/base</code>
      组件库的展示站，组件基于 Headless UI + Tailwind 实现。源码通过 Vite 别名直接复用，
      主应用里的任何组件改动都会实时反映在这里。从左侧选择组件查看演示和 API。
    </p>

    <!-- 统计条：组件总数 / 分组数 / 技术栈 -->
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <BaseStat label="基础组件" :value="BASE_COMPONENT_COUNT" icon="fa-cubes" tone="accent" />
      <BaseStat label="组件分组" :value="BASE_COMPONENT_GROUP_SUMMARY.length" icon="fa-table-cells-large" tone="blue" />
      <BaseStat label="实现方式" value="Headless UI" icon="fa-puzzle-piece" tone="amber" />
      <BaseStat label="样式系统" value="Tailwind" icon="fa-palette" tone="emerald" />
    </div>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <a
        v-for="link in [
          { hash: '#/guide-start', icon: 'fa-rocket', title: '快速上手', desc: '引入方式与组件约定' },
          { hash: '#/guide-theme', icon: 'fa-palette', title: '主题定制', desc: '主题色与深浅色原理' },
          { hash: '#/playground', icon: 'fa-sliders', title: '演练场', desc: '实时调参并生成代码' },
          { hash: '#/patterns', icon: 'fa-shapes', title: '场景示例', desc: '组件组合的真实页面' },
        ]"
        :key="link.hash"
        :href="link.hash"
        class="group rounded-xl border border-slate-200 p-4 transition-colors hover:border-[rgb(var(--accent-rgb)/0.4)] hover:bg-slate-50 dark:border-white/[0.08] dark:hover:bg-white/[0.03]"
      >
        <p class="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-[#f7f8f8]">
          <i class="fa-solid text-xs accent-text" :class="link.icon"></i>
          {{ link.title }}
          <i class="fa-solid fa-arrow-right ml-auto text-[10px] text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-[#3f4147]"></i>
        </p>
        <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-[#8a8f98]">{{ link.desc }}</p>
      </a>
    </div>

    <!-- 组件目录：即时过滤 + 结果计数 -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="w-full sm:max-w-xs">
        <BaseSearchInput v-model="searchQuery" placeholder="过滤组件：标题 / 组件名 / 描述" />
      </div>
      <p class="text-xs text-slate-500 dark:text-[#8a8f98]" aria-live="polite">
        <template v-if="normalizedQuery">
          匹配 <span class="accent-text font-semibold">{{ matchedEntryCount }}</span> / {{ totalEntryCount }} 个组件页
        </template>
        <template v-else>共 {{ totalEntryCount }} 个组件页 · {{ BASE_COMPONENT_COUNT }} 个组件</template>
      </p>
    </div>

    <section v-for="group in filteredGroups" :key="group.id" class="grid gap-3">
      <div class="grid gap-1">
        <h3
          :id="`group-${group.id}`"
          class="group flex scroll-mt-24 items-center gap-2 text-base font-bold text-slate-900 dark:text-[#f7f8f8]"
        >
          <i class="fa-solid text-sm accent-text" :class="groupMeta[group.id]?.icon || 'fa-cube'"></i>
          {{ group.label }}
          <BaseTag size="xs" tone="neutral">{{ group.entries.length }}</BaseTag>
          <a
            :href="`#group-${group.id}`"
            class="accent-text text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            aria-label="复制本分组锚点链接"
            @click.prevent="onGroupAnchorClick(group.id)"
          >#</a>
        </h3>
        <p class="text-xs leading-5 text-slate-500 dark:text-[#8a8f98]">{{ groupMeta[group.id]?.subtitle }}</p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <a
          v-for="entry in group.entries"
          :key="entry.id"
          :href="`#/${entry.id}`"
          class="group flex flex-col gap-2 rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgb(var(--accent-rgb)/0.45)] hover:bg-slate-50 hover:shadow-lg hover:shadow-slate-900/[0.06] dark:border-white/[0.08] dark:hover:border-[rgb(var(--accent-rgb)/0.5)] dark:hover:bg-white/[0.03] dark:hover:shadow-black/40"
        >
          <p class="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-[#f7f8f8]">
            <span class="truncate">{{ entry.title }}</span>
            <!-- 组件数徽标 -->
            <BaseTag size="xs" tone="accent">{{ entry.components.length }}</BaseTag>
            <i class="fa-solid fa-arrow-right ml-auto shrink-0 text-[10px] text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-[#3f4147]"></i>
          </p>
          <p class="text-xs leading-5 text-slate-500 dark:text-[#8a8f98]">{{ entry.description }}</p>
          <p class="mt-auto flex flex-wrap gap-1 pt-1">
            <BaseTag v-for="name in entry.components.slice(0, 3)" :key="name" size="xs" tone="neutral">
              <span class="font-mono">{{ name }}</span>
            </BaseTag>
            <BaseTag v-if="entry.components.length > 3" size="xs" tone="neutral">
              +{{ entry.components.length - 3 }}
            </BaseTag>
          </p>
        </a>
      </div>
    </section>

    <!-- 无匹配结果的空态 -->
    <div
      v-if="normalizedQuery && matchedEntryCount === 0"
      class="rounded-xl border border-dashed border-slate-200 px-4 py-10 dark:border-white/[0.08]"
    >
      <BaseEmptyState
        icon="fa-solid fa-magnifying-glass"
        title="未找到匹配组件"
        :description="`没有与「${searchQuery.trim()}」匹配的组件标题、组件名或描述，换个关键词试试。`"
      >
        <BaseButton variant="secondary" size="sm" @click="searchQuery = ''">清空搜索</BaseButton>
      </BaseEmptyState>
    </div>
  </div>
</template>
