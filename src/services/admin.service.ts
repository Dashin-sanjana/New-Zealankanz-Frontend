import { apiRequest, unwrapCollection } from './api'
import { normalizeAd } from './ads.service'
import type { MarketplaceAd } from './ads.service'
import type { AdminUser, Banner, CategoryOption, LocationOption } from '../types/marketplace'

type Payload = Record<string, string | number | boolean | undefined>

function normalizeRows(result: unknown): MarketplaceAd[] {
  return unwrapCollection(result).map(normalizeAd)
}

export function getAdminAds(params: Record<string, string | number | undefined> = {}): Promise<MarketplaceAd[]> {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value))
  })
  return apiRequest(`/admin/ads${query.toString() ? `?${query}` : ''}`).then(normalizeRows)
}

export function getPendingAds(): Promise<MarketplaceAd[]> {
  return apiRequest('/admin/ads/pending').then(normalizeRows)
}

export function approveAd(id: string) {
  return apiRequest(`/admin/ads/${id}/approve`, { method: 'PATCH' }).then(normalizeAd)
}

export function rejectAd(id: string, reason = '') {
  return apiRequest(`/admin/ads/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  }).then(normalizeAd)
}

export function featureAd(id: string) {
  return apiRequest(`/admin/ads/${id}/feature`, { method: 'PATCH' }).then(normalizeAd)
}

export function unfeatureAd(id: string) {
  return apiRequest(`/admin/ads/${id}/unfeature`, { method: 'PATCH' }).then(normalizeAd)
}

export function expireAd(id: string) {
  return apiRequest(`/admin/ads/${id}/expire`, { method: 'PATCH' }).then(normalizeAd)
}

export function adminUpdateAd(id: string, payload: Payload) {
  return apiRequest(`/admin/ads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteAdminAd(id: string) {
  return apiRequest(`/admin/ads/${id}`, { method: 'DELETE' })
}

export function createCategory(payload: Pick<CategoryOption, 'name'>) {
  return apiRequest('/categories/admin', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateCategory(id: string, payload: Partial<Pick<CategoryOption, 'name' | 'slug'>>) {
  return apiRequest(`/categories/admin/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
}

export function deleteCategory(id: string) {
  return apiRequest(`/categories/admin/${id}`, { method: 'DELETE' })
}

export function createLocation(payload: Pick<LocationOption, 'name'>) {
  return apiRequest('/locations/admin', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateLocation(id: string, payload: Partial<Pick<LocationOption, 'name' | 'slug'>>) {
  return apiRequest(`/locations/admin/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
}

export function deleteLocation(id: string) {
  return apiRequest(`/locations/admin/${id}`, { method: 'DELETE' })
}

export function getAdminBanners(): Promise<Banner[]> {
  return apiRequest('/banners/admin/all').then((result) => unwrapCollection(result).map((value) => {
    const item = value && typeof value === 'object' ? value as Record<string, unknown> : {}
    return {
      id: String(item.id || ''),
      title: String(item.title || ''),
      sponsor: String(item.sponsor || ''),
      description: String(item.description || ''),
      imageUrl: String(item.imageUrl || ''),
      linkUrl: String(item.linkUrl || ''),
      placement: String(item.placement || ''),
      active: Boolean(item.active),
    }
  }))
}

export function createBanner(payload: Pick<Banner, 'title' | 'imageUrl' | 'placement'> & Partial<Pick<Banner, 'sponsor' | 'description' | 'linkUrl' | 'active'>>) {
  return apiRequest('/banners/admin', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateBanner(id: string, payload: Partial<Banner> & Pick<Banner, 'title' | 'imageUrl' | 'placement'>) {
  const { sponsor, title, description, imageUrl, linkUrl, placement, active } = payload
  return apiRequest(`/banners/admin/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ sponsor, title, description, imageUrl, linkUrl, placement, active }),
  })
}

export function deleteBanner(id: string) {
  return apiRequest(`/banners/admin/${id}`, { method: 'DELETE' })
}

export function getAdminUsers(): Promise<AdminUser[]> {
  return apiRequest('/users/admin').then((result) => unwrapCollection(result).map((value) => {
    const item = value && typeof value === 'object' ? value as Record<string, unknown> : {}
    return {
      id: String(item.id || ''),
      email: String(item.email || ''),
      role: String(item.role || ''),
      active: Boolean(item.active),
    }
  }))
}

export function activateUser(id: string) {
  return apiRequest(`/users/admin/${id}/activate`, { method: 'PATCH' })
}

export function deactivateUser(id: string) {
  return apiRequest(`/users/admin/${id}/deactivate`, { method: 'PATCH' })
}
