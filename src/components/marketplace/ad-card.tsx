import { handleImageError } from '../../lib/images'
import { Link } from '../ui/link'

export function AdCard({ ad }) {
  return (
    <article className="ad-card">
      <img src={ad.image} alt={ad.title} onError={(event) => handleImageError(event, ad.title)} />
      <div className="ad-card-body">
        <div className="card-meta">
          <span>{ad.category}</span>
          <span>{ad.location}</span>
        </div>
        <h3>{ad.title}</h3>
        <p>{ad.description}</p>
        <div className="card-footer">
          <strong>{ad.price}</strong>
          <Link to={`/ads/${ad.slug}`}>View</Link>
        </div>
      </div>
      {ad.featured && <span className="featured-badge">Featured</span>}
    </article>
  )
}
