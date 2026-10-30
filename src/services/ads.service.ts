import { slugify } from '../lib/slugify'
import { fallbackImage } from '../lib/images'
import { API_ORIGIN, apiRequest, unwrapCollection } from './api'

export interface MarketplaceAd {
  id: string
  title: string
  slug: string
  category: string
  categoryId?: string
  categorySlug: string
  subcategory: string
  subcategorySlug: string
  location: string
  locationId?: string
  locationSlug: string
  price: string
  priceValue: number | null
  status: string
  featured: boolean
  image: string
  images?: Array<{ url: string }>
  description: string
  contactName: string
  contactEmail: string
  contactPhone: string
  rejectionReason?: string
  createdAt?: string
}

type RawRecord = Record<string, unknown>

function asRecord(value: unknown): RawRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as RawRecord : {}
}

function asText(value: unknown, fallback = ''): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback
}

function asPrice(value: unknown): number | null {
  if (typeof value === 'string' && value.trim() === '') return null
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value))
  })
  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

function pickName(value: unknown, fallback = '') {
  if (!value) return fallback
  if (typeof value === 'string') return value
  const record = asRecord(value)
  return asText(record.name || record.title, fallback)
}

function pickSlug(value: unknown, fallback = '') {
  if (!value) return fallback
  if (typeof value === 'string') return slugify(value)
  const record = asRecord(value)
  return asText(record.slug || record.id, slugify(pickName(value, fallback)))
}

