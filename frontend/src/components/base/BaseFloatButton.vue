<script setup lang="ts">
/**
 * BaseFloatButton.vue
 * 悬浮操作按钮（FAB）：固定在视口角落，支持徽标、气泡提示与向上展开的子菜单。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  // 主按钮图标
  icon: { type: String, default: 'fa-plus' },
  // accent | emerald | amber | rose | blue，主按钮实心底色
  tone: { type: String, default: 'accent' },
  // 距视口右侧 / 底部的偏移（px）
  position: { type: Object, default: () => ({ right: 24, bottom: 24 }) },
  // 悬停主按钮时左侧的气泡提示文字
  tooltip: { type: String, default: '' },
  // 子菜单项：{ icon, label, value }，非空时点击主按钮切换展开
  menu: { type: Array, default: () => [] },
  // 右上角徽标数字，0 不显示，超过 99 显示 99+
  badge: { type: Number, default: 0 },
})

const emit = defineEmits(['click', 'select'])

const toneClass = {
  accent: 'accent-bg',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  blue: 'bg-blue-500',
}

const rootRef = ref(null)
const open = ref(false)
const hovering = ref(false)
// 当前悬停的子菜单项下标，-1 表示无
const hoverIndex = ref(-1)

const hasMenu = computed(() => props.menu.length > 0)
const badgeText = computed(() => (props.badge > 99 ? '99+' : String(props.badge)))

const rootStyle = computed(() => ({
  right: `${props.position?.right ?? 24}px`,
  bottom: `${props.position?.bottom ?? 24}px`,
}))

function handleMainClick() {
  if (hasMenu.value) {
    open.value = !open.value
  } else {
    emit('click')
  }
}

function handleSelect(item) {
  emit('select', item)
  open.value = false
}

/** 点击组件区域外时收起菜单。 */
function onDocumentClick(event) {
  if (!open.value) return
  if (rootRef.value && !rootRef.value.contains(event.target)) open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <Teleport to="body">
    <!-- 根节点固定在视口角落；列以 bottom 锚定，菜单向上展开不影响主按钮位置 -->
    <div ref="rootRef" class="fixed z-50 flex flex-col items-center gap-2.5" :style="rootStyle">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div v-if="open" class="flex flex-col items-center gap-2.5">
          <div v-for="(item, index) in props.menu" :key="item.value ?? index" class="relative">
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-colors hover:text-[rgb(var(--accent-rgb))] dark:border-white/[0.08] dark:bg-[#1f1f22] dark:text-[#d0d6e0] dark:hover:text-[rgb(var(--accent-hover-rgb))]"
              :aria-label="item.label"
              @mouseenter="hoverIndex = index"
              @mouseleave="hoverIndex = -1"
              @click="handleSelect(item)"
            >
              <i class="fa-solid text-sm" :class="item.icon"></i>
            </button>
            <!-- 子项 label 气泡 -->
            <div
              class="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900/90 px-2 py-1 text-xs text-white transition-all duration-150"
              :class="hoverIndex === index ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </Transition>

      <div class="relative">
        <button
          type="button"
          class="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg shadow-black/15 transition-all duration-200 hover:scale-105 active:scale-95"
          :class="toneClass[props.tone] || toneClass.accent"
          :aria-expanded="hasMenu ? open : undefined"
          @mouseenter="hovering = true"
          @mouseleave="hovering = false"
          @click="handleMainClick"
        >
          <!-- 有菜单时展开态图标旋转 45°（fa-plus 变关闭叉）暗示可收起 -->
          <i class="fa-solid transition-transform duration-200" :class="[props.icon, open ? 'rotate-45' : '']"></i>
        </button>

        <span
          v-if="props.badge > 0"
          class="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white"
        >
          {{ badgeText }}
        </span>

        <!-- 主按钮气泡提示：自绘而非 BaseTooltip，fixed 容器内相对定位更可控 -->
        <div
          v-if="props.tooltip"
          class="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900/90 px-2 py-1 text-xs text-white transition-all duration-150"
          :class="hovering && !open ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'"
        >
          {{ props.tooltip }}
        </div>
      </div>
    </div>
  </Teleport>
</template>
