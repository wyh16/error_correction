/**
 * API 客户端工具测试（src/api/client.ts）。
 * 覆盖请求体构造、JSON 安全解析、成功断言与 XHR 结果分发的成功 / 失败路径。
 */
import { describe, it, expect, vi } from 'vitest'
import {
  assertJsonSuccess,
  buildModelBody,
  createNetworkError,
  handleXhrJsonResult,
  readJsonSafely,
} from '../api/client'

/** 构造一个最小的 Response 替身：只需要 ok / status / json()。 */
function fakeResponse(body: unknown, { ok = true, status = 200, invalidJson = false } = {}) {
  return {
    ok,
    status,
    json: () => (invalidJson ? Promise.reject(new Error('bad json')) : Promise.resolve(body)),
  } as unknown as Response
}

describe('buildModelBody', () => {
  it('仅必填参数时只包含 model_provider 与附加字段', () => {
    expect(buildModelBody('openai', undefined, undefined, null, { page: 1 })).toEqual({
      model_provider: 'openai',
      page: 1,
    })
  })

  it('可选参数存在时全部并入请求体', () => {
    expect(buildModelBody('openai', 'gpt-4o-mini', 'custom', 7)).toEqual({
      model_provider: 'openai',
      model_name: 'gpt-4o-mini',
      provider_source: 'custom',
      provider_id: 7,
    })
  })
})

describe('readJsonSafely', () => {
  it('正常 JSON 返回解析结果', async () => {
    await expect(readJsonSafely(fakeResponse({ success: true }))).resolves.toEqual({ success: true })
  })

  it('JSON 解析失败时返回 null 而不是抛错', async () => {
    await expect(readJsonSafely(fakeResponse(null, { invalidJson: true }))).resolves.toBeNull()
  })
})

describe('assertJsonSuccess', () => {
  it('HTTP 成功且 success=true 时返回数据', async () => {
    const data = await assertJsonSuccess(fakeResponse({ success: true, items: [1] }))
    expect(data.items).toEqual([1])
  })

  it('HTTP 错误时抛出带 status / code / quota 的 ApiError', async () => {
    const resp = fakeResponse(
      { success: false, error: '配额不足', code: 'quota_exceeded', quota: { left: 0 } },
      { ok: false, status: 429 },
    )
    const error = await assertJsonSuccess(resp).catch(e => e)
    expect(error.message).toBe('配额不足')
    expect(error.status).toBe(429)
    expect(error.code).toBe('quota_exceeded')
    expect(error.quota).toEqual({ left: 0 })
  })

  it('HTTP 成功但 success=false 时使用后端 message 抛错', async () => {
    const error = await assertJsonSuccess(fakeResponse({ success: false, message: '参数不合法' })).catch(e => e)
    expect(error.message).toBe('参数不合法')
    expect(error.status).toBe(200)
  })

  it('响应体不可解析时回退到 fallback 文案', async () => {
    const error = await assertJsonSuccess(
      fakeResponse(null, { ok: false, status: 502, invalidJson: true }),
      '服务暂不可用',
    ).catch(e => e)
    expect(error.message).toBe('服务暂不可用')
    expect(error.status).toBe(502)
  })

  it('无 fallback 且无消息时回退到 HTTP 状态码文案', async () => {
    const error = await assertJsonSuccess(fakeResponse(null, { ok: false, status: 500, invalidJson: true })).catch(e => e)
    expect(error.message).toBe('HTTP 500')
  })
})

describe('handleXhrJsonResult', () => {
  it('2xx 且 success=true 时调用 onSuccess', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    handleXhrJsonResult({ status: 200 } as XMLHttpRequest, { success: true }, '失败', onSuccess, onError)
    expect(onSuccess).toHaveBeenCalledWith({ success: true })
    expect(onError).not.toHaveBeenCalled()
  })

  it('非 2xx 时调用 onError 并携带错误详情', () => {
    const onError = vi.fn()
    handleXhrJsonResult(
      { status: 413 } as XMLHttpRequest,
      { success: false, error: '文件过大', code: 'too_large' },
      '上传失败',
      undefined,
      onError,
    )
    const error = onError.mock.calls[0][0]
    expect(error.message).toBe('文件过大')
    expect(error.status).toBe(413)
    expect(error.code).toBe('too_large')
  })

  it('2xx 但 success=false 时也走 onError 且回退 fallback 文案', () => {
    const onError = vi.fn()
    handleXhrJsonResult({ status: 200 } as XMLHttpRequest, { success: false }, '上传失败', undefined, onError)
    expect(onError.mock.calls[0][0].message).toBe('上传失败')
  })
})

describe('createNetworkError', () => {
  it('生成的错误默认字段为 null', () => {
    const error = createNetworkError('网络异常')
    expect(error.message).toBe('网络异常')
    expect(error.status).toBeNull()
    expect(error.code).toBeNull()
    expect(error.quota).toBeNull()
  })
})