export function normalizeAd(input: unknown): MarketplaceAd {
  const ad = asRecord(input)
  const categoryValue = asRecord(ad.category)
  const parentCategory = categoryValue.parent || null
  const category = parentCategory
    ? pickName(parentCategory, 'Marketplace')
    : pickName(ad.category, asText(ad.categoryName || ad.categorySlug, 'Marketplace'))
  const subcategory = parentCategory ? pickName(ad.category, '') : asText(ad.subcategory || ad.subcategoryName)
  const location = pickName(ad.location, asText(ad.locationName || ad.locationSlug, 'New Zealand'))
  const images = Array.isArray(ad.images) ? ad.images.map((image) => {
    const url = typeof image === 'string' ? image : asText(asRecord(image).url)
    return url ? { url: imageUrl(url) } : null
  }).filter((image): image is { url: string } => image !== null) : undefined
  const rawImage = asText(ad.image || ad.imageUrl || ad.thumbnailUrl) || images?.[0]?.url || ''
  const image = imageUrl(rawImage)
  const priceValue = asPrice(ad.price ?? ad.amount)
  const price = priceValue === null
    ? asText(ad.priceText, 'Contact seller')
    : new Intl.NumberFormat('en-NZ', {
        style: 'currency',
        currency: 'NZD',
        minimumFractionDigits: Number.isInteger(priceValue) ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(priceValue)

  return {
    id: asText(ad.id || ad._id || ad.slug || ad.title, 'listing'),
    title: asText(ad.title, 'Untitled listing'),
    slug: asText(ad.slug, slugify(asText(ad.title || ad.id || ad._id, 'listing'))),
    category,
    categoryId: asText(categoryValue.id) || undefined,
    categorySlug: asText(ad.categorySlug, parentCategory ? pickSlug(parentCategory, category) : pickSlug(ad.category, category)),
    subcategory,
    subcategorySlug: asText(ad.subcategorySlug, parentCategory ? pickSlug(ad.category, subcategory) : ''),
    location,
    locationId: asText(asRecord(ad.location).id) || undefined,
    locationSlug: asText(ad.locationSlug, pickSlug(ad.location, location)),
    price,
    priceValue,
    status: asText(ad.status, 'APPROVED'),
    featured: Boolean(ad.featured || ad.isFeatured),
    image: image || fallbackImage(asText(ad.title, 'Untitled listing')),
    images,
    description: asText(ad.description || ad.body),
    contactName: asText(ad.contactName || ad.sellerName || asRecord(ad.user).name, 'Seller'),
    contactEmail: asText(ad.contactEmail || ad.email || asRecord(ad.user).email),
    contactPhone: asText(ad.contactPhone),
    rejectionReason: asText(ad.rejectionReason) || undefined,
    createdAt: asText(ad.createdAt) || undefined,
  }
}

function imageUrl(url: string): string {
  return url.startsWith('/uploads/') ? `${API_ORIGIN}${url}` : url
}

function normalizeAds(result: unknown): MarketplaceAd[] {
  return unwrapCollection(result).map((ad: unknown) => normalizeAd(ad))
}

export function getFeaturedAds() {
  return apiRequest('/ads?featured=true').then((ads) => normalizeAds(ads).filter((ad) => ad.featured))
}

interface AdSearchFilters {
  keyword?: string
  category?: string
  subcategory?: string
  location?: string
  status?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  page?: number
  limit?: number
}

export interface AdsPage {
  ads: MarketplaceAd[]
  meta: {
    total: number
    page: number
    limit: number
    pages: number
    localFilterScope?: { complete: boolean; scanned: number; baseTotal: number }
  }
}

function metaNumber(meta: RawRecord, key: string, fallback: number) {
  const value = Number(meta[key])
  return Number.isInteger(value) && value >= 0 ? value : fallback
}

const LOCAL_FILTER_PAGE_SIZE = 100
const LOCAL_FILTER_MAX_PAGES = 20

function readPage(result: unknown, page: number, limit: number): AdsPage {
  const meta = asRecord(asRecord(result).meta)
  const ads = normalizeAds(result)
  const total = metaNumber(meta, 'total', ads.length)
  const pageLimit = Math.max(metaNumber(meta, 'limit', limit), 1)
  const pages = metaNumber(meta, 'pages', Math.ceil(total / pageLimit))
  return {
    ads,
    meta: {
      total,
      page: Math.max(metaNumber(meta, 'page', page), 1),
      limit: pageLimit,
      pages,
    },
  }
}

function applyLocalFilters(ads: MarketplaceAd[], filters: Pick<AdSearchFilters, 'minPrice' | 'maxPrice' | 'sort'>) {
  const min = filters.minPrice ? Number(filters.minPrice) : undefined
  const max = filters.maxPrice ? Number(filters.maxPrice) : undefined
  const filtered = ads.filter((ad) => {
    if ((min !== undefined || max !== undefined) && ad.priceValue === null) return false
    if (min !== undefined && ad.priceValue! < min) return false
    if (max !== undefined && ad.priceValue! > max) return false
    return true
  })

  if (filters.sort === 'price_asc' || filters.sort === 'price_desc') {
    const direction = filters.sort === 'price_asc' ? 1 : -1
    filtered.sort((a, b) => {
      if (a.priceValue === null) return b.priceValue === null ? 0 : 1
      if (b.priceValue === null) return -1
      return (a.priceValue - b.priceValue) * direction
    })
  } else if (filters.sort === 'oldest' || filters.sort === 'newest') {
    const direction = filters.sort === 'oldest' ? 1 : -1
    filtered.sort((a, b) => {
      const dateDifference = (Date.parse(a.createdAt || '') || 0) - (Date.parse(b.createdAt || '') || 0)
      return dateDifference === 0 ? a.id.localeCompare(b.id) : dateDifference * direction
    })
  }

  return filtered
}

export async function getAdsPage({ page = 1, limit = 12, ...filters }: AdSearchFilters = {}): Promise<AdsPage> {
  // The deployed legacy API rejects minPrice, maxPrice, and sort. Keep those
  // controls compatible by applying them locally after fetching base-filtered pages.
  const { minPrice, maxPrice, sort, ...serverFilters } = filters
  const usesLocalFilters = Boolean(minPrice || maxPrice || sort)

  if (!usesLocalFilters) {
    const result = await apiRequest(`/ads${buildQuery({ ...serverFilters, page, limit })}`)
    return readPage(result, page, limit)
  }

  const firstResult = await apiRequest(`/ads${buildQuery({ ...serverFilters, page: 1, limit: LOCAL_FILTER_PAGE_SIZE })}`)
  const firstPage = readPage(firstResult, 1, LOCAL_FILTER_PAGE_SIZE)
  const expectedPages = Math.max(firstPage.meta.pages, Math.ceil(firstPage.meta.total / firstPage.meta.limit), 1)
  const pagesToFetch = Math.min(expectedPages, LOCAL_FILTER_MAX_PAGES)
  const collected = [...firstPage.ads]
  let allPagesLoaded = pagesToFetch === expectedPages

  for (let start = 2; start <= pagesToFetch; start += 4) {
    const pageNumbers = Array.from({ length: Math.min(4, pagesToFetch - start + 1) }, (_, index) => start + index)
    const results = await Promise.allSettled(pageNumbers.map(async (nextPage) => {
      const result = await apiRequest(`/ads${buildQuery({ ...serverFilters, page: nextPage, limit: LOCAL_FILTER_PAGE_SIZE })}`)
      return readPage(result, nextPage, LOCAL_FILTER_PAGE_SIZE).ads
    }))
    for (const result of results) {
      if (result.status === 'fulfilled') collected.push(...result.value)
      else allPagesLoaded = false
    }
  }

  const uniqueAds = [...new Map(collected.map((ad) => [ad.id, ad])).values()]
  const filtered = applyLocalFilters(uniqueAds, { minPrice, maxPrice, sort })
  const totalPages = Math.ceil(filtered.length / limit)
  const currentPage = Math.min(page, Math.max(totalPages, 1))
  const startIndex = (currentPage - 1) * limit

  return {
    ads: filtered.slice(startIndex, startIndex + limit),
    meta: {
      total: filtered.length,
      page: currentPage,
      limit,
      pages: totalPages,
      localFilterScope: {
        complete: allPagesLoaded && uniqueAds.length >= firstPage.meta.total,
        scanned: uniqueAds.length,
        baseTotal: firstPage.meta.total,
      },
    },
  }
}

export function getAds(filters: AdSearchFilters = {}) {
  return getAdsPage(filters).then(({ ads }) => ads)
}

export function getAdBySlug(slug: string) {
  return apiRequest(`/ads/slug/${slug}`).then((ad) => (ad ? normalizeAd(ad) : null))
}

export function saveAd(formData: FormData, mode: 'create' | 'edit' = 'create', idOrSlug = '') {
  const method = mode === 'edit' ? 'PATCH' : 'POST'
  const endpoint = mode === 'edit' ? `/ads/${idOrSlug}` : '/ads'
  const price = String(formData.get('price') || '').replace(/[^0-9.]/g, '')
  if (price) formData.set('price', price)
  return apiRequest(endpoint, { method, body: formData }).then(normalizeAd)
}

export function getMyAds() {
  return apiRequest('/ads/me/list').then(normalizeAds)
}

export function deleteMyAd(id: string) {
  return apiRequest(`/ads/${id}`, { method: 'DELETE' })
}
