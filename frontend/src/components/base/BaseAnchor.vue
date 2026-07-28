<script setup lang="ts">
/**
 * BaseAnchor.vue
 * 页内锚点导航（TOC）：滚动联动高亮当前章节，点击平滑滚动到目标位置。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  // 锚点项：{ href: '#id', title, children? }，children 只支持一层
  items: { type: Array, default: () => [] },
  // 激活判定与点击滚动的顶部偏移（px）
  offset: { type: Number, default: 0 },
  // 滚动容器选择器，为空时监听 window
  target: { type: String, default: '' },
})

const emit = defineEmits(['change'])

const navRef = ref(null)
const activeHref = ref('')
// 左侧墨条位置：跟随激活项按钮的实测 offsetTop / offsetHeight
const inkStyle = ref({ top: '0px', height: '0px', opacity: '0' })

// 当前监听的滚动目标：HTMLElement 或 window
let scrollTarget = null
// 点击平滑滚动期间暂停 scroll 联动，避免中途扫过的章节抢走高亮
let suppressUntil = 0

// 展平父子两级并保持文档顺序，激活判定统一处理
const flatItems = computed(() => {
  const list = []
  for (const item of props.items) {
    list.push(item)
    for (const child of item.children || []) list.push(child)
  }
  return list
})

function getScrollTop() {
  return scrollTarget === window ? window.scrollY : scrollTarget.scrollTop
}

/** 计算 href 目标元素相对滚动容器内容顶部的距离。 */
function topOf(href) {
  const el = href ? document.querySelector(href) : null
  if (!el) return null
  if (scrollTarget === window) return el.getBoundingClientRect().top + window.scrollY
  // 容器模式：视口坐标差 + 容器已滚距离 = 元素在容器内容中的位置
  return el.getBoundingClientRect().top - scrollTarget.getBoundingClientRect().top + scrollTarget.scrollTop
}

/** 激活项 = 最后一个已滚过顶部（含 offset 与 2px 容差）的锚点，无命中时取第一项。 */
function update() {
  if (!scrollTarget || !flatItems.value.length) return
  if (Date.now() < suppressUntil) return
  const scrollTop = getScrollTop()
  let current = flatItems.value[0].href
  for (const item of flatItems.value) {
    const top = topOf(item.href)
    if (top !== null && top - props.offset <= scrollTop + 2) current = item.href
  }
  setActive(current)
}

function setActive(href) {
  if (activeHref.value !== href) {
    activeHref.value = href
    emit('change', href)
  }
  moveInk()
}

/** 墨条对齐当前激活按钮；没有可对齐目标时收起。 */
async function moveInk() {
  await nextTick()
  const el = navRef.value?.querySelector(`[data-href="${activeHref.value}"]`)
  if (!el) {
    inkStyle.value = { top: '0px', height: '0px', opacity: '0' }
    return
  }
  inkStyle.value = { top: `${el.offsetTop}px`, height: `${el.offsetHeight}px`, opacity: '1' }
}

function handleClick(href) {
  if (!scrollTarget) return
  const top = topOf(href)
  if (top === null) return
  scrollTarget.scrollTo({ top: Math.max(top - props.offset, 0), behavior: 'smooth' })
  // 平滑滚动期间由点击直接决定高亮，不等滚动结束
  suppressUntil = Date.now() + 700
  setActive(href)
}

function detach() {
  scrollTarget?.removeEventListener('scroll', update)
  scrollTarget = null
}

/** 解析滚动容器并挂监听；target 选择器找不到元素时退回 window。 */
function attach() {
  detach()
  scrollTarget = props.target ? document.querySelector(props.target) || window : window
  scrollTarget.addEventListener('scroll', update, { passive: true })
  update()
}

onMounted(async () => {
  // 等一帧再查询，确保同页面渲染出的容器和锚点目标已经挂载
  await nextTick()
  attach()
  window.addEventListener('resize', update)
})

watch(() => props.target, async () => {
  await nextTick()
  attach()
})

watch(() => props.items, async () => {
  await nextTick()
  update()
  moveInk()
}, { deep: true })

onBeforeUnmount(() => {
  detach()
  window.removeEventListener('resize', update)
})
</script>

<template>
  <nav ref="navRef" class="relative border-l border-slate-200 dark:border-white/[0.08]">
    <!-- 激活墨条：盖在左边框上，位置随激活项平滑移动 -->
    <span
      class="accent-bg absolute -left-px w-0.5 rounded-full transition-all duration-200"
      :style="inkStyle"
      aria-hidden="true"
    ></span>
    <template v-for="item in props.items" :key="item.href">
      <button
        type="button"
        :data-href="item.href"
        class="block w-full truncate py-1 pl-3 text-left text-[13px] transition-colors"
        :class="activeHref === item.href
          ? 'accent-text font-medium'
          : 'text-slate-500 hover:text-slate-800 dark:text-[#8a8f98] dark:hover:text-[#d0d6e0]'"
        @click="handleClick(item.href)"
      >
        {{ item.title }}
      </button>
      <button
        v-for="child in item.children || []"
        :key="child.href"
        type="button"
        :data-href="child.href"
        class="block w-full truncate py-1 pl-6 text-left text-[13px] transition-colors"
        :class="activeHref === child.href
          ? 'accent-text font-medium'
          : 'text-slate-500 hover:text-slate-800 dark:text-[#8a8f98] dark:hover:text-[#d0d6e0]'"
        @click="handleClick(child.href)"
      >
        {{ child.title }}
      </button>
    </template>
  </nav>
</template>
