import { useEffect, useState } from 'react'
import { locations } from '../../../data/marketplace'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getAdsPage } from '../../../services/ads.service'
import type { MarketplaceAd } from '../../../services/ads.service'
import { getLocations } from '../../../services/marketplace.service'
import { AdGrid } from '../../../components/marketplace/ad-grid'
import { Alert, ResultSummary } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import NotFoundPage from '../../not-found/page'
import { navigateToPage } from '../../../lib/navigation'

interface LocationOption { id: string; name: string; slug: string }

export default function LocationPage({ slug, query }: { slug: string; query: URLSearchParams }) {
  const page = Math.max(Number.parseInt(query.get('page') || '1', 10) || 1, 1)
  const [location, setLocation] = useState<LocationOption | null>(() => locations.find((item) => item.slug === slug) || null)
  const [loaded, setLoaded] = useState(false)
  usePageTitle(location?.name || 'Location', {
    description: `Browse marketplace listings in ${location?.name ?? 'this area'} — property, motors, jobs, and services on NewZealankans Marketplace.`,
  })
  const [ads, setAds] = useState<MarketplaceAd[]>([])
  const [pageInfo, setPageInfo] = useState({ total: 0, page, limit: 12, pages: 0 })
  const [error, setError] = useState('')
  const [locationError, setLocationError] = useState('')
  const [loadingAds, setLoadingAds] = useState(true)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    setLoaded(false)
    setLoadingAds(true)
    setError('')
    setLocationError('')
    let active = true
    const localLoc = locations.find((item) => item.slug === slug)
    setLocation(localLoc || null)

    getLocations()
      .then((items) => {
        const foundLocation = items.find((item) => item.slug === slug)
        if (active) {
          setLocation(foundLocation || localLoc || null)
          setLoaded(true)
          setLocationError('')
        }
      })
      .catch((err) => {
        if (active) {
          setLocationError(err.message)
          setLoaded(true)
        }
      })
    if (slug) {
      getAdsPage({ location: slug, page })
        .then((result) => {
          if (active) {
            setAds(result.ads)
            setPageInfo(result.meta)
          }
        })
        .catch((err) => { if (active) setError(err.message) })
        .finally(() => { if (active) setLoadingAds(false) })
    }
    return () => { active = false }
  }, [slug, page, retry])

  if (loaded && !location) return <NotFoundPage />
  if (!location) return <PageFrame title="Loading location" subtitle="Fetching location details." />

  return (
    <PageFrame title={location.name} subtitle="Approved ads available in this city or region.">
      {locationError && <Alert type="info" message="Location details couldn’t be refreshed. You can still browse this location." onRetry={() => setRetry((value) => value + 1)} compact />}
      {error && <Alert type="error" message={error} onRetry={() => setRetry((value) => value + 1)} />}
      {loadingAds && ads.length === 0 && <p role="status">Loading listings…</p>}
      <ResultSummary count={pageInfo.total} failed={Boolean(error)} loading={loadingAds} />
      <AdGrid
        ads={ads}
        showEmptyState={!loadingAds && !error}
        pagination={pageInfo}
        onPageChange={(nextPage) => navigateToPage(`/location/${slug}`, query, nextPage)}
      />
    </PageFrame>
  )
}
