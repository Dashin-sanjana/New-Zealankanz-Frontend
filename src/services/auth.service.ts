import { apiRequest, clearStoredAuth, setStoredAuth } from './api'
import type { AuthSession } from '../types/auth'

export interface AuthMessage { message?: string }

export async function registerAccount({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }): Promise<{ demoVerificationToken?: string }> {
  const name = [firstName, lastName].filter(Boolean).join(' ')
  const result = await apiRequest<{ demoVerificationToken?: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  return result
}

export async function loginAccount({ email, password }: { email: string; password: string }): Promise<AuthSession> {
  const result = await apiRequest<AuthSession>('/auth/login', {
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

export async function requestPasswordReset(email: string): Promise<void> {
  await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function resetPassword({ token, password }: { token: string; password: string }): Promise<AuthMessage> {
  return apiRequest<AuthMessage>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  })
}

export function verifyEmail(token: string): Promise<AuthMessage> {
  return apiRequest<AuthMessage>(`/auth/verify-email/${encodeURIComponent(token)}`)
}

export function resendVerification(email: string): Promise<AuthMessage> {
  return apiRequest<AuthMessage>('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}
