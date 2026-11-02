import test from 'node:test'
import assert from 'node:assert/strict'
import { emptyBannerState, nextSlideIndex, shouldAutoplay, shouldShowAdPreview } from '../src/lib/homepage-behavior.mjs'

test('hero controls wrap in both directions', () => {
  assert.equal(nextSlideIndex(0, -1, 3), 2)
  assert.equal(nextSlideIndex(2, 1, 3), 0)
})

test('hero autoplay stops while paused or reduced motion is enabled', () => {
  assert.equal(shouldAutoplay({ paused: false, reducedMotion: false }), true)
  assert.equal(shouldAutoplay({ paused: true, reducedMotion: false }), false)
  assert.equal(shouldAutoplay({ paused: false, reducedMotion: true }), false)
})

test('ad preview appears only for explicit preview, admin, or preview query', () => {
  assert.equal(shouldShowAdPreview({ explicitPreview: false, admin: false, query: '' }), false)
  assert.equal(shouldShowAdPreview({ explicitPreview: false, admin: false, query: '?previewAds=1' }), true)
  assert.equal(shouldShowAdPreview({ explicitPreview: false, admin: false, query: '?previewAds=0' }), false)
  assert.equal(shouldShowAdPreview({ explicitPreview: true, admin: false, query: '' }), true)
  assert.equal(shouldShowAdPreview({ explicitPreview: false, admin: true, query: '' }), true)
})

test('empty visitor placements stay hidden while preview placements get a placeholder', () => {
  assert.equal(emptyBannerState({ hasBanner: false, preview: false, loading: false, error: '', emptyMessage: '' }), 'hidden')
  assert.equal(emptyBannerState({ hasBanner: false, preview: true, loading: false, error: '', emptyMessage: '' }), 'preview')
  assert.equal(emptyBannerState({ hasBanner: false, preview: false, loading: true, error: '', emptyMessage: '' }), 'loading')
  assert.equal(emptyBannerState({ hasBanner: false, preview: false, loading: false, error: '', emptyMessage: 'No ads here' }), 'message')
})
