<script setup lang="ts">
/**
 * BaseColorPicker.vue
 * 颜色选择器：饱和度/明度面板 + 色相条 + hex 输入 + 预设色板（不含 alpha 通道）
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDropdownPosition } from '@/composables/useDropdownPosition'

interface Props {
  // 六位 hex，如 '#8173df'；空字符串表示未选择
  modelValue?: string
  presets?: string[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  presets: () => ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8173df', '#a855f7', '#ec4899'],
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const HEX_RE = /^#?[0-9a-fA-F]{6}$/

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const svRef = ref<HTMLElement | null>(null)
const hueRef = ref<HTMLElement | null>(null)
const open = ref(false)

// 弹层 Teleport 到 body，避免被祖先 overflow 裁剪
const { panelStyle, isOutside } = useDropdownPosition(open, triggerRef, panelRef)

// 内部工作色采用 HSV：面板拖拽天然对应 s/v 两轴，色相条对应 h
const hue = ref(0)
const sat = ref(1)
const bright = ref(1)

// hex 输入框的草稿值，回车/失焦校验通过才提交
const hexDraft = ref('')

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function hsvToHex(h: number, s: number, v: number) {
  const channel = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return '#' + [channel(5), channel(3), channel(1)]
    .map(x => Math.round(x * 255).toString(16).padStart(2, '0'))
    .join('')
}

function hexToHsv(hex: string) {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16) / 255
  const g = parseInt(value.slice(2, 4), 16) / 255
  const b = parseInt(value.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d) {
    if (max === r) h = 60 * (((g - b) / d) % 6)
    else if (max === g) h = 60 * ((b - r) / d + 2)
    else h = 60 * ((r - g) / d + 4)
  }
  if (h < 0) h += 360
  return { h, s: max === 0 ? 0 : d / max, v: max }
}

const currentHex = computed(() => hsvToHex(hue.value, sat.value, bright.value))

// 灰色（s=0）或黑色（v=0）时 hex 里不携带色相信息，保留当前 h/s 避免手柄跳变
function syncFromHex(hex: string) {
  const parsed = hexToHsv(hex)
  if (parsed.s > 0 && parsed.v > 0) hue.value = parsed.h
  if (parsed.v > 0) sat.value = parsed.s
  bright.value = parsed.v
}

watch(() => props.modelValue, value => {
  if (!value || !HEX_RE.test(value)) return
  // 内部拖拽回流的同值更新直接跳过，避免转换往返的舍入抖动
  if (value.toLowerCase() === currentHex.value.toLowerCase()) return
  syncFromHex(value)
}, { immediate: true })

watch(currentHex, value => {
  hexDraft.value = value
}, { immediate: true })

// ── 拖拽：pointer capture 保证移出面板后仍持续跟踪，松手才提交 change ──
let activeArea = ''

function applyPointer(area: string, event: PointerEvent) {
  const el = area === 'sv' ? svRef.value : hueRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = clamp01((event.clientX - rect.left) / rect.width)
  if (area === 'sv') {
    const y = clamp01((event.clientY - rect.top) / rect.height)
    sat.value = x
    bright.value = 1 - y
  } else {
    // 上限取 359：拖到最右端时保持在红色端，避免手柄回跳到 0 的位置
    hue.value = Math.min(359, Math.round(x * 360))
  }
  emit('update:modelValue', currentHex.value)
}

function onPointerDown(area: string, event: PointerEvent) {
  if (props.disabled) return
  activeArea = area
  event.preventDefault()
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  applyPointer(area, event)
}

function onPointerMove(area: string, event: PointerEvent) {
  if (activeArea !== area) return
  applyPointer(area, event)
}

function onPointerUp(area: string) {
  if (activeArea !== area) return
  activeArea = ''
  emit('change', currentHex.value)
}

function commit(hex: string) {
  emit('update:modelValue', hex)
  emit('change', hex)
}

function pickPreset(preset: string) {
  const hex = '#' + preset.replace('#', '').toLowerCase()
  syncFromHex(hex)
  commit(hex)
}

/** hex 输入确认：合法才提交，非法回退为当前工作色。 */
function confirmHexInput() {
  const raw = hexDraft.value.trim()
  if (HEX_RE.test(raw)) {
    const hex = '#' + raw.replace('#', '').toLowerCase()
    syncFromHex(hex)
    commit(hex)
    hexDraft.value = hex
  } else {
    hexDraft.value = currentHex.value
  }
}

function isPresetActive(preset: string) {
  return Boolean(props.modelValue) && preset.toLowerCase() === props.modelValue.toLowerCase()
}

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

// 空值时触发器色块显示斜线占位，区别于「选了白色」
const emptySwatchStyle = {
  backgroundImage: 'linear-gradient(135deg, transparent 44%, #94a3b8 44%, #94a3b8 56%, transparent 56%)',
}

