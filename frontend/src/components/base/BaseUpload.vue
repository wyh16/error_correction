<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseFieldMessage from './BaseFieldMessage.vue'

export interface UploadRejection {
  file: File
  reason: 'size' | 'count'
}

interface Props {
  modelValue?: File[]
  label?: string
  description?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  maxSize?: number
  maxCount?: number
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  label: '',
  description: '',
  accept: '',
  multiple: true,
  disabled: false,
  maxSize: 0,
  maxCount: 0,
  error: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', files: File[]): void
  (e: 'change', files: File[], event?: Event): void
  (e: 'reject', rejected: UploadRejection[]): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)

const acceptText = computed(() => props.accept || 'Any file type')

function openDialog() {
  if (props.disabled) return
  fileInput.value?.click()
}

function normalize(fileList: FileList | File[] | null) {
  const files = Array.from(fileList || [])
  const accepted: File[] = []
  const rejected: UploadRejection[] = []

  files.forEach((file) => {
    if (props.maxSize && file.size > props.maxSize) rejected.push({ file, reason: 'size' })
    else accepted.push(file)
  })

  // maxCount 限制总数量：超出剩余容量的文件按 count 原因拒绝
  let kept = accepted
  if (props.maxCount > 0) {
    const capacity = Math.max(props.maxCount - (props.multiple ? props.modelValue.length : 0), 0)
    kept = accepted.slice(0, capacity)
    accepted.slice(capacity).forEach(file => rejected.push({ file, reason: 'count' }))
  }

  if (rejected.length) emit('reject', rejected)
  return props.multiple ? [...props.modelValue, ...kept] : kept.slice(0, 1)
}

function commit(fileList: FileList | File[] | null, event?: Event) {
  if (props.disabled) return
  const next = normalize(fileList)
  emit('update:modelValue', next)
  emit('change', next, event)
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  commit(target.files, event)
  target.value = ''
}

function onDrop(event: DragEvent) {
  dragging.value = false
  commit(event.dataTransfer?.files ?? null, event)
}

function remove(index: number) {
  if (props.disabled) return
  const next = props.modelValue.filter((_, itemIndex) => itemIndex !== index)
  emit('update:modelValue', next)
  emit('change', next)
}

function formatSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}
</script>

<template>
  <div>
    <label v-if="label" class="mb-2 block text-sm font-medium text-gray-700 dark:text-white/60">{{ label }}</label>
    <div
      class="group flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed px-5 py-6 text-center transition-colors"
      :class="[
        dragging ? 'accent-border accent-bg-muted' : 'border-gray-300 bg-white/60 hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.025] dark:hover:bg-white/[0.04]',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        error ? 'border-rose-500/50' : '',
      ]"
      role="button"
      tabindex="0"
      @click="openDialog"
      @keydown.enter.prevent="openDialog"
      @keydown.space.prevent="openDialog"
      @dragenter.prevent="!disabled && (dragging = true)"
      @dragover.prevent="!disabled && (dragging = true)"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <input ref="fileInput" class="hidden" type="file" :accept="accept" :multiple="multiple" :disabled="disabled" @change="onInput" />
      <i class="fa-solid fa-cloud-arrow-up text-xl text-slate-400 transition-colors group-hover:text-slate-500 dark:text-[#62666d] dark:group-hover:text-[#8a8f98]"></i>
      <p class="mt-3 text-sm font-medium text-slate-700 dark:text-[#d0d6e0]">
        Drop files here or browse
      </p>
      <p class="mt-1 text-xs text-slate-500 dark:text-[#8a8f98]">
        {{ description || acceptText }}
      </p>
    </div>

    <div v-if="modelValue.length" class="mt-3 space-y-2">
      <div
        v-for="(file, index) in modelValue"
        :key="`${file.name}-${file.size}-${index}`"
        class="flex min-h-10 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/[0.08] dark:bg-white/[0.035]"
      >
        <i class="fa-regular fa-file-lines shrink-0 text-slate-400 dark:text-[#62666d]"></i>
        <span class="min-w-0 flex-1 truncate text-slate-700 dark:text-[#d0d6e0]">{{ file.name }}</span>
        <span class="shrink-0 text-xs text-slate-400 dark:text-[#62666d]">{{ formatSize(file.size) }}</span>
        <button type="button" class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-[#d0d6e0]" :disabled="disabled" @click.stop="remove(index)">
          <i class="fa-solid fa-xmark text-xs"></i>
        </button>
      </div>
    </div>

    <BaseFieldMessage v-if="error" :message="error" type="error" />
  </div>
</template>
