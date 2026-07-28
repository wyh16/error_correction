<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import BaseCommandPalette from '@/components/base/BaseCommandPalette.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import BaseKbd from '@/components/base/BaseKbd.vue'
import BasePopover from '@/components/base/BasePopover.vue'
import BaseTag from '@/components/base/BaseTag.vue'
import BaseToastContainer from '@/components/base/BaseToastContainer.vue'
import { BASE_COMPONENT_COUNT } from '@/components/base/registry'
import { useTheme } from '@/composables/useTheme'
import { ALL_ENTRIES, CATALOG, findEntry } from '~/catalog'
import ApiTable from '~/components/ApiTable.vue'
import CatalogNav from '~/components/CatalogNav.vue'
import OverviewPage from '~/pages/OverviewPage.vue'

const { isDark, initTheme, setTheme, themeColors, accentColorId, setAccentColor } = useTheme()

// 版本号与 frontend/package.json 的 version 保持一致。
// dev server 的 fs.allow 只包含 ui-showcase 与 frontend/src，无法直接 import 该 JSON。
const FRONTEND_VERSION = '0.0.0'
const REPO_URL = 'https://github.com/IDhammaI/error_correction'

const activeId = ref('overview')
const toastId = ref(0)
const toasts = ref<Array<Record<string, unknown>>>([])

const activeEntry = computed(() => (activeId.value === 'overview' ? null : findEntry(activeId.value) || null))

const toastPresets: Record<string, { title: string; description: string }> = {
  success: { title: '操作成功', description: '这是成功状态的全局通知样式。' },
  error: { title: '操作失败', description: '这是错误状态的全局通知样式。' },
  info: { title: '预览通知', description: '这是组件库的全局通知样式。' },
}

function pushToast(type: string = 'info') {
  toastId.value += 1
  const preset = toastPresets[type] || toastPresets.info
  toasts.value = [...toasts.value, { id: toastId.value, type, ...preset, action: { label: '知道了' } }].slice(-3)
}

