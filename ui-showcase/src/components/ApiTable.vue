<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentApi } from '~/api-types'
import { API_INDEX } from '~/api-docs'

const props = defineProps({
  /** 组件名列表，按名字在 API_INDEX 中查询结构化文档 */
  components: { type: Array as () => string[], default: () => [] },
  /** 横向滚动容器内表头是否吸顶 */
  stickyHeader: { type: Boolean, default: false },
})

interface ApiSection {
  name: string
  anchorId: string
  api: ComponentApi | null
  empty: boolean
}

const sections = computed<ApiSection[]>(() =>
  props.components.map((name) => {
    const api = API_INDEX.get(name) || null
    const empty
      = !api
        || !(api.props?.length || api.emits?.length || api.slots?.length || api.exposes?.length)
    return { name, anchorId: `api-${name.toLowerCase()}`, api, empty }
  }),
)

// 点击 "#"：平滑滚动到标题处，并复制带锚点的页面链接（与 DemoBlock 行为一致）。
function onAnchorClick(anchorId: string) {
  const el = document.getElementById(anchorId)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const [base, route = ''] = window.location.href.split('#')
  const url = route ? `${base}#${route}#${anchorId}` : `${base}#${anchorId}`
  navigator.clipboard?.writeText(url).catch(() => {})
}

// ── 复用的表格样式（Tailwind 会扫描字符串常量中的类名） ──
const WRAP = 'overflow-x-auto rounded-xl border border-slate-200 dark:border-white/[0.08]'
const THEAD = 'border-b border-slate-200 bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.04]'
const TH = 'px-4 py-2.5 font-bold text-slate-700 dark:text-[#d0d6e0]'
const TR = 'border-b border-slate-100 align-top last:border-b-0 dark:border-white/[0.05]'
const TD = 'px-4 py-2.5 text-slate-600 dark:text-[#a8adb7]'
const NAME = 'whitespace-nowrap px-4 py-2.5 font-mono text-[13px] font-semibold text-slate-900 dark:text-[#f7f8f8]'
const CODE = 'rounded bg-pink-50 px-1.5 py-0.5 font-mono text-xs leading-6 text-pink-600 dark:bg-pink-400/10 dark:text-pink-400'
const SUB = 'text-sm font-semibold text-slate-900 dark:text-[#f7f8f8]'
</script>

<template>
  <section v-if="sections.length" class="grid gap-6">
    <h2 class="text-lg font-bold text-slate-950 dark:text-[#f7f8f8]">API</h2>

    <section v-for="section in sections" :key="section.name" class="grid gap-3">
      <!-- 组件名子标题：section > div > h3 结构与 DemoBlock 一致，供壳层 TOC 收集 -->
      <div class="grid gap-1">
        <h3
          :id="section.anchorId"
          class="group flex scroll-mt-24 items-center gap-2 font-mono text-base font-bold text-slate-900 dark:text-[#f7f8f8]"
        >
          {{ section.name }}
          <a
            :href="`#${section.anchorId}`"
            class="accent-text text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            aria-label="复制本节锚点链接"
            @click.prevent="onAnchorClick(section.anchorId)"
          >#</a>
        </h3>
      </div>

      <!-- 无任何文档数据 -->
      <div
        v-if="section.empty"
        class="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400 dark:border-white/[0.08] dark:text-[#62666d]"
      >
        暂无文档
      </div>

      <template v-else>
        <!-- 属性 -->
        <template v-if="section.api?.props?.length">
          <h4 :class="SUB">属性</h4>
          <div :class="WRAP">
            <table class="w-full min-w-[42rem] border-collapse text-left text-sm">
              <thead :class="stickyHeader ? 'sticky top-0 z-10' : ''">
                <tr :class="THEAD">
                  <th :class="TH" class="w-40">名称</th>
                  <th :class="TH">说明</th>
                  <th :class="TH">类型</th>
                  <th :class="TH" class="w-28">默认值</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in section.api.props" :key="row.name" :class="TR">
                  <td :class="NAME">{{ row.name }}</td>
                  <td :class="TD" class="leading-6">{{ row.desc }}</td>
                  <td :class="TD"><code :class="CODE">{{ row.type }}</code></td>
                  <td :class="TD" class="whitespace-nowrap font-mono text-xs leading-6">{{ row.default || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <!-- 事件 -->
        <template v-if="section.api?.emits?.length">
          <h4 :class="SUB">事件</h4>
          <div :class="WRAP">
            <table class="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead :class="stickyHeader ? 'sticky top-0 z-10' : ''">
                <tr :class="THEAD">
                  <th :class="TH" class="w-48">名称</th>
                  <th :class="TH">说明</th>
                  <th :class="TH">回调参数</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in section.api.emits" :key="row.name" :class="TR">
                  <td :class="NAME">{{ row.name }}</td>
                  <td :class="TD" class="leading-6">{{ row.desc }}</td>
                  <td :class="TD">
                    <code v-if="row.payload" :class="CODE">{{ row.payload }}</code>
                    <template v-else>—</template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <!-- 插槽 -->
        <template v-if="section.api?.slots?.length">
          <h4 :class="SUB">插槽</h4>
          <div :class="WRAP">
            <table class="w-full min-w-[28rem] border-collapse text-left text-sm">
              <thead :class="stickyHeader ? 'sticky top-0 z-10' : ''">
                <tr :class="THEAD">
                  <th :class="TH" class="w-48">名称</th>
                  <th :class="TH">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in section.api.slots" :key="row.name" :class="TR">
                  <td :class="NAME">{{ row.name }}</td>
                  <td :class="TD" class="leading-6">{{ row.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <!-- 方法 -->
        <template v-if="section.api?.exposes?.length">
          <h4 :class="SUB">方法</h4>
          <div :class="WRAP">
            <table class="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead :class="stickyHeader ? 'sticky top-0 z-10' : ''">
                <tr :class="THEAD">
                  <th :class="TH" class="w-48">名称</th>
                  <th :class="TH">说明</th>
                  <th :class="TH">签名</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in section.api.exposes" :key="row.name" :class="TR">
                  <td :class="NAME">{{ row.name }}</td>
                  <td :class="TD" class="leading-6">{{ row.desc }}</td>
                  <td :class="TD">
                    <code v-if="row.signature" :class="CODE">{{ row.signature }}</code>
                    <template v-else>—</template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
    </section>
  </section>
</template>
