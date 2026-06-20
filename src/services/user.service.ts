import { apiRequest, unwrapCollection } from './api'

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

export function getNotifications() {
  return apiRequest('/notifications').then(unwrapCollection)
}

export function markNotificationRead(id) {
  return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' })
}
