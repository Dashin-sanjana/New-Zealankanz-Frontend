import { useEffect, useState } from 'react'
import { handleImageError } from '../../../lib/images'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getAdBySlug } from '../../../services/ads.service'
import { Banner } from '../../../components/marketplace/banner'
import { Alert } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import NotFoundPage from '../../not-found/page'

export default function AdDetailPage({ slug }) {
  const [ad, setAd] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  usePageTitle(ad?.title || 'Ad Detail')

  useEffect(() => {
    setLoaded(false)
    getAdBySlug(slug)
      .then((item) => {
        setAd(item)
        setLoaded(true)
        setError('')
      })
      .catch((err) => {
        setLoaded(true)
        setError(err.message)
      })
  }, [slug])

  if (loaded && !ad && error) {
    return (
      <PageFrame title="Listing unavailable" subtitle="The listing could not be loaded.">
        <Alert type="info" message={error} />
      </PageFrame>
    )
  }
  if (loaded && !ad) return <NotFoundPage />
  if (!ad) return <PageFrame title="Loading listing" subtitle="Fetching the latest listing details." />
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: ad.title,
    description: ad.description,
    price: String(ad.price).replace(/[^0-9.]/g, '') || undefined,
    priceCurrency: 'NZD',
    availability: 'https://schema.org/InStock',
    areaServed: ad.location,
    category: ad.subcategory || ad.category,
    image: ad.image || undefined,
    seller: {
      '@type': 'Person',
      name: ad.contactName,
    },
  }

  return (
    <PageFrame title={ad.title} subtitle={`${ad.category} in ${ad.location}`}>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      {error && <Alert type="info" message={error} />}
      <div className="detail-layout">
        <div>
          <img className="detail-image" src={ad.image} alt={ad.title} onError={(event) => handleImageError(event, ad.title)} />
          <p className="detail-description">{ad.description}</p>
        </div>
        <aside className="detail-panel">
          <strong className="price">{ad.price}</strong>
          <span className="status approved">Approved</span>
          <dl>
            <dt>Category</dt>
            <dd>{ad.category}</dd>
            <dt>Location</dt>
            <dd>{ad.location}</dd>
            <dt>Contact</dt>
            <dd>{ad.contactName}</dd>
          </dl>
          <a className="primary-button full" href={`mailto:${ad.contactEmail}`}>
            Contact seller
          </a>
          <Banner placement="LISTING" compact />
        </aside>
      </div>
    </PageFrame>
  )
}