const svPanelStyle = computed(() => ({
  backgroundImage: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue.value}, 100%, 50%))`,
}))

const hueBarStyle = {
  background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
}

// 点击触发器与弹层之外时收起（弹层已 Teleport，需同时排除两者）
function onDocPointerDown(event: PointerEvent) {
  if (!open.value) return
  if (isOutside(event.target)) open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointerDown)
})
</script>

<template>
  <div ref="rootRef" class="relative" @keydown="onKeydown">
    <button
      ref="triggerRef"
      type="button"
      :disabled="disabled"
      aria-haspopup="dialog"
      :aria-expanded="open"
      class="flex h-9 w-full items-center gap-2 rounded-md border bg-white px-3 text-left text-sm outline-none transition-colors dark:bg-white/[0.03]"
      :class="[
        open
          ? 'border-[rgb(var(--accent-rgb)/0.4)]'
          : 'border-slate-200 hover:border-slate-300 dark:border-white/[0.08] dark:hover:border-white/[0.16]',
        disabled ? 'cursor-not-allowed opacity-50 hover:border-slate-200 dark:hover:border-white/[0.08]' : '',
      ]"
      @click="toggle"
    >
      <span
        class="h-5 w-5 shrink-0 rounded border border-black/10 dark:border-white/20"
        :style="modelValue ? { backgroundColor: modelValue } : emptySwatchStyle"
      ></span>
      <span
        class="min-w-0 flex-1 truncate font-mono text-xs"
        :class="modelValue ? 'text-slate-800 dark:text-[#d0d6e0]' : 'text-slate-400 dark:text-[#62666d]'"
      >{{ modelValue || '选择颜色' }}</span>
      <i
        class="fa-solid fa-chevron-down shrink-0 text-[10px] text-slate-400 transition-transform duration-200 dark:text-[#62666d]"
        :class="open ? 'rotate-180' : ''"
      ></i>
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-1 opacity-0"
      >
        <div
          v-if="open"
          ref="panelRef"
          role="dialog"
          :style="panelStyle"
          class="grid w-64 select-none gap-3 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-lg shadow-slate-200/60 dark:border-white/[0.08] dark:bg-[#1f1f22] dark:shadow-black/40"
          @keydown="onKeydown"
        >
        <!-- 饱和度（横轴）/ 明度（纵轴）面板 -->
        <div
          ref="svRef"
          class="relative h-36 cursor-crosshair touch-none rounded-lg"
          :style="svPanelStyle"
          @pointerdown="onPointerDown('sv', $event)"
          @pointermove="onPointerMove('sv', $event)"
          @pointerup="onPointerUp('sv')"
          @pointercancel="onPointerUp('sv')"
        >
          <span
            class="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
            :style="{ left: `${sat * 100}%`, top: `${(1 - bright) * 100}%`, backgroundColor: currentHex }"
          ></span>
        </div>

        <!-- 色相条 -->
        <div
          ref="hueRef"
          class="relative h-3 cursor-pointer touch-none rounded-full"
          :style="hueBarStyle"
          @pointerdown="onPointerDown('hue', $event)"
          @pointermove="onPointerMove('hue', $event)"
          @pointerup="onPointerUp('hue')"
          @pointercancel="onPointerUp('hue')"
        >
          <span
            class="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
            :style="{ left: `${(hue / 360) * 100}%`, backgroundColor: `hsl(${hue}, 100%, 50%)` }"
          ></span>
        </div>

        <!-- 当前色预览 + hex 输入 -->
        <div class="flex items-center gap-2">
          <span
            class="h-8 w-8 shrink-0 rounded-md border border-black/10 dark:border-white/20"
            :style="{ backgroundColor: currentHex }"
          ></span>
          <input
            v-model="hexDraft"
            type="text"
            spellcheck="false"
            class="h-8 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 font-mono text-xs text-slate-700 outline-none transition-colors focus:border-[rgb(var(--accent-rgb)/0.4)] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-[#d0d6e0]"
            @blur="confirmHexInput"
            @keydown.enter="$event.target.blur()"
          />
        </div>

        <!-- 预设色板 -->
        <div v-if="presets.length" class="grid grid-cols-8 gap-1.5">
          <button
            v-for="preset in presets"
            :key="preset"
            type="button"
            :aria-label="preset"
            class="h-6 w-6 rounded border border-black/10 transition-transform hover:scale-110 dark:border-white/20"
            :class="isPresetActive(preset) ? 'ring-2 ring-[rgb(var(--accent-rgb)/0.6)] ring-offset-1 ring-offset-white dark:ring-offset-[#1f1f22]' : ''"
            :style="{ backgroundColor: preset }"
            @click="pickPreset(preset)"
          ></button>
        </div>
      </div>
      </Transition>
    </Teleport>
  </div>
</template>
