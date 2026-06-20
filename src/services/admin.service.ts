import { apiRequest, unwrapCollection } from './api'
import { normalizeAd } from './ads.service'

function normalizeRows(result) {
  return unwrapCollection(result).map(normalizeAd)
}

export function getAdminAds(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })
  return apiRequest(`/admin/ads${query.toString() ? `?${query}` : ''}`).then(normalizeRows)
}

export function getPendingAds() {
  return apiRequest('/admin/ads/pending').then(normalizeRows)
}

export function approveAd(id) {
  return apiRequest(`/admin/ads/${id}/approve`, { method: 'PATCH' }).then(normalizeAd)
}

export function rejectAd(id, reason = '') {
  return apiRequest(`/admin/ads/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  }).then(normalizeAd)
}

export function featureAd(id) {
  return apiRequest(`/admin/ads/${id}/feature`, { method: 'PATCH' }).then(normalizeAd)
}

export function unfeatureAd(id) {
  return apiRequest(`/admin/ads/${id}/unfeature`, { method: 'PATCH' }).then(normalizeAd)
}

export function expireAd(id) {
  return apiRequest(`/admin/ads/${id}/expire`, { method: 'PATCH' }).then(normalizeAd)
}

export function adminUpdateAd(id, payload) {
  return apiRequest(`/admin/ads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteAdminAd(id) {
  return apiRequest(`/admin/ads/${id}`, { method: 'DELETE' })
}

export function createCategory(payload) {
  return apiRequest('/categories/admin', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateCategory(id, payload) {
  return apiRequest(`/categories/admin/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
}

export function deleteCategory(id) {
  return apiRequest(`/categories/admin/${id}`, { method: 'DELETE' })
}

export function createLocation(payload) {
  return apiRequest('/locations/admin', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateLocation(id, payload) {
  return apiRequest(`/locations/admin/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
}

export function deleteLocation(id) {
  return apiRequest(`/locations/admin/${id}`, { method: 'DELETE' })
}

export function getAdminBanners() {
  return apiRequest('/banners/admin/all').then(unwrapCollection)
}

export function createBanner(payload) {
  return apiRequest('/banners/admin', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateBanner(id, payload) {
  return apiRequest(`/banners/admin/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
}

export function deleteBanner(id) {
  return apiRequest(`/banners/admin/${id}`, { method: 'DELETE' })
}

export function getAdminUsers() {
  return apiRequest('/users/admin').then(unwrapCollection)
}

export function activateUser(id) {
  return apiRequest(`/users/admin/${id}/activate`, { method: 'PATCH' })
}

export function deactivateUser(id) {
  return apiRequest(`/users/admin/${id}/deactivate`, { method: 'PATCH' })
}
