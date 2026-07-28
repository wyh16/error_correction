<script setup lang="ts">
import { computed } from 'vue'
import BaseCopyButton from './BaseCopyButton.vue'

interface Props {
  code?: string
  language?: string
  title?: string
  copyable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  language: 'text',
  title: '',
  copyable: true,
})

// —— 轻量语法高亮(零依赖)——
// 流程:整段 HTML 转义(必须最先做,防 XSS)→ 注释/字符串抽取为占位符
// → 数字/标签/属性/关键字着色 → 回填占位符。语言未知或任一步异常都降级为纯转义文本。

type LangFamily = 'js' | 'json' | 'html' | 'vue' | 'css' | 'shell'

const LANG_ALIAS: Record<string, LangFamily> = {
  js: 'js',
  jsx: 'js',
  mjs: 'js',
  cjs: 'js',
  javascript: 'js',
  ts: 'js',
  tsx: 'js',
  typescript: 'js',
  json: 'json',
  jsonc: 'json',
  html: 'html',
  xml: 'html',
  svg: 'html',
  vue: 'vue',
  css: 'css',
  scss: 'css',
  less: 'css',
  sh: 'shell',
  bash: 'shell',
  shell: 'shell',
  zsh: 'shell',
}

// 注释/字符串抽取正则:作用于转义后的文本,因此引号写作 &quot; / &#39;,尖括号写作 &lt; / &gt;
const LITERAL_RE: Record<LangFamily, RegExp> = {
  js: /\/\*[\s\S]*?\*\/|\/\/[^\n]*|`(?:\\`|\\\\|[\s\S])*?`|&#39;(?:\\&#39;|\\\\|[^\n])*?&#39;|&quot;(?:\\&quot;|\\\\|[^\n])*?&quot;/g,
  json: /\/\*[\s\S]*?\*\/|\/\/[^\n]*|&quot;(?:\\&quot;|\\\\|[^\n])*?&quot;/g,
  html: /&lt;!--[\s\S]*?--&gt;|&#39;(?:\\&#39;|\\\\|[^\n])*?&#39;|&quot;(?:\\&quot;|\\\\|[^\n])*?&quot;/g,
  vue: /&lt;!--[\s\S]*?--&gt;|\/\*[\s\S]*?\*\/|\/\/[^\n]*|`(?:\\`|\\\\|[\s\S])*?`|&#39;(?:\\&#39;|\\\\|[^\n])*?&#39;|&quot;(?:\\&quot;|\\\\|[^\n])*?&quot;/g,
  css: /\/\*[\s\S]*?\*\/|&#39;(?:\\&#39;|\\\\|[^\n])*?&#39;|&quot;(?:\\&quot;|\\\\|[^\n])*?&quot;/g,
  shell: /(?:^|\s)#[^\n]*|&#39;(?:\\&#39;|\\\\|[^\n])*?&#39;|&quot;(?:\\&quot;|\\\\|[^\n])*?&quot;/gm,
}

const JS_KEYWORD_RE =
  /\b(?:abstract|any|as|async|await|boolean|break|case|catch|class|const|continue|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|infer|instanceof|interface|keyof|let|namespace|never|new|null|number|of|private|protected|public|readonly|return|satisfies|set|static|string|super|switch|this|throw|true|try|type|typeof|undefined|unknown|var|void|while|yield)\b/g

const JSON_KEYWORD_RE = /\b(?:true|false|null)\b/g

