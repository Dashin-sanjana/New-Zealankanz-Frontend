import { apiRequest, unwrapCollection } from './api'

export function getCurrentUser() {
  return apiRequest('/users/me')
}

export function getNotifications() {
  return apiRequest('/notifications').then(unwrapCollection)
}

export function markNotificationRead(id) {
  return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' })
}