function dismissToast(id: number) {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

// 演示页通过 inject('notify') 触发全局 Toast。
provide('notify', pushToast)

function selectEntry(id: string) {
  activeId.value = id
  mobileNavOpen.value = false
  document.getElementById('doc-main')?.scrollTo({ top: 0 })
}

// 移动端导航抽屉（lg 以下侧边栏隐藏时使用）。
const mobileNavOpen = ref(false)

// 底部翻页：按目录顺序找当前条目的前一篇 / 后一篇。
const pagerEntries = computed(() => {
  const index = ALL_ENTRIES.findIndex(entry => entry.id === activeId.value)
  if (index < 0) return { prev: null, next: null }
  return {
    prev: ALL_ENTRIES[index - 1] || null,
    next: ALL_ENTRIES[index + 1] || null,
  }
})

// 相关组件交叉链接：catalog 手工标注的 related id 映射回目录条目，无标注时为空。
const relatedEntries = computed(() =>
  (activeEntry.value?.related || [])
    .map(id => findEntry(id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
)

// Ctrl+K 快速跳转：目录条目映射为命令面板项。
const paletteOpen = ref(false)
const groupLabelOf = (entryId: string) =>
  CATALOG.find(group => group.entries.some(entry => entry.id === entryId))?.label || ''
const paletteItems = ALL_ENTRIES.map(entry => ({
  value: entry.id,
  label: entry.title,
  description: entry.components.length ? entry.components.join(' / ') : entry.description,
  icon: 'fa-cube',
  group: groupLabelOf(entry.id),
}))

function onPaletteSelect(item: { value: string }) {
  selectEntry(item.value)
}

function onGlobalKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    paletteOpen.value = !paletteOpen.value
  }
}

// hash 路由：刷新和分享链接时保持当前组件页。
// 兼容 "#/card#api-basecard" 这类带节内锚点的深链，只取第一段作为路由。
function routeOfHash(hash: string) {
  return hash.replace(/^#\/?/, '').split('#')[0]
}

function syncFromHash() {
  const routePart = routeOfHash(window.location.hash)
  const resolved = routePart && (routePart === 'overview' || findEntry(routePart)) ? routePart : 'overview'
  activeId.value = resolved
  // 空 hash / 非法 hash 归一化为规范地址；用 replaceState 不污染历史栈
  if (routePart !== resolved) window.history.replaceState(null, '', `#/${resolved}`)
}

// 页内切换用 pushState 写入历史记录，浏览器后退/前进经 hashchange 回流到 syncFromHash。
// 闭环无死循环：pushState 本身不触发 hashchange，且推入前先比对当前路由段。
watch(activeId, (id) => {
  if (routeOfHash(window.location.hash) !== id) window.history.pushState(null, '', `#/${id}`)
})

// 切页同步浏览器标题
watch(activeEntry, (entry) => {
  document.title = entry ? `${entry.title} - Base 组件库` : 'Base 组件库'
}, { immediate: true })

// ── 右侧「本页目录」TOC ──
// 内容在 #doc-main 内部滚动（不是 window），所以自行实现收集 + scrollspy。
const mainRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const tocItems = ref<Array<{ id: string; text: string }>>([])
const activeTocId = ref('')
// 点击平滑滚动期间暂停 scroll 联动，避免途经的小节抢走高亮
let tocSuppressUntil = 0
let tocObserver: MutationObserver | null = null

/** 收集正文小节标题：优先匹配 DemoBlock 的标题结构（section > div > h3），否则退回全部 h3。 */
function collectToc() {
  const root = contentRef.value
  if (!root) return
  let nodes = Array.from(root.querySelectorAll<HTMLElement>('section > div > h3'))
  if (!nodes.length) nodes = Array.from(root.querySelectorAll<HTMLElement>('h3'))
  const items = nodes.map((el, index) => {
    // 无 id 的标题自动生成 id，带上页面 id 避免跨页冲突
    if (!el.id) el.id = `toc-${activeId.value}-${index}`
    return { id: el.id, text: el.textContent?.trim() || `小节 ${index + 1}` }
  })
  // MutationObserver 会高频触发，内容没变化时跳过赋值避免重复渲染
  if (JSON.stringify(items) !== JSON.stringify(tocItems.value)) tocItems.value = items
  updateActiveToc()
}

/** 标题元素相对滚动容器内容顶部的距离。 */
function tocTopOf(id: string): number | null {
  const container = mainRef.value
  const el = document.getElementById(id)
  if (!container || !el) return null
  return el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
}

/** 激活项 = 最后一个已滚过容器顶部（留 24px 余量）的标题，无命中时取第一项。 */
function updateActiveToc() {
  const container = mainRef.value
  if (!container || !tocItems.value.length) {
    activeTocId.value = ''
    return
  }
  if (Date.now() < tocSuppressUntil) return
  const scrollTop = container.scrollTop
  let current = tocItems.value[0].id
  for (const item of tocItems.value) {
    const top = tocTopOf(item.id)
    if (top !== null && top - 24 <= scrollTop + 2) current = item.id
  }
  activeTocId.value = current
}

// rAF 节流：scroll / DOM 变化每帧只处理一次
let tocRafId = 0
function scheduleTocUpdate() {
  if (tocRafId) return
  tocRafId = requestAnimationFrame(() => {
    tocRafId = 0
    updateActiveToc()
  })
}

let tocCollectRafId = 0
function scheduleTocCollect() {
  if (tocCollectRafId) return
  tocCollectRafId = requestAnimationFrame(() => {
    tocCollectRafId = 0
    collectToc()
  })
}

function scrollToToc(id: string) {
  const container = mainRef.value
  const top = tocTopOf(id)
  if (!container || top === null) return
  container.scrollTo({ top: Math.max(top - 24, 0), behavior: 'smooth' })
  tocSuppressUntil = Date.now() + 700
  activeTocId.value = id
}

// 切换页面后重新收集；页面组件是异步加载的，挂载后由 MutationObserver 兜底再收集一次
watch(activeId, async () => {
  tocItems.value = []
  activeTocId.value = ''
  // 浏览器后退/前进等 selectEntry 之外的切页入口也回到顶部
  mainRef.value?.scrollTo({ top: 0 })
  await nextTick()
  collectToc()
})

onMounted(() => {
  initTheme()
  syncFromHash()
  window.addEventListener('hashchange', syncFromHash)
  window.addEventListener('keydown', onGlobalKeydown)
  mainRef.value?.addEventListener('scroll', scheduleTocUpdate, { passive: true })
  if (contentRef.value) {
    tocObserver = new MutationObserver(scheduleTocCollect)
    tocObserver.observe(contentRef.value, { childList: true, subtree: true })
  }
  collectToc()
})

onUnmounted(() => {
  window.removeEventListener('hashchange', syncFromHash)
  window.removeEventListener('keydown', onGlobalKeydown)
  mainRef.value?.removeEventListener('scroll', scheduleTocUpdate)
  tocObserver?.disconnect()
  if (tocRafId) cancelAnimationFrame(tocRafId)
  if (tocCollectRafId) cancelAnimationFrame(tocCollectRafId)
})
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-white text-slate-900 dark:bg-[#0a0a0c] dark:text-[#f7f8f8]">
    <!-- 顶栏 -->
    <header class="z-40 shrink-0 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#0a0a0c]/85">
      <div class="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
        <button
          type="button"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden dark:border-white/[0.08] dark:text-[#a8adb7]"
          title="打开目录"
          aria-label="打开目录"
          @click="mobileNavOpen = true"
        >
          <i class="fa-solid fa-bars text-sm"></i>
        </button>
        <button type="button" class="flex min-w-0 items-center gap-3" @click="selectEntry('overview')">
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900">
            <img src="/logo.svg" alt="logo" class="h-5 w-5 brightness-0 invert" />
          </span>
          <span class="truncate text-sm font-bold">Base 组件库</span>
          <BaseTag size="xs" tone="neutral"><span class="font-mono">v{{ FRONTEND_VERSION }}</span></BaseTag>
          <BaseTag size="xs" tone="accent">{{ BASE_COMPONENT_COUNT }} 个组件</BaseTag>
        </button>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="hidden h-8 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs text-slate-500 transition-colors hover:bg-slate-100 md:flex dark:border-white/[0.08] dark:text-[#8a8f98] dark:hover:bg-white/[0.06]"
            @click="paletteOpen = true"
          >
            <i class="fa-solid fa-magnifying-glass text-[10px]"></i>
            快速跳转
            <BaseKbd keys="Ctrl+K" />
          </button>
          <!-- 移动端：搜索收成图标按钮，点击打开命令面板 -->
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 md:hidden dark:border-white/[0.08] dark:text-[#a8adb7] dark:hover:bg-white/[0.06]"
            title="搜索（Ctrl+K）"
            aria-label="搜索（Ctrl+K）"
            @click="paletteOpen = true"
          >
            <i class="fa-solid fa-magnifying-glass text-sm"></i>
          </button>
          <!-- 主题设置：强调色 + 明暗切换收进 Popover，移动端同样可用 -->
          <BasePopover align="right" width-class="w-64">
            <template #trigger="{ open }">
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-white/[0.08] dark:text-[#a8adb7] dark:hover:bg-white/[0.06]"
                :class="open ? 'bg-slate-100 dark:bg-white/[0.06]' : ''"
                title="主题设置"
                aria-label="主题设置"
                aria-haspopup="dialog"
                :aria-expanded="open"
              >
                <i class="fa-solid fa-palette text-sm"></i>
              </button>
            </template>
            <div class="grid gap-4">
              <div class="grid gap-2">
                <p class="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-[#62666d]">强调色</p>
                <div class="flex items-center gap-2">
                  <button
                    v-for="color in themeColors"
                    :key="color.id"
                    type="button"
                    class="h-6 w-6 rounded-full border-2 transition-transform hover:scale-110"
                    :class="accentColorId === color.id ? 'border-slate-900 dark:border-white' : 'border-transparent'"
                    :style="{ background: `rgb(${color.rgb.split(/\s+/).join(',')})` }"
                    :title="color.label"
                    :aria-label="`强调色：${color.label}`"
                    :aria-pressed="accentColorId === color.id"
                    @click="setAccentColor(color.id, $event.currentTarget as HTMLElement)"
                  ></button>
                </div>
              </div>
              <div class="grid gap-2">
                <p class="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-[#62666d]">外观</p>
                <div class="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    class="flex h-8 items-center justify-center gap-2 rounded-lg border text-xs font-semibold transition-colors"
                    :class="!isDark
                      ? 'accent-text border-[rgb(var(--accent-rgb)/0.5)] bg-[rgb(var(--accent-rgb)/0.08)]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/[0.08] dark:text-[#a8adb7] dark:hover:bg-white/[0.06]'"
                    aria-label="切换到浅色模式"
                    :aria-pressed="!isDark"
                    @click="setTheme(false, $event.currentTarget as HTMLElement)"
                  >
                    <i class="fa-solid fa-sun text-[11px]"></i>浅色
                  </button>
                  <button
                    type="button"
                    class="flex h-8 items-center justify-center gap-2 rounded-lg border text-xs font-semibold transition-colors"
                    :class="isDark
                      ? 'accent-text border-[rgb(var(--accent-rgb)/0.5)] bg-[rgb(var(--accent-rgb)/0.08)]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/[0.08] dark:text-[#a8adb7] dark:hover:bg-white/[0.06]'"
                    aria-label="切换到深色模式"
                    :aria-pressed="isDark"
                    @click="setTheme(true, $event.currentTarget as HTMLElement)"
                  >
                    <i class="fa-solid fa-moon text-[11px]"></i>深色
                  </button>
                </div>
              </div>
            </div>
          </BasePopover>
          <a
            :href="REPO_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-white/[0.08] dark:text-[#a8adb7] dark:hover:bg-white/[0.06]"
            title="GitHub 仓库"
            aria-label="GitHub 仓库"
          >
            <i class="fa-brands fa-github text-sm"></i>
          </a>
        </div>
      </div>
    </header>

    <div class="flex min-h-0 flex-1">
      <!-- 侧边栏：组件清单 -->
      <aside class="hidden w-64 shrink-0 flex-col border-r border-slate-200/80 dark:border-white/[0.06] lg:flex">
        <CatalogNav :active-id="activeId" @select="selectEntry" />
      </aside>

      <!-- 主内容：正文 + 右侧「本页目录」TOC（xl 以上显示） -->
      <main id="doc-main" ref="mainRef" class="min-w-0 flex-1 overflow-y-auto">
        <div class="mx-auto flex max-w-6xl gap-10 px-5 py-8 lg:px-10 xl:max-w-[88rem]">
          <div ref="contentRef" class="min-w-0 max-w-6xl flex-1">
          <template v-if="activeEntry">
            <div class="mb-8 grid gap-3 border-b border-slate-200/80 pb-6 dark:border-white/[0.06]">
              <h1 class="text-3xl font-bold tracking-tight text-slate-950 dark:text-[#f7f8f8]">{{ activeEntry.title }}</h1>
              <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">{{ activeEntry.description }}</p>
              <div v-if="activeEntry.components.length" class="flex flex-wrap gap-1.5">
                <BaseTag v-for="name in activeEntry.components" :key="name" size="xs" tone="neutral">
                  <span class="font-mono">{{ name }}</span>
                </BaseTag>
              </div>
            </div>
            <div class="grid gap-8">
              <component :is="activeEntry.page" />
              <ApiTable :components="activeEntry.components" />

              <!-- 相关组件交叉链接 -->
              <div v-if="relatedEntries.length" class="grid gap-2.5 border-t border-slate-200/80 pt-6 dark:border-white/[0.06]">
                <p class="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-[#62666d]">相关组件</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="entry in relatedEntries"
                    :key="entry.id"
                    type="button"
                    class="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-[rgb(var(--accent-rgb)/0.4)] hover:bg-[rgb(var(--accent-rgb)/0.06)] hover:text-[rgb(var(--accent-rgb))] dark:border-white/[0.08] dark:text-[#a8adb7] dark:hover:bg-[rgb(var(--accent-rgb)/0.1)] dark:hover:text-[rgb(var(--accent-hover-rgb))]"
                    @click="selectEntry(entry.id)"
                  >
                    {{ entry.title }}
                  </button>
                </div>
              </div>

              <!-- 底部翻页 -->
              <nav class="grid gap-3 border-t border-slate-200/80 pt-6 sm:grid-cols-2 dark:border-white/[0.06]">
                <button
                  v-if="pagerEntries.prev"
                  type="button"
                  class="group rounded-xl border border-slate-200 p-4 text-left transition-colors hover:border-[rgb(var(--accent-rgb)/0.4)] hover:bg-slate-50 dark:border-white/[0.08] dark:hover:bg-white/[0.03]"
                  @click="selectEntry(pagerEntries.prev.id)"
                >
                  <p class="text-xs text-slate-400 dark:text-[#62666d]"><i class="fa-solid fa-arrow-left mr-1 inline-block text-[10px] transition-transform group-hover:-translate-x-0.5"></i>上一篇</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-[#f7f8f8]">{{ pagerEntries.prev.title }}</p>
                </button>
                <span v-else></span>
                <button
                  v-if="pagerEntries.next"
                  type="button"
                  class="group rounded-xl border border-slate-200 p-4 text-right transition-colors hover:border-[rgb(var(--accent-rgb)/0.4)] hover:bg-slate-50 dark:border-white/[0.08] dark:hover:bg-white/[0.03]"
                  @click="selectEntry(pagerEntries.next.id)"
                >
                  <p class="text-xs text-slate-400 dark:text-[#62666d]">下一篇<i class="fa-solid fa-arrow-right ml-1 inline-block text-[10px] transition-transform group-hover:translate-x-0.5"></i></p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-[#f7f8f8]">{{ pagerEntries.next.title }}</p>
                </button>
              </nav>
            </div>
          </template>

          <template v-else>
            <div class="mb-8 grid gap-3 border-b border-slate-200/80 pb-6 dark:border-white/[0.06]">
              <h1 class="text-3xl font-bold tracking-tight text-slate-950 dark:text-[#f7f8f8]">Base 组件库</h1>
              <p class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">
                Headless UI + Tailwind 实现的自研基础组件库文档站。
              </p>
            </div>
            <OverviewPage />
          </template>

          <!-- 页脚：pager 之后的轻量收尾 -->
          <footer class="mt-10 flex flex-col gap-2 border-t border-slate-200/80 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.06] dark:text-[#62666d]">
            <p>Base 组件库 · 基于 Vue 3 + Tailwind CSS</p>
            <div class="flex items-center gap-4">
              <a
                :href="REPO_URL"
                target="_blank"
                rel="noopener noreferrer"
                class="transition-colors hover:text-slate-700 dark:hover:text-[#a8adb7]"
              >
                <i class="fa-brands fa-github mr-1 text-[11px]"></i>GitHub 仓库
              </a>
              <button type="button" class="transition-colors hover:text-slate-700 dark:hover:text-[#a8adb7]" @click="selectEntry('overview')">组件总览</button>
              <button type="button" class="transition-colors hover:text-slate-700 dark:hover:text-[#a8adb7]" @click="selectEntry('guide-start')">快速开始</button>
            </div>
          </footer>
          </div>

          <!-- 本页目录：切页后从正文 DOM 收集,滚动联动高亮 -->
          <aside v-if="tocItems.length" class="hidden w-48 shrink-0 xl:block">
            <nav class="sticky top-2" aria-label="本页目录">
              <p class="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-[#62666d]">本页目录</p>
              <div class="max-h-[calc(100vh-11rem)] overflow-y-auto border-l border-slate-200 dark:border-white/[0.08]">
                <button
                  v-for="item in tocItems"
                  :key="item.id"
                  type="button"
                  class="-ml-px block w-full truncate border-l-2 py-1 pl-3 text-left text-[13px] transition-colors"
                  :class="activeTocId === item.id
                    ? 'border-[rgb(var(--accent-rgb))] accent-text font-medium'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-[#8a8f98] dark:hover:text-[#d0d6e0]'"
                  @click="scrollToToc(item.id)"
                >
                  {{ item.text }}
                </button>
              </div>
            </nav>
          </aside>
        </div>
      </main>
    </div>

    <!-- 移动端目录抽屉 -->
    <BaseDrawer :open="mobileNavOpen" title="组件目录" placement="left" width-class="w-full max-w-xs" @close="mobileNavOpen = false">
      <div class="-mx-2 flex h-full flex-col">
        <CatalogNav :active-id="activeId" @select="selectEntry" />
      </div>
    </BaseDrawer>

    <BaseToastContainer :toasts="toasts" @dismiss="dismissToast" />
    <BaseCommandPalette
      v-model:open="paletteOpen"
      :items="paletteItems"
      placeholder="搜索组件或页面…"
      @select="onPaletteSelect"
    />
  </div>
</template>