// 前置字符不允许是字母/数字/$/./占位符哨兵,避免匹配到标识符尾部或占位符编号
const NUM_RE = /(^|[^\w$.\u0000])(0[xXbBoO][\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g
const TAG_RE = /(&lt;\/?)([A-Za-z][\w.-]*)/g
// 属性名要求紧跟 ="...",此时引号值已变成字符串占位符,可与 JS 赋值区分开
const ATTR_RE = /(^|\s)([@:#]?[A-Za-z_][\w-]*(?:[:.][\w-]+)*)(?==\u0000)/g
const PLACEHOLDER_RE = /\u0000(\d+)\u0000/g

function escapeHtml(source: string): string {
  return source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function literalClass(match: string): string {
  const text = match.trimStart()
  if (text.startsWith('//') || text.startsWith('/*') || text.startsWith('&lt;!--') || text.startsWith('#')) {
    return 'tok-cmt'
  }
  return 'tok-str'
}

function highlight(code: string, language: string): string {
  // 第一步必须整体转义,后续所有正则只作用于安全文本;\u0000 作占位符哨兵,先从原文剔除
  const escaped = escapeHtml(code).replace(/\u0000/g, '')
  const family = LANG_ALIAS[(language || '').trim().toLowerCase()]
  if (!family) return escaped
  try {
    const stash: string[] = []
    const put = (cls: string, text: string): string => {
      stash.push(`<span class="${cls}">${text}</span>`)
      return `\u0000${stash.length - 1}\u0000`
    }
    // 1. 注释与字符串先占位,避免其内部的关键字/数字/标签被误染色
    let work = escaped.replace(LITERAL_RE[family], (match) => put(literalClass(match), match))
    // 2. 数字
    work = work.replace(NUM_RE, (_m, pre: string, num: string) => pre + put('tok-num', num))
    // 3. 标签名与属性名(html / vue)
    if (family === 'html' || family === 'vue') {
      work = work.replace(TAG_RE, (_m, bracket: string, name: string) => bracket + put('tok-tag', name))
      work = work.replace(ATTR_RE, (_m, pre: string, name: string) => pre + put('tok-attr', name))
    }
    // 4. 关键字
    const keywordRe =
      family === 'js' || family === 'vue' ? JS_KEYWORD_RE : family === 'json' ? JSON_KEYWORD_RE : null
    if (keywordRe) work = work.replace(keywordRe, (match) => put('tok-kw', match))
    // 5. 回填占位符(stash 内容均为已转义的安全 HTML)
    return work.replace(PLACEHOLDER_RE, (_m, index: string) => stash[Number(index)] ?? '')
  } catch {
    return escaped
  }
}

const highlightedCode = computed(() => highlight(props.code, props.language))
</script>

<template>
  <div
    class="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-slate-800 shadow-sm dark:border-white/[0.08] dark:bg-slate-950 dark:text-slate-100"
  >
    <div
      v-if="title || language || copyable"
      class="flex min-h-10 items-center justify-between gap-3 border-b border-slate-200 px-3 dark:border-white/[0.08]"
    >
      <div class="min-w-0">
        <p v-if="title" class="truncate text-xs font-bold text-slate-700 dark:text-slate-200">{{ title }}</p>
        <p v-else class="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">{{ language }}</p>
      </div>
      <BaseCopyButton v-if="copyable" :text="code" />
    </div>
    <!-- highlightedCode 已整体 HTML 转义,v-html 只会插入本组件生成的 span,无 XSS 风险 -->
    <pre class="custom-scrollbar max-h-72 overflow-auto p-4 text-xs leading-6"><code v-html="highlightedCode"></code></pre>
  </div>
</template>

<style>
/* 语法高亮配色:浅色为 GitHub Light,暗色为 GitHub Dark。
   v-html 注入的节点不带 scoped 属性,故此处使用非 scoped 样式(tok- 前缀避免污染)。 */
.tok-cmt {
  color: #57606a;
}
.tok-str {
  color: #0a3069;
}
.tok-kw {
  color: #cf222e;
}
.tok-tag {
  color: #116329;
}
.tok-attr {
  color: #0550ae;
}
.tok-num {
  color: #0550ae;
}

.dark .tok-cmt {
  color: #8b949e;
}
.dark .tok-str {
  color: #a5d6ff;
}
.dark .tok-kw {
  color: #ff7b72;
}
.dark .tok-tag {
  color: #7ee787;
}
.dark .tok-attr {
  color: #79c0ff;
}
.dark .tok-num {
  color: #79c0ff;
}
</style>
