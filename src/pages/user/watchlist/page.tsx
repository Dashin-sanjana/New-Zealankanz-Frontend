import { useEffect, useState } from 'react'
import { AdGrid } from '../../../components/marketplace/ad-grid'
import { Alert } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getWatchlist } from '../../../services/watchlist.service'

export default function WatchlistPage() {
  usePageTitle('Watchlist')
  const [ads, setAds] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    getWatchlist()
      .then((items) => {
        setAds(items)
        setMessage('')
      })
      .catch((err) => setMessage(err.message))
  }, [])

  return (
    <PageFrame title="Watchlist" subtitle="Listings you have saved for later.">
      {message && <Alert type="error" message={message} />}
      <AdGrid ads={ads} />
    </PageFrame>
  )
}
