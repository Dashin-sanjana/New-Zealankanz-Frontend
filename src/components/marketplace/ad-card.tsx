import { handleImageError } from '../../lib/images'
import { Link } from '../ui/link'
import type { MarketplaceAd } from '../../services/ads.service'

function attributeLabel(key: string) {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/^\w/, (letter) => letter.toUpperCase())
}

export function AdCard({ ad, onRemove }: { ad: MarketplaceAd; onRemove?: () => void }) {
  const attributes = Object.entries(ad.attributes || {})
    .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value) && String(value).trim())
    .slice(0, 3)
  return (
    <article className="ad-card">
      <Link to={`/ads/${ad.slug}`} aria-label={`Open listing: ${ad.title}`} className="ad-card-link">
        <span className="ad-card-img-wrap">
          <img src={ad.image} alt="" onError={(event) => handleImageError(event, ad.title)} />
          {ad.featured && <span className="featured-badge">Featured</span>}
          <span className="ad-card-category-pill">{ad.category}</span>
        </span>
        <span className="ad-card-body">
          <span className="ad-card-title-row"><strong className="ad-card-title">{ad.title}</strong><strong className="ad-price">{ad.price}</strong></span>
          <span className="ad-card-meta">
            <span className="ad-card-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>{ad.location}
            </span>
            {ad.createdAt && Number.isFinite(Date.parse(ad.createdAt)) && <time className="ad-card-posted" dateTime={ad.createdAt}>{new Intl.DateTimeFormat('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(ad.createdAt))}</time>}
          </span>
          {attributes.length > 0 && <span className="ad-card-attributes">{attributes.map(([key, value]) => <span key={key}>{attributeLabel(key)}: {String(value)}</span>)}</span>}
        </span>
      </Link>
      {onRemove && <button type="button" className="ad-card-remove" onClick={onRemove} aria-label={`Remove ${ad.title} from saved listings`}>Remove</button>}
    </article>
  )
}
