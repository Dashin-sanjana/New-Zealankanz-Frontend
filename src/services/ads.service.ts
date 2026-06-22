import { slugify } from '../lib/slugify'
import { fallbackAds } from '../data/marketplace'
import { API_ORIGIN, apiRequest, unwrapCollection } from './api'

function buildQuery(params) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  })
  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

function pickName(value, fallback = '') {
  if (!value) return fallback
  if (typeof value === 'string') return value
  return value.name || value.title || fallback
}

function pickSlug(value, fallback = '') {
  if (!value) return fallback
  if (typeof value === 'string') return slugify(value)
  return value.slug || value.id || slugify(pickName(value, fallback))
}

export function normalizeAd(ad) {
  const parentCategory = ad.category?.parent || null
  const category = parentCategory
    ? pickName(parentCategory, 'Marketplace')
    : pickName(ad.category, ad.categoryName || ad.categorySlug || 'Marketplace')
  const subcategory = parentCategory ? pickName(ad.category, '') : ad.subcategory || ad.subcategoryName || ''
  const location = pickName(ad.location, ad.locationName || ad.locationSlug || 'New Zealand')
  const rawImage = ad.image || ad.imageUrl || ad.thumbnailUrl || ad.images?.[0]?.url || ad.images?.[0] || ''
  const image = rawImage?.startsWith('/uploads') ? `${API_ORIGIN}${rawImage}` : rawImage

  return {
    ...ad,
    id: String(ad.id || ad._id || ad.slug || ad.title),
    title: ad.title || 'Untitled listing',
    slug: ad.slug || slugify(ad.title || String(ad.id || ad._id || 'listing')),
    category,
    categorySlug: ad.categorySlug || (parentCategory ? pickSlug(parentCategory, category) : pickSlug(ad.category, category)),
    subcategory,
    subcategorySlug: ad.subcategorySlug || (parentCategory ? pickSlug(ad.category, subcategory) : slugify(subcategory)),
    location,
    locationSlug: ad.locationSlug || pickSlug(ad.location, location),
    price: ad.price ? `$${Number(ad.price).toLocaleString()}` : ad.priceText || (ad.amount ? `$${ad.amount}` : 'Contact seller'),
    status: ad.status || 'APPROVED',
    featured: Boolean(ad.featured || ad.isFeatured),
    image,
    description: ad.description || ad.body || '',
    contactName: ad.contactName || ad.sellerName || ad.user?.name || 'Seller',
    contactEmail: ad.contactEmail || ad.email || ad.user?.email || '',
  }
}

function normalizeAds(result) {
  return unwrapCollection(result).map(normalizeAd)
}

function fallbackAdItems() {
  return fallbackAds.map(normalizeAd)
}

function searchFallbackAds({ keyword, category, subcategory, location, minPrice, maxPrice } = {}) {
  const term = keyword?.trim().toLowerCase()
  const min = minPrice ? Number(minPrice) : null
  const max = maxPrice ? Number(maxPrice) : null

  return fallbackAdItems().filter((ad) => {
    const price = Number(String(ad.price).replace(/[^0-9.]/g, ''))
    if (term && !`${ad.title} ${ad.description} ${ad.category} ${ad.location}`.toLowerCase().includes(term)) return false
    if (category && ad.categorySlug !== category) return false
    if (subcategory && ad.subcategorySlug !== subcategory) return false
    if (location && ad.locationSlug !== location) return false
    if (min !== null && price && price < min) return false
    if (max !== null && price && price > max) return false
    return true
  })
}

export function getFeaturedAds() {
  return apiRequest('/ads?featured=true')
    .then((ads) => normalizeAds(ads).filter((ad) => ad.featured))
    .catch(() => fallbackAdItems().filter((ad) => ad.featured))
}

export function getAds({ keyword, category, subcategory, location, status, minPrice, maxPrice, sort } = {}) {
  const params = { keyword, category, subcategory, location, status, minPrice, maxPrice, sort }
  return apiRequest(`/ads${buildQuery(params)}`)
    .then(normalizeAds)
    .catch(() => searchFallbackAds(params))
}

export function getAdBySlug(slug) {
  return apiRequest(`/ads/slug/${slug}`)
    .then((ad) => (ad ? normalizeAd(ad) : null))
    .catch(() => fallbackAdItems().find((ad) => ad.slug === slug) || null)
}

export function saveAd(formData, mode = 'create', idOrSlug = '') {
  const method = mode === 'edit' ? 'PATCH' : 'POST'
  const endpoint = mode === 'edit' ? `/ads/${idOrSlug}` : '/ads'
  const price = String(formData.get('price') || '').replace(/[^0-9.]/g, '')
  if (price) formData.set('price', price)
  return apiRequest(endpoint, { method, body: formData }).then(normalizeAd)
}

export function getMyAds() {
  return apiRequest('/ads/me/list').then(normalizeAds)
}

export function deleteMyAd(id) {
  return apiRequest(`/ads/${id}`, { method: 'DELETE' })
}
