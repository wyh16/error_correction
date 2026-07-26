import { ref, type Ref } from 'vue'

// 模块级单例状态：全站图片预览共用同一个弹窗实例。
const modalOpen = ref(false)
const modalSrc = ref('')
const modalScale = ref(1)

export interface UseImageModalReturn {
  modalOpen: Ref<boolean>
  modalSrc: Ref<string>
  modalScale: Ref<number>
  openModal: (src: string | null | undefined) => void
  closeModal: () => void
}

/**
 * 打开图片预览。滚动锁由 ImageModal 内部的 useOverlay 统一管理（引用计数），
 * 这里不再直接操作 body.style.overflow，避免破坏锁计数。
 */
const openModal = (src: string | null | undefined): void => {
  modalSrc.value = src || ''
  modalScale.value = 1
  modalOpen.value = !!src
}

/**
 * 关闭图片预览，并恢复缩放状态。
 */
const closeModal = (): void => {
  modalOpen.value = false
  modalSrc.value = ''
  modalScale.value = 1
}

/**
 * useImageModal — 图片预览弹窗单例 composable
 * 任何组件调用 useImageModal() 都操作同一个弹窗实例
 */
export function useImageModal(): UseImageModalReturn {
  return { modalOpen, modalSrc, modalScale, openModal, closeModal }
}
