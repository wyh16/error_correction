/**
 * 笔记 API。
 *
 * `createNote()` 涉及图片上传和处理进度，因此保留 XHR；
 * 其余笔记读写接口继续使用 `fetch`。
 */
import { assertJsonSuccess, createNetworkError, handleXhrJsonResult } from './client'
import type { ApiError, ApiResponseLike } from './client'
import type { Id, NotePreview } from '@/types/domain'

type NoteResponse = {
  id?: Id
  title?: string
  subject?: string
  project_id?: Id
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

type CreateNoteResponse = Exclude<ApiResponseLike, null> & {
  note_preview?: NotePreview | null
}

type CreateNoteOptions = {
  onProgress?: (progress: number) => void
  onSuccess?: (data: CreateNoteResponse) => void
  onError?: (error: ApiError) => void
}

type FetchNotesParams = {
  page?: number | string
  limit?: number | string
  subject?: string | string[]
  knowledge_tag?: string | string[]
  keyword?: string
  project_id?: number | string
}

/** 上传笔记图片并触发 OCR/LLM 整理流程，返回 XHR 以便取消。 */
export function createNote(formData, { onProgress, onSuccess, onError }: CreateNoteOptions = {}) {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/api/notes/')
  xhr.withCredentials = true

  if (onProgress) {
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total)
    }
  }
  xhr.onload = () => {
    let data: CreateNoteResponse | null = null
    try { data = JSON.parse(xhr.responseText) as CreateNoteResponse } catch (_) { }
    handleXhrJsonResult(xhr, data, '笔记创建失败', onSuccess, onError)
  }
  xhr.onerror = () => onError?.(createNetworkError('网络错误', {}))
  xhr.send(formData)
  return xhr
}

/** 将已整理好的笔记结果保存到指定笔记本。 */
export async function saveOrganizedNote(payload) {
  const resp = await fetch('/api/notes/save-organized', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await assertJsonSuccess<{ success: true; note: NoteResponse }>(resp, '保存笔记失败')
  return data.note
}

/** 按分页、科目、知识点、关键词和项目查询笔记列表。 */
export async function fetchNotes(params: FetchNotesParams = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (Array.isArray(params.subject) ? params.subject.length : params.subject) {
    query.set('subject', Array.isArray(params.subject) ? params.subject.join(',') : params.subject)
  }
  if (Array.isArray(params.knowledge_tag) ? params.knowledge_tag.length : params.knowledge_tag) {
    query.set('knowledge_tag', Array.isArray(params.knowledge_tag) ? params.knowledge_tag.join(',') : params.knowledge_tag)
  }
  if (params.keyword) query.set('keyword', params.keyword)
  if (params.project_id) query.set('project_id', String(params.project_id))

  const resp = await fetch(`/api/notes/?${query}`)
  return assertJsonSuccess(resp, '获取笔记列表失败')
}

/** 获取单条笔记详情。 */
export async function fetchNote(noteId) {
  const resp = await fetch(`/api/notes/${noteId}`)
  const data = await assertJsonSuccess(resp, '获取笔记详情失败')
  return data.note
}

/** 更新笔记标题、内容或其他可编辑字段。 */
export async function updateNote(noteId, payload) {
  const resp = await fetch(`/api/notes/${noteId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await assertJsonSuccess(resp, '更新笔记失败')
  return data.note
}

/** 删除指定笔记。 */
export async function deleteNote(noteId) {
  const resp = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' })
  await assertJsonSuccess(resp, '删除笔记失败')
  return true
}

/** 记录笔记复习结果。 */
export async function recordNoteReview(noteId, rating = 'good') {
  const resp = await fetch(`/api/notes/${noteId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating }),
  })
  const data = await assertJsonSuccess(resp, 'record review failed')
  return data.note
}

export async function fetchNoteSubjects(projectId) {
  const qs = new URLSearchParams()
  if (projectId) qs.set('project_id', String(projectId))
  const resp = await fetch(`/api/notes/subjects?${qs}`)
  const data = await assertJsonSuccess(resp, '获取科目列表失败')
  return data.subjects
}

/** 获取笔记库中可筛选的知识点标签列表。 */
export async function fetchNoteTagNames(subject, projectId) {
  const qs = new URLSearchParams()
  if (subject) qs.set('subject', subject)
  if (projectId) qs.set('project_id', String(projectId))
  const resp = await fetch(`/api/notes/tags?${qs}`)
  const data = await assertJsonSuccess(resp, '获取标签列表失败')
  return data.tags
}

