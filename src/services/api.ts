export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '')
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '')
const NETWORK_ERROR_MESSAGE = 'API service is unavailable. Please check that the backend is running and try again.'
const SERVER_ERROR_MESSAGE = 'API server error. Please try again in a moment.'

const AUTH_STORAGE_KEY = 'nzk_auth'

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export function getStoredAuth() {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function setStoredAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

function getErrorMessage(payload, fallback) {
  if (!payload) return fallback
  if (Array.isArray(payload.message)) return payload.message.join(' ')
  return payload.message || payload.error || fallback
}

async function parseResponsePayload(response) {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

export async function apiRequest(path, options = {}) {
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

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })
  } catch (error) {
    throw new ApiError(NETWORK_ERROR_MESSAGE, 0, error)
  }

  if (response.status === 204) return null

  const payload = await parseResponsePayload(response)

  if (!response.ok) {
    const fallback = response.status >= 500 ? SERVER_ERROR_MESSAGE : `API request failed with status ${response.status}`
    throw new ApiError(getErrorMessage(payload, fallback), response.status, payload)
  }

  return payload
}

export function unwrapCollection(result) {
  if (Array.isArray(result)) return result
  if (Array.isArray(result?.data)) return result.data
  if (Array.isArray(result?.items)) return result.items
  if (Array.isArray(result?.content)) return result.content
  return []
}
