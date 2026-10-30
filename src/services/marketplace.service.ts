import { slugify } from '../lib/slugify'
import type { Banner, CategoryOption, LocationOption } from '../types/marketplace'
import { apiRequest, unwrapCollection } from './api'

type RecordValue = Record<string, unknown>
let categoryCache: CategoryOption[] | null = null
let categoryCacheAt = 0
const CATEGORY_CACHE_TTL_MS = 60_000

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
    parentId: asText(category.parentId) || undefined,
    fields: Array.isArray(category.fields) ? category.fields.map((entry) => {
      const field = asRecord(entry)
      return {
        key: asText(field.key), label: asText(field.label),
        type: (['text', 'number', 'select', 'textarea'].includes(asText(field.type)) ? asText(field.type) : 'text') as 'text' | 'number' | 'select' | 'textarea',
        required: Boolean(field.required), filterable: Boolean(field.filterable),
        options: Array.isArray(field.options) ? field.options.filter((option): option is string => typeof option === 'string') : undefined,
        min: typeof field.min === 'number' ? field.min : undefined,
        max: typeof field.max === 'number' ? field.max : undefined,
        unit: asText(field.unit) || undefined,
      }
    }) : undefined,
    capabilities: Array.isArray(category.capabilities) ? category.capabilities.filter((value): value is string => typeof value === 'string') : undefined,
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
  if (categoryCache && Date.now() - categoryCacheAt < CATEGORY_CACHE_TTL_MS) return Promise.resolve(categoryCache)
  return apiRequest('/categories').then((result) => {
    categoryCache = unwrapCollection(result).map(normalizeCategory)
    categoryCacheAt = Date.now()
    return categoryCache
  })
}

export async function getMarketplaceCapabilities(): Promise<string[]> {
  try {
    const categories = await getCategories()
    return categories.find((category) => category.capabilities?.length)?.capabilities || []
  } catch { return [] }
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
