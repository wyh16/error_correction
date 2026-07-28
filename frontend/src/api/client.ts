/**
 * API shared client helpers.
 */
export type ApiError = Error & {
  status: number | null
  code: string | null
  quota: unknown
}

export type ApiRequestBody = Record<string, unknown>

type ApiErrorDetail = {
  status?: number | null
  code?: string | null
  quota?: unknown
}

export type ApiResponseLike = ({
  success?: boolean
  error?: string
  message?: string
  code?: string | null
  quota?: unknown
} & Record<string, unknown>) | null

type XhrSuccessHandler<TData> = (data: TData) => void
type XhrErrorHandler = (error: ApiError) => void

function createApiError(message: string, { status, code, quota }: ApiErrorDetail = {}): ApiError {
  const error = new Error(message || '请求失败') as ApiError
  error.status = status ?? null
  error.code = code ?? null
  error.quota = quota ?? null
  return error
}

function getErrorMessage(data: ApiResponseLike, fallback?: string, status?: number) {
  return (data && (data.error || data.message)) || fallback || `HTTP ${status}`
}

export function buildModelBody(
  modelProvider: string,
  modelName?: string,
  providerSource?: string,
  providerId?: string | number | null,
  extra: ApiRequestBody = {},
) {
  const body: ApiRequestBody = { model_provider: modelProvider, ...extra }
  if (modelName) body.model_name = modelName
  if (providerSource) body.provider_source = providerSource
  if (providerId) body.provider_id = providerId
  return body
}

export function createNetworkError(message: string, detail: ApiErrorDetail = {}) {
  return createApiError(message, detail)
}

export async function readJsonSafely<TData = ApiResponseLike>(resp: Response): Promise<TData | null> {
  return resp.json().catch(() => null)
}

export async function assertJsonSuccess<TData extends ApiResponseLike = ApiResponseLike>(resp: Response, fallbackMessage?: string): Promise<TData> {
  const data = await readJsonSafely<TData>(resp)
  if (!resp.ok) {
    throw createApiError(getErrorMessage(data, fallbackMessage, resp.status), {
      status: resp.status,
      code: data?.code,
      quota: data?.quota,
    })
  }
  if (data && data.success) return data
  throw createApiError(getErrorMessage(data, fallbackMessage, resp.status), {
    status: resp.status,
    code: data?.code,
    quota: data?.quota,
  })
}

export function handleXhrJsonResult<TData extends ApiResponseLike = ApiResponseLike>(
  xhr: XMLHttpRequest,
  data: TData | null,
  fallbackMessage: string,
  onSuccess?: XhrSuccessHandler<TData>,
  onError?: XhrErrorHandler,
) {
  if (xhr.status >= 200 && xhr.status < 300 && data?.success) {
    onSuccess?.(data)
    return
  }
  onError?.(createApiError(getErrorMessage(data, fallbackMessage, xhr.status), {
    status: xhr.status,
    code: data?.code,
    quota: data?.quota,
  }))
}
