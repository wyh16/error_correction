import { ref, nextTick, watch, type Ref } from 'vue'
import * as api from '@/api/index'
import { useRoute, useRouter, type Router, type RouteLocationNormalizedLoaded } from 'vue-router'
import type { ChatSession, Id } from '@/types/domain'
type ToastFn = (type: string, message: string) => void
type ViewRef = Ref<string>

const aiChatSessions = ref<ChatSession[]>([])
const activeAiChatId = ref<Id | null>(null)
const chatMenuOpenId = ref<Id | null>(null)
const renamingChatId = ref<Id | null>(null)
const renameText = ref('')

let pushToastFn: ToastFn | null = null
let routerRef: Router | null = null
let routeRef: RouteLocationNormalizedLoaded | null = null
let routeSyncInitialized = false

const toast = (type: string, message: string) => {
  if (typeof pushToastFn === 'function') pushToastFn(type, message)
}

export function useAiChatSessions(pushToast?: ToastFn | null) {
  if (pushToast) pushToastFn = pushToast
  if (!routerRef) routerRef = useRouter()
  if (!routeRef) routeRef = useRoute()

  if (!routeSyncInitialized) {
    routeSyncInitialized = true

    watch(
      () => [routeRef.params.view, routeRef.params.subview],
      ([view, sub]) => {
        if (view !== 'ai-chat') return
        const id = sub ? String(sub) : null
        const cur = activeAiChatId.value != null ? String(activeAiChatId.value) : null
        if (id && id !== cur) activeAiChatId.value = id
        if (!id && cur) routerRef?.replace(`/app/ai-chat/${cur}`)
      },
      { immediate: true },
    )

    watch(activeAiChatId, (id) => {
      if (!routeRef || !routerRef) return
      if (routeRef.params.view !== 'ai-chat') return
      const next = id != null ? String(id) : null
      const cur = routeRef.params.subview ? String(routeRef.params.subview) : null
      if (!next && cur) routerRef.replace('/app/ai-chat')
      if (next && cur !== next) routerRef.replace(`/app/ai-chat/${next}`)
    })
  }

  async function loadAiChatSessions() {
    try {
      const data = await api.fetchMyChatSessions({ limit: 50 })
      aiChatSessions.value = data.sessions || []
    } catch (_) {}
  }

  async function createAiChat(currentViewRef?: ViewRef | null) {
    try {
      const session = await api.createIndependentChat('新对话')
      aiChatSessions.value.unshift(session)
      activeAiChatId.value = session.id
      if (currentViewRef && currentViewRef.value !== 'ai-chat') {
        currentViewRef.value = 'ai-chat'
      }
    } catch (e) {
      toast('error', e instanceof Error ? e.message : String(e))
    }
  }

  function selectAiChat(s: ChatSession, currentViewRef?: ViewRef | null) {
    activeAiChatId.value = s.id
    if (currentViewRef && currentViewRef.value !== 'ai-chat') {
      currentViewRef.value = 'ai-chat'
    }
  }

  async function onAiChatTitleUpdated(sessionId: Id, title: string) {
    const s = aiChatSessions.value.find((s) => s.id === sessionId)
    if (s && s.title === '新对话') {
      s.title = title
      try { await api.updateChatTitle(sessionId, title) } catch (_) {}
    }
  }

  function toggleChatMenu(id: Id) {
    chatMenuOpenId.value = chatMenuOpenId.value === id ? null : id
  }

  function closeChatMenu() {
    chatMenuOpenId.value = null
  }

  async function startRenameChat(s: ChatSession) {
    chatMenuOpenId.value = null
    renamingChatId.value = s.id
    renameText.value = s.title
    await nextTick()
    const input = document.querySelector<HTMLInputElement>('input[data-rename-input]')
    if (input) { input.focus(); input.selectionStart = input.selectionEnd = input.value.length }
  }

  async function confirmRenameChat(s: ChatSession) {
    const title = renameText.value.trim()
    if (title && title !== s.title) {
      try {
        await api.updateChatTitle(s.id, title)
        s.title = title
      } catch (e) {
        toast('error', e instanceof Error ? e.message : String(e))
      }
    }
    renamingChatId.value = null
  }

  async function deleteAiChat(id: Id) {
    try {
      await api.deleteChat(id)
      aiChatSessions.value = aiChatSessions.value.filter((s) => s.id !== id)
      if (activeAiChatId.value === id) activeAiChatId.value = null
    } catch (e) {
      toast('error', e instanceof Error ? e.message : String(e))
    }
  }

  return {
    aiChatSessions, activeAiChatId,
    chatMenuOpenId, renamingChatId, renameText,
    loadAiChatSessions, createAiChat, selectAiChat,
    onAiChatTitleUpdated, toggleChatMenu, closeChatMenu,
    startRenameChat, confirmRenameChat, deleteAiChat,
  }
}

