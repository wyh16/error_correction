<script setup lang="ts">
/**
 * BaseHighlight.vue
 * 关键词高亮：把文本中命中的关键词片段用高亮样式标出。
 */
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  // 单个关键词或关键词数组
  keywords: { type: [String, Array], default: '' },
  caseSensitive: { type: Boolean, default: false },
  highlightClass: { type: String, default: 'accent-bg-soft accent-text rounded px-0.5' },
})

// 转义正则元字符，保证关键词按字面匹配（如 'C++'、'1.5'）
function escapeRegExp(word) {
  return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const segments = computed(() => {
  const list = (Array.isArray(props.keywords) ? props.keywords : [props.keywords])
    .map(word => String(word).trim())
    .filter(Boolean)
  // 去重后按长度降序：让「数学题」优先于「数学」命中，避免长词被拆碎
  const unique = [...new Set(list)].sort((a, b) => b.length - a.length)
  if (!unique.length || !props.text) return [{ text: props.text, hit: false }]
  const pattern = new RegExp(`(${unique.map(escapeRegExp).join('|')})`, props.caseSensitive ? 'g' : 'gi')
  // split 保留捕获组：奇数下标一定是命中片段，据此打标记
  return props.text
    .split(pattern)
    .map((part, index) => ({ text: part, hit: index % 2 === 1 }))
    .filter(segment => segment.text)
})
</script>

<template>
  <span>
    <template v-for="(segment, index) in segments" :key="index">
      <span v-if="segment.hit" :class="highlightClass">{{ segment.text }}</span>
      <template v-else>{{ segment.text }}</template>
    </template>
  </span>
</template>
