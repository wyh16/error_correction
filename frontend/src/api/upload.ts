import { assertJsonSuccess, buildModelBody, createNetworkError, handleXhrJsonResult } from './client'
import type { ApiRequestBody, ApiResponseLike } from './client'

type Id = string | number
type UploadFilesResponse = Exclude<ApiResponseLike, null>
type EraseResponse = { success: true; images?: string[]; message?: string }
type OcrResponse = { success: true; pages?: unknown[]; message?: string }
type SplitResponse = {
  success: true
  run_id?: Id | null
  questions?: Array<Record<string, unknown>>
  warnings?: string[]
  message?: string
}
type ExportQuestionsResponse = { success: true; output_path?: string; download_url?: string; message?: string }
type SaveToDbResponse = { success: true; message?: string }

type UploadFilesOptions = {
  onProgress?: (progress: number) => void
  onSuccess?: (data: UploadFilesResponse) => void
  onError?: (error: unknown) => void
  onAbort?: () => void
}

export async function cancelFile(fileKey: string) {
  const resp = await fetch('/api/cancel_file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_key: fileKey }),
  })
  return assertJsonSuccess(resp, '撤销失败')
}

export async function resetUploadSession() {
  const resp = await fetch('/api/upload/reset', {
    method: 'POST',
  })
  return assertJsonSuccess(resp, '重置上传会话失败')
}

export function uploadFiles(formData: FormData, { onProgress, onSuccess, onError, onAbort }: UploadFilesOptions = {}) {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/api/upload', true)

  if (onProgress) {
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total)
    })
  }

  xhr.addEventListener('load', () => {
    let data: UploadFilesResponse | null = null
    try { data = JSON.parse(xhr.responseText) as UploadFilesResponse } catch (_) { }
    handleXhrJsonResult(xhr, data, '文件处理失败', onSuccess, onError)
  })

  xhr.addEventListener('error', () => onError?.(createNetworkError('上传失败: 网络错误', {})))
  xhr.addEventListener('abort', () => onAbort?.())

  xhr.send(formData)
  return xhr
}

export async function runErase() {
  const resp = await fetch('/api/erase', { method: 'POST' })
  return assertJsonSuccess<EraseResponse>(resp, '擦除失败')
}

export async function runOcr() {
  const resp = await fetch('/api/ocr', { method: 'POST' })
  return assertJsonSuccess<OcrResponse>(resp, 'OCR 执行失败')
}

export async function splitQuestions(modelProvider: string, modelName?: string, providerSource?: string, providerId?: Id | null) {
  const resp = await fetch('/api/split', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildModelBody(modelProvider, modelName, providerSource, providerId)),
  })
  return assertJsonSuccess<SplitResponse>(resp, '题目分割失败')
}

export async function exportQuestions(selectedIds: Id[], runId?: Id | null) {
  const body: ApiRequestBody = { selected_ids: selectedIds }
  if (runId) body.run_id = runId
  const resp = await fetch('/api/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return assertJsonSuccess<ExportQuestionsResponse>(resp, '导出失败')
}

export async function saveToDb(
  selectedIds: Id[],
  answers: Array<Record<string, unknown>> = [],
  runId?: Id | null,
  projectId?: Id | null,
  splitRecordId?: Id | null,
) {
  const body: ApiRequestBody = { selected_ids: selectedIds, answers }
  if (runId) body.run_id = runId
  if (splitRecordId) body.split_record_id = splitRecordId
  if (projectId) body.project_id = projectId
  const resp = await fetch('/api/save-to-db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return assertJsonSuccess<SaveToDbResponse>(resp, '导入错题库失败')
}

