import { apiRequest, unwrapCollection } from './api'

export interface NotificationItem {
  id: string
  title?: string
  message?: string
  createdAt?: string
  readAt?: string | null
}

export function getCurrentUser() {
  return apiRequest('/users/me')
}

export function updateProfile({ name }: { name: string }) {
  return apiRequest('/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  })
}

export function changePassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) {
  return apiRequest('/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

export function getNotifications(): Promise<NotificationItem[]> {
  return apiRequest('/notifications').then((result) => unwrapCollection(result) as NotificationItem[])
}

export function markNotificationRead(id: string) {
  return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' })
}
