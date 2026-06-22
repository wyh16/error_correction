/**
 * 用户资料 API。
 *
 * 头像上传保留 `XMLHttpRequest`，以支持上传进度、取消和统一回调。
 */
import { assertJsonSuccess, createNetworkError, handleXhrJsonResult } from './client'
import type { ApiError, ApiResponseLike } from './client'
import type { Id } from '@/types/domain'

type UserProfile = {
  id?: Id
  username?: string
  avatar_url?: string
  email?: string
  [key: string]: unknown
}

type UploadProfileAvatarResponse = Exclude<ApiResponseLike, null> & {
  user?: UserProfile
}

type UploadProfileAvatarOptions = {
  onSuccess?: (user: UserProfile | undefined) => void
  onError?: (error: ApiError) => void
  onAbort?: () => void
}

/** 更新当前用户的个人资料，并返回后端最新 user。 */
export async function updateProfile(profile) {
  const resp = await fetch('/api/auth/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  const data = await assertJsonSuccess<{ success: true; user: UserProfile }>(resp, '更新个人资料失败')
  return data.user
}

/** 上传用户头像，返回 XHR 以便调用方在需要时取消上传。 */
export function uploadProfileAvatar(file, { onSuccess, onError, onAbort }: UploadProfileAvatarOptions = {}) {
  const formData = new FormData()
  formData.append('file', file)

  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/api/auth/profile/avatar', true)

  xhr.addEventListener('load', () => {
    let data: UploadProfileAvatarResponse | null = null
    try { data = JSON.parse(xhr.responseText) as UploadProfileAvatarResponse } catch (_) { }
    handleXhrJsonResult(
      xhr,
      data,
      '头像上传失败',
      (payload) => onSuccess?.(payload.user),
      onError,
    )
  })

  xhr.addEventListener('error', () => onError?.(createNetworkError('头像上传失败: 网络错误', {})))
  xhr.addEventListener('abort', () => onAbort?.())

  xhr.send(formData)
  return xhr
}

/** 删除当前用户头像，并返回后端最新 user。 */
export async function deleteProfileAvatar() {
  const resp = await fetch('/api/auth/profile/avatar', {
    method: 'DELETE',
  })
  const data = await assertJsonSuccess<{ success: true; user: UserProfile }>(resp, '删除头像失败')
  return data.user
}
