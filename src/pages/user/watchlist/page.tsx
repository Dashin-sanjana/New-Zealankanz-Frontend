import { useEffect, useState } from 'react'
import { AdGrid } from '../../../components/marketplace/ad-grid'
import { Alert } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getWatchlist, isWatchlistUnavailable, removeFromWatchlist } from '../../../services/watchlist.service'
import type { MarketplaceAd } from '../../../services/ads.service'
import { Link } from '../../../components/ui/link'

export default function WatchlistPage() {
  usePageTitle('Watchlist')
  const [ads, setAds] = useState<MarketplaceAd[]>([])
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [unavailable, setUnavailable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setMessage('')
    setUnavailable(false)
    getWatchlist()
      .then((items) => {
        if (active) setAds(items)
      })
      .catch((err) => {
        if (!active) return
        if (isWatchlistUnavailable(err)) setUnavailable(true)
        else setMessage(err instanceof Error ? err.message : 'Your Watchlist could not be loaded.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [retry])

  async function handleRemove(adId: string) {
    setActionError('')
    try {
      await removeFromWatchlist(adId)
      setAds((items) => items.filter((ad) => ad.id !== adId))
    } catch (err) {
      if (isWatchlistUnavailable(err)) {
        setUnavailable(true)
        return
      }
      setActionError(err instanceof Error ? err.message : 'Could not remove this listing from your Watchlist.')
    }
  }

  return (
    <PageFrame title="Watchlist" subtitle="Listings you have saved for later.">
      {unavailable && <>
        <Alert type="info" message="Saved listings aren’t available on the current marketplace service. You can still browse all listings." onRetry={() => setRetry((value) => value + 1)} />
        <Link to="/search">Browse listings</Link>
      </>}
      {message && <Alert type="error" message={message} onRetry={() => setRetry((value) => value + 1)} />}
      {actionError && <Alert type="error" message={actionError} />}
      {loading && ads.length === 0 && !unavailable && <p role="status">Loading your watchlist…</p>}
      <AdGrid
        ads={ads}
        showEmptyState={!loading && !message && !unavailable}
        emptyMessage="Your Watchlist is empty. Save listings you like to find them here."
        onRemove={handleRemove}
      />
    </PageFrame>
  )
}
