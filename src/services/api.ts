import type { AuthSession, AuthUser } from '../types/auth'

const DEFAULT_API_BASE_URL = import.meta.env.PROD
  ? 'https://new-zealankanz-backend.onrender.com/api'
  : 'http://localhost:3000/api'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '')
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '')
const NETWORK_ERROR_MESSAGE = 'We couldn’t connect to the marketplace. Check your connection and try again.'
const SERVER_ERROR_MESSAGE = 'The marketplace is having trouble right now. Please try again shortly.'
const REQUEST_TIMEOUT_MS = 60_000

const AUTH_STORAGE_KEY = 'nzk_auth'

export class ApiError extends Error {
  status: number
  details: unknown

  constructor(message: string, status = 0, details: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') return false
  const session = value as Partial<AuthSession>
  const user = session.user as Partial<AuthUser> | undefined
  return typeof session.accessToken === 'string'
    && Boolean(user)
    && typeof user?.id === 'string'
    && typeof user.name === 'string'
    && typeof user.email === 'string'
    && typeof user.role === 'string'
    && typeof user.emailVerified === 'boolean'
}

export function getStoredAuth(): AuthSession | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!stored) return null
  try {
    const parsed: unknown = JSON.parse(stored)
    if (isAuthSession(parsed)) return parsed
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function setStoredAuth(auth: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload) return fallback
  if (typeof payload !== 'object') return fallback
  const record = payload as Record<string, unknown>
  if (Array.isArray(record.message)) return record.message.map(String).join(' ')
  if (typeof record.message === 'string') return record.message
  if (typeof record.error === 'string') return record.error
  return fallback
}

async function parseResponsePayload(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text) as unknown
  } catch {
    return { message: text }
  }
}

interface ApiRequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
}

export async function apiRequest<T = unknown>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const endpoint = path.startsWith('/') ? path : `/${path}`
  const isFormData = options.body instanceof FormData
  const auth = getStoredAuth()
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(auth?.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
    'ngrok-skip-browser-warning': 'true',
    ...options.headers,
  }

  let response
  const timeoutController = new AbortController()
  const timeoutId = window.setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT_MS)

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal || timeoutController.signal,
    })
  } catch (error) {
    throw new ApiError(timeoutController.signal.aborted ? SERVER_ERROR_MESSAGE : NETWORK_ERROR_MESSAGE, 0, error)
  } finally {
    window.clearTimeout(timeoutId)
  }

  if (response.status === 204) return null as T

  const payload = await parseResponsePayload(response)

  if (response.ok && !response.headers.get('content-type')?.toLowerCase().includes('json')) {
    throw new ApiError(SERVER_ERROR_MESSAGE, response.status, payload)
  }

  if (!response.ok) {
    const fallback = response.status >= 500
      ? SERVER_ERROR_MESSAGE
      : response.status === 401
        ? 'Please sign in to continue.'
        : response.status === 403
          ? 'You don’t have permission to do that.'
          : response.status === 404
            ? 'That listing or marketplace feature is no longer available.'
          : `Your request couldn’t be completed (status ${response.status}).`
    if (response.status >= 500 || response.status === 403 || response.status === 404 || (response.status === 401 && endpoint !== '/auth/login')) {
      throw new ApiError(fallback, response.status, payload)
    }
    throw new ApiError(getErrorMessage(payload, fallback), response.status, payload)
  }

  return payload as T
}

export function unwrapCollection(result: unknown): unknown[] {
  if (Array.isArray(result)) return result
  if (!result || typeof result !== 'object') return []
  const record = result as Record<string, unknown>
  if (Array.isArray(record.data)) return record.data
  if (Array.isArray(record.items)) return record.items
  if (Array.isArray(record.content)) return record.content
  return []
}
