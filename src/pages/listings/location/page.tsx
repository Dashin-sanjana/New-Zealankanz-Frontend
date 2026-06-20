import { useEffect, useState } from 'react'
import { locations } from '../../../data/marketplace'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getAds } from '../../../services/ads.service'
import { getLocations } from '../../../services/marketplace.service'
import { AdGrid } from '../../../components/marketplace/ad-grid'
import { Alert, ResultSummary } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import NotFoundPage from '../../not-found/page'

export default function LocationPage({ slug }) {
  const [location, setLocation] = useState(() => locations.find((item) => item.slug === slug))
  const [loaded, setLoaded] = useState(false)
  usePageTitle(location?.name || 'Location', {
    description: `Browse marketplace listings in ${location?.name ?? 'this area'} — property, motors, jobs, and services on NewZealankans Marketplace.`,
  })
  const [ads, setAds] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    setLoaded(false)
    getLocations()
      .then((items) => {
        setLocation(items.find((item) => item.slug === slug))
        setLoaded(true)
      })
      .catch((err) => {
        setError(err.message)
        setLoaded(true)
      })
    if (slug) getAds({ location: slug }).then(setAds).catch((err) => setError(err.message))
  }, [slug])

  if (loaded && !location) return <NotFoundPage />
  if (!location) return <PageFrame title="Loading location" subtitle="Fetching location details." />

  return (
    <PageFrame title={location.name} subtitle="Approved ads available in this city or region.">
      {error && <Alert type="info" message={error} />}
      <ResultSummary count={ads.length} />
      <AdGrid ads={ads} />
    </PageFrame>
  )
}
