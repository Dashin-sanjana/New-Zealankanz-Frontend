import { useEffect, useState } from 'react'
import { Link } from '../../../components/ui/link'
import { Alert } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import { usePageTitle } from '../../../hooks/use-page-title'
import { deleteMyAd, getMyAds } from '../../../services/ads.service'
import type { MarketplaceAd } from '../../../services/ads.service'

export default function MyAdsPage() {
  usePageTitle('My Ads')
  const [myAds, setMyAds] = useState<MarketplaceAd[]>([])
  const [loading, setLoading] = useState(true)
  const [submittedNotice] = useState(() => new URLSearchParams(window.location.search).has('submitted'))
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info')

  function load() {
    setLoading(true)
    getMyAds()
      .then((items) => {
        setMyAds(items)
        setMessage('')
      })
      .catch((error) => {
        setMessageType('error')
        setMessage(error.message)
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleDelete(ad: MarketplaceAd) {
    try {
      await deleteMyAd(ad.id)
      setMessageType('success')
      setMessage('Ad deleted.')
      load()
    } catch (error) {
      setMessageType('error')
      setMessage(error instanceof Error ? error.message : 'Could not delete this ad.')
    }
  }

  return (
    <PageFrame title="My ads" subtitle="Your listings show approval status and management actions.">
      {submittedNotice && <Alert type="success" message="Your ad was submitted. Its current moderation status is shown below." />}
      {message && <Alert type={messageType} message={message} onRetry={messageType === 'error' ? load : undefined} />}
      {loading && <p role="status">Loading your advertisements…</p>}
      <div className="table-card">
        {!loading && !message && myAds.length === 0 && <p>You haven’t posted an ad yet. <Link to="/post-ad">Post your first ad</Link>.</p>}
        {myAds.map((ad) => (
          <div className="table-row" key={ad.id}>
            <div>
              <strong>{ad.title}</strong>
              <span>{ad.category} / {ad.location}</span>
            </div>
            <span className={`status ${ad.status.toLowerCase()}`}>{ad.status}</span>
            {ad.status === 'REJECTED' && ad.rejectionReason && <p className="hint">Review feedback: {ad.rejectionReason}</p>}
            <Link to={`/edit-ad/${ad.slug}`} className="ghost-button">
              Edit
            </Link>
            <button type="button" className="ghost-button" onClick={() => handleDelete(ad)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </PageFrame>
  )
}
