const preferredCategoryGroups = [
  ['property', 'real-estate'],
  ['motor', 'motors', 'vehicles'],
  ['jobs'],
  ['services'],
]

const nzLocationPriority = [
  'auckland', 'wellington', 'christchurch', 'hamilton', 'tauranga',
  'dunedin', 'queenstown', 'palmerston-north', 'napier-hastings',
  'rotorua', 'invercargill', 'whangarei', 'nelson', 'new-plymouth',
  'gisborne', 'blenheim', 'timaru', 'whanganui', 'lower-hutt',
  'upper-hutt', 'porirua', 'kapiti-coast', 'wanaka', 'taupo',
  'whakatane', 'ashburton', 'rangiora', 'rolleston', 'new-zealand',
]
const nzLocationSlugs = new Set(nzLocationPriority)

function locationKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function isNewZealandLocation(value) {
  return nzLocationSlugs.has(locationKey(value))
}

export function groupLocations(locations) {
  return [...locations].sort((a, b) => {
    const aLocal = isNewZealandLocation(a.slug || a.name)
    const bLocal = isNewZealandLocation(b.slug || b.name)
    if (aLocal !== bLocal) return aLocal ? -1 : 1
    return a.name.localeCompare(b.name, 'en-NZ')
  })
}

export function getPopularLocations(locations, limit = 8) {
  const bySlug = new Map(locations.map((location) => [locationKey(location.slug || location.name), location]))
  return nzLocationPriority.map((slug) => bySlug.get(slug)).filter(Boolean).slice(0, limit)
}

export function getPopularCategories(categories, limit = 4) {
  const bySlug = new Map(categories.map((category) => [category.slug, category]))
  const preferred = preferredCategoryGroups.map((slugs) => slugs.map((slug) => bySlug.get(slug)).find(Boolean)).filter(Boolean)
  const preferredSlugs = new Set(preferred.map((category) => category.slug))
  const remainder = categories.filter((category) => !preferredSlugs.has(category.slug))
  return [...preferred, ...remainder].slice(0, limit)
}

export function prioritizeNewZealandListings(ads) {
  return ads
    .map((ad, index) => ({ ad, index }))
    .sort((a, b) => {
      const aLocal = isNewZealandLocation(a.ad.locationSlug || a.ad.location)
      const bLocal = isNewZealandLocation(b.ad.locationSlug || b.ad.location)
      return Number(bLocal) - Number(aLocal) || a.index - b.index
    })
    .map(({ ad }) => ad)
}

const priceTypeLabels = {
  fixed: 'Fixed price',
  fixed_price: 'Fixed price',
  negotiable: 'Negotiable',
  on_call: 'Price on request',
  price_on_call: 'Price on request',
  no_price: 'No price',
  free: 'Free',
}

export function formatPriceType(value) {
  const key = String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '_')
  if (!key) return ''
  return priceTypeLabels[key] || key.replace(/_/g, ' ').replace(/^\w/, (letter) => letter.toUpperCase())
}

export function getPriceCurrencyNote({ priceValue, priceCurrency, priceLabel }) {
  if (priceValue === null || priceValue === undefined || priceCurrency) return ''
  if (/\b[A-Z]{3}\b|[$£€¥]/i.test(String(priceLabel || ''))) return ''
  return 'Currency not specified'
}

export function matchesPriceCurrency(listingCurrency, requestedCurrency) {
  if (!requestedCurrency) return true
  return String(listingCurrency || '').trim().toUpperCase() === String(requestedCurrency).trim().toUpperCase()
}

// Exact records previously identified by the project owner as unrelated sample
// data. Keep the policy scoped to stable database IDs and their matching slugs.
const PUBLIC_SAMPLE_RECORDS = new Set([
  'cmr3km3yh000r33ua8zw06pus|senior-react-native-developer',
  'cmr3km2t1000p33uaam8ugr92|2018-toyota-aqua-g-hybrid',
  'cmr3km1q4000n33uauk8q3nf3|spacious-master-bedroom-cbd',
  'cmr3km0mm000l33ua11td01yn|beautiful-3-bedroom-family-home',
])

export function isKnownPublicSample({ id, slug }) {
  return PUBLIC_SAMPLE_RECORDS.has(`${id || ''}|${slug || ''}`)
}

export function formatListingPrice({ priceValue, priceCurrency, priceType, priceLabel, demoContent }) {
  const sourceLabel = String(priceLabel || '').trim()
  if (sourceLabel) return sourceLabel
  const numericPrice = typeof priceValue === 'number' && Number.isFinite(priceValue) ? priceValue : null
  if (numericPrice === null) {
    return priceTypeLabels[String(priceType || '').toLowerCase()] || (demoContent ? 'Price unavailable' : 'Contact seller')
  }

  const currency = String(priceCurrency || '').trim().toUpperCase()
  if (!currency) {
    return new Intl.NumberFormat('en-NZ', { maximumFractionDigits: 2 }).format(numericPrice)
  }

  try {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
      minimumFractionDigits: Number.isInteger(numericPrice) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(numericPrice)
  } catch {
    const amount = new Intl.NumberFormat('en-NZ', { maximumFractionDigits: 2 }).format(numericPrice)
    return `${currency} ${amount}`
  }
}
