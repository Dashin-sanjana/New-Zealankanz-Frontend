import { useEffect, useState } from 'react'
import { Link } from '../../../components/ui/link'
import { Alert } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import { usePageTitle } from '../../../hooks/use-page-title'
import { deleteMyAd, getMyAds } from '../../../services/ads.service'

export default function MyAdsPage() {
  usePageTitle('My Ads')
  const [myAds, setMyAds] = useState([])
  const [message, setMessage] = useState('')

  function load() {
    getMyAds()
      .then((items) => {
        setMyAds(items)
        setMessage('')
      })
      .catch((error) => setMessage(error.message))
  }

  useEffect(load, [])

  async function handleDelete(ad) {
    try {
      await deleteMyAd(ad.id)
      setMessage('Ad deleted.')
      load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not delete this ad.')
    }
  }

  return (
    <PageFrame title="My ads" subtitle="Your listings show approval status and management actions.">
      {message && <Alert type="info" message={message} />}
      <div className="table-card">
        {myAds.map((ad) => (
          <div className="table-row" key={ad.id}>
            <div>
              <strong>{ad.title}</strong>
              <span>{ad.category} / {ad.location}</span>
            </div>
            <span className={`status ${ad.status.toLowerCase()}`}>{ad.status}</span>
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
