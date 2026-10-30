import { slugify } from '../lib/slugify'
import type { Banner, CategoryOption, LocationOption } from '../types/marketplace'
import { apiRequest, unwrapCollection } from './api'

type RecordValue = Record<string, unknown>

function asRecord(value: unknown): RecordValue {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as RecordValue : {}
}

function asText(value: unknown, fallback = ''): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback
}

function normalizeCategory(value: unknown): CategoryOption {
  const category = asRecord(value)
  const name = asText(category.name || category.title, 'Category')
  const rawChildren = category.children || category.subcategories
  const children = Array.isArray(rawChildren)
    ? rawChildren.map((child) => typeof child === 'string' ? child : normalizeCategory(child))
    : []

  return {
    id: asText(category.id || category._id || category.slug, slugify(name)),
    name,
    slug: asText(category.slug, slugify(name)),
    description: asText(category.description) || undefined,
    count: Number(category.count || category.listingCount || category.adsCount || asRecord(category._count).ads || 0),
    children,
  }
}

function normalizeLocation(value: unknown): LocationOption {
  const location = asRecord(value)
  const name = asText(location.name || location.city || location.title, 'Location')
  return {
    id: asText(location.id || location._id || location.slug, slugify(name)),
    name,
    slug: asText(location.slug, slugify(name)),
  }
}

function normalizeBanner(value: unknown): Banner {
  const banner = asRecord(value)
  return {
    id: asText(banner.id || banner._id),
    sponsor: asText(banner.sponsor || banner.businessName || banner.advertiser),
    title: asText(banner.title || banner.heading, 'Promote your local business'),
    description: asText(banner.description || banner.body || banner.text),
    imageUrl: asText(banner.imageUrl || banner.image || banner.thumbnailUrl),
    linkUrl: asText(banner.linkUrl || banner.url, '/contact'),
    placement: asText(banner.placement) || undefined,
    active: typeof banner.active === 'boolean' ? banner.active : undefined,
  }
}

export function getCategories(): Promise<CategoryOption[]> {
  return apiRequest('/categories').then((result) => unwrapCollection(result).map(normalizeCategory))
}

export function getLocations(): Promise<LocationOption[]> {
  return apiRequest('/locations').then((result) => unwrapCollection(result).map(normalizeLocation))
}

export function getBanners(placement: string): Promise<Banner[]> {
  return apiRequest(`/banners/${placement}`).then((result) => {
    const items = Array.isArray(result) ? result : unwrapCollection(result)
    return items.map(normalizeBanner)
  })
}
