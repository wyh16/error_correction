<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseSearchInput from '@/components/base/BaseSearchInput.vue'
import { CATALOG } from '~/catalog'

const props = defineProps({
  activeId: { type: String, default: 'overview' },
})

const emit = defineEmits(['select'])

const search = ref('')
const keyword = computed(() => search.value.trim().toLowerCase())

// 按搜索词过滤：匹配条目标题或其包含的组件名。
const filteredCatalog = computed(() => {
  if (!keyword.value) return CATALOG
  return CATALOG
    .map(group => ({
      ...group,
      entries: group.entries.filter(entry =>
        `${entry.title} ${entry.components.join(' ')}`.toLowerCase().includes(keyword.value),
      ),
    }))
    .filter(group => group.entries.length > 0)
})

// 搜索结果计数（条目数）。
const resultCount = computed(() =>
  filteredCatalog.value.reduce((sum, group) => sum + group.entries.length, 0),
)

// 分组折叠状态（组件内记忆即可）；搜索时忽略折叠、强制展开以便查看结果。
const collapsedGroups = ref(new Set<string>())
const isCollapsed = (groupId: string) => !keyword.value && collapsedGroups.value.has(groupId)
function toggleGroup(groupId: string) {
  if (collapsedGroups.value.has(groupId)) collapsedGroups.value.delete(groupId)
  else collapsedGroups.value.add(groupId)
}

// Esc 清空搜索；有内容时拦截冒泡，避免顺带关闭移动端抽屉。
function onSearchKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !search.value) return
  event.stopPropagation()
  search.value = ''
}

/** 标题按关键词拆分为片段，命中片段用 accent 色高亮渲染。 */
function highlightSegments(text: string): Array<{ text: string; hit: boolean }> {
  const kw = keyword.value
  if (!kw) return [{ text, hit: false }]
  const lower = text.toLowerCase()
  const segments: Array<{ text: string; hit: boolean }> = []
  let index = 0
  while (index < text.length) {
    const found = lower.indexOf(kw, index)
    if (found === -1) {
      segments.push({ text: text.slice(index), hit: false })
      break
    }
    if (found > index) segments.push({ text: text.slice(index, found), hit: false })
    segments.push({ text: text.slice(found, found + kw.length), hit: true })
    index = found + kw.length
  }
  return segments
}

// 挂载后若激活项不在侧栏可视区内，将其滚动到中间。
const navRef = ref<HTMLElement | null>(null)
onMounted(() => {
  const container = navRef.value
  const active = container?.querySelector<HTMLElement>('[aria-current="page"]')
  if (!container || !active) return
  const containerRect = container.getBoundingClientRect()
  const activeRect = active.getBoundingClientRect()
  if (activeRect.top < containerRect.top || activeRect.bottom > containerRect.bottom) {
    active.scrollIntoView({ block: 'center' })
  }
})
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="shrink-0 p-3 pb-1" @keydown="onSearchKeydown">
      <BaseSearchInput v-model="search" placeholder="搜索组件" />
      <p v-if="keyword" class="px-1 pt-1.5 text-xs text-slate-400 dark:text-[#62666d]" aria-live="polite">
        共 {{ resultCount }} 个匹配结果
      </p>
    </div>
    <nav ref="navRef" class="min-h-0 flex-1 overflow-y-auto p-3">
      <a
        href="#/overview"
        class="relative mb-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors"
        :class="props.activeId === 'overview'
          ? 'accent-bg-soft accent-text'
          : 'text-slate-600 hover:bg-slate-100 dark:text-[#a8adb7] dark:hover:bg-white/[0.05]'"
        :aria-current="props.activeId === 'overview' ? 'page' : undefined"
        @click.prevent="emit('select', 'overview')"
      >
        <!-- 激活项左侧 2px 强调色竖条 -->
        <span
          v-if="props.activeId === 'overview'"
          class="accent-bg absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full"
          aria-hidden="true"
        ></span>
        <i class="fa-solid fa-house text-xs"></i>
        总览
      </a>

      <div v-for="group in filteredCatalog" :key="group.id" class="mb-4">
        <!-- 分组头：滚动时钉在顶部（带背景防穿透），点击折叠 / 展开 -->
        <button
          type="button"
          class="sticky top-0 z-10 mb-0.5 flex w-full items-center justify-between gap-2 rounded-md bg-white/90 px-3 pb-1.5 pt-2 text-left text-xs font-bold uppercase tracking-wide text-slate-400 backdrop-blur transition-colors hover:text-slate-600 dark:bg-[#0a0a0c]/90 dark:text-[#62666d] dark:hover:text-[#a8adb7]"
          :aria-expanded="!isCollapsed(group.id)"
          @click="toggleGroup(group.id)"
        >
          {{ group.label }}
          <i
            class="fa-solid fa-chevron-down text-[9px] transition-transform duration-200"
            :class="isCollapsed(group.id) ? '-rotate-90' : ''"
            aria-hidden="true"
          ></i>
        </button>
        <div v-show="!isCollapsed(group.id)" class="grid gap-0.5">
          <a
            v-for="entry in group.entries"
            :key="entry.id"
            :href="'#/' + entry.id"
            class="relative block w-full truncate rounded-lg px-3 py-1.5 text-left text-sm transition-colors"
            :class="props.activeId === entry.id
              ? 'accent-bg-soft accent-text font-semibold'
              : 'text-slate-600 hover:bg-slate-100 dark:text-[#a8adb7] dark:hover:bg-white/[0.05]'"
            :aria-current="props.activeId === entry.id ? 'page' : undefined"
            @click.prevent="emit('select', entry.id)"
          >
            <!-- 激活项左侧 2px 强调色竖条 -->
            <span
              v-if="props.activeId === entry.id"
              class="accent-bg absolute left-0 top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full"
              aria-hidden="true"
            ></span>
            <template v-for="(segment, index) in highlightSegments(entry.title)" :key="index">
              <span v-if="segment.hit" class="accent-text font-semibold">{{ segment.text }}</span>
              <template v-else>{{ segment.text }}</template>
            </template>
          </a>
        </div>
      </div>

      <!-- 搜索无结果空态 -->
      <div v-if="!filteredCatalog.length" class="flex flex-col items-center gap-2 px-3 py-10 text-center">
        <i class="fa-solid fa-magnifying-glass text-lg text-slate-300 dark:text-[#3a3d44]" aria-hidden="true"></i>
        <p class="text-sm text-slate-400 dark:text-[#62666d]">没有找到匹配「{{ search.trim() }}」的组件</p>
        <p class="text-xs text-slate-300 dark:text-[#4a4d55]">试试其他关键词，或按 Esc 清空搜索</p>
      </div>
    </nav>
  </div>
</template>
