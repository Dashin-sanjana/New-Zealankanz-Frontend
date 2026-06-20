import { apiRequest, unwrapCollection } from './api'
import { normalizeAd } from './ads.service'

export function getWatchlist() {
  return apiRequest('/watchlist').then((result) => unwrapCollection(result).map(normalizeAd))
}

export function addToWatchlist(adId: string) {
  return apiRequest('/watchlist', {
    method: 'POST',
    body: JSON.stringify({ adId }),
  })
}

export function removeFromWatchlist(adId: string) {
  return apiRequest(`/watchlist/${adId}`, { method: 'DELETE' })
}
