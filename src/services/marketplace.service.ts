import { slugify } from '../lib/slugify'
import { fallbackBanners } from '../data/marketplace'
import { apiRequest, unwrapCollection } from './api'

function normalizeCategory(category) {
  const name = category.name || category.title || 'Category'
  const children = category.children || category.subcategories || []
  return {
    ...category,
    id: String(category.id || category._id || category.slug || slugify(name)),
    name,
    slug: category.slug || slugify(name),
    count: category.count || category.listingCount || category.adsCount || category._count?.ads || 0,
    children: children.map((child) => (typeof child === 'string' ? child : normalizeCategory(child))),
  }
}

function normalizeLocation(location) {
  const name = location.name || location.city || location.title || 'Location'
  return {
    ...location,
    id: String(location.id || location._id || location.slug || slugify(name)),
    name,
    slug: location.slug || slugify(name),
  }
}

function normalizeBanner(banner) {
  return {
    ...banner,
    sponsor: banner.sponsor || banner.businessName || banner.advertiser || 'Sponsored',
    title: banner.title || banner.heading || 'Promote your local business',
    description: banner.description || banner.body || banner.text || '',
    imageUrl: banner.imageUrl || banner.image || banner.thumbnailUrl || '',
    linkUrl: banner.linkUrl || banner.url || '/contact',
  }
}

export function getCategories() {
  return apiRequest('/categories').then((result) => unwrapCollection(result).map(normalizeCategory))
}

export function getLocations() {
  return apiRequest('/locations').then((result) => unwrapCollection(result).map(normalizeLocation))
}

export function getBanners(placement) {
  return apiRequest(`/banners/${placement}`)
    .then((items) => {
      const banners = Array.isArray(items) ? items : unwrapCollection(items)
      return banners.map(normalizeBanner)
    })
    .catch(() => (fallbackBanners[placement] || []).map(normalizeBanner))
}
