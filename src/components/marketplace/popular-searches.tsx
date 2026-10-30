import type { MarketplaceAd } from '../../services/ads.service'
import { Link } from '../ui/link'
import { SectionHeader } from '../ui/section-header'

export function PopularSearches({ ads }: { ads: MarketplaceAd[] }) {
  const searches = [...new Map(ads.map((ad) => [`${ad.categorySlug}:${ad.locationSlug}`, ad])).values()].slice(0, 6)
  if (!searches.length) return null
  return (
    <section className="content-section popular-searches">
      <SectionHeader title="Browse by category and city" />
      <div className="popular-grid">
        {searches.map((ad) => <Link className="popular-search-link" to={`/search?category=${encodeURIComponent(ad.categorySlug)}&location=${encodeURIComponent(ad.locationSlug)}`} key={`${ad.categorySlug}:${ad.locationSlug}`}>
          {ad.category} <span aria-hidden="true">·</span> {ad.location}
        </Link>)}
      </div>
    </section>
  )
}
