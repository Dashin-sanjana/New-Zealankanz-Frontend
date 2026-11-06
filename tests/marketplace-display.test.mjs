import test from 'node:test'
import assert from 'node:assert/strict'
import {
  formatListingPrice,
  formatPriceType,
  getPriceCurrencyNote,
  getPopularCategories,
  getPopularLocations,
  groupLocations,
  isNewZealandLocation,
  isKnownPublicSample,
  matchesPriceCurrency,
  prioritizeNewZealandListings,
} from '../src/lib/marketplace-display.mjs'

test('homepage shows preferred marketplace categories first and leaves all browsing available', () => {
  const categories = ['games', 'services', 'motor', 'property', 'jobs', 'animals'].map((slug) => ({ slug }))
  assert.deepEqual(getPopularCategories(categories).map((item) => item.slug), ['property', 'motor', 'jobs', 'services'])
  assert.deepEqual(getPopularCategories(['real-estate', 'vehicles', 'jobs', 'services', 'electronics'].map((slug) => ({ slug }))).map((item) => item.slug), ['real-estate', 'vehicles', 'jobs', 'services'])
})

test('known New Zealand cities are prioritized while other locations remain selectable', () => {
  assert.equal(isNewZealandLocation('Napier/Hastings'), true)
  const locations = [{ id: 'norway', name: 'Norway', slug: 'norway' }, { id: 'akl', name: 'Auckland', slug: 'auckland' }]
  assert.deepEqual(groupLocations(locations).map((item) => item.slug), ['auckland', 'norway'])
  assert.deepEqual(getPopularLocations(locations).map((item) => item.slug), ['auckland'])
})

test('homepage prioritization keeps international listings and stable order within each group', () => {
  const ads = [
    { id: 'world', locationSlug: 'norway' },
    { id: 'nz-one', locationSlug: 'auckland' },
    { id: 'nz-two', locationSlug: 'christchurch' },
  ]
  assert.deepEqual(prioritizeNewZealandListings(ads).map((item) => item.id), ['nz-one', 'nz-two', 'world'])
})

test('price presentation preserves source labels and never invents a currency', () => {
  assert.equal(formatListingPrice({ priceValue: 1200, priceCurrency: 'USD', demoContent: true }), 'USD 1,200')
  assert.equal(formatListingPrice({ priceValue: 1200, demoContent: true }), '1,200')
  assert.equal(getPriceCurrencyNote({ priceValue: 1200 }), 'Currency not specified')
  assert.equal(getPriceCurrencyNote({ priceValue: 1200, priceLabel: '$1,200' }), '')
  assert.equal(formatListingPrice({ priceValue: null, priceType: 'negotiable', demoContent: true }), 'Negotiable')
  assert.equal(formatListingPrice({ priceValue: null, priceType: 'no_price', demoContent: true }), 'No price')
  assert.equal(formatListingPrice({ priceValue: 1200, priceType: 'negotiable', priceLabel: 'USD 1,200', demoContent: true }), 'USD 1,200')
  assert.equal(formatPriceType('fixed_price'), 'Fixed price')
})

test('currency filters exclude listings with missing or different source currencies', () => {
  assert.equal(matchesPriceCurrency('NZD', 'nzd'), true)
  assert.equal(matchesPriceCurrency('USD', 'NZD'), false)
  assert.equal(matchesPriceCurrency(undefined, 'NZD'), false)
  assert.equal(matchesPriceCurrency(undefined, undefined), true)
})

test('public sample exclusion is limited to exact approved sample IDs and slugs', () => {
  assert.equal(isKnownPublicSample({ id: 'cmr3km2t1000p33uaam8ugr92', slug: '2018-toyota-aqua-g-hybrid' }), true)
  assert.equal(isKnownPublicSample({ id: 'another-id', slug: '2018-toyota-aqua-g-hybrid' }), false)
  assert.equal(isKnownPublicSample({ id: 'cmr3km2t1000p33uaam8ugr92', slug: 'different-listing' }), false)
  assert.equal(isKnownPublicSample({ id: 'seller-listing', slug: 'seller-listing' }), false)
})
