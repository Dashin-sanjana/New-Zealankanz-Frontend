import { apiRequest, clearStoredAuth, setStoredAuth } from './api'

export async function registerAccount({ firstName, lastName, email, password }) {
  const name = [firstName, lastName].filter(Boolean).join(' ')
  const result = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  return result
}

export async function loginAccount({ email, password }) {
  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setStoredAuth(result)
  return result
}

export async function logoutAccount() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' })
  } finally {
    clearStoredAuth()
  }
}

export function requestPasswordReset(email) {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function resetPassword({ token, password }) {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  })
}

export function verifyEmail(token) {
  return apiRequest(`/auth/verify-email/${encodeURIComponent(token)}`)
}
