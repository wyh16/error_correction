<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseCodeBlock from '@/components/base/BaseCodeBlock.vue'

const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  // 可选的示例代码，传入后演示区下方出现常驻操作条（查看代码 / 复制代码）。
  code: { type: String, default: '' },
  codeTitle: { type: String, default: '' },
})

const codeOpen = ref(false)

// ── 复制代码 ──
const copied = ref(false)
let copiedTimer = 0

async function copyCode() {
  if (!props.code) return
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    window.clearTimeout(copiedTimer)
    copiedTimer = window.setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // 剪贴板不可用（非安全上下文等）时静默失败
  }
}

// ── 标题锚点 ──
// 由 title 生成 slug：字母数字与中文保留，空白折叠为 '-'，其余符号去除，供壳层 TOC 收集。
const anchorId = computed(() =>
  props.title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}\-_]/gu, ''),
)

// 点击 "#"：平滑滚动到标题处，并把带锚点的页面链接复制到剪贴板。
// 壳层使用 `#/page` 形式的 hash 路由，这里不直接改写 location.hash，避免触发路由切换。
function onAnchorClick() {
  const el = document.getElementById(anchorId.value)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const [base, route = ''] = window.location.href.split('#')
  const url = route ? `${base}#${route}#${anchorId.value}` : `${base}#${anchorId.value}`
  navigator.clipboard?.writeText(url).catch(() => {})
}
</script>

<template>
  <section class="grid gap-3">
    <div v-if="title || description" class="grid gap-1">
      <h3
        v-if="title"
        :id="anchorId"
        class="group flex scroll-mt-24 items-center gap-2 text-base font-bold text-slate-900 dark:text-[#f7f8f8]"
      >
        {{ title }}
        <a
          :href="`#${anchorId}`"
          class="accent-text text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          aria-label="复制本节锚点链接"
          @click.prevent="onAnchorClick"
        >#</a>
      </h3>
      <p v-if="description" class="text-sm leading-6 text-slate-500 dark:text-[#8a8f98]">{{ description }}</p>
    </div>
    <div class="rounded-xl border border-slate-200 transition-colors hover:border-slate-300 dark:border-white/[0.08] dark:hover:border-white/[0.16]">
      <div class="rounded-t-xl bg-white/80 p-6 dark:bg-white/[0.02]" :class="code ? '' : 'rounded-b-xl'">
        <slot />
      </div>
      <template v-if="code">
        <!-- 常驻操作条：左侧展开/收起，右侧复制代码 -->
        <div
          class="flex items-stretch justify-between overflow-hidden border-t border-slate-200 dark:border-white/[0.08]"
          :class="codeOpen ? '' : 'rounded-b-xl'"
        >
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:text-[#8a8f98] dark:hover:bg-white/[0.03] dark:hover:text-[#d0d6e0]"
            @click="codeOpen = !codeOpen"
          >
            <i class="fa-solid text-[10px]" :class="codeOpen ? 'fa-chevron-up' : 'fa-code'"></i>
            {{ codeOpen ? '收起代码' : '查看代码' }}
          </button>
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors"
            :class="copied
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-[#8a8f98] dark:hover:bg-white/[0.03] dark:hover:text-[#d0d6e0]'"
            @click="copyCode"
          >
            <i class="fa-solid text-[10px]" :class="copied ? 'fa-check' : 'fa-copy'"></i>
            {{ copied ? '已复制' : '复制代码' }}
          </button>
        </div>
        <!-- 平滑高度过渡：grid-rows 0fr -> 1fr，内层 overflow-hidden 负责裁切 -->
        <div
          class="grid transition-[grid-template-rows] duration-300 ease-in-out"
          :class="codeOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        >
          <div class="demo-code min-h-0 overflow-hidden rounded-b-xl">
            <div class="border-t border-slate-200 dark:border-white/[0.08]">
              <BaseCodeBlock :code="code" language="vue" :title="codeTitle" :copyable="true" />
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
/* 展开后完整展示代码：解除 BaseCodeBlock 内部 pre 的 max-h-72 限高 */
.demo-code :deep(pre) {
  max-height: none;
}
</style>
