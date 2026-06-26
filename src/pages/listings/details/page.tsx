import { useEffect, useState } from 'react'
import { handleImageError } from '../../../lib/images'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getAdBySlug } from '../../../services/ads.service'
import { addToWatchlist, removeFromWatchlist, getWatchlist } from '../../../services/watchlist.service'
import { AdSlot } from '../../../components/marketplace/ad-slot'
import { Alert } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import NotFoundPage from '../../not-found/page'

function ImageGallery({ ad }) {
  const rawImages = ad.images?.length ? ad.images : [{ url: ad.image }]
  const images = rawImages
    .map((img) => (typeof img === 'string' ? img : img?.url || ''))
    .filter(Boolean)

  const [selected, setSelected] = useState(0)
  const current = images[selected] || ''

  if (images.length <= 1) {
    return (
      <img
        className="detail-image"
        src={current}
        alt={ad.title}
        onError={(e) => handleImageError(e, ad.title)}
      />
    )
  }

  return (
    <div className="image-gallery">
      <img
        className="detail-image gallery-main"
        src={current}
        alt={`${ad.title} – image ${selected + 1} of ${images.length}`}
        onError={(e) => handleImageError(e, ad.title)}
      />
      <div className="gallery-thumbs">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className={`gallery-thumb${i === selected ? ' active' : ''}`}
            onClick={() => setSelected(i)}
            aria-label={`View image ${i + 1}`}
          >
            <img src={src} alt="" onError={(e) => handleImageError(e, '')} />
          </button>
        ))}
      </div>
    </div>
  )
}

function EnquiryForm({ ad }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('sending')
    const form = new FormData(event.currentTarget)
    const body = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      subject: `Enquiry about: ${ad.title}`,
      message: String(form.get('message') || ''),
    }
    try {
      const res = await fetch(
        (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '') + '/contact',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )
      if (!res.ok) {
        const text = await res.text()
        let msg = 'Could not send enquiry.'
        try { msg = JSON.parse(text)?.message || msg } catch {}
        throw new Error(msg)
      }
      setStatus('sent')
      ;(event.target as HTMLFormElement).reset()
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not send enquiry.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return <Alert type="success" message="Your enquiry has been sent. The seller will be in touch." />
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
      <h3>Send enquiry</h3>
      {status === 'error' && <Alert type="error" message={errorMsg} />}
      <label>
        Your name
        <input name="name" type="text" required placeholder="Full name" autoComplete="name" />
      </label>
      <label>
        Your email
        <input name="email" type="email" required placeholder="email@example.com" autoComplete="email" />
      </label>
      <label>
        Message
        <textarea name="message" required rows={4} placeholder={`Hi, I'm interested in "${ad.title}"...`} />
      </label>
      <button className="primary-button full" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

export default function AdDetailPage({ slug }) {
  const [ad, setAd] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [watchMsg, setWatchMsg] = useState('')

  const ogImage = ad?.images?.[0]?.url
    ? ad.images[0].url.startsWith('http')
      ? ad.images[0].url
      : `${window.location.origin}${ad.images[0].url}`
    : undefined

  usePageTitle(ad?.title || 'Ad Detail', {
    description: ad?.description ? ad.description.slice(0, 160) : undefined,
    image: ogImage,
    url: window.location.href,
    type: 'product',
  })

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

    getWatchlist()
      .then((items) => setSavedIds(new Set(items.map((a) => String(a.id)))))
      .catch(() => {})
  }, [slug])

  async function toggleWatchlist() {
    if (!ad) return
    const isSaved = savedIds.has(String(ad.id))
    try {
      if (isSaved) {
        await removeFromWatchlist(String(ad.id))
        setSavedIds((prev) => { const next = new Set(prev); next.delete(String(ad.id)); return next })
        setWatchMsg('Removed from watchlist.')
      } else {
        await addToWatchlist(String(ad.id))
        setSavedIds((prev) => new Set(prev).add(String(ad.id)))
        setWatchMsg('Saved to watchlist.')
      }
    } catch (err: any) {
      setWatchMsg(err.message || 'Could not update watchlist.')
    }
  }

  if (loaded && !ad && error) {
    return (
      <PageFrame title="Listing unavailable" subtitle="The listing could not be loaded.">
        <Alert type="error" message={error} />
      </PageFrame>
    )
  }
  if (loaded && !ad) return <NotFoundPage />
  if (!ad) return <PageFrame title="Loading listing" subtitle="Fetching the latest listing details." />

  const isSaved = savedIds.has(String(ad.id))

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
      {error && <Alert type="error" message={error} />}
      <div className="detail-layout">
        <div>
          <ImageGallery ad={ad} />
          <p className="detail-description">{ad.description}</p>
          <EnquiryForm ad={ad} />
        </div>
        <aside className="detail-panel">
          <strong className="price">{ad.price}</strong>
          <span className="status approved">Approved</span>
          <dl>
            <dt>Category</dt>
            <dd>{ad.category}{ad.subcategory ? ` / ${ad.subcategory}` : ''}</dd>
            <dt>Location</dt>
            <dd>{ad.location}</dd>
            <dt>Contact</dt>
            <dd>{ad.contactName}</dd>
          </dl>
          <button
            type="button"
            className={isSaved ? 'ghost-button full' : 'primary-button full'}
            onClick={toggleWatchlist}
          >
            {isSaved ? '★ Saved to watchlist' : '☆ Save to watchlist'}
          </button>
          {watchMsg && <p className="watch-msg">{watchMsg}</p>}
          <AdSlot name="LISTING_SIDEBAR" />
        </aside>
      </div>
    </PageFrame>
  )
}
