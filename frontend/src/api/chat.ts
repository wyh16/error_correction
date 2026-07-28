import { assertJsonSuccess, buildModelBody } from './client'
import type { ChatMessage, ChatSession, Id } from '@/types/domain'

type ChatMessageListOptions = {
  limit?: number
  beforeId?: Id | null
}

type StreamChatOptions = {
  deepThink?: boolean
  providerSource?: string
  providerId?: Id | null
  contextRefs?: Array<Id | Record<string, unknown>>
}

type ChatSessionQueryParams = {
  page?: number
  limit?: number
}

export async function fetchChatSessions(questionId: Id) {
  const resp = await fetch(`/api/question/${questionId}/chats`)
  const data = await assertJsonSuccess<{ success: true; sessions: ChatSession[] }>(resp, '获取对话列表失败')
  return data.sessions
}

export async function createChat(questionId: Id) {
  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question_id: questionId }),
  })
  const data = await assertJsonSuccess<{ success: true; session: ChatSession }>(resp, '创建对话失败')
  return data.session
}

export async function fetchMessages(sessionId: Id, { limit = 30, beforeId }: ChatMessageListOptions = {}) {
  const qs = new URLSearchParams({ limit: String(limit) })
  if (beforeId) qs.set('before_id', String(beforeId))
  const resp = await fetch(`/api/chat/${sessionId}/messages?${qs}`)
  const data = await assertJsonSuccess<{ success: true; messages: ChatMessage[]; hasMore: boolean }>(resp, '获取消息失败')
  return { messages: data.messages, hasMore: data.hasMore }
}

export async function streamChat(
  sessionId: Id,
  message: string,
  modelProvider = 'openai',
  signal?: AbortSignal,
  modelName?: string,
  { deepThink = false, providerSource, providerId, contextRefs = [] }: StreamChatOptions = {},
) {
  const opts: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildModelBody(modelProvider, modelName, providerSource, providerId, { message, deep_think: deepThink, context_refs: contextRefs })),
  }
  if (signal) opts.signal = signal
  return fetch(`/api/chat/${sessionId}/stream`, opts)
}

export async function createIndependentChat(title = '新对话') {
  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  const data = await assertJsonSuccess<{ success: true; session: ChatSession }>(resp, '创建对话失败')
  return data.session
}

export async function fetchMyChatSessions(params: ChatSessionQueryParams = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  const resp = await fetch(`/api/chat/my-sessions?${query}`)
  return assertJsonSuccess<{ success: true; sessions: ChatSession[]; total?: number; page?: number; limit?: number }>(resp, '获取对话列表失败')
}

export async function updateChatTitle(sessionId: Id, title: string) {
  const resp = await fetch(`/api/chat/${sessionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  const data = await assertJsonSuccess<{ success: true; session: ChatSession }>(resp, '更新标题失败')
  return data.session
}

export async function deleteChat(sessionId: Id) {
  const resp = await fetch(`/api/chat/${sessionId}`, { method: 'DELETE' })
  await assertJsonSuccess(resp, '删除对话失败')
  return true
}
