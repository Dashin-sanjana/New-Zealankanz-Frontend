export interface DisplayLocation {
  id: string
  name: string
  slug: string
}

export interface DisplayCategory {
  id: string
  name: string
  slug: string
}

export interface DisplayListing {
  location: string
  locationSlug: string
}

export function isNewZealandLocation(value: unknown): boolean
export function groupLocations<T extends DisplayLocation>(locations: T[]): T[]
export function getPopularLocations<T extends DisplayLocation>(locations: T[], limit?: number): T[]
export function getPopularCategories<T extends DisplayCategory>(categories: T[], limit?: number): T[]
export function prioritizeNewZealandListings<T extends DisplayListing>(ads: T[]): T[]
export function formatPriceType(value?: string): string
export function getPriceCurrencyNote(input: {
  priceValue: number | null
  priceCurrency?: string
  priceLabel?: string
}): string
export function matchesPriceCurrency(listingCurrency?: string | null, requestedCurrency?: string | null): boolean
export function isKnownPublicSample(input: { id?: string; slug?: string }): boolean
export function formatListingPrice(input: {
  priceValue: number | null
  priceCurrency?: string
  priceType?: string
  priceLabel?: string
  demoContent: boolean
}): string
