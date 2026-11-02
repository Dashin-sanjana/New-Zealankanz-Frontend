export function nextSlideIndex(index, direction, slideCount) {
  if (slideCount < 1) return 0
  return (index + direction + slideCount) % slideCount
}

export function shouldAutoplay({ paused, reducedMotion }) {
  return !paused && !reducedMotion
}

export function shouldShowAdPreview({ explicitPreview, admin, query }) {
  return explicitPreview || admin || new URLSearchParams(query).get('previewAds') === '1'
}

export function emptyBannerState({ hasBanner, preview, loading, error, emptyMessage }) {
  if (hasBanner) return 'banner'
  if (preview && !loading) return 'preview'
  if (loading) return 'loading'
  if (error) return 'error'
  if (emptyMessage) return 'message'
  return 'hidden'
}
