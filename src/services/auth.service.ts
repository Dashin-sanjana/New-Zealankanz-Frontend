import { apiRequest, clearStoredAuth, setStoredAuth } from './api'

export async function registerAccount({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }) {
  const name = [firstName, lastName].filter(Boolean).join(' ')
  const result = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  return result
}

export async function loginAccount({ email, password }: { email: string; password: string }) {
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

export function requestPasswordReset(email: string) {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function resetPassword({ token, password }: { token: string; password: string }) {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  })
}

export function verifyEmail(token: string) {
  return apiRequest(`/auth/verify-email/${encodeURIComponent(token)}`)
}

export function resendVerification(email: string) {
  return apiRequest('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}
