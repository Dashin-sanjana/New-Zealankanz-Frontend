import { handleImageError } from '../../lib/images'
import { Link } from '../ui/link'

export function AdCard({ ad }) {
  return (
    <article className="ad-card">
      <div className="ad-card-img-wrap">
        <img src={ad.image} alt={ad.title} onError={(event) => handleImageError(event, ad.title)} />
        {ad.featured && <span className="featured-badge">⭐ Featured</span>}
        <span className="ad-card-category-pill">{ad.category}</span>
      </div>
      <div className="ad-card-body">
        <div className="ad-card-location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          {ad.location}
        </div>
        <h3>{ad.title}</h3>
        <p>{ad.description}</p>
        <div className="card-footer">
          <strong className="ad-price">{ad.price}</strong>
          <Link to={`/ads/${ad.slug}`} className="ad-view-btn">View →</Link>
        </div>
      </div>
    </article>
  )
}
